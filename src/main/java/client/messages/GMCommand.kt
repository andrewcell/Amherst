package client.messages

import client.MapleClient
import client.messages.CommandProcessor.sendMessage
import scripting.NPCScriptManager
import server.MapleCarnivalChallenge
import server.log.Logger
import server.log.TypeOfLog
import tools.MaplePacketCreator
import java.lang.NumberFormatException

object GMCommand {
    fun Help(c: MapleClient) {
        c.removeClickedNPC();
        NPCScriptManager.getInstance().dispose(c);
        c.getSession().write(MaplePacketCreator.enableActions());

        sendMessage(c, "!level <1-200> : Adjust player level.")
        sendMessage(c, "!job <JobID> : Change Job of player.")
        sendMessage(c, "!meso <Number> : Add amount of meso.")
        sendMessage(c, "!maxmeso : Make player have Maximum amount of Meso.")
    }

    fun Common(c: MapleClient, split: List<String>, command: String) {
        try {
            val player = c.player
            if (split.size < 2) {
                throw NumberFormatException()
            }
            when (command) {
                "level" -> {
                    player.level = split[1].toShort()
                    player.levelUp()
                    if (player.exp < 0) {
                        player.gainExp(-c.player.exp, false, false, true)
                    }
                }
                "job" -> if (MapleCarnivalChallenge.getJobNameById(split[1].toInt()).isEmpty()) sendMessage(c, "Invalid Job Number.") else player.changeJob(split[1].toInt())
                "meso" -> player.gainMeso(split[1].toInt(), true)
                "maxmeso" -> player.gainMeso(Int.MAX_VALUE - player.meso, true)
            }
        } catch (nfe: NumberFormatException) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
            Logger.log("${c.player.name} caused invalid value error.", "GMCommand", TypeOfLog.WARNING)
        }
    }
}
