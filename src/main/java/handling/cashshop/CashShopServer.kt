package handling.cashshop

import handling.channel.PlayerStorage
import server.ServerProperties.Companion.IP
import server.ServerProperties.Companion.getPort
import java.net.ServerSocket

object CashShopServer {
    @JvmStatic
    val IPAddress = IP + ":" + getPort("cashshop")
    private val PORT = getPort("cashshop")

    @JvmStatic
    var playerStorage: PlayerStorage? = null
        private set

    @JvmStatic
    var isShutdown = false
        private set

    private var thread: CashShopServerThread? = null

    @JvmStatic
    @Throws(Exception::class)
    fun run_startup_configurations() {
        playerStorage = PlayerStorage(-10)
        thread = CashShopServerThread()
        thread!!._serverSocket = ServerSocket(PORT)
        thread!!.start()
    }

    @JvmStatic
    fun shutdown() {
        if (isShutdown) {
            return
        }
        println("Saving all connected clients (CS)...")
        playerStorage!!.disconnectAll()
        println("Shutting down CS...")
        isShutdown = true
    }

}