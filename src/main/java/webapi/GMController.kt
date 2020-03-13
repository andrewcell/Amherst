package webapi

import client.MapleCharacter
import client.MapleClient
import constants.ServerConstants
import database.DatabaseConnection
import handling.channel.ChannelServer
import handling.world.World
import org.springframework.web.bind.annotation.*
import tools.MaplePacketCreator
import tools.scripts.NPCScriptExtractor
import webapi.GMBody.Broadcast
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
            "yellow", "servermessage" -> World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(4, "${request.sender} : ${request.message}")) // Top of game window scrolling yellow letter
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
                        Pair("map",  mapOf(Pair("id", player.map.id), Pair("fullname", NPCScriptExtractor.getMapName(player.map.id)), Pair("name", player.map.mapName))),
                        Pair("job", player.job),
                        Pair("jobname", player.jobName),
                        Pair("position", player.position)
                ))
            }
        }
        return Result(code = 200, comment = "success", data = arrayOfPlayers)
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