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
import client.MapleClient;
import client.MapleDisease;
import client.MapleStat;
import client.PlayerStats;
import client.Skill;
import client.SkillFactory;
import client.SkillMacro;
import client.anticheat.CheatingOffense;
import client.inventory.Item;
import client.inventory.MapleInventoryType;
import constants.GameConstants;
import handling.RecvPacketOpcode;
import handling.SendPacketOpcode;
import handling.channel.ChannelServer;
import java.awt.Point;
import java.lang.ref.WeakReference;
import java.util.List;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.MaplePortal;
import server.MapleStatEffect;
import server.events.MapleEvent;
import server.events.MapleEventType;
import server.events.MapleSnowball.MapleSnowballs;
import server.life.BanishInfo;
import server.life.MapleMonster;
import server.life.MobAttackInfo;
import server.life.MobSkill;
import server.life.MobSkillFactory;
import server.maps.FieldLimitType;
import server.maps.MapleMap;
import server.maps.MapleMist;
import server.movement.LifeMovementFragment;
import server.quest.MapleQuest;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.data.LittleEndianAccessor;
import tools.packet.CSPacket;

public class PlayerHandler {

    public static int isFinisher(final int skillid) {
        switch (skillid) {
            case 1111003:
            case 1111004:
            case 1111005:
            case 11111002:
            case 11111003:
            case 1111006:
                return 10;
        }
        return 0;
    }

    public static void ChangeSkillMacro(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final int num = slea.readByte();
        String name;
        int shout, skill1, skill2, skill3;
        SkillMacro macro;

        for (int i = 0; i < num; i++) {
            name = slea.readMapleAsciiString();
            shout = slea.readByte();
            skill1 = slea.readInt();
            skill2 = slea.readInt();
            skill3 = slea.readInt();

            macro = new SkillMacro(skill1, skill2, skill3, name, shout, i);
            chr.updateMacros(i, macro);
        }
    }

