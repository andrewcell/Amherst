package client.inventory

import constants.GameConstants
import constants.GameConstants.getExpForLevel
import constants.GameConstants.getMaxLevel
import constants.GameConstants.getStatFromWeapon
import java.io.Serializable

class Equip : Item, Serializable {
    constructor(id: Int, position: Short, flag: Byte) : super(id, position, 1, flag.toShort())
    constructor(id: Int, position: Short, uniqueId: Int, flag: Short) : super(id, position, 1, flag.toShort(), uniqueId)

    enum class ScrollResult {
        SUCCESS, FAIL, CURSE
    }

    val ARMOR_RATIO = 350000
    val WEAPON_RATIO = 700000
    //charm: -1 = has not been initialized yet, 0 = already been worn, >0 = has teh charm exp
    var upgradeSlots: Byte = 0
    var level: Byte = 0
    var viciousHammer: Byte = 0
    var enhance: Byte = 0
    var str: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var dex: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var int: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var luk: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var hp: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var mp: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var watk: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var matk: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var wdef: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var mdef: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var acc: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var avoid: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var hands: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var speed: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var jump: Short = 0
        set(value) {
            field = if (value < 0) 0 else value
        }
    var hpR: Short = 0
    var mpR: Short = 0
    var charmExp: Short = 0
    var pvpDamage: Short = 0
    var itemEXP: Int = 0
        set(value) {
            field = if (value < 0) 0 else value
        }

    var durability: Int = -1
    var incSkill: Int = -1
    var potential1: Int = 0
    var potential2: Int = 0
    var potential3: Int = 0
    val state: Byte = 0


    override fun copy(): Item {
        val ret = Equip(itemId, pos, uniqueId, flag!!)
        ret.str = str
        ret.dex = dex
        ret.int = int
        ret.luk = luk
        ret.hp = hp
        ret.mp = mp
        ret.matk = matk
        ret.mdef = mdef
        ret.watk = watk
        ret.wdef = wdef
        ret.acc = acc
        ret.avoid = avoid
        ret.hands = hands
        ret.speed = speed
        ret.jump = jump
        ret.enhance = enhance
        ret.upgradeSlots = upgradeSlots
        ret.level = level
        ret.itemEXP = itemEXP
        ret.durability = durability
        ret.viciousHammer = viciousHammer
        ret.potential1 = potential1
        ret.potential2 = potential2
        ret.potential3 = potential3
        ret.charmExp = charmExp
        ret.pvpDamage = pvpDamage
        ret.hpR = hpR
        ret.mpR = mpR
        ret.incSkill = incSkill
        ret.giftFrom = giftFrom
        ret.owner = owner
        ret.quantity = quantity
        ret.expiration = expiration
        ret.marriageId = marriageId
        return ret
    }

    override val type: Byte = 1

    fun getType() = 1
    fun getEquipExp(): Int {
        if (itemEXP <= 0) return 0
        return if (GameConstants.isWeapon(itemId)) itemEXP / WEAPON_RATIO else itemEXP / ARMOR_RATIO
    }

    fun getEquipExpForLevel(): Int {
        if (getEquipExpForLevel() <= 0) return 0
        var exp = getEquipExp()
        for (i in getBaseLevel()..getMaxLevel(itemId)) {
            if (exp >= getExpForLevel(i, itemId)) {
                exp -= getExpForLevel(i, itemId)
            } else { //for 0, dont continue;
                break
            }
        }
        return exp
    }

    fun getExpPercentage(): Int {
        return if (getEquipLevel() < getBaseLevel() || getEquipLevel() > getMaxLevel(itemId) || getExpForLevel(getEquipLevel(), itemId) <= 0)  0  else getEquipExpForLevel() * 100 / getExpForLevel(getEquipLevel(), itemId)
    }

    fun getEquipLevel(): Int {
        if (getMaxLevel(itemId) <= 0) return 0
        else if (getEquipExp() <= 0) return getBaseLevel()
        var level = getBaseLevel()
        var exp = getEquipExp()
        var i: Int = level
        while (if (getStatFromWeapon(itemId) == null) i <= getMaxLevel(itemId) else i < getMaxLevel(itemId)) {
                if (exp >= getExpForLevel(i, itemId)) {
                    level++
                    exp -= getExpForLevel(i, itemId)
                } else { //for 0, dont continue;
                    break
                }
                i++
        }
        return level
    }

    fun getBaseLevel() = if (GameConstants.getStatFromWeapon(itemId) == null) 1 else 0
    override var quantity: Short
        get() = super.quantity
        set(value) {
            if (quantity < 0 || quantity > 1) {
                throw RuntimeException("Setting the quantity to $quantity on an equip (itemid: $itemId)")
            }
            super.quantity = value
        }

}