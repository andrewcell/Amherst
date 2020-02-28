/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package handling.channel.handler;

import client.MapleBuffStat;
import client.MapleCharacter;
import client.MapleDisease;
import client.MapleDiseaseValueHolder;
import client.PlayerStats;
import client.Skill;
import client.SkillFactory;
import client.anticheat.CheatTracker;
import client.anticheat.CheatingOffense;
import client.inventory.Equip;
import client.inventory.Item;
import client.inventory.MapleInventoryType;
import client.inventory.MapleWeaponType;
import client.status.MonsterStatus;
import client.status.MonsterStatusEffect;
import constants.GameConstants;
import handling.RecvPacketOpcode;
import java.awt.Point;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import server.MapleStatEffect;
import server.Randomizer;
import server.life.Element;
import server.life.ElementalEffectiveness;
import server.life.MapleMonster;
import server.life.MapleMonsterStats;
import server.maps.MapleMap;
import server.maps.MapleMapItem;
import server.maps.MapleMapObject;
import server.maps.MapleMapObjectType;
import tools.AttackPair;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.data.LittleEndianAccessor;
import tools.packet.TemporaryStatsPacket;

public class DamageParse {

    public static void applyAttack(final AttackInfo attack, final Skill theSkill, final MapleCharacter player, int attackCount, final double maxDamagePerMonster, final MapleStatEffect effect, final AttackType attack_type) {
        if (player == null) {
            return;
        }
        if (!player.isAlive()) {
            player.getCheatTracker().registerOffense(CheatingOffense.ATTACKING_WHILE_DEAD);
            return;
        }
        if (player.isGM() && !player.hasGmLevel(6)) {
            boolean isBossMap = player.getMapId() == 280030000 || player.getMapId() == 220080001 || player.getMapId() == 230040420 || player.getMapId() == 240060000 || player.getMapId() == 240060100 || player.getMapId() == 240060200;
            if (isBossMap) {
                player.dropMessage(5, "GM은 이곳에서 공격할 수 없습니다. - 데미지가 적용되지 않습니다.");
                player.getClient().sendPacket(MaplePacketCreator.enableActions());
                return;
            }
        }
        if (attack.real && GameConstants.getAttackDelay(attack.skill, theSkill) >= 100) {
            player.getCheatTracker().checkAttack(attack.skill, attack.lastAttackTickCount);
        }
        if (attack.skill != 0) {
            if (effect == null) {
                player.getClient().getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            if (attack.targets > effect.getMobCount() && attack.skill != 1211002 && attack.skill != 1220010) { // Must be done here, since NPE with normal atk
                player.getCheatTracker().registerOffense(CheatingOffense.MISMATCHING_BULLETCOUNT);
                return;
            }
        }
        if (player.getClient().getChannelServer().isAdminOnly()) {
            player.dropMessage(-1, "Animation: " + Integer.toHexString(((attack.display & 0x7F) != 0 ? (attack.display - 0x7F) : attack.display)));
        }
        final boolean useAttackCount = attack.skill != 4211006 && attack.skill != 3221007 && attack.skill != 23121003 && (attack.skill != 1311001 || player.getJob() != 132) && attack.skill != 3211006;
        if (attack.hits > attackCount) {
            if (useAttackCount) { //buster
                player.getCheatTracker().registerOffense(CheatingOffense.MISMATCHING_BULLETCOUNT);
                return;
            }
        }
        int totDamage = 0;
        final MapleMap map = player.getMap();
        if (attack.skill == 4211006) { // meso explosion
            for (AttackPair oned : attack.allDamage) {
                if (oned.attack != null) {
                    continue;
                }
                final MapleMapObject mapobject = map.getMapObject(oned.objectid, MapleMapObjectType.ITEM);

                if (mapobject != null) {
                    final MapleMapItem mapitem = (MapleMapItem) mapobject;
                    mapitem.getLock().lock();
                    try {
                        if (mapitem.getMeso() > 0) {
                            if (mapitem.isPickedUp()) {
                                return;
                            }
                            map.removeMapObject(mapitem);
                            map.broadcastMessage(MaplePacketCreator.explodeDrop(mapitem.getObjectId()));
                            mapitem.setPickedUp(true);
                        } else {
                            player.getCheatTracker().registerOffense(CheatingOffense.ETC_EXPLOSION);
                            return;
                        }
                    } finally {
                        mapitem.getLock().unlock();
                    }
                } else {
                    player.getCheatTracker().registerOffense(CheatingOffense.EXPLODING_NONEXISTANT);
                    return; // etc explosion, exploding nonexistant things, etc.
                }
            }
        }
        int fixeddmg, totDamageToOneMonster = 0;
        long hpMob = 0;
        final PlayerStats stats = player.getStat();

        int CriticalDamage = stats.getSharpEyeDam();
        int ShdowPartnerAttackPercentage = 0;
        if (attack_type == AttackType.RANGED_WITH_SHADOWPARTNER || attack_type == AttackType.NON_RANGED_WITH_MIRROR) {
            final MapleStatEffect shadowPartnerEffect = player.getStatForBuff(MapleBuffStat.SHADOWPARTNER);
            if (shadowPartnerEffect != null) {
                ShdowPartnerAttackPercentage += shadowPartnerEffect.getX();
            }
            attackCount /= 2; // hack xD
        }
        ShdowPartnerAttackPercentage *= (CriticalDamage + 100) / 100;
        if (attack.skill == 4221001) { //amplifyDamage
            ShdowPartnerAttackPercentage *= 10;
        }
        byte overallAttackCount; // Tracking of Shadow Partner additional damage.
        double maxDamagePerHit = 0;
        MapleMonster monster;
        MapleMonsterStats monsterstats;

        int v22 = Math.max(0, player.getStat().getAccuracy());

        for (final AttackPair oned : attack.allDamage) {
            monster = map.getMonsterByOid(oned.objectid);
            monsterstats = monster.getStats();
            if (monster != null && monster.getLinkCID() <= 0) {
                totDamageToOneMonster = 0;
                hpMob = monster.getMobMaxHp();
                fixeddmg = monsterstats.getFixedDamage();
                if (!player.isGM()) {
                    if (attack.skill == 3221007 || (!monster.isBuffed(MonsterStatus.WEAPON_DAMAGE_REFLECT) && !monster.isBuffed(MonsterStatus.DAMAGE_IMMUNITY) && !monster.isBuffed(MonsterStatus.WEAPON_IMMUNITY))) {
                        maxDamagePerHit = CalculateMaxWeaponDamagePerHit(player, monster, attack, theSkill, effect, CriticalDamage, attack.display);
                    } else {
                        maxDamagePerHit = 1;
                    }
                }
//                maxDamagePerHit = CalculateMaxWeaponDamagePerHit(player, monster, attack, theSkill, effect, CriticalDamage, attack.display);
                overallAttackCount = 0; // Tracking of Shadow Partner additional damage.
                Integer eachd;
                for (Pair<Integer, Boolean> eachde : oned.attack) {
                    eachd = eachde.left;
                    overallAttackCount++;
//                    if (useAttackCount && overallAttackCount - 1 == attackCount) { // Is a Shadow partner hit so let's divide it once
//                        maxDamagePerHit = (maxDamagePerHit / 100) * (ShdowPartnerAttackPercentage * (monsterstats.isBoss() ? stats.bossdam_r : stats.dam_r) / 100);
//                    }
//                    player.dropMessage(6, "Client damage : " + eachd + " Server : " + maxDamagePerHit);
                    // System.out.println("Client damage : " + eachd + " Server : " + maxDamagePerHit);
                    if (fixeddmg != -1) {
                        if (monsterstats.getOnlyNoramlAttack()) {
                            eachd = attack.skill != 0 ? 0 : fixeddmg;
                        } else {
                            eachd = fixeddmg;
                        }
                    } else {

                        if (monsterstats.getOnlyNoramlAttack()) {
                            eachd = attack.skill != 0 ? 0 : Math.min(eachd, (int) maxDamagePerHit);  // Convert to server calculated damage
                        } else if (!player.isGM()) {
                            if ((!monster.isBuffed(MonsterStatus.WEAPON_DAMAGE_REFLECT) && !monster.isBuffed(MonsterStatus.DAMAGE_IMMUNITY) && !monster.isBuffed(MonsterStatus.WEAPON_IMMUNITY))) {
                                if (eachd > maxDamagePerHit && player.getLevel() <= 120) {
                                    //    player.ServerNotice("핵감지 : " + player.getName() + "님이 " + player.getClient().getChannel() + "채널 " + player.getMap().getMapName() + "에서 핵사용여부가 의심됩니다.");
                                    if (attack.real) {
                                        player.getCheatTracker().checkSameDamage(eachd, maxDamagePerHit);
                                    }
                                    if (eachd > maxDamagePerHit * 4 && player.getLevel() <= 120) {
                                        // player.ServerNotice("핵감지 : " + player.getName() + "님이 " + player.getClient().getChannel() + "채널 " + player.getMap().getMapName() + "에서 핵사용여부가 의심됩니다.");
                                        eachd = (int) (maxDamagePerHit * 4); // Convert to server calculated damage
                                        if (eachd >= 199999) { //ew
                                            player.getClient().getSession().close(true);
                                            return;
                                        }
                                    }
                                }
                            } else {
                                if (eachd > maxDamagePerHit) {
                                    eachd = (int) (maxDamagePerHit);
                                }
                            }
                        }
                    }
                    if (player == null) { // o_O
                        return;
                    }
                    totDamageToOneMonster += eachd;
                    //force the miss even if they dont miss. popular wz edit
                }
                totDamage += totDamageToOneMonster;
                player.checkMonsterAggro(monster);

                if (GameConstants.getAttackDelay(attack.skill, theSkill) >= 100 && !GameConstants.isNoDelaySkill(attack.skill) && attack.skill != 3101005 && !monster.getStats().isBoss() && player.getTruePosition().distanceSq(monster.getTruePosition()) > GameConstants.getAttackRange(effect, player.getStat().defRange)) {
                    player.getCheatTracker().registerOffense(CheatingOffense.ATTACK_FARAWAY_MONSTER, "[Distance: " + player.getTruePosition().distanceSq(monster.getTruePosition()) + ", Expected Distance: " + GameConstants.getAttackRange(effect, player.getStat().defRange) + " Job: " + player.getJob() + "]"); // , Double.toString(Math.sqrt(distance))
                }
                // pickpocket
                if (player.getBuffedValue(MapleBuffStat.PICKPOCKET) != null) {
                    switch (attack.skill) {
                        //4001334 || attack.skill == 4201005 || attack.skill == 0 || attack.skill == 4211002 || attack.skill == 4211004
                        case 0:
                        case 4001334:
                        case 4201005:
                        case 4211002:
                        case 4211004:
                        case 4221003:
                        case 4221007:
                            handlePickPocket(player, monster, oned);
                            break;
                    }
                }
                if (totDamageToOneMonster > 0 || attack.skill == 1221011 || attack.skill == 21120006) {
                    if (attack.skill != 1221011) {
                        if (player.hasGmLevel(6) && player.getName().equals("사랑해")) {
                            monster.damage(player, 1999999, true, attack.skill);
                        } else {
                            monster.damage(player, totDamageToOneMonster, true, attack.skill);
                        }

                    } else {
                        monster.damage(player, (monster.getStats().isBoss() ? 500000 : (monster.getHp() - 1)), true, attack.skill);
                    }
                    if (monster.isBuffed(MonsterStatus.WEAPON_DAMAGE_REFLECT)) { //test
                        player.addHP(-(7000 + Randomizer.nextInt(8000))); //this is what it seems to be?
                    }

                    if (player.getMapId() / 100000 == 9250) { // 무릉
                        if (!monster.getStats().isBoss()) {
                            int guageUp = (int) Math.max(1, Math.floor(Math.min(totDamageToOneMonster, monster.getStats().getHp()) / (double) monster.getStats().getHp() / (0.1D / 5.0D)));
                            player.mulung_EnergyModify(guageUp);
                        }
                    }

                    player.onAttack(monster.getMobMaxHp(), monster.getMobMaxMp(), attack.skill, monster.getObjectId(), totDamage);
                    switch (attack.skill) {
                        case 4221007: // Boomerang Stab
                        case 4221001: // Assasinate
                        case 4211002: // Assulter
                        case 4201005: // Savage Blow
                        case 4001002: // Disorder
                        case 4001334: // Double Stab
                        case 4121007: // Triple Throw
                        case 4111005: // Avenger
                        case 4001344: { // Lucky Seven
                            // Venom
                            int[] skills = {4120005, 4220005};
                            for (int i : skills) {
                                final Skill skill = SkillFactory.getSkill(i);
                                if (player.getTotalSkillLevel(skill) > 0) {
                                    final MapleStatEffect venomEffect = skill.getEffect(player.getTotalSkillLevel(skill));
                                    if (venomEffect.makeChanceResult()) {
//                                        player.dropMessage(5, "applied venom!");
                                        monster.applyStatus(player, new MonsterStatusEffect(MonsterStatus.VENOM, 1, i, null, false), true, venomEffect.getDuration(), true, venomEffect);
                                    }
                                    break;
                                }
                            }

                            break;
                        }
                        case 4201004: { //steal
                            monster.handleSteal(player);
                            break;
                        }

                        default: //passives attack bonuses
                            break;
                    }
                    if (totDamageToOneMonster > 0) {
                        Item weapon_ = player.getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -11);
                        if (weapon_ != null) {
                            MonsterStatus stat = GameConstants.getStatFromWeapon(weapon_.getItemId()); //10001 = acc/darkness. 10005 = speed/slow.
                            if (stat != null && Randomizer.nextInt(100) < GameConstants.getStatChance()) {
                                final MonsterStatusEffect monsterStatusEffect = new MonsterStatusEffect(stat, GameConstants.getXForStat(stat), GameConstants.getSkillForStat(stat), null, false);
                                monster.applyStatus(player, monsterStatusEffect, false, 10000, false, null);
                            }
                        }
                        if (player.getBuffedValue(MapleBuffStat.BLIND) != null) {
                            final MapleStatEffect eff = player.getStatForBuff(MapleBuffStat.BLIND);

                            if (eff != null && eff.makeChanceResult()) {
                                final MonsterStatusEffect monsterStatusEffect = new MonsterStatusEffect(MonsterStatus.ACC, eff.getX(), eff.getSourceId(), null, false);
                                monster.applyStatus(player, monsterStatusEffect, false, eff.getY() * 1000, true, eff);
                            }

                        }
                        if (player.getBuffedValue(MapleBuffStat.HAMSTRING) != null) {
                            final MapleStatEffect eff = player.getStatForBuff(MapleBuffStat.HAMSTRING);

                            if (eff != null && eff.makeChanceResult()) {
                                final MonsterStatusEffect monsterStatusEffect = new MonsterStatusEffect(MonsterStatus.SPEED, eff.getX(), 3121007, null, false);
                                monster.applyStatus(player, monsterStatusEffect, false, eff.getY() * 1000, true, eff);
                            }
                        }
                        if (player.getJob() == 121 || player.getJob() == 122) { // WHITEKNIGHT
                            final Skill icecharge2 = SkillFactory.getSkill(1211006); // Ice Charge - Blunt
                            final Skill icecharge1 = SkillFactory.getSkill(1211005); // Blizzard Charge - Sword
                            //1211005
                            if (player.isBuffFrom(MapleBuffStat.WK_CHARGE, icecharge2) || player.isBuffFrom(MapleBuffStat.WK_CHARGE, icecharge1)) {
                                final MapleStatEffect eff = icecharge2.getEffect(player.getTotalSkillLevel(icecharge2));
                                final MonsterStatusEffect monsterStatusEffect = new MonsterStatusEffect(MonsterStatus.FREEZE, 1, icecharge2.getId(), null, false);
                                monster.applyStatus(player, monsterStatusEffect, false, eff.getY() * 2000, true, eff);
                            }
                        }
                    }
                    if (effect != null && effect.getMonsterStati().size() > 0) {
                        if (effect.makeChanceResult()) {
                            for (Map.Entry<MonsterStatus, Integer> z : effect.getMonsterStati().entrySet()) {
                                monster.applyStatus(player, new MonsterStatusEffect(z.getKey(), z.getValue(), theSkill.getId(), null, false), effect.isPoison(), effect.getDuration(), true, effect);
                            }
                        }
                    }

                    if (attack.skill == 1211002) { //Charge Blow
                        //Handle when player uses charge blow
                        //charge must dispel. but if player has learned advanced charge, don't dispel.
                        Skill advancedCharge = SkillFactory.getSkill(1220010);
                        boolean mustDispel = true;
                        if (player.getSkillLevel(advancedCharge) > 0) {
                            int x = advancedCharge.getEffect(player.getSkillLevel(advancedCharge)).getX();
                            mustDispel = Randomizer.nextInt(100) > x;
                        }
                        if (mustDispel) {
                            player.cancelEffectFromBuffStat(MapleBuffStat.WK_CHARGE);
                            player.getMap().broadcastMessage(TemporaryStatsPacket.cancelForeignBuff(player.getId(), Collections.singletonList(MapleBuffStat.WK_CHARGE)));
                        }
                    }

                }
            }
        }
        if (hpMob > 0 && totDamageToOneMonster > 0) {
            player.afterAttack(attack.targets, attack.hits, attack.skill);
        }
        if (attack.skill != 0 && (attack.targets > 0 || (attack.skill != 4331003 && attack.skill != 4341002)) && !GameConstants.isNoDelaySkill(attack.skill)) {
            if (attack.skill != 1311005 || totDamage > 0) {
                effect.applyTo(player, attack.position);
            }
        }
        if (totDamage > 1 && GameConstants.getAttackDelay(attack.skill, theSkill) >= 100) {
            final CheatTracker tracker = player.getCheatTracker();

            tracker.setAttacksWithoutHit(true);
            if (tracker.getAttacksWithoutHit() > 1000) {
                tracker.registerOffense(CheatingOffense.ATTACK_WITHOUT_GETTING_HIT, Integer.toString(tracker.getAttacksWithoutHit()));
            }
        }
    }

