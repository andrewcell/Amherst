package constants

import client.*
import client.inventory.Equip
import client.inventory.MapleInventoryType
import client.inventory.MapleWeaponType
import client.status.MonsterStatus
import server.MapleItemInformationProvider
import server.MapleStatEffect
import server.Randomizer
import server.maps.MapleMapObjectType
import tools.FileoutputUtil
import tools.MaplePacketCreator
import java.awt.Point
import java.util.*

object GameConstants {
    @JvmField
    var KMS = true

    private val player: MapleCharacter? = null

    @JvmField
    val rangedMapobjectTypes = Collections.unmodifiableList(Arrays.asList(
            MapleMapObjectType.ITEM,
            MapleMapObjectType.MONSTER,
            MapleMapObjectType.DOOR,
            MapleMapObjectType.REACTOR,
            MapleMapObjectType.SUMMON,
            MapleMapObjectType.PLAYER,
            MapleMapObjectType.NPC,
            MapleMapObjectType.MIST))

    private val exp = intArrayOf(0, 15, 34, 57, 92, 135, 372, 560, 840, 1242, 1716, 2360, 3216, 4200, 5460, 7050, 8840, 11040, 13716, 16680, 20216, 24402, 28980, 34320, 40512, 47216, 54900, 63666, 73080, 83720, 95700, 108480, 122760, 138666, 155540, 174216, 194832, 216600, 240500, 266682, 294216, 324240, 356916, 391160, 428280, 468450, 510420, 555680, 604416, 655200, 709716, 748608, 789631, 832902, 878545, 926689, 977471, 1031036, 1087536, 1147032, 1209994, 1276301, 1346242, 1420016, 1497832, 1579913, 1666492, 1757815, 1854143, 1955750, 2062925, 2175973, 2295216, 2420993, 2553663, 2693603, 2841212, 2996910, 3161140, 3334370, 3517093, 3709829, 3913127, 4127566, 4353756, 4592341, 4844001, 5109452, 5389449, 5684790, 5996316, 6324914, 6671519, 7037118, 7422752, 7829518, 8258575, 8711144, 9188514, 9692044, 10223168, 10783397, 11374327, 11997640, 12655110, 13348610, 14080113, 14851703, 15665576, 16524049, 17429566, 18384706, 19392187, 20454878, 21575805, 22758159, 24005306, 25320796, 26708375, 28171993, 29715818, 31344244, 33061908, 34873700, 36784778, 38800583, 40926854, 43169645, 45535341, 48030677, 50662758, 53439077, 56367538, 59456479, 62714694, 66151459, 69776558, 73600313, 77633610, 81887931, 86375389, 91108760, 96101520, 101367883, 106992842, 112782213, 118962678, 125481832, 132358236, 139611467, 147262175, 155332142, 163844343, 172823012, 182293713, 192283408, 202820538, 213935103, 225658746, 238024845, 251068606, 264827165, 279339639, 294647508, 310794191, 327825712, 345790561, 364739883, 384727628, 405810702, 428049128, 451506220, 476248760, 502347192, 529875818, 558913012, 589541445, 621848316, 655925603, 691870326, 729784819, 769777027, 811960808, 856456260, 903390063, 952895838, 1005114529, 1060194805, 1118293480, 1179575962, 1244216724, 1312399800, 1384319309, 1460180007, 1540197871, 1624600714, 1713628833, 1807535693, 1906558648, 2011069705, 2121276324)
    private val closeness = intArrayOf(0, 1, 3, 6, 14, 31, 60, 108, 181, 287, 434, 632, 891, 1224, 1642, 2161, 2793,
            3557, 4467, 5542, 6801, 8263, 9950, 11882, 14084, 16578, 19391, 22547, 26074,
            30000)
    private val setScore = intArrayOf(0, 10, 100, 300, 600, 1000, 2000, 4000, 7000, 10000)
    private val cumulativeTraitExp = intArrayOf(0, 20, 46, 80, 124, 181, 255, 351, 476, 639, 851, 1084,
            1340, 1622, 1932, 2273, 2648, 3061, 3515, 4014, 4563, 5128,
            5710, 6309, 6926, 7562, 8217, 8892, 9587, 10303, 11040, 11788,
            12547, 13307, 14089, 14883, 15689, 16507, 17337, 18179, 19034, 19902,
            20783, 21677, 22584, 23505, 24440, 25399, 26362, 27339, 28331, 29338,
            30360, 31397, 32450, 33519, 34604, 35705, 36823, 37958, 39110, 40279,
            41466, 32671, 43894, 45135, 46395, 47674, 48972, 50289, 51626, 52967,
            54312, 55661, 57014, 58371, 59732, 61097, 62466, 63839, 65216, 66597,
            67982, 69371, 70764, 72161, 73562, 74967, 76376, 77789, 79206, 80627,
            82052, 83481, 84914, 86351, 87792, 89237, 90686, 92139, 93596, 96000)
    private val mobHpVal = intArrayOf(0, 15, 20, 25, 35, 50, 65, 80, 95, 110, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350,
            375, 405, 435, 465, 495, 525, 580, 650, 720, 790, 900, 990, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
            1900, 2000, 2100, 2200, 2300, 2400, 2520, 2640, 2760, 2880, 3000, 3200, 3400, 3600, 3800, 4000, 4300, 4600, 4900, 5200,
            5500, 5900, 6300, 6700, 7100, 7500, 8000, 8500, 9000, 9500, 10000, 11000, 12000, 13000, 14000, 15000, 17000, 19000, 21000, 23000,
            25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 43000, 45000, 47000, 49000, 51000, 53000, 55000, 57000, 59000, 61000, 63000,
            65000, 67000, 69000, 71000, 73000, 75000, 77000, 79000, 81000, 83000, 85000, 89000, 91000, 93000, 95000, 97000, 99000, 101000, 103000,
            105000, 107000, 109000, 111000, 113000, 115000, 118000, 120000, 125000, 130000, 135000, 140000, 145000, 150000, 155000, 160000, 165000, 170000, 175000, 180000,
            185000, 190000, 195000, 200000, 205000, 210000, 215000, 220000, 225000, 230000, 235000, 240000, 250000, 260000, 270000, 280000, 290000, 300000, 310000, 320000,
            330000, 340000, 350000, 360000, 370000, 380000, 390000, 400000, 410000, 420000, 430000, 440000, 450000, 460000, 470000, 480000, 490000, 500000, 510000, 520000,
            530000, 550000, 570000, 590000, 610000, 630000, 650000, 670000, 690000, 710000, 730000, 750000, 770000, 790000, 810000, 830000, 850000, 870000, 890000, 910000)
    private val pvpExp = intArrayOf(0, 3000, 6000, 12000, 24000, 48000, 960000, 192000, 384000, 768000)
    private val guildexp = intArrayOf(0, 20000, 160000, 540000, 1280000, 2500000, 4320000, 6860000, 10240000, 14580000)
    private val mountexp = intArrayOf(0, 6, 25, 50, 105, 134, 196, 254, 263, 315, 367, 430, 543, 587, 679, 725, 897, 1146, 1394, 1701, 2247,
            2543, 2898, 3156, 3313, 3584, 3923, 4150, 4305, 4550)
    @JvmField
    val itemBlock = intArrayOf(4001168, 5220013, 3993003, 2340000, 2049100, 4001129, 2040037, 2040006, 2040007, 2040303, 2040403, 2040506, 2040507, 2040603, 2040709, 2040710, 2040711, 2040806, 2040903, 2041024, 2041025, 2043003, 2043103, 2043203, 2043303, 2043703, 2043803, 2044003, 2044103, 2044203, 2044303, 2044403, 2044503, 2044603, 2044908, 2044815, 2044019, 2044703)
    @JvmField
    val cashBlock = intArrayOf(0 /*5080001, 5080000, 5063000, 5064000, 5660000, 5660001, 5222027, 5530172, 5530173, 5530174, 5530175, 5530176, 5530177, 5251016, 5534000, 5152053, 5152058, 5150044, 5150040, 5220082, 5680021, 5150050, 5211091, 5211092, 5220087, 5220088, 5220089, 5220090, 5220085, 5220086, 5470000, 1002971, 1052202, 5060003, 5060004, 5680015, 5220082, 5530146, 5530147, 5530148, 5710000, 5500000, 5500001, 5500002, 5500002, 5500003, 5500004, 5500005, 5500006, 5075000, 5075001, 5075002, 1122121, 5450000, 5190005, 5190007, 5600000, 5600001, 5350003, 2300002, 2300003, 5062000, 5062001, 5211071, 5211072, 5211073, 5211074, 5211075, 5211076, 5211077, 5211078, 5211079, 5650000, 5431000, 5431001, 5432000, 5450000, 5550000, 5550001, 5640000, 5530013, 5150039, 5150040, 5150046, 5150054, 5150052, 5150053, 5151035, 5151036, 5152053, 5152056, 5152057, 5152058, 1812006, 5650000, 5222000, 5221001, 5220014, 5220015, 5420007, 5451000,
     5210000, 5210001, 5210002, 5210003, 5210004, 5210005, 5210006, 5210007, 5210008, 5210009, 5210010, 5210011, 5211000, 5211001, 5211002, 5211003, 5211004, 5211005, 5211006, 5211007, 5211008, 5211009, 5211010, 5211011, 5211012, 5211013, 5211014, 5211015, 5211016, 5211017, 5211018,
     5211019, 5211020, 5211021, 5211022, 5211023, 5211024, 5211025, 5211026, 5211027, 5211028, 5211029, 5211030, 5211031, 5211032, 5211033, 5211034, 5211035, 5211036, 5211037, 5211038, 5211039, 5211040, 5211041, 5211042, 5211043,
     5211044, 5211045, 5211046, 5211047, 5211048, 5211049, 5211050, 5211051, 5211052, 5211053, 5211054, 5211055, 5211056, 5211057, 5211058, 5211059, 5211060, 5211061,//2x exp
     5360000, 5360001, 5360002, 5360003, 5360004, 5360005, 5360006, 5360007, 5360008, 5360009, 5360010, 5360011, 5360012, 5360013, 5360014, 5360017, 5360050, 5211050, 5360042, 5360052, 5360053, 5360050, //2x drop
     1112810, 1112811, 5530013, 4001431, 4001432, 4032605,
     5140000, 5140001, 5140002, 5140003, 5140004, 5140007, //stores
     5270000, 5270001, 5270002, 5270003, 5270004, 5270005, 5270006, //2x meso
     9102328, 9102329, 9102330, 9102331, 9102332, 9102333}; //miracle cube and stuff
     * */
    )
    const val JAIL = 180000002
    const val MAX_BUFFSTAT = 4
    @JvmField
    val blockedSkills = intArrayOf(4341003)
    @JvmField
    val RESERVED = arrayOf("운영자", "admin")
    @JvmField
    val stats = arrayOf("tuc", "reqLevel", "reqJob", "reqSTR", "reqDEX", "reqINT", "reqLUK", "reqPOP", "cash", "cursed", "success", "setItemID", "equipTradeBlock", "durability", "randOption", "randStat", "masterLevel", "reqSkillLevel", "elemDefault", "incRMAS", "incRMAF", "incRMAI", "incRMAL", "canLevel", "skill", "charmEXP", "pickupAll", "pickupItem", "sweepForDrop", "longRange", "consumeHP", "consumeMP", "noRevive")
    val hyperTele = intArrayOf(310000000, 220000000, 100000000, 250000000, 240000000, 104000000, 103000000, 102000000, 101000000, 120000000, 260000000, 200000000, 230000000)
    @JvmStatic
    fun getExpNeededForLevel(level: Int): Int {
        return if (level < 0 || level >= exp.size) {
            Int.MAX_VALUE
        } else exp[level]
    }

