package webapi

import client.inventory.MapleInventoryType.*
import constants.GameConstants
import constants.ServerConstants
import database.DatabaseConnection
import handling.channel.ChannelServer
import handling.world.World
import org.springframework.web.bind.annotation.*
import server.ItemInformation
import server.MapleItemInformationProvider
import tools.MaplePacketCreator
import tools.scripts.NPCScriptExtractor
import webapi.GMBody.Broadcast
import webapi.GMBody.ByCharacter
import webapi.GMBody.Lists
import webapi.GMBody.Search
import webapi.data.RequestJSON
import webapi.data.Result

@RestController
@RequestMapping(value = ["gm"])
class GMController {
    @RequestMapping(value = ["broadcast/{type}"], method = arrayOf(RequestMethod.POST)) // One lineBlue notice
    fun noticeMessage(@RequestBody request: Broadcast, @PathVariable type: String): Result {
        if (TokenManager.getAccountId(request.token) == -1 || !checkGM(request.token)) return unauthorized
        when (type) {
            "notice" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(0, request.message.toString())) // Blue line notice
            "popup" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(1, request.message)) // Popup notice
            "gmchat" -> { // skyblue background, blue letter
                if (request.sender == null) return senderRequired
                World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(2, "${request.sender} : ${request.message}"))
            }
            //"3" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(3, "${request.message}")) - Crashed
            "yellow", "servermessage" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(4, "${request.message}")) // Top of game window scrolling yellow letter
            "pink" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(5, request.message)) // Pink Text
            "blue" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, request.message)) // Blue Text
            "green" -> { // Green background ([W:255] is appear - buggy) sender required.
                if (request.sender == null) return senderRequired
                World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(9, request.message))
            }
            "else" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(request.type, "asd : ${request.message}"))
            else -> return Result(code = 402, comment = "Wrong broadcast style")
        }
        return Result(code = 200, comment = "success")
    }

    @RequestMapping(value = ["online"], method = arrayOf(RequestMethod.POST))
    fun online(@RequestBody request: RequestJSON): Result {
        if (TokenManager.getAccountId(request.token) == -1 || !checkGM(request.token)) return unauthorized
        val arrayOfPlayers: MutableList<Map<String, Any>> = mutableListOf()
        val channels = ChannelServer.getAllInstances()
        for (channel in channels) {
            for (player in channel.playerStorage.allCharacters) {
                arrayOfPlayers.add(mapOf(
                        Pair("id", player.id),
                        Pair("accountid", player.accountID),
                        Pair("name", player.name),
                        Pair("level", player.level),
                        Pair("channel", channel.channel),
                        Pair("map", mapOf(Pair("id", player.map.id), Pair("fullname", NPCScriptExtractor.getMapName(player.map.id)), Pair("name", player.map.mapName))),
                        Pair("job", player.job),
                        Pair("jobname", player.jobName),
                        Pair("position", player.position)
                ))
            }
        }
        return Result(code = 200, comment = "success", data = arrayOfPlayers)
    }

    @RequestMapping(value = ["lists/item", "lists/item/{type}"], method = arrayOf(RequestMethod.POST))
    fun lists(@RequestBody req: Lists, @PathVariable(required = false) type: String?): Result {
        if (TokenManager.getAccountId(req.token) == -1 || !checkGM(req.token)) return Result(code = 400, comment = "Unauthorized")
        val result: MutableList<Map<String, Any>> = mutableListOf()
        val type = when (type) {
            "equip" -> EQUIP
            "use" -> USE
            "setup" -> SETUP
            "etc" -> ETC
            "cash" -> CASH
            else -> UNDEFINED
        }
        for (item in MapleItemInformationProvider.getInstance().allItems) {
            if (GameConstants.getInventoryType(item.itemId) == type || type == UNDEFINED) {
                result.add(generateItemToString(item))
            }
        }
        return Result(200, "success", result)
    }

    private fun generateItemToString(item: ItemInformation): Map<String, Any> {
        return mapOf(
                Pair("id", item.itemId),
                Pair("name", item.name),
                Pair("meso", item.meso),
                Pair("desc", item.desc),
                Pair("price", item.price),
                Pair("message", item.msg),
                Pair("flag", item.flag),
                Pair("monsterbook", item.monsterBook),
                Pair("mob", item.mob),
                Pair("karmaenabled", item.karmaEnabled),
                Pair("itemmakelevel", item.itemMakeLevel),
                Pair("incskill", item.incSkill),
                Pair("equipstats", item.equipStats),
                Pair("equipincs", item.equipIncs),
                Pair("equipadditions", item.equipAdditions),
                Pair("cardset", item.cardSet),
                Pair("create", item.create),
                Pair("afterimage", item.afterImage),
                Pair("questId", item.questId),
                Pair("questItems", item.questItems),
                Pair("rewarditems", item.rewardItems),
                Pair("scrollreqs", item.scrollReqs),
                Pair("slotmax", item.slotMax),
                Pair("statechange", item.stateChange),
                Pair("totalprob", item.totalprob),
                Pair("wholeprice", item.wholePrice)
        )
    }

    @RequestMapping(value = ["search/item", "search/item/{queryType}"], method = arrayOf(RequestMethod.POST))
    fun search(@RequestBody req: Search, @PathVariable(required = false) queryType: String?): Result {
        if (TokenManager.getAccountId(req.token) == -1 || !checkGM(req.token)) return Result(code = 400, comment = "Unauthorized")
        val type = when (queryType) {
            "equip" -> EQUIP
            "use" -> USE
            "setup" -> SETUP
            "etc" -> ETC
            "cash" -> CASH
            else -> UNDEFINED
        }
        val result: MutableList<Map<String, Any>> = mutableListOf()
        for (item in MapleItemInformationProvider.getInstance().allItems) {
            if (req.query?.toLowerCase()?.let { item.name.toLowerCase().contains(it) }!!) {
                if (GameConstants.getInventoryType(item.itemId) == type || type == UNDEFINED) {
                    result.add(generateItemToString(item))
                }
            }
        }
        return Result(200, "success", data = result)
    }

    @RequestMapping(value = ["character/info"], method = arrayOf(RequestMethod.POST))
    fun charInfo(@RequestBody req: ByCharacter): Result {
        if (TokenManager.getAccountId(req.token) == -1 || !checkGM(req.token)) return Result(code = 400, comment = "Unauthorized")

        val connection = DatabaseConnection.getConnection()
        val ps = connection?.prepareStatement("SELECT * FROM characters WHERE id = ? OR name = ?")!!
        ps.setInt(1, req.characterId ?: -1)
        ps.setString(2, req.name ?: "")
        val rs = ps.executeQuery()

        if (!rs.next()) return Result(code = 501, comment = "Character not found")
        val metaData = rs.metaData
        val data: MutableMap<String, Any> = mutableMapOf()
        for (i in 1..metaData.columnCount) {
            data.put(metaData.getColumnLabel(i), rs.getObject(i))
        }
        rs.close()
        ps.close()
        connection.close()
        return Result(code = 200, comment = "success", data = data)
    }

    @RequestMapping(value = ["character/inventory"], method = arrayOf(RequestMethod.POST))
    fun charInventory(@RequestBody req: ByCharacter): Result {
        if (TokenManager.getAccountId(req.token) == -1 || !checkGM(req.token)) return Result(code = 400, comment = "Unauthorized")
        val inventory: MutableMap<String, MutableList<MutableMap<String, Any?>>> = mutableMapOf(
                Pair(EQUIP.name, mutableListOf()),
                Pair(USE.name, mutableListOf()),
                Pair(SETUP.name, mutableListOf()),
                Pair(ETC.name, mutableListOf()),
                Pair(CASH.name, mutableListOf()),
                Pair(UNDEFINED.name, mutableListOf())
        )
        val conn = DatabaseConnection.getConnection()

        var charId = req.characterId ?: -1
        if (charId == -1 && req.name != null) { // If character id not provided but name
            val ps = conn?.prepareStatement("SELECT id FROM characters WHERE name = ?")
            ps?.setString(1, req.name)!!
            val rs = ps.executeQuery()
            if (rs.next()) {
                charId = rs.getInt(1)
            }
        }
        val ps = conn?.prepareStatement("SELECT * FROM inventoryitems WHERE characterid = ?")!!
        ps.setInt(1, charId)

        val rs = ps.executeQuery()

        val metaData = rs.metaData
        while (rs.next()) {
            val data: MutableMap<String, Any?> = mutableMapOf()
            for (i in 1..metaData.columnCount) {
                data.put(metaData.getColumnLabel(i), rs.getObject(i))
            }
            data.put("name", MapleItemInformationProvider.getInstance().getName(rs.getInt("itemid")))
            when (rs.getByte("inventorytype")) {
                EQUIPPED.type, EQUIP.type -> inventory[EQUIP.name]?.add(data)
                USE.type -> inventory[USE.name]?.add(data)
                SETUP.type -> inventory[SETUP.name]?.add(data)
                ETC.type -> inventory[ETC.name]?.add(data)
                CASH.type -> inventory[CASH.name]?.add(data)
                else -> inventory[UNDEFINED.name]?.add(data)
            }
        }
        rs.close()
        ps.close()
        conn.close()
        return Result(code = 200, comment = "success", data = inventory)
    }

    private fun checkGM(token: String): Boolean {
        try {
            val connection = DatabaseConnection.getConnection()
            val ps = connection!!.prepareStatement("SELECT gm FROM accounts WHERE id=?")
            ps.setInt(1, TokenManager.getAccountId(token))
            val rs = ps.executeQuery()
            if (rs.next()) {
                if (rs.getInt("gm") >= ServerConstants.PlayerGMRank.GM.level) {
                    return true
                }
            }
            return false
        } catch (e: Exception) {
            if (ServerConstants.showPacket) e.printStackTrace()
            return false
        }
    }

    private val unauthorized: Result = Result(code = 400, comment = "Unauthorized")
    private val senderRequired: Result = Result(code = 401, comment = "Sender name required")
}