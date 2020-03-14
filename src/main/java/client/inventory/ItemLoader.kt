package client.inventory

import constants.GameConstants
import database.DatabaseConnection
import server.MapleItemInformationProvider
import java.sql.*

enum class ItemLoader(val table: String, val tableEquip: String, val value: Int, val arg: String) {
    INVENTORY("inventoryitems", "inventoryequipment", 0, "characterid"),
    STORAGE("inventoryitems", "inventoryequipment", 1, "accountid"),
    CASHSHOP("csitems", "csequipment", 2, "accountid"),
    HIRED_MERCHANT("hiredmerchitems", "hiredmerchequipment", 5, "packageid"),
    DUEY("dueyitems", "dueyequipment", 6, "packageid"),
    MTS("mtsitems", "mtsequipment", 8, "packageid"),
    MTS_TRANSFER("mtstransfer", "mtstransferequipment", 9, "characterid");

    @Throws(Exception::class)
    fun loadItems(login: Boolean, id: Int): Map<Long, Pair<Item, MapleInventoryType>> {
        val items = LinkedHashMap<Long, Pair<Item, MapleInventoryType>>()
        var query = "SELECT * FROM `$table` LEFT JOIN `$tableEquip` USING(`inventoryitemid`) WHERE `type` = ? AND `$arg` = ?"
        if (login) query += " AND `inventorytype` = ${MapleInventoryType.EQUIPPED.type}"

        try {
            val connection = DatabaseConnection.getConnection()
            val ps = connection?.prepareStatement(query)
            ps?.setInt(1, value)
            ps?.setInt(2, id)
            val rs = ps?.executeQuery()
            val provider = MapleItemInformationProvider.getInstance()
            while (rs!!.next()) {
                if (!provider.itemExists(rs.getInt("itemid"))) continue
                val mit = MapleInventoryType.getByType(rs.getByte("inventorytype"))!!
                if (mit.equals(MapleInventoryType.EQUIP) || mit.equals(MapleInventoryType.EQUIPPED)) {
                    val equip = Equip(rs.getInt("itemid"), rs.getShort("position"), rs.getInt("uniqueid"), rs.getShort("flag"))
                    if (!login) {
                        equip.quantity = 1.toShort()
                        equip.inventoryId = rs.getLong("inventoryitemid")
                        equip.owner = rs.getString("owner")
                        equip.expiration = rs.getLong("expiredate")
                        equip.upgradeSlots = rs.getByte("upgradeslots")
                        equip.level = rs.getByte("level")
                        equip.str = rs.getShort("str")
                        equip.dex = rs.getShort("dex")
                        equip.int = rs.getShort("int")
                        equip.luk = rs.getShort("luk")
                        equip.hp = rs.getShort("hp")
                        equip.mp = rs.getShort("mp")
                        equip.watk = rs.getShort("watk")
                        equip.matk = rs.getShort("matk")
                        equip.wdef = rs.getShort("wdef")
                        equip.mdef = rs.getShort("mdef")
                        equip.acc = rs.getShort("acc")
                        equip.avoid = rs.getShort("avoid")
                        equip.hands = rs.getShort("hands")
                        equip.speed = rs.getShort("speed")
                        equip.jump = rs.getShort("jump")
                        equip.viciousHammer = rs.getByte("ViciousHammer")
                        equip.itemEXP = rs.getInt("itemEXP")
                        equip.GMLog = rs.getString("GM_Log")
                        equip.durability = rs.getInt("durability")
                        equip.enhance = rs.getByte("enhance")
                        equip.potential1 = rs.getInt("potential1")
                        equip.potential2 = rs.getInt("potential2")
                        equip.potential3 = rs.getInt("potential3")
                        equip.hpR = rs.getShort("hpR")
                        equip.mpR = rs.getShort("mpR")
                        equip.giftFrom = rs.getString("sender")
                        equip.incSkill = rs.getInt("incSkill")
                        equip.pvpDamage = rs.getShort("pvpDamage")
                        equip.charmExp = rs.getShort("charmEXP")
                        if (equip.charmExp < 0) equip.charmExp = (provider.getEquipById(equip.itemId) as Equip).charmExp
                        if (equip.uniqueId > -1) {
                            if (GameConstants.isEffectRing(rs.getInt("itemid"))) {
                                val ring = MapleRing.loadFromDB(equip.uniqueId, mit.equals(MapleInventoryType.EQUIPPED))
                                if (ring != null) equip.ringItem = ring
                            }
                        }
                    }
                    items.put(rs.getLong("inventoryitemid"), Pair(equip.copy(), mit))
                } else {
                    val item = Item(rs.getInt("itemid"), rs.getShort("position"), rs.getShort("quantity"), rs.getShort("flag"), rs.getInt("uniqueid"))
                    val owner = rs.getString("owner") ?: ""
                    item.owner = owner
                    item.inventoryId = rs.getLong("inventoryitemid")
                    item.expiration = rs.getLong("expiredate")
                    item.GMLog = rs.getString("GM_Log")
                    item.giftFrom = rs.getString("sender")
                    item.marriageId = rs.getInt("marriageId")
                    if (GameConstants.isPet(item.itemId)) {
                        if (item.uniqueId > -1) {
                            val pet = Pet.loadfromDB(item.itemId, item.uniqueId, item.pos)
                            if (pet != null) item.setPet(pet)
                        } else item.setPet(Pet.createPet(itemId = item.itemId, uniqueId = MapleInventoryIdentifier.getInstance()))
                    }
                    if (GameConstants.isEffectRing(rs.getInt("itemid"))) {
                        if (item.uniqueId > -1) {
                            val ring = MapleRing.loadFromDB(item.uniqueId, mit.equals(MapleInventoryType.EQUIPPED))
                            if (ring != null) item.ringItem = ring
                        }
                    }
                    items.put(rs.getLong("inventoryitemid"), Pair(item.copy(), mit))
                }
            }
            connection.close()
            ps.close()
            rs.close()
            return items
        } catch (e: Exception) {
            throw e
        }
    }

