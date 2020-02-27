package handling.channel.handler;

import client.MapleBuffStat;
import client.MapleCharacter;
import client.MapleClient;
import client.Skill;
import client.SkillFactory;
import client.SummonSkillEntry;
import client.anticheat.CheatingOffense;
import client.status.MonsterStatus;
import client.status.MonsterStatusEffect;
import java.awt.Point;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import server.MapleItemInformationProvider;
import server.MapleStatEffect;
import server.Timer;
import server.life.MapleMonster;
import server.maps.MapleMap;
import server.maps.MapleMapObject;
import server.maps.MapleMapObjectType;
import server.maps.MapleSummon;
import server.maps.SummonMovementType;
import server.movement.LifeMovementFragment;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.data.LittleEndianAccessor;
import tools.packet.MobPacket;
import tools.packet.TemporaryStatsPacket;

public class SummonHandler {

    public static final void MoveSummon(final LittleEndianAccessor slea, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null || chr.isMovePlayerFucking()) {
            return;
        }
        if (chr.getChangeTime() + 1000 > System.currentTimeMillis()) {
            return;
        }
        MapleSummon sum = null;
        int skill = slea.readInt();
        try {
            for (MapleSummon ss : chr.getSummonsReadLock()) {
                if (ss != null
                        && ss.getObjectId() == skill
                        && ss.getSkillLevel() > 0
                        && ss.getMovementType() != SummonMovementType.STATIONARY) {
                    sum = ss;
                    break;
                }
            }
        } finally {
            chr.unlockSummonsReadLock();
        }
        if (sum == null) {
            return;
        }
        slea.skip(4); //startPOS
        final List<LifeMovementFragment> res = MovementParse.parseMovement(slea, 4);

        final Point pos = sum.getPosition();
        MovementParse.updatePosition(res, sum, 0);
        if (res.size() > 0) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.moveSummon(chr.getId(), sum.getObjectId(), pos, res), sum.getTruePosition());
        }
    }

    public static final void DamageSummon(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final int unkByte = slea.readByte();
        final int damage = slea.readInt();
        final int monsterIdFrom = slea.readInt();
        //       slea.readByte(); // stance

        final Iterator<MapleSummon> iter = chr.getSummonsReadLock().iterator();
        MapleSummon summon;
        boolean remove = false;
        try {
            while (iter.hasNext()) {
                summon = iter.next();
                if (summon.isPuppet() && summon.getOwnerId() == chr.getId() && damage > 0) { //We can only have one puppet(AFAIK O.O) so this check is safe.
                    summon.addHP((short) -damage);
                    if (summon.getHP() <= 0) {
                        remove = true;
                    }
                    chr.getMap().broadcastMessage(chr, MaplePacketCreator.damageSummon(chr.getId(), summon.getObjectId(), damage, unkByte, monsterIdFrom), summon.getTruePosition());
                    break;
                }
            }
        } finally {
            chr.unlockSummonsReadLock();
        }
        if (remove) {
            chr.cancelEffectFromBuffStat(MapleBuffStat.PUPPET);
        }
    }

    public static void SummonAttack(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || !chr.isAlive() || chr.getMap() == null) {
            return;
        }
        final MapleMap map = chr.getMap();
        final MapleSummon summon = (MapleSummon) map.getMapObject(slea.readInt(), MapleMapObjectType.SUMMON);
        if (summon == null) {
            return;
        }
        if (summon.getOwnerId() != chr.getId()) {
            return;
        }
        final SummonSkillEntry sse = SkillFactory.getSummonData(summon.getSkill());
        if (sse == null) {
            chr.dropMessage(5, "Error in processing attack.");
            return;
        }
//        slea.skip(4); //pos

        int tick = slea.readInt();
        if (sse != null && sse.delay > 0) {
            chr.updateTick(tick);
            summon.CheckSummonAttackFrequency(chr, tick);
            chr.getCheatTracker().checkSummonAttack();
        }
//        slea.skip(3);

        final byte animation = slea.readByte();
