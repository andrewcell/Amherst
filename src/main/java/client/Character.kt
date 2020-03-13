package client

import client.anticheat.CheatTracker
import client.anticheat.ReportType
import client.character.*
import client.inventory.ItemLoader
import client.inventory.MapleInventory
import client.inventory.MapleInventoryType
import client.inventory.MapleMount
import constants.ServerConstants
import database.DatabaseConnection
import handling.channel.ChannelServer
import handling.login.LoginInformationProvider.JobType
import handling.world.CharacterTransfer
import handling.world.World
import handling.world.guild.MapleGuildCharacter
import scripting.NPCScriptManager
import server.*
import server.life.MapleMonster
import server.log.Logger.log
import server.log.TypeOfLog
import server.maps.AnimatedMapleMapObject
import server.maps.MapleMapObject
import server.maps.SavedLocationType
import server.quest.MapleQuest
import tools.MaplePacketCreator
import java.awt.Point
import java.awt.Rectangle
import java.io.Serializable
import java.util.*
import java.util.concurrent.ScheduledFuture
import kotlin.collections.LinkedHashSet
/*
class Character(channelServer: Boolean) : AnimatedMapleMapObject(), Serializable {
    val serialVersionUID = 845748950829L
    private val old: Point = Point(0, 0)
    @Transient
    private var controlled: Set<MapleMonster>? = null
    @Transient
    private var visibleMapObjects: Set<MapleMapObject>? = null
    @Transient
    private var pendingCarnivalRequests: Deque<MapleCarnivalChallenge>? = null
    private var petStore: ByteArray = ByteArray(3)

    private val skillMacros = arrayOfNulls<SkillMacro>(5)
    @Transient
    private val mapTimeLimitTask: ScheduledFuture<*>? = null
    private val searchingParty = false
    private val psearch_jobs: List<Int>? = null
    private val psearch_maxLevel = 0
    private val psearch_minLevel = 0
    private val psearch_membersNeeded = 0
    private val canGainNoteFame = 0
    var leafgage = 0
    private val shiphp = 100
    private val Shp = 0
    private val coin: Any? = null
    private val scrollmode = false
    private val pendantOfSpirit: ScheduledFuture<*>? = null //1122017
    private val pendantExp = 0

    lateinit var appearance: Appearance
    lateinit var changed: Changed
    lateinit var classes: Classes
    lateinit var ids: Identifies
    lateinit var info: Information
    lateinit var last: Lastdata
    lateinit var lists: Lists
    lateinit var maps: Maps
    lateinit var money: Money
    lateinit var rank: Rank
    lateinit var trade: Trade

    init {
        stance = 0
        position = Point(0,0)
        for (type in MapleInventoryType.values()) {
            info.inventory[type.ordinal] = MapleInventory(type)
        }
        for (i in info.remainSp.indices) {
            info.remainSp.set(i, 0)
        }

        if (channelServer) {
            appearance = Appearance()
            changed = Changed()
            classes = Classes()
            ids = Identifies()
            info = Information()
            last = Lastdata()
            lists = Lists()
            maps = Maps()
            money = Money()
            rank = Rank()
            trade = Trade()
            Arrays.fill(petStore, -1)
            controlled = LinkedHashSet()
            visibleMapObjects = LinkedHashSet()
            pendingCarnivalRequests = LinkedList()
            for (i in 0..SavedLocationType.values().size) {
                lists.savedLocations[i] = -1
            }
        }
    }

    fun getDefault(c: MapleClient, type: JobType): Character {
        val ret = Character(false)
        ret.classes.client = c
        ret.classes.map = null
        ret.classes.buddyList = BuddyList(20)
        ret.info.accountId = c.accID
        ret.info.fame = 0
        ret.info.exp = 0
        ret.info.level = 1
        ret.info.gmLevel = 0
        ret.info.job = type.id.toShort()
        ret.info.remainAp = 0
        ret.info.stats.str = 12
        ret.info.stats.dex = 5
        ret.info.stats.int_ = 4
        ret.info.stats.dex = 4
        ret.info.stats.maxhp = 50
        ret.info.stats.maxmp = 5
        ret.info.stats.hp = 50
        ret.info.stats.mp = 5
        ret.money.meso = 0
        try {
            val conn = DatabaseConnection.getConnection()
            val ps = conn?.prepareStatement("SELECT * FROM accounts WHERE id = ?")
            ps?.setInt(1, ret.info.accountId)
            val rs = ps?.executeQuery()!!
            if (rs.next()) {
                ret.classes.client?.accountName = rs.getString("name")
                ret.money.acash = rs.getInt("ACash")
                ret.money.maplepoints = rs.getInt("mPoints")
                ret.money.points = rs.getInt("points")
                ret.money.vpoints = rs.getInt("vpoints")
            }
            conn.close()
            ps.close()
            rs.close()
        } catch (e: Exception) {
            if (ServerConstants.showPacket) e.printStackTrace()
            log("${e.message}", "MapleCharacter", TypeOfLog.ERROR)
        }
        return ret
    }

    fun reconstructCharacter(ct: CharacterTransfer, c: MapleClient, isChannel: Boolean): Character {
        val ret = Character(true)
        ret.classes.client = c
        if (!isChannel) ret.classes.client!!.channel = ct.channel.toInt()
        val stat = ret.info.stats
        stat.str = ct.str
        stat.dex = ct.dex
        stat.int_ = ct.int_
        stat.luk = ct.luk
        stat.maxhp = ct.maxhp
        stat.maxmp = ct.maxmp
        stat.hp = ct.hp
        stat.mp = ct.mp

        ret.info = Information(
                id = ct.characterid, name = ct.name, level = ct.level,
                fame = ct.fame, chalktext = ct.chalkboard, gmLevel = ct.gmLevel,
                stats = stat, exp = ct.exp, hpApUsed = ct.hpApUsed,
                remainAp = ct.remainingAp, remainSp = ct.remainingSp,
                gender = ct.gender, job = ct.job, locationed = ct.locationed,
                accountId = ct.accountid, initialSpawnPoint = ct.initialSpawnPoint, world = ct.world,
                fairyExp = ct.fairyExp, subcategory = ct.subcategory, firstLoginTime = ct.firstLoginTime,
                totalrep = ct.totalrep, currentrep = ct.currentrep, itemEffect = ct.itemEffect,
                monsterBookCover = ct.mbookcover, inventory = ct.inventorys as MutableList<MapleInventory>,
        )
        ret.ids = Identifies(
                mapId = ct.mapid, guildId = ct.guildid, marriageId = ct.marriageId,
                engageId = ct.engageId, lastMonthFameIds = ct.famedcharacters, lastmonthbattleids = ct.battledaccs
        )
        ret.rank = Rank(guildrank = ct.guildrank, allianceRank = ct.alliancerank)
        ret.appearance = Appearance(
                face = ct.face,
                hair = ct.hair,
                skinColor = ct.skinColor
        )
        ret.lists = Lists(
                skillMacros = ct.skillmacro as List<SkillMacro>, petStore = ct.petStore, savedLocations = ct.savedlocation,
                wishList = ct.wishlist, rocks = ct.rocks, regrocks = ct.regrocks, hyperrocks = ct.hyperrocks
        )
        ret.classes = Classes(buddyList = BuddyList(ct.buddysize), monsterBook = ct.monsterbook as MonsterBook, keyLayout = MapleKeyLayout(ct.keymap),
                storage = ct.storage as MapleStorage, cs = ct.cs as CashShop, anticheat = ct.anticheat as CheatTracker
        )
        ret.maps = Maps(questInfo = ct.InfoQuest)
        ret.money = Money(meso = ct.meso, points = ct.points, vpoints = ct.vpoints, acash = ct.ACash, maplepoints = ct.MaplePoints)
        ret.last = Lastdata(fameTime = ct.lastfametime, )

        c.accID = ct.accountid
        c.accountName = ct.accountname
        c.tempIP = ct.tempIP

        ret.classes.buddyList?.loadFromTransfer(ct.buddies)
        ret.classes.anticheat?.start(ret as MapleCharacter)

        if (ct.guildid > 0) ret.classes.mgc = MapleGuildCharacter(ret as MapleCharacter)
        World.Family.makeMFC(ct.familyid, ct.seniorid, ct.junior1, ct.junior2, ret.info.firstLoginTime)
        if (isChannel) {
            val mapFactory = c.channel.let { ChannelServer.getInstance(it).mapFactory }
            ret.classes.map = mapFactory?.getMap(ret.ids.mapId)
            if (ret.classes.map == null) {
                ret.classes.map = mapFactory?.getMap(100000000)
            } else {
                if (ret.classes.map?.forcedReturnId != 999999999 && ret.classes.map?.forcedReturnMap != null) {
                    ret.classes.map = ret.classes.map?.forcedReturnMap
                } else if (ret.ids.mapId in 925010000..925010300) {
                    ret.classes.map = mapFactory?.getMap(120000104)
                }
            }
            var portal = ret.classes.map?.getPortal(ret.info.initialSpawnPoint.toInt())
            if (portal == null) {
                portal = ret.classes.map?.getPortal(0)
                ret.info.initialSpawnPoint = 0
            }
            ret.position = portal?.position
            val messengerId = ct.messengerid
            if (messengerId > 0 ) {
                ret.classes.messenger = World.Messenger.getMessenger(messengerId)
            }
        } else {
            ret.classes.messenger = null
        }
        val partyId = ct.partyid
        if (partyId >= 0) {
            val party = World.Party.getParty(partyId)
            if (party?.getMemberById(ret.info.id) != null) ret.classes.party = party
        }
        var questStatusFrom: MapleQuestStatus
        for ((key, value) in ct.Quest) {
            questStatusFrom = value as MapleQuestStatus
            questStatusFrom.setQuest(key)
            ret.maps.quests[questStatusFrom.quest] = questStatusFrom
        }
        for ((key, value) in ct.Skills) {
            ret.maps.skills.put(SkillFactory.getSkill(key), value)
        }
        for (zz in ct.finishedAchievements) {
            ret.lists.finishedAchievements.add(zz)
        }
        for ((key, value) in ct.reports) {
            ReportType.getById(key.toInt())?.let { ret.maps.reports.put(it, value) }
        }
        return ret
    }

    fun loadCharacterFromDB(characterId: Int, c: MapleClient, channelServer: Boolean) {
        val ret = Character(channelServer)
        ret.classes.client = c
        ret.info.id = characterId

        try {
            val conn = DatabaseConnection.getConnection()
            var ps = conn?.prepareStatement("SELECT * FROM characters WHERE id = ?")
            ps?.setInt(1, characterId)
            var rs = ps?.executeQuery()!!
            if (!rs.next()) {
                ps.close()
                rs.close()
                throw RuntimeException("Loading the Character failed. (Character not found.)")
            }
            val stat = ret.info.stats
            stat.str = rs.getShort("str")
            stat.dex = rs.getShort("dex")
            stat.int_ = rs.getShort("int")
            stat.luk = rs.getShort("luk")
            stat.maxhp = rs.getInt("maxhp")
            stat.maxmp = rs.getInt("maxmp")
            stat.hp = rs.getInt("hp")
            stat.mp = rs.getInt("mp")
            for (i in 0..ret.info.remainSp.size) {
                ret.info.remainSp[i] = (rs.getString("sp").split(",")[i]).toInt()
            }
            ret.info = Information(
                    name = rs.getString("name"), level = rs.getShort("level"), fame = rs.getInt("fame"),
                    stats = stat, job = rs.getShort("job"), gmLevel = rs.getByte("gm"),
                    hide = false, exp = (if (rs.getShort("level") >= 200) 0 else rs.getInt("exp")), hpApUsed = rs.getShort("hpApUsed"),
                    remainAp = rs.getShort("ap"), gender = rs.getByte("gender"), locationed = rs.getInt("locationed"),
                    accountId = rs.getInt("accountid"), initialSpawnPoint = rs.getByte("spawnpoint"), world = rs.getByte("world"),
                    currentrep = rs.getInt("currentrep"), totalrep = rs.getInt("totalrep"), firstLoginTime = System.currentTimeMillis(),
                    subcategory = rs.getByte("subcategory"), monsterBookCover = rs.getInt("mbookcover")
            )
            ret.ids = Identifies(mapId = rs.getInt("map"), guildId = rs.getInt("guildid"), marriageId = rs.getInt("marriageId"), engageId = 0)
            ret.rank = Rank(
                    guildrank = rs.getByte("guildrank"), allianceRank = rs.getByte("allianceRank"), rank = rs.getInt("rank"),
                    jobRank = rs.getInt("jobRank"), jobRankMove = rs.getInt("jobRankMove")
            )
            ret.appearance = Appearance(skinColor = rs.getByte("skincolor"), hair = rs.getInt("hair"), face = rs.getInt("face"))
            ret.classes = Classes(buddyList = BuddyList(rs.getByte("buddyCapacity")), mount = MapleMount(ret, 0, 1004, 0, 1, 0))
            c.accID = rs.getInt("accountid")
            if (ret.ids.guildId > 0) ret.classes.mgc = MapleGuildCharacter(ret)
            ret.makeMFC(rs.getInt("familyid"), rs.getInt("seniorid"), rs.getInt("junior1"), rs.getInt("junior2"), ret.info.firstLoginTime)

            if(channelServer) {
                ret.classes.anticheat = CheatTracker(ret)
                val mapFactory = ChannelServer.getInstance(c.channel).mapFactory
                ret.classes.map = mapFactory.getMap(ret.ids.mapId)
                if (ret.classes.map == null) ret.classes.map = mapFactory.getMap(100000000)
                var portal = ret.classes.map?.getPortal(ret.info.initialSpawnPoint.toInt())
                if (portal == null) {
                    portal = ret.classes.map?.getPortal(0)
                    ret.info.initialSpawnPoint = 0
                }
                ret.position = portal?.position
                val partyId = rs.getInt("party")
                if (partyId >= 0) {
                    val party = World.Party.getParty(partyId)
                    if (party != null && party.getMemberById(ret.info.id) != null) ret.classes.party = party
                }
                val pets = rs.getString("pets").split(",")
                for (i in 0..ret.lists.petStore.size) {
                    ret.lists.petStore[i] = pets[i].toByte()
                }
                rs.close()
                ps.close()
                ps = conn?.prepareStatement("SELECT * FROM achievements WHERE accountid = ?")
                ps?.setInt(1, ret.info.accountId)
                rs = ps?.executeQuery()!!
                while (rs.next()) {
                    ret.lists.finishedAchievements.add(rs.getInt("achievementid"))
                }
                ps?.close()
                rs.close()

                ps = conn?.prepareStatement("SELECT * FROM reports WHERE characterid = ?")
                ps?.setInt(1, characterId)
                rs = ps?.executeQuery()!!
                while (rs.next()) {
                    if (ReportType.getById(rs.getByte("type").toInt()) != null)  {
                        ReportType.getById(rs.getByte("type").toInt())?.let { ret.maps.reports.put(it, rs.getInt("count")) }
                    }
                }
                ret.classes.monsterBook = MonsterBook()
                ret.classes.monsterBook?.loadCards(characterId)
                ps = conn?.prepareStatement("SELECT * FROM inventoryslot WHERE characterid = ?")
                ps?.setInt(1, characterId)
                rs = ps?.executeQuery()!!
                var equip: Byte = 32
                var use: Byte = 32
                var setup: Byte = 32
                var etc: Byte = 32
                var cash: Byte = 60
                if (rs.next()) {
                    rs.close()
                    ps?.close()
                    equip = rs.getByte("equip")
                    use = rs.getByte("use")
                    setup = rs.getByte("setup")
                    etc = rs.getByte("etc")
                    cash = rs.getByte("cash")
                }
                ret.getInventory(MapleInventoryType.EQUIP).slotLimit = equip
                ret.getInventory(MapleInventoryType.USE).slotLimit = use
                ret.getInventory(MapleInventoryType.SETUP).slotLimit = setup
                ret.getInventory(MapleInventoryType.ETC).slotLimit = etc
                ret.getInventory(MapleInventoryType.CASH).slotLimit = cash

                ps?.close()
                rs.close()

                for (mit in ItemLoader.INVENTORY.loadItems(false, characterId).values) {
                    ret.getInventory(mit.second).addFromDB(mit.first)
                    if (mit.first.getPet() != null) ret.lists.pets.add(mit.first.getPet()!!)
                }

                ps = conn.prepareStatement("SELECT ")
            }
            rs.close()
            ps?.close()

            ps = conn?.prepareStatement("SELECT * FROM queststatus WHERE characterid = ?")
            ps?.setInt(1, characterId)
            rs = ps?.executeQuery()!!
            val pse = conn?.prepareStatement("SELECT * FROM queststatusmobs WHERE queststatusid = ?")
            while (rs.next()) {
                val id = rs.getInt("quest")
                val q = MapleQuest.getInstance(id)
                val _stat = rs.getByte("status")
                if ((_stat == 1.toByte() || _stat == 2.toByte()) && channelServer && (q == null || q.isBlocked)) continue
                val status = MapleQuestStatus(q, _stat.toInt())
                val cTime = rs.getLong("time")
                if (cTime > -1) status.completionTime = cTime * 1000
                status.forfeited = rs.getInt("forfeited")
                status.customData = rs.getString("customdata")
                ret.maps.quests.put(q, status)
                pse?.setInt(1, rs.getInt("queststatusid"))
                val rsMobs = pse?.executeQuery()!!
                while (rsMobs.next()) {
                    status.setMobKills(rsMobs.getInt("mob"), rsMobs.getInt("count"))
                }
                rsMobs.close()
            }
            rs.close()
            ps?.close()
            pse?.close()

        }
    }

    fun getInventory(type: MapleInventoryType) = info.inventory[type.ordinal]
    fun onAttack(maxHp: Long, maxMp: Int, skillId: Int, oid: Int, totDamage: Int) {
        if (info.stats.hpRecoverProp > 0) {
            if (Randomizer.nextInt(100) <= info.stats.hpRecoverProp) {
                if (info.stats.hpRecover > 0) {
                    healHP(info.stats.hpRecover)
                }
                if (info.stats.hpRecoverPercent > 0) {
                    addHP(maxHp.coerceAtMost((totDamage.toDouble() * info.stats.hpRecoverPercent / 100.0).toInt().coerceAtMost(info.stats.maxHp / 2).toLong()).toInt())
                }
        }
    }

    fun clearLinkMid() {
        maps.linkMobs.clear()
        cancelEffectFromBuffStat(MapleBuffStat.HOMING_BEACON)
    }

    fun getFirstLinkMid(): Int {
        for (lm in maps.linkMobs.keys) {
            return lm
        }
        return 0
    }

    fun setLinkMid(lm: Int, x: Int) = maps.linkMobs.put(lm, x)

    fun getDamageIncrease(lm: Int) = if (maps.linkMobs.containsKey(lm)) maps.linkMobs[lm] else 0


    fun afterAttack(mobCount: Int, attackCount: Int, skillId: Int) {
        when (info.job.toInt()) {
            511, 512 -> handleEnergyCharge(5110001, mobCount * attackCount)
            111, 112 -> if (skillId != 11111003 && skillId != 11111002 && skillId != 11111003 && skillId != 1111008 && getBuffedValue(MapleBuffStat.COMBO) != null) handleOrbgain()

        }
    }

    fun getBounds() = Rectangle(truePosition.x - 25, truePosition.y - 75, 50, 75)

    fun changeMusic(name: String) {
        classes.client?.session?.write(MaplePacketCreator.musicChange(name))
    }

    fun getQuestNAdd(quest: MapleQuest): MapleQuestStatus? {
        if (!info.quests.containsKey(quest)) {
            val status = MapleQuestStatus(quest, 0)
            info.quests.put(quest, status)
            return status
        }
        return info.quests.get(quest)
    }


    fun handleEnergyCharge(skillId: Int, targets: Int) {
        val echSkill = SkillFactory.getSkill(skillId)
        val skillLevel = getTotalSkillLevel(echSkill)
        if (skillLevel > 0) {
            val echEffect = echSkill.getEffect(skillLevel)
            if (targets > 0) {
                if (getBuffedValue(MapleBuffStat.ENERGY_CHARGE) == null) {
                    echEffect.applyEnergyBuff(this, true)
                } else {
                    var energyLevel = getBuffedValue(MapleBuffStat.ENERGY_CHARGE)
                    //TODO: bar going down
                    if (energyLevel < 10000) {
                        energyLevel += (echEffect.x * targets)
                        classes.client?.session?.write(MaplePacketCreator.showOwnBuffEffect(skillId, 2, info.level, skillLevel))
                        setBuffedValue(MapleBuffStat.ENERGY_CHARGE, energyLevel)
                    } else if (energyLevel == 10000) {
                        echEffect.applyEnergyBuff(this, false)
                        setBuffedValue(MapleBuffStat.ENERGY_CHARGE, 10001)
                    }
                }
            }
        }

    }

    fun getQuestRecord(id: Int) = getQuestNAdd(MapleQuest.getInstance(id))

    fun serverNotice(message: String) = World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, message))

    fun serverNoticeY(message: String) = World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(message))

    fun setLocation(map: Int) {
        info.locationed = map
    }

    fun getMyInfo(): String {
        if (classes.client?.player?.ids?.guildId == 0) {
            return "< Lv.${info.level} ${getJobName()} >"
        } else {
            return "< Lv.${info.level} ${getJobName()} ${getGuild().getName()} 소속 >"
        }
    }

    fun getJobName(): String? = when (info.job.toInt()) {
            0 -> "초보자"
            100 -> "전사"
            110 -> "파이터"
            111 -> "크루세이더"
            112 -> "히어로"
            120 -> "페이지"
            121 -> "나이트"
            122 -> "팔라딘"
            130 -> "스피어맨"
            131 -> "용기사"
            132 -> "다크나이트"
            200 -> "마법사"
            210 -> "위자드(F.P)"
            211 -> "메이지(F.P)"
            212 -> "아크메이지(F.P)"
            220 -> "위자드(I.C)"
            221 -> "메이지(I.C)"
            222 -> "아크메이지(I.C)"
            230 -> "클레릭"
            231 -> "프리스트"
            232 -> "비숍"
            300 -> "궁수"
            310 -> "헌터"
            311 -> "레인저"
            312 -> "보우마스터"
            320 -> "사수"
            321 -> "저격수"
            322 -> "신궁"
            400 -> "도적"
            410 -> "어쎄신"
            411 -> "허밋"
            412 -> "나이트로드"
            420 -> "시프"
            421 -> "시프마스터"
            422 -> "섀도어"
            500 -> "해적"
            510 -> "인파이터"
            511 -> "버커니어"
            512 -> "바이퍼"
            520 -> "건슬링거"
            521 -> "발키리"
            522 -> "캡틴"
            900 -> "운영자"
            else -> null
        }
    }

    fun reloadCharacter() {
        val c = classes.client
        val map = classes.map
        c?.session?.write(MaplePacketCreator.getCharInfo(c.player))
        map?.removePlayer(c?.player)
        map?.addPlayer(c?.player)
    }
    fun removeEquipped(id: Short) = MapleInventoryManipulator.removeFromSlot(classes.client, MapleInventoryType.EQUIPPED, id, 1, false, false)

    fun getAllConnection(): Int? {
        val connected = World.getConnected()
        for (i in connected.keys) {
            return connected[i]
        }
        return 0
    }

    fun openNpc(id: Int, sub: String? = null) {
        if (sub == null) {
            NPCScriptManager.getInstance().start(classes.client, id)
        } else {
            NPCScriptManager.getInstance().start(classes.client, id, sub)
        }
    }

}*/