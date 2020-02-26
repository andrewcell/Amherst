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
package client;

import client.status.MonsterStatus;
import constants.GameConstants;
import java.awt.Point;
import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataFileEntry;
import provider.MapleDataProviderFactory;
import provider.MapleDataDirectoryEntry;
import provider.MapleDataTool;
import server.Randomizer;
import tools.StringUtil;
import tools.Triple;

public class SkillFactory {

    private static final Map<Integer, Skill> skills = new HashMap<Integer, Skill>();
    private static final Map<String, Integer> delays = new HashMap<String, Integer>();
    private static final Map<Integer, CraftingEntry> crafts = new HashMap<Integer, CraftingEntry>();
    private static final Map<Integer, FamiliarEntry> familiars = new HashMap<Integer, FamiliarEntry>();
    private static final Map<Integer, List<Integer>> skillsByJob = new HashMap<Integer, List<Integer>>();
    private static final Map<Integer, SummonSkillEntry> SummonSkillInformation = new HashMap<Integer, SummonSkillEntry>();

    public static void load() {
        final MapleData delayData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wz_path") + "/Character.wz")).getData("00002000.img");
        final MapleData stringData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wz_path") + "/String.wz")).getData("Skill.img");
        final MapleDataProvider datasource = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wz_path") + "/Skill.wz"));
        final MapleDataDirectoryEntry root = datasource.getRoot();
        int del = 0; //buster is 67 but its the 57th one!
        for (MapleData delay : delayData) {
            if (!delay.getName().equals("info")) {
                delays.put(delay.getName(), del);
                del++;
            }
        }

        int skillid;
        MapleData summon_data;
        SummonSkillEntry sse;

        for (MapleDataFileEntry topDir : root.getFiles()) { // Loop thru jobs
            if (topDir.getName().length() <= 8) {
                for (MapleData data : datasource.getData(topDir.getName())) { // Loop thru each jobs
                    if (data.getName().equals("skill")) {
                        for (MapleData data2 : data) { // Loop thru each jobs
                            if (data2 != null) {
                                skillid = Integer.parseInt(data2.getName());
                                Skill skil = Skill.loadFromData(skillid, data2, delayData);
                                List<Integer> job = skillsByJob.get(skillid / 10000);
                                if (job == null) {
                                    job = new ArrayList<Integer>();
                                    skillsByJob.put(skillid / 10000, job);
                                }
                                job.add(skillid);
                                skil.setName(getName(skillid, stringData));
                                skills.put(skillid, skil);

                                summon_data = data2.getChildByPath("summon/attack1/info");
                                if (summon_data != null) {
                                    sse = new SummonSkillEntry();
                                    sse.type = (byte) MapleDataTool.getInt("type", summon_data, 0);
                                    sse.mobCount = (byte) MapleDataTool.getInt("mobCount", summon_data, 1);
                                    sse.attackCount = (byte) MapleDataTool.getInt("attackCount", summon_data, 1);
                                    if (summon_data.getChildByPath("range/lt") != null) {
                                        final MapleData ltd = summon_data.getChildByPath("range/lt");
                                        sse.lt = (Point) ltd.getData();
                                        sse.rb = (Point) summon_data.getChildByPath("range/rb").getData();
                                    } else {
                                        sse.lt = new Point(-100, -100);
                                        sse.rb = new Point(100, 100);
                                    }
                                    //sse.range = (short) MapleDataTool.getInt("range/r", summon_data, 0);
                                    sse.delay = MapleDataTool.getInt("effectAfter", summon_data, 0) + MapleDataTool.getInt("attackAfter", summon_data, 0);
                                    for (MapleData effect : summon_data) {
                                        if (effect.getChildren().size() > 0) {
                                            for (final MapleData effectEntry : effect) {
                                                sse.delay += MapleDataTool.getIntConvert("delay", effectEntry, 0);
                                            }
                                        }
                                    }
                                    for (MapleData effect : data2.getChildByPath("summon/attack1")) {
                                        sse.delay += MapleDataTool.getIntConvert("delay", effect, 0);
                                    }
                                    SummonSkillInformation.put(skillid, sse);
                                }
                            }
                        }
                    }
                }
            } else if (topDir.getName().startsWith("Familiar")) {
                for (MapleData data : datasource.getData(topDir.getName())) {
                    skillid = Integer.parseInt(data.getName());
                    FamiliarEntry skil = new FamiliarEntry();
                    skil.prop = (byte) MapleDataTool.getInt("prop", data, 0);
                    skil.time = (byte) MapleDataTool.getInt("time", data, 0);
                    skil.attackCount = (byte) MapleDataTool.getInt("attackCount", data, 1);
                    skil.targetCount = (byte) MapleDataTool.getInt("targetCount", data, 1);
                    skil.speed = (byte) MapleDataTool.getInt("speed", data, 1);
                    skil.knockback = MapleDataTool.getInt("knockback", data, 0) > 0 || MapleDataTool.getInt("attract", data, 0) > 0;
                    if (data.getChildByPath("lt") != null) {
                        skil.lt = (Point) data.getChildByPath("lt").getData();
                        skil.rb = (Point) data.getChildByPath("rb").getData();
                    }
                    if (MapleDataTool.getInt("stun", data, 0) > 0) {
                        skil.status.add(MonsterStatus.STUN);
                    }
                    //if (MapleDataTool.getInt("poison", data, 0) > 0) {
                    //	status.add(MonsterStatus.POISON);
                    //}
                    if (MapleDataTool.getInt("slow", data, 0) > 0) {
                        skil.status.add(MonsterStatus.SPEED);
                    }
                    familiars.put(skillid, skil);
                }
                
            } else if (topDir.getName().startsWith("Recipe")) {
                for (MapleData data : datasource.getData(topDir.getName())) {
                    skillid = Integer.parseInt(data.getName());
                    CraftingEntry skil = new CraftingEntry(skillid, (byte) MapleDataTool.getInt("incFatigability", data, 0), (byte) MapleDataTool.getInt("reqSkillLevel", data, 0), (byte) MapleDataTool.getInt("incSkillProficiency", data, 0), MapleDataTool.getInt("needOpenItem", data, 0) > 0, MapleDataTool.getInt("period", data, 0));
                    for (MapleData d : data.getChildByPath("target")) {
                        skil.targetItems.add(new Triple<Integer, Integer, Integer>(MapleDataTool.getInt("item", d, 0), MapleDataTool.getInt("count", d, 0), MapleDataTool.getInt("probWeight", d, 0)));
                    }
                    for (MapleData d : data.getChildByPath("recipe")) {
                        skil.reqItems.put(MapleDataTool.getInt("item", d, 0), MapleDataTool.getInt("count", d, 0));
                    }
                    crafts.put(skillid, skil);
                }
            }
        }
    }