    public static final void ChangeKeymap(final LittleEndianAccessor slea, final MapleCharacter chr) {
        if (slea.available() > 8 && chr != null) { // else = pet auto pot
            slea.skip(4); //0
            final int numChanges = slea.readInt();

            for (int i = 0; i < numChanges; i++) {
                final int key = slea.readInt();
                final byte type = slea.readByte();
                final int action = slea.readInt();
                if (type == 1 && action >= 1000) { //0 = normal key, 1 = skill, 2 = item
                    final Skill skil = SkillFactory.getSkill(action);
                    if (skil != null) { //not sure about aran tutorial skills..lol
                        if ((!skil.isFourthJob() && !skil.isBeginnerSkill() && skil.isInvisible() && chr.getSkillLevel(skil) <= 0) || GameConstants.isLinkedAranSkill(action) || action % 10000 < 1000 || action >= 91000000) { //cannot put on a key
                            continue;
                        }
                    }
                }
                chr.changeKeybinding(key, type, action);
            }
        } else if (chr != null) {
            final int type = slea.readInt(), data = slea.readInt();
            switch (type) {
                case 1:
                    if (data <= 0) {
                        chr.getQuestRemove(MapleQuest.getInstance(GameConstants.HP_ITEM));
                    } else {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.HP_ITEM)).setCustomData(String.valueOf(data));
                    }
                    break;
                case 2:
                    if (data <= 0) {
                        chr.getQuestRemove(MapleQuest.getInstance(GameConstants.MP_ITEM));
                    } else {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.MP_ITEM)).setCustomData(String.valueOf(data));
                    }
                    break;
            }
            chr.updatePetAuto();
        }
    }

    public static final void UseChair(final int itemId, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        final Item toUse = chr.getInventory(MapleInventoryType.SETUP).findById(itemId);
        if (toUse == null) {
            chr.getCheatTracker().registerOffense(CheatingOffense.USING_UNAVAILABLE_ITEM, Integer.toString(itemId));
            return;
        }
        if (chr.getMapId() == 491000000 && itemId == 3014000) {
            chr.startFishingTask();
            chr.dropMessage(5, "지금부터 낚시를 시작합니다.");
        }
        chr.setChair(itemId);
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.showChair(chr.getId(), itemId), false);
        c.getSession().write(MaplePacketCreator.enableActions());
    }

    public static final void CancelChair(final short id, final MapleClient c, final MapleCharacter chr) {
        if (id == -1) {
            chr.cancelFishingTask();
            chr.setChair(0);
            c.getSession().write(MaplePacketCreator.cancelChair(-1));
            if (chr.getMap() != null) {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.showChair(chr.getId(), 0), false);
            }
        } else { // Use In-Map Chair
            chr.setChair(id);
            c.getSession().write(MaplePacketCreator.cancelChair(id));
        }
    }

    public static final void TrockAddMap(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        final byte addrem = slea.readByte();
        final byte vip = slea.readByte();

        if (vip == 1) {
            if (addrem == 0) {
                chr.deleteFromRocks(slea.readInt());
            } else if (addrem == 1) {
                if (!FieldLimitType.VipRock.check(chr.getMap().getFieldLimit())) {
                    chr.addRockMap();
                } else {
                    chr.dropMessage(1, "순간이동이 불가능한 지역입니다.");
                }
            }
        } else if (vip >= 2) {
            if (addrem == 0) {
                chr.deleteFromHyperRocks(slea.readInt());
            } else if (addrem == 1) {
                if (!FieldLimitType.VipRock.check(chr.getMap().getFieldLimit())) {
                    chr.addHyperRockMap();
                } else {
                    chr.dropMessage(1, "순간이동이 불가능한 지역입니다.");
                }
            }
        } else {
            if (addrem == 0) {
                chr.deleteFromRegRocks(slea.readInt());
            } else if (addrem == 1) {
                if (!FieldLimitType.VipRock.check(chr.getMap().getFieldLimit())) {
                    chr.addRegRockMap();
                } else {
                    chr.dropMessage(1, "순간이동이 불가능한 지역입니다.");
                }
            }
        }
        c.getSession().write(CSPacket.getTrockRefresh(chr, vip, addrem == 3));
    }

    public static final void CharInfoRequest(final int objectid, final MapleClient c, final MapleCharacter chr) {
        if (c.getPlayer() == null || c.getPlayer().getMap() == null) {
            return;
        }
        final MapleCharacter player = c.getPlayer().getMap().getCharacterById(objectid);
        c.getSession().write(MaplePacketCreator.enableActions());
        if (player != null) {
            if (!player.isGM() || c.getPlayer().isGM()) {
                c.getSession().write(MaplePacketCreator.charInfo(player, c.getPlayer().getId() == objectid));
            }
        }
    }

    public static final void TakeDamage(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
//        System.out.println(slea.toString());
        chr.updateTick(slea.readInt());
        final byte type = slea.readByte(); //-4 is mist, -3 and -2 are map damage.
        slea.skip(1); // Element - 0x00 = elementless, 0x01 = ice, 0x02 = fire, 0x03 = lightning
        int damage = slea.readInt();
//        slea.skip(2);
        int oid = 0;
        int monsteridfrom = 0;
        int reflect = 0;
        byte direction = 0;
        int pos_x = 0;
        int pos_y = 0;
        int fake = 0;
        int mpattack = 0;
        boolean isDeadlyAttack = false;
        MapleMonster attacker = null;
        if (chr == null || chr.isHidden() || chr.getMap() == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (chr.getStat().getHp() <= 0) {
            chr.updateSingleStat(MapleStat.HP, 0);
            return;
        }

        if (chr.isGM() && chr.isInvincible()) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final PlayerStats stats = chr.getStat();
        boolean mana_reflect = false;
        if (type != -2 && type != -3 && type != -4) { // Not map damage
            monsteridfrom = slea.readInt();
            oid = slea.readInt();
            attacker = chr.getMap().getMonsterByOid(oid);
            direction = slea.readByte();
            int ddd = slea.readByte() & 0xFF;
//            c.getPlayer().dropMessage(5, "reflect value : "+ddd);
//            mana_reflect = ddd > 0;

            if (attacker == null || attacker.getLinkCID() > 0 || attacker.isFake()) {
//                System.out.println("Return 3");
                return;
            }
            if (attacker != null && type == -1 && damage >= 0) {
                if (attacker.getStats().getBanType() == 1) {
                    final BanishInfo info = attacker.getStats().getBanishInfo();
                    if (info != null) {
                        if (chr != null && !chr.hasBlockedInventory()) {
                            chr.changeMapBanish(info.getMap(), info.getPortal(), info.getMsg());
                        }
                    }
                }
            }
            if (type != -1 && damage > 0) { // Bump damage
                final MobAttackInfo attackInfo = attacker.getStats().getMobAttack(type);
                if (attackInfo != null) {
                    if (attackInfo.isDeadlyAttack()) {
                        isDeadlyAttack = true;
                        mpattack = stats.getMp() - 1;
                    } else {
                        mpattack += attackInfo.getMpBurn();
                    }
                    final MobSkill skill = MobSkillFactory.getMobSkill(attackInfo.getDiseaseSkill(), attackInfo.getDiseaseLevel());
                    if (skill != null && (damage == -1 || damage > 0)) {
                        skill.applyEffect(chr, attacker, false, 0);
                    }
                    attacker.setMp(attacker.getMp() - attackInfo.getMpCon());
                }
            }
            if (damage > 0 && chr.getMapId() / 10000 == 92502) {
                chr.mulung_EnergyModify(2);
            }
        } else if (type == -2) {
            if (slea.available() >= 2) {
                int lv = slea.readByte() & 0xFF;
                int skillid = slea.readByte() & 0xFF;
                MapleDisease dise = MapleDisease.getBySkill(skillid);
                if (lv > 0 && skillid > 0 && dise != null) {
                    try {
                        c.getPlayer().giveDebuff(dise, MobSkillFactory.getMobSkill(skillid, lv));
                    } catch (Exception e) {
                    }
                }
            }
        }
        if (damage == -1) {
            fake = 4020002 + ((chr.getJob() / 10 - 40) * 100000);
            if (fake != 4120002 && fake != 4220002) {
                fake = 4120002;
            }
//            if (type == -1 && chr.getJob() == 122 && attacker != null && chr.getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -10) != null) {
//                if (chr.getTotalSkillLevel(1220006) > 0) {
//                    final MapleStatEffect eff = SkillFactory.getSkill(1220006).getEffect(chr.getTotalSkillLevel(1220006));
//                    attacker.applyStatus(chr, new MonsterStatusEffect(MonsterStatus.STUN, 1, 1220006, null, false), false, eff.getDuration(), true, eff);
//                    fake = 1220006;
//                }
//            }
            if (chr.getTotalSkillLevel(fake) <= 0) {
//            System.out.println("Return 4");
                return;
            }
        } else if (damage < -1 || damage > 200000) {
//            System.out.println("Return 5");
            //AutobanManager.getInstance().addPoints(c, 1000, 60000, "Taking abnormal amounts of damge from " + monsteridfrom + ": " + damage);
            return;
        }
//        if (chr.getStat().dodgeChance > 0 && Randomizer.nextInt(100) < chr.getStat().dodgeChance) {
//            c.getSession().write(MaplePacketCreator.showSpecialEffect(21)); //lol
//            return;
//        }
        chr.getCheatTracker().checkTakeDamage(damage);
        Pair<Double, Boolean> modify = chr.modifyDamageTaken((double) damage, attacker, false);
        damage = modify.left.intValue();
        if (damage > 0) {
            chr.getCheatTracker().setAttacksWithoutHit(false);

//            if (slea.available() == 3 || slea.available() == 4) {
//                byte level = slea.readByte();
//                if (level > 0) {
//                    final MobSkill skill = MobSkillFactory.getMobSkill(slea.readShort(), level);
//                    if (skill != null) {
//                        skill.applyEffect(chr, attacker, false);
//                    }
//                }
//            }
            if (chr.getBuffedValue(MapleBuffStat.MAGIC_GUARD) != null) {
                int hploss = 0, mploss = 0;
                if (isDeadlyAttack) {
                    if (stats.getHp() > 1) {
                        hploss = stats.getHp() - 1;
                    }
                    if (stats.getMp() > 1) {
                        mploss = stats.getMp() - 1;
                    }
                    if (chr.getBuffedValue(MapleBuffStat.INFINITY) != null) {
                        mploss = 0;
                    }
                    chr.addMPHP(-hploss, -mploss);
                    //} else if (mpattack > 0) {
                    //    chr.addMPHP(-damage, -mpattack);
                } else {
                    mploss = (int) (damage * (chr.getBuffedValue(MapleBuffStat.MAGIC_GUARD).doubleValue() / 100.0)) + mpattack;
                    hploss = damage - mploss;
                    if (chr.getBuffedValue(MapleBuffStat.INFINITY) != null) {
                        mploss = 0;
                    } else if (mploss > stats.getMp()) {
                        mploss = stats.getMp();
                        hploss = damage - mploss + mpattack;
                    }
                    if (isInSmoke(chr)) {
                        hploss = 0;
                    }
                    chr.addMPHP(-hploss, -mploss);
                }

            } else if (chr.getStat().mesoGuardMeso > 0) {
                //handled in client
                int mesoloss = 0;
                if (!isInSmoke(chr)) {
                    mesoloss = (int) (damage * (chr.getStat().mesoGuardMeso / 100.0));
                    if (chr.getMeso() < mesoloss) {
                        chr.gainMeso(-chr.getMeso(), false);
                        mesoloss = chr.getMeso();
                        chr.cancelBuffStats(true, MapleBuffStat.MESOGUARD);
                    } else {
                        chr.gainMeso(-mesoloss, false);
                    }
                }
                if (isDeadlyAttack && stats.getMp() > 1) {
                    mpattack = stats.getMp() - 1;
                }
                chr.addMPHP(-(damage - mesoloss), -mpattack);
            } else {
                if (isDeadlyAttack) {
                    chr.addMPHP(stats.getHp() > 1 ? -(stats.getHp() - 1) : 0, stats.getMp() > 1 ? -(stats.getMp() - 1) : 0);
                } else {
                    int hploss = damage;
                    if (isInSmoke(chr)) {
                        hploss = 0;
                    }
                    chr.addMPHP(-hploss, -mpattack);
                }
            }
            if (chr.getShipHp() <= 0) {
                chr.handleBattleshipHP(-damage);
                chr.setShipHp(100);
            } else {
                chr.setShipHp(chr.getShipHp() - 10);
            }
        }
        byte offset = 0;
//        if (slea.available() == 1) {
//            offset = slea.readByte();
//            if (offset < 0 || offset > 2) {
//                offset = 0;
//            }
//        }
        c.getSession().write(MaplePacketCreator.enableActions());
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.damagePlayer(type, monsteridfrom, chr.getId(), damage, fake, direction, reflect, oid, pos_x, pos_y, offset), false);
    }

    public static boolean isInSmoke(MapleCharacter chr) {
        for (MapleMist mist : chr.getMap().getAllMistsThreadsafe()) {
            if (mist.getOwnerId() == chr.getId() && mist.isPoisonMist() == 2 && mist.getBox().contains(chr.getTruePosition())) {
                return true;
            }
        }
        return false;
    }

    public static final void UseItemEffect(final int itemId, final MapleClient c, final MapleCharacter chr) {
        final Item toUse = chr.getInventory(MapleInventoryType.CASH).findById(itemId);
        if (itemId != 0 && (toUse == null || toUse.getItemId() != itemId || toUse.getQuantity() < 1)) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (itemId != 5510000) {
            chr.setItemEffect(itemId);
        }
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.itemEffect(chr.getId(), itemId), false);
    }

    public static final void CancelItemEffect(final int id, final MapleCharacter chr) {
        chr.cancelEffect(
                MapleItemInformationProvider.getInstance().getItemEffect(-id), -1);
    }

    public static final void CancelBuffHandler(final int sourceid, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        final Skill skill = SkillFactory.getSkill(sourceid);

        if (skill.isChargeSkill()) {
            chr.setKeyDownSkill_Time(0);
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillCancel(chr, sourceid), false);
        } else {
            chr.cancelEffect(skill.getEffect(1), -1);
        }
    }

    public static final void CancelMech(final LittleEndianAccessor slea, final MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        int sourceid = slea.readInt();
        if (sourceid % 10000 < 1000 && SkillFactory.getSkill(sourceid) == null) {
            sourceid += 1000;
        }
        final Skill skill = SkillFactory.getSkill(sourceid);
        if (skill == null) { //not sure
            return;
        }
        if (skill.isChargeSkill()) {
            chr.setKeyDownSkill_Time(0);
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillCancel(chr, sourceid), false);
        } else {
            chr.cancelEffect(skill.getEffect(slea.readByte()), -1);
        }
    }

    public static final void QuickSlot(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final StringBuilder ret = new StringBuilder();
        for (int i = 0; i < 8; i++) { //really hacky way of doing it
            ret.append(slea.readAsciiString(1));
            slea.skip(3);
        }
        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.QUICK_SLOT)).setCustomData(ret.toString());
    }

    public static final void SkillEffect(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final int skillId = slea.readInt();
        final byte level = slea.readByte();
        final byte flags = slea.readByte();
        final byte speed = slea.readByte();
        //final byte unk = slea.readByte(); // Added on v.82

        final Skill skill = SkillFactory.getSkill(GameConstants.getLinkedAranSkill(skillId));
        if (chr == null || skill == null || chr.getMap() == null) {
            return;
        }
        final int skilllevel_serv = chr.getTotalSkillLevel(skill);

        if (skilllevel_serv > 0 && skilllevel_serv == level && skill.isChargeSkill()) {
            chr.setKeyDownSkill_Time(System.currentTimeMillis());
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillEffect(chr, skillId, level, flags, speed), false);
        }
    }

    public static final void SpecialMove(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null || slea.available() < 9) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        slea.skip(4); // Old X and Y
        int skillid = slea.readInt();
        int skillLevel = slea.readByte();
        final Skill skill = SkillFactory.getSkill(skillid);

        if (skill == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0 || chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) != skillLevel) {
            if (!GameConstants.isMulungSkill(skillid) && !GameConstants.isPyramidSkill(skillid) && chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0) {
                c.getSession().close();
                return;
            }
            if (GameConstants.isMulungSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92502) {
                    //AutobanManager.getInstance().autoban(c, "Using Mu Lung dojo skill out of dojo maps.");
                    return;
                } else {
                    if (chr.getMulungEnergy() < 300) {
                        return;
                    }
                    chr.mulung_EnergyModify(0);
                }
            } else if (GameConstants.isPyramidSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92602 && chr.getMapId() / 10000 != 92601) {
                    //AutobanManager.getInstance().autoban(c, "Using Pyramid skill out of pyramid maps.");
                    return;
                }
            }
        }
        if (GameConstants.isEventMap(chr.getMapId())) {
            for (MapleEventType t : MapleEventType.values()) {
                final MapleEvent e = ChannelServer.getInstance(chr.getClient().getChannel()).getEvent(t);
                if (e.isRunning() && !chr.isGM()) {
                    for (int i : e.getType().mapids) {
                        if (chr.getMapId() == i) {
                            c.getSession().write(MaplePacketCreator.enableActions());
                            chr.dropMessage(5, "이곳에서 스킬을 사용할 수 없습니다.");
                            return; //non-skill cannot use
                        }
                    }
                }
            }
        }
        skillLevel = chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid));
        final MapleStatEffect effect = skill.getEffect(skillLevel);
        if (effect.isMPRecovery() && chr.getStat().getHp() < (chr.getStat().getMaxHp() / 100) * 10) { //less than 10% hp
            c.getPlayer().dropMessage(5, "You do not have the HP to use this skill.");
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
//        chr.dropMessage(6, "Cooldown : "+effect.getCooldown());
        if (effect.getCooldown() > 0 && !chr.isGM()) {
            if (chr.skillisCooling(skillid)) {
                c.getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            c.getSession().write(MaplePacketCreator.skillCooldown(skillid, effect.getCooldown()));
            chr.addCooldown(skillid, System.currentTimeMillis(), effect.getCooldown() * 1000);
        }

        //chr.checkFollow(); //not msea-like but ALEX'S WISHES
        switch (skillid) {
            case 1121001:
            case 1221001:
            case 1321001:
//                final byte number_of_mobs = slea.readByte();
//                slea.skip(3);
//                for (int i = 0; i < number_of_mobs; i++) {
                int mobId = slea.readInt();
                byte success = slea.readByte();
                byte direction = slea.readByte();
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.showBuffeffect(chr.getId(), skillid, 1, chr.getLevel(), skillLevel, direction), chr.getTruePosition());
                final MapleMonster mob = chr.getMap().getMonsterByOid(mobId);
                if (mob != null) {
                    chr.getMap().broadcastMessage(chr, MaplePacketCreator.showMagnet(mobId, success), chr.getTruePosition());
                    mob.switchController(chr, mob.isControllerHasAggro());
                    //mob.applyStatus(chr, new MonsterStatusEffect(MonsterStatus.STUN, 1, skillid, null, false), false, effect.getDuration(), true, effect);
                }
//                }
                c.getSession().write(MaplePacketCreator.enableActions());
                break;

            default:
                if (skillid == 9001004) {
                    chr.setHidden(!chr.isHidden());
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                }

                Point pos = null;
                if (slea.available() == 5 || slea.available() == 7) {
                    pos = slea.readPos();
                }
                if (effect.isMagicDoor()) { // Mystic Door
                    if (!FieldLimitType.MysticDoor.check(chr.getMap().getFieldLimit())) {
                        effect.applyTo(c.getPlayer(), pos);
                    } else {
                        c.getSession().write(MaplePacketCreator.enableActions());
                    }
                } else {
                    final int mountid = MapleStatEffect.parseMountInfo(c.getPlayer(), skill.getId());
                    if (mountid != 0 && mountid != GameConstants.getMountItem(skill.getId(), c.getPlayer()) && !c.getPlayer().isIntern() && c.getPlayer().getBuffedValue(MapleBuffStat.MONSTER_RIDING) == null && c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -122) == null) {
                        if (!GameConstants.isMountItemAvailable(mountid, c.getPlayer().getJob())) {
                            c.getSession().write(MaplePacketCreator.enableActions());
                            return;
                        }
                    }
                    effect.applyTo(c.getPlayer(), pos);
                }
                break;
        }
    }

    public static final void closeRangeAttack(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr, boolean energy) {
        if (chr == null || (energy && chr.getBuffedValue(MapleBuffStat.ENERGY_CHARGE) == null)) {
            return;
        }
        if (chr.hasBlockedInventory() || chr.getMap() == null || chr.isApplyDamageFucking()) {
            return;
        }

        AttackInfo attack = DamageParse.parseAttack(slea, chr, RecvPacketOpcode.CLOSE_RANGE_ATTACK);
        if (attack == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final boolean mirror = chr.getBuffedValue(MapleBuffStat.SHADOWPARTNER) != null;
        double maxdamage = chr.getStat().getCurrentMaxBaseDamage();
        final Item shield = c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem((short) -10);
        int attackCount = (shield != null && shield.getItemId() / 10000 == 134 ? 2 : 1);
        int skillLevel = 0;
        MapleStatEffect effect = null;
        Skill skill = null;

        if (attack.skill != 0) {
            skill = SkillFactory.getSkill(attack.skill);
            if (skill == null) {
                c.getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            skillLevel = chr.getTotalSkillLevel(skill);
            effect = attack.getAttackEffect(chr, skillLevel, skill);
            if (effect == null) {
                return;
            }
            int skillid = attack.skill;
            if (chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0 || chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) != skillLevel) {
                if (!GameConstants.isMulungSkill(skillid) && !GameConstants.isPyramidSkill(skillid) && chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0) {
                    c.getSession().close();
                    return;
                }
                if (GameConstants.isMulungSkill(skillid)) {
                    if (chr.getMapId() / 10000 != 92502) {
                        //AutobanManager.getInstance().autoban(c, "Using Mu Lung dojo skill out of dojo maps.");
                        return;
                    } else {
                        if (chr.getMulungEnergy() < 300) {
                            return;
                        }
                        chr.mulung_EnergyModify(0);
                    }
                } else if (GameConstants.isPyramidSkill(skillid)) {
                    if (chr.getMapId() / 10000 != 92602 && chr.getMapId() / 10000 != 92601) {
                        //AutobanManager.getInstance().autoban(c, "Using Pyramid skill out of pyramid maps.");
                        return;
                    }
                }
            }
            if (GameConstants.isEventMap(chr.getMapId())) {
                for (MapleEventType t : MapleEventType.values()) {
                    final MapleEvent e = ChannelServer.getInstance(chr.getClient().getChannel()).getEvent(t);
                    if (e.isRunning() && !chr.isGM()) {
                        for (int i : e.getType().mapids) {
                            if (chr.getMapId() == i) {
                                chr.dropMessage(5, "You may not use that here.");
                                return; //non-skill cannot use
                            }
                        }
                    }
                }
            }
            maxdamage *= effect.getDamage() / 100.0;
            attackCount = effect.getAttackCount();

            if (effect.getCooldown() > 0 && !chr.isGM() && !energy) {
                if (chr.skillisCooling(attack.skill)) {
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                }
                c.getSession().write(MaplePacketCreator.skillCooldown(attack.skill, effect.getCooldown()));
                chr.addCooldown(attack.skill, System.currentTimeMillis(), effect.getCooldown() * 1000);
            }
        }
        //attack = DamageParse.Modify_AttackCrit(attack, chr, 1, effect);

        DamageParse.critModify(chr, attack);
        attackCount *= (mirror ? 2 : 1);
        if (!energy) {
            if ((chr.getMapId() == 109060000 || chr.getMapId() == 109060002 || chr.getMapId() == 109060004) && attack.skill == 0) {
                MapleSnowballs.hitSnowball(chr);
            }
            // handle combo orbconsume
            int numFinisherOrbs = 0;
            final Integer comboBuff = chr.getBuffedValue(MapleBuffStat.COMBO);

            if (isFinisher(attack.skill) > 0) { // finisher
                if (comboBuff != null) {
                    numFinisherOrbs = comboBuff.intValue() - 1;
                }
                if (numFinisherOrbs <= 0) {
                    return;
                }
                chr.handleOrbconsume(isFinisher(attack.skill));
                maxdamage *= numFinisherOrbs;
            }
        }
        if (!chr.isHidden()) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, energy ? SendPacketOpcode.ENERGY_ATTACK : SendPacketOpcode.CLOSE_RANGE_ATTACK, (byte) 0, attack.unk, attack.charge, 0), chr.getTruePosition());
        } else {
            chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, energy ? SendPacketOpcode.ENERGY_ATTACK : SendPacketOpcode.CLOSE_RANGE_ATTACK, (byte) 0, attack.unk, attack.charge, 0), false);
        }
        DamageParse.applyAttack(attack, skill, c.getPlayer(), attackCount, maxdamage, effect, mirror ? AttackType.NON_RANGED_WITH_MIRROR : AttackType.NON_RANGED);