    @JvmStatic
    fun getGuildExpNeededForLevel(level: Int): Int {
        return if (level < 0 || level >= guildexp.size) {
            Int.MAX_VALUE
        } else guildexp[level]
    }

    fun getPVPExpNeededForLevel(level: Int): Int {
        return if (level < 0 || level >= pvpExp.size) {
            Int.MAX_VALUE
        } else pvpExp[level]
    }

    @JvmStatic
    fun getClosenessNeededForLevel(level: Int): Int {
        return closeness[level - 1]
    }

    @JvmStatic
    fun getIntForCloseness(exp: Int): Int {
        for (i in closeness.indices) {
            if (closeness[i] > exp) {
                return i
            }
        }
        return 1
    }

    @JvmStatic
    fun getMountExpNeededForLevel(level: Int): Int {
        return mountexp[level - 1]
    }

    fun getTraitExpNeededForLevel(level: Int): Int {
        return if (level < 0 || level >= cumulativeTraitExp.size) {
            Int.MAX_VALUE
        } else cumulativeTraitExp[level]
    }

    fun getSetExpNeededForLevel(level: Int): Int {
        return if (level < 0 || level >= setScore.size) {
            Int.MAX_VALUE
        } else setScore[level]
    }

    fun getMonsterHP(level: Int): Int {
        return if (level < 0 || level >= mobHpVal.size) {
            Int.MAX_VALUE
        } else mobHpVal[level]
    }

    @JvmStatic
    fun getBookLevel(level: Int): Int {
        return (5 * level * (level + 1))
    }

    fun getTimelessRequiredEXP(level: Int): Int {
        return 70 + level * 10
    }

    fun getReverseRequiredEXP(level: Int): Int {
        return 60 + level * 5
    }

    @JvmStatic
    fun isHarvesting(itemId: Int): Boolean {
        return itemId >= 1500000 && itemId < 1520000
    }

    @JvmStatic
    fun maxViewRangeSq(): Int {
        return 1000000 // 1024 * 768
    }

    fun maxViewRangeSq_Half(): Int {
        return 500000 // 800 * 800
    }

    fun isJobFamily(baseJob: Int, currentJob: Int): Boolean {
        return currentJob >= baseJob && currentJob / 100 == baseJob / 100
    }

    @JvmStatic
    fun isAdventurer(job: Int): Boolean {
        return job >= 0 && job < 1000
    }

    @JvmStatic
    fun isRecoveryIncSkill(id: Int): Boolean {
        when (id) {
            1110000, 2000000, 1210000, 11110000, 4100002, 4200001 -> return true
        }
        return false
    }

    fun isForceIncrease(skillid: Int): Boolean {
        when (skillid) {
            31000004, 31001006, 31001007, 31001008, 30010166, 30011167, 30011168, 30011169, 30011170 -> return true
        }
        return false
    }

    @JvmStatic
    fun getMPEaterForJob(job: Int): Int {
        when (job) {
            210, 211, 212 -> return 2100000
            220, 221, 222 -> return 2200000
            230, 231, 232 -> return 2300000
        }
        return 2100000 // Default, in case GM
    }

    fun getJobShortValue(_job: Int): Int {
        var job = _job
        if (job >= 1000) {
            job -= job / 1000 * 1000
        }
        job /= 100
        if (job == 4) { // For some reason dagger/ claw is 8.. IDK
            job *= 2
        } else if (job == 3) {
            job += 1
        } else if (job == 5) {
            job += 11 // 16
        }
        return job
    }

    @JvmStatic
    fun isPyramidSkill(skill: Int): Boolean {
        return isBeginnerJob(skill / 10000) && skill % 10000 == 1020
    }

    @JvmStatic
    fun isInflationSkill(skill: Int): Boolean {
        return isBeginnerJob(skill / 10000) && skill % 10000 == 1092
    }

    @JvmStatic
    fun isMulungSkill(skill: Int): Boolean {
        return isBeginnerJob(skill / 10000) && (skill % 10000 == 1009 || skill % 10000 == 1010 || skill % 10000 == 1011)
    }

    fun isIceKnightSkill(skill: Int): Boolean {
        return isBeginnerJob(skill / 10000) && (skill % 10000 == 1098 || skill % 10000 == 99 || skill % 10000 == 100 || skill % 10000 == 103 || skill % 10000 == 104 || skill % 10000 == 1105)
    }

    @JvmStatic
    fun isThrowingStar(itemId: Int): Boolean {
        return itemId / 10000 == 207
    }

    @JvmStatic
    fun isBullet(itemId: Int): Boolean {
        return itemId / 10000 == 233
    }

    @JvmStatic
    fun isRechargable(itemId: Int): Boolean {
        return isThrowingStar(itemId) || isBullet(itemId)
    }

    @JvmStatic
    fun isOverall(itemId: Int): Boolean {
        return itemId / 10000 == 105
    }

    @JvmStatic
    fun isPet(itemId: Int): Boolean {
        return itemId / 10000 == 500
    }

    fun isArrowForCrossBow(itemId: Int): Boolean {
        return itemId >= 2061000 && itemId < 2062000
    }

    fun isArrowForBow(itemId: Int): Boolean {
        return itemId >= 2060000 && itemId < 2061000
    }

    fun isMagicWeapon(itemId: Int): Boolean {
        val s = itemId / 10000
        return s == 137 || s == 138
    }

    @JvmStatic
    fun isWeapon(itemId: Int): Boolean {
        return itemId >= 1300000 && itemId < 1500000
    }

    @JvmStatic
    fun getInventoryType(itemId: Int): MapleInventoryType? {
        val type = (itemId / 1000000).toByte()
        return if (type < 1 || type > 5) {
            MapleInventoryType.UNDEFINED
        } else MapleInventoryType.getByType(type)
    }

    @JvmStatic
    fun getWeaponType(itemId: Int): MapleWeaponType {
        var cat = itemId / 10000
        cat = cat % 100
        when (cat) {
            30 -> return MapleWeaponType.SWORD1H
            31 -> return MapleWeaponType.AXE1H
            32 -> return MapleWeaponType.BLUNT1H
            33 -> return MapleWeaponType.DAGGER
            34 -> return MapleWeaponType.KATARA
            35 -> return MapleWeaponType.MAGIC_ARROW
            37 -> return MapleWeaponType.WAND
            38 -> return MapleWeaponType.STAFF
            40 -> return MapleWeaponType.SWORD2H
            41 -> return MapleWeaponType.AXE2H
            42 -> return MapleWeaponType.BLUNT2H
            43 -> return MapleWeaponType.SPEAR
            44 -> return MapleWeaponType.POLE_ARM
            45 -> return MapleWeaponType.BOW
            46 -> return MapleWeaponType.CROSSBOW
            47 -> return MapleWeaponType.CLAW
            48 -> return MapleWeaponType.KNUCKLE
            49 -> return MapleWeaponType.GUN
            52 -> return MapleWeaponType.DUAL_BOW
            53 -> return MapleWeaponType.CANNON
        }
        return MapleWeaponType.NOT_A_WEAPON
    }

    fun isShield(itemId: Int): Boolean {
        var cat = itemId / 10000
        cat = cat % 100
        return cat == 9
    }

    @JvmStatic
    fun isEquip(itemId: Int): Boolean {
        return itemId / 1000000 == 1
    }

    @JvmStatic
    fun isCleanSlate(itemId: Int): Boolean {
        return itemId / 100 == 20490
    }

    @JvmStatic
    fun isAccessoryScroll(itemId: Int): Boolean {
        return itemId / 100 == 20492
    }

    @JvmStatic
    fun isChaosScroll(itemId: Int): Boolean {
        return if (itemId >= 2049105 && itemId <= 2049110) {
            false
        } else itemId / 100 == 20491 || itemId == 2040126
    }

    @JvmStatic
    fun getChaosNumber(itemId: Int): Int {
        return if (itemId == 2049116) 10 else 5
    }

    @JvmStatic
    fun isEquipScroll(scrollId: Int): Boolean {
        return scrollId / 100 == 20493
    }

    @JvmStatic
    fun isPotentialScroll(scrollId: Int): Boolean {
        return scrollId / 100 == 20494 || scrollId == 5534000
    }

    @JvmStatic
    fun isSpecialScroll(scrollId: Int): Boolean {
        when (scrollId) {
            2040727, 2041058, 2530000, 2530001, 2531000, 5063000, 5064000 -> return true
        }
        return false
    }

    @JvmStatic
    fun isTwoHanded(itemId: Int): Boolean {
        return when (getWeaponType(itemId)) {
            MapleWeaponType.AXE2H, MapleWeaponType.GUN, MapleWeaponType.KNUCKLE, MapleWeaponType.BLUNT2H, MapleWeaponType.BOW, MapleWeaponType.CLAW, MapleWeaponType.CROSSBOW, MapleWeaponType.POLE_ARM, MapleWeaponType.SPEAR, MapleWeaponType.SWORD2H, MapleWeaponType.CANNON ->  //case DUAL_BOW: //magic arrow
                true
            else -> false
        }
    }

    fun isTownScroll(id: Int): Boolean {
        return id >= 2030000 && id < 2040000
    }

    fun isUpgradeScroll(id: Int): Boolean {
        return id >= 2040000 && id < 2050000
    }

    fun isGun(id: Int): Boolean {
        return id >= 1492000 && id < 1500000
    }

    @JvmStatic
    fun isUse(id: Int): Boolean {
        return id >= 2000000 && id < 3000000
    }

    fun isSummonSack(id: Int): Boolean {
        return id / 10000 == 210
    }

    @JvmStatic
    fun isMonsterCard(id: Int): Boolean {
        return id / 10000 == 238
    }

    @JvmStatic
    fun isSpecialCard(id: Int): Boolean {
        return id / 1000 >= 2388
    }

    @JvmStatic
    fun getCardShortId(id: Int): Int {
        return id % 10000
    }

    @JvmStatic
    fun isGem(id: Int): Boolean {
        return id >= 4250000 && id <= 4251402
    }

    @JvmStatic
    fun isOtherGem(id: Int): Boolean {
        when (id) {
            4001174, 4001175, 4001176, 4001177, 4001178, 4001179, 4001180, 4001181, 4001182, 4001183, 4001184, 4001185, 4001186, 4031980, 2041058, 2040727, 1032062, 4032334, 4032312, 1142156, 1142157 -> return true //mostly quest items
        }
        return false
    }

    @JvmStatic
    fun isCustomQuest(id: Int): Boolean {
        return id > 99999
    }

