package client.inventory

import database.DatabaseConnection
import database.DatabaseConnection.getConnection
import server.MapleItemInformationProvider
import server.log.Logger.log
import server.log.TypeOfLog
import server.movement.AbsoluteLifeMovement
import server.movement.LifeMovement
import server.movement.LifeMovementFragment
import java.awt.Point
import java.io.Serializable
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.SQLException

class Pet(val petItemId: Int, val uniqueId: Int, var inventoryPosition: Short = 0) : Serializable {
    enum class PetFlag(val value: Int, val item: Int, val remove: Int) {
        ITEM_PICKUP(0x01, 5190000, 5191000),
        HP_CHARGE(0x20, 5190001, 5191001),
        EXPAND_PICKUP(0x02, 5190002, 5191002), //idk
        AUTO_PICKUP(0x04, 5190003, 5191003), //idk
        LEFTOVER_PICKUP(0x10, 5190004, 5191004), //idk
        UNPICKABLE(0x08, 5190005, -1),
        MP_CHARGE(0x40, 5190006, -1),
        PET_BUFF(0x80, -1, -1), //idk
        PET_DRAW(0x100, 5190007, -1), //nfs
        PET_DIALOGUE(0x200, 5190008, -1); //nfs

        fun check(flag: Int): Boolean = ((flag and value) == value)
        companion object {
            fun getByAddId(itemId: Int): PetFlag? {
                for (flag in PetFlag.values()) {
                    if (flag.item == itemId) return flag
                }
                return null
            }

            fun getByDeleteItemId(itemId: Int): PetFlag? {
                for (flag in PetFlag.values()) {
                    if (flag.remove == itemId) return flag
                }
                return null
            }
        }
    }

    val serialVersionUID = 9179541993413738569L
    var name: String = ""
        set(value) {
            field = value
            changed = true
        }
    var fh: Int = 0
    var stance: Int = 0
    var secondsLeft = 0
        set(value) {
            field = value
            changed = true
        }
    var pos: Point = Point()
    var fullness: Byte = 100
        set(value) {
            field = value
            changed = true
        }
    var level: Byte = 1
        set(value) {
            field = value
            changed = true
        }
    var summoned: Byte = 0
    var closeness: Short = 0
        set(value) {
            field = value
            changed = true
        }
    var flags: Short = 0
        set(value) {
            field = value
            changed = true
        }
    var changed: Boolean = false
    var exceptionPickup: MutableList<Int> = ArrayList()

    fun saveToDB() {
        if (!changed) return
        try {
            val conn = DatabaseConnection.getConnection()
            var ps = conn?.prepareStatement("UPDATE pets SET name = ?, level = ?, closeness = ?, fullness = ?, seconds = ?, flags = ? WHERE petid = ?")
            ps!!.setString(1, name) // Set name
            ps.setByte(2, level) // Set Level
            ps.setShort(3, closeness) // Set Closeness
            ps.setByte(4, fullness) // Set Fullness
            ps.setInt(5, secondsLeft)
            ps.setShort(6, flags)
            ps.setInt(7, uniqueId) // Set ID
            ps.executeUpdate()

            if (PetFlag.UNPICKABLE.check(flags.toInt())) {
                ps.close()
                ps = conn?.prepareStatement("DELETE FROM `pets_expick` WHERE `petsn` = ?")!!
                ps.setInt(1, uniqueId)
                ps.executeUpdate()
                ps.close()
                if (exceptionPickup != null && !exceptionPickup.isEmpty()) {
                    ps = conn?.prepareStatement("INSERT INTO `pets_expick` (`petsn`, `itemid`) VALUES (?, ?)")!!
                    ps.setInt(1, uniqueId)
                    for (i in exceptionPickup) {
                        ps.setInt(2, i)
                        ps.addBatch()
                    }
                    ps.executeBatch()
                }
            }
            changed = false
        } catch (e: SQLException) {
            log("${e.message}", "Pet", TypeOfLog.ERROR)
        }
    }

    fun isSummoned(): Boolean = summoned > 0