//        WeakReference<MapleCharacter>[] clones = chr.getClones();
//        for (int i = 0; i < clones.length; i++) {
//            if (clones[i].get() != null) {
//                final MapleCharacter clone = clones[i].get();
//                final Skill skil2 = skill;
//                final int attackCount2 = attackCount;
//                final double maxdamage2 = maxdamage;
//                final MapleStatEffect eff2 = effect;
//                final AttackInfo attack2 = DamageParse.DivideAttack(attack, chr.isGM() ? 1 : 4);
//                CloneTimer.getInstance().schedule(new Runnable() {
//                    public void run() {
//                        if (!clone.isHidden()) {
//                            //clone.getMap().broadcastMessage(MaplePacketCreator.closeRangeAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, attack2.allDamage, energy, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk, attack2.charge));
//                        } else {
        //clone.getMap().broadcastGMMessage(clone, MaplePacketCreator.closeRangeAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, attack2.allDamage, energy, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk, attack2.charge), false);
//                        }
//                        DamageParse.applyAttack(attack2, skil2, chr, attackCount2, maxdamage2, eff2, mirror ? AttackType.NON_RANGED_WITH_MIRROR : AttackType.NON_RANGED);
//                    }
//                }, 500 * i + 500);
//            }
//        }
    }

    public static final void rangedAttack(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        if (chr.hasBlockedInventory() || chr.getMap() == null || chr.isApplyDamageFucking()) {
            return;
        }
        AttackInfo attack = DamageParse.parseAttack(slea, chr, RecvPacketOpcode.RANGED_ATTACK);
        if (attack == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        int bulletCount = 1, skillLevel = 0;
        MapleStatEffect effect = null;
        Skill skill = null;
        boolean AOE = false;
        switch (attack.skill) {
            case 4111004:
            case 15111007:
            case 11101004:
            case 14101006:
            case 5121002:
            case 15111006:
                AOE = true;
                break;
        }
        if (c.getPlayer().getBuffedValue(MapleBuffStat.POWERGUARD) != null) {
            AOE = true;
        }
        if (attack.skill != 0) {
            skill = SkillFactory.getSkill(attack.skill);
            if (skill == null) {
                c.getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            skillLevel = chr.getTotalSkillLevel(skill);
            effect = attack.getAttackEffect(chr, skillLevel, skill);
            if (effect == null) {
                return;
            }
            int skillid = attack.skill;
            if (chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0 || chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) != skillLevel) {
                if (!GameConstants.isMulungSkill(skillid) && !GameConstants.isPyramidSkill(skillid) && chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0) {
                    c.getSession().close();
                    return;
                }
                if (GameConstants.isMulungSkill(skillid)) {
                    if (chr.getMapId() / 10000 != 92502) {
                        //AutobanManager.getInstance().autoban(c, "Using Mu Lung dojo skill out of dojo maps.");
                        return;
                    } else {
                        if (chr.getMulungEnergy() < 300) {
                            return;
                        }
                        chr.mulung_EnergyModify(0);
                    }
                } else if (GameConstants.isPyramidSkill(skillid)) {
                    if (chr.getMapId() / 10000 != 92602 && chr.getMapId() / 10000 != 92601) {
                        //AutobanManager.getInstance().autoban(c, "Using Pyramid skill out of pyramid maps.");
                        return;
                    }
                }
            }
            if (GameConstants.isEventMap(chr.getMapId())) {
                for (MapleEventType t : MapleEventType.values()) {
                    final MapleEvent e = ChannelServer.getInstance(chr.getClient().getChannel()).getEvent(t);
                    if (e.isRunning() && !chr.isGM()) {
                        for (int i : e.getType().mapids) {
                            if (chr.getMapId() == i) {
                                chr.dropMessage(5, "You may not use that here.");
                                return; //non-skill cannot use
                            }
                        }
                    }
                }
            }

            bulletCount = effect.getBulletCount();
            if (effect.getBulletCount() < effect.getAttackCount()) {
                bulletCount = effect.getAttackCount();
            }
            if (effect.getCooldown() > 0 && !chr.isGM()) {
                if (chr.skillisCooling(attack.skill)) {
                    c.getSession().write(MaplePacketCreator.enableActions());
                    return;
                }
                c.getSession().write(MaplePacketCreator.skillCooldown(attack.skill, effect.getCooldown()));
                chr.addCooldown(attack.skill, System.currentTimeMillis(), effect.getCooldown() * 1000);
            }
        }

        //attack = DamageParse.Modify_AttackCrit(attack, chr, 2, effect);
        DamageParse.critModify(chr, attack);
        final Integer ShadowPartner = chr.getBuffedValue(MapleBuffStat.SHADOWPARTNER);
        if (ShadowPartner
                != null) {
            bulletCount *= 2;
        }
        int projectile = 0, visProjectile = 0;
        if (!AOE
                && chr.getBuffedValue(MapleBuffStat.SOULARROW)
                == null) {
            Item ipp = chr.getInventory(MapleInventoryType.USE).getItem(attack.slot);
            if (ipp == null) {
                return;
            }
            projectile = ipp.getItemId();

            if (attack.csstar > 0) {
                if (chr.getInventory(MapleInventoryType.CASH).getItem(attack.csstar) == null) {
                    return;
                }
                visProjectile = chr.getInventory(MapleInventoryType.CASH).getItem(attack.csstar).getItemId();
            } else {
                visProjectile = projectile;
            }
            // Handle bulletcount
            if (chr.getBuffedValue(MapleBuffStat.SPIRIT_CLAW) == null) {

                int bulletConsume = bulletCount;
                if (effect != null && effect.getBulletConsume() != 0) {
                    bulletConsume = effect.getBulletConsume() * (ShadowPartner != null ? 2 : 1);
                }
                if (chr.getJob() == 412 && bulletConsume > 0 && ipp.getQuantity() < MapleItemInformationProvider.getInstance().getSlotMax(projectile)) {
                    final Skill expert = SkillFactory.getSkill(4120010);
                    if (chr.getTotalSkillLevel(expert) > 0) {
                        final MapleStatEffect eff = expert.getEffect(chr.getTotalSkillLevel(expert));
                        if (eff.makeChanceResult()) {
                            ipp.setQuantity((short) (ipp.getQuantity() + 1));
                            c.getSession().write(MaplePacketCreator.updateInventorySlot(MapleInventoryType.USE, ipp, false));
                            bulletConsume = 0; //regain a star after using
                            c.getSession().write(MaplePacketCreator.getInventoryStatus());
                        }
                    }
                }
                if (bulletConsume > 0) {
                    if (GameConstants.isThrowingStar(projectile) || GameConstants.isBullet(projectile)) {
                        if (ipp.getQuantity() - bulletConsume >= 0) {
                            ipp.setQuantity((short) (ipp.getQuantity() - bulletConsume));
                            c.getSession().write(MaplePacketCreator.updateInventorySlot(MapleInventoryType.USE, ipp, false));
                            bulletConsume = 0; //regain a star after using
                            c.getSession().write(MaplePacketCreator.getInventoryStatus());
                        } else {
                            chr.dropMessage(5, "표창/화살이 부족합니다.");
                            return;
                        }
                    } else {
                        if (!MapleInventoryManipulator.removeById(c, MapleInventoryType.USE, projectile, bulletConsume, false, true)) {
                            chr.dropMessage(5, "You do not have enough arrows/bullets/stars.");
                            return;
                        }
                    }
                }
            }
        }
        double basedamage = 1.0D;
        int projectileWatk = 0;
        if (projectile
                != 0) {
            projectileWatk = MapleItemInformationProvider.getInstance().getWatkForProjectile(projectile);
        }
//        final PlayerStats statst = chr.getStat();
//        switch (attack.skill) {
//            case 4001344: // Lucky Seven
//            case 4121007: // Triple Throw
//            case 14001004: // Lucky seven
//            case 14111005: // Triple Throw
//                basedamage = Math.max(statst.getCurrentMaxBaseDamage(), (float) ((float) ((statst.getTotalLuk() * 5.0f) * (statst.getTotalWatk() + projectileWatk)) / 100));
//                break;
//            case 4111004: // Shadow Meso
////		basedamage = ((effect.getMoneyCon() * 10) / 100) * effect.getProb(); // Not sure
//                basedamage = 53000;
//                break;
//            default:
//                basedamage = statst.getCurrentMaxBaseDamage();
//                switch (attack.skill) {
//                    case 3101005: // arrowbomb is hardcore like that
//                        basedamage *= effect.getX() / 100.0;
//                        break;
//                }
//                break;
//        }
        if (effect
                != null) {
//            basedamage *= (effect.getDamage() + statst.getDamageIncrease(attack.skill)) / 100.0;

            int money = effect.getMoneyCon();
            if (money != 0) {
                if (money > chr.getMeso()) {
                    money = chr.getMeso();
                }
                chr.gainMeso(-money, false);
            }
        }

        if (!chr.isHidden()) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, SendPacketOpcode.RANGED_ATTACK, (byte) 0, attack.unk, attack.charge, visProjectile), chr.getTruePosition());
        } else {
            chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, SendPacketOpcode.RANGED_ATTACK, (byte) 0, attack.unk, attack.charge, visProjectile), false);
        }

        DamageParse.applyAttack(attack, skill, chr, bulletCount, basedamage, effect, ShadowPartner
                != null ? AttackType.RANGED_WITH_SHADOWPARTNER : AttackType.RANGED);