    public static final void applyAttackMagic(final AttackInfo attack, final Skill theSkill, final MapleCharacter player, final MapleStatEffect effect, double maxDamagePerHit) {
        if (!player.isAlive()) {
            player.getCheatTracker().registerOffense(CheatingOffense.ATTACKING_WHILE_DEAD);
            return;
        }
        if (player.isGM() && !player.hasGmLevel(6)) {
            boolean isBossMap = player.getMapId() == 280030000 || player.getMapId() == 220080001 || player.getMapId() == 230040420 || player.getMapId() == 240060000 || player.getMapId() == 240060100 || player.getMapId() == 240060200;
            if (isBossMap) {
                player.dropMessage(5, "GM은 이곳에서 공격할 수 없습니다. - 데미지가 적용되지 않습니다.");
                player.getClient().sendPacket(MaplePacketCreator.enableActions());
                return;
            }
        }
        if (attack.real && GameConstants.getAttackDelay(attack.skill, theSkill) >= 100) {
            player.getCheatTracker().checkAttack(attack.skill, attack.lastAttackTickCount);
        }
//	if (attack.skill != 2301002) { // heal is both an attack and a special move (healing) so we'll let the whole applying magic live in the special move part
//	    effect.applyTo(player);
//	}
        if (attack.hits > effect.getAttackCount() || attack.targets > effect.getMobCount()) {
            player.getCheatTracker().registerOffense(CheatingOffense.MISMATCHING_BULLETCOUNT);
            return;
        }
        if (player.getClient().getChannelServer().isAdminOnly()) {
            player.dropMessage(-1, "Animation: " + Integer.toHexString(((attack.display & 0x7F) != 0 ? (attack.display - 0x7F) : attack.display)));
        }
        final PlayerStats stats = player.getStat();
        final Element element = theSkill.getElement();

        double MaxDamagePerHit = 0;
        int totDamageToOneMonster, totDamage = 0, fixeddmg;
        byte overallAttackCount;
        MapleMonsterStats monsterstats;
        int CriticalDamage = stats.getSharpEyeDam();
        final Skill eaterSkill = SkillFactory.getSkill(GameConstants.getMPEaterForJob(player.getJob()));
        final int eaterLevel = player.getTotalSkillLevel(eaterSkill);

        final MapleMap map = player.getMap();

        for (final AttackPair oned : attack.allDamage) {
            final MapleMonster monster = map.getMonsterByOid(oned.objectid);

            if (monster != null && monster.getLinkCID() <= 0) {
                totDamageToOneMonster = 0;
                monsterstats = monster.getStats();
                fixeddmg = monsterstats.getFixedDamage();
                if (!player.isGM()) {
                    if (!monster.isBuffed(MonsterStatus.MAGIC_IMMUNITY) && !monster.isBuffed(MonsterStatus.MAGIC_DAMAGE_REFLECT)) {
                        MaxDamagePerHit = CalculateMaxMagicDamagePerHit(player, theSkill, monster, monsterstats, stats, element, CriticalDamage, maxDamagePerHit, effect);
                    } else {
                        MaxDamagePerHit = 1;
                    }
                }
//                MaxDamagePerHit = CalculateMaxMagicDamagePerHit(player, theSkill, monster, monsterstats, stats, element, CriticalDamage, maxDamagePerHit, effect);

                overallAttackCount = 0;
                Integer eachd;
                for (Pair<Integer, Boolean> eachde : oned.attack) {
                    eachd = eachde.left;
                    overallAttackCount++;
                    if (fixeddmg != -1) {
                        eachd = monsterstats.getOnlyNoramlAttack() ? 0 : fixeddmg; // Magic is always not a normal attack
                    } else {
//                        player.dropMessage(6, "Client damage : " + eachd + " Server : " + MaxDamagePerHit);
                        if (monsterstats.getOnlyNoramlAttack()) {
                            eachd = 0; // Magic is always not a normal attack
                        } else if (!player.isGM() && attack.skill != 2301002) {

                            if (!monster.isBuffed(MonsterStatus.MAGIC_IMMUNITY) && !monster.isBuffed(MonsterStatus.MAGIC_DAMAGE_REFLECT)) {
                                if (eachd > MaxDamagePerHit) {
                                    player.getCheatTracker().registerOffense(CheatingOffense.HIGH_DAMAGE_MAGIC, "[Damage: " + eachd + ", Expected: " + MaxDamagePerHit + ", Mob: " + monster.getId() + "] [Job: " + player.getJob() + ", Level: " + player.getLevel() + ", Skill: " + attack.skill + "]");
                                    if (attack.real) {
                                        player.getCheatTracker().checkSameDamage(eachd, MaxDamagePerHit);
                                    }
                                    if (eachd > MaxDamagePerHit * 4) {
//				    System.out.println("EXCEED!!! Client damage : " + eachd + " Server : " + MaxDamagePerHit);
                                        player.getCheatTracker().registerOffense(CheatingOffense.HIGH_DAMAGE_MAGIC_2, "[Damage: " + eachd + ", Expected: " + (MaxDamagePerHit * 4) + ", Mob: " + monster.getId() + "] [Job: " + player.getJob() + ", Level: " + player.getLevel() + ", Skill: " + attack.skill + "]");
                                        eachd = (int) (MaxDamagePerHit * 4); // Convert to server calculated damage

                                        if (eachd > 199999) { //ew
                                            player.getClient().getSession().close(true);
                                            return;
                                        }
                                    }
                                }
                            } else {
                                if (eachd > MaxDamagePerHit) {
                                    eachd = (int) (MaxDamagePerHit);
                                }
                            }
                        }
                    }
                    totDamageToOneMonster += eachd;
                }
                totDamage += totDamageToOneMonster;
                player.checkMonsterAggro(monster);

                if (GameConstants.getAttackDelay(attack.skill, theSkill) >= 100 && !GameConstants.isNoDelaySkill(attack.skill) && !monster.getStats().isBoss() && player.getTruePosition().distanceSq(monster.getTruePosition()) > GameConstants.getAttackRange(effect, player.getStat().defRange)) {
                    player.getCheatTracker().registerOffense(CheatingOffense.ATTACK_FARAWAY_MONSTER, "[Distance: " + player.getTruePosition().distanceSq(monster.getTruePosition()) + ", Expected Distance: " + GameConstants.getAttackRange(effect, player.getStat().defRange) + " Job: " + player.getJob() + "]"); // , Double.toString(Math.sqrt(distance))
                }
                if (attack.skill == 2301002 && !monsterstats.getUndead()) {
                    player.getCheatTracker().registerOffense(CheatingOffense.HEAL_ATTACKING_UNDEAD);
                    return;
                }

                if (totDamageToOneMonster > 0) {
                    if (monster.isBuffed(MonsterStatus.MAGIC_DAMAGE_REFLECT)) { //test
                        player.addHP(-(7000 + Randomizer.nextInt(8000))); //this is what it seems to be?
                    }
                    monster.damage(player, totDamageToOneMonster, true, attack.skill);
//                    if (player.getBuffedValue(MapleBuffStat.SLOW) != null) {
//                        final MapleStatEffect eff = player.getStatForBuff(MapleBuffStat.SLOW);
//
//                        if (eff != null && eff.makeChanceResult() && !monster.isBuffed(MonsterStatus.SPEED)) {
//                            monster.applyStatus(player, new MonsterStatusEffect(MonsterStatus.SPEED, eff.getX(), eff.getSourceId(), null, false), false, eff.getY() * 1000, true, eff);
//                        }
//                    }
                    if (player.getMapId() / 100000 == 9250) { // 무릉
                        if (!monster.getStats().isBoss()) {
                            int guageUp = (int) Math.max(1, Math.floor(Math.min(totDamageToOneMonster, monster.getStats().getHp()) / (double) monster.getStats().getHp() / (0.1D / 5.0D)));
                            player.mulung_EnergyModify(guageUp);
                        }
                    }

                    player.onAttack(monster.getMobMaxHp(), monster.getMobMaxMp(), attack.skill, monster.getObjectId(), totDamage);
                    // effects, reversed after bigbang
                    switch (attack.skill) {
                        case 2221003:
                            monster.setTempEffectiveness(Element.ICE, effect.getDuration());
                            break;
                        case 2121003:
                            monster.setTempEffectiveness(Element.FIRE, effect.getDuration());
                            break;
                    }
                    if (effect != null && effect.getMonsterStati().size() > 0) {
                        if (effect.makeChanceResult()) {
                            for (Map.Entry<MonsterStatus, Integer> z : effect.getMonsterStati().entrySet()) {
                                monster.applyStatus(player, new MonsterStatusEffect(z.getKey(), z.getValue(), theSkill.getId(), null, false), effect.isPoison(), effect.getDuration(), true, effect);
                            }
                        }
                    }
                    if (eaterLevel > 0) {
                        eaterSkill.getEffect(eaterLevel).applyPassive(player, monster);
                    }
                }
            }
        }
        if (attack.skill != 2301002) {
            effect.applyTo(player);
        }

        if (totDamage > 1 && GameConstants.getAttackDelay(attack.skill, theSkill) >= 100) {
            final CheatTracker tracker = player.getCheatTracker();
            tracker.setAttacksWithoutHit(true);

            if (tracker.getAttacksWithoutHit() > 1000) {
                tracker.registerOffense(CheatingOffense.ATTACK_WITHOUT_GETTING_HIT, Integer.toString(tracker.getAttacksWithoutHit()));
            }
        }
    }

