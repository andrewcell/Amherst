package client.inventory

import constants.GameConstants.isBullet
import constants.GameConstants.isThrowingStar
import java.io.Serializable
import java.util.*
import kotlin.collections.LinkedHashMap

class MapleInventory(val type: MapleInventoryType) : Iterable<Item>, Serializable {
    private val inventory = LinkedHashMap<Short, Item>()
    var slotLimit: Byte = 0
        set(value) {
            field = if (value > 96) 96 else value
        }

    fun addSlot(slot: Byte) {
        slotLimit = if (slotLimit > 96) 96 else ((slotLimit + slot).toByte())
    }

    fun findById(itemId: Int): Item? {
        for (item in inventory.values) {
            if (item.itemId == itemId) return item
        }
        return null
    }

    fun findByUniqueId(itemId: Int): Item? {
        for (item in inventory.values) {
            if (item.uniqueId == itemId) return item
        }
        return null
    }

    fun findByInventoryId(itemId: Long, itemI: Int, only: Boolean = false): Item? {
        for (item in inventory.values) {
            if (item.inventoryId == itemId && item.itemId == itemI) return item
        }
        return if (!only) findById(itemI) else null
    }

    fun countById(itemId: Int): Int {
        var possesed = 0
        for (item in inventory.values) {
            if (item.itemId == itemId) possesed += item.quantity
        }
        return possesed
    }

    fun listById(itemId: Int): List<Item> {
        val ret: MutableList<Item> = mutableListOf()
        for (item in inventory.values) {
            if (item.itemId == itemId) ret.add(item)
        }
        /* the linkedhashmap does impose insert order as returned order but we can not guarantee that this is still the
        correct order - blargh, we could empty the map and reinsert in the correct order after each inventory
        addition, or we could use an array/list, it's only 255 entries anyway... */
        if (ret.size > 1) ret.sort()
        return ret
    }

    fun list() = inventory.values

    fun newList(): List<Item> = if (inventory.size <= 0) Collections.emptyList<Item>() else LinkedList(inventory.values)

    fun listIds(): List<Int> {
        val ret: MutableList<Int> = mutableListOf()
        for (item in inventory.values) {
            if (!ret.contains(item.itemId)) {
                ret.add(item.itemId)
            }
        }
        if (ret.size > 1) {
            ret.sort()
        }
        return ret
    }

    fun addItem(item: Item): Short {
        val slotId = getNextFreeSlot()
        if (slotId < 0) return -1
        inventory.put(slotId, item)
        item.setPosition(slotId)
        return slotId
    }

    fun addFromDB(item: Item) {
        if (item.pos < 0 && type != MapleInventoryType.EQUIPPED) return
        if (item.pos > 0 && type == MapleInventoryType.EQUIPPED) return
        inventory.put(item.pos, item)
    }

    fun move(sSlot: Short, dSlot: Short, slotMax: Short) {
        val source = inventory[sSlot]
        val target = inventory[dSlot]
        if (source == null) throw InventoryException("Trying to move empty slot")
        if (target == null) {
            if (dSlot < 0 && type != MapleInventoryType.EQUIPPED) return
            if (dSlot > 0 && type == MapleInventoryType.EQUIPPED) return
            source.setPosition(dSlot)
            inventory[dSlot] = source
            inventory.remove(sSlot)
        } else if (target.itemId == source.itemId && !isThrowingStar(source.itemId) && !isBullet(source.itemId) && target.owner == source.owner && target.expiration == source.expiration) {
            if (type.type == MapleInventoryType.EQUIP.type || type.type == MapleInventoryType.CASH.type) {
                swap(target, source)
            } else if (source.quantity + target.quantity > slotMax) {
                source.quantity = ((source.quantity + target.quantity) - slotMax).toShort()
                target.quantity = slotMax
            } else {
                target.quantity = (source.quantity + target.quantity).toShort()
                inventory.remove(sSlot)
            }
        } else {
            swap(target, source)
        }
    }

    fun swap(source: Item, target: Item) {
        inventory.remove(source.pos)
        inventory.remove(target.pos)
        val swapPos = source.pos
        source.setPosition(target.pos)
        target.setPosition(swapPos)
        inventory[source.pos] = source
        inventory[target.pos] = target
    }

    fun getItem(slot: Short) = inventory.get(slot)

    @JvmOverloads
    fun removeItem(slot: Short, quantity: Short = 1, allowZero: Boolean = false) {
        val item = inventory.get(slot) ?: return
        item.quantity = (item.quantity - quantity).toShort()
        if (item.quantity < 0) item.quantity = 0
        if (item.quantity == 0.toShort() && !allowZero) removeSlot(slot)
    }

    fun removeSlot(slot: Short) = inventory.remove(slot)

    @JvmOverloads
    fun isFull(margin: Int = 0): Boolean = inventory.size + margin >= slotLimit

    fun getNextFreeSlot(): Short {
        if (isFull()) return -1
        for (i in 1..slotLimit) {
            if (!inventory.containsKey(i.toShort())) {
                return i.toShort()
            }
        }
        return -1
    }

    fun getNumFreeSlot(): Short {
        if (isFull()) return 0
        var free = 0x00
        for (i in 1..slotLimit) {
            if (!inventory.containsKey(i.toShort())) {
                free++
            }
        }
        return free.toShort()
    }

    override fun iterator(): Iterator<Item> = Collections.unmodifiableCollection(inventory.values).iterator()
}