//        WeakReference<MapleCharacter>[] clones = chr.getClones();
//        for (int i = 0; i < clones.length; i++) {
//            if (clones[i].get() != null) {
//                final MapleCharacter clone = clones[i].get();
//                final Skill skil2 = skill;
//                final MapleStatEffect eff2 = effect;
//                final double basedamage2 = basedamage;
//                final int bulletCount2 = bulletCount;
//                final int visProjectile2 = visProjectile;
//                final int skillLevel2 = skillLevel;
//                final AttackInfo attack2 = DamageParse.DivideAttack(attack, chr.isGM() ? 1 : 4);
//                CloneTimer.getInstance().schedule(new Runnable() {
//                    public void run() {
//                        if (!clone.isHidden()) {
//                            if (attack2.skill == 3211006) {
//                                //clone.getMap().broadcastMessage(MaplePacketCreator.strafeAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, visProjectile2, attack2.allDamage, attack2.position, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk, chr.getTotalSkillLevel(3220010)));
//                            } else {
//                                //clone.getMap().broadcastMessage(MaplePacketCreator.rangedAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, visProjectile2, attack2.allDamage, attack2.position, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk));
//                            }
//                        } else {
//                            if (attack2.skill == 3211006) {
//                                //clone.getMap().broadcastGMMessage(clone, MaplePacketCreator.strafeAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, visProjectile2, attack2.allDamage, attack2.position, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk, chr.getTotalSkillLevel(3220010)), false);
//                            } else {
//                                //clone.getMap().broadcastGMMessage(clone, MaplePacketCreator.rangedAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, visProjectile2, attack2.allDamage, attack2.position, clone.getLevel(), clone.getStat().passive_mastery(), attack2.unk), false);
//                            }
//                        }
//                        DamageParse.applyAttack(attack2, skil2, chr, bulletCount2, basedamage2, eff2, AttackType.RANGED);
//                    }
//                }, 500 * i + 500);
//            }
//        }
    }

    public static final void MagicDamage(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null || chr.isApplyDamageFucking()) {
            return;
        }
        AttackInfo attack = DamageParse.parseAttack(slea, chr, RecvPacketOpcode.MAGIC_ATTACK);
        if (attack == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final Skill skill = SkillFactory.getSkill(GameConstants.getLinkedAranSkill(attack.skill));
        if (skill == null) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final int skillLevel = chr.getTotalSkillLevel(skill);
        final MapleStatEffect effect = attack.getAttackEffect(chr, skillLevel, skill);

        if (effect == null) {
            return;
        }
        int skillid = attack.skill;
        if (chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0 || chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) != skillLevel) {
            if (!GameConstants.isMulungSkill(skillid) && !GameConstants.isPyramidSkill(skillid) && chr.getTotalSkillLevel(GameConstants.getLinkedAranSkill(skillid)) <= 0) {
                c.getSession().close();
                return;
            }
            if (GameConstants.isMulungSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92502) {
                    //AutobanManager.getInstance().autoban(c, "Using Mu Lung dojo skill out of dojo maps.");
                    return;
                } else {
                    if (chr.getMulungEnergy() < 300) {
                        return;
                    }
                    chr.mulung_EnergyModify(0);
                }
            } else if (GameConstants.isPyramidSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92602 && chr.getMapId() / 10000 != 92601) {
                    //AutobanManager.getInstance().autoban(c, "Using Pyramid skill out of pyramid maps.");
                    return;
                }
            }
        }
        //attack = DamageParse.Modify_AttackCrit(attack, chr, 3, effect);
        DamageParse.critModify(chr, attack);
        if (GameConstants.isEventMap(chr.getMapId())) {
            for (MapleEventType t : MapleEventType.values()) {
                final MapleEvent e = ChannelServer.getInstance(chr.getClient().getChannel()).getEvent(t);
                if (e.isRunning() && !chr.isGM()) {
                    for (int i : e.getType().mapids) {
                        if (chr.getMapId() == i) {
                            chr.dropMessage(5, "You may not use that here.");
                            return; //non-skill cannot use
                        }
                    }
                }
            }
        }
