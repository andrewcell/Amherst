package provider

import java.io.File

object MapleDataProviderFactory {
    private val wzPath = System.getProperty("wz_path")
    private fun getWZ(file: File): MapleDataProvider {
        return MapleDataProvider(file)
    }

    @JvmStatic
    fun getDataProvider(file: File): MapleDataProvider {
        return MapleDataProvider(file)
    }

    fun fileInWZPath(filename: String?): File {
        return File(wzPath, filename)
    }
}