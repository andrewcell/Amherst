package webapi

import constants.ServerConstants
import database.DatabaseConnection
import handling.world.World
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import tools.MaplePacketCreator
import webapi.GMBody.Broadcast
import webapi.data.Result

@RestController
@RequestMapping(value = ["gm"])
class GMController {
    /*@RequestMapping(value = ["broadcast"], method = arrayOf(RequestMethod.POST))
    fun message(@RequestBody request: Broadcast): Result {
        val connection = DatabaseConnection.getConnection()
        val ps = connection!!.prepareStatement("SELECT gm FROM accounts WHERE id=?")
        val accountId = TokenManager.getAccountId(request.token)
        if (accountId == -1) {
            return Result(code = 400, comment = "Unauthorized")
        }
        ps.setInt(1, accountId)
        val rs = ps.executeQuery()
        if (rs.next()) {
            if (rs.getInt("gm") >= ServerConstants.PlayerGMRank.GM.level) {
                World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(0, request.message))
                return Result(code = 200, comment = "success")
            }
        }
        return Result(code = 400, comment = "Unauthorized")
    }*/
}