    public static List<Integer> getSkillsByJob(final int jobId) {
        return skillsByJob.get(jobId);
    }

    public static String getSkillName(final int id) {
        Skill skil = getSkill(id);
        if (skil != null) {
            return skil.getName();
        }
        return null;
    }

    public static Integer getDelay(final String id) {
        if (Delay.fromString(id) != null) {
            return Delay.fromString(id).i;
        }
        return delays.get(id);
    }

    private static String getName(final int id, final MapleData stringData) {
        String strId = Integer.toString(id);
        strId = StringUtil.getLeftPaddedStr(strId, '0', 7);
        MapleData skillroot = stringData.getChildByPath(strId);
        if (skillroot != null) {
            return MapleDataTool.getString(skillroot.getChildByPath("name"), "");
        }
        return "";
    }

    public static SummonSkillEntry getSummonData(final int skillid) {
        return SummonSkillInformation.get(skillid);
    }

    public static Collection<Skill> getAllSkills() {
        return skills.values();
    }

    public static Skill getSkill(final int id) {
        if (!skills.isEmpty()) {
            if (id >= 92000000 && crafts.containsKey(Integer.valueOf(id))) { //92000000
                return crafts.get(Integer.valueOf(id));
            }
            return skills.get(Integer.valueOf(id));
        }

        return null;
    }

    public static CraftingEntry getCraft(final int id) {
        if (!crafts.isEmpty()) {
            return crafts.get(Integer.valueOf(id));
        }

        return null;
    }

    public static FamiliarEntry getFamiliar(final int id) {
        if (!familiars.isEmpty()) {
            return familiars.get(Integer.valueOf(id));
        }

        return null;
    }

    public static class CraftingEntry extends Skill {
        //reqSkillProficiency -> always seems to be 0

        public boolean needOpenItem;
        public int period;
        public byte incFatigability, reqSkillLevel, incSkillProficiency;
        public List<Triple<Integer, Integer, Integer>> targetItems = new ArrayList<Triple<Integer, Integer, Integer>>(); // itemId / amount / probability
        public Map<Integer, Integer> reqItems = new HashMap<Integer, Integer>(); // itemId / amount

        public CraftingEntry(int id, byte incFatigability, byte reqSkillLevel, byte incSkillProficiency, boolean needOpenItem, int period) {
            super(id);
            this.incFatigability = incFatigability;
            this.reqSkillLevel = reqSkillLevel;
            this.incSkillProficiency = incSkillProficiency;
            this.needOpenItem = needOpenItem;
            this.period = period;
        }
    }

    public static class FamiliarEntry {