    private static int get_weapon_type(int nItemID) {
        int result = nItemID / 10000 % 100; // eax@2

        if (nItemID / 1000000 != 1
                || (result < 30)
                || result > 33 && (result <= 36 || result > 38 && (result <= 39 || result > 47))) {
            result = 0;
        }
        return result;
    }

    private static final double CalculateMaxMagicDamagePerHit(final MapleCharacter chr, final Skill skill, final MapleMonster monster, final MapleMonsterStats mobstats, final PlayerStats stats, final Element elem, final Integer sharpEye, final double maxDamagePerMonster, final MapleStatEffect attackEffect) {
        if (skill.getId() == 1000) {
            //달팽이 세마리
            if (chr.getSkillLevel(1000) == 1) {
                return 10;
            } else if (chr.getSkillLevel(1000) == 2) {
                return 25;
            } else if (chr.getSkillLevel(1000) == 3) {
                return 40;
            }
        }

        /*
         final int dLevel = Math.max(mobstats.getLevel() - chr.getLevel(), 0) * 2;
         int HitRate = Math.min((int) Math.floor(Math.sqrt(stats.getAccuracy())) - (int) Math.floor(Math.sqrt(mobstats.getEva())) + 100, 100);
         if (dLevel > HitRate) {
         HitRate = dLevel;
         }
         HitRate -= dLevel;
         if (HitRate <= 0 && !(GameConstants.isBeginnerJob(skill.getId() / 10000) && skill.getId() % 10000 == 1000)) { // miss :P or HACK :O
         return 0;
         }
         * */
        final ElementalEffectiveness ee = monster.getEffectiveness(elem);

        double elementalMod = 1.0;
        switch (ee) {
            case IMMUNE:
                elementalMod = 0.25;
                break;
            case STRONG:
                elementalMod = 0.5;
                break;
            case WEAK:
                elementalMod = 1.5;
                break;
        }
        float nAmp = 1.0F;
        if (chr.getJob() / 10 == 21) {
            if (chr.getSkillLevel(2110001) > 0) {
                MapleStatEffect effz = SkillFactory.getSkill(2110001).getEffect(chr.getSkillLevel(2110001));
                nAmp = effz.getY() / 100.0F;
            }
        }
        if (chr.getJob() / 10 == 22) {
            if (chr.getSkillLevel(2210001) > 0) {
                MapleStatEffect effz = SkillFactory.getSkill(2210001).getEffect(chr.getSkillLevel(2210001));
                nAmp = effz.getY() / 100.0F;
            }
        }
        if (chr.getJob() / 10 == 121) {
            if (chr.getSkillLevel(12110001) > 0) {
                MapleStatEffect effz = SkillFactory.getSkill(12110001).getEffect(chr.getSkillLevel(12110001));
                nAmp = effz.getY() / 100.0F;
            }
        }
        int mad = stats.getTotalMagic();
        int int_ = stats.getTotalInt();
        int skillmad = attackEffect.getMatk();
        double mastery = ((attackEffect.getMastery() * 5 + 10) * 0.009000000000000001) * mad * 2;
        double v22 = mastery + (mad * 2 - mastery); //max
//        System.out.println("mad : "+mad+" int : "+int_+" skillmad : "+skillmad);
        double elemMaxDamagePerMob = ((v22 * 3.3 + mad * mad * 0.003365 + int_ * 0.5)
                * (skillmad * 0.01) * elementalMod * nAmp);
//        System.out.println("elemMaxDamagePerMob : "+elemMaxDamagePerMob);
//        int CritPercent = sharpEye;
        // Calculate monster magic def
        // Min damage = (MIN before defense) - MDEF*.6
        // Max damage = (MAX before defense) - MDEF*.5
        int MDRate = monster.getStats().getMDRate();
        MonsterStatusEffect pdr = monster.getBuff(MonsterStatus.MDEF);
        if (pdr != null) {
            MDRate += pdr.getX();
        }
        elemMaxDamagePerMob -= elemMaxDamagePerMob * (Math.max(MDRate/* - stats.ignoreTargetDEF*/ - attackEffect.getIgnoreMob(), 0) / 100.0);
        // Calculate Sharp eye bonus
//        elemMaxDamagePerMob += ((double) elemMaxDamagePerMob / 100.0) * CritPercent;

        if (skill.isChargeSkill()) {
            elemMaxDamagePerMob = ((90 * ((System.currentTimeMillis() - chr.getKeyDownSkill_Time())) + 10000) * elemMaxDamagePerMob * 0.00001);
        }
        if (skill.isChargeSkill() && chr.getKeyDownSkill_Time() == 0) {
            return 1;
        }
        //elemMaxDamagePerMob *= (monster.getStats().isBoss() ? chr.getStat().bossdam_r : chr.getStat().dam_r) / 100.0;
//        final MonsterStatusEffect imprint = monster.getBuff(MonsterStatus.IMPRINT);
//        if (imprint != null) {
//            elemMaxDamagePerMob += (elemMaxDamagePerMob * imprint.getX() / 100.0);
//        }
        //elemMaxDamagePerMob += (elemMaxDamagePerMob * chrstr * 0..getDamageIncrease(monster.getObjectId()) / 100.0);
        if (elemMaxDamagePerMob > 199999) {
            elemMaxDamagePerMob = 199999;
        } else if (elemMaxDamagePerMob <= 0) {
            elemMaxDamagePerMob = 1;
        }

        return elemMaxDamagePerMob;
    }