    @JvmStatic
    fun getTaxAmount(meso: Int): Int {
        if (meso >= 100000000) {
            return Math.round(0.06 * meso).toInt()
        } else if (meso >= 25000000) {
            return Math.round(0.05 * meso).toInt()
        } else if (meso >= 10000000) {
            return Math.round(0.04 * meso).toInt()
        } else if (meso >= 5000000) {
            return Math.round(0.03 * meso).toInt()
        } else if (meso >= 1000000) {
            return Math.round(0.018 * meso).toInt()
        } else if (meso >= 100000) {
            return Math.round(0.008 * meso).toInt()
        }
        return 0
    }

    @JvmStatic
    fun EntrustedStoreTax(meso: Int): Int {
        if (meso >= 100000000) {
            return Math.round(0.03 * meso).toInt()
        } else if (meso >= 25000000) {
            return Math.round(0.025 * meso).toInt()
        } else if (meso >= 10000000) {
            return Math.round(0.02 * meso).toInt()
        } else if (meso >= 5000000) {
            return Math.round(0.015 * meso).toInt()
        } else if (meso >= 1000000) {
            return Math.round(0.009 * meso).toInt()
        } else if (meso >= 100000) {
            return Math.round(0.004 * meso).toInt()
        }
        return 0
    }

    @JvmStatic
    fun getAttackDelay(id: Int, skill: Skill?): Int {
        when (id) {
            3121004, 23121000, 33121009, 13111002, 5221004, 5201006, 35121005, 35111004, 35121013 -> return 40 //reason being you can spam with final assaulter
            14111005, 4121007, 5221007 -> return 99 //skip duh chek
            0 -> return 570
        }
        if (skill != null && skill.skillType == 3) {
            return 0 //final attack
        }
        return if (skill != null && skill.delay > 0 && !isNoDelaySkill(id)) {
            skill.delay
        } else 330
        // TODO delay for final attack, weapon type, swing,stab etc
        // Default usually
    }

    @JvmStatic
    fun gachaponRareItem(id: Int): Byte {
        when (id) {
            2340000, 2049100, 2049000, 2049001, 2049002, 2040006, 2040007, 2040303, 2040403, 2040506, 2040507, 2040603, 2040709, 2040710, 2040711, 2040806, 2040903, 2041024, 2041025, 2043003, 2043103, 2043203, 2043303, 2043703, 2043803, 2044003, 2044103, 2044203, 2044303, 2044403, 2044503, 2044603, 2044908, 2044815, 2044019, 2044703 -> return 2
        }
        return 0
    }

