package provider

open class MapleDataEntry(override val name: String?, val size: Int, val checksum: Int, override val parent: MapleDataEntity?) : MapleDataEntity {
    open val offset = 0

}