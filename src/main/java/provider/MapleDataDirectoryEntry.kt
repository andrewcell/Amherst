package provider

import java.util.Collections

class MapleDataDirectoryEntry : MapleDataEntry {
    private val subdirs: MutableList<MapleDataDirectoryEntry> = ArrayList()
    private val files: MutableList<MapleDataFileEntry> = ArrayList()
    private val entries: MutableMap<String, MapleDataEntry> = HashMap()

    constructor(name: String?, size: Int, checksum: Int, parent: MapleDataEntity?) : super(name!!, size, checksum, parent!!) {}
    constructor() : super(null, 0, 0, null) {}

    fun addDirectory(dir: MapleDataDirectoryEntry) {
        subdirs.add(dir)
        entries[dir.name!!] = dir
    }

    fun addFile(fileEntry: MapleDataFileEntry) {
        files.add(fileEntry)
        entries[fileEntry.name!!] = fileEntry
    }

    val subdirectories: List<MapleDataDirectoryEntry>
        get() = Collections.unmodifiableList(subdirs)

    fun getFiles(): List<MapleDataFileEntry> {
        return Collections.unmodifiableList(files)
    }

    fun getEntry(name: String?): MapleDataEntry? {
        return entries[name]
    }
}