    @JvmField
    val goldrewards = intArrayOf(
            2049400, 1,
            2049401, 2,
            2049301, 2,
            2340000, 1,  // white scroll
            2070007, 2,
            2070016, 1,
            2330007, 1,
            2070018, 1,  // balance fury
            1402037, 1,  // Rigbol Sword
            2290096, 1,  // Maple Warrior 20
            2290049, 1,  // Genesis 30
            2290041, 1,  // Meteo 30
            2290047, 1,  // Blizzard 30
            2290095, 1,  // Smoke 30
            2290017, 1,  // Enrage 30
            2290075, 1,  // Snipe 30
            2290085, 1,  // Triple Throw 30
            2290116, 1,  // Areal Strike
            1302059, 3,  // Dragon Carabella
            2049100, 1,  // Chaos Scroll
            1092049, 1,  // Dragon Kanjar
            1102041, 1,  // Pink Cape
            1432018, 3,  // Sky Ski
            1022047, 3,  // Owl Mask
            3010051, 1,  // Chair
            3010020, 1,  // Portable meal table
            2040914, 1,  // Shield for Weapon Atk
            1432011, 3,  // Fair Frozen
            1442020, 3,  // HellSlayer
            1382035, 3,  // Blue Marine
            1372010, 3,  // Dimon Wand
            1332027, 3,  // Varkit
            1302056, 3,  // Sparta
            1402005, 3,  // Bezerker
            1472053, 3,  // Red Craven
            1462018, 3,  // Casa Crow
            1452017, 3,  // Metus
            1422013, 3,  // Lemonite
            1322029, 3,  // Ruin Hammer
            1412010, 3,  // Colonian Axe
            1472051, 1,  // Green Dragon Sleeve
            1482013, 1,  // Emperor's Claw
            1492013, 1,  // Dragon fire Revlover
            1382049, 1,
            1382050, 1,  // Blue Dragon Staff
            1382051, 1,
            1382052, 1,
            1382045, 1,  // Fire Staff, Level 105
            1382047, 1,  // Ice Staff, Level 105
            1382048, 1,  // Thunder Staff
            1382046, 1,  // Poison Staff
            1372035, 1,
            1372036, 1,
            1372037, 1,
            1372038, 1,
            1372039, 1,
            1372040, 1,
            1372041, 1,
            1372042, 1,
            1332032, 8,  // Christmas Tree
            1482025, 7,  // Flowery Tube
            4001011, 8,  // Lupin Eraser
            4001010, 8,  // Mushmom Eraser
            4001009, 8,  // Stump Eraser
            2047000, 1,
            2047001, 1,
            2047002, 1,
            2047100, 1,
            2047101, 1,
            2047102, 1,
            2047200, 1,
            2047201, 1,
            2047202, 1,
            2047203, 1,
            2047204, 1,
            2047205, 1,
            2047206, 1,
            2047207, 1,
            2047208, 1,
            2047300, 1,
            2047301, 1,
            2047302, 1,
            2047303, 1,
            2047304, 1,
            2047305, 1,
            2047306, 1,
            2047307, 1,
            2047308, 1,
            2047309, 1,
            2046004, 1,
            2046005, 1,
            2046104, 1,
            2046105, 1,
            2046208, 1,
            2046209, 1,
            2046210, 1,
            2046211, 1,
            2046212, 1,  //list
            1132014, 3,
            1132015, 2,
            1132016, 1,
            1002801, 2,
            1102205, 2,
            1332079, 2,
            1332080, 2,
            1402048, 2,
            1402049, 2,
            1402050, 2,
            1402051, 2,
            1462052, 2,
            1462054, 2,
            1462055, 2,
            1472074, 2,
            1472075, 2,  //pro raven
            1332077, 1,
            1382082, 1,
            1432063, 1,
            1452087, 1,
            1462053, 1,
            1472072, 1,
            1482048, 1,
            1492047, 1,
            2030008, 5,  // Bottle, return scroll
            1442018, 3,  // Frozen Tuna
            2040900, 4,  // Shield for DEF
            2049100, 10,
            2000005, 10,  // Power Elixir
            2000004, 10,  // Elixir
            4280000, 8,
            2430144, 10,
            2290285, 10,
            2028061, 10,
            2028062, 10,
            2530000, 5,
            2531000, 5) // Gold Box
    @JvmField
    val silverrewards = intArrayOf(
            2049401, 2,
            2049301, 2,
            3010041, 1,  // skull throne
            1002452, 6,  // Starry Bandana
            1002455, 6,  // Starry Bandana
            2290084, 1,  // Triple Throw 20
            2290048, 1,  // Genesis 20
            2290040, 1,  // Meteo 20
            2290046, 1,  // Blizzard 20
            2290074, 1,  // Sniping 20
            2290064, 1,  // Concentration 20
            2290094, 1,  // Smoke 20
            2290022, 1,  // Berserk 20
            2290056, 1,  // Bow Expert 30
            2290066, 1,  // xBow Expert 30
            2290020, 1,  // Sanc 20
            1102082, 1,  // Black Raggdey Cape
            1302049, 1,  // Glowing Whip
            2340000, 1,  // White Scroll
            1102041, 1,  // Pink Cape
            1452019, 2,  // White Nisrock
            4001116, 3,  // Hexagon Pend
            4001012, 3,  // Wraith Eraser
            1022060, 2,  // Foxy Racoon Eye
            2430144, 5,
            2290285, 5,
            2028062, 5,
            2028061, 5,
            2530000, 1,
            2531000, 1,
            2041100, 1,
            2041101, 1,
            2041102, 1,
            2041103, 1,
            2041104, 1,
            2041105, 1,
            2041106, 1,
            2041107, 1,
            2041108, 1,
            2041109, 1,
            2041110, 1,
            2041111, 1,
            2041112, 1,
            2041113, 1,
            2041114, 1,
            2041115, 1,
            2041116, 1,
            2041117, 1,
            2041118, 1,
            2041119, 1,
            2041300, 1,
            2041301, 1,
            2041302, 1,
            2041303, 1,
            2041304, 1,
            2041305, 1,
            2041306, 1,
            2041307, 1,
            2041308, 1,
            2041309, 1,
            2041310, 1,
            2041311, 1,
            2041312, 1,
            2041313, 1,
            2041314, 1,
            2041315, 1,
            2041316, 1,
            2041317, 1,
            2041318, 1,
            2041319, 1,
            2049200, 1,
            2049201, 1,
            2049202, 1,
            2049203, 1,
            2049204, 1,
            2049205, 1,
            2049206, 1,
            2049207, 1,
            2049208, 1,
            2049209, 1,
            2049210, 1,
            2049211, 1,
            1432011, 3,  // Fair Frozen
            1442020, 3,  // HellSlayer
            1382035, 3,  // Blue Marine
            1372010, 3,  // Dimon Wand
            1332027, 3,  // Varkit
            1302056, 3,  // Sparta
            1402005, 3,  // Bezerker
            1472053, 3,  // Red Craven
            1462018, 3,  // Casa Crow
            1452017, 3,  // Metus
            1422013, 3,  // Lemonite
            1322029, 3,  // Ruin Hammer
            1412010, 3,  // Colonian Axe
            1002587, 3,  // Black Wisconsin
            1402044, 1,  // Pumpkin lantern
            2101013, 4,  // Summoning Showa boss
            1442046, 1,  // Super Snowboard
            1422031, 1,  // Blue Seal Cushion
            1332054, 3,  // Lonzege Dagger
            1012056, 3,  // Dog Nose
            1022047, 3,  // Owl Mask
            3012002, 1,  // Bathtub
            1442012, 3,  // Sky snowboard
            1442018, 3,  // Frozen Tuna
            1432010, 3,  // Omega Spear
            1432036, 1,  // Fishing Pole
            2000005, 10,  // Power Elixir
            2049100, 10,
            2000004, 10,  // Elixir
            4280001, 8) // Silver Box
    @JvmField
    val peanuts = intArrayOf(2430091, 200, 2430092, 200, 2430093, 200, 2430101, 200, 2430102, 200, 2430136, 200, 2430149, 200,  //mounts
            2340000, 1,  //rares
            1152000, 5, 1152001, 5, 1152004, 5, 1152005, 5, 1152006, 5, 1152007, 5, 1152008, 5,  //toenail only comes when db is out.
            1152064, 5, 1152065, 5, 1152066, 5, 1152067, 5, 1152070, 5, 1152071, 5, 1152072, 5, 1152073, 5,
            3010019, 2,  //chairs
            1001060, 10, 1002391, 10, 1102004, 10, 1050039, 10, 1102040, 10, 1102041, 10, 1102042, 10, 1102043, 10,  //equips
            1082145, 5, 1082146, 5, 1082147, 5, 1082148, 5, 1082149, 5, 1082150, 5,  //wg
            2043704, 10, 2040904, 10, 2040409, 10, 2040307, 10, 2041030, 10, 2040015, 10, 2040109, 10, 2041035, 10, 2041036, 10, 2040009, 10, 2040511, 10, 2040408, 10, 2043804, 10, 2044105, 10, 2044903, 10, 2044804, 10, 2043009, 10, 2043305, 10, 2040610, 10, 2040716, 10, 2041037, 10, 2043005, 10, 2041032, 10, 2040305, 10,  //scrolls
            2040211, 5, 2040212, 5, 1022097, 10,  //dragon glasses
            2049000, 10, 2049001, 10, 2049002, 10, 2049003, 10,  //clean slate
            1012058, 5, 1012059, 5, 1012060, 5, 1012061, 5,  //pinocchio nose msea only.
            1332100, 10, 1382058, 10, 1402073, 10, 1432066, 10, 1442090, 10, 1452058, 10, 1462076, 10, 1472069, 10, 1482051, 10, 1492024, 10, 1342009, 10,  //durability weapons level 105
            2049400, 1, 2049401, 2, 2049301, 2,
            2049100, 10,
            2430144, 10,
            2290285, 10,
            2028062, 10,
            2028061, 10,
            2530000, 5,
            2531000, 5,
            1032080, 5,
            1032081, 4,
            1032082, 3,
            1032083, 2,
            1032084, 1,
            1112435, 5,
            1112436, 4,
            1112437, 3,
            1112438, 2,
            1112439, 1,
            1122081, 5,
            1122082, 4,
            1122083, 3,
            1122084, 2,
            1122085, 1,
            1132036, 5,
            1132037, 4,
            1132038, 3,
            1132039, 2,
            1132040, 1,  //source
            1092070, 5,
            1092071, 4,
            1092072, 3,
            1092073, 2,
            1092074, 1,
            1092075, 5,
            1092076, 4,
            1092077, 3,
            1092078, 2,
            1092079, 1,
            1092080, 5,
            1092081, 4,
            1092082, 3,
            1092083, 2,
            1092084, 1,
            1092087, 1,
            1092088, 1,
            1092089, 1,
            1302143, 5,
            1302144, 4,
            1302145, 3,
            1302146, 2,
            1302147, 1,
            1312058, 5,
            1312059, 4,
            1312060, 3,
            1312061, 2,
            1312062, 1,
            1322086, 5,
            1322087, 4,
            1322088, 3,
            1322089, 2,
            1322090, 1,
            1332116, 5,
            1332117, 4,
            1332118, 3,
            1332119, 2,
            1332120, 1,
            1332121, 5,
            1332122, 4,
            1332123, 3,
            1332124, 2,
            1332125, 1,
            1342029, 5,
            1342030, 4,
            1342031, 3,
            1342032, 2,
            1342033, 1,
            1372074, 5,
            1372075, 4,
            1372076, 3,
            1372077, 2,
            1372078, 1,
            1382095, 5,
            1382096, 4,
            1382097, 3,
            1382098, 2,
            1392099, 1,
            1402086, 5,
            1402087, 4,
            1402088, 3,
            1402089, 2,
            1402090, 1,
            1412058, 5,
            1412059, 4,
            1412060, 3,
            1412061, 2,
            1412062, 1,
            1422059, 5,
            1422060, 4,
            1422061, 3,
            1422062, 2,
            1422063, 1,
            1432077, 5,
            1432078, 4,
            1432079, 3,
            1432080, 2,
            1432081, 1,
            1442107, 5,
            1442108, 4,
            1442109, 3,
            1442110, 2,
            1442111, 1,
            1452102, 5,
            1452103, 4,
            1452104, 3,
            1452105, 2,
            1452106, 1,
            1462087, 5,
            1462088, 4,
            1462089, 3,
            1462090, 2,
            1462091, 1,
            1472113, 5,
            1472114, 4,
            1472115, 3,
            1472116, 2,
            1472117, 1,
            1482075, 5,
            1482076, 4,
            1482077, 3,
            1482078, 2,
            1482079, 1,
            1492075, 5,
            1492076, 4,
            1492077, 3,
            1492078, 2,
            1492079, 1,
            1132012, 2,
            1132013, 1,
            1942002, 2,
            1952002, 2,
            1962002, 2,
            1972002, 2,
            1612004, 2,
            1622004, 2,
            1632004, 2,
            1642004, 2,
            1652004, 2,
            2047000, 1,
            2047001, 1,
            2047002, 1,
            2047100, 1,
            2047101, 1,
            2047102, 1,
            2047200, 1,
            2047201, 1,
            2047202, 1,
            2047203, 1,
            2047204, 1,
            2047205, 1,
            2047206, 1,
            2047207, 1,
            2047208, 1,
            2047300, 1,
            2047301, 1,
            2047302, 1,
            2047303, 1,
            2047304, 1,
            2047305, 1,
            2047306, 1,
            2047307, 1,
            2047308, 1,
            2047309, 1,
            2046004, 1,
            2046005, 1,
            2046104, 1,
            2046105, 1,
            2046208, 1,
            2046209, 1,
            2046210, 1,
            2046211, 1,
            2046212, 1,
            2049200, 1,
            2049201, 1,
            2049202, 1,
            2049203, 1,
            2049204, 1,
            2049205, 1,
            2049206, 1,
            2049207, 1,
            2049208, 1,
            2049209, 1,
            2049210, 1,
            2049211, 1,  //ele wand
            1372035, 1,
            1372036, 1,
            1372037, 1,
            1372038, 1,  //ele staff
            1382045, 1,
            1382046, 1,
            1382047, 1,
            1382048, 1,
            1382049, 1,
            1382050, 1,  // Blue Dragon Staff
            1382051, 1,
            1382052, 1,
            1372039, 1,
            1372040, 1,
            1372041, 1,
            1372042, 1,
            2070016, 1,
            2070007, 2,
            2330007, 1,
            2070018, 1,
            2330008, 1,
            2070023, 1,
            2070024, 1,
            2028062, 5,
            2028061, 5)
    @JvmField
    var eventCommonReward = intArrayOf(
            0, 10,
            1, 10,
            4, 5,
            5060004, 25,
            4170024, 25,
            4280000, 5,
            4280001, 6,
            5490000, 5,
            5490001, 6
    )
    @JvmField
    var eventUncommonReward = intArrayOf(
            1, 4,
            2, 8,
            3, 8,
            2022179, 5,
            5062000, 20,
            2430082, 20,
            2430092, 20,
            2022459, 2,
            2022460, 1,
            2022462, 1,
            2430103, 2,
            2430117, 2,
            2430118, 2,
            2430201, 4,
            2430228, 4,
            2430229, 4,
            2430283, 4,
            2430136, 4,
            2430476, 4,
            2430511, 4,
            2430206, 4,
            2430199, 1,
            1032062, 5,
            5220000, 28,
            2022459, 5,
            2022460, 5,
            2022461, 5,
            2022462, 5,
            2022463, 5,
            5050000, 2,
            4080100, 10,
            4080000, 10,
            2049100, 10,
            2430144, 10,
            2290285, 10,
            2028062, 10,
            2028061, 10,
            2530000, 5,
            2531000, 5,
            2041100, 1,
            2041101, 1,
            2041102, 1,
            2041103, 1,
            2041104, 1,
            2041105, 1,
            2041106, 1,
            2041107, 1,
            2041108, 1,
            2041109, 1,
            2041110, 1,
            2041111, 1,
            2041112, 1,
            2041113, 1,
            2041114, 1,
            2041115, 1,
            2041116, 1,
            2041117, 1,
            2041118, 1,
            2041119, 1,
            2041300, 1,
            2041301, 1,
            2041302, 1,
            2041303, 1,
            2041304, 1,
            2041305, 1,
            2041306, 1,
            2041307, 1,
            2041308, 1,
            2041309, 1,
            2041310, 1,
            2041311, 1,
            2041312, 1,
            2041313, 1,
            2041314, 1,
            2041315, 1,
            2041316, 1,
            2041317, 1,
            2041318, 1,
            2041319, 1,
            2049200, 1,
            2049201, 1,
            2049202, 1,
            2049203, 1,
            2049204, 1,
            2049205, 1,
            2049206, 1,
            2049207, 1,
            2049208, 1,
            2049209, 1,
            2049210, 1,
            2049211, 1
    )
    @JvmField
    var eventRareReward = intArrayOf(
            2049100, 5,
            2430144, 5,
            2290285, 5,
            2028062, 5,
            2028061, 5,
            2530000, 2,
            2531000, 2,
            2049116, 1,
            2049401, 10,
            2049301, 20,
            2049400, 3,
            2340000, 1,
            3010130, 5,
            3010131, 5,
            3010132, 5,
            3010133, 5,
            3010136, 5,
            3010116, 5,
            3010117, 5,
            3010118, 5,
            1112405, 1,
            1112445, 1,
            1022097, 1,
            2040211, 1,
            2040212, 1,
            2049000, 2,
            2049001, 2,
            2049002, 2,
            2049003, 2,
            1012058, 2,
            1012059, 2,
            1012060, 2,
            1012061, 2,
            2022460, 4,
            2022461, 3,
            2022462, 4,
            2022463, 3,
            2040041, 1,
            2040042, 1,
            2040334, 1,
            2040430, 1,
            2040538, 1,
            2040539, 1,
            2040630, 1,
            2040740, 1,
            2040741, 1,
            2040742, 1,
            2040829, 1,
            2040830, 1,
            2040936, 1,
            2041066, 1,
            2041067, 1,
            2043023, 1,
            2043117, 1,
            2043217, 1,
            2043312, 1,
            2043712, 1,
            2043812, 1,
            2044025, 1,
            2044117, 1,
            2044217, 1,
            2044317, 1,
            2044417, 1,
            2044512, 1,
            2044612, 1,
            2044712, 1,
            2046000, 1,
            2046001, 1,
            2046004, 1,
            2046005, 1,
            2046100, 1,
            2046101, 1,
            2046104, 1,
            2046105, 1,
            2046200, 1,
            2046201, 1,
            2046202, 1,
            2046203, 1,
            2046208, 1,
            2046209, 1,
            2046210, 1,
            2046211, 1,
            2046212, 1,
            2046300, 1,
            2046301, 1,
            2046302, 1,
            2046303, 1,
            2047000, 1,
            2047001, 1,
            2047002, 1,
            2047100, 1,
            2047101, 1,
            2047102, 1,
            2047200, 1,
            2047201, 1,
            2047202, 1,
            2047203, 1,
            2047204, 1,
            2047205, 1,
            2047206, 1,
            2047207, 1,
            2047208, 1,
            2047300, 1,
            2047301, 1,
            2047302, 1,
            2047303, 1,
            2047304, 1,
            2047305, 1,
            2047306, 1,
            2047307, 1,
            2047308, 1,
            2047309, 1,
            1112427, 5,
            1112428, 5,
            1112429, 5,
            1012240, 10,
            1022117, 10,
            1032095, 10,
            1112659, 10,
            2070007, 10,
            2330007, 5,
            2070016, 5,
            2070018, 5,
            1152038, 1,
            1152039, 1,
            1152040, 1,
            1152041, 1,
            1122090, 1,
            1122094, 1,
            1122098, 1,
            1122102, 1,
            1012213, 1,
            1012219, 1,
            1012225, 1,
            1012231, 1,
            1012237, 1,
            2070023, 5,
            2070024, 5,
            2330008, 5,
            2003516, 5,
            2003517, 1,
            1132052, 1,
            1132062, 1,
            1132072, 1,
            1132082, 1,
            1112585, 1,  //walker
            1072502, 1,
            1072503, 1,
            1072504, 1,
            1072505, 1,
            1072506, 1,
            1052333, 1,
            1052334, 1,
            1052335, 1,
            1052336, 1,
            1052337, 1,
            1082305, 1,
            1082306, 1,
            1082307, 1,
            1082308, 1,
            1082309, 1,
            1003197, 1,
            1003198, 1,
            1003199, 1,
            1003200, 1,
            1003201, 1,
            1662000, 1,
            1662001, 1,
            1672000, 1,
            1672001, 1,
            1672002, 1,  //crescent moon
            1112583, 1,
            1032092, 1,
            1132084, 1,  //mounts, 90 day
            2430290, 1,
            2430292, 1,
            2430294, 1,
            2430296, 1,
            2430298, 1,
            2430300, 1,
            2430302, 1,
            2430304, 1,
            2430306, 1,
            2430308, 1,
            2430310, 1,
            2430312, 1,
            2430314, 1,
            2430316, 1,
            2430318, 1,
            2430320, 1,
            2430322, 1,
            2430324, 1,
            2430326, 1,
            2430328, 1,
            2430330, 1,
            2430332, 1,
            2430334, 1,
            2430336, 1,
            2430338, 1,
            2430340, 1,
            2430342, 1,
            2430344, 1,
            2430347, 1,
            2430349, 1,
            2430351, 1,
            2430353, 1,
            2430355, 1,
            2430357, 1,
            2430359, 1,
            2430361, 1,
            2430392, 1,
            2430512, 1,
            2430536, 1,
            2430477, 1,
            2430146, 1,
            2430148, 1,
            2430137, 1)
    @JvmField
    var eventSuperReward = intArrayOf(
            2022121, 10,
            4031307, 50,
            3010127, 10,
            3010128, 10,
            3010137, 10,
            3010157, 10,
            2049300, 10,
            2040758, 10,
            1442057, 10,
            2049402, 10,
            2049304, 1,
            2049305, 1,
            2040759, 7,
            2040760, 5,
            2040125, 10,
            2040126, 10,
            1012191, 5,
            1112514, 1,  //untradable/tradable
            1112531, 1,
            1112629, 1,
            1112646, 1,
            1112515, 1,  //untradable/tradable
            1112532, 1,
            1112630, 1,
            1112647, 1,
            1112516, 1,  //untradable/tradable
            1112533, 1,
            1112631, 1,
            1112648, 1,
            2040045, 10,
            2040046, 10,
            2040333, 10,
            2040429, 10,
            2040542, 10,
            2040543, 10,
            2040629, 10,
            2040755, 10,
            2040756, 10,
            2040757, 10,
            2040833, 10,
            2040834, 10,
            2041068, 10,
            2041069, 10,
            2043022, 12,
            2043120, 12,
            2043220, 12,
            2043313, 12,
            2043713, 12,
            2043813, 12,
            2044028, 12,
            2044120, 12,
            2044220, 12,
            2044320, 12,
            2044520, 12,
            2044513, 12,
            2044613, 12,
            2044713, 12,
            2044817, 12,
            2044910, 12,
            2046002, 5,
            2046003, 5,
            2046102, 5,
            2046103, 5,
            2046204, 10,
            2046205, 10,
            2046206, 10,
            2046207, 10,
            2046304, 10,
            2046305, 10,
            2046306, 10,
            2046307, 10,
            2040006, 2,
            2040007, 2,
            2040303, 2,
            2040403, 2,
            2040506, 2,
            2040507, 2,
            2040603, 2,
            2040709, 2,
            2040710, 2,
            2040711, 2,
            2040806, 2,
            2040903, 2,
            2040913, 2,
            2041024, 2,
            2041025, 2,
            2044815, 2,
            2044908, 2,
            1152046, 1,
            1152047, 1,
            1152048, 1,
            1152049, 1,
            1122091, 1,
            1122095, 1,
            1122099, 1,
            1122103, 1,
            1012214, 1,
            1012220, 1,
            1012226, 1,
            1012232, 1,
            1012238, 1,
            1032088, 1,
            1032089, 1,
            1032090, 1,
            1032091, 1,
            1132053, 1,
            1132063, 1,
            1132073, 1,
            1132083, 1,
            1112586, 1,
            1112593, 1,
            1112597, 1,
            1662002, 1,
            1662003, 1,
            1672003, 1,
            1672004, 1,
            1672005, 1,  //130, 140 weapons
            1092088, 1,
            1092089, 1,
            1092087, 1,
            1102275, 1,
            1102276, 1,
            1102277, 1,
            1102278, 1,
            1102279, 1,
            1102280, 1,
            1102281, 1,
            1102282, 1,
            1102283, 1,
            1102284, 1,
            1082295, 1,
            1082296, 1,
            1082297, 1,
            1082298, 1,
            1082299, 1,
            1082300, 1,
            1082301, 1,
            1082302, 1,
            1082303, 1,
            1082304, 1,
            1072485, 1,
            1072486, 1,
            1072487, 1,
            1072488, 1,
            1072489, 1,
            1072490, 1,
            1072491, 1,
            1072492, 1,
            1072493, 1,
            1072494, 1,
            1052314, 1,
            1052315, 1,
            1052316, 1,
            1052317, 1,
            1052318, 1,
            1052319, 1,
            1052329, 1,
            1052321, 1,
            1052322, 1,
            1052323, 1,
            1003172, 1,
            1003173, 1,
            1003174, 1,
            1003175, 1,
            1003176, 1,
            1003177, 1,
            1003178, 1,
            1003179, 1,
            1003180, 1,
            1003181, 1,
            1302152, 1,
            1302153, 1,
            1312065, 1,
            1312066, 1,
            1322096, 1,
            1322097, 1,
            1332130, 1,
            1332131, 1,
            1342035, 1,
            1342036, 1,
            1372084, 1,
            1372085, 1,
            1382104, 1,
            1382105, 1,
            1402095, 1,
            1402096, 1,
            1412065, 1,
            1412066, 1,
            1422066, 1,
            1422067, 1,
            1432086, 1,
            1432087, 1,
            1442116, 1,
            1442117, 1,
            1452111, 1,
            1452112, 1,
            1462099, 1,
            1462100, 1,
            1472122, 1,
            1472123, 1,
            1482084, 1,
            1482085, 1,
            1492085, 1,
            1492086, 1,
            1532017, 1,
            1532018, 1,  //mounts
            2430291, 1,
            2430293, 1,
            2430295, 1,
            2430297, 1,
            2430299, 1,
            2430301, 1,
            2430303, 1,
            2430305, 1,
            2430307, 1,
            2430309, 1,
            2430311, 1,
            2430313, 1,
            2430315, 1,
            2430317, 1,
            2430319, 1,
            2430321, 1,
            2430323, 1,
            2430325, 1,
            2430327, 1,
            2430329, 1,
            2430331, 1,
            2430333, 1,
            2430335, 1,
            2430337, 1,
            2430339, 1,
            2430341, 1,
            2430343, 1,
            2430345, 1,
            2430348, 1,
            2430350, 1,
            2430352, 1,
            2430354, 1,
            2430356, 1,
            2430358, 1,
            2430360, 1,
            2430362, 1,  //rising sun
            1012239, 1,
            1122104, 1,
            1112584, 1,
            1032093, 1,
            1132085, 1
    )
    @JvmField
    var tenPercent = intArrayOf( //10% scrolls
            2040002,
            2040005,
            2040026,
            2040031,
            2040100,
            2040105,
            2040200,
            2040205,
            2040302,
            2040310,
            2040318,
            2040323,
            2040328,
            2040329,
            2040330,
            2040331,
            2040402,
            2040412,
            2040419,
            2040422,
            2040427,
            2040502,
            2040505,
            2040514,
            2040517,
            2040534,
            2040602,
            2040612,
            2040619,
            2040622,
            2040627,
            2040702,
            2040705,
            2040708,
            2040727,
            2040802,
            2040805,
            2040816,
            2040825,
            2040902,
            2040915,
            2040920,
            2040925,
            2040928,
            2040933,
            2041002,
            2041005,
            2041008,
            2041011,
            2041014,
            2041017,
            2041020,
            2041023,
            2041058,
            2041102,
            2041105,
            2041108,
            2041111,
            2041302,
            2041305,
            2041308,
            2041311,
            2043002,
            2043008,
            2043019,
            2043102,
            2043114,
            2043202,
            2043214,
            2043302,
            2043402,
            2043702,
            2043802,
            2044002,
            2044014,
            2044015,
            2044102,
            2044114,
            2044202,
            2044214,
            2044302,
            2044314,
            2044402,
            2044414,
            2044502,
            2044602,
            2044702,
            2044802,
            2044809,
            2044902,
            2045302,
            2048002,
            2048005
    )

