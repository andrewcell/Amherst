package client.messages

import client.MapleClient
import constants.ServerConstants
import server.log.Logger
import server.log.Logger.log
import server.log.TypeOfLog

object CommandProcessor {
    @JvmStatic
    fun Command(c: MapleClient, text: String, type: ServerConstants.CommandType): Boolean {
        if (c.player.gmLevel < ServerConstants.PlayerGMRank.GM.level) { // Check player is GM (lower than 1 means not GM)
            return false
        }

        if (text[0] == ServerConstants.PlayerGMRank.GM.commandPrefix) { // if same as command prefix (! for GM)
            val splitArguments = text.split(" ")
            val command = splitArguments[0].split(ServerConstants.PlayerGMRank.GM.commandPrefix)[1].toLowerCase()
            when (command) {
                "help" -> GMCommand.Help(c)
                "level", "job", "meso", "maxmeso", "map" -> GMCommand.Common(c, splitArguments, command)
                "megaphone" -> GMCommand.megaphone(c, text)
                "servermessage" -> GMCommand.serverMessage(c, text)
                else -> sendMessage(c, "Command not found.")
            }
            return true
        } else {
            return false
        }
    }

    fun sendMessage(c: MapleClient, message: String) {
        if (c.player == null) return;
        c.player.dropMessage(6, message)
    }
}