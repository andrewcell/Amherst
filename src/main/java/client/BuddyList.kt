package client

import database.DatabaseConnection
import server.log.Logger.log
import server.log.TypeOfLog
import tools.MaplePacketCreator
import java.io.Serializable
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

class BuddyList(var capacity: Byte) : Serializable {
    enum class BuddyOperation {
        ADDED, DELETED
    }
    
    enum class BuddyAddResult {
        BUDDYLIST_FULL, ALREADY_ON_LIST, OK
    }
    
    val serialVersionUID = 1413738569L
    val buddies: MutableMap<Int, BuddylistEntry> = LinkedHashMap()
    var changed = false
    
    fun contains(characterId: Int): Boolean = buddies.containsKey(Integer.valueOf(characterId))
    fun containsVisible(characterId: Int): Boolean {
        val ble = buddies.get(characterId) ?: return false
        return ble.isVisible
    }
    
    fun get(characterId: Int): BuddylistEntry? = buddies.get(Integer.valueOf(characterId))
    fun get(characterName: String): BuddylistEntry? {
        val lowerCaseName = characterName.toLowerCase()
        for (ble in buddies.values) {
            if (ble.name.toLowerCase() == lowerCaseName) {
                return ble
            }
        }
        return null
    }

    fun put(entry: BuddylistEntry) {
        buddies.put(Integer.valueOf(entry.characterId), entry)
        changed = true
    }

    fun remove(characterId: Int) {
        buddies.remove(Integer.valueOf(characterId))
        changed = true
    }

    fun getBuddiesValues(): Collection<BuddylistEntry> = buddies.values

    fun isFull() = buddies.size >= capacity

    fun getBuddyIds(): IntArray {
        val buddyIds = IntArray(buddies.size)
        var i = 0
        for (ble in buddies.values) {
            if (ble.isVisible) {
                buddyIds[i++] = ble.characterId
            }
        }
        return buddyIds
    }

    fun loadFromTransfer(data: Map<CharacterNameAndId, Boolean>) {
        var buddyId: CharacterNameAndId
        for (qs in data.entries) {
            buddyId = qs.key
            put(BuddylistEntry(buddyId.name, buddyId.id, buddyId.group, -1, qs.value))
        }
    }

    fun loadFromDB(characterId: Int) {
        var connection: Connection? = null
        var ps: PreparedStatement? = null
        var rs: ResultSet? = null

        try {
            connection = DatabaseConnection.getConnection()!!
            ps = connection.prepareStatement("SELECT b.buddyid, b.pending, c.name as buddyname, b.groupname FROM buddies as b, characters as c WHERE c.id = b.buddyid AND b.characterid = ?")
            ps.setInt(1, characterId)
            rs = ps.executeQuery()
            while (rs.next()) {
                put(BuddylistEntry(rs.getString("buddyname"), rs.getInt("buddyid"), rs.getString("groupname"), -1, rs.getInt("pending") != 1))
            }
        } catch (e: Exception) {
            log("${e.message}", "BuddyList", TypeOfLog.ERROR)
        } finally {
            try {
                rs?.close()
                ps?.close()
                connection?.close()
            } catch (e: Exception) {
                log("${e.message}", "BuddyList", TypeOfLog.ERROR)
            }
        }
    }

    fun addBuddyRequest(c: MapleClient, cidFrom: Int, nameFrom: String, channelFrom: Int, levelFrom: Int, jobFrom: Int) {
        put(BuddylistEntry(nameFrom, cidFrom, "그룹 미지정", channelFrom, false))
        c.session.write(MaplePacketCreator.requestBuddylistAdd(cidFrom, nameFrom, levelFrom, jobFrom))
    }




}