    fun isReverseItem(itemId: Int): Boolean {
        return when (itemId) {
            1002790, 1002791, 1002792, 1002793, 1002794, 1082239, 1082240, 1082241, 1082242, 1082243, 1052160, 1052161, 1052162, 1052163, 1052164, 1072361, 1072362, 1072363, 1072364, 1072365, 1302086, 1312038, 1322061, 1332075, 1332076, 1372045, 1382059, 1402047, 1412034, 1422038, 1432049, 1442067, 1452059, 1462051, 1472071, 1482024, 1492025, 1342012, 1942002, 1952002, 1962002, 1972002, 1532016, 1522017 -> true
            else -> false
        }
    }

    fun isTimelessItem(itemId: Int): Boolean {
        return when (itemId) {
            1032031, 1102172, 1002776, 1002777, 1002778, 1002779, 1002780, 1082234, 1082235, 1082236, 1082237, 1082238, 1052155, 1052156, 1052157, 1052158, 1052159, 1072355, 1072356, 1072357, 1072358, 1072359, 1092057, 1092058, 1092059, 1122011, 1122012, 1302081, 1312037, 1322060, 1332073, 1332074, 1372044, 1382057, 1402046, 1412033, 1422037, 1432047, 1442063, 1452057, 1462050, 1472068, 1482023, 1492023, 1342011, 1532015, 1522016 ->  //raven.
                true
            else -> false
        }
    }

    fun isRing(itemId: Int): Boolean {
        return itemId >= 1112000 && itemId < 1113000
    } // 112xxxx - pendants, 113xxxx - belts

    //if only there was a way to find in wz files -.-
    @JvmStatic
    fun isEffectRing(itemid: Int): Boolean {
        return isFriendshipRing(itemid) || isCrushRing(itemid) || isMarriageRing(itemid)
    }

