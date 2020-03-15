package client.messages

import client.MapleClient
import client.SkillFactory
import client.messages.CommandProcessor.sendMessage
import handling.channel.ChannelServer
import handling.channel.handler.StatsHandling
import handling.world.World
import provider.MapleDataProviderFactory
import scripting.NPCScriptManager
import scripting.ReactorScriptManager
import server.MapleCarnivalChallenge
import server.MapleInventoryManipulator
import server.MapleItemInformationProvider
import server.life.MapleMonsterInformationProvider
import server.log.Logger
import server.log.TypeOfLog
import tools.MaplePacketCreator
import java.lang.Exception
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
        sendMessage(c, "!map <MapId> : Teleport to indicated MapID")
        sendMessage(c, "!megaphone <Message> : Use megaphone for free!")
        sendMessage(c, "!servermessage <Message> : Set Server message appear top of game window.")
        sendMessage(c, "!skillmaster : All your skill going master level.")
        sendMessage(c, "!additem <ItemID> <Quantity> : Item for free!")
        sendMessage(c, "!setap <Type> <Number> : Set Ability Point manually.")
        sendMessage(c, "!setrate <Type> <Number> : Change rate temporarily.")
        sendMessage(c, "!reloaddrop : Reload all drop data.")
    }

    fun Common(c: MapleClient, split: List<String>, command: String) {
        try {
            val player = c.player
            if (split.size < 2 && command != "maxmeso")  {
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
                "map" -> {
                    val targetMap = c.channelServer.mapFactory.getMap(split[1].toInt())
                    if (targetMap == null) throw NumberFormatException() else player.changeMap(targetMap)
                }
                "setstat" -> {
                    val value = split[2].toShort()
                    when(split[1].toLowerCase()) {
                        "str" -> player.stat.setStr(value, c.player)
                        "dex" -> player.stat.setDex(value, c.player)
                        "int" -> player.stat.setInt(value, c.player)
                        "luk" -> player.stat.setLuk(value, c.player)
                        "hp" -> player.stat.setHp(split[2].toInt(), c.player)
                        "mp" -> player.stat.setMp(split[2].toInt(), c.player)
                        "maxhp" -> player.stat.setMaxHp(split[2].toInt(), c.player)
                        "maxmp" -> player.stat.setMaxMp(split[2].toInt(), c.player)
                    }
                    sendMessage(c, "${split[1]} changed to $value. Exit game and enter may require to apply new value.")
                }
                "cash" -> {
                    val value = split[1]
                    c.player.modifyCSPoints(1, value.toInt(), true)
                    sendMessage(c, "${split[1]} of cash added to your account.")
                }
            }
        } catch (nfe: NumberFormatException) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
            Logger.log("${c.player.name} caused invalid value error.", "GMCommand", TypeOfLog.WARNING)
        }
    }

    fun megaphone(c: MapleClient, text: String) {
        try {
            val message = text.removeRange(0, 11)
            World.Broadcast.broadcastSmega(MaplePacketCreator.serverNotice(3, c.channel, "${c.player.name} : $message"))
        } catch (e: Exception) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
        }
    }

    fun serverMessage(c: MapleClient, text: String) {
        try {
            val message = text.removeRange(0, 14)
            World.Broadcast.broadcastMessage(MaplePacketCreator.serverMessage(message))
        } catch (e: Exception) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
        }
    }

    fun addItem(c: MapleClient, split: List<String>) {
        try {
            if (split.size < 3) throw NumberFormatException()
            val provider = MapleItemInformationProvider.getInstance()

            if (!provider.itemExists(split[1].toInt())) {
                sendMessage(c, "ItemId ${split[1]} not found.")
                return
            }
            val itemId = split[1].toInt()
            val quantity = split[2].toShort()
            MapleInventoryManipulator.addById(c, itemId, quantity, null)
            sendMessage(c, "$quantity of ${provider.getItemInformation(itemId).name} added to you inventory.")
        } catch (e: Exception) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
            Logger.log("${c.player.name} caused invalid value error.", "GMCommand", TypeOfLog.WARNING)
        }
    }

    fun skillMaster(c: MapleClient) {
        for(skill in SkillFactory.getAllSkills()) {
            c.player.changeSkillLevel(skill, skill.maxLevel, skill.maxLevel.toByte())
        }
        sendMessage(c, "Done. You are almost like Black mage!")
    }

    fun setRate(c: MapleClient, split: List<String>) {
        try {
            if (split.size < 3) throw NumberFormatException()
            val type = split[1]
            val rate = split[2].toInt()

            for (channel in ChannelServer.getAllInstances()) {
                when (type.toLowerCase()) {
                    "exp" -> channel.expRate = rate
                    "drop" -> channel.dropRate = rate
                    "meso" -> channel.mesoRate = rate

                }
            }
            sendMessage(c, "${type.toLowerCase()} rate changed to $rate.")
        } catch (e: Exception) {
            sendMessage(c, "You entered invalid format of argument. Type !help for argument information.")
            Logger.log("${c.player.name} caused invalid value error.", "GMCommand", TypeOfLog.WARNING)
        }
    }

    fun reloadData(type: String, c: MapleClient) {
        MapleMonsterInformationProvider.getInstance().clearDrops()
        ReactorScriptManager.getInstance().clearDrops()
        sendMessage(c, "Done. Drop data reloaded.")
        Logger.log("${c.player.name} reloaded drop data.", "GMCommand")
    }
}
