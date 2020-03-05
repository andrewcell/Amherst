package handling.cashshop

import client.MapleClient
import constants.ServerConstants
import handling.ServerType
import handling.SessionOpen
import handling.cashshop.CashShopServer.isShutdown
import server.GeneralThreadPool
import java.io.IOException
import java.net.ServerSocket
import java.util.logging.Level
import java.util.logging.Logger

class CashShopServerThread : Thread() {
    var _serverSocket: ServerSocket? = null
    override fun run() {
        while (!isShutdown) {
            try {
                val socket = _serverSocket!!.accept()
                System.out.println("New Connection from " + socket.inetAddress);
                val host = socket.inetAddress.hostAddress
                if (SessionOpen.sessionOpen(host, ServerType.CASHSHOP, -10)) { // Session OK!
                    val client = MapleClient(socket, -10, !ServerConstants.Use_Fixed_IV)
                    GeneralThreadPool.getInstance().execute(client)
                } else { // Session Failed or Banned
                    _log.log(Level.INFO, "Session Opening Failed on ({0})", host)
                }
            } catch (ioe: IOException) {
            }
        }
    }

    companion object {
        private val _log = Logger.getLogger(CashShopServerThread::class.java
                .name)
    }
}