//        double maxdamage = chr.getStat().getCurrentMaxBaseDamage() * (effect.getDamage() + chr.getStat().getDamageIncrease(attack.skill)) / 100.0;
//        if (GameConstants.isPyramidSkill(attack.skill)) {
//            maxdamage = 1;
//        } else if (GameConstants.isBeginnerJob(skill.getId() / 10000) && skill.getId() % 10000 == 1000) {
//            maxdamage = 40;
//        }
        if (effect.getCooldown() > 0 && !chr.isGM()) {
            if (chr.skillisCooling(attack.skill)) {
                c.getSession().write(MaplePacketCreator.enableActions());
                return;
            }
            c.getSession().write(MaplePacketCreator.skillCooldown(attack.skill, effect.getCooldown()));
            chr.addCooldown(attack.skill, System.currentTimeMillis(), effect.getCooldown() * 1000);
        }
//        chr.checkFollow();
        if (!chr.isHidden()) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, SendPacketOpcode.MAGIC_ATTACK, (byte) 0, attack.unk, attack.charge, 0), chr.getTruePosition());
        } else {
            chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.showAttack(chr.getId(), attack.tbyte, attack.skill, skillLevel, attack.display, attack.speed, attack.allDamage, SendPacketOpcode.MAGIC_ATTACK, (byte) 0, attack.unk, attack.charge, 0), false);
        }
        DamageParse.applyAttackMagic(attack, skill, c.getPlayer(), effect, 199999);
