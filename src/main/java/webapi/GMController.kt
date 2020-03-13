package webapi

import client.MapleCharacter
import client.MapleClient
import constants.ServerConstants
import database.DatabaseConnection
import handling.channel.ChannelServer
import handling.world.World
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import tools.MaplePacketCreator
import webapi.GMBody.Broadcast
import webapi.data.RequestJSON
import webapi.data.Result

@RestController
@RequestMapping(value = ["gm"])
class GMController {
    @RequestMapping(value = ["broadcast"], method = arrayOf(RequestMethod.POST))
    fun message(@RequestBody request: Broadcast): Result {
        if (TokenManager.getAccountId(request.token) == -1 || !checkGM(request.token)) return unauthorized
        World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(request.messageType, request.message))
        return Result(code = 200, comment = "success")
    }

    @RequestMapping(value = ["online"], method = arrayOf(RequestMethod.POST))
    fun online(@RequestBody request: RequestJSON): Result {
        if (TokenManager.getAccountId(request.token) == -1 || !checkGM(request.token)) return unauthorized
        val arrayOfPlayers: MutableList<Pair<String, String>> = mutableListOf()
        val channels = ChannelServer.getAllInstances()
        for (channel in channels) {
            for (player in channel.playerStorage.allCharacters) {
                arrayOfPlayers.add(Pair(player.name, channel.channel.toString()))
            }
        }
        return Result(code = 200, comment = "success", data = arrayOfPlayers)
    }

    fun checkGM(token: String): Boolean {
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

    val unauthorized: Result = Result(code = 400, comment = "Unauthorized")
}