    @JvmStatic
    fun isMarriageRing(itemId: Int): Boolean {
        when (itemId) {
            1112300, 1112301, 1112302, 1112303, 1112304, 1112305, 1112306, 1112307, 1112308, 1112309, 1112310, 1112311, 4210000, 4210001, 4210002, 4210003, 4210004, 4210005, 4210006, 4210007, 4210008, 4210009, 4210010, 4210011 -> return true
        }
        return false
    }

    @JvmStatic
    fun isFriendshipRing(itemId: Int): Boolean {
        when (itemId) {
            1112800, 1112801, 1112802, 1112810, 1112811, 1112812, 1112816, 1112817, 1049000 -> return true
        }
        return false
    }

    @JvmStatic
    fun isCrushRing(itemId: Int): Boolean {
        when (itemId) {
            1112001, 1112002, 1112003, 1112005, 1112006, 1112007, 1112012, 1112015, 1048000, 1048001, 1048002 -> return true
        }
        return false
    }

    var Equipments_Bonus = intArrayOf(1122017)
    fun Equipment_Bonus_EXP(itemid: Int): Int { // TODO : Add Time for more exp increase
        when (itemid) {
            1122017 -> return 10
        }
        return 0
    }

    @JvmField
    var blockedMaps = intArrayOf(180000001, 180000002, 109050000, 280030000, 240060200, 280090000, 280030001, 240060201, 950101100, 950101010)
    //If you can think of more maps that could be exploitable via npc,block nao pliz!
    @JvmStatic
    fun getExpForLevel(i: Int, itemId: Int): Int {
        if (isReverseItem(itemId)) {
            return getReverseRequiredEXP(i)
        } else if (getMaxLevel(itemId) > 0) {
            return getTimelessRequiredEXP(i)
        }
        return 0
    }

    @JvmStatic
    fun getMaxLevel(itemId: Int): Int {
        val inc = MapleItemInformationProvider.getInstance().getEquipIncrements(itemId)
        return inc?.size ?: 0
    }

    @JvmStatic
    val statChance: Int
        get() = 25

    @JvmStatic
    fun getStatFromWeapon(itemid: Int): MonsterStatus? {
        when (itemid) {
            1302109, 1312041, 1322067, 1332083, 1372048, 1382064, 1402055, 1412037, 1422041, 1432052, 1442073, 1452064, 1462058, 1472079, 1482035 -> return MonsterStatus.BLIND
            1302108, 1312040, 1322066, 1332082, 1372047, 1382063, 1402054, 1412036, 1422040, 1432051, 1442072, 1452063, 1462057, 1472078, 1482036 -> return MonsterStatus.SPEED
        }
        return null
    }

    @JvmStatic
    fun getXForStat(stat: MonsterStatus?): Int {
        when (stat) {
            MonsterStatus.BLIND -> return -70
            MonsterStatus.SPEED -> return -50
            else -> return 0
        }
    }

    @JvmStatic
    fun getSkillForStat(stat: MonsterStatus?): Int {
        when (stat) {
            MonsterStatus.BLIND -> return if (player!!.job.toInt() == 1000 || player.job.toInt() == 1100 || player.job.toInt() == 1110 || player.job.toInt() == 1111 || player.job.toInt() == 1112) {
                11111002
            } else {
                1111003
            }
            MonsterStatus.SPEED -> return 3121007
            else -> return 0
        }
    }

    @JvmField
    val normalDrops = intArrayOf(
            4001009,  //real
            4001010,
            4001011,
            4001012,
            4001013,
            4001014,  //real
            4001021,
            4001038,  //fake
            4001039,
            4001040,
            4001041,
            4001042,
            4001043,  //fake
            4001038,  //fake
            4001039,
            4001040,
            4001041,
            4001042,
            4001043,  //fake
            4001038,  //fake
            4001039,
            4001040,
            4001041,
            4001042,
            4001043,  //fake
            4000164,  //start
            2000000,
            2000003,
            2000004,
            2000005,
            4000019,
            4000000,
            4000016,
            4000006,
            2100121,
            4000029,
            4000064,
            5110000,
            4000306,
            4032181,
            4006001,
            4006000,
            2050004,
            3994102,
            3994103,
            3994104,
            3994105,
            2430007,  //end
            4000164,  //start
            2000000,
            2000003,
            2000004,
            2000005,
            4000019,
            4000000,
            4000016,
            4000006,
            2100121,
            4000029,
            4000064,
            5110000,
            4000306,
            4032181,
            4006001,
            4006000,
            2050004,
            3994102,
            3994103,
            3994104,
            3994105,
            2430007,  //end
            4000164,  //start
            2000000,
            2000003,
            2000004,
            2000005,
            4000019,
            4000000,
            4000016,
            4000006,
            2100121,
            4000029,
            4000064,
            5110000,
            4000306,
            4032181,
            4006001,
            4006000,
            2050004,
            3994102,
            3994103,
            3994104,
            3994105,
            2430007) //end
    @JvmField
    val rareDrops = intArrayOf(
            2022179,
            2049100,
            2049100,
            2430144,
            2028062,
            2028061,
            2290285,
            2049301,
            2049401,
            2022326,
            2022193,
            2049000,
            2049001,
            2049002)
    @JvmField
    val superDrops = intArrayOf(
            2040804,
            2049400,
            2028062,
            2028061,
            2430144,
            2430144,
            2430144,
            2430144,
            2290285,
            2049100,
            2049100,
            2049100,
            2049100)

    @JvmStatic
    fun getSkillBook(job: Int): Int {
        if (job >= 2210 && job <= 2218) {
            return job - 2209
        }
        when (job) {
            2310, 3110, 3210, 3310, 3510 -> return 1
            2311, 3111, 3211, 3311, 3511 -> return 2
            2312, 3112, 3212, 3312, 3512 -> return 3
        }
        return 0
    }

    fun getSkillBook(job: Int, level: Int): Int {
        if (job >= 2210 && job <= 2218) {
            return job - 2209
        }
        when (job) {
            2300, 2310, 2311, 2312, 3100, 3200, 3300, 3500, 3110, 3210, 3310, 3510, 3111, 3211, 3311, 3511, 3112, 3212, 3312, 3512 -> return if (level <= 30) 0 else if (level >= 31 && level <= 70) 1 else if (level >= 71 && level <= 120) 2 else if (level >= 120) 3 else 0
        }
        return 0
    }

    @JvmStatic
    fun getSkillBookForSkill(skillid: Int): Int {
        return getSkillBook(skillid / 10000)
    }

    fun getLinkedMountItem(sourceid: Int): Int {
        when (sourceid % 1000) {
            1, 24, 25 -> return 1018
            2, 26 -> return 1019
            3 -> return 1025
            4, 5, 6, 7, 8 -> return sourceid % 1000 + 1023
            9, 10, 11 -> return sourceid % 1000 + 1024
            12 -> return 1042
            13 -> return 1044
            14 -> return 1049
            15, 16, 17 -> return sourceid % 1000 + 1036
            18, 19 -> return sourceid % 1000 + 1045
            20 -> return 1072
            21 -> return 1084
            22 -> return 1089
            23 -> return 1106
            29 -> return 1151
            30, 50 -> return 1054
            31, 51 -> return 1069
            32 -> return 1138
            45, 46, 47, 48, 49 -> return sourceid % 1000 + 1009
            52 -> return 1070
            53 -> return 1071
            54 -> return 1096
            55 -> return 1101
            56 -> return 1102
            58 -> return 1118
            59 -> return 1121
            60 -> return 1122
            61 -> return 1129
            62 -> return 1139
            63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78 -> return sourceid % 1000 + 1080
            85, 86, 87 -> return sourceid % 1000 + 928
            88 -> return 1065
            27 -> return 1932049 //airplane
            28 -> return 1932050 //airplane
            114 -> return 1932099 //bunny buddy
        }
        return 0
    }

    @JvmStatic
    fun getMountItem(sourceid: Int, chr: MapleCharacter?): Int {
        when (sourceid) {
            5221006 -> return 1932000
            33001001 -> {
                if (chr == null) {
                    return 1932015
                }
                when (chr.getIntNoRecord(JAGUAR)) {
                    20 -> return 1932030
                    30 -> return 1932031
                    40 -> return 1932032
                    50 -> return 1932033
                    60 -> return 1932036
                }
                return 1932015
            }
            35001002, 35120000 -> return 1932016
        }
        if (!isBeginnerJob(sourceid / 10000)) {
            if (sourceid / 10000 == 8000 && sourceid != 80001000) { //todoo clean up
                val skil = SkillFactory.getSkill(sourceid)
                if (skil != null && skil.tamingMob > 0) {
                    return skil.tamingMob
                } else {
                    val link = getLinkedMountItem(sourceid)
                    if (link > 0) {
                        return if (link < 10000) {
                            getMountItem(link, chr)
                        } else {
                            link
                        }
                    }
                }
            }
            return 0
        }
        return when (sourceid % 10000) {
            1013, 1046 -> 1932001
            1015, 1048 -> 1932002
            1016, 1017, 1027 -> 1932007
            1018 -> 1932003
            1019 -> 1932005
            1025 -> 1932006
            1028 -> 1932008
            1029 -> 1932009
            1030 -> 1932011
            1031 -> 1932010
            1033 -> 1932013
            1034 -> 1932014
            1035 -> 1932012
            1036 -> 1932017
            1037 -> 1932018
            1038 -> 1932019
            1039 -> 1932020
            1040 -> 1932021
            1042 -> 1932022
            1044 -> 1932023
            1049 -> 1932025
            1050 -> 1932004
            1051 -> 1932026
            1052 -> 1932027
            1053 -> 1932028
            1054 -> 1932029
            1063 -> 1932034
            1064 -> 1932035
            1065 -> 1932037
            1069 -> 1932038
            1070 -> 1932039
            1071 -> 1932040
            1072 -> 1932041
            1084 -> 1932043
            1089 -> 1932044
            1096 -> 1932045
            1101 -> 1932046
            1102 -> 1932047
            1106 -> 1932048
            1118 -> 1932060
            1115 -> 1932052
            1121 -> 1932063
            1122 -> 1932064
            1123 -> 1932065
            1128 -> 1932066
            1130 -> 1932072
            1136 -> 1932078
            1138 -> 1932080
            1139 -> 1932081
            1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157 -> 1992000 + sourceid % 10000 - 1143
            else -> 0
        }
    }

    @JvmStatic
    fun isKatara(itemId: Int): Boolean {
        return itemId / 10000 == 134
    }

    @JvmStatic
    fun isDagger(itemId: Int): Boolean {
        return itemId / 10000 == 133
    }

    @JvmStatic
    fun isApplicableSkill(skil: Int): Boolean {
        return skil < 40000000 && (skil % 10000 < 8000 || skil % 10000 > 8006) && !isAngel(skil) || skil >= 92000000 || skil >= 80000000 && skil < 80010000 //no additional/decent skills
    }

