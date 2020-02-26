/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package client.inventory

import client.inventory.MaplePet
import client.inventory.MaplePet.PetFlag
import database.DatabaseConnection
import server.MapleItemInformationProvider
import server.movement.AbsoluteLifeMovement
import server.movement.LifeMovement
import server.movement.LifeMovementFragment
import java.awt.Point
import java.io.Serializable
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.SQLException
import java.util.*
import java.util.logging.Level
import java.util.logging.Logger
import kotlin.experimental.or

class MaplePet : Serializable {
    enum class PetFlag(//nfs
            val value: Int, private val item: Int, private val remove: Int) {
        ITEM_PICKUP(0x01, 5190000, 5191000), HP_CHARGE(0x20, 5190001, 5191001), EXPAND_PICKUP(0x02, 5190002, 5191002),  //idk
        AUTO_PICKUP(0x04, 5190003, 5191003),  //idk
        LEFTOVER_PICKUP(0x10, 5190004, 5191004),  //idk
        UNPICKABLE(0x08, 5190005, -1), MP_CHARGE(0x40, 5190006, -1), PET_BUFF(0x80, -1, -1),  //idk
        PET_DRAW(0x100, 5190007, -1),  //nfs
        PET_DIALOGUE(0x200, 5190008, -1);

        fun check(flag: Int): Boolean {
            return flag and value == value
        }

        companion object {
            @JvmStatic
            fun getByAddId(itemId: Int): PetFlag? {
                for (flag in values()) {
                    if (flag.item == itemId) {
                        return flag
                    }
                }
                return null
            }

            @JvmStatic
            fun getByDelId(itemId: Int): PetFlag? {
                for (flag in values()) {
                    if (flag.remove == itemId) {
                        return flag
                    }
                }
                return null
            }
        }

    }

    private var name: String? = null
    @JvmField
    var fh = 0
    @JvmField
    var stance = 0

    var uniqueId: Int
        private set
    var petItemId: Int
        private set
    private var secondsLeft = 0
    @JvmField
    var pos: Point? = null
    var fullness: Byte = 100
        private set
    var level: Byte = 1
        private set
    var summonedValue: Byte = 0
        private set
    @JvmField
    var inventoryPosition: Short = 0
    var closeness: Short = 0
        private set
    var flags: Short = 0
        private set
    private var changed = false
    private var exceptionPickup: MutableList<Int>? = null

    private constructor(petitemid: Int, uniqueid: Int) {
        petItemId = petitemid
        uniqueId = uniqueid
    }

    private constructor(petitemid: Int, uniqueid: Int, inventorypos: Short) {
        petItemId = petitemid
        uniqueId = uniqueid
        inventoryPosition = inventorypos
    }

    fun saveToDb() {
        if (!changed) {
            return
        }
        var con: Connection? = null
        var ps: PreparedStatement? = null
        try {
            con = DatabaseConnection.getConnection()
            ps = con!!.prepareStatement("UPDATE pets SET name = ?, level = ?, closeness = ?, fullness = ?, seconds = ?, flags = ? WHERE petid = ?")
            ps.setString(1, name) // Set name
            ps.setByte(2, level) // Set Level
            ps.setShort(3, closeness) // Set Closeness
            ps.setByte(4, fullness) // Set Fullness
            ps.setInt(5, secondsLeft)
            ps.setShort(6, flags)
            ps.setInt(7, uniqueId) // Set ID
            ps.executeUpdate() // Execute statement
            if (PetFlag.UNPICKABLE.check(flags.toInt())) {
                ps.close()
                ps = con.prepareStatement("DELETE FROM `pets_expick` WHERE `petsn` = ?")
                ps.setInt(1, uniqueId)
                ps.executeUpdate()
                ps.close()
                if (exceptionPickup != null && !pickupExceptionList.isEmpty()) {
                    ps = con.prepareStatement("INSERT INTO `pets_expick` (`petsn`, `itemid`) VALUES (?, ?)")
                    ps.setInt(1, uniqueId)
                    for (i in pickupExceptionList) {
                        ps.setInt(2, i)
                        ps.addBatch()
                    }
                    ps.executeBatch()
                }
            }
            changed = false
        } catch (ex: SQLException) {
            ex.printStackTrace()
        } finally {
            if (con != null) {
                try {
                    con.close()
                } catch (e: Exception) {
                }
            }
            if (ps != null) {
                try {
                    ps.close()
                } catch (e: Exception) {
                }
            }
        }
    }