    fun canConsume(itemId: Int): Boolean {
        val mii = MapleItemInformationProvider.getInstance()
        for (petId in mii.getItemEffect(itemId).petsCanConsume) {
            if (petId == petItemId) return true
        }
        return false
    }

    fun updatePosition(movement: List<LifeMovementFragment>) {
        for (move in movement) {
            if (move is LifeMovement) {
                if (move is AbsoluteLifeMovement) {
                    pos = (move as LifeMovement).position
                }
                stance = move.newstate
            }
        }
    }

    fun changeException() {
        changed = true
    }

    companion object {
        fun loadfromDB(itemId: Int, petId: Int, inventoryPosition: Short): Pet? {
            var connection: Connection
            var ps: PreparedStatement
            var rs: ResultSet
            try {
                val ret: Pet = Pet(itemId, petId, inventoryPosition)
                connection = DatabaseConnection.getConnection()!!
                ps = connection.prepareStatement("SELECT * FROM pets WHERE petid = ?")
                ps.setInt(1, petId)
                rs = ps.executeQuery()
                if (!rs.next()) return null
                ret.name = rs.getString("name")
                ret.closeness = rs.getShort("closeness")
                ret.level = rs.getByte("level")
                ret.fullness = rs.getByte("fullness")
                ret.secondsLeft = rs.getInt("seconds")
                ret.flags = rs.getShort("flags")
                ret.changed = false

                if (PetFlag.UNPICKABLE.check(ret.flags.toInt())) {
                    rs.close()
                    ps.close()
                    ps = connection.prepareStatement("SELECT * FROM `pets_expick` WHERE `petsn` = ?")
                    ps.setInt(1, petId)
                    rs = ps.executeQuery()
                    while (rs.next()) {
                        ret.exceptionPickup.add(rs.getInt("itemid"))
                    }
                }
                connection.close()
                ps.close()
                rs.close()
                return ret
            } catch (e: Exception) {
                log("${e.message}", "Pet", TypeOfLog.ERROR)
                return null
            }
        }

        fun getPetFlag(itemId: Int): Int {
            var flag = 0
            val stats = MapleItemInformationProvider.getInstance().getEquipStats(itemId)
            if (stats.containsKey("pickupAll") && stats["pickupAll"] == 1) {
                if ((flag and PetFlag.AUTO_PICKUP.value) == 0) flag = flag or PetFlag.AUTO_PICKUP.value
            }
            if (stats.containsKey("pickupItem") && stats["pickupItem"] == 1) {
                if ((flag and PetFlag.ITEM_PICKUP.value) == 0) flag = flag or PetFlag.ITEM_PICKUP.value
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


        @JvmOverloads
        fun createPet(itemId: Int, name: String = MapleItemInformationProvider.getInstance().getName(itemId), level: Int = 1, closeness: Int = 0, fullness: Int = 100, uniqueId: Int, secondsLeft: Int = (if(itemId == 5000054) 18000 else 0), flag: Short = 0): Pet {
            var uniqueId = uniqueId
            if (uniqueId <= -1) uniqueId = MapleInventoryIdentifier.getInstance()
            var flag = (flag.toInt() or getPetFlag(itemId)).toShort()
            try {
                // Commit to db first
                val con = getConnection()
                var pse = con?.prepareStatement("INSERT INTO pets (petid, name, level, closeness, fullness, seconds, flags) VALUES (?, ?, ?, ?, ?, ?, ?)")!!
                pse.setInt(1, uniqueId)
                pse.setString(2, name)
                pse.setByte(3, level.toByte())
                pse.setShort(4, closeness.toShort())
                pse.setByte(5, fullness.toByte())
                pse.setInt(6, secondsLeft)
                pse.setShort(7, flag)
                pse.executeUpdate()
                con.close()
                pse.close()
            } catch (e: Exception) {
                log("${e.message}", "Pet", TypeOfLog.ERROR)
            }
            val pet = Pet(itemId, uniqueId)
            pet.name = name
            pet.level = level.toByte()
            pet.fullness = fullness.toByte()
            pet.closeness = closeness.toShort()
            pet.flags = flag
            pet.secondsLeft = secondsLeft
            return pet
        }

    }
}