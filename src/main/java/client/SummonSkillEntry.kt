package client

import java.awt.Point

class SummonSkillEntry {
    @JvmField
    var mobCount: Byte = 0
    @JvmField
    var attackCount: Byte = 0
    @JvmField
    var type: Byte = 0
    @JvmField
    var lt: Point? = null
    @JvmField
    var rb: Point? = null
    @JvmField
    var delay = 0
}