    @Throws(SQLException::class)
    @JvmOverloads
    fun saveItems(items: List<Pair<Item, MapleInventoryType>>, connection: Connection? = null, id: Int) {
        var query = "DELETE FROM `$table` WHERE `type` = ? AND `$arg` = ?"
        try {
            val conn: Connection? = if (connection == null) connection else DatabaseConnection.getConnection()
            var ps = conn?.prepareStatement(query)
            var pse: PreparedStatement
            var rs: ResultSet
            ps?.setInt(1, value)
            ps?.setInt(2, id)
            ps?.executeUpdate()
            ps?.close()
            val query2 = "INSERT INTO `$table` ($arg, itemid, inventorytype, position, quantity, owner, GM_Log, uniqueid, expiredate, flag, `type`, sender, marriageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            ps = conn?.prepareStatement(query2, Statement.RETURN_GENERATED_KEYS)
            pse = conn?.prepareStatement("INSERT INTO $tableEquip VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")!!
            val iterator = items.iterator()
            var pair: Pair<Item, MapleInventoryType>
            while (iterator.hasNext()) {
                pair = iterator.next()
                val item = pair.first
                val mit = pair.second
                ps!!.setInt(1, id)
                ps.setInt(2, item.itemId)
                ps.setInt(3, mit.type.toInt())
                ps.setInt(4, item.pos.toInt())
                ps.setInt(5, item.quantity.toInt())
                ps.setString(6, item.owner)
                ps.setString(7, item.GMLog)
                if (item.getPet() != null) ps.setInt(8, Math.max(item.uniqueId, item.getPet()!!.uniqueId)) else ps.setInt(8, item.uniqueId)
                ps.setLong(9, item.expiration)
                ps.setShort(10, item.flag!!)
                ps.setByte(11, value.toByte())
                ps.setString(12, item.giftFrom)
                ps.setInt(13, item.marriageId)
                ps.executeUpdate()
                rs = ps.generatedKeys
                if (!rs.next()) {
                    rs.close()
                    continue
                }
                val iid = rs.getLong(1)
                rs.close()

                item.inventoryId = iid
                if (mit.equals(MapleInventoryType.EQUIP) || mit.equals(MapleInventoryType.EQUIPPED)) {
                    val equip = item as Equip
                    pse!!.setLong(1, iid)
                    pse.setInt(2, equip.upgradeSlots.toInt())
                    pse.setInt(3, equip.level.toInt())
                    pse.setInt(4, equip.str.toInt())
                    pse.setInt(5, equip.dex.toInt())
                    pse.setInt(6, equip.int.toInt())
                    pse.setInt(7, equip.luk.toInt())
                    pse.setInt(8, equip.hp.toInt())
                    pse.setInt(9, equip.mp.toInt())
                    pse.setInt(10, equip.watk.toInt())
                    pse.setInt(11, equip.matk.toInt())
                    pse.setInt(12, equip.wdef.toInt())
                    pse.setInt(13, equip.mdef.toInt())
                    pse.setInt(14, equip.acc.toInt())
                    pse.setInt(15, equip.avoid.toInt())
                    pse.setInt(16, equip.hands.toInt())
                    pse.setInt(17, equip.speed.toInt())
                    pse.setInt(18, equip.jump.toInt())
                    pse.setInt(19, equip.viciousHammer.toInt())
                    pse.setInt(20, equip.itemEXP)
                    pse.setInt(21, equip.durability)
                    pse.setByte(22, equip.enhance)
                    pse.setInt(23, equip.potential1)
                    pse.setInt(24, equip.potential2)
                    pse.setInt(25, equip.potential3)
                    pse.setInt(26, equip.hpR.toInt())
                    pse.setInt(27, equip.mpR.toInt())
                    pse.setInt(28, equip.incSkill)
                    pse.setShort(29, equip.charmExp)
                    pse.setShort(30, equip.pvpDamage)
                    pse.executeUpdate()
                }
            }
            conn?.close()
            connection?.close()
            ps?.close()
            pse?.close()
        } catch (e: Exception) {
            throw e
        }
    }
}