    @JvmStatic
    fun isApplicableSkill_(skil: Int): Boolean { //not applicable to saving but is more of temporary
        for (i in PlayerStats.pvpSkills) {
            if (skil == i) {
                return true
            }
        }
        return skil >= 90000000 && skil < 92000000 || skil % 10000 >= 8000 && skil % 10000 <= 8003 || isAngel(skil)
    }

    @JvmStatic
    fun isTablet(itemId: Int): Boolean {
        return itemId / 1000 == 2047
    }

    @JvmStatic
    fun isGeneralScroll(itemId: Int): Boolean {
        return itemId / 1000 == 2046
    }

    @JvmStatic
    fun getSuccessTablet(scrollId: Int, level: Int): Int {
        return if (scrollId % 1000 / 100 == 2) { //2047_2_00 = armor, 2047_3_00 = accessory
            when (level) {
                0 -> 70
                1 -> 55
                2 -> 43
                3 -> 33
                4 -> 26
                5 -> 20
                6 -> 16
                7 -> 12
                8 -> 10
                else -> 7
            }
        } else if (scrollId % 1000 / 100 == 3) {
            when (level) {
                0 -> 70
                1 -> 35
                2 -> 18
                3 -> 12
                else -> 7
            }
        } else {
            when (level) {
                0 -> 70
                1 -> 50 //-20
                2 -> 36 //-14
                3 -> 26 //-10
                4 -> 19 //-7
                5 -> 14 //-5
                6 -> 10 //-4
                else -> 7 //-3
            }
        }
    }

    @JvmStatic
    fun getCurseTablet(scrollId: Int, level: Int): Int {
        return if (scrollId % 1000 / 100 == 2) { //2047_2_00 = armor, 2047_3_00 = accessory
            when (level) {
                0 -> 10
                1 -> 12
                2 -> 16
                3 -> 20
                4 -> 26
                5 -> 33
                6 -> 43
                7 -> 55
                8 -> 70
                else -> 100
            }
        } else if (scrollId % 1000 / 100 == 3) {
            when (level) {
                0 -> 12
                1 -> 18
                2 -> 35
                3 -> 70
                else -> 100
            }
        } else {
            when (level) {
                0 -> 10
                1 -> 14 //+4
                2 -> 19 //+5
                3 -> 26 //+7
                4 -> 36 //+10
                5 -> 50 //+14
                6 -> 70 //+20
                else -> 100 //+30
            }
        }
    }

    @JvmStatic
    fun isAccessory(itemId: Int): Boolean {
        return itemId >= 1010000 && itemId < 1040000 || itemId >= 1122000 && itemId < 1153000 || itemId >= 1112000 && itemId < 1113000
    }

    fun potentialIDFits(potentialID: Int, newstate: Int, i: Int): Boolean { //first line is always the best
//but, sometimes it is possible to get second/third line as well
//may seem like big chance, but it's not as it grabs random potential ID anyway
        return if (newstate == 7) {
            if (i == 0 || Randomizer.nextInt(10) == 0) potentialID >= 30000 else potentialID >= 20000 && potentialID < 30000
        } else if (newstate == 6) {
            if (i == 0 || Randomizer.nextInt(10) == 0) potentialID >= 20000 && potentialID < 30000 else potentialID >= 10000 && potentialID < 20000
        } else if (newstate == 5) {
            if (i == 0 || Randomizer.nextInt(10) == 0) potentialID >= 10000 && potentialID < 20000 else potentialID < 10000
        } else {
            false
        }
    }

    fun optionTypeFits(optionType: Int, itemId: Int): Boolean {
        return when (optionType) {
            10 -> isWeapon(itemId)
            11 -> !isWeapon(itemId)
            20 -> itemId / 10000 == 109 //just a gues
            21 -> itemId / 10000 == 180 //???LOL
            40 -> isAccessory(itemId)
            51 -> itemId / 10000 == 100
            52 -> itemId / 10000 == 110
            53 -> itemId / 10000 == 104 || itemId / 10000 == 105 || itemId / 10000 == 106
            54 -> itemId / 10000 == 108
            55 -> itemId / 10000 == 107
            90 -> false //half this stuff doesnt even work
            else -> true
        }
    }

    @JvmStatic
    fun isMountItemAvailable(mountid: Int, jobid: Int): Boolean {
        if (jobid != 900 && mountid / 10000 == 190) {
            when (mountid) {
                1902000, 1902001, 1902002 -> return isAdventurer(jobid)
            }
        }
        return mountid / 10000 == 190
    }

    @JvmStatic
    fun isMechanicItem(itemId: Int): Boolean {
        return itemId in 1610000..1659999
    }

    @JvmStatic
    fun isEvanDragonItem(itemId: Int): Boolean {
        return itemId in 1940000..1979999 //194 = mask, 195 = pendant, 196 = wings, 197 = tail
    }

    @JvmStatic
    fun canScroll(itemId: Int): Boolean {
        return itemId / 100000 != 19 && itemId / 100000 != 16 //no mech/taming/dragon
    }

    fun canHammer(itemId: Int): Boolean {
        when (itemId) {
            1122000, 1122076 -> return false
        }
        return canScroll(itemId)
    }

    var owlItems = intArrayOf(
            1082002,  // work gloves
            2070005,
            2070006,
            1092008,
            1092029,
            2040804,
            2290096,  // white scroll
            1050018,
            1092021,
            1051017)

    @JvmStatic
    fun getMasterySkill(job: Int): Int {
        when (job) {
            in 1410..1412 -> {
                return 14100000
            }
            in 410..412 -> {
                return 4100000
            }
            in 520..522 -> {
                return 5200000
            }
            else -> return 0
        }
    }

    @JvmStatic
    fun getCustomReactItem(rid: Int, original: Int): Int {
        return if (rid == 2008006) { //orbis pq LOL
            Calendar.getInstance()[Calendar.DAY_OF_WEEK] + 4001055
            //4001056 = sunday. 4001062 = saturday
        } else {
            original
        }
    }

    @JvmStatic
    fun getJobNumber(jobz: Int): Int {
        val job = jobz % 1000
        return if (job / 100 == 0 || isBeginnerJob(jobz)) {
            0 //beginner
        } else if (job / 10 % 10 == 0 || job == 501) {
            1
        } else {
            2 + job % 10
        }
    }

    @JvmStatic
    fun isBeginnerJob(job: Int): Boolean {
        return job == 0 || job == 1 || job == 1000 || job == 2000 || job == 2001 || job == 3000 || job == 3001 || job == 2002
    }

    @JvmStatic
    fun isForceRespawn(mapid: Int): Boolean {
        return when (mapid) {
            103000800, 925100100 -> true
            else -> mapid / 100000 == 9800 && (mapid % 10 == 1 || mapid % 1000 == 100)
        }
    }

    @JvmStatic
    fun getFishingTime(vip: Boolean, gm: Boolean): Int {
        return if (gm) 1000 else if (vip) 30000 else 60000
    }

    @JvmStatic
    fun getFishingTime(): Int = 10000

    @JvmStatic
    fun getCustomSpawnID(summoner: Int, def: Int): Int {
        return when (summoner) {
            9400589, 9400748 -> 9400706 //jr
            else -> def
        }
    }

    @JvmStatic
    fun canForfeit(questid: Int): Boolean {
        return when (questid) {
            20000, 20010, 20015, 20020 -> false
            else -> true
        }
    }

    @JvmStatic
    fun getAttackRange(def: MapleStatEffect?, rangeInc: Int): Double {
        var defRange = (400.0 + rangeInc) * (400.0 + rangeInc)
        if (def != null) {
            defRange += def.maxDistanceSq + def.range * def.range
        }
        //rangeInc adds to X
//400 is approximate, screen is 600.. may be too much
//200 for y is also too much
//default 200000
        return defRange + 120000.0
    }

    fun getAttackRange(lt: Point?, rb: Point?): Double {
        var defRange = 400.0 * 400.0
        val maxX = Math.max(Math.abs(lt?.x ?: 0), Math.abs(rb?.x ?: 0))
        val maxY = Math.max(Math.abs(lt?.y ?: 0), Math.abs(rb?.y ?: 0))
        defRange += maxX * maxX + (maxY * maxY).toDouble()
        //rangeInc adds to X
//400 is approximate, screen is 600.. may be too much
//200 for y is also too much
//default 200000
        return defRange + 120000.0
    }

    @JvmStatic
    fun getLowestPrice(itemId: Int): Int {
        when (itemId) {
            2340000, 2531000, 2530000 -> return 50000000
        }
        return -1
    }

    @JvmStatic
    fun isNoDelaySkill(skillId: Int): Boolean {
        return skillId == 15111006 || skillId == 5110001 || skillId == 21101003 || skillId == 15100004 || skillId == 33101004 || skillId == 32111010 || skillId == 2111007 || skillId == 2211007 || skillId == 2311007 || skillId == 32121003 || skillId == 35121005 || skillId == 35111004 || skillId == 35121013 || skillId == 35121003 || skillId == 22150004 || skillId == 22181004 || skillId == 11101002 || skillId == 13101002
    }

    @JvmStatic
    fun isNoSpawn(mapID: Int): Boolean {
        return mapID == 809040100 || mapID == 925020010 || mapID == 925020011 || mapID == 925020012 || mapID == 925020013 || mapID == 925020014 || mapID == 980010000 || mapID == 980010100 || mapID == 980010200 || mapID == 980010300 || mapID == 980010020
    }

    fun getExpRate(/*job: Int, */def: Int): Int {
        return def
    }

    @JvmStatic
    fun getModifier(itemId: Int, up: Int): Int {
        if (up <= 0) {
            return 0
        }
        when (itemId) {
            2022459, 2860179, 2860193, 2860207 -> return 130
            2022460, 2022462, 2022730 -> return 150
            2860181, 2860195, 2860209 -> return 200
        }
        return if (itemId / 10000 == 286) { //familiars
            150
        } else 200
    }

    @JvmStatic
    fun getSlotMax(itemId: Int): Short {
        when (itemId) {
            4030003, 4030004, 4030005 -> return 1
            4001168, 4031306, 4031307, 3993000, 3993002, 3993003 -> return 100
            5220010, 5220013 -> return 1000
            5220020 -> return 2000
        }
        return 0
    }

    @JvmStatic
    fun isDropRestricted(itemId: Int): Boolean {
        return itemId == 3012000 || itemId == 4030004 || itemId == 1052098 || itemId == 1052202 || itemId == 3010000
    }

    @JvmStatic
    fun isPickupRestricted(itemId: Int): Boolean { // && itemId != 4001168 && itemId != 4031306 && itemId != 4031307
        return itemId == 4030003 || itemId == 4030004 || itemId == 5370000 || itemId == 3010000 || itemId == 3010007 || itemId == 3010008 || itemId == 3010009
    }

    @JvmStatic
    fun getStat(itemId: Int, def: Int): Short {
        when (itemId) {
            1002419 -> return 5
            1002959 -> return 25
            1142002 -> return 10
            1122121 -> return 7
        }
        return def.toShort()
    }

    @JvmStatic
    fun getHpMp(itemId: Int, def: Int): Short {
        when (itemId) {
            1122121 -> return 500
            1142002, 1002959 -> return 1000
        }
        return def.toShort()
    }

