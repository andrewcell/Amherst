package client.inventory

import constants.GameConstants
import java.io.Serializable
import kotlin.math.abs


open class Item(val itemId: Int, var pos: Short, open var quantity: Short, var flag: Short? = null, var uniqueId: Int = -1) : Comparable<Item>, Serializable {
    constructor(itemId: Int, pos: Short, quantity: Short, flag: Short) : this(itemId, pos, quantity, flag, -1)
    constructor(itemId: Int, pos: Short, quantity: Short) : this(itemId, pos, quantity, null, -1)
    var expiration = -1L
    var inventoryId = 0L
    var petItem: Pet? = null
    var marriageId = 0
    var owner = ""
    var GMLog = ""
    var giftFrom = ""
    var ringItem: MapleRing? = null
    open val type: Byte = 2

    open fun copy(): Item {
        val ret = Item(itemId, pos, quantity, flag, uniqueId)
        ret.petItem = petItem
        ret.owner = owner
        ret.GMLog = GMLog
        ret.expiration = expiration
        ret.giftFrom = giftFrom
        ret.marriageId = marriageId
        return ret
    }

    fun setPosition(_position: Short) {
        pos = _position
        petItem?.inventoryPosition = pos
    }

    fun getPet() = petItem

    fun setPet(pet: Pet?) {
        petItem = pet
        if (pet != null) uniqueId = pet.uniqueId
    }

    fun getRing(): MapleRing? {
        if (!GameConstants.isEffectRing(itemId) || uniqueId <= 0) return null
        if (ringItem === null) {
            ringItem = MapleRing.loadFromDB(uniqueId, pos < 0)
        }
        return ringItem
    }

    override fun compareTo(other: Item): Int {
        val pos = pos.toInt()
        return if (abs(pos) < abs(other.pos.toInt())) {
            -1
        } else if (abs(pos) == abs(other.pos.toInt())) {
            0
        } else {
            1
        }
    }

    override fun equals(other: Any?): Boolean {
        if (other !is Item) {
            return false
        }
        val ite = other as Item
        return uniqueId == ite.uniqueId && itemId == ite.itemId && quantity == ite.quantity && abs(pos.toInt()) == Math.abs(ite.pos.toInt())
    }


}