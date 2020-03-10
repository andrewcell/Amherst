package client.inventory

import client.MapleCharacter
import constants.ServerConstants
import database.DatabaseConnection
import server.MapleInventoryManipulator
import server.log.Logger
import server.log.TypeOfLog
import java.io.Serializable
import java.sql.SQLException
import java.sql.SQLIntegrityConstraintViolationException

class MapleRing(val ringId: Int, val partnerRingId: Int, val partnerCharacterId: Int, var itemId: Int, val partnerName: String): Serializable {
    val serialVersionUID: Long = 9179541993413738579L
    var equipped = false
    companion object {
        @JvmOverloads
        fun loadFromDB(ringId: Int, equipped: Boolean = false): MapleRing? {
            try {
                val connection = DatabaseConnection.getConnection()
                val ps = connection?.prepareStatement("SELECT * FROM rings WHERE ringId = ?")
                ps?.setInt(1, ringId)
                val rs = ps?.executeQuery()

                if (rs?.next()!!) {
                    var ret = MapleRing(ringId, rs.getInt("partnerRingId"), rs.getInt("partnerChrId"), rs.getInt("itemid"), rs.getString("partnerName"))
                    ret.equipped = equipped
                    connection.close()
                    ps.close()
                    rs.close()
                    return ret
                }
                return null
            } catch (e: SQLException) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
                return null
            }
        }


        @Throws(Exception::class)
        fun addToDB(itemId: Int, chr: MapleCharacter, player: String, id: Int, ringId: Array<Int>) {
            try {
                val connection = DatabaseConnection.getConnection()
                for (i in listOf(Pair(0, 1), Pair(1, 0))) {
                    val ps = connection?.prepareStatement("INSERT INTO rings (ringId, itemid, partnerChrId, partnerName, partnerRingId) VALUES (?, ?, ?, ?, ?)")
                    ps?.setInt(1, ringId[i.first])
                    ps?.setInt(2, itemId)
                    if (i.first == 0) {
                        ps?.setInt(3, chr.id)
                        ps?.setString(4, chr.name)
                    } else {
                        ps?.setInt(3, id)
                        ps?.setString(4, player)
                    }
                    ps?.setInt(5, ringId[i.second])
                    ps?.executeUpdate()
                    ps?.close()
                }
                connection?.close()
            } catch (e: Exception) {
                throw e
            }
        }

        fun changeItemByUniqueId(itemId: Int, uid: Int) {
            try {
                val connection = DatabaseConnection.getConnection()
                val ps = connection?.prepareStatement("UPDATE rings SET itemid = ? WHERE ringId = ?")
                ps?.setInt(1, itemId)
                ps?.setInt(2, uid)
                ps?.executeUpdate()
                ps?.close()
                connection?.close()
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
            }
        }

        fun createRing(itemId: Int, partner1: MapleCharacter, partner2: String, message: String, id2: Int, sn: Int): Int {
            try {
                if (id2 <= 0) {
                    return -1
                }
                return makeRing(itemId, partner1, partner2, id2, message, sn)
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
                return 0
            }
        }

        fun makeRing(itemId: Int, partner1: MapleCharacter, partner2: MapleCharacter): Array<Int> {
            val ringId = arrayOf(MapleInventoryIdentifier.getInstance(), MapleInventoryIdentifier.getInstance())
            try {
                addToDB(itemId, partner1, partner2.name, partner2.id, ringId)
            } catch (e: SQLIntegrityConstraintViolationException) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
                return ringId
            }
            return ringId
        }

        fun makeRing(itemId: Int, partner1: MapleCharacter, partner2: String, id2: Int, message: String, sn: Int): Int {
            val ringId = arrayOf(MapleInventoryIdentifier.getInstance(), MapleInventoryIdentifier.getInstance())
            try {
                addToDB(itemId, partner1, partner2, id2, ringId)
            } catch (e: SQLIntegrityConstraintViolationException) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
                return 0
            }
            MapleInventoryManipulator.addRing(partner1, itemId, ringId[1], sn)
            partner1.cashInventory.gift(id2, partner1.name, message, sn, ringId[0])
            return 1
        }

        fun removeRingFromDB(player: MapleCharacter) {
            try {
                val connection = DatabaseConnection.getConnection()
                var ps = connection?.prepareStatement("SELECT * FROM rings WHERE partnerChrId = ?")
                ps?.setInt(1, player.id)
                val rs = ps?.executeQuery()
                if (!rs?.next()!!) return
                val otherId = rs.getInt("partnerRingId")
                val otherOtherId = rs.getInt("ringId")

                rs.close()
                ps?.close()

                ps = connection?.prepareStatement("DELETE FROM rings WHERE ringId = ? OR ringId = ?")
                ps?.setInt(1, otherOtherId)
                ps?.setInt(2, otherId)
                ps?.executeUpdate()
            } catch (e: SQLException) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
            }
        }

        fun deleteRingForItemAndChrId(characterId: Int, itemId: Int) {
            try {
                val connection = DatabaseConnection.getConnection()
                var ps = connection?.prepareStatement("SELECT * FROM rings WHERE partnerChrId = ? AND itemid = ?")
                ps?.setInt(1, characterId)
                ps?.setInt(2, itemId)
                val rs = ps?.executeQuery()
                val otherId: Int = rs?.getInt("partnerRingId")!!
                val otherOtherId: Int = rs.getInt("ringId")
                rs.close()
                ps?.close()
                ps = connection?.prepareStatement("DELETE FROM rings WHERE ringId = ? OR ringId = ?")
                ps?.setInt(1, otherOtherId)
                ps?.setInt(2, otherId)
                ps?.executeUpdate()

                connection?.close()
                ps?.close()
                rs.close()
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                Logger.log("${e.message}", "MapleRing", TypeOfLog.ERROR)
            }
        }
    }

    override fun equals(other: Any?): Boolean {
        if (other is MapleRing) {
            return (other as MapleRing).ringId == ringId
        }
        return false
    }

    override fun hashCode(): Int {
        var hash = 5
        hash = 53 * hash + ringId
        return hash
    }

    class RingComparator : Comparator<MapleRing>, Serializable {
        override fun compare(p0: MapleRing?, p1: MapleRing?): Int {
            if (p0?.ringId!! < p1?.ringId!!) {
                return -1
            } else if (p0.ringId == p1.ringId) {
                return 0
            } else {
                return 1
            }
        }
    }
}