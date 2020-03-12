package client

import client.LoginCrypto.Companion.checkSaltedSha512Hash
import client.LoginCrypto.Companion.checkSha1Hash
import constants.GameConstants
import constants.ServerConstants
import database.DatabaseConnection
import handling.channel.ChannelServer
import handling.world.World
import server.log.Logger.log
import server.log.TypeOfLog
import java.nio.charset.Charset
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.util.regex.Pattern

class MapleCharacterUtil {
    companion object {
        val namePattern: Pattern = Pattern.compile("[a-zA-Z0-9가-힣]{2,12}")
        val petPattern: Pattern = Pattern.compile("[a-zA-Z0-9가-힣]{2,12}")

        fun canCreateChar(name: String, gm: Boolean) = !(getIdByName(name) != -1 || !isEligibleCharacterName(name, gm))

        fun isEligibleCharacterName(name: String, gm: Boolean): Boolean {
            if (name.toByteArray(Charset.forName("UTF8")).size > 14) {
                return false
            } else if (gm) {
                return true
            } else if (name.toByteArray(Charset.forName("UTF8")).size < 4 || !namePattern.matcher(name).matches()) {
                return false
            } else {
                for (z in GameConstants.RESERVED) {
                    if (name.contains(z)) return false
                }
            }
            return true
        }

        fun canChangePetName(name: String): Boolean {
            if (name.toByteArray(Charset.forName("UTf8")).size in 3..18) return false
            if (petPattern.matcher(name).matches()) {
                for (z in GameConstants.RESERVED) {
                    if (name.contains(z)) return false
                }
                return true
            }
            return false
        }

        fun makeMapleReadable(_in: String): String {
            var wui = _in.replace('I', 'i')
            wui = wui.replace('l', 'L')
            wui = wui.replace("rn", "Rn")
            wui = wui.replace("vv", "Vv")
            wui = wui.replace("VV", "Vv")
            return wui
        }

        fun getAccountIdByName(name: String): Int {
            try {
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("SELECT accountid FROM characters WHERE name LIKE ?")
                ps?.setString(1, name)
                val rs = ps?.executeQuery()
                if (!rs!!.next()) {
                    return -1
                }
                val id = rs.getInt("accountid")
                conn.close()
                ps.close()
                rs.close()
                return id
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            return -1
        }

        fun getIdByName(name: String): Int {
            try {
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("SELECT id FROM characters WHERE name = ?")
                ps?.setString(1, name)
                val rs = ps?.executeQuery()!!
                if (!rs.next()) return -1
                conn.close()
                ps.close()
                rs.close()
                return rs.getInt("id")
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            return -1
        }

        fun changeSecondPassword(accountId: Int, password: String, newPassword: String): Int {
            try {
                val con: Connection = DatabaseConnection.getConnection()!!
                var ps: PreparedStatement
                val rs: ResultSet
                ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?")
                rs = ps.executeQuery()
                if (!rs.next()) return -1
                var secondPassword = rs.getString("2ndpassword")
                val secondPasswordSalt = rs.getString("salt2")
                if (secondPassword != null && secondPasswordSalt != null) {
                    secondPassword = LoginCrypto.rand_r(secondPassword)
                } else if (secondPassword == null && secondPasswordSalt == null) {
                    return 0
                }
                if (!checkIfPassswordEquals(secondPassword, password, secondPasswordSalt)) {
                    return 1
                }
                val sha1HashedSecondPassword: String
                try {
                    sha1HashedSecondPassword = LoginCryptoLegacy.encodeSHA1(newPassword)
                } catch (e: Exception) {
                    return -2
                }
                ps = con.prepareStatement("UPDATE accounts SET `2ndpassword` = ?, salt2 = ? WHERE id = ?")
                ps.setString(1, sha1HashedSecondPassword)
                ps.setString(2, null)
                ps.setInt(3, accountId)
                if (!ps.execute()) return 2
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            return -2
        }

        fun checkIfPassswordEquals(passHash: String, password: String, salt: String?): Boolean {
            if (LoginCryptoLegacy.isLegacyPassword(passHash) && LoginCryptoLegacy.checkPassword(password, passHash)) { // Check if a password upgrade is needed.
                return true
            } else if (salt == null && checkSha1Hash(passHash, password)) {
                return true
            } else if (checkSaltedSha512Hash(passHash, password, salt!!)) {
                return true
            }
            return false
        }

        fun getInfoByName(name: String, world: Int): Triple<Int, Int, Int>? {
            try {
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("SELECT * FROM characters WHERE name = ? AND world = ? AND gm = 0")
                ps?.setString(1, name)
                ps?.setInt(2, world)
                val rs = ps?.executeQuery()!!
                if (!rs.next()) return null
                val id = Triple(rs.getInt("Int"), rs.getInt("accountid"), rs.getInt("gender"))
                conn.close()
                ps.close()
                rs.close()
                return id
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            return null
        }

        fun setNXCodeUsed(name: String, code: String) {
            try {
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("UPDATE nxcode SET `user` = ?, `valid` = 0 WHERE code = ?")
                ps!!.setString(1, name)
                ps.setString(2, code)
                ps.execute()
                conn.close()
                ps.close()
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
        }

        fun sendNote(to: String, name: String, message: String, fame: Int) {
            try {
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("INSERT INTO notes (`to`, `from`, `message`, `timestamp`, `gift`) VALUES (?, ?, ?, ?, ?)")
                ps!!.setString(1, to)
                ps.setString(2, name)
                ps.setString(3, message)
                ps.setLong(4, System.currentTimeMillis())
                ps.setInt(5, fame)
                ps.executeUpdate()
                conn.close()
                ps.close()
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            if (World.Find.findChannel(to) >= 0) {
                ChannelServer.getInstance(World.Find.findChannel(to)).playerStorage.getCharacterByName(to)?.showNote()
            }
        }

        fun getNXCodeInfo(code: String): Triple<Boolean, Int, Int>? {
            try {
                var ret: Triple<Boolean, Int, Int>
                val conn = DatabaseConnection.getConnection()
                val ps = conn?.prepareStatement("SELECT `valid`, `type`, `item` FROM nxcode WHERE code LIKE ?")
                ps?.setString(1, code)
                val rs = ps?.executeQuery()!!
                if (rs.next()) {
                    ret = Triple(rs.getInt("valid") > 0, rs.getInt("type"), rs.getInt("item"))
                    return ret
                }
                conn.close()
                ps.close()
                rs.close()
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "MapleCharacterUtil", TypeOfLog.ERROR)
            }
            return null
        }
    }
}