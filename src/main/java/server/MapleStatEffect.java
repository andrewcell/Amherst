package server;

import client.MapleBuffStat;
import client.MapleCharacter;
import client.MapleCoolDownValueHolder;
import client.MapleDisease;
import client.MapleStat;
import client.PlayerStats;
import client.Skill;
import client.SkillFactory;
import client.inventory.Item;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryType;
import client.status.MonsterStatus;
import client.status.MonsterStatusEffect;
import constants.GameConstants;
import handling.channel.ChannelServer;
import java.awt.Point;
import java.awt.Rectangle;
import java.io.Serializable;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import provider.MapleData;
import provider.MapleDataTool;
import provider.MapleDataType;
import server.MapleCarnivalFactory.MCSkill;
import server.Timer.BuffTimer;
import server.life.MapleMonster;
import server.maps.MapleDoor;
import server.maps.MapleMap;
import server.maps.MapleMapObject;
import server.maps.MapleMapObjectType;
import server.maps.MapleMist;
import server.maps.MapleSummon;
import server.maps.SummonMovementType;
import tools.CaltechEval;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.Triple;
import tools.packet.TemporaryStatsPacket;

public class MapleStatEffect implements Serializable {

    private static final long serialVersionUID = 9179541993413738569L;
    private byte mastery,
            mhpR,
            mmpR,
            mobCount,
            attackCount,
            bulletCount,
            //            reqGuildLevel, 
            period,
            //            expR, 
            //            familiarTarget, 
            //            iceGageCon, //1 = party 2 = nearby
            //            recipeUseCount, 
            //            recipeValidDay, 
            //            reqSkillLevel, 
            slotCount,
            //            effectedOnAlly, 
            //            effectedOnEnemy, 
            type,
            preventslip,
            immortal,
            bs;
    private short hp,
            mp,
            watk,
            matk,
            wdef,
            mdef,
            acc,
            avoid,
            hands,
            speed,
            jump,
            mpCon,
            hpCon,
            //            forceCon, 
            //            bdR, 
            damage,
            prop,
            //            ehp, 
            //            emp, 
            //            ewatk, 
            //            ewdef, 
            //            emdef, 
            ignoreMob,
            dot,
            dotTime,
            //            criticaldamageMin, 
            //            criticaldamageMax, 
            //            pddR, 
            //            mddR,
            //            asrR, 
            er,
            //            damR, 
            padX,
            madX,
            mesoR,
            thaw,
            selfDestruction,
            //            PVPdamage, 
            //            indiePad, 
            //            indieMad, 
            fatigueChange,
            //            str, 
            //            dex, 
            //            int_, 
            //            luk, 
            //            strX, 
            //            dexX, 
            //            intX, 
            //            lukX, 
            lifeId,
            //            imhp, 
            //            immp, 
            inflation,
            useLevel,
            mpConReduce,
            //            indieMhp, 
            //            indieMmp, 
            //            indieAllStat, 
            //            indieSpeed, 
            //            indieJump, 
            //            indieAcc, 
            //            indieEva, 
            //            incPVPdamage,
            mobSkill,
            mobSkillLevel; //ar = accuracy rate
    private double hpR, mpR;
    private int duration,
            sourceid,
            //            recipe, 
            moveTo,
            t, u, v, w, x, y, z, cr,
            itemCon, itemConNo, bulletConsume, moneyCon,
            cooldown, morphId = 0, expinc, exp, consumeOnPickup, range, price, extendPrice, charColor, interval, rewardMeso, totalprob, cosmetic;
    private boolean overTime, skill, partyBuff = true;
    private EnumMap<MapleBuffStat, Integer> statups;
    private ArrayList<Pair<Integer, Integer>> availableMap;
    private EnumMap<MonsterStatus, Integer> monsterStatus;
    private Point lt, rb;
    private int expBuff, itemup, mesoup, cashup, berserk, illusion, booster, berserk2, cp, nuffSkill;
    private byte level;
//    private List<Pair<Integer, Integer>> randomMorph;
    private List<MapleDisease> cureDebuffs;
    private List<Integer> petsCanConsume, familiars, randomPickup;
    private List<Triple<Integer, Integer, Integer>> rewardItem;

    public static final MapleStatEffect loadSkillEffectFromData(final MapleData source, final int skillid, final boolean overtime, final int level, final String variables) {
        return loadFromData(source, skillid, true, overtime, level, variables);
    }

    public static final MapleStatEffect loadItemEffectFromData(final MapleData source, final int itemid) {
        return loadFromData(source, itemid, false, false, 1, null);
    }

    private static final void addBuffStatPairToListIfNotZero(final EnumMap<MapleBuffStat, Integer> list, final MapleBuffStat buffstat, final Integer val) {
        if (val.intValue() != 0) {
            list.put(buffstat, val);
        }
    }

    private final static int parseEval(String path, MapleData source, int def, String variables, int level) {
        if (variables == null) {
            return MapleDataTool.getIntConvert(path, source, def);
        } else {
            final MapleData dd = source.getChildByPath(path);
            if (dd == null) {
                return def;
            }
            if (dd.getType() != MapleDataType.STRING) {
                return MapleDataTool.getIntConvert(path, source, def);
            }
            String dddd = MapleDataTool.getString(dd).replace(variables, String.valueOf(level));
            if (dddd.substring(0, 1).equals("-")) { //-30+3*x
                dddd = "n" + dddd.substring(1, dddd.length()); //n30+3*x
            } else if (dddd.substring(0, 1).equals("=")) { //lol nexon and their mistakes
                dddd = dddd.substring(1, dddd.length());
            }
            return (int) (new CaltechEval(dddd).evaluate());
        }
    }

