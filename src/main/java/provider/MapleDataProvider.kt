package provider

import java.io.File
import java.io.FileInputStream
import java.io.FileNotFoundException
import java.io.IOException

class MapleDataProvider(fileIn: File) {
    val root: File = fileIn
    @JvmField
    val rootForNavigation: MapleDataDirectoryEntry = MapleDataDirectoryEntry(fileIn.name, 0, 0, null)

    private fun fillMapleDataEntitys(lroot: File, wzdir: MapleDataDirectoryEntry) {
        for (file in lroot.listFiles()) {
            val fileName = file.name
            if (file.isDirectory && !fileName.endsWith(".img")) {
                val newDir = MapleDataDirectoryEntry(fileName, 0, 0, wzdir)
                wzdir.addDirectory(newDir)
                fillMapleDataEntitys(file, newDir)
            } else if (fileName.endsWith(".xml")) { // get the real size here?
                wzdir.addFile(MapleDataFileEntry(fileName.substring(0, fileName.length - 4), 0, 0, wzdir))
            }
        }
    }

    fun getData(path: String): MapleData {
        val dataFile = File(root, "$path.xml")
        val imageDataDir = File(root, path)
        /*		if (!dataFile.exists()) {
        throw new RuntimeException("Datafile " + path + " does not exist in " + root.getAbsolutePath());
        }*/
        val fis: FileInputStream
        try {
            fis = FileInputStream(dataFile)
        } catch (e: FileNotFoundException) {
            throw RuntimeException("Datafile " + path + " does not exist in " + root.getAbsolutePath())
        }
        val domMapleData: MapleData
        domMapleData = try {
            MapleData(fis, imageDataDir.parentFile)
        } finally {
            try {
                fis.close()
            } catch (e: IOException) {
                throw RuntimeException(e)
            }
        }
        return domMapleData
    }

    init {
        fillMapleDataEntitys(root, rootForNavigation)
    }
}