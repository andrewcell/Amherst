package constants

import client.MapleClient
import server.ServerProperties
import java.lang.management.ManagementFactory
import java.net.InetAddress
import java.util.*
import javax.management.ObjectName

class ServerConstants : Runnable {
    enum class PlayerGMRank(val commandPrefix: Char, val level: Int) {
        NORMAL('@', 0), GM('!', 1)

    }
    enum class CommandType(val type: Int) {
        NORMAL(0), TRADE(1);

    }

    companion object {
        @JvmField
        var cli: MapleClient? = null
        @JvmField
        var serverType = false // true : new, false : old
        @JvmField
        var Gateway_IP = ServerProperties.gatewayIP()
        @JvmField
        var showPacket = false
        @JvmField
        var Use_Localhost = false // true = packets are logged, false = others can connect to server
        @JvmField
        var Use_SiteDB = false
        @JvmField
        var logChat = false
        @JvmField
        var logTrade = false
        @JvmField
        var logItem = false
        const val MAPLE_VERSION = 65.toShort()
        const val MAPLE_CHECK: Byte = 1
        const val MAPLE_PATCH: Byte = 1
        @JvmField
        var Use_Fixed_IV = false // true = disable sniffing, false = server can connect to itself

        const val DLL_VERSION = 105
        @JvmField
        val eligibleIP: MutableList<String> = LinkedList()
        val localhostIP: MutableList<String> = LinkedList()

        @JvmStatic
        fun isIPLocalhost(sessionIP: String): Boolean {
            return localhostIP.contains(sessionIP.replace("/", "")) && Use_Localhost
        }

        //Packeges.constants.localhostIP.remove("183.91.251.28");
        var instance: ServerConstants? = null

        @JvmStatic
        fun registerMBean() {
            val mBeanServer = ManagementFactory.getPlatformMBeanServer()
            try {
                instance = ServerConstants()
                mBeanServer.registerMBean(instance, ObjectName("constants:type=ServerConstants"))
            } catch (e: Exception) {
                println("Error registering Shutdown MBean")
                e.printStackTrace()
            }
        }

        init {
            localhostIP.add("hexSha1")
        }
    }

    override fun run() {
    }
}