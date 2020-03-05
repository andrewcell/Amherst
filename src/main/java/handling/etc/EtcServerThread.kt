package handling.etc

import java.io.IOException
import java.net.ServerSocket
import java.util.logging.Level

import client.MapleClient
import handling.ServerType
import handling.SessionOpen
import server.GeneralThreadPool
import server.log.Logger.log
import server.log.TypeOfLog

class EtcServerThread : Thread() {
    @JvmField
    var _serverSocket: ServerSocket? = null
    override fun run() {
        while (true) {
            try {
                val socket = _serverSocket!!.accept()
                log("New Connection from ${socket.inetAddress}", "EtcServer")
                val host = socket.inetAddress.hostAddress
                if (SessionOpen.sessionOpen(host, ServerType.ETC, -5)) { // Session OK!
                    val client = MapleClient(socket, -5, true)
                    GeneralThreadPool.getInstance().execute(client)
                } else { // Session Failed or Banned
                    log("Session Opening Failed on ($host)", "EtcServer", TypeOfLog.ERROR);
                }
            } catch (ioe: IOException) {
            }
        }
    }
}