package handling.channel

import java.io.IOException
import java.net.ServerSocket

import client.MapleClient
import constants.ServerConstants
import handling.ServerType
import handling.SessionOpen
import server.GeneralThreadPool
import server.log.Logger.log
import server.log.TypeOfLog

class ChannelServerThread(val channel: Int, val port: Int) : Thread() {
    @JvmField
    var _serverSocket: ServerSocket? = null
    override fun run() {
        while (!ChannelServer.getInstance(channel).isShutdown) {
            try {
                val socket = _serverSocket!!.accept()
                log("${socket.inetAddress} entered Channel $channel ", "ChannelServer")
                val host = socket.inetAddress.hostAddress
                if (SessionOpen.sessionOpen(host, ServerType.CHANNEL, channel)) { // Session OK!
                    val client = MapleClient(socket, channel, !ServerConstants.Use_Fixed_IV)
                    GeneralThreadPool.getInstance().execute(client)
                } else { // Session Failed or Banned
                    log("Session Opening Failed on ($host)", "ChannelServer", TypeOfLog.ERROR);
                }
            } catch (ioe: IOException) {
            }
        }
    }
}