//        slea.skip(8);

        final byte numAttacked = slea.readByte();
        if (sse != null && numAttacked > sse.mobCount) {
            chr.dropMessage(5, "Warning: Attacking more monster than summon can do");
            chr.getCheatTracker().registerOffense(CheatingOffense.SUMMON_HACK_MOBS);
            //AutobanManager.getInstance().autoban(c, "Attacking more monster that summon can do (Skillid : "+summon.getSkill()+" Count : " + numAttacked + ", allowed : " + sse.mobCount + ")");
            return;
        }
//        slea.skip(12); //some pos stuff
        final List<Pair<Integer, Integer>> allDamage = new ArrayList<Pair<Integer, Integer>>();
        for (int i = 0; i < numAttacked; i++) {
            final MapleMonster mob = map.getMonsterByOid(slea.readInt());

            if (mob == null) {
                continue;
            }
            slea.skip(14); // who knows
            final int damge = slea.readInt();
            allDamage.add(new Pair<Integer, Integer>(mob.getObjectId(), damge));
        }
        //if (!summon.isChangedMap()) {
        map.broadcastMessage(chr, MaplePacketCreator.summonAttack(summon.getOwnerId(), summon.getObjectId(), animation, allDamage, chr.getLevel(), false), summon.getTruePosition());
        //}
        final Skill summonSkill = SkillFactory.getSkill(summon.getSkill());
        final MapleStatEffect summonEffect = summonSkill.getEffect(summon.getSkillLevel());
        if (summonEffect == null) {
            chr.dropMessage(5, "Error in attack.");
            return;
        }
        for (Pair<Integer, Integer> attackEntry : allDamage) {
            final int toDamage = attackEntry.right;
            final MapleMonster mob = map.getMonsterByOid(attackEntry.left);
            if (mob == null) {
                continue;
            }
            if (sse != null && sse.delay > 0 && summon.getMovementType() != SummonMovementType.STATIONARY && summon.getMovementType() != SummonMovementType.CIRCLE_STATIONARY && summon.getMovementType() != SummonMovementType.WALK_STATIONARY && chr.getTruePosition().distanceSq(mob.getTruePosition()) > 400000.0) {
                chr.getCheatTracker().registerOffense(CheatingOffense.ATTACK_FARAWAY_MONSTER_SUMMON);
            }
            if (toDamage > 0 && summonEffect.getMonsterStati().size() > 0) {
                if (summonEffect.makeChanceResult()) {
                    for (Map.Entry<MonsterStatus, Integer> z : summonEffect.getMonsterStati().entrySet()) {
                        mob.applyStatus(chr, new MonsterStatusEffect(z.getKey(), z.getValue(), summonSkill.getId(), null, false), summonEffect.isPoison(), 4000, true, summonEffect);
                    }
                }
            }
            if (chr.isGM() || toDamage < 40000) {//(chr.getStat().getCurrentMaxBaseDamage() * 5.0 * (summonEffect.getSelfDestruction() + summonEffect.getDamage()) / 100.0)) { //10 x dmg.. eh
                mob.damage(chr, toDamage, true);
                chr.checkMonsterAggro(mob);
                if (!mob.isAlive()) {
                    chr.getClient().getSession().write(MobPacket.killMonster(mob.getObjectId(), 1));
                }
            } else {
                break;
            }
        }
        if (!summon.isMultiAttack()) {
            chr.getMap().broadcastMessage(MaplePacketCreator.removeSummon(summon, true));
            chr.getMap().removeMapObject(summon);
            chr.removeVisibleMapObject(summon);
            chr.removeSummon(summon);
            chr.cancelEffectFromBuffStat(MapleBuffStat.SUMMON);
        }
    }

    public static final void RemoveSummon(final LittleEndianAccessor slea, final MapleClient c) {
        final MapleMapObject obj = c.getPlayer().getMap().getMapObject(slea.readInt(), MapleMapObjectType.SUMMON);
        if (obj == null || !(obj instanceof MapleSummon)) {
            return;
        }
        final MapleSummon summon = (MapleSummon) obj;
        if (summon.getOwnerId() != c.getPlayer().getId() || summon.getSkillLevel() <= 0) {
            c.getPlayer().dropMessage(5, "Error.");
            return;
        }
        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.removeSummon(summon, true));
        c.getPlayer().getMap().removeMapObject(summon);
        c.getPlayer().removeVisibleMapObject(summon);
        c.getPlayer().removeSummon(summon);
        c.getPlayer().cancelEffectFromBuffStat(MapleBuffStat.SUMMON);
        //TODO: Multi Summoning, must do something about hack buffstat
    }

    public static final void SubSummon(final LittleEndianAccessor slea, final MapleCharacter chr) {
        MapleSummon sum = null;
        int skill = slea.readInt();
        try {
            for (MapleSummon ss : chr.getSummonsReadLock()) {
                if (ss != null
                        && ss.getObjectId() == skill
                        && ss.getSkillLevel() > 0
                        && ss.getMovementType() != SummonMovementType.STATIONARY) {
                    sum = ss;
                    break;
                }
            }
        } finally {
            chr.unlockSummonsReadLock();
        }
        if (sum == null) {
            chr.dropMessage(5, "Cannot find beholder..");
            return;
        }
        byte buffEff = 0;
        if (1321007 == sum.getSkill()) {
            int s = slea.readInt();
            Skill bHealing = SkillFactory.getSkill(s);
            final int bHealingLvl = chr.getTotalSkillLevel(bHealing);
            if (bHealingLvl <= 0 || bHealing == null) {
                return;
            }
            final MapleStatEffect healEffect = bHealing.getEffect(bHealingLvl);
            if (bHealing.getId() == 1320009) {
                slea.readByte();
                buffEff = slea.readByte();
                if (buffEff < 0 || buffEff > 4) {
                    return;
                }
                int buffid = 2022125 + buffEff;
                MapleStatEffect stateff = MapleItemInformationProvider.getInstance().getItemEffect(buffid);
                Map<MapleBuffStat, Integer> localstatups = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                Pair stats[] = {
                    new Pair(MapleBuffStat.WDEF, healEffect.getWdef()),
                    new Pair(MapleBuffStat.MDEF, healEffect.getMdef()),
                    new Pair(MapleBuffStat.ACC, healEffect.getAcc()),
                    new Pair(MapleBuffStat.AVOID, healEffect.getAvoid()),
                    new Pair(MapleBuffStat.WATK, healEffect.getWatk())};


                if ((Short) stats[buffEff].getRight() > 0) {
                    localstatups.put((MapleBuffStat) stats[buffEff].getLeft(), ((Short) stats[buffEff].getRight()).intValue());
                } else {
                    return;
                }

                chr.cancelEffect(stateff, -1, localstatups, true);
                chr.getClient().getSession().write(TemporaryStatsPacket.giveBuff(-buffid, healEffect.getDuration(), localstatups, stateff));
                final long starttime = System.currentTimeMillis();
                final MapleStatEffect.CancelEffectAction cancelAction = new MapleStatEffect.CancelEffectAction(chr, stateff, starttime, localstatups);
                final ScheduledFuture<?> schedule = Timer.BuffTimer.getInstance().schedule(cancelAction, healEffect.getDuration());
                chr.registerEffect(stateff, starttime, schedule, localstatups, false, healEffect.getDuration(), chr.getId());
                //healEffect.applyTo(chr);
            } else if (bHealing.getId() == 1320008) {
                if (!chr.canSummon(healEffect.getX() * 1000)) {
                    return;
                }
                chr.addHP(healEffect.getHp());
            }
            chr.getClient().getSession().write(MaplePacketCreator.showOwnBuffEffect(sum.getObjectId(), 2, chr.getLevel(), bHealingLvl));
            chr.getMap().broadcastMessage(MaplePacketCreator.summonSkill(chr.getId(), sum.getObjectId(), bHealing.getId() == 1320008 ? 5 : buffEff + 6));
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.showBuffeffect(chr.getId(), sum.getObjectId(), 2, chr.getLevel(), bHealingLvl), false);
        }
    }
}
