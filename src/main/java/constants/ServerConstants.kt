package constants

import client.MapleClient
import java.lang.management.ManagementFactory
import java.net.InetAddress
import java.util.*
import javax.management.ObjectName

class ServerConstants : ServerConstantsMBean {
    enum class PlayerGMRank(val commandPrefix: Char, val level: Int) {
        NORMAL('@', 0), DONATOR('#', 1), SUPERDONATOR('$', 2), INTERN('%', 3), GM('!', 4), SUPERGM('!', 5), ADMIN('!', 6);

    }

    enum class CommandType(val type: Int) {
        NORMAL(0), TRADE(1), POKEMON(2);

    }

    companion object {
        @JvmField
        var cli: MapleClient? = null
        @JvmField
        var serverType = false // true : new, false : old
        @JvmField
        var Gateway_IP = byteArrayOf(10.toByte(), 0.toByte(), 0.toByte(), 1.toByte()) // 여기서 아이피를 바꾸세요
        @JvmField
        var showPacket = false
        @JvmField
        var Use_Localhost = false //Boolean.parseBoolean(ServerProperties.getProperty("net.sf.odinms.world.admin")); // true = packets are logged, false = others can connect to server
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
                instance!!.updateIP()
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
        updateIP()
    }

    override fun updateIP() {
        eligibleIP.clear()
        val eligibleIPs = arrayOf("10.0.0.1") //관리자 아이피 추가 (GM캐릭터는 이 아이피에서만 접속가능)
        for (i in eligibleIPs.indices) {
            try {
                eligibleIP.add(InetAddress.getByName(eligibleIPs[i]).hostAddress.replace("/", ""))
            } catch (e: Exception) {
            }
        }
    }
}