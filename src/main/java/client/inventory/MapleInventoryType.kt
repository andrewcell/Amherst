package client.inventory

enum class MapleInventoryType(var type: Byte) {
    UNDEFINED(0), //2
    EQUIP(1), //4
    USE(2), //8
    SETUP(3), //10
    ETC(4), //20
    CASH(5), //40
    EQUIPPED(-1);

    constructor(_type: Int) {
        type = _type.toByte()
    }


    fun getBitFieldEncoding(): Short = (2 shl type.toInt()).toShort()
    companion object {
        fun getByType(_type: Byte): MapleInventoryType? {
            for (l in values()) {
                if (l.type == _type) return l
            }
            return null
        }
    }

    fun getByWzName(name: String): MapleInventoryType {
        return when(name) {
            "Install" -> SETUP
            "Consume" -> USE
            "Etc" -> ETC
            "Eqp" -> EQUIP
            "Cash" -> CASH
            "Pet" -> CASH
            else -> UNDEFINED
        }
    }
}