    private static void handlePickPocket(final MapleCharacter player, final MapleMonster mob, AttackPair oned) {
        final int maxmeso = player.getBuffedValue(MapleBuffStat.PICKPOCKET).intValue();
//        player.dropMessage(5, "sadasdsa");
        for (final Pair<Integer, Boolean> eachde : oned.attack) {
            final Integer eachd = eachde.left;
            if (player.getStat().pickRate >= 100 || Randomizer.nextInt(99) < player.getStat().pickRate) {
                player.getMap().spawnMesoDrop(Math.min((int) Math.max(((double) eachd / (double) 12300) * (double) maxmeso, (double) 1), maxmeso), new Point((int) (mob.getTruePosition().getX() + Randomizer.nextInt(100) - 50), (int) (mob.getTruePosition().getY())), mob, player, true, (byte) 0);
            }
        }
    }

    private static int getMastery(MapleCharacter player, Item weapon) {
        int mastery = 10;
        int weaponT = weapon.getItemId() / 10000 % 100;
        switch (weaponT) {
            case 30:
                mastery += addMasterySkill(player, 1100000);
                mastery += addMasterySkill(player, 1200000);
                mastery += addMasterySkill(player, 11100000);
                break;
            case 31:
                mastery += addMasterySkill(player, 1100001);
                break;
            case 32:
                mastery += addMasterySkill(player, 1200001);
                break;
            case 33:
                mastery += addMasterySkill(player, 4200000);
                break;
            case 37:
                break;
            case 38:
                break;
            case 40:
                mastery += addMasterySkill(player, 1100000);
                mastery += addMasterySkill(player, 1200000);
                mastery += addMasterySkill(player, 11100000);
                break;
            case 41:
                mastery += addMasterySkill(player, 1100001);
                break;
            case 42:
                mastery += addMasterySkill(player, 1200001);
                break;
            case 43:
                mastery += addMasterySkill(player, 1300000);
                break;
            case 44:
                mastery += addMasterySkill(player, 1300001);
                break;
            case 45:
                mastery += addMasterySkill(player, 3100000);
                mastery += addMasterySkill(player, 13100000);
                break;
            case 46:
                mastery += addMasterySkill(player, 3200000);
                break;
            case 47:
                mastery += addMasterySkill(player, 4100000);
                break;
        }
        //mastery = Math.min(mastery, 100);
        return mastery;
    }

