package handling.cashshop

import java.io.IOException
import java.net.ServerSocket

import client.MapleClient
import constants.ServerConstants
import handling.ServerType
import handling.SessionOpen
import handling.cashshop.CashShopServer.isShutdown
import server.log.Logger.log
import server.GeneralThreadPool
import server.log.TypeOfLog

class CashShopServerThread : Thread() {
    var _serverSocket: ServerSocket? = null

    override fun run() {
        while (!isShutdown) {
            try {
                val socket = _serverSocket!!.accept()
                log("New Connection from $socket.inetAddress", "CashShopServer");
                val host = socket.inetAddress.hostAddress
                if (SessionOpen.sessionOpen(host, ServerType.CASHSHOP, -10)) { // Session OK!
                    val client = MapleClient(socket, -10, !ServerConstants.Use_Fixed_IV)
                    GeneralThreadPool.getInstance().execute(client)
                } else { // Session Failed or Banned

                    log("Session Opening Failed on ($host)", "CashShopServer", TypeOfLog.ERROR);
                }
            } catch (ioe: IOException) {
            }
        }
    }
}