    private static MapleStatEffect loadFromData(final MapleData source, final int sourceid, final boolean skill, final boolean overTime, final int level, final String variables) {
        final MapleStatEffect ret = new MapleStatEffect();
        ret.sourceid = sourceid;
        ret.skill = skill;
        ret.level = (byte) level;
        if (source == null) {
            return ret;
        }
//        ret.pddR = (short) parseEval("pddR", source, 0, variables, level);
//        ret.mddR = (short) parseEval("mddR", source, 0, variables, level);
//        ret.asrR = (short) parseEval("asrR", source, 0, variables, level);
//        ret.bdR = (short) parseEval("bdR", source, 0, variables, level);
//        ret.damR = (short) parseEval("damR", source, 0, variables, level);
//        ret.criticaldamageMin = (short) parseEval("criticaldamageMin", source, 0, variables, level);
//        ret.criticaldamageMax = (short) parseEval("criticaldamageMax", source, 0, variables, level);
//        ret.forceCon = (short) parseEval("forceCon", source, 0, variables, level);
//        ret.familiarTarget = (byte) (parseEval("familiarPassiveSkillTarget", source, 0, variables, level) + 1);
//        ret.iceGageCon = (byte) parseEval("iceGageCon", source, 0, variables, level);
//        ret.expR = (byte) parseEval("expR", source, 0, variables, level);
//        ret.reqGuildLevel = (byte) parseEval("reqGuildLevel", source, 0, variables, level);
        ret.duration = parseEval("time", source, -1, variables, level);
        ret.hp = (short) parseEval("hp", source, 0, variables, level);
        ret.hpR = parseEval("hpR", source, 0, variables, level) / 100.0;
        ret.mp = (short) parseEval("mp", source, 0, variables, level);
        ret.mpR = parseEval("mpR", source, 0, variables, level) / 100.0;
        ret.mhpR = (byte) parseEval("mhpR", source, 0, variables, level);
        ret.mmpR = (byte) parseEval("mmpR", source, 0, variables, level);
        ret.ignoreMob = (short) parseEval("ignoreMobpdpR", source, 0, variables, level);
        ret.mesoR = (short) parseEval("mesoR", source, 0, variables, level);
        ret.thaw = (short) parseEval("thaw", source, 0, variables, level);
//        ret.padX = (short) parseEval("padX", source, 0, variables, level);
//        ret.madX = (short) parseEval("madX", source, 0, variables, level);
        ret.dot = (short) parseEval("dot", source, 0, variables, level);
        ret.dotTime = (short) parseEval("dotTime", source, 0, variables, level);
        ret.mpConReduce = (short) parseEval("mpConReduce", source, 0, variables, level);
        ret.mpCon = (short) parseEval("mpCon", source, 0, variables, level);
        ret.hpCon = (short) parseEval("hpCon", source, 0, variables, level);
        ret.prop = (short) parseEval("prop", source, 100, variables, level);
        ret.cooldown = Math.max(0, parseEval("cooltime", source, 0, variables, level));
        ret.interval = parseEval("interval", source, 0, variables, level);
        ret.expinc = parseEval("expinc", source, 0, variables, level);
        ret.exp = parseEval("exp", source, 0, variables, level);
        ret.range = parseEval("range", source, 0, variables, level);
        ret.morphId = parseEval("morph", source, 0, variables, level);
        ret.cp = parseEval("cp", source, 0, variables, level);
        ret.cosmetic = parseEval("cosmetic", source, 0, variables, level);
        ret.er = (short) parseEval("er", source, 0, variables, level);
        ret.slotCount = (byte) parseEval("slotCount", source, 0, variables, level);
        ret.preventslip = (byte) parseEval("preventslip", source, 0, variables, level);
        ret.useLevel = (short) parseEval("useLevel", source, 0, variables, level);
        ret.nuffSkill = parseEval("nuffSkill", source, 0, variables, level);
        ret.mobCount = (byte) parseEval("mobCount", source, 1, variables, level);
        ret.immortal = (byte) parseEval("immortal", source, 0, variables, level);
        ret.period = (byte) parseEval("period", source, 0, variables, level);
        ret.type = (byte) parseEval("type", source, 0, variables, level);
        ret.bs = (byte) parseEval("bs", source, 0, variables, level);
        ret.attackCount = (byte) parseEval("attackCount", source, 1, variables, level);
        ret.bulletCount = (byte) parseEval("bulletCount", source, 1, variables, level);
        int priceUnit = parseEval("priceUnit", source, 0, variables, level);
        if (priceUnit > 0) {
            ret.price = parseEval("price", source, 0, variables, level) * priceUnit;
            ret.extendPrice = parseEval("extendPrice", source, 0, variables, level) * priceUnit;
        } else {
            ret.price = 0;
            ret.extendPrice = 0;
        }

        if (ret.skill) {
            switch (sourceid) {
                case 1100002:
                case 1200002:
                case 1300002:
                case 3100001:
                case 3200001:
                case 2111007:
                case 2211007:
                case 2311007:
                case 1120013:
                case 3120008:
                    ret.mobCount = 6;
                    break;
            }
            if (GameConstants.isNoDelaySkill(sourceid)) {
                ret.mobCount = 6;
            }
        }

        if (!ret.skill && ret.duration > -1) {
            ret.overTime = true;
        } else {
            ret.duration *= 1000; // items have their times stored in ms, of course
            ret.overTime = overTime || ret.isMorph() || ret.isPirateMorph() || /*ret.isFinalAttack() ||*/ ret.isAngel();
        }
        ret.statups = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
        ret.mastery = (byte) parseEval("mastery", source, 0, variables, level);
        ret.watk = (short) parseEval("pad", source, 0, variables, level);
        ret.wdef = (short) parseEval("pdd", source, 0, variables, level);
        ret.matk = (short) parseEval("mad", source, 0, variables, level);
        ret.mdef = (short) parseEval("mdd", source, 0, variables, level);
        ret.acc = (short) parseEval("acc", source, 0, variables, level);
        ret.avoid = (short) parseEval("eva", source, 0, variables, level);
        ret.speed = (short) parseEval("speed", source, 0, variables, level);
        ret.jump = (short) parseEval("jump", source, 0, variables, level);
        ret.expBuff = parseEval("expBuff", source, 0, variables, level);
        ret.cashup = parseEval("cashBuff", source, 0, variables, level);
        ret.itemup = parseEval("itemupbyitem", source, 0, variables, level);
        ret.mesoup = parseEval("mesoupbyitem", source, 0, variables, level);
        ret.berserk = parseEval("berserk", source, 0, variables, level);
        ret.berserk2 = parseEval("berserk2", source, 0, variables, level);
        ret.booster = parseEval("booster", source, 0, variables, level);
        ret.lifeId = (short) parseEval("lifeId", source, 0, variables, level);
        ret.inflation = (short) parseEval("inflation", source, 0, variables, level);
//        ret.imhp = (short) parseEval("imhp", source, 0, variables, level);
//        ret.immp = (short) parseEval("immp", source, 0, variables, level);
        ret.illusion = parseEval("illusion", source, 0, variables, level);
        ret.consumeOnPickup = parseEval("consumeOnPickup", source, 0, variables, level);
        if (ret.consumeOnPickup == 1) {
            if (parseEval("party", source, 0, variables, level) > 0) {
                ret.consumeOnPickup = 2;
            }
        }
        ret.charColor = 0;
        String cColor = MapleDataTool.getString("charColor", source, null);
        if (cColor != null) {
            ret.charColor |= Integer.parseInt("0x" + cColor.substring(0, 2));
            ret.charColor |= Integer.parseInt("0x" + cColor.substring(2, 4) + "00");
            ret.charColor |= Integer.parseInt("0x" + cColor.substring(4, 6) + "0000");
            ret.charColor |= Integer.parseInt("0x" + cColor.substring(6, 8) + "000000");
        }

//        ret.ehp = (short) parseEval("emhp", source, 0, variables, level);
//        ret.emp = (short) parseEval("emmp", source, 0, variables, level);
//        ret.ewatk = (short) parseEval("epad", source, 0, variables, level);
//        ret.ewdef = (short) parseEval("epdd", source, 0, variables, level);
//        ret.emdef = (short) parseEval("emdd", source, 0, variables, level);
//        ret.indiePad = (short) parseEval("indiePad", source, 0, variables, level);
//        ret.indieMad = (short) parseEval("indieMad", source, 0, variables, level);
//        ret.indieMhp = (short) parseEval("indieMhp", source, 0, variables, level);
//        ret.indieMmp = (short) parseEval("indieMmp", source, 0, variables, level);
//        ret.indieSpeed = (short) parseEval("indieSpeed", source, 0, variables, level);
//        ret.indieJump = (short) parseEval("indieJump", source, 0, variables, level);
//        ret.indieAcc = (short) parseEval("indieAcc", source, 0, variables, level);
//        ret.indieEva = (short) parseEval("indieEva", source, 0, variables, level);
//        ret.indiePdd = (short) parseEval("indiePdd", source, 0, variables, level);
//        ret.indieMdd = (short) parseEval("indieMdd", source, 0, variables, level);
//        ret.indieAllStat = (short) parseEval("indieAllStat", source, 0, variables, level);
//        ret.str = (short) parseEval("str", source, 0, variables, level);
//        ret.dex = (short) parseEval("dex", source, 0, variables, level);
//        ret.int_ = (short) parseEval("int", source, 0, variables, level);
//        ret.luk = (short) parseEval("luk", source, 0, variables, level);
//        ret.strX = (short) parseEval("strX", source, 0, variables, level);
//        ret.dexX = (short) parseEval("dexX", source, 0, variables, level);
//        ret.intX = (short) parseEval("intX", source, 0, variables, level);
//        ret.lukX = (short) parseEval("lukX", source, 0, variables, level);
//        ret.recipe = parseEval("recipe", source, 0, variables, level);
//        ret.recipeUseCount = (byte) parseEval("recipeUseCount", source, 0, variables, level);
//        ret.recipeValidDay = (byte) parseEval("recipeValidDay", source, 0, variables, level);
//        ret.reqSkillLevel = (byte) parseEval("reqSkillLevel", source, 0, variables, level);
//        ret.effectedOnAlly = (byte) parseEval("effectedOnAlly", source, 0, variables, level);
//        ret.effectedOnEnemy = (byte) parseEval("effectedOnEnemy", source, 0, variables, level);
        List<MapleDisease> cure = new ArrayList<MapleDisease>(5);
        if (parseEval("poison", source, 0, variables, level) > 0) {
            cure.add(MapleDisease.POISON);
        }
        if (parseEval("seal", source, 0, variables, level) > 0) {
            cure.add(MapleDisease.SEAL);
        }
        if (parseEval("darkness", source, 0, variables, level) > 0) {
            cure.add(MapleDisease.DARKNESS);
        }
        if (parseEval("weakness", source, 0, variables, level) > 0) {
            cure.add(MapleDisease.WEAKEN);
        }
        if (parseEval("curse", source, 0, variables, level) > 0) {
            cure.add(MapleDisease.CURSE);
        }
        ret.cureDebuffs = cure;

        ret.petsCanConsume = new ArrayList<Integer>();
        for (int i = 0; true; i++) {
            final int dd = parseEval(String.valueOf(i), source, 0, variables, level);
            if (dd > 0) {
                ret.petsCanConsume.add(dd);
            } else {
                break;
            }
        }
        final MapleData mdd = source.getChildByPath("0");
        if (mdd != null && mdd.getChildren().size() > 0) {
            ret.mobSkill = (short) parseEval("mobSkill", mdd, 0, variables, level);
            ret.mobSkillLevel = (short) parseEval("level", mdd, 0, variables, level);
        } else {
            ret.mobSkill = 0;
            ret.mobSkillLevel = 0;
        }
        final MapleData pd = source.getChildByPath("randomPickup");
        if (pd != null) {
            ret.randomPickup = new ArrayList<Integer>();
            for (MapleData p : pd) {
                ret.randomPickup.add(MapleDataTool.getInt(p));
            }
        }
        final MapleData ltd = source.getChildByPath("lt");
        if (ltd != null) {
            ret.lt = (Point) ltd.getData();
            ret.rb = (Point) source.getChildByPath("rb").getData();
        }

        final MapleData ltc = source.getChildByPath("con");
        if (ltc != null) {
            ret.availableMap = new ArrayList<Pair<Integer, Integer>>();
            for (MapleData ltb : ltc) {
                ret.availableMap.add(new Pair<Integer, Integer>(MapleDataTool.getInt("sMap", ltb, 0), MapleDataTool.getInt("eMap", ltb, 999999999)));
            }
        }
        int totalprob = 0;
        final MapleData lta = source.getChildByPath("reward");
        if (lta != null) {
            ret.rewardMeso = parseEval("meso", lta, 0, variables, level);
            final MapleData ltz = lta.getChildByPath("case");
            if (ltz != null) {
                ret.rewardItem = new ArrayList<Triple<Integer, Integer, Integer>>();
                for (MapleData lty : ltz) {
                    ret.rewardItem.add(new Triple<Integer, Integer, Integer>(MapleDataTool.getInt("id", lty, 0), MapleDataTool.getInt("count", lty, 0), MapleDataTool.getInt("prop", lty, 0)));
                    totalprob += MapleDataTool.getInt("prob", lty, 0);
                }
            }
        } else {
            ret.rewardMeso = 0;
        }
        ret.totalprob = totalprob;
        ret.cr = parseEval("criticalDamage", source, 0, variables, level);
        ret.t = parseEval("t", source, 0, variables, level);
        ret.u = parseEval("u", source, 0, variables, level);
        ret.v = parseEval("v", source, 0, variables, level);
        ret.w = parseEval("w", source, 0, variables, level);
        ret.x = parseEval("x", source, 0, variables, level);
        ret.y = parseEval("y", source, 0, variables, level);
        ret.z = parseEval("z", source, 0, variables, level);
        ret.damage = (short) parseEval("damage", source, 100, variables, level);
        ret.selfDestruction = (short) parseEval("selfDestruction", source, 0, variables, level);
        ret.bulletConsume = parseEval("bulletConsume", source, 0, variables, level);
        ret.moneyCon = parseEval("moneyCon", source, 0, variables, level);

        ret.itemCon = parseEval("itemCon", source, 0, variables, level);
        ret.itemConNo = parseEval("itemConNo", source, 0, variables, level);
        ret.moveTo = parseEval("moveTo", source, -1, variables, level);
        ret.monsterStatus = new EnumMap<MonsterStatus, Integer>(MonsterStatus.class);
        if (ret.overTime && ret.getSummonMovementType() == null) {
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.WATK, Integer.valueOf(ret.watk));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.WDEF, Integer.valueOf(ret.wdef));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.MATK, Integer.valueOf(ret.matk));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.MDEF, Integer.valueOf(ret.mdef));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.ACC, Integer.valueOf(ret.acc));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.AVOID, Integer.valueOf(ret.avoid));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.SPEED, Integer.valueOf(ret.speed));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.JUMP, Integer.valueOf(ret.jump));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.BOOSTER, Integer.valueOf(ret.booster));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.HP_LOSS_GUARD, Integer.valueOf(ret.thaw));
            addBuffStatPairToListIfNotZero(ret.statups, MapleBuffStat.MESO_RATE, Integer.valueOf(GameConstants.getModifier(ret.sourceid, ret.mesoup))); // defaults to 2x
        }
        if (ret.skill) { // hack because we can't get from the datafile...
            switch (sourceid) {
                case 2001002: // magic guard
                case 12001001:
                    ret.statups.put(MapleBuffStat.MAGIC_GUARD, ret.x);
                    break;
                case 2301003: // invincible
                    ret.statups.put(MapleBuffStat.INVINCIBLE, ret.x);
                    break;
                case 4001003: // darksight
                    ret.statups.put(MapleBuffStat.DARKSIGHT, ret.x);
                    break;
                case 4211003: // pickpocket
                    ret.statups.put(MapleBuffStat.PICKPOCKET, ret.x);
                    break;
                case 4211005: // mesoguard
                    ret.statups.put(MapleBuffStat.MESOGUARD, ret.x);
                    break;
                case 4111001: // mesoup
                    ret.statups.put(MapleBuffStat.MESOUP, ret.x);
                    break;
                case 4111002: // shadowpartner
                    ret.statups.put(MapleBuffStat.SHADOWPARTNER, ret.x);
                    break;
                case 4211008:
                    ret.statups.put(MapleBuffStat.SHADOWPARTNER, (int) ret.level);
                    break;
                case 11101002:
                case 13101002:
                    ret.statups.put(MapleBuffStat.FINALATTACK, ret.x);
                    break;
                case 3101004: // soul arrow
                case 3201004:
                case 13101003:
                case 2311002: // mystic door - hacked buff icon
                    ret.statups.put(MapleBuffStat.SOULARROW, ret.x);
                    break;
                /*case 11101002:
                 final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                 stat.put(MapleBuffStat.FINALATTACK, 0);
                 break;*/
                case 1211003:
                case 1211004:
                case 1211005:
                case 1211006:
                case 1211007:
                case 1211008:
                case 1221003:
                case 1221004:
                    ret.statups.put(MapleBuffStat.WK_CHARGE, 1);
                    break;
                case 5211006: // Homing Beacon
                case 5220011: // Bullseye
                case 22151002: //killer wings
                    ret.duration = 2100000000;
                    ret.statups.put(MapleBuffStat.HOMING_BEACON, ret.x);
                    break;
                case 1101004: //소드부스터
                case 1101005: //엑스 부스터
                case 1201004: //소드부스터
                case 1201005: //메이스 부스터
                case 1301004: //스피어 부스터
                case 1301005: //폴암 부스터
                case 3101002: //보우부스터
                case 13101001:
                case 3201002: //크로스보우 부스터
                case 4101003: //자벨린 부스터
                case 4201002: //대거 부스터
                case 2111005: // 매직부스터
                case 12101004:
                case 2211005: // 매직부스터
                case 5101006: // 너클 부스터
                case 5201003: // 건 부스터
                case 11101001:
                    ret.statups.put(MapleBuffStat.BOOSTER, ret.x);
                    break;
                case 2311006:
                case 2321003: // bahamut
                case 1321007: //Beholder
                case 5220002:
                case 5211001:
                case 5211002:
                    ret.statups.put(MapleBuffStat.SUMMON, 1);
                    break;
                case 1101007: // pguard
                case 1201007:
                    ret.statups.put(MapleBuffStat.POWERGUARD, ret.x);
                    break;
                case 1301007: // hyper body
                    ret.statups.put(MapleBuffStat.MAXHP, ret.x);
                    ret.statups.put(MapleBuffStat.MAXMP, ret.x);
                    break;
                case 1111002: // combo
                case 11111001:
                    ret.statups.put(MapleBuffStat.COMBO, 1);
                    break;
                case 1311006: //dragon roar
                case 1311005: //NOT A BUFF - Sacrifice
                    ret.hpR = -ret.x / 100.0;
                    break;
                case 1211010: //NOT A BUFF - HP Recover
                    ret.hpR = ret.x / 100.0;
                    break;
                case 1311008: // dragon blood
                    ret.statups.put(MapleBuffStat.DRAGONBLOOD, ret.x);
                    break;
                case 1121000: // maple warrior, all classes
                case 1221000:
                case 1321000:
                case 2121000:
                case 2221000:
                case 2321000:
                case 3121000:
                case 3221000:
                case 4121000:
                case 4221000:
                case 5221000:
                case 5121000:
                    ret.statups.put(MapleBuffStat.MAPLE_WARRIOR, ret.x);
                    break;
                case 5221009: // Mind Control
                    ret.monsterStatus.put(MonsterStatus.HYPNOTIZE, 1);
                    break;
                case 3121002: // sharp eyes bow master
                case 3221002: // sharp eyes marksmen
                    ret.statups.put(MapleBuffStat.SHARP_EYES, ret.x << 8 | ret.y);
                    break;
                case 3121008:
//                    ret.statups.clear(); //집중은 다른 공격력 버프와 중첩
                    ret.statups.put(MapleBuffStat.CONCENTRATE, Integer.valueOf(ret.x));
                    break;
                case 5110001: // Energy Charge
                case 15100004:
                    ret.statups.put(MapleBuffStat.ENERGY_CHARGE, 0);
                    break;
                case 15111006:
                    ret.statups.put(MapleBuffStat.UNKNOWN9, ret.x);
                    break;
                case 4001002: // disorder
                    ret.monsterStatus.put(MonsterStatus.WATK, ret.x);
                    ret.monsterStatus.put(MonsterStatus.WDEF, ret.y);
                    break;
                case 1004:
                case 10001004:
                case 5221006:
                    ret.statups.put(MapleBuffStat.MONSTER_RIDING, 1);
                    break;
                case 1201006: // threaten
                    ret.monsterStatus.put(MonsterStatus.WATK, ret.x);
                    ret.monsterStatus.put(MonsterStatus.WDEF, ret.x);
                    ret.monsterStatus.put(MonsterStatus.BLIND, ret.z);
                    break;
                case 1111008: // shout
                case 1211002:
                case 4211002: // assaulter
                case 3101005: // arrow bomb
                case 1111005: // coma: sword
                case 1111006: // coma: sword
                case 4221007: // boomerang step
                case 4121008: // Ninja Storm
                case 4201004: //steal, new
                case 1121001: //magnet
                case 1221001:
                case 1321001:
                case 2211003:
                case 2311004:
                case 3120010:
                case 2221006:
                case 5101002:
                case 5101003:
                case 5201004:
                    ret.monsterStatus.put(MonsterStatus.STUN, 1);
                    break;
                case 5001005: // Dash
                    ret.statups.put(MapleBuffStat.DASH_SPEED, ret.x);
                    ret.statups.put(MapleBuffStat.DASH_JUMP, ret.y);
                    break;
                case 15001003:
                    ret.statups.put(MapleBuffStat.DASH_SPEED, ret.x);
                    ret.statups.put(MapleBuffStat.DASH_JUMP, ret.y);
                    ret.statups.put(MapleBuffStat.WATK, 40);
                    break;
//                case 1111003: //blind does not work
//                case 1111004:
//                    ret.monsterStatus.put(MonsterStatus.BLIND, 1);
//                    break;
                case 4221003:
                case 4121003:
                    ret.monsterStatus.put(MonsterStatus.SHOWDOWN, ret.x);
                    ret.monsterStatus.put(MonsterStatus.MDEF, ret.x);
                    ret.monsterStatus.put(MonsterStatus.WDEF, ret.x);
                    break;
                case 2201004: // cold beam
                case 2211002: // ice strike
                case 3211003: // blizzard
                case 2211006: // il elemental compo
                case 2221007: // Blizzard
                case 2121006: // Paralyze
                case 2221001:
                case 5211005:
                    ret.monsterStatus.put(MonsterStatus.FREEZE, 1);
//                    ret.duration *= 2; // freezing skills are a little strange
                    break;
                case 2101003: // fp slow
                case 2201003: // il slow
                    ret.monsterStatus.put(MonsterStatus.SPEED, ret.x);
                    break;
                case 12101001: // 음양사 슬로우
                    ret.monsterStatus.put(MonsterStatus.MDEF, ret.x);
                    break;
                case 4121004: // Ninja ambush
                case 4221004:
                    ret.monsterStatus.put(MonsterStatus.NINJA_AMBUSH, (int) ret.damage);
                    break;
                case 2311005:
                    ret.monsterStatus.put(MonsterStatus.DOOM, 1);
                    break;
                case 3120012:
                case 3220012:
                case 3111002: // puppet ranger
                case 3211002: // puppet sniper
                case 13111004:
                    ret.statups.put(MapleBuffStat.PUPPET, 1);
                    break;
                case 2121005: // elquines
                case 12111004:
                case 3201007:
                case 3101007:
                case 3211005: // golden eagle
                case 3111005: // golden hawk
                case 3121006: // phoenix
                    ret.statups.put(MapleBuffStat.SUMMON, 1);
                    ret.monsterStatus.put(MonsterStatus.STUN, Integer.valueOf(1));
                    break;
                case 11001004:
                case 12001004:
                case 13001004:
                case 14001005:
                case 15001004:
                    ret.statups.put(MapleBuffStat.SUMMON, 1);
                    break;
                case 3221005: // frostprey
                case 2221005: // ifrit
                    ret.statups.put(MapleBuffStat.SUMMON, 1);
                    ret.monsterStatus.put(MonsterStatus.FREEZE, Integer.valueOf(1));
                    break;
//                case 1321007: // Beholder
//                    ret.statups.put(MapleBuffStat.BEHOLDER, (int) ret.level);
//                    break;
                case 2311003: // hs
//                case 5001002:
                    ret.statups.put(MapleBuffStat.HOLY_SYMBOL, ret.x);
                    break;
                case 5121009:
                case 15111005:
                    ret.statups.put(MapleBuffStat.SPEED_INFUSION, ret.x);
                    break;
                case 2211004: // il seal
                case 2111004: // fp seal
                case 12111002:
                    ret.monsterStatus.put(MonsterStatus.SEAL, 1);
                    break;
                case 4111003: // shadow web
                    ret.monsterStatus.put(MonsterStatus.SHADOW_WEB, 1);
                    break;
                case 4121006: // spirit claw
                    ret.statups.put(MapleBuffStat.SPIRIT_CLAW, 0);
                    break;
                case 2121004:
                case 2221004:
                case 2321004: // Infinity
                    ret.hpR = ret.y / 100.0;
                    ret.mpR = ret.y / 100.0;
                    ret.statups.put(MapleBuffStat.INFINITY, ret.x);
                    break;
                case 1121002:
                case 1221002:
                case 1321002: // Stance
                    ret.statups.put(MapleBuffStat.STANCE, (int) ret.prop);
                    break;
                case 2121002: // mana reflection
                case 2221002:
                case 2321002:
                    ret.statups.put(MapleBuffStat.MANA_REFLECTION, ret.prop - 30);
                    break;
                case 2321005: // holy shield, TODO JUMP
                    ret.statups.put(MapleBuffStat.HOLY_SHIELD, ret.x);
                    break;
                case 3121007: // Hamstring
                    ret.statups.put(MapleBuffStat.HAMSTRING, ret.x);
                    ret.monsterStatus.put(MonsterStatus.SPEED, ret.x);
                    break;
                case 3221006: // Blind
                    ret.statups.put(MapleBuffStat.BLIND, ret.x);
                    ret.monsterStatus.put(MonsterStatus.ACC, ret.x);
                    break;
//                case 2301004:
//                    ret.statups.put(MapleBuffStat.BLESS, (int) ret.level);
//                    break;
                default:
                    break;
            }
            if (GameConstants.isBeginnerJob(sourceid / 10000)) {
                switch (sourceid % 10000) {
                    //angelic blessing: HACK, we're actually supposed to use the passives for atk/matk buff
                    case 1001:
                        ret.statups.put(MapleBuffStat.RECOVERY, ret.x);
                        break;
                    case 1011: // Berserk fury
                        ret.statups.put(MapleBuffStat.BERSERK_FURY, ret.x);
                        break;
                    case 1010:
                        ret.statups.put(MapleBuffStat.DIVINE_BODY, 1);
                        break;
                    case 1005:
                        ret.statups.put(MapleBuffStat.ECHO_OF_HERO, ret.x);
                        break;
                }
            }
        }

        if (!ret.isSkill()) {
            switch (sourceid) {
                case 2022125:
                    ret.statups.put(MapleBuffStat.WDEF, 1);
                    break;
                case 2022126:
                    ret.statups.put(MapleBuffStat.MDEF, 1);
                    break;
                case 2022127:
                    ret.statups.put(MapleBuffStat.ACC, 1);
                    break;
                case 2022128:
                    ret.statups.put(MapleBuffStat.AVOID, 1);
                    break;
                case 2022129:
                    ret.statups.put(MapleBuffStat.WATK, 1);
                    break;
                case 2022033:
                    ret.statups.put(MapleBuffStat.HOLY_SYMBOL, 50);
                    break;
            }
        }

        if (ret.isPoison()) {
            ret.monsterStatus.put(MonsterStatus.POISON, 1);
        }
        if (ret.isMorph() || ret.isPirateMorph()) {
            ret.statups.put(MapleBuffStat.MORPH, ret.getMorph());
        }

        return ret;
    }

    /**
     * @param applyto
     * @param obj
     * @param attack damage done by the skill
     */
    public final void applyPassive(final MapleCharacter applyto, final MapleMapObject obj) {
        if (makeChanceResult()) {
            switch (sourceid) { // MP eater
                case 2100000:
                case 2200000:
                case 2300000:
                    if (obj == null || obj.getType() != MapleMapObjectType.MONSTER) {
                        return;
                    }
                    final MapleMonster mob = (MapleMonster) obj; // x is absorb percentage
                    if (!mob.getStats().isBoss()) {
                        final int absorbMp = Math.min((int) (mob.getMobMaxMp() * (getX() / 100.0)), mob.getMp());
                        if (absorbMp > 0) {
                            mob.setMp(mob.getMp() - absorbMp);
                            applyto.getStat().setMp(applyto.getStat().getMp() + absorbMp, applyto);
                            applyto.getClient().getSession().write(MaplePacketCreator.showOwnBuffEffect(sourceid, 1, applyto.getLevel(), level));
                            applyto.getMap().broadcastMessage(applyto, MaplePacketCreator.showBuffeffect(applyto.getId(), sourceid, 1, applyto.getLevel(), level), false);
                        }
                    }
                    break;
            }
        }
    }

    public final boolean applyTo(MapleCharacter chr) {
        return applyTo(chr, chr, true, null, duration);
    }

    public final boolean applyTo(MapleCharacter chr, Point pos) {
        return applyTo(chr, chr, true, pos, duration);
    }

    public final boolean applyTo(final MapleCharacter applyfrom, final MapleCharacter applyto, final boolean primary, final Point pos, int newDuration) {
        if (isShadow() && applyfrom.getJob() / 100 % 10 != 4 && !applyfrom.isGM()) { //pirate/shadow = dc
            applyfrom.getClient().getSession().write(MaplePacketCreator.enableActions());
            return false;
        }

//        if (!skill && sourceid >= 2022125 && sourceid <= 2022129) {
//            Skill bHealing = SkillFactory.getSkill(1320009); //비홀더 버프
//            final int bHealingLvl = applyfrom.getTotalSkillLevel(bHealing);
//            if (bHealingLvl <= 0 || bHealing == null) {
//                return false;
//            }
//            final MapleStatEffect healEffect = bHealing.getEffect(bHealingLvl);
//            Pair stats[] = {
//                new Pair(MapleBuffStat.WDEF, healEffect.getWdef()),
//                new Pair(MapleBuffStat.MDEF, healEffect.getMdef()),
//                new Pair(MapleBuffStat.ACC, healEffect.getAcc()),
//                new Pair(MapleBuffStat.AVOID, healEffect.getAvoid()),
//                new Pair(MapleBuffStat.WATK, healEffect.getWatk())};
//            int buffEff = sourceid - 2022125;
//            if ((Short) stats[buffEff].getRight() > 0) {
//                statups.put((MapleBuffStat) stats[buffEff].getLeft(), ((Short) stats[buffEff].getRight()).intValue());
//            } else {
//                return false;
//            }
//            duration = healEffect.getDuration();
//            overTime = true;
//        }
        int hpchange = calcHPChange(applyfrom, applyto, primary);
        int mpchange = calcMPChange(applyfrom, primary);
        final PlayerStats stat = applyto.getStat();

        if (primary) {
            if (itemConNo != 0) {
                if (!applyto.haveItem(itemCon, itemConNo, false, true)) {
                    applyto.getClient().getSession().write(MaplePacketCreator.enableActions());
                    return false;
                }
                MapleInventoryManipulator.removeById(applyto.getClient(), GameConstants.getInventoryType(itemCon), itemCon, itemConNo, false, true);
            }
        } else if (!primary && isResurrection()) {
            hpchange = stat.getMaxHp();
            applyto.setStance(0); //TODO fix death bug, player doesnt spawn on other screen
        }
        if (isDispel() && makeChanceResult()) {
            applyto.dispelDebuff(MapleDisease.CURSE);
            applyto.dispelDebuff(MapleDisease.DARKNESS);
            applyto.dispelDebuff(MapleDisease.POISON);
            applyto.dispelDebuff(MapleDisease.SEAL);
            applyto.dispelDebuff(MapleDisease.SLOW);
            applyto.dispelDebuff(MapleDisease.WEAKEN);
        } else if (isHeroWill()) {
            applyfrom.dispelDebuff(MapleDisease.SEDUCE);
        } else if (cureDebuffs.size() > 0) {
            for (final MapleDisease debuff : cureDebuffs) {
                applyfrom.dispelDebuff(debuff);
            }
        } else if (isMPRecovery()) {
            final int toDecreaseHP = ((stat.getMaxHp() / 100) * 10);
            if (stat.getHp() > toDecreaseHP) {
                hpchange += -toDecreaseHP; // -10% of max HP
                mpchange += ((toDecreaseHP / 100) * getY());
            } else {
                hpchange = stat.getHp() == 1 ? 0 : stat.getHp() - 1;
            }
        }
        final Map<MapleStat, Integer> hpmpupdate = new EnumMap<MapleStat, Integer>(MapleStat.class);
        if (hpchange != 0) {
//            if (hpchange < 0 && (-hpchange) > stat.getHp() && !applyto.hasDisease(MapleDisease.ZOMBIFY)) {
//                applyto.getClient().getSession().write(MaplePacketCreator.enableActions());
//                return false;
//            }

            if (!primary && applyfrom.getId() != applyto.getId() && isHeal()) { //힐 경험치
                int realHealedHp = Math.max(0, Math.min(stat.getCurrentMaxHp() - stat.getHp(), hpchange));
                if (realHealedHp > 0) {
                    int maxmp = applyfrom.getStat().getCurrentMaxMp() / 256;
                    int expa = 20 * (realHealedHp) / (8 * maxmp + 190);
                    applyfrom.gainExp(expa, true, false, true);
                }
            }
            stat.setHp(stat.getHp() + hpchange, applyto);
        }
        if (mpchange != 0) {
            if (mpchange < 0 && (-mpchange) > stat.getMp()) {
                applyto.getClient().getSession().write(MaplePacketCreator.enableActions());
                return false;
            }
            if (getSourceId() == 2321008) {
//                mpchange *= 1.4;
                stat.setMp(Math.max(0, stat.getMp() + mpchange), applyto);
            } else if (getSourceId() == 2311004) {
//                mpchange *= 1.1;
                stat.setMp(Math.max(0, stat.getMp() + mpchange), applyto);
            } else {
                stat.setMp(stat.getMp() + mpchange, applyto);
            }
            //short converting needs math.min cuz of overflow

            hpmpupdate.put(MapleStat.MP, Integer.valueOf(stat.getMp()));
        }
        hpmpupdate.put(MapleStat.HP, Integer.valueOf(stat.getHp()));
//
//            Timer.BuffTimer.getInstance().schedule(new Runnable() {
//                @Override
//                public void run() {
//                    long ss = System.currentTimeMillis();
//                    while (ss + 1800L > System.currentTimeMillis()) {
//                        applyto.getClient().getSession().write(MaplePacketCreator.enableActions());
//                    }
//                }
//            }, 2800L);
//        }

        boolean disableHang = true;

        if (applyto.getId() != applyfrom.getId()) {
            disableHang = false;
        }

        applyto.getClient().getSession().write(MaplePacketCreator.updatePlayerStats(hpmpupdate, disableHang, applyto.getJob()));

        if (expinc != 0) {
            applyto.gainExp(expinc, true, true, false);
        } else if (GameConstants.isMonsterCard(sourceid)) {
            applyto.getMonsterBook().addCard(applyto.getClient(), sourceid);
        } //        else if (isMistEruption()) {
        //            int i = y;
        //            for (MapleMist m : applyto.getMap().getAllMistsThreadsafe()) {
        //                if (m.getOwnerId() == applyto.getId() && m.getSourceSkill().getId() == 2111003) {
        //                    if (m.getSchedule() != null) {
        //                        m.getSchedule().cancel(false);
        //                        m.setSchedule(null);
        //                    }
        //                    if (m.getPoisonSchedule() != null) {
        //                        m.getPoisonSchedule().cancel(false);
        //                        m.setPoisonSchedule(null);
        //                    }
        //                    applyto.getMap().broadcastMessage(MaplePacketCreator.removeMist(m.getObjectId(), true));
        //                    applyto.getMap().removeMapObject(m);
        //
        //                    i--;
        //                    if (i <= 0) {
        //                        break;
        //                    }
        //                }
        //            }
        //        } 
        else if (cosmetic > 0) {
            if (cosmetic >= 30000) {
                applyto.setHair(cosmetic);
                applyto.updateSingleStat(MapleStat.HAIR, cosmetic);
            } else if (cosmetic >= 20000) {
                applyto.setFace(cosmetic);
                applyto.updateSingleStat(MapleStat.FACE, cosmetic);
            } else if (cosmetic < 100) {
                applyto.setSkinColor((byte) cosmetic);
                applyto.updateSingleStat(MapleStat.SKIN, cosmetic);
            }
            applyto.equipChanged();
        } else if (isSpiritClaw()) {
            MapleInventory use = applyto.getInventory(MapleInventoryType.USE);
            boolean itemz = false;
            for (int i = 0; i < use.getSlotLimit(); i++) { // impose order...
                Item item = use.getItem((byte) i);
                if (item != null) {
                    if (GameConstants.isThrowingStar(item.getItemId()) && item.getQuantity() >= 200) {
                        MapleInventoryManipulator.removeFromSlot(applyto.getClient(), MapleInventoryType.USE, (short) i, (short) 200, false, true);
                        itemz = true;
                        break;
                    }
                }
            }
            if (!itemz) {
                return false;
            }
        } else if (cp != 0 && applyto.getCarnivalParty() != null) {
            applyto.getCarnivalParty().addCP(applyto, cp);
            applyto.CPUpdate(false, applyto.getAvailableCP(), applyto.getTotalCP(), 0);
            for (MapleCharacter chr : applyto.getMap().getCharactersThreadsafe()) {
                chr.CPUpdate(true, applyto.getCarnivalParty().getAvailableCP(), applyto.getCarnivalParty().getTotalCP(), applyto.getCarnivalParty().getTeam());
            }
        } else if (nuffSkill != 0 && applyto.getParty() != null) {
            final MCSkill skil = MapleCarnivalFactory.getInstance().getSkill(nuffSkill);
            if (skil != null) {
                final MapleDisease dis = skil.getDisease();
                for (MapleCharacter chr : applyto.getMap().getCharactersThreadsafe()) {
                    if (applyto.getParty() == null || chr.getParty() == null || (chr.getParty().getId() != applyto.getParty().getId())) {
                        if (skil.targetsAll || Randomizer.rand(0, 9) < 8) {
                            if (dis == null) {
                                chr.dispel();
                            } else if (skil.getSkill() == null) {
                                chr.giveDebuff(dis, 1, 10000, dis.getDisease(), 1);
                            } else {
                                chr.giveDebuff(dis, skil.getSkill());
                            }
                            if (!skil.targetsAll) {
                                break;
                            }
                        }
                    }
                }
            }
        } else if (mobSkill > 0 && mobSkillLevel > 0 && primary) {
            applyto.disease(mobSkill, mobSkillLevel);
        } else if (randomPickup != null && randomPickup.size() > 0) {
            MapleItemInformationProvider.getInstance().getItemEffect(randomPickup.get(Randomizer.nextInt(randomPickup.size()))).applyTo(applyto);
        }
        final SummonMovementType summonMovementType = getSummonMovementType();
        if (summonMovementType != null) {
            int summId = sourceid;
            if (sourceid == 3111002) {
                final Skill elite = SkillFactory.getSkill(3120012);
                if (applyfrom.getTotalSkillLevel(elite) > 0) {
                    return elite.getEffect(applyfrom.getTotalSkillLevel(elite)).applyTo(applyfrom, applyto, primary, pos, newDuration);
                }
            } else if (sourceid == 13111004) {
                final Skill elite = SkillFactory.getSkill(13111004);
                if (applyfrom.getTotalSkillLevel(elite) > 0) {
                    return elite.getEffect(applyfrom.getTotalSkillLevel(elite)).applyTo(applyfrom, applyto, primary, pos, newDuration);
                }
            } else if (sourceid == 3211002) {
                final Skill elite = SkillFactory.getSkill(3220012);
                if (applyfrom.getTotalSkillLevel(elite) > 0) {
                    return elite.getEffect(applyfrom.getTotalSkillLevel(elite)).applyTo(applyfrom, applyto, primary, pos, newDuration);
                }
            }
            Point newPos = new Point(pos == null ? applyfrom.getTruePosition() : pos);
            if (summonMovementType == SummonMovementType.STATIONARY) {
                if (applyfrom.isFacingLeft()) {
                    newPos.x -= 180;
                } else {
                    newPos.x += 180;
                }
            }
            Point calcedPoint = applyfrom.getMap().calcPointBelow(newPos);
            if (calcedPoint != null) {
                newPos = calcedPoint;
            }
            final MapleSummon tosummon = new MapleSummon(applyfrom, summId, getLevel(), newPos, summonMovementType);
            if (!tosummon.isPuppet()) {
                applyfrom.getCheatTracker().resetSummonAttack();
            }
            if (getSourceId() == 1301007) { // 하이퍼 바디
                applyfrom.cancelEffect(this, -1, statups, false);
            } else {
//                if (!tosummon.isMultiSummon()) { // 여러개 소환 가능한 소환수는 소환해제 x
                applyfrom.cancelEffect(this, -1, statups, true);
//                }
            }
            applyfrom.getMap().spawnSummon(tosummon);
            applyfrom.addSummon(tosummon);
            tosummon.addHP((short) x);
            if (isBeholder()) {
                tosummon.addHP((short) 1);
            }
        }
        if (primary && availableMap != null) {
            for (Pair<Integer, Integer> e : availableMap) {
                if (applyto.getMapId() < e.left || applyto.getMapId() > e.right) {
                    applyto.getClient().getSession().write(MaplePacketCreator.enableActions());
                    return true;
                }
            }
        }
        if (overTime && !isEnergyCharge()) {
            applyBuffEffect(applyfrom, applyto, primary, newDuration);
        }
        if (skill) {
            removeMonsterBuff(applyfrom);
        }
        if (primary) {
            if (overTime || isHeal() || isDispel()) {
                applyBuff(applyfrom, newDuration);
            }
            if (isMonsterBuff()) {
                applyMonsterBuff(applyfrom);
            }
        }
        if (isMagicDoor()) { // Magic Door
            MapleDoor door = new MapleDoor(applyto, new Point(pos == null ? applyto.getTruePosition() : pos), sourceid); // Current Map door

            if (door.getTownPortal() != null) {
                door.updateTownDoorPosition(applyto.getParty());

                applyto.getMap().spawnDoor(door);
                applyto.addDoor(door);

                MapleDoor townDoor = new MapleDoor(door); // Town door
                applyto.addDoor(townDoor);
                door.getTown().spawnDoor(townDoor);

                if (applyto.getParty() != null) { // update town doors
                    applyto.silentPartyUpdate();
                }
            } else {
                applyto.dropMessage(5, "마을의 미스틱 도어 지점이 꽉 차서 지금은 사용할 수 없습니다.");
            }
        } else if (isMist()) {
            final Rectangle bounds = calculateBoundingBox(pos != null ? pos : applyfrom.getPosition(), applyfrom.isFacingLeft());
            final MapleMist mist = new MapleMist(bounds, applyfrom, this);
            applyfrom.getMap().spawnMist(mist, getDuration(), false);
        } else if (isTimeLeap()) { // Time Leap
            for (MapleCoolDownValueHolder i : applyto.getCooldowns()) {
                if (i.skillId != 5121010) {
                    applyto.removeCooldown(i.skillId);
                    applyto.getClient().getSession().write(MaplePacketCreator.skillCooldown(i.skillId, 0));
                }
            }
        }
        if (rewardMeso != 0) {
            applyto.gainMeso(rewardMeso, false);
        }
        if (rewardItem != null && totalprob > 0) {
            for (Triple<Integer, Integer, Integer> reward : rewardItem) {
                if (MapleInventoryManipulator.checkSpace(applyto.getClient(), reward.left, reward.mid, "") && reward.right > 0 && Randomizer.nextInt(totalprob) < reward.right) { // Total prob
                    if (GameConstants.getInventoryType(reward.left) == MapleInventoryType.EQUIP) {
                        final Item item = MapleItemInformationProvider.getInstance().getEquipById(reward.left);
                        item.setGMLog("Reward item (effect): " + sourceid + " on " + FileoutputUtil.CurrentReadable_Date());
                        MapleInventoryManipulator.addbyItem(applyto.getClient(), item);
                    } else {
                        MapleInventoryManipulator.addById(applyto.getClient(), reward.left, reward.mid.shortValue(), "Reward item (effect): " + sourceid + " on " + FileoutputUtil.CurrentReadable_Date());
                    }
                }
            }
        }
        if (sourceid == 1311006) { //드래곤 로어 스턴상태
            applyfrom.giveDebuff(MapleDisease.STUN, 1, 1200L, MapleDisease.STUN.getDisease(), 1); // 이것은 나의 프라이드다. 지우면 3대가 고자
        }
        return true;
    }

    public final boolean applyReturnScroll(final MapleCharacter applyto) {
        if (moveTo != -1) {
            if (moveTo != applyto.getMapId() || sourceid == 2031010 || sourceid == 2030021) {
                MapleMap target;
                if (moveTo == 999999999) {
                    target = applyto.getMap().getReturnMap();
                } else {
                    target = ChannelServer.getInstance(applyto.getClient().getChannel()).getMapFactory().getMap(moveTo);
                    if (target.getId() / 10000000 != 60 && applyto.getMapId() / 10000000 != 61) {
                        if (target.getId() / 10000000 != 21 && applyto.getMapId() / 10000000 != 20) {
                            if (target.getId() / 10000000 != 12 && applyto.getMapId() / 10000000 != 10) {
                                if (target.getId() / 10000000 != 10 && applyto.getMapId() / 10000000 != 12) {
                                    if (target.getId() / 10000000 != applyto.getMapId() / 10000000) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                applyto.changeMap(target, target.getPortal(0));
                return true;
            } else {
            }
        }
        return false;
    }

    private final void applyBuff(final MapleCharacter applyfrom, int newDuration) {
        if (isPartyBuff() && (applyfrom.getParty() != null || isGmBuff() || (applyfrom.isStrongBuff() && isCanStrongBuff()))) {
            final Rectangle bounds = calculateBoundingBox(applyfrom.getTruePosition(), applyfrom.isFacingLeft());
            final List<MapleMapObject> affecteds = applyfrom.getMap().getMapObjectsInRect(bounds, Arrays.asList(MapleMapObjectType.PLAYER));

            for (final MapleMapObject affectedmo : affecteds) {
                final MapleCharacter affected = (MapleCharacter) affectedmo;

                if (affected.getId() != applyfrom.getId() && (isGmBuff() || (applyfrom.getParty() != null && affected.getParty() != null && applyfrom.getParty().getId() == affected.getParty().getId()) || (applyfrom.isStrongBuff() && isCanStrongBuff()))) {
                    if ((isResurrection() && !affected.isAlive()) || (!isResurrection() && affected.isAlive())) {
                        if (applyfrom.isStrongBuff() && (isCanStrongBuff() || isGmBuff())) {
                            newDuration = 3600000; //60분
                        }
                        applyTo(applyfrom, affected, false, null, newDuration);
                        affected.getClient().getSession().write(MaplePacketCreator.showOwnBuffEffect(sourceid, 2, applyfrom.getLevel(), level));
                        affected.getMap().broadcastMessage(affected, MaplePacketCreator.showBuffeffect(affected.getId(), sourceid, 2, applyfrom.getLevel(), level), false);
                    }
                    if (isTimeLeap()) {
                        for (MapleCoolDownValueHolder i : affected.getCooldowns()) {
                            if (i.skillId != 5121010) {
                                affected.removeCooldown(i.skillId);
                                affected.getClient().getSession().write(MaplePacketCreator.skillCooldown(i.skillId, 0));
                            }
                        }
                    }
                }
            }
        }
    }

    private final void removeMonsterBuff(final MapleCharacter applyfrom) {
        List<MonsterStatus> cancel = new ArrayList<MonsterStatus>();
        switch (sourceid) {
            case 1111007: //아머 크래쉬
                cancel.add(MonsterStatus.WEAPON_DEFENSE_UP);
                break;
            case 1211009: //매직 크래쉬
                cancel.add(MonsterStatus.MAGIC_DEFENSE_UP);
            case 1311007: //파워 크래쉬
                cancel.add(MonsterStatus.WEAPON_ATTACK_UP);
                cancel.add(MonsterStatus.MAGIC_ATTACK_UP);
                break;
            default:
                return;
        }
        final Rectangle bounds = calculateBoundingBox(applyfrom.getTruePosition(), applyfrom.isFacingLeft());
        final List<MapleMapObject> affected = applyfrom.getMap().getMapObjectsInRect(bounds, Arrays.asList(MapleMapObjectType.MONSTER));
        int i = 0;

        for (final MapleMapObject mo : affected) {
            if (makeChanceResult()) {
                for (MonsterStatus stat : cancel) {
                    ((MapleMonster) mo).cancelStatus(stat);
                }
            }
            i++;
            if (i >= mobCount) {
                break;
            }
        }
    }

    public final void applyMonsterBuff(final MapleCharacter applyfrom) {
        final Rectangle bounds = calculateBoundingBox(applyfrom.getTruePosition(), applyfrom.isFacingLeft());
        final MapleMapObjectType type = MapleMapObjectType.MONSTER;
        final List<MapleMapObject> affected = sourceid == 35111005 ? applyfrom.getMap().getMapObjectsInRange(applyfrom.getTruePosition(), Double.POSITIVE_INFINITY, Arrays.asList(type)) : applyfrom.getMap().getMapObjectsInRect(bounds, Arrays.asList(type));
        int i = 0;

        for (final MapleMapObject mo : affected) {
            if (makeChanceResult()) {
                for (Map.Entry<MonsterStatus, Integer> stat : getMonsterStati().entrySet()) {
                    MapleMonster mons = (MapleMonster) mo;
                    mons.applyStatus(applyfrom, new MonsterStatusEffect(stat.getKey(), stat.getValue(), sourceid, null, false), isPoison(), getDuration(), true, this);
                }
            }
            i++;
            if (i >= mobCount) {
                break;
            }
        }
    }

    public final Rectangle calculateBoundingBox(final Point posFrom, final boolean facingLeft) {
        return calculateBoundingBox(posFrom, facingLeft, lt, rb, range);
    }

    public final Rectangle calculateBoundingBox(final Point posFrom, final boolean facingLeft, int addedRange) {
        return calculateBoundingBox(posFrom, facingLeft, lt, rb, range + addedRange);
    }

    public final static Rectangle calculateBoundingBox(final Point posFrom, final boolean facingLeft, final Point lt, final Point rb, final int range) {
        if (lt == null || rb == null) {
            return new Rectangle((facingLeft ? (-200 - range) : 0) + posFrom.x, (-100 - range) + posFrom.y, 200 + range, 100 + range);
        }
        Point mylt;
        Point myrb;
        if (facingLeft) {
            mylt = new Point(lt.x + posFrom.x - range, lt.y + posFrom.y);
            myrb = new Point(rb.x + posFrom.x, rb.y + posFrom.y);
        } else {
            myrb = new Point(lt.x * -1 + posFrom.x + range, rb.y + posFrom.y);
            mylt = new Point(rb.x * -1 + posFrom.x, lt.y + posFrom.y);
        }
        return new Rectangle(mylt.x, mylt.y, myrb.x - mylt.x, myrb.y - mylt.y);
    }

    public final double getMaxDistanceSq() { //lt = infront of you, rb = behind you; not gonna distanceSq the two points since this is in relative to player position which is (0,0) and not both directions, just one
        final int maxX = Math.max(Math.abs(lt == null ? 0 : lt.x), Math.abs(rb == null ? 0 : rb.x));
        final int maxY = Math.max(Math.abs(lt == null ? 0 : lt.y), Math.abs(rb == null ? 0 : rb.y));
        return (maxX * maxX) + (maxY * maxY);
    }

    public final void setDuration(int d) {
        this.duration = d;
    }

    public final void silentApplyBuff(final MapleCharacter chr, final long starttime, final int localDuration, final Map<MapleBuffStat, Integer> statup, final int cid) {
        chr.registerEffect(this, starttime, BuffTimer.getInstance().schedule(new CancelEffectAction(chr, this, starttime, statup),
                ((starttime + localDuration) - System.currentTimeMillis())), statup, true, localDuration, cid);

        final SummonMovementType summonMovementType = getSummonMovementType();
        if (summonMovementType != null) {
            final MapleSummon tosummon = new MapleSummon(chr, this, chr.getTruePosition(), summonMovementType);
            if (!tosummon.isPuppet()) {
                chr.getCheatTracker().resetSummonAttack();
                chr.getMap().spawnSummon(tosummon);
                chr.addSummon(tosummon);
                tosummon.addHP((short) x);
                if (isBeholder()) {
                    tosummon.addHP((short) 1);
                }
            }
        }
    }

    private final void applyBuffEffect(final MapleCharacter applyfrom, final MapleCharacter applyto, final boolean primary, final int newDuration) {
        //Debug
//                    for (Entry<MapleBuffStat, Integer> p : statups.entrySet()) {
//                        applyto.dropMessage(5, p.getKey() + " : " + p.getValue());
//                    }

        int localDuration = newDuration;
        if (primary) {
            localDuration = Math.max(newDuration, alchemistModifyVal(applyfrom, localDuration, false));
        }
        Map<MapleBuffStat, Integer> localstatups = statups, maskedStatups = null;
        boolean normal = true, showEffect = primary;

        if (!isMonsterRiding()) {
            if (getSourceId() == 1301007) { // 하이퍼 바디
                applyto.cancelEffect(this, -1, localstatups, false); //cancel before apply buff
            } else {
                applyto.cancelEffect(this, -1, localstatups, true); //cancel before apply buff
            }

        }

        switch (sourceid) {
            case 4001003: {
                if (applyto.isHidden()) {
                    return; //don't even apply the buff
                }
                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                stat.put(MapleBuffStat.DARKSIGHT, 0);
                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);

                if (this.statups.containsKey(MapleBuffStat.SPEED) && statups.get(MapleBuffStat.SPEED) == 0) {
                    statups.remove(MapleBuffStat.SPEED);
                }
                break;
            }

            case 1211002: // wk charges
            case 1211003:
            case 1211004:
            case 1211005:
            case 1211006:
            case 1211007:
            case 1211008:
            case 1221003:
            case 1221004: {
                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                stat.put(MapleBuffStat.WK_CHARGE, 1);
                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                break;
            }
            case 1111002:  // Combo
            case 11111001: {
                if (applyto.isHidden()) {
                    break;
                }
                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                stat.put(MapleBuffStat.COMBO, 0);
                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                break;
            }
            case 3101004:
            case 13101003:
            case 3201004: { // Soul Arrow
                if (applyto.isHidden()) {
                    break;
                }
                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                stat.put(MapleBuffStat.SOULARROW, 0);
                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                break;
            }
            case 4211008:
            case 4111002: { // Shadow Partne
                if (applyto.isHidden()) {
                    break;
                }
                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                stat.put(MapleBuffStat.SHADOWPARTNER, 0);
                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                break;
            }
//            case 1211006: // wk charges
//            case 1211004:
//            case 1221004: { // Soul Arrow
//                if (applyto.isHidden()) {
//                    break;
//                }
//                final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
//                stat.put(MapleBuffStat.WK_CHARGE, 1);
//                applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
//                break;
//            }
            case 1121010: // Enrage
                applyto.handleOrbconsume(10);
                break;

            case 8006:
            case 10008006:
            case 20008006:
            case 20018006:
            case 20028006:
            case 30008006:
            case 30018006:
            case 5121009: // Speed Infusion
            case 15111005:
            case 5001005: // Dash
            case 4321000: //tornado spin
            case 15001003: {
                applyto.getClient().getSession().write(TemporaryStatsPacket.givePirate(statups, localDuration / 1000, sourceid));
                if (!applyto.isHidden()) {
                    applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignPirate(statups, localDuration / 1000, applyto.getId(), sourceid), false);
                }
                normal = false;
                break;
            }
            case 5211006: // Homing Beacon
            case 22151002: //killer wings
            case 5220011: {// Bullseye
                if (applyto.getFirstLinkMid() > 0) {
                    applyto.getClient().getSession().write(TemporaryStatsPacket.cancelHoming());
                    applyto.getClient().getSession().write(TemporaryStatsPacket.giveHoming(sourceid, applyto.getFirstLinkMid(), Math.max(1, applyto.getDamageIncrease(applyto.getFirstLinkMid()))));
                } else {
                    return;
                }
                normal = false;
                break;
            }
            //fallthrough intended
            default:
                if (isPirateMorph()) {
                    final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                    stat.put(MapleBuffStat.MORPH, getMorph(applyto));
                    localstatups.put(MapleBuffStat.MORPH, getMorph(applyto));
                    applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                    //applyto.getClient().getSession().write(TemporaryStatsPacket.giveBuff(sourceid, localDuration, stat, this));
                    //maskedStatups = new EnumMap<MapleBuffStat, Integer>(localstatups);
                    //maskedStatups.remove(MapleBuffStat.MORPH);
                    //normal = maskedStatups.size() > 0;
                } else if (isMorph()) {
                    if (applyto.isHidden()) {
                        break;
                    }
                    final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                    stat.put(MapleBuffStat.MORPH, getMorph(applyto));
                    applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                } else if (isMonsterRiding()) {
                    localDuration = 2100000000;
                    final int mountid2 = parseMountInfo_Pure(applyto, sourceid);
                    if (mountid2 != 0) {
                        int ridingLevel = mountid2 - 1902000 + 1;
                        localstatups.put(MapleBuffStat.MONSTER_RIDING, ridingLevel);
                        applyto.cancelEffectFromBuffStat(MapleBuffStat.POWERGUARD);
                        applyto.cancelEffectFromBuffStat(MapleBuffStat.MANA_REFLECTION);
                        normal = false;
                        applyto.getClient().getSession().write(TemporaryStatsPacket.giveBuff(mountid2, sourceid, maskedStatups == null ? localstatups : maskedStatups, this));
                        applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignMount(applyto.getId(), mountid2, 1004, MapleBuffStat.MONSTER_RIDING), false);
                    } else {
                        return;
                    }
                } else if (isBerserkFury() || berserk2 > 0) {
                    if (applyto.isHidden()) {
                        break;
                    }
                    final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                    stat.put(MapleBuffStat.BERSERK_FURY, 1);
                    applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                } else if (isDivineBody()) {
                    if (applyto.isHidden()) {
                        break;
                    }
                    final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                    stat.put(MapleBuffStat.DIVINE_BODY, 1);
                    applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveForeignBuff(applyto.getId(), stat, this), false);
                }
                break;
        }
        if (showEffect && !applyto.isHidden()) {
            applyto.getMap().broadcastMessage(applyto, MaplePacketCreator.showBuffeffect(applyto.getId(), sourceid, 1, applyto.getLevel(), level), false);
        }
        // Broadcast effect to self
        if (normal && localstatups.size() > 0) {
            applyto.getClient().getSession().write(TemporaryStatsPacket.giveBuff((skill ? sourceid : -sourceid), localDuration, maskedStatups == null ? localstatups : maskedStatups, this));
        }
        final long starttime = System.currentTimeMillis();
        final CancelEffectAction cancelAction = new CancelEffectAction(applyto, this, starttime, localstatups);
        final ScheduledFuture<?> schedule = BuffTimer.getInstance().schedule(cancelAction, localDuration);
        applyto.registerEffect(this, starttime, schedule, localstatups, false, localDuration, applyfrom.getId());
    }

    public static final int parseMountInfo(final MapleCharacter player, final int skillid) {
        switch (skillid) {
            case 1004: // Monster riding
                if (player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -118) != null && player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -119) != null) {
                    return player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -118).getItemId();
                }
                return parseMountInfo_Pure(player, skillid);
            default:
                return GameConstants.getMountItem(skillid, player);
        }
    }

    public static final int parseMountInfo_Pure(final MapleCharacter player, final int skillid) {
        switch (skillid) {
            case 10001004:
            case 1004: // Monster riding
                if (player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -18) != null && player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -19) != null) {
                    return player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -18).getItemId();
                }
                return 0;
            default:
                return GameConstants.getMountItem(skillid, player);
        }
    }

    private final int calcHPChange(final MapleCharacter applyfrom, final MapleCharacter applyto, final boolean primary) {
        int hpchange = 0;
        if (hp != 0) {
            if (!skill) {
                if (primary) {
                    hpchange += alchemistModifyVal(applyfrom, hp, true);
                } else {
                    hpchange += hp;
                }
                if (applyto.hasDisease(MapleDisease.ZOMBIFY)) {
                    hpchange /= 2;
                }
            } else { // assumption: this is heal
                hpchange += makeHealHP(hp / 100.0, applyfrom.getStat().getTotalMagic(), 3, 5);
                if (applyto.hasDisease(MapleDisease.ZOMBIFY)) {
                    hpchange = -hpchange;
                }
            }
        }
        if (hpR != 0) {
            hpchange += (int) (applyfrom.getStat().getCurrentMaxHp() * hpR) / (applyto.hasDisease(MapleDisease.ZOMBIFY) ? 2 : 1);
//            hpchange += (int) (applyfrom.getStat().getCurrentMaxHp() * hpR);
        }
        // actually receivers probably never get any hp when it's not heal but whatever
        if (primary) {
            if (hpCon != 0) {
                hpchange -= hpCon;
            }
        }
        switch (this.sourceid) {
            case 4211001: // Chakra
                final PlayerStats stat = applyfrom.getStat();
                int v42 = getY() + 100;
                int v38 = Randomizer.rand(1, 100) + 100;
                hpchange = (int) ((v38 * stat.getLuk() * 0.033 + stat.getDex()) * v42 * 0.002);
                hpchange += makeHealHP(getY() / 100.0, applyfrom.getStat().getTotalLuk(), 2.3, 3.5);
                break;
        }
        return hpchange;
    }

    private static final int makeHealHP(double rate, double stat, double lowerfactor, double upperfactor) {
        return (int) ((Math.random() * ((int) (stat * upperfactor * rate) - (int) (stat * lowerfactor * rate) + 1)) + (int) (stat * lowerfactor * rate));
    }

    private final int calcMPChange(final MapleCharacter applyfrom, final boolean primary) {
        int mpchange = 0;
        if (mp != 0) {
            if (primary) {
                mpchange += alchemistModifyVal(applyfrom, mp, true);
            } else {
                mpchange += mp;
            }
        }
        if (mpR != 0) {
            mpchange += (int) (applyfrom.getStat().getCurrentMaxMp() * mpR);
        }
        if (primary) {
            if (mpCon != 0) {
                if (applyfrom.getBuffedValue(MapleBuffStat.INFINITY) != null) {
                    mpchange = 0;
                } else {
                    Integer s = applyfrom.getBuffedValue(MapleBuffStat.CONCENTRATE);
//                    applyfrom.dropMessage(5, "VAL : " + s);
                    int reduce = 0;
                    if (s != null) {
                        reduce += Math.floor(mpCon * s / 100.0D);
                    }
                    double mod = 1.0;

                    boolean isAFpMage = applyfrom.getJob() == 211 || applyfrom.getJob() == 212;
                    if (isAFpMage || (applyfrom.getJob() == 221 || applyfrom.getJob() == 222)) {
                        if (!overTime && (matk > 0 || watk > 0 || damage != 100)) {
                            Skill amp;
                            if (isAFpMage) {
                                amp = SkillFactory.getSkill(2110001);
                            } else {
                                amp = SkillFactory.getSkill(2210001);
                            }
                            int ampLevel = applyfrom.getSkillLevel(amp);
                            if (ampLevel > 0) {
                                MapleStatEffect ampStat = amp.getEffect(ampLevel);
                                mod = ampStat.getX() / 100.0;
                            }
                        }
                    }
                    mpchange -= ((mpCon * mod) - reduce);

//                    mpchange -= (mpCon - (mpCon * applyfrom.getStat().mpconReduce / 100.0D)) * (applyfrom.getStat().mpconPercent / 100.0);
                }
            }
        }

        return mpchange;
    }

    //from odin
    private int alchemistModifyVal(MapleCharacter chr, int val, boolean withX) {
        if (!skill && chr.getJob() >= 411 && chr.getJob() <= 412) {
            MapleStatEffect alchemistEffect = getAlchemistEffect(chr);
            if (alchemistEffect != null) {
                return (int) (val * ((withX ? alchemistEffect.getX() : alchemistEffect.getY()) / 100.0));
            }
        }
        return val;
    }

    private MapleStatEffect getAlchemistEffect(MapleCharacter chr) {
        Skill alchemist = SkillFactory.getSkill(4110000);
        int alchemistLevel = chr.getSkillLevel(alchemist);
        if (alchemistLevel == 0) {
            return null;
        }
        return alchemist.getEffect(alchemistLevel);
    }

    public final void setSourceId(final int newid) {
        sourceid = newid;
    }

    public final boolean isCanStrongBuff() {
        return sourceid == 2311003
                || sourceid == 3121002
                || sourceid == 3121000
                || sourceid == 1301007
                || sourceid == 4111001;
    }

    public final boolean isGmBuff() {
        switch (sourceid) {
            case 9001000: // GM dispel
            case 9001001: // GM haste
            case 9001002: // GM Holy Symbol
            case 9001003: // GM Bless
            case 9001005: // GM resurrection
                return true;
            default:
                return sourceid == 1005;
        }
    }

    public final boolean isInflation() {
        return inflation > 0;
    }

    public final int getInflation() {
        return inflation;
    }

    public final boolean isEnergyCharge() {
        return skill && (sourceid == 5110001 || sourceid == 15100004);
    }

    private final boolean isMonsterBuff() {
        switch (sourceid) {
            case 1111003: //패닉
            case 1111004:
            case 1111005: //코마
            case 1111006:
            case 1111008: //샤우트
            case 1201006: // 위협
            case 1311006: //로어
            case 2101003: // fp slow
            case 12101001: // 음양사 슬로우
            case 2111004: // fp seal
            case 11111002:
            case 12111002:
            case 11111003:
            case 2201003: // il slow
            case 5011002:
            case 2211004: // il seal
            case 2311005: // doom
            case 4111003: // shadow web
            case 4121004: // Ninja ambush
            case 4221004: // Ninja ambush
                return skill;
        }
        return false;
    }

    public final void setPartyBuff(boolean pb) {
        this.partyBuff = pb;
    }

    private final boolean isPartyBuff() {
        if (lt == null || rb == null || !partyBuff) {
            return false;
        }
        if (isDispel()) {
            return true;
        }
        switch (sourceid) {
            case 1211003:
            case 1211004:
            case 1211005:
            case 1211006:
            case 1211007:
            case 1211008:
            case 1221003:
            case 1221004:
                return false;
        }
        if (GameConstants.isNoDelaySkill(sourceid)) {
            return false;
        }
        return true;
    }

    public final boolean isArcane() {
        return skill && (sourceid == 2320011 || sourceid == 2220010 || sourceid == 2120010);
    }

    public final boolean isHeal() {
        return skill && (sourceid == 2301002 || sourceid == 9101000 || sourceid == 9001000);
    }

    public final boolean isResurrection() {
        return skill && (sourceid == 9001005 || sourceid == 9101005 || sourceid == 2321006);
    }

    public final boolean isTimeLeap() {
        return skill && sourceid == 5121010;
    }

    public final short getHp() {
        return hp;
    }

    public final short getMp() {
        return mp;
    }

    public final double getHpR() {
        return hpR;
    }

    public final double getMpR() {
        return mpR;
    }

    public final byte getMastery() {
        return mastery;
    }

    public final short getWatk() {
        return watk;
    }

    public final short getMatk() {
        return matk;
    }

    public final short getWdef() {
        return wdef;
    }

    public final short getMdef() {
        return mdef;
    }

    public final short getAcc() {
        return acc;
    }

    public final short getAvoid() {
        return avoid;
    }

    public final short getHands() {
        return hands;
    }

    public final short getSpeed() {
        return speed;
    }

    public final short getJump() {
        return jump;
    }

    public final int getDuration() {
        return duration;
    }

    public final boolean isOverTime() {
        return overTime;
    }

    public final Map<MapleBuffStat, Integer> getStatups() {
        return statups;
    }

    public final boolean sameSource(final MapleStatEffect effect) {
        return effect != null && this.sourceid == effect.sourceid && this.skill == effect.skill;
    }

    public final int getCr() {
        return cr;
    }

    public final int getT() {
        return t;
    }

    public final int getU() {
        return u;
    }

    public final int getV() {
        return v;
    }

    public final int getW() {
        return w;
    }

    public final int getX() {
        return x;
    }

    public final int getY() {
        return y;
    }

    public final int getZ() {
        return z;
    }

    public final short getDamage() {
        return damage;
    }

    public final byte getAttackCount() {
        return attackCount;
    }

    public final byte getBulletCount() {
        return bulletCount;
    }

    public final int getBulletConsume() {
        return bulletConsume;
    }

    public final byte getMobCount() {
        return mobCount;
    }

    public final int getMoneyCon() {
        return moneyCon;
    }

    public final int getCooldown() {
        return cooldown;
    }

    public final Map<MonsterStatus, Integer> getMonsterStati() {
        return monsterStatus;
    }

    public final int getBerserk() {
        return berserk;
    }

    public final boolean isHide() {
        return skill && (sourceid == 9001004 || sourceid == 9101004);
    }

    public final boolean isDragonBlood() {
        return skill && sourceid == 1311008;
    }

    public final boolean isRecovery() {
        return skill && (sourceid == 1001 || sourceid == 10001001 || sourceid == 20001001 || sourceid == 20011001 || sourceid == 20021001 || sourceid == 11001 || sourceid == 35121005);
    }

    public final boolean isBerserk() {
        return skill && sourceid == 1320006;
    }

    public final boolean isBeholder() {
        return skill && sourceid == 1321007;
    }

    public final boolean isMPRecovery() {
        return skill && sourceid == 5101005;
    }

    public final boolean isInfinity() {
        return skill && (sourceid == 2121004 || sourceid == 2221004 || sourceid == 2321004);
    }

    public final boolean isMonsterRiding_() {
        return skill && sourceid == 1004;
    }

    public final boolean isMonsterRiding() {
        return skill && (isMonsterRiding_() || GameConstants.getMountItem(sourceid, null) != 0);
    }

    public final boolean isMagicDoor() {
        return skill && sourceid == 2311002;
    }

    public final boolean isMesoGuard() {
        return skill && sourceid == 4211005;
    }

    public final boolean isMechDoor() {
        return skill && sourceid == 35101005;
    }

    public final boolean isComboRecharge() {
        return skill && sourceid == 21111009;
    }

    public final boolean isDragonBlink() {
        return skill && sourceid == 22141004;
    }

    public final boolean isCharge() {
        switch (sourceid) {
            case 1211003:
            case 1211008:
                return skill;
        }
        return false;
    }

    public final boolean isPoison() {
        return (dot > 0 && dotTime > 0) || sourceid == 2101005 || sourceid == 2111006 || sourceid == 2121003 || sourceid == 2221003 || sourceid == 5211004;
    }

    private final boolean isMist() {
        return skill && (sourceid == 12111005 || sourceid == 14111006 || sourceid == 2111003 || sourceid == 4221006); // poison mist
    }

    private final boolean isSpiritClaw() {
        return skill && sourceid == 4121006;
    }

    private final boolean isDispel() {
        return skill && (sourceid == 2311001 || sourceid == 5001000);
    }

    private final boolean isHeroWill() {
        switch (sourceid) {
            case 1121011:
            case 1221012:
            case 1321010:
            case 2121008:
            case 2221008:
            case 2321009:
            case 3121009:
            case 3221008:
            case 4121009:
            case 4221008:
            case 5121008:
            case 5221010:
            case 21121008:
            case 22171004:
            case 4341008:
            case 32121008:
            case 33121008:
            case 35121008:
            case 5321008:
            case 23121008:
                return skill;
        }
        return false;
    }

    public final boolean isAranCombo() {
        return sourceid == 21000000;
    }

    public final boolean isCombo() {
        switch (sourceid) {
            case 1111002:
            case 11111001: // Combo
                return skill;
        }
        return false;
    }

    public final boolean isPirateMorph() {
        switch (sourceid) {
            case 13111005:
            case 15111002:
            case 5111005:
            case 5121003:
                return skill;
        }
        return false;
    }

    public final boolean isMorph() {
        return morphId > 0;
    }

    public final int getMorph() {
        switch (sourceid) {
            case 15111002:
                return 1211;
            case 5111005:
                return 1000;
            case 5121003:
                return 1001;
            case 5101007:
                return 1002;
            case 13111005:
                return 1003;
        }
        return morphId;
    }

    public final boolean isDivineBody() {
        return skill && GameConstants.isBeginnerJob(sourceid / 10000) && sourceid % 10000 == 1010;
    }

    public final boolean isDivineShield() {
        switch (sourceid) {
            case 1220013:
                return skill;
        }
        return false;
    }

    public final boolean isBerserkFury() {
        return skill && GameConstants.isBeginnerJob(sourceid / 10000) && sourceid % 10000 == 1011;
    }

    public final int getMorph(final MapleCharacter chr) {
        final int morph = getMorph();
        switch (morph) {
            case 1211:
                return morph;
            case 1003:
            case 1000:
            case 1001:
                return morph + (chr.getGender() == 1 ? 100 : 0);
        }
        return morph;
    }

    public final byte getLevel() {
        return level;
    }

    public final SummonMovementType getSummonMovementType() {
        if (!skill) {
            return null;
        }
        switch (sourceid) {
            case 3211002: // puppet sniper
            case 3111002: // puppet ranger
            case 13111004:
            case 3120012:
            case 3220012:
            case 5211001:
            case 5220002:
                return SummonMovementType.STATIONARY;
            case 3211005: // golden eagle
            case 3111005: // golden hawk
            case 3101007:
            case 3201007:
            case 2311006: // summon dragon
            case 3221005: // frostprey
            case 3121006: // phoenix
                return SummonMovementType.CIRCLE_FOLLOW;
            case 5211002: // bird - pirate
                return SummonMovementType.CIRCLE_STATIONARY;
            case 1321007: // beholder
            case 2121005: // elquines
            case 2221005: // ifrit
            case 12111004:
            case 2321003: // bahamut
            case 11001004:
            case 12001004:
            case 13001004:
            case 14001005:
            case 15001004:
                return SummonMovementType.FOLLOW;
        }
        return null;
    }

    public final boolean isAngel() {
        return GameConstants.isAngel(sourceid);
    }

    public final boolean isSkill() {
        return skill;
    }

    public final int getSourceId() {
        return sourceid;
    }

    public final boolean isIceKnight() {
        return skill && GameConstants.isBeginnerJob(sourceid / 10000) && sourceid % 10000 == 1105;
    }

    public final boolean isSoaring() {
        return isSoaring_Normal() || isSoaring_Mount();
    }

    public final boolean isSoaring_Normal() {
        return skill && GameConstants.isBeginnerJob(sourceid / 10000) && sourceid % 10000 == 1026;
    }

    public final boolean isSoaring_Mount() {
        return skill && ((GameConstants.isBeginnerJob(sourceid / 10000) && sourceid % 10000 == 1142) || sourceid == 80001089);
    }

    /*    public final boolean isFinalAttack() {
     switch (sourceid) {
     case 13101002:
     case 11101002:
     return skill;
     }
     return false;
     }*/
    public final boolean isMistEruption() {
        switch (sourceid) {
            case 2111003:
                return skill;
        }
        return false;
    }

    public final boolean isShadow() {
        switch (sourceid) {
            case 4111002: // shadowpartner
            case 4211008:
                return skill;
        }
        return false;
    }

    /**
     *
     * @return true if the effect should happen based on it's probablity, false
     * otherwise
     */
    public final boolean makeChanceResult() {
        return prop >= 100 || Randomizer.nextInt(100) < prop;
    }

    public final short getProb() {
        return prop;
    }

    public final short getIgnoreMob() {
        return ignoreMob;
    }

    public final short getDOT() {
        return dot;
    }

    public final short getDOTTime() {
        return dotTime;
    }

    public final short getMesoRate() {
        return mesoR;
    }

    public final int getEXP() {
        return exp;
    }

    public final short getAttackX() {
        return padX;
    }

    public final short getMagicX() {
        return madX;
    }

    public final int getPercentHP() {
        return mhpR;
    }

    public final int getPercentMP() {
        return mmpR;
    }

    public final int getConsume() {
        return consumeOnPickup;
    }

    public final int getSelfDestruction() {
        return selfDestruction;
    }

    public final int getCharColor() {
        return charColor;
    }

    public final List<Integer> getPetsCanConsume() {
        return petsCanConsume;
    }

    public final int getRange() {
        return range;
    }

    public final short getER() {
        return er;
    }

    public final int getPrice() {
        return price;
    }

    public final int getExtendPrice() {
        return extendPrice;
    }

    public final byte getPeriod() {
        return period;
    }

    public final short getLifeID() {
        return lifeId;
    }

    public final short getUseLevel() {
        return useLevel;
    }

    public final byte getSlotCount() {
        return slotCount;
    }

    public final short getMPConReduce() {
        return mpConReduce;
    }

    public final byte getType() {
        return type;
    }

    public int getInterval() {
        return interval;
    }

    public ArrayList<Pair<Integer, Integer>> getAvailableMaps() {
        return availableMap;
    }

    public final void applyEnergyBuff(final MapleCharacter applyto, final boolean infinity) {
        final long starttime = System.currentTimeMillis();
        if (infinity) {
            applyto.getClient().getSession().write(TemporaryStatsPacket.giveEnergyChargeTest(0, duration / 1000));
            applyto.registerEffect(this, starttime, null, applyto.getId());
        } else {
            final EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
            stat.put(MapleBuffStat.ENERGY_CHARGE, 10000);
            applyto.cancelEffect(this, -1, stat, true);
            applyto.getClient().getSession().write(TemporaryStatsPacket.giveEnergyChargeTest(10000, duration / 1000));
            applyto.getMap().broadcastMessage(applyto, TemporaryStatsPacket.giveEnergyChargeTest(applyto.getId(), 10000, duration / 1000), false);
            final CancelEffectAction cancelAction = new CancelEffectAction(applyto, this, starttime, stat);
            final ScheduledFuture<?> schedule = BuffTimer.getInstance().schedule(cancelAction, ((starttime + duration) - System.currentTimeMillis()));
            applyto.registerEffect(this, starttime, schedule, stat, false, duration, applyto.getId());

        }
    }

    public static class CancelEffectAction implements Runnable {

        private final MapleStatEffect effect;
        private final WeakReference<MapleCharacter> target;
        private final long startTime;
        private final Map<MapleBuffStat, Integer> statup;

        public CancelEffectAction(final MapleCharacter target, final MapleStatEffect effect, final long startTime, final Map<MapleBuffStat, Integer> statup) {
            this.effect = effect;
            this.target = new WeakReference<MapleCharacter>(target);
            this.startTime = startTime;
            this.statup = statup;
        }

        @Override
        public void run() {
            final MapleCharacter realTarget = target.get();
            if (realTarget != null) {
                realTarget.cancelEffect(effect, startTime, statup, true);
            }
        }
    }
}
