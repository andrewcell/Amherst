package provider

class MapleDataFileEntry(name: String?, size: Int, checksum: Int, parent: MapleDataEntity?) : MapleDataEntry(name!!, size, checksum, parent!!) {
    override var offset = 0

}