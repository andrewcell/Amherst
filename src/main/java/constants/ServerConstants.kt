package constants

import client.MapleClient
import server.ServerProperties
import java.util.*

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
        val worldId = ServerProperties.worldId
        private val worldNameAvailable = arrayOf("스카니아", "베라", "브로아", "카이니", "제니스", "크로아", "아케니아", "마르디아", "플라나", "스티어스", "벨로칸", "데메토스", "옐론드", "카스티아", "엘니도", "윈디아", "쥬디스", "카디아", "갈리시아", "칼루나", "메데르", "컬버린", "하셀로", "플레타", "메리엘")
        @JvmField
        val worldName = worldNameAvailable[worldId]

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

        ;
        var instance: ServerConstants? = null

        @JvmStatic
        fun registerMBean() {

            try {
                instance = ServerConstants()

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