    fun getName(): String? {
        return name
    }

    fun setName(name: String?) {
        this.name = name
        changed = true
    }

    fun getSummoned(): Boolean {
        return summonedValue > 0
    }

    fun setSummoned(summoned: Int) {
        summonedValue = summoned.toByte()
    }

    fun setCloseness(closeness: Int) {
        this.closeness = closeness.toShort()
        changed = true
    }

    fun setLevel(level: Int) {
        this.level = level.toByte()
        changed = true
    }

    fun setFullness(fullness: Int) {
        this.fullness = fullness.toByte()
        changed = true
    }

    fun setFlags(fffh: Int) {
        flags = fffh.toShort()
        changed = true
    }

    fun setInventoryPosition(inventorypos: Short) {
        this.inventoryPosition = inventorypos
    }
    fun canConsume(itemId: Int): Boolean {
        val mii = MapleItemInformationProvider.getInstance()
        for (petId in mii.getItemEffect(itemId).petsCanConsume) {
            if (petId == petItemId) {
                return true
            }
        }
        return false
    }

    fun updatePosition(movement: List<LifeMovementFragment?>) {
        for (move in movement) {
            if (move is LifeMovement) {
                if (move is AbsoluteLifeMovement) {
                    pos = (move as LifeMovement).position
                }
                stance = move.newstate
            }
        }
    }

    fun getSecondsLeft(): Int {
        return secondsLeft
    }

    fun setSecondsLeft(sl: Int) {
        secondsLeft = sl
        changed = true
    }

    val pickupExceptionList: MutableList<Int>
        get() {
            if (exceptionPickup == null) {
                exceptionPickup = ArrayList()
            }
            return exceptionPickup!!
        }

    fun changeException() {
        changed = true
    }