        public byte prop, time, attackCount, targetCount, speed;
        public Point lt, rb;
        public boolean knockback;
        public EnumSet<MonsterStatus> status = EnumSet.noneOf(MonsterStatus.class);

        public final boolean makeChanceResult() {
            return prop >= 100 || Randomizer.nextInt(100) < prop;
        }
    }

    public static enum Delay {

        walk1(0x00),
        walk2(0x01),
        stand1(0x02),
        stand2(0x03),
        alert(0x04),
        swingO1(0x05),
        swingO2(0x06),
        swingO3(0x07),
        swingOF(0x08),
        swingT1(0x09),
        swingT2(0x0A),
        swingT3(0x0B),
        swingTF(0x0C),
        swingP1(0x0D),
        swingP2(0x0E),
        swingPF(0x0F),
        stabO1(0x10),
        stabO2(0x11),
        stabOF(0x12),
        stabT1(0x13),
        stabT2(0x14),
        stabTF(0x15),
        swingD1(0x16),
        swingD2(0x17),
        stabD1(0x18),
        swingDb1(0x19),
        swingDb2(0x1A),
        swingC1(0x1B),
        swingC2(0x1C),
        rushBoom(0x1C),
        tripleBlow(0x19),
        quadBlow(0x1A),
        deathBlow(0x1B),
        finishBlow(0x1C),
        finishAttack(0x1D),
        finishAttack_link(0x1E),
        finishAttack_link2(0x1E),
        shoot1(0x1F),
        shoot2(0x20),
        shootF(0x21),
        shootDb2(0x28),
        shotC1(0x29),
        dash(0x25),
        dash2(0x26), //hack. doesn't really exist
        proneStab(0x29),
        prone(0x2A),
        heal(0x2B),
        fly(0x2C),
        jump(0x2D),
        sit(0x2E),
        rope(0x2F),
        dead(0x30),
        ladder(0x31),
        rain(0x32),
        alert2(0x34),
        alert3(0x35),
        alert4(0x36),
        alert5(0x37),
        alert6(0x38),
        alert7(0x39),
        ladder2(0x3A),
        rope2(0x3B),
        shoot6(0x3C),
        magic1(0x3D),
        magic2(0x3E),
        magic3(0x3F),
        magic5(0x40),
        magic6(0x41),
        explosion(0x41),
        burster1(0x42),
        burster2(0x43),
        savage(0x44),
        avenger(0x45),
        assaulter(0x46),
        prone2(0x47),
        assassination(0x48),
        assassinationS(0x49),
        tornadoDash(0x4C),
        tornadoDashStop(0x4C),
        tornadoRush(0x4C),
        rush(0x4D),
        rush2(0x4E),
        brandish1(0x4F),
        brandish2(0x50),
        braveSlash(0x51),
        braveslash1(0x51),
        braveslash2(0x51),
        braveslash3(0x51),
        braveslash4(0x51),
        darkImpale(0x61),
        sanctuary(0x52),
        meteor(0x53),
        paralyze(0x54),
        blizzard(0x55),
        genesis(0x56),
        blast(0x58),
        smokeshell(0x59),
        showdown(0x5A),
        ninjastorm(0x5B),
        chainlightning(0x5C),
        holyshield(0x5D),
        resurrection(0x5E),
        somersault(0x5F),
        straight(0x60),
        eburster(0x61),
        backspin(0x62),
        eorb(0x63),
        screw(0x64),
        doubleupper(0x65),
        dragonstrike(0x66),
        doublefire(0x67),
        triplefire(0x68),
        fake(0x69),
        airstrike(0x6A),
        edrain(0x6B),
        octopus(0x6C),
        backstep(0x6D),
        shot(0x6E),
        rapidfire(0x6E),
        fireburner(0x70),
        coolingeffect(0x71),
        fist(0x72),
        timeleap(0x73),
        homing(0x75),
        ghostwalk(0x76),
        ghoststand(0x77),
        ghostjump(0x78),
        ghostproneStab(0x79),
        ghostladder(0x7A),
        ghostrope(0x7B),
        ghostfly(0x7C),
        ghostsit(0x7D),
        cannon(0x7E),
        torpedo(0x7F),
        darksight(0x80),
        bamboo(0x81),
        pyramid(0x82),
        wave(0x83),
        blade(0x84),
        souldriver(0x85),
        firestrike(0x86),
        flamegear(0x87),
        stormbreak(0x88),
        vampire(0x89),
        swingT2PoleArm(0x8B),
        swingP1PoleArm(0x8C),
        swingP2PoleArm(0x8D),
        doubleSwing(0x8E),
        tripleSwing(0x8F),
        fullSwingDouble(0x90),
        fullSwingTriple(0x91),
        overSwingDouble(0x92),
        overSwingTriple(0x93),
        rollingSpin(0x94),
        comboSmash(0x95),
        comboFenrir(0x96),
        comboTempest(0x97),
        finalCharge(0x98),
        finalBlow(0x9A),
        finalToss(0x9B),
        magicmissile(0x9C),
        lightningBolt(0x9D),
        dragonBreathe(0x9E),
        breathe_prepare(0x9F),
        dragonIceBreathe(0xA0),
        icebreathe_prepare(0xA1),
        blaze(0xA2),
        fireCircle(0xA3),
        illusion(0xA4),
        magicFlare(0xA5),
        elementalReset(0xA6),
        magicRegistance(0xA7),
        magicBooster(0xA8),
        magicShield(0xA9),
        recoveryAura(0xAA),
        flameWheel(0xAB),
        killingWing(0xAC),
        OnixBlessing(0xAD),
        Earthquake(0xAE),
        soulStone(0xAF),
        dragonThrust(0xB0),
        ghostLettering(0xB1),
        darkFog(0xB2),
        slow(0xB3),
        mapleHero(0xB4),
        Awakening(0xB5),
        flyingAssaulter(0xB6),
        tripleStab(0xB7),
        fatalBlow(0xB8),
        slashStorm1(0xB9),
        slashStorm2(0xBA),
        bloodyStorm(0xBB),
        flashBang(0xBC),
        upperStab(0xBD),
        bladeFury(0xBE),
        chainPull(0xC0),
        chainAttack(0xC0),
        owlDead(0xC1),
        monsterBombPrepare(0xC3),
        monsterBombThrow(0xC3),
        finalCut(0xC4),
        finalCutPrepare(0xC4),
        suddenRaid(0xC6), //idk, not in data anymore
        fly2(0xC7),
        fly2Move(0xC8),
        fly2Skill(0xC9),
        knockback(0xCA),
        rbooster_pre(0xCE),
        rbooster(0xCE),
        rbooster_after(0xCE),
        crossRoad(0xD1),
        nemesis(0xD2),
        tank(0xD9),
        tank_laser(0xDD),
        siege_pre(0xDF),
        tank_siegepre(0xDF), //just to make it work with the skill, these two
        sonicBoom(0xE2),
        darkLightning(0xE4),
        darkChain(0xE5),
        cyclone_pre(0),
        cyclone(0), //energy attack
        glacialchain(0xF7),
        flamethrower(0xE9),
        flamethrower_pre(0xE9),
        flamethrower2(0xEA),
        flamethrower_pre2(0xEA),
        gatlingshot(0xEF),
        gatlingshot2(0xF0),
        drillrush(0xF1),
        earthslug(0xF2),
        rpunch(0xF3),
        clawCut(0xF4),
        swallow(0xF7),
        swallow_attack(0xF7),
        swallow_loop(0xF7),
        flashRain(0xF9),
        OnixProtection(0x108),
        OnixWill(0x109),
        phantomBlow(0x10A),
        comboJudgement(0x10B),
        arrowRain(0x10C),
        arrowEruption(0x10D),
        iceStrike(0x10E),
        swingT2Giant(0x111),
        cannonJump(0x127),
        swiftShot(0x128),
        giganticBackstep(0x12A),
        mistEruption(0x12B),
        cannonSmash(0x12C),
        cannonSlam(0x12D),
        flamesplash(0x12E),
        noiseWave(0x132),
        superCannon(0x136),
        jShot(0x138),
        demonSlasher(0x139),
        bombExplosion(0x13A),
        cannonSpike(0x13B),
        speedDualShot(0x13C),
        strikeDual(0x13D),
        bluntSmash(0x13F),
        crossPiercing(0x140),
        piercing(0x141),
        elfTornado(0x143),
        immolation(0x144),
        multiSniping(0x147),
        windEffect(0x148),
        elfrush(0x149),
        elfrush2(0x149),
        dealingRush(0x14E),
        maxForce0(0x150),
        maxForce1(0x151),
        maxForce2(0x152),
        maxForce3(0x153),
        //special: pirate morph attacks
        iceAttack1(0x112),
        iceAttack2(0x113),
        iceSmash(0x114),
        iceTempest(0x115),
        iceChop(0x116),
        icePanic(0x117),
        iceDoubleJump(0x118),
        shockwave(0x124),
        demolition( 0x125),
        snatch( 0x126),
        windspear(0x127),
        windshot(0x128);
        public int i;

        private Delay(int i) {
            this.i = i;
        }

        public static Delay fromString(String s) {
            for (Delay b : Delay.values()) {
                if (b.name().equalsIgnoreCase(s)) {
                    return b;
                }
            }
            return null;
        }
    }
}