//        WeakReference<MapleCharacter>[] clones = chr.getClones();
//        for (int i = 0; i < clones.length; i++) {
//            if (clones[i].get() != null) {
//                final MapleCharacter clone = clones[i].get();
//                final Skill skil2 = skill;
//                final MapleStatEffect eff2 = effect;
//                final double maxd = maxdamage;
//                final int skillLevel2 = skillLevel;
//                final AttackInfo attack2 = DamageParse.DivideAttack(attack, chr.isGM() ? 1 : 4);
//                CloneTimer.getInstance().schedule(new Runnable() {
//                    public void run() {
//                        if (!clone.isHidden()) {
//                            clone.getMap().broadcastMessage(MaplePacketCreator.magicAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, attack2.allDamage, attack2.charge, clone.getLevel(), attack2.unk));
//                        } else {
//                            clone.getMap().broadcastGMMessage(clone, MaplePacketCreator.magicAttack(clone.getId(), attack2.tbyte, attack2.skill, skillLevel2, attack2.display, attack2.speed, attack2.allDamage, attack2.charge, clone.getLevel(), attack2.unk), false);
//                        }
//                        DamageParse.applyAttackMagic(attack2, skil2, chr, eff2, maxd);
//                    }
//                }, 500 * i + 500);
//            }
//        }
    }

    public static final void DropMeso(final int meso, final MapleCharacter chr) {
        if (!chr.isAlive() || (meso < 10 || meso > 50000) || (meso > chr.getMeso())) {
            chr.getClient().getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        chr.gainMeso(-meso, false, true, true);
        chr.getMap().spawnMesoDrop(meso, chr.getTruePosition(), chr, chr, true, (byte) 0);
        chr.getCheatTracker().checkDrop(true);
    }

    public static final void ChangeEmotion(final int emote, final MapleCharacter chr) {
        if (emote > 7) {
            final int emoteid = 5159992 + emote;
            final MapleInventoryType type = GameConstants.getInventoryType(emoteid);
            if (chr.getInventory(type).findById(emoteid) == null) {
                chr.getCheatTracker().registerOffense(CheatingOffense.USING_UNAVAILABLE_ITEM, Integer.toString(emoteid));
                return;
            }
        }
        if (emote > 0 && chr != null && chr.getMap() != null && !chr.isHidden()) { //O_o
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.facialExpression(chr, emote), false);
        }
    }

    public static final void Heal(final LittleEndianAccessor slea, final MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        //chr.updateTick(slea.readInt());
        if (slea.available() >= 8) {
            slea.skip(4);
        }

        int healHP = slea.readShort();
        int healMP = slea.readShort();
        byte pRate = slea.readByte();

        final PlayerStats stats = chr.getStat();
        float recoveryRate = chr.getMap().getRecoveryRate();
        Item saunaCloth = chr.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -5);
        if (saunaCloth != null) {
            switch (saunaCloth.getItemId()) {
                case 1050018:
                case 1051017:
                    if (recoveryRate != 1.0F) {
                        recoveryRate *= 1.5F;
                    }
                    break;
            }
        }
        healHP = Math.max(0, healHP);
        healMP = Math.max(0, healMP);
        if (stats.getHp() <= 0) {
            return;
        }
        //[R] 3C 00 14 00 00 46 00 00 00 01
        //[R] 3C 00 14 00 00 46 00 00 00 01
        long now = System.currentTimeMillis();
        if (healHP > 0) {
            int time = 10000;
            if ((pRate & 0x1) == 1) {
                time = getEndureTime(chr);
                if (!chr.canHP(now, time)) {
                    return;
                }
            }
            float hpCheck = getHpRecoverCheck(chr) + 10 * recoveryRate;
            if (chr.getStance() == 21) {
                hpCheck *= 1.5F;
            }
            if ((pRate & 0x2) == 2 && chr.getChair() >= 3000000) {
                if (!chr.canHP2(now, time)) {
                    return;
                }
                switch (chr.getChair()) {
                    case 3010000:
                        hpCheck += 50;
                        break;
                    case 3010001:
                        hpCheck += 35;
                        break;
                    case 3010007:
                        hpCheck += 60;
                        break;
                    case 3010009:
                        hpCheck += 20;
                        break;
                }
            }
            if (Math.round(hpCheck) < healHP) {
                healHP = Math.round(hpCheck);
            }
            chr.addHP(healHP);
        }
        if (healMP > 0 && !GameConstants.isDemon(chr.getJob())) { //just for lag
            float mpCheck = getMpRecoverCheck(chr) + 3 * recoveryRate;
            if (chr.getStance() == 21) {
                mpCheck *= 1.5F;
            }
            if ((pRate & 0x2) == 2 && chr.getChair() >= 3000000) {
                if (!chr.canMP2(now, 8000)) {
                    return;
                }
                switch (chr.getChair()) {
                    case 3010008:
                        mpCheck += 60;
                        break;
                    case 3010009:
                        mpCheck += 20;
                        break;
                }
            } else {
                if (!chr.canMP(now, 8000)) {
                    return;
                }
            }
            if (Math.round(mpCheck) < healMP) {
                healMP = Math.round(mpCheck);
            }
            chr.addMP(healMP);
        }
    }

    private static int getMpRecoverCheck(MapleCharacter p) {
        if (p.getJob() / 100 != 2) {
            if (p.getJob() >= 410 && p.getJob() <= 412) {
                int skilllevel = p.getSkillLevel(4100002);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4100002).getEffect(skilllevel);
                    return effect.getMp();
                }
            }
            if (p.getJob() >= 420 && p.getJob() <= 422) {
                int skilllevel = p.getSkillLevel(4100002);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4200001).getEffect(skilllevel);
                    return effect.getMp();
                }
            }
            if (p.getJob() >= 111 && p.getJob() <= 112) {
                int skilllevel = p.getSkillLevel(1110000);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(1110000).getEffect(skilllevel);
                    return effect.getMp();
                }
            }
            if (p.getJob() >= 121 && p.getJob() <= 122) {
                int skilllevel = p.getSkillLevel(1210000);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(1210000).getEffect(skilllevel);
                    return effect.getMp();
                }
            }
        }
        int skilllevel = p.getSkillLevel(2000000);
        return Math.round(skilllevel * p.getLevel() * 0.1F);
    }

    private static int getHpRecoverCheck(MapleCharacter p) {
        if (p.getJob() / 100 == 1) {
            int skilllevel = p.getSkillLevel(1000000);
            if (skilllevel > 0) {
                MapleStatEffect effect = SkillFactory.getSkill(1000000).getEffect(skilllevel);
                return effect.getHp();
            }
        } else if (p.getJob() / 100 == 4) {
            if (p.getJob() >= 410 && p.getJob() <= 412) {
                int skilllevel = p.getSkillLevel(4100002);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4100002).getEffect(skilllevel);
                    return effect.getHp();
                }
            } else {
                int skilllevel = p.getSkillLevel(4200001);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4200001).getEffect(skilllevel);
                    return effect.getHp();
                }
            }
        }
        return 0;
    }

    private static int getEndureTime(MapleCharacter p) {
        if (p.getJob() / 100 == 1) {
            int skilllevel = p.getSkillLevel(1000002);
            if (skilllevel > 0) {
                MapleStatEffect effect = SkillFactory.getSkill(1000002).getEffect(skilllevel);
                return effect.getDuration();
            }
        } else if (p.getJob() / 100 == 4) {
            if (p.getJob() >= 410 && p.getJob() <= 412) {
                int skilllevel = p.getSkillLevel(4100002);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4100002).getEffect(skilllevel);
                    return effect.getDuration();
                }
            } else {
                int skilllevel = p.getSkillLevel(4200001);
                if (skilllevel > 0) {
                    MapleStatEffect effect = SkillFactory.getSkill(4200001).getEffect(skilllevel);
                    return effect.getDuration();
                }
            }
        }
        return 0;
    }

    public static final void MovePlayer(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
//	slea.skip(5); // unknown
        /*
         * 16 
         * 00 
         * 96 06 72 00 
         * 03 
         * 00 96 06 CC 00 00 00 58 02 00 00 06 2C 01 
         * 00 96 06 D7 00 00 00 00 00 00 00 06 11 00 
         * 00 96 06 D7 00 00 00 00 00 90 00 04 C1 00 
         * 
         * 11 00 00 00 00 00 
         * 00 00 00 00 96 06 
         * 72 00 96 06 D7 00*/

        /*
         * 18 00 
         * 02 00 98 60 4D 
         * 00 3C 00 B7 CE B8 B0 C0 CC C0 D3 BD C5 BD C3 C5 B0 B0 ED
         * 
         */
        if (chr == null) {
            return;
        }
        if (chr.getChangeTime() + 100 > System.currentTimeMillis()) {
            return;
        }
        if (chr.isMovePlayerFucking()) {
            return;
        }
        slea.skip(5);
        final Point Original_Pos = chr.getPosition(); // 4 bytes Added on v.80 MSEA
        //slea.skip(GameConstants.GMS ? 17 : 37);

        // log.trace("Movement command received: unk1 {} unk2 {}", new Object[] { unk1, unk2 });
        List<LifeMovementFragment> res;
        try {
            res = MovementParse.parseMovement(slea, 1);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("AIOBE Type1:\n" + slea.toString(true));
            return;
        }

        if (res != null && !res.isEmpty() && c.getPlayer().getMap() != null) { // TODO more validation of input data
//            if (slea.available() != 18 || slea.available() != 24) {
//                System.out.println("slea.available != 11-26 (movement parsing error)\n" + slea.toString(true));
//                return;
//            }
            final MapleMap map = c.getPlayer().getMap();

            if (chr.isHidden()) {
                chr.setLastRes(res);
                c.getPlayer().getMap().broadcastGMMessage(chr, MaplePacketCreator.movePlayer(chr.getId(), res, Original_Pos), false);
            } else {
                c.getPlayer().getMap().broadcastMessage(c.getPlayer(), MaplePacketCreator.movePlayer(chr.getId(), res, Original_Pos), false);
            }

            MovementParse.updatePosition(res, chr, 0);
            final Point pos = chr.getTruePosition();
            map.movePlayer(chr, pos);
//                chr.dropMessage(6, "x : " + pos.x + " / y : " + pos.y);
            int count = c.getPlayer().getFallCounter();
            final boolean samepos = pos.y > c.getPlayer().getOldPosition().y && Math.abs(pos.x - c.getPlayer().getOldPosition().x) < 5;
            if (samepos && (pos.y > (map.getBottom() + 250) || map.getFootholds().findBelow(pos) == null)) {
                if (count > 5) {
                    c.getPlayer().changeMap(map, map.getPortal(0));
                    c.getPlayer().setFallCounter(0);
                } else {
                    c.getPlayer().setFallCounter(++count);
                }
            } else if (count > 0) {
                c.getPlayer().setFallCounter(0);
            }
            c.getPlayer().setOldPosition(pos);
        } else {
            System.out.println("NULL!L!!!LL!L!L!L!!L!L!L!L!");
        }
    }

    public static final void ChangeMapSpecial(final String portal_name, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        final MaplePortal portal = chr.getMap().getPortal(portal_name);
//	slea.skip(2);

        if (portal != null && !chr.hasBlockedInventory()) {
            portal.enterPortal(c);
        } else {
            c.getSession().write(MaplePacketCreator.enableActions());
        }
    }

    public static final void ChangeMap(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
//        c.getPlayer().dropMessage(5, "MAPMAPMAPMAP...");
        if (slea.available() != 0) {
            //slea.skip(6); //D3 75 00 00 00 00
            slea.readByte(); // 1 = from dying 2 = regular portals
            int targetid = slea.readInt(); // FF FF FF FF
//            if (GameConstants.GMS) { //todo jump?
//                slea.readInt();
//            }
            final MaplePortal portal = chr.getMap().getPortal(slea.readMapleAsciiString());
//            if (slea.available() >= 7) {
//                chr.updateTick(slea.readInt());
//            }
//            slea.skip(1);
//            final boolean wheel = slea.readShort() > 0 && !GameConstants.isEventMap(chr.getMapId()) && chr.haveItem(5510000, 1, false, true) && chr.getMapId() / 1000000 != 925;
            final boolean wheel = false;
            if (targetid != -1 && !chr.isAlive()) {
                chr.setStance(0);
                if (chr.getEventInstance() != null && chr.getEventInstance().revivePlayer(chr) && chr.isAlive()) {
                    return;
                }

                if (!wheel) {

                    final MapleMap to = chr.getMap().getReturnMap();
                    if (to.getId() / 10000000 == 98) {
                        //carnival
                        chr.getStat().setHp((short) chr.getStat().getMaxHp() / 2, chr);
                        chr.getStat().setMp((short) chr.getStat().getMaxMp() / 2, chr);
                        chr.updateSingleStat(MapleStat.MP, chr.getStat().getMp());
                    } else {
                        chr.getStat().setHp((short) 50, chr);
                    }
                    chr.changeMap(to, to.getPortal(0));
                } else {
                    c.getSession().write(CSPacket.useWheel((byte) (chr.getInventory(MapleInventoryType.CASH).countById(5510000) - 1)));
                    chr.getStat().setHp(((chr.getStat().getMaxHp() / 100) * 40), chr);
                    MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5510000, 1, true, false);

                    final MapleMap to = chr.getMap();
                    chr.changeMap(to, to.getPortal(0));
                }
            } else {
                if (portal != null && !chr.hasBlockedInventory()) {
                    portal.enterPortal(c);
                } else {
//                    c.getPlayer().dropMessage(6, (portal != null) + " , " + (!chr.hasBlockedInventory()));
                    c.getSession().write(MaplePacketCreator.enableActions());
                }
            }
        }
    }

    public static final void InnerPortal(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        final MaplePortal portal = chr.getMap().getPortal(slea.readMapleAsciiString());
        final int toX = slea.readShort();
        final int toY = slea.readShort();
//	slea.readShort(); // Original X pos
//	slea.readShort(); // Original Y pos

        if (portal == null) {
            return;
        } else if (portal.getPosition().distanceSq(chr.getTruePosition()) > 22500 && !chr.isGM()) {
            chr.getCheatTracker().registerOffense(CheatingOffense.USING_FARAWAY_PORTAL);
            return;
        }
        chr.getMap().movePlayer(chr, new Point(toX, toY));
    }

    public static final void snowBall(LittleEndianAccessor slea, MapleClient c) {
        //B2 00
        //01 [team]
        //00 00 [unknown]
        //89 [position]
        //01 [stage]
        c.getSession().write(MaplePacketCreator.enableActions());
        //empty, we do this in closerange
    }

    public static final void leftKnockBack(LittleEndianAccessor slea, final MapleClient c) {
        if (c.getPlayer().getMapId() / 10000 == 10906) { //must be in snowball map or else its like infinite FJ
            c.getPlayer().giveDebuff(MapleDisease.STUN, 1, 4000, MapleDisease.STUN.getDisease(), 1);
            c.getSession().write(MaplePacketCreator.leftKnockBack());
            c.getSession().write(MaplePacketCreator.enableActions());
        }
    }

    public static final void ReIssueMedal(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        final MapleQuest q = MapleQuest.getInstance(slea.readShort());
        if (q != null && q.getMedalItem() > 0 && chr.getQuestStatus(q.getId()) == 2 && !chr.haveItem(q.getMedalItem(), 1, true, true) && q.getMedalItem() == slea.readInt() && MapleInventoryManipulator.checkSpace(c, q.getMedalItem(), (short) 1, "")) {
            MapleInventoryManipulator.addById(c, q.getMedalItem(), (short) 1, "Redeemed item through medal quest " + q.getId() + " on " + FileoutputUtil.CurrentReadable_Date());
        }
        c.getSession().write(MaplePacketCreator.enableActions());
    }

    public static final void ChangeMonsterBookCover(final int bookid, final MapleClient c, final MapleCharacter chr) {
        if (bookid == 0 || GameConstants.isMonsterCard(bookid)) {
            chr.setMonsterBookCover(bookid);
            chr.getMonsterBook().updateCard(c, bookid);
        }
    }
}
