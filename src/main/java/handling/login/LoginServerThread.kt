package handling.login

import java.io.IOException
import java.net.ServerSocket

import client.MapleClient
import constants.ServerConstants
import handling.ServerType
import handling.SessionOpen
import server.GeneralThreadPool
import server.log.Logger.log
import server.log.TypeOfLog

class LoginServerThread : Thread() {
    @JvmField
    var _serverSocket: ServerSocket? = null

    override fun run() {
        while (!LoginServer.isShutdown()) {
            try {
                val socket = _serverSocket!!.accept()
                log("New Connection from ${socket.inetAddress}", "LoginServer")
                val host = socket.inetAddress.hostAddress
                if (SessionOpen.sessionOpen(host, ServerType.LOGIN, -1)) { // Session OK!
                    val client = MapleClient(socket, -1, !ServerConstants.Use_Fixed_IV)
                    GeneralThreadPool.getInstance().execute(client)
                } else { // Session Failed or Banned
                    log("Session Opening Failed on ($host)", "LoginServer", TypeOfLog.ERROR)
                }
            } catch (ioe: IOException) {
            }
        }
    }
}