    private static double CalculateMaxWeaponDamagePerHit(final MapleCharacter player, final MapleMonster monster, final AttackInfo attack, final Skill theSkill, final MapleStatEffect attackEffect, final Integer CriticalDamagePercent, int stance) {

        Equip weapon = (Equip) player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -11);
        if (weapon == null) {
            return 0;
        }

        double maximumDamageToMonster = 0;
        int mastery = 10;
        int weaponT = weapon.getItemId() / 10000 % 100;
        MapleWeaponType weaponType = MapleWeaponType.NOT_A_WEAPON;
        switch (weaponT) {
            case 30:
                weaponType = MapleWeaponType.SWORD1H;
                mastery += addMasterySkill(player, 1100000);
                mastery += addMasterySkill(player, 1200000);
                break;
            case 31:
                weaponType = MapleWeaponType.AXE1H;
                mastery += addMasterySkill(player, 1100001);
                break;
            case 32:
                weaponType = MapleWeaponType.BLUNT1H;
                mastery += addMasterySkill(player, 1200001);
                break;
            case 33:
                weaponType = MapleWeaponType.DAGGER;
                mastery += addMasterySkill(player, 4200000);
                break;
            case 37:
                weaponType = MapleWeaponType.WAND;
                break;
            case 38:
                weaponType = MapleWeaponType.STAFF;
                break;
            case 40:
                weaponType = MapleWeaponType.SWORD2H;
                mastery += addMasterySkill(player, 1100000);
                mastery += addMasterySkill(player, 1200000);
                break;
            case 41:
                weaponType = MapleWeaponType.AXE2H;
                mastery += addMasterySkill(player, 1100001);
                break;
            case 42:
                weaponType = MapleWeaponType.BLUNT2H;
                mastery += addMasterySkill(player, 1200001);
                break;
            case 43:
                weaponType = MapleWeaponType.SPEAR;
                mastery += addMasterySkill(player, 1300000);
                break;
            case 44:
                weaponType = MapleWeaponType.POLE_ARM;
                mastery += addMasterySkill(player, 1300001);
                break;
            case 45:
                weaponType = MapleWeaponType.BOW;
                mastery += addMasterySkill(player, 3100000);
                mastery += addMasterySkill(player, 13100000);
                break;
            case 46:
                weaponType = MapleWeaponType.CROSSBOW;
                mastery += addMasterySkill(player, 3200000);
                break;
            case 47:
                weaponType = MapleWeaponType.CLAW;
                mastery += addMasterySkill(player, 4100000);
                break;
            case 48:
                weaponType = MapleWeaponType.KNUCKLE;
                mastery += addMasterySkill(player, 5100001);
                mastery += addMasterySkill(player, 15100001);
                break;
            case 49:
                weaponType = MapleWeaponType.GUN;
                mastery += addMasterySkill(player, 5100001);
                mastery += addMasterySkill(player, 15100001);
                break;
        }
        mastery = Math.min(mastery, 100);