    @JvmStatic
    fun getATK(itemId: Int, def: Int): Short {
        when (itemId) {
            1122121 -> return 3
            1002959 -> return 4
            1142002 -> return 9
        }
        return def.toShort()
    }

    @JvmStatic
    fun getDEF(itemId: Int, def: Int): Short {
        when (itemId) {
            1122121 -> return 250
            1002959 -> return 500
        }
        return def.toShort()
    }

    fun isDojo(mapId: Int): Boolean {
        return mapId in 925020100..925023814
    }

    @JvmStatic
    fun isHyperTeleMap(mapId: Int): Boolean {
        for (i in hyperTele) {
            if (i == mapId) {
                return true
            }
        }
        return false
    }

    val currentDate: Int
        get() {
            val time = FileoutputUtil.CurrentReadable_Time()
            return StringBuilder(time.substring(0, 4)).append(time.substring(5, 7)).append(time.substring(8, 10)).append(time.substring(11, 13)).toString().toInt()
        }

    val currentDate_NoTime: Int
        get() {
            val time = FileoutputUtil.CurrentReadable_Time()
            return StringBuilder(time.substring(0, 4)).append(time.substring(5, 7)).append(time.substring(8, 10)).toString().toInt()
        }

    fun achievementRatio(c: MapleClient) { //PQs not affected: Amoria, MV, CWK, English, Zakum, Horntail(?), Carnival, Ghost, Guild, LudiMaze, Elnath(?)
        when (c.player.mapId) {
            240080600, 920010000, 930000000, 930000100, 910010000, 922010100, 910340100, 925100000, 926100000, 926110000, 921120005, 932000100, 923040100, 921160100 -> c.session.write(MaplePacketCreator.achievementRatio(0))
            930000200, 922010200, 922010300, 922010400, 922010401, 922010402, 922010403, 922010404, 922010405, 925100100, 926100001, 926110001, 921160200 -> c.session.write(MaplePacketCreator.achievementRatio(10))
            930000300, 910340200, 922010500, 922010600, 925100200, 925100201, 925100202, 926100100, 926110100, 921120100, 932000200, 923040200, 921160300, 921160310, 921160320, 921160330, 921160340, 921160350 -> c.session.write(MaplePacketCreator.achievementRatio(25))
            930000400, 926100200, 926110200, 926100201, 926110201, 926100202, 926110202, 921160400 -> c.session.write(MaplePacketCreator.achievementRatio(35))
            910340300, 922010700, 930000500, 925100300, 925100301, 925100302, 926100203, 926110203, 921120200, 932000300, 240080700, 240080800, 923040300, 921160500 -> c.session.write(MaplePacketCreator.achievementRatio(50))
            910340400, 922010800, 930000600, 925100400, 926100300, 926110300, 926100301, 926110301, 926100302, 926110302, 926100303, 926110303, 926100304, 926110304, 921120300, 932000400, 923040400, 921160600 -> c.session.write(MaplePacketCreator.achievementRatio(70))
            910340500, 922010900, 930000700, 920010800, 925100500, 926100400, 926110400, 926100401, 926110401, 921120400, 921160700 -> c.session.write(MaplePacketCreator.achievementRatio(85))
            922011000, 922011100, 930000800, 920011000, 920011100, 920011200, 920011300, 925100600, 926100500, 926110500, 926100600, 926110600, 921120500, 921120600 -> c.session.write(MaplePacketCreator.achievementRatio(100))
        }
    }

    @JvmStatic
    fun isAngel(sourceid: Int): Boolean {
        return isBeginnerJob(sourceid / 10000) && (sourceid % 10000 == 1085 || sourceid % 10000 == 1087 || sourceid % 10000 == 1090 || sourceid % 10000 == 1179)
    }

    @JvmStatic
    fun isMulungBoss(mobid: Int): Boolean {
        when (mobid) {
            9300184, 9300185, 9300186, 9300187, 9300188, 9300189, 9300190, 9300191, 9300192, 9300193, 9300194, 9300195, 9300196, 9300197, 9300198, 9300199, 9300200, 9300201, 9300202, 9300203, 9300204, 9300205, 9300206, 9300207, 9300208, 9300209, 9300210, 9300211, 9300212, 9300213, 9300214, 9300215 -> return true
        }
        return false
    }

    fun getRewardPot(itemid: Int, closeness: Int): Int {
        when (itemid) {
            2440000 -> {
                when (closeness / 10) {
                    0, 1, 2 -> return 2028041 + closeness / 10
                    3, 4, 5 -> return 2028046 + closeness / 10
                    6, 7, 8 -> return 2028049 + closeness / 10
                }
                return 2028057
            }
            2440001 -> {
                when (closeness / 10) {
                    0, 1, 2 -> return 2028044 + closeness / 10
                    3, 4, 5 -> return 2028049 + closeness / 10
                    6, 7, 8 -> return 2028052 + closeness / 10
                }
                return 2028060
            }
            2440002 -> return 2028069
            2440003 -> return 2430278
            2440004 -> return 2430381
            2440005 -> return 2430393
        }
        return 0
    }

    @JvmStatic
    fun isEventMap(mapid: Int): Boolean {
        return mapid in 109010000..109049999 || mapid in 109050002..109089999 || mapid in 809040000..809040100
    }

    fun isMagicChargeSkill(skillid: Int): Boolean {
        when (skillid) {
            2121001, 2221001, 2321001, 22121000, 22151001 -> return true
        }
        return false
    }

    @JvmStatic
    fun getExpModByLevel(level: Int): Int {
        if (!ServerConstants.serverType) { // old server
            return 1
        }
        return if (level < 30) {
            1
        } else if (level < 50) {
            2
        } else if (level < 70) {
            4
        } else if (level < 100) {
            6
        } else if (level < 120) {
            8
        } else {
            1
        }
    }

    @JvmStatic
    fun isTeamMap(mapid: Int): Boolean {
        return mapid == 109080000 || mapid == 109080001 || mapid == 109080002 || mapid == 109080003 || mapid == 109080010 || mapid == 109080011 || mapid == 109080012 || mapid == 109090300 || mapid == 109090301 || mapid == 109090302 || mapid == 109090303 || mapid == 109090304 || mapid == 910040100 || mapid == 960020100 || mapid == 960020101 || mapid == 960020102 || mapid == 960020103 || mapid == 960030100 || mapid == 689000000 || mapid == 689000010
    }

    fun getStatDice(stat: Int): Int {
        when (stat) {
            2 -> return 30
            3 -> return 20
            4 -> return 15
            5 -> return 20
            6 -> return 30
        }
        return 0
    }

    fun getDiceStat(buffid: Int, stat: Int): Int {
        if (buffid == stat || buffid % 10 == stat || buffid / 10 == stat) {
            return getStatDice(stat)
        } else if (buffid == stat * 100) {
            return getStatDice(stat) + 10
        }
        return 0
    }

    @JvmField
    val publicNpcIds = intArrayOf(9270035, 9070004, 9010022, 9071003, 9000087, 9000088, 9010000, 9000085, 9000018, 9000000)
    @JvmField
    val publicNpcs = arrayOf("#cUniversal NPC#", "Move to the #cBattle Square# to fight other players", "Move to a variety of #cparty quests#.", "Move to #cMonster Park# to team up to defeat monsters.", "Move to #cFree Market# to trade items with players.", "Move to #cArdentmill#, the crafting town.",
            "Check #cdrops# of any monster in the map.", "Review #cPokedex#.", "Review #cPokemon#.", "Join an #cevent# in progress.")
    //questID; FAMILY USES 19000x, MARRIAGE USES 16000x, EXPED USES 16010x
//dojo = 150000, bpq = 150001, master monster portals: 122600
//compensate evan = 170000, compensate sp = 170001
    const val OMOK_SCORE = 122200
    const val MATCH_SCORE = 122210
    const val HP_ITEM = 122221
    const val MP_ITEM = 122223
    const val JAIL_TIME = 123455
    const val JAIL_QUEST = 123456
    const val REPORT_QUEST = 123457
    const val ULT_EXPLORER = 111111
    //codex = -55 slot
//crafting/gathering are designated as skills(short exp then byte 0 then byte level), same with recipes(integer.max_value skill level)
    const val POKEMON_WINS = 122400
    const val ENERGY_DRINK = 122500
    const val HARVEST_TIME = 122501
    const val PENDANT_SLOT = 122700
    const val CURRENT_SET = 122800
    const val BOSS_PQ = 150001
    const val JAGUAR = 111112
    const val DOJO = 150100
    const val DOJO_RECORD = 150101
    const val PARTY_REQUEST = 122900
    const val PARTY_INVITE = 122901
    const val QUICK_SLOT = 123000
    private val prmaps = intArrayOf(990000500, 209000001, 209000002, 209000003, 209000004, 209000005, 209000006, 209000007, 209000008, 209000009, 209000010, 209000011, 209000012, 209000013, 209000014, 209000015)
    @JvmStatic
    fun isPickupRestrictedMap(map: Int): Boolean {
        for (i in prmaps) {
            if (i == map) {
                return true
            }
        }
        return false
    }

    @JvmStatic
    fun getEquipQuality(equip: Equip): Int {
        if (equip.uniqueId > 0 || equip.itemId / 100000 == 19) {
            return 0
        }
        var myEquipAll = 0
        myEquipAll += equip.acc.toInt()
        myEquipAll += equip.avoid.toInt()
        myEquipAll += equip.dex.toInt()
        myEquipAll += equip.hands.toInt()
        myEquipAll += equip.int.toInt()
        myEquipAll += equip.jump.toInt()
        myEquipAll += equip.luk.toInt()
        myEquipAll += equip.matk.toInt()
        myEquipAll += equip.mdef.toInt()
        myEquipAll += equip.mp.toInt()
        myEquipAll += equip.hp.toInt()
        myEquipAll += equip.speed.toInt()
        myEquipAll += equip.watk.toInt()
        myEquipAll += equip.wdef.toInt()
        var defaultEquipAll = 0
        val defi = MapleItemInformationProvider.getInstance().getItemInformation(equip.itemId)
        val def = defi.eq
        defaultEquipAll += def.acc.toInt()
        defaultEquipAll += def.avoid.toInt()
        defaultEquipAll += def.dex.toInt()
        defaultEquipAll += def.hands.toInt()
        defaultEquipAll += def.int.toInt()
        defaultEquipAll += def.jump.toInt()
        defaultEquipAll += def.luk.toInt()
        defaultEquipAll += def.matk.toInt()
        defaultEquipAll += def.mdef.toInt()
        defaultEquipAll += def.mp.toInt()
        defaultEquipAll += def.hp.toInt()
        defaultEquipAll += def.speed.toInt()
        defaultEquipAll += def.watk.toInt()
        defaultEquipAll += def.wdef.toInt()
        val statDiff = myEquipAll - defaultEquipAll
        return if (statDiff < 0) {
            -1
        } else {
            if (statDiff < 6) {
                return 0
            }
            if (statDiff >= 23) {
                if (statDiff >= 40) {
                    3
                } else {
                    2
                }
            } else {
                1
            }
        }
    }
}