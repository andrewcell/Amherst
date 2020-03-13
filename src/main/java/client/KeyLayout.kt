package client

import constants.ServerConstants
import server.log.Logger.log
import server.log.TypeOfLog
import tools.data.MaplePacketLittleEndianWriter
import java.io.Serializable
import java.sql.Connection

class KeyLayout(val keymap: MutableMap<Int, Pair<Byte, Int>> = HashMap()) : Serializable {
    val serialVerionUID = 9179541993413738569L
    private var changed = false

    fun layout(): Map<Int, Pair<Byte, Int>> {
        changed = true
        return keymap
    }

    fun setUnchanged() {
        changed = false
    }

    fun writeData(mplew: MaplePacketLittleEndianWriter) {
        mplew.write(if (keymap.isEmpty()) 1 else 0)
        if (keymap.isEmpty()) {
            keymap.put(Integer.valueOf(2), Pair(4.toByte(), 10))
            keymap.put(Integer.valueOf(3), Pair(4.toByte(), 12))
            keymap.put(Integer.valueOf(4), Pair(4.toByte(), 13))
            keymap.put(Integer.valueOf(5), Pair(4.toByte(), 18))
            keymap.put(Integer.valueOf(6), Pair(4.toByte(), 0x17))
            keymap.put(Integer.valueOf(16), Pair(4.toByte(), 8))
            keymap.put(Integer.valueOf(17), Pair(4.toByte(), 5))
            keymap.put(Integer.valueOf(18), Pair(4.toByte(), 0))
            keymap.put(Integer.valueOf(19), Pair(4.toByte(), 4))
            keymap.put(Integer.valueOf(23), Pair(4.toByte(), 1))
            keymap.put(Integer.valueOf(24), Pair(4.toByte(), 0x18))
            keymap.put(Integer.valueOf(25), Pair(4.toByte(), 19))
            keymap.put(Integer.valueOf(26), Pair(4.toByte(), 14))
            keymap.put(Integer.valueOf(27), Pair(4.toByte(), 15))
            keymap.put(Integer.valueOf(29), Pair(5.toByte(), 52))
            keymap.put(Integer.valueOf(31), Pair(4.toByte(), 2))
            keymap.put(Integer.valueOf(33), Pair(4.toByte(), 0x19))
            keymap.put(Integer.valueOf(34), Pair(4.toByte(), 17))
            keymap.put(Integer.valueOf(35), Pair(4.toByte(), 11))
            keymap.put(Integer.valueOf(37), Pair(4.toByte(), 3))
            keymap.put(Integer.valueOf(38), Pair(4.toByte(), 20))
            keymap.put(Integer.valueOf(40), Pair(4.toByte(), 16))
            keymap.put(Integer.valueOf(41), Pair(4.toByte(), 0x16))
            keymap.put(Integer.valueOf(42), Pair(4.toByte(), 0x15))
            keymap.put(Integer.valueOf(43), Pair(4.toByte(), 9))
            keymap.put(Integer.valueOf(44), Pair(5.toByte(), 50))
            keymap.put(Integer.valueOf(45), Pair(5.toByte(), 51))
            keymap.put(Integer.valueOf(46), Pair(4.toByte(), 6))
            keymap.put(Integer.valueOf(50), Pair(4.toByte(), 7))
            keymap.put(Integer.valueOf(56), Pair(5.toByte(), 53))
            keymap.put(Integer.valueOf(57), Pair(5.toByte(), 0x36))
            keymap.put(Integer.valueOf(59), Pair(6.toByte(), 100))
            keymap.put(Integer.valueOf(60), Pair(6.toByte(), 101))
            keymap.put(Integer.valueOf(61), Pair(6.toByte(), 102))
            keymap.put(Integer.valueOf(62), Pair(6.toByte(), 103))
            keymap.put(Integer.valueOf(63), Pair(6.toByte(), 104))
            keymap.put(Integer.valueOf(64), Pair(6.toByte(), 105))
            keymap.put(Integer.valueOf(65), Pair(6.toByte(), 106))
            return
        }
        //var binding: Pair<Byte, Int>
        for (i in 0..89) {
            val binding = keymap[i]
            if (binding != null) {
                mplew.write(binding.first)
                mplew.writeInt(binding.second)
            } else {
                mplew.write(0)
                mplew.writeInt(0)
            }
        }
    }

    fun saveKeys(characterId: Int, connection: Connection) {
        if (!changed) return
        try {
            var ps = connection.prepareStatement("DELETE FROM keymap WHERE characterid = ?")
            ps.setInt(1, characterId)
            ps.executeUpdate()
            if (keymap.isEmpty()) return
            var first = true
            var query = "INSERT INTO keymap VALUES "
            for (keyBinding in keymap) {
                query += "(DEFAULT, $characterId, ${keyBinding.key}, ${keyBinding.value.first}, ${keyBinding.value.second}),"
            }
            query.substring(0, query.length - 1)
            ps = connection.prepareStatement(query)
            ps.executeUpdate()
            ps?.close()
        } catch (e: Exception) {
            if (ServerConstants.showPacket) e.printStackTrace()
            log("${e.message}", "KeyLayout", TypeOfLog.ERROR)
        }
    }


}