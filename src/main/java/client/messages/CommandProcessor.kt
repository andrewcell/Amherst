package client.messages

import client.MapleClient
import constants.ServerConstants
import server.log.Logger
import server.log.TypeOfLog

object CommandProcessor {
    @JvmStatic
    fun Command(c: MapleClient, text: String, type: ServerConstants.CommandType): Boolean {
        if (c.player.gmLevel < ServerConstants.PlayerGMRank.GM.level) { // Check player is GM (lower than 1 means not GM)
            return false
        }

        if (text[0] == ServerConstants.PlayerGMRank.GM.commandPrefix) { // if same as command prefix (! for GM)
            val splitted = text.split(" ")
            val command = splitted[0].split(ServerConstants.PlayerGMRank.GM.commandPrefix)[1].toLowerCase()
            when (command) {
                "level" -> try {
                    GMCommand.Level(c, splitted[1].toShort())
                } catch (e: Exception) {
                    sendMessage(c, "Failed to parse Level value.")
                    e.message?.let { Logger.log(it, "CommandProcessor", TypeOfLog.ERROR) }
                }
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