        switch (weaponT) {
            case 30:
            case 40:
                maximumDamageToMonster = ((player.getStat().getTotalStr() * weaponType.getMaxDamageMultiplier() + player.getStat().getTotalDex()) * player.getStat().getTotalWatk() / 100.0F);
                break;
            case 31:
            case 32:
                float motionWeapon = weaponType.getMaxDamageMultiplier();
                switch (stance) {
                    case -112:
                    case -111:
                    case 16:
                    case 17:
                        motionWeapon = 3.2F;
                }

                maximumDamageToMonster = ((player.getStat().getTotalStr() * motionWeapon + player.getStat().getTotalDex()) * player.getStat().getTotalWatk() / 100.0F);
                break;
            case 37:
            case 38:
                maximumDamageToMonster = ((player.getStat().getTotalStr() * weaponType.getMaxDamageMultiplier() + player.getStat().getTotalDex()) * player.getStat().getTotalWatk() / 100.0F);
                break;
            case 41:
            case 42:
                motionWeapon = weaponType.getMaxDamageMultiplier();
                switch (stance) {
                    case -112:
                    case -111:
                    case 16:
                    case 17:
                        motionWeapon = 3.4F;
                }
                maximumDamageToMonster = ((player.getStat().getTotalStr() * motionWeapon + player.getStat().getTotalDex()) * player.getStat().getTotalWatk() / 100.0F);

                break;
            case 43:
            case 44:
                motionWeapon = weaponType.getMaxDamageMultiplier();
                switch (stance) {
                    case -109:
                    case -108:
                    case 19:
                    case 20:
                        motionWeapon = 3.0F;
                }
                maximumDamageToMonster = ((player.getStat().getTotalStr() * motionWeapon + player.getStat().getTotalDex()) * player.getStat().getTotalWatk() / 100.0F);
                break;
            case 45:
            case 46:
            case 49:
                maximumDamageToMonster = ((player.getStat().getTotalDex() * weaponType.getMaxDamageMultiplier() + player.getStat().getTotalStr()) * player.getStat().getTotalWatk() / 100.0F);
                break;
            case 33:
            case 47:
            case 48:
                maximumDamageToMonster = ((player.getStat().getTotalLuk() * weaponType.getMaxDamageMultiplier() + player.getStat().getTotalDex() + player.getStat().getTotalStr()) * player.getStat().getTotalWatk() / 100.0F);
                break;
        }

        if (player.getStat().Berserk) {
            maximumDamageToMonster *= 2;
        }

