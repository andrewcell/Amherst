package server

import java.io.FileReader
import java.io.IOException
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.SQLException
import kotlin.system.exitProcess

import client.MapleCharacter

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import database.DatabaseConnection.getConnection
import server.log.Logger.log
import server.log.TypeOfLog
import java.io.File
import java.io.Reader
import java.util.*
import kotlin.math.log10

class ServerProperties() {
    private val mc: MapleCharacter? = null

    companion object {
        private fun loadJson(s: String): Any? {
            val fr = File(s)
            try {
                log("Loading $s...", "ServerProperties")
                val a: ServerConfiguration = jacksonObjectMapper().readValue(src = fr)
                return a

            } catch (e: Exception) {
                log("${e.message}",
                        "ServerProperties", TypeOfLog.CRITICAL)
            }
            return null
        }
        private val props = Properties()
        private fun loadProperties(s: String) {
            val fr: FileReader
            try {
                log("Loading $s...", "ServerProperties")
                fr = FileReader(s)
                props.load(fr)
                fr.close()
            } catch (ex: IOException) {
                log("${ex.message}", "ServerProperties", TypeOfLog.CRITICAL)
                ex.printStackTrace()
            }
        }

        fun setProperty(prop: String?, newInf: String?) {
            props.setProperty(prop, newInf)
        }

        @JvmStatic
        fun getProperty(key: String): String {
            return props.getProperty(key)
        }

        @JvmStatic
        fun getProperty(key: String?, defaultValue: String?): String {
            return props.getProperty(key, defaultValue)
        }

        init {
            val toLoad = "amherst.properties"
            loadProperties(toLoad)
            loadJson("amherst.json")

            props.setProperty("events",
                        "HenesysPQ,"
                                + "HenesysPQBonus,"
                                + "OrbisPQ,"
                                + "Boats,"
                                + "Flight,"
                                + "Geenie,"
                                + "Trains,"
                                + "elevator,"
                                + "3rdjob,"
                                + "s4aWorld,"
                                + "s4nest,"
                                + "s4resurrection,"
                                + "s4resurrection2,"
                                + "ProtectTylus,"
                                + "ZakumPQ,"
                                + "ZakumBattle,"
                                + "FireDemon,"
                                + "LudiPQ,"
                                + "ElementThanatos,"
                                + "Papulatus,"
                                + "cpq,"
                                + "TamePig,"
                                + "s4common2,"
                                + "HorntailPQ,"
                                + "HorntailBattle,"
                                + "Pirate,"
                                + "Adin,"
                                + "KerningPQ,"
                                + "GuildQuest,"
                                + "ShanghaiBoss,"
                                + "NightMarketBoss,"
                                + "4jberserk,"
                                + "4jrush,"
                                + "DollHouse,"
                                + "Ellin,"
                                + "Juliet,"
                                + "Romeo,"
                                + "KyrinTest,"
                                + "KyrinTrainingGroundC,"
                                + "KyrinTrainingGroundV,"
                                + "KyrinTest,"
                                + "ProtectDelli,"
                                + "AirStrike,"
                                + "AirStrike2,"
                                + "JenumistHomu,"
                                + "YureteLab1,"
                                + "YureteLab2,"
                                + "YureteLab3,"
                                + "PinkBeanBattle,"
                                + "NautilusCow,"
                                + "SnowRose,"
                                + "DarkMagicianAgit,"
                                + "Gojarani,"
                                + "MachineRoom")
                System.setProperty("wz_path", props.getProperty("wz_path", "wz"))
                val con: Connection?
                val ps: PreparedStatement?
                val rs: ResultSet?
                try {
                    con = getConnection()
                    ps = con?.prepareStatement("SELECT * FROM auth_server_channel_ip")
                    rs = ps?.executeQuery()
                    if (rs != null) {
                        while (rs.next()) {
                            props[rs.getString("name") + rs.getInt("channelid")] = rs.getString("value")
                        }
                    }
                    rs?.close()
                    ps?.close()
                    con?.close()
                } catch (ex: SQLException) {
                    ex.printStackTrace()
                    exitProcess(0)
                }
        }

        //public static String getServerName = props
        @JvmStatic
        val IP: String = props.getProperty("serverip", "127.0.0.1")


        @JvmField
        val eventMessage: String = props.getProperty("event_message", "")

        @JvmField
        val userLimit: Int = props.getProperty("user_limit", "1500").toInt()

        @JvmField
        val flag: Byte = props.getProperty("world_flag", "0").toByte()

        @JvmField
        val maxCharacters = props.getProperty("max_characters", "0").toInt()

        @JvmField
        val adminOnly = props.getProperty("admin_only", "0")!!.toBoolean()

        @JvmField
        val wzPath = props.getProperty("wz_path", "wz")

        val mysqlHost = props.getProperty("mysql_host")
        val mysqlUser = props.getProperty("mysql_user")
        val mysqlPass = props.getProperty("mysql_pass")
        val mysqlPort = props.getProperty("mysql_port")
        val mysqlDatabase = props.getProperty("mysql_database")
        val mysqlEncoding = props.getProperty("mysql_encoding")

        val worldId = props.getProperty("world_id", 0.toString()).toInt()

        @JvmStatic
        fun getPort(type: String?): Int {
            return when (type) {
                "cashshop" -> props.getProperty("port_cashshop", "8888").toInt()
                "login" -> props.getProperty("port_login", "8484").toInt()
                "channel" -> props.getProperty("port_channel", "8300").toInt()
                else -> 9999
            }
        }

        fun printConfiguration() {
            val N = "ServerProperties"
            log("Server IP : $IP", N)
            log("WZ Path : $wzPath", N)
        }

        fun gatewayIP() : ByteArray {
            val arr: ByteArray = ByteArray(4)
            val ip = IP.split('.')
            for ((i, item) in ip.withIndex()) {
                arr.set(i, item.toByte())
            }
            return arr
        }
    }
}