    companion object {
        private const val serialVersionUID = 9179541993413738569L
        @JvmStatic
        fun loadFromDb(itemid: Int, petid: Int, inventorypos: Short): MaplePet? {
            var con: Connection? = null
            var ps: PreparedStatement? = null
            var rs: ResultSet? = null
            return try {
                val ret = MaplePet(itemid, petid, inventorypos)
                con = DatabaseConnection.getConnection() // Get a connection to the database
                ps = con!!.prepareStatement("SELECT * FROM pets WHERE petid = ?") // Get pet details..
                ps.setInt(1, petid)
                rs = ps.executeQuery()
                if (!rs.next()) {
                    return null
                }
                ret.setName(rs.getString("name"))
                ret.setCloseness(rs.getShort("closeness").toInt())
                ret.setLevel(rs.getByte("level").toInt())
                ret.setFullness(rs.getByte("fullness").toInt())
                ret.setSecondsLeft(rs.getInt("seconds"))
                ret.setFlags(rs.getShort("flags").toInt())
                ret.changed = false
                if (PetFlag.UNPICKABLE.check(ret.flags.toInt())) {
                    rs.close()
                    ps.close()
                    ps = con.prepareStatement("SELECT * FROM `pets_expick` WHERE `petsn` = ?")
                    ps.setInt(1, petid)
                    rs = ps.executeQuery()
                    while (rs.next()) {
                        ret.pickupExceptionList.add(rs.getInt("itemid"))
                    }
                }
                ret
            } catch (ex: SQLException) {
                Logger.getLogger(MaplePet::class.java.name).log(Level.SEVERE, null, ex)
                null
            } finally {
                if (con != null) {
                    try {
                        con.close()
                    } catch (e: Exception) {
                    }
                }
                if (ps != null) {
                    try {
                        ps.close()
                    } catch (e: Exception) {
                    }
                }
                if (rs != null) {
                    try {
                        rs.close()
                    } catch (e: Exception) {
                    }
                }
            }
        }

        @JvmStatic
        fun createPet(itemid: Int, uniqueid: Int): MaplePet? {
            return createPet(itemid, MapleItemInformationProvider.getInstance().getName(itemid), 1, 0, 100, uniqueid, if (itemid == 5000054) 18000 else 0, 0)
        }

        @JvmStatic
        fun getPetFlag(itemid: Int): Int {
            var flag = 0
            val stats = MapleItemInformationProvider.getInstance().getEquipStats(itemid)
            if (stats.containsKey("pickupAll") && stats["pickupAll"] == 1) {
                if (flag and PetFlag.AUTO_PICKUP.value == 0) {
                    flag = flag or PetFlag.AUTO_PICKUP.value
                }
            }
            if (stats.containsKey("pickupItem") && stats["pickupItem"] == 1) {
                if (flag and PetFlag.ITEM_PICKUP.value == 0) {
                    flag = flag or PetFlag.ITEM_PICKUP.value
                }
            }
            if (stats.containsKey("sweepForDrop") && stats["sweepForDrop"] == 1) {
                if (flag and PetFlag.LEFTOVER_PICKUP.value == 0) {
                    flag = flag or PetFlag.LEFTOVER_PICKUP.value
                }
            }
            if (stats.containsKey("longRange") && stats["longRange"] == 1) {
                if (flag and PetFlag.EXPAND_PICKUP.value == 0) {
                    flag = flag or PetFlag.EXPAND_PICKUP.value
                }
            }
            if (stats.containsKey("consumeHP") && stats["consumeHP"] == 1) {
                if (flag and PetFlag.HP_CHARGE.value == 0) {
                    flag = flag or PetFlag.HP_CHARGE.value
                }
            }
            if (stats.containsKey("consumeMP") && stats["consumeMP"] == 1) {
                if (flag and PetFlag.MP_CHARGE.value == 0) {
                    flag = flag or PetFlag.MP_CHARGE.value
                }
            }
            return flag
        }

        @JvmStatic
        fun createPet(itemid: Int, name: String?, level: Int, closeness: Int, fullness: Int, uniqueid: Int, secondsLeft: Int, flag: Int): MaplePet? {
            var uniqueid = uniqueid
            var flag = flag
            if (uniqueid <= -1) { //wah
                uniqueid = MapleInventoryIdentifier.getInstance()
            }

            flag = getPetFlag(itemid) or flag
            var con: Connection? = null
            var pse: PreparedStatement? = null
            try { // Commit to db first
                con = DatabaseConnection.getConnection()
                pse = con!!.prepareStatement("INSERT INTO pets (petid, name, level, closeness, fullness, seconds, flags) VALUES (?, ?, ?, ?, ?, ?, ?)")
                pse.setInt(1, uniqueid)
                pse.setString(2, name)
                pse.setByte(3, level.toByte())
                pse.setShort(4, closeness.toShort())
                pse.setByte(5, fullness.toByte())
                pse.setInt(6, secondsLeft)
                pse.setShort(7, flag.toShort())
                pse.executeUpdate()
            } catch (ex: SQLException) {
                ex.printStackTrace()
                return null
            } finally {
                if (con != null) {
                    try {
                        con.close()
                    } catch (e: Exception) {
                    }
                }
                if (pse != null) {
                    try {
                        pse.close()
                    } catch (e: Exception) {
                    }
                }
            }
            val pet = MaplePet(itemid, uniqueid)
            pet.setName(name)
            pet.setLevel(level)
            pet.setFullness(fullness)
            pet.setCloseness(closeness)
            pet.setFlags(flag.toInt())
            pet.setSecondsLeft(secondsLeft)
            return pet
        }
    }
}