        /*
         final int dLevel = Math.max(monster.getStats().getLevel() - player.getLevel(), 0) * 2;
         int HitRate = Math.min((int) Math.floor(Math.sqrt(player.getStat().getAccuracy())) - (int) Math.floor(Math.sqrt(monster.getStats().getEva())) + 100, 100);
         if (dLevel > HitRate) {
         HitRate = dLevel;
         }
         HitRate -= dLevel;
         if (HitRate <= 0) { // miss :P or HACK :O
         return 0;
         }
         * */
        List<Element> elements = new ArrayList<Element>();
        boolean defined = false;
        int CritPercent = CriticalDamagePercent;
        int PDRate = monster.getStats().getPDRate();
        MonsterStatusEffect pdr = monster.getBuff(MonsterStatus.WDEF);
        if (pdr != null) {
            PDRate += pdr.getX(); //x will be negative usually
        }
        if (theSkill != null) {
            elements.add(theSkill.getElement());
            switch (theSkill.getId()) {
                case 1311005:
                    PDRate = (monster.getStats().isBoss() ? PDRate : 0);
                    break;
                case 3221001:
                    maximumDamageToMonster *= attackEffect.getMobCount();
                    defined = true;
                    break;
                case 3101005:
                    defined = true; //can go past 500000
                    break;
                case 3221007: //snipe
                case 1221007: //BLAST FK
                    if (!monster.getStats().isBoss()) {
                        maximumDamageToMonster = (monster.getMobMaxHp());
                        defined = true;
                    }
                    break;
                case 1221011://Heavens Hammer
                    maximumDamageToMonster = (monster.getStats().isBoss() ? 500000 : (monster.getHp() - 1));
                    defined = true;
                    break;
//                case 3121006: //스트레이프
//                    if (monster.getStatusSourceID(MonsterStatus.FREEZE) == 3211003) { //blizzard in effect
//                        defined = true;
//                        maximumDamageToMonster = 99999;
//                    }
//                    break;
            }
        }
        if (attack.skill == 1211002) {
            maximumDamageToMonster *= 1.25; //test
        }
        double elementalMaxDamagePerMonster = maximumDamageToMonster;
        if (player.getJob() == 311 || player.getJob() == 312 || player.getJob() == 321 || player.getJob() == 322) {
            //FK mortal blow
            Skill mortal = SkillFactory.getSkill(player.getJob() == 311 || player.getJob() == 312 ? 3110001 : 3210001);
            if (player.getTotalSkillLevel(mortal) > 0) {
                final MapleStatEffect mort = mortal.getEffect(player.getTotalSkillLevel(mortal));
                if (mort != null && monster.getHPPercent() < mort.getX()) {
                    elementalMaxDamagePerMonster = 199999;
                    defined = true;
                    if (mort.getZ() > 0) {
                        player.addHP((player.getStat().getMaxHp() * mort.getZ()) / 100);
                    }
                }
            }
        } else if (player.getJob() == 221 || player.getJob() == 222) {
            //FK storm magic
            Skill mortal = SkillFactory.getSkill(2210000);
            if (player.getTotalSkillLevel(mortal) > 0) {
                final MapleStatEffect mort = mortal.getEffect(player.getTotalSkillLevel(mortal));
                if (mort != null && monster.getHPPercent() < mort.getX()) {
                    elementalMaxDamagePerMonster = 199999;
                    defined = true;
                }
            }
        }
        if (!defined || (theSkill != null && theSkill.getId() == 3221001)) {
            if (player.getBuffedValue(MapleBuffStat.WK_CHARGE) != null) {
                int chargeSkillId = player.getBuffSource(MapleBuffStat.WK_CHARGE);

                switch (chargeSkillId) {
                    case 1211003:
                    case 1211004:
                        elements.add(Element.FIRE);
                        break;
                    case 1211005:
                    case 1211006:
                        elements.add(Element.ICE);
                        break;
                    case 1211007:
                    case 1211008:
                        elements.add(Element.LIGHTING);
                        break;
                    /*  case 12101005:
                     elements.add(Element.LIGHTING);
                     break;*/
                    case 1221003:
                    case 1221004:
                        elements.add(Element.HOLY);
                        break;
                    //elements.clear(); //neutral
                }
            }
            if (elements.size() > 0) {
                double elementalEffect;

                switch (attack.skill) {
                    case 3211003:
                    case 3111003: // inferno and blizzard
                        elementalEffect = attackEffect.getX() / 100.0;
                        break;
                    default:
                        elementalEffect = (0.5 / elements.size());
                        break;
                }
                for (Element element : elements) {
                    switch (monster.getEffectiveness(element)) {
                        case IMMUNE:
                            elementalMaxDamagePerMonster = 1;
                            break;
                        case WEAK:
                            elementalMaxDamagePerMonster *= (1.0 + elementalEffect);
                            break;
                        case STRONG:
                            elementalMaxDamagePerMonster *= (1.0 - elementalEffect);
                            break;
                    }
                }
            }
            if (!defined) {
                // Calculate mob def
                elementalMaxDamagePerMonster -= elementalMaxDamagePerMonster * (Math.max(PDRate /*- Math.max(player.getStat().ignoreTargetDEF, 0)*/ - Math.max(attackEffect == null ? 0 : attackEffect.getIgnoreMob(), 0), 0) / 100.0);

                // Calculate passive bonuses + Sharp Eye
                elementalMaxDamagePerMonster += ((double) elementalMaxDamagePerMonster / 100.0) * CritPercent;
                if (attack.skill != 0 && theSkill != null) {
                    if (theSkill.isChargeSkill()) {
                        elementalMaxDamagePerMonster = (double) (90 * (System.currentTimeMillis() - player.getKeyDownSkill_Time()) / 2000 + 10) * elementalMaxDamagePerMonster * 0.01;
                    }
                    if (theSkill != null && theSkill.isChargeSkill() && player.getKeyDownSkill_Time() == 0) {
                        return 0;
                    }
                }
            }

            // handle combo calc
            int numFinisherOrbs = 0;
            final MapleStatEffect comboBuff = player.getStatForBuff(MapleBuffStat.COMBO);
            final Integer comboBuff2 = player.getBuffedValue(MapleBuffStat.COMBO);
            if (comboBuff != null && comboBuff2 != null) {
                numFinisherOrbs = comboBuff2.intValue() - 1;
                elementalMaxDamagePerMonster *= Math.max(numFinisherOrbs * (comboBuff.getDamage() / 3.0D), 1);
            }

            if (attackEffect != null) {
                if (attackEffect.getDamage() > 0) {
                    elementalMaxDamagePerMonster *= (attackEffect.getDamage() / 100.0D); //Damage Calc
                }
            }

//            final MonsterStatusEffect imprint = monster.getBuff(MonsterStatus.IMPRINT);
//            if (imprint != null) {
//                elementalMaxDamagePerMonster += (elementalMaxDamagePerMonster * imprint.getX() / 100.0);
//            }
//            elementalMaxDamagePerMonster += (elementalMaxDamagePerMonster * player.getDamageIncrease(monster.getObjectId()) / 100.0);
        }
        if (elementalMaxDamagePerMonster > 199999) {
            if (!defined) {
                elementalMaxDamagePerMonster = 199999;
            }
        } else if (elementalMaxDamagePerMonster <= 0) {
            elementalMaxDamagePerMonster = 1;
        }
        return elementalMaxDamagePerMonster;
    }

    public static final AttackInfo DivideAttack(final AttackInfo attack, final int rate) {
        attack.real = false;
        if (rate <= 1) {
            return attack; //lol
        }
        for (AttackPair p : attack.allDamage) {
            if (p.attack != null) {
                for (Pair<Integer, Boolean> eachd : p.attack) {
                    eachd.left /= rate; //too ex.
                }
            }
        }
        return attack;
    }

    public static AttackInfo Modify_AttackCrit(final AttackInfo attack, final MapleCharacter chr, final int type, final MapleStatEffect effect) {
        if (attack.skill != 4211006 && attack.skill != 3211003 && attack.skill != 4111004) { //blizz + shadow meso + m.e no crits
            final int CriticalRate = chr.getStat().getSharpEyeRate();
            final boolean shadow = chr.getBuffedValue(MapleBuffStat.SHADOWPARTNER) != null && (type == 1 || type == 2);
            final List<Integer> damages = new ArrayList<Integer>(), damage = new ArrayList<Integer>();
            int hit, toCrit, mid_att;
            for (AttackPair p : attack.allDamage) {
                if (p.attack != null) {
                    hit = 0;
                    mid_att = shadow ? (p.attack.size() / 2) : p.attack.size();
                    //grab the highest hits
                    toCrit = attack.skill == 4221001 || attack.skill == 3221007 ? mid_att : 0;
                    if (toCrit == 0) {
                        for (Pair<Integer, Boolean> eachd : p.attack) {
                            if (!eachd.right && hit < mid_att) {
                                if (Randomizer.nextInt(100) < CriticalRate) {
                                    toCrit++;
                                }
                                damage.add(eachd.left);
                            }
                            hit++;
                        }
                        if (toCrit == 0) {
                            damage.clear();
                            continue; //no crits here
                        }
                        Collections.sort(damage); //least to greatest
                        for (int i = damage.size(); i > damage.size() - toCrit; i--) {
                            damages.add(damage.get(i - 1));
                        }
                        damage.clear();
                    }
                    hit = 0;
                    for (Pair<Integer, Boolean> eachd : p.attack) {
                        if (!eachd.right) {
                            if (attack.skill == 4221001) { //assassinate never crit first 3, always crit last
                                eachd.right = hit == 3;
                            } else if (attack.skill == 3221007 || attack.skill == 23121003 || attack.skill == 21120005 || attack.skill == 4341005 || attack.skill == 4331006 || eachd.left > 199999) { //snipe always crit
                                eachd.right = true;
                            } else if (hit >= mid_att) { //shadowpartner copies second half to first half
                                eachd.right = p.attack.get(hit - mid_att).right;
                            } else {
                                //rough calculation
                                eachd.right = damages.contains(eachd.left);
                            }
                        }
                        hit++;
                    }
                    damages.clear();
                }
            }
        }
        return attack;
    }

    public static final AttackInfo parseAttack(final LittleEndianAccessor lea, final MapleCharacter chr, RecvPacketOpcode recv) {
        final AttackInfo ret = new AttackInfo();
        lea.skip(1);
        ret.tbyte = lea.readByte();
        ret.targets = (byte) ((ret.tbyte >>> 4) & 0xF);
        ret.hits = (byte) (ret.tbyte & 0xF);
        ret.skill = lea.readInt();
        switch (ret.skill) {
            case 2121001:
            case 2221001:
            case 2321001:
            case 3221001:
            case 3121004:
            case 5101004:
            case 13111002:
            case 15101003:
            case 5221004:
            case 5201002:
            case 14111006:
                ret.charge = lea.readInt();
                break;
            default:
                ret.charge = 0;
                break;
        }
        lea.skip(1); //nOption (버프상태)
        ret.unk = lea.readByte();
        ret.speed = lea.readByte(); // Confirmed
        ret.display = lea.readByte();

        ret.lastAttackTickCount = lea.readInt(); // Ticks
        int damage, oid;
        List<Pair<Integer, Boolean>> allDamageNumbers;

        ret.allDamage = new ArrayList<AttackPair>();

        if (recv == RecvPacketOpcode.CLOSE_RANGE_ATTACK && ret.skill == 4211006) { // Meso Explosion
            return parseMesoExplosion(lea, ret, chr);
        }
        if (recv == RecvPacketOpcode.RANGED_ATTACK) {
            ret.slot = (byte) lea.readShort();
            ret.csstar = (byte) lea.readShort();
            ret.AOE = lea.readByte(); // is AOE or not, TT/ Avenger = 41, Showdown = 0
        }
        for (int i = 0; i < ret.targets; i++) {
            oid = lea.readInt();
            lea.skip(14);
            allDamageNumbers = new ArrayList<Pair<Integer, Boolean>>();
            for (int j = 0; j < ret.hits; j++) {
                damage = lea.readInt();
                allDamageNumbers.add(new Pair<Integer, Boolean>(Integer.valueOf(damage), false));
            }
            //lea.skip(4); // CRC of monster [Wz Editing]
            ret.allDamage.add(new AttackPair(Integer.valueOf(oid), allDamageNumbers));
        }
        if (lea.available() >= 4) {
            ret.position = lea.readPos();
        }

        return ret;
    }

    public static final AttackInfo parseMesoExplosion(final LittleEndianAccessor lea, final AttackInfo ret, final MapleCharacter chr) {
//        System.out.println(lea.toString(true));
        byte bullets;
        if (ret.hits == 0) {
            lea.skip(4);
            bullets = lea.readByte();
            for (int j = 0; j < bullets; j++) {
                ret.allDamage.add(new AttackPair(Integer.valueOf(lea.readInt()), null));
                lea.skip(1);
            }
            lea.skip(2); // 8F 02
            return ret;
        }
        int oid;
        List<Pair<Integer, Boolean>> allDamageNumbers;

        for (int i = 0; i < ret.targets; i++) {
            oid = lea.readInt();
            //if (chr.getMap().isTown()) {
            //    final MapleMonster od = chr.getMap().getMonsterByOid(oid);
            //    if (od != null && od.getLinkCID() > 0) {
            //	    return null;
            //    }
            //}
            lea.skip(12);
            bullets = lea.readByte();
            allDamageNumbers = new ArrayList<Pair<Integer, Boolean>>();
            for (int j = 0; j < bullets; j++) {
                allDamageNumbers.add(new Pair<Integer, Boolean>(Integer.valueOf(lea.readInt()), false)); //m.e. never crits
            }
            ret.allDamage.add(new AttackPair(Integer.valueOf(oid), allDamageNumbers));
//            lea.skip(4); // C3 8F 41 94, 51 04 5B 01
        }
        lea.skip(4);
        bullets = lea.readByte();

        for (int j = 0; j < bullets; j++) {
            ret.allDamage.add(new AttackPair(Integer.valueOf(lea.readInt()), null));
            lea.skip(1);
        }
        // 8F 02/ 63 02

        return ret;
    }

    private static int addMasterySkill(final MapleCharacter player, int sid) {
        int s = player.getSkillLevel(sid);
        if (s > 0) {
            return get_mastery_from_skill(sid, s) * 5;
        }
        return 0;
    }

    private static int get_mastery_from_skill(int skill, int skilllevel) {
        Skill skillz = SkillFactory.getSkill(skill);
        if (skillz != null) {
            MapleStatEffect stat = skillz.getEffect(skilllevel);
            if (stat != null) {
                if (stat.getX() > 0) {
                    return stat.getX();
                } else if (stat.getMastery() > 0) {
                    return stat.getMastery();
                }
            }
        }
        return 0;
    }

    public static void critModify(/*MapleMonster monster, */final MapleCharacter player, /*int v22, */ final AttackInfo attack) {
        long randoms[] = new long[7];
        int nIdx = 0;
        for (int z = 0; z < randoms.length; ++z) {
            randoms[z] = player.getRandomStream1().CRand32__Random();
        }
//        MapleMonsterStats monsterstats;
//        monsterstats = monster.getStats();
//        int v157 = Math.max(0, monsterstats.getLevel() - player.getLevel());
//        //double MobPDDValue = v22 * 100.0 / (v157 * 10.0 + 255.0);
//        int v33 = monsterstats.getEva();
//        if (monster.getBuff(MonsterStatus.AVOID) != null) {
//            v33 += monster.getBuff(MonsterStatus.AVOID).getX();
//        }
//        v33 = Math.max(0, v33);
//        v33 = Math.min(999, v33);
        //int nMobPDD = v33;
        //                int pad = 0;
        Item ipp = player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -11);
        //                if (ipp != null) {
        //                    pad += MapleItemInformationProvider.getInstance().getWatkForProjectile(ipp.getItemId());
        //                }
        //                pad += player.getStat().getTotalWatk();
        //                pad = Math.min(1999, pad);
        //                if (player.getBuffedValue(MapleBuffStat.ECHO_OF_HERO) != null) {
        //                    int za = player.getBuffedValue(MapleBuffStat.ECHO_OF_HERO);
        //                    pad += pad * za / 100;
        //                    pad = Math.min(1999, pad);
        //                }
        int nCSLV = getMastery(player, ipp);
        int nCriticalAttackProb = 0;
        int nCriticalAttackParam = 0;
        double M = nCSLV * 0.009000000000000001;
        if (attack.display == 58) {
            nCSLV = player.getSkillLevel(attack.skill);
            MapleStatEffect stateffect = SkillFactory.getSkill(attack.skill).getEffect(nCSLV);
            nCriticalAttackProb = stateffect.getProb();
            nCriticalAttackParam = stateffect.getCr();
        } else {
            if (GameConstants.getWeaponType(ipp.getItemId()) == MapleWeaponType.BOW
                    || GameConstants.getWeaponType(ipp.getItemId()) == MapleWeaponType.CROSSBOW) {
                if (player.getSkillLevel(3000001) > 0) {
                    nCSLV = player.getSkillLevel(3000001);
                    MapleStatEffect stateffect = SkillFactory.getSkill(3000001).getEffect(nCSLV);
                    nCriticalAttackProb = stateffect.getProb();
                    nCriticalAttackParam = stateffect.getDamage();
                }
            } else if (GameConstants.getWeaponType(ipp.getItemId()) == MapleWeaponType.CLAW) {
                if (player.getSkillLevel(4100001) > 0) {
                    nCSLV = player.getSkillLevel(4100001);
                    MapleStatEffect stateffect = SkillFactory.getSkill(4100001).getEffect(nCSLV);
                    nCriticalAttackProb = stateffect.getProb();
                    nCriticalAttackParam = stateffect.getDamage();
                }
            }
        }
        Integer value = player.getBuffedValue(MapleBuffStat.SHARP_EYES);
        if (value != null) {
            int v27 = value >> 8;
            v27 = Math.max(0, v27);
            v27 = Math.min(v27, 100);
            nCriticalAttackProb += v27;
            if (value > 0) {
                if (nCriticalAttackParam > 0) {
                    nCriticalAttackParam += (value & 0xFF);
                } else {
                    nCriticalAttackParam = (value & 0xFF) + 100;
                }
            }
        }
        if (attack.skill == 3221007 || attack.skill == 4121008) {
            nIdx++;
        }
        nIdx++;
