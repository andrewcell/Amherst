package client.inventory

import client.MapleBuffStat
import client.MapleCharacter
import server.Randomizer
import tools.MaplePacketCreator
import java.io.Serializable
import java.lang.ref.WeakReference
import java.sql.Connection
import java.sql.PreparedStatement

class MapleMount(@Transient var owner: MapleCharacter, val itemId: Int, val skillId: Int, var fatigue: Byte, var level: Byte, var exp: Int) : Serializable {
    val serialVersionUID: Long = 9179541993413738569L
    @Transient
    var changed = false
    var lastFatigue: Long = 0
    val _owner = WeakReference<MapleCharacter>(owner)
    
    @Throws(Exception::class)
    fun saveMount(characterId: Int, connection: Connection) {
        if (!changed) return
        var ps: PreparedStatement?
        try {
            ps = connection.prepareStatement("UPDATE mountdata set `Level` = ?, `Exp` = ?, `Fatigue` = ? WHERE characterid = ?")
            ps.setByte(1, level)
            ps.setInt(2, exp)
            ps.setByte(3, fatigue)
            ps.setInt(4, characterId)
            ps.executeUpdate()
            ps?.close()
        } catch (e: Exception) {
            throw e
        }
    }

    fun setFatigue_K(amount: Byte) {
        changed = true
        fatigue = (fatigue + amount).toByte()
        if (fatigue < 0) fatigue = 0
    }

    /*fun setItemId_K(c: Int) {
        changed = true
        itemId = c
    }*/

    /*fun setExp_K(c: Int) {
        changed = true
        exp = c
    }*/

    fun setLevel_K(c: Byte) {
        changed = true
        level = c
    }

    fun increaseFatigue() {
        fatigue++
        if (fatigue > 100 && _owner.get() != null) {
            _owner.get()!!.cancelEffectFromBuffStat(MapleBuffStat.MONSTER_RIDING)
        }
        update()
    }

    fun canTire(now: Long): Boolean = lastFatigue > 0 && lastFatigue + 30000 < now

    fun startSchedule() {
        lastFatigue = System.currentTimeMillis()
    }

    fun cancelSchedule() {
        lastFatigue = 0
    }

    fun increaseExp() {
        var e: Int
        e = if (level >= 1 && level <= 7) {
            Randomizer.nextInt(10) + 15
        } else if (level >= 8 && level <= 15) {
            Randomizer.nextInt(13) + 15 / 2
        } else if (level >= 16 && level <= 24) {
            Randomizer.nextInt(23) + 18 / 2
        } else {
            Randomizer.nextInt(28) + 25 / 2
        }
        exp += e
    }

    fun update() {
        val chr: MapleCharacter? = _owner.get()
        chr?.map?.broadcastMessage(MaplePacketCreator.updateMount(chr, false))
    }

}