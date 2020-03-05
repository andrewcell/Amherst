package server.log

import constants.ServerConstants
import database.DatabaseConnection.getConnection
import handling.etc.EtcServer
import server.log.LogType.Chat
import server.log.LogType.Trade
import tools.packet.EtcPacket
import java.sql.Connection
import java.sql.SQLException
import java.sql.Timestamp

class DBLogger {
    private val com = LogCommiter(10000)
    fun shutdown() {
        com.shutdown()
    }

    fun clearLog(chat: Int, item: Int, trade: Int) {
        var con: Connection? = null
        try {
            con = getConnection()
            con!!.prepareStatement("DELETE FROM `log_chat` WHERE `time` < DATE_SUB(now(), INTERVAL $chat DAY)").executeUpdate()
            con.prepareStatement("DELETE FROM `log_item` WHERE `time` < DATE_SUB(now(), INTERVAL $item DAY)").executeUpdate()
            con.prepareStatement("DELETE FROM `log_trade` WHERE `time` < DATE_SUB(now(), INTERVAL $trade DAY)").executeUpdate()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            if (con != null) {
                try {
                    con.close()
                } catch (ex: SQLException) {
                }
            }
        }
    }

    private fun getTimeString(time: Long): String {
        val stamp = Timestamp(time)
        return stamp.toString()
    }

    private fun escape(input: String): String {
        return input.replace("\\", "\\\\").replace("\'", "\\'").replace("\"", "\\\"")
    }

    fun logChat(type: Chat, cid: Int, charname: String, message: String, etc: String) {
        EtcServer.broadcast(EtcPacket.getChatResult("[" + type.name + "] " + charname + " : ", "$message($etc)"))
        if (!ServerConstants.logChat) {
            return
        }
        com.addQuery(String.format("INSERT INTO `log_chat` (`type`, `cid`, `charname`, `message`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%s', '%s', '%s')", type.i, cid, escape(charname), escape(message), escape(etc), getTimeString(System.currentTimeMillis())))
    }

    fun logItem(type: LogType.Item, cid: Int, name: String, itemid: Int, quantity: Int, itemname: String, meso: Int, etc: String) {
        if (!ServerConstants.logItem) {
            return
        }
        com.addQuery(String.format("INSERT INTO `log_item` (`type`, `cid`, `name`, `itemid`, `quantity`, `itemname`, `meso`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%d', '%d', '%s', '%d', '%s', '%s')", type.i, cid, escape(name), itemid, quantity, escape(itemname), meso, escape(etc), getTimeString(System.currentTimeMillis())))
    }

    fun logTrade(type: Trade, cid: Int, name: String, partnername: String, item: String, etc: String) {
        if (!ServerConstants.logTrade) {
            return
        }
        if (name == partnername) {
            return
        }
        com.addQuery(String.format("INSERT INTO `log_trade` (`type`, `cid`, `name`, `partnername`, `item`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%s', '%s', '%s', '%s')", type.i, cid, escape(name), escape(partnername), escape(item), escape(etc), getTimeString(System.currentTimeMillis())))
    }

    companion object {
        @JvmField
        val instance = DBLogger()
    }
}