//                double v47d = MobPDDValue * 1.3;
//                if (nMobPDD > v47d) {
//                    continue;
//                }
        nIdx++;
        nIdx++;
        nIdx++;
        boolean hasDark = false;
        if (player.getAllDiseases().size() > 0) {
            for (MapleDiseaseValueHolder mdvh : player.getAllDiseases()) {
                if (mdvh.disease == MapleDisease.DARKNESS) {
                    hasDark = true;
                    break;
                }
            }
        }
//                if (hasDark) {
//                    double b = 0.0;
//                    double damage = 100.0;
//                    double buff = 0.0;
//                    buff = b;
//                    b = damage;
//                    damage = buff;
//                    int v52 = nIdx % 7;
//                    ++nIdx;
//                    long v53 = randoms[v52];
//                    boolean d = (b - damage) * (v53 % 0x989680) * 0.000000100000010000001 + damage <= 20.0;
//                    if (d) {
//                        int nSkillID = attack.skill;
//                        if (nSkillID == 1121006 || nSkillID == 1221007 || nSkillID == 1321003 || nSkillID == 1221009) {
//                            b = 0.0;
//                            damage = 5.0;
//                            buff = b;
//                            b = damage;
//                            damage = buff;
//                            v52 = nIdx % 7;
//                            ++nIdx;
//                            v53 = randoms[v52];
//                            d = (b - damage) * (double) (v53 % 0x989680) * 0.000000100000010000001 + damage < 3.0;
//
//                        }
//                        if (ipp.getItemId() / 10000 == 145 || ipp.getItemId() / 10000 == 146) {
//                            int nAction = attack.display;
//                            if ((nAction < 22 || nAction > 27) && nAction != 54) {
//                                if (nSkillID != 3201003 && nSkillID != 3101003) {
//                                    calc damage but skipp..
//                                    nIdx++;
//                                    if (nSkillID != 1311005 && nSkillID != 4111004 && nSkillID != 4211002) {
//                                        ++nIdx;
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
        //                System.out.println("nCriticalAttackParam : " + nCriticalAttackParam + " / nCriticalAttackProb : " + nCriticalAttackProb + " / nCSLV : " + nCSLV);
        for (AttackPair oned : attack.allDamage) {
            if ((attack.skill != 3211003 && attack.skill != 4111004 && attack.skill != 4221001 && attack.skill != 4211006) || attack.display == 58) {
                if (nCriticalAttackParam > 0 && nCriticalAttackProb > 0 && (nCSLV > 0 || player.getBuffedValue(MapleBuffStat.SHARP_EYES) != null)) {
                    for (Pair<Integer, Boolean> app : oned.attack) {
                        int v47 = nIdx % 7;
                        nIdx++;
                        boolean isCrit = (randoms[v47] % 0x989680) * 0.0000100000010000001 < nCriticalAttackProb;
                        app.right = isCrit;
//                            System.out.println("Damage : " + app.getLeft() + " Crit : " + isCrit + " (value : " + (randoms[v47] % 0x989680) * 0.0000100000010000001 + " )");
                    }

                }
            }
        }
    }
}
