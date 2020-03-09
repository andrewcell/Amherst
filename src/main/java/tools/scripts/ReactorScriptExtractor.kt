package tools.scripts

import java.io.File
import java.io.FileOutputStream
import java.nio.charset.Charset
import java.util.*

import provider.MapleDataProviderFactory.getDataProvider
import provider.MapleDataTool

object ReactorScriptExtractor {
    @JvmStatic
    fun main(args: Array<String>) {
        try {
            val MakeDefaultReactors = true
            val start = System.currentTimeMillis()
            reactorLocation
            cacheReactorData()
            val f1 = File("ReactorList.txt")
            val fos1 = FileOutputStream(f1, false)
            for (rdi in reactors) {
                if (rdi.action != null && rdi.maps != null) {
                    var str = ""
                    str += rdi.id
                    str += " : action = " + rdi.action + " (info : " + rdi.info!!.replace("&lt;", "<") + ")"
                    str += " - ("
                    for (i in rdi.maps!!) {
                        str += "$i, "
                    }
                    str = str.substring(0, str.length - 2)
                    str += ") \r\n"
                    if (MakeDefaultReactors) {
                        val np1 = File("scripts/reactor/" + rdi.id + ".js")
                        val np2 = FileOutputStream(np1, false)
                        val npStr1 = getString(rdi.action, rdi.info, rdi.maps)
                        np2.write(npStr1.toByteArray(charset("UTF-8")))
                        np2.close()
                    }
                    fos1.write(str.toByteArray(Charset.forName("UTF-8")))
                }
            }
            fos1.close()
            println("Job Done.. Time : " + (System.currentTimeMillis() - start) + "ms")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private val reactors: MutableList<ReactorDataInfo> = ArrayList()
    @Throws(NumberFormatException::class)
    private fun cacheReactorData() {
        println("Caching Reactors...")
        val root = File("wz/Reactor.wz")
        val pro = getDataProvider(root)
        for (mdfe in pro.rootForNavigation.getFiles()) {
            val d = pro.getData(mdfe.name!!)
            val rdi = ReactorDataInfo()
            rdi.action = null
            rdi.info = "정보없음"
            if (d.getChildByPath("info") != null) {
                val d1 = d.getChildByPath("info")
                if (d1.getChildByPath("info") != null) {
                    rdi.info = MapleDataTool.getString("info", d1)
                }
            }
            if (d.getChildByPath("action") != null) {
                rdi.action = MapleDataTool.getString("action", d)
            }
            rdi.id = mdfe.name.substring(0, 7).toInt()
            rdi.maps = reactorlocations[rdi.id]
            reactors.add(rdi)
        }
    }

    private val reactorlocations: MutableMap<Int, MutableList<Int>?> = HashMap()
    val reactorLocation: Unit
        get() {
            println("Caching Reactor Locations...")
            for (i in 0..9) {
                val ff = File("wz/Map.wz/Map/Map$i")
                if (ff.isDirectory) {
                    val pro = getDataProvider(File("wz/Map.wz/Map/Map$i"))
                    for (mdfe in pro.rootForNavigation.getFiles()) {
                        val d1 = mdfe.name?.let { pro.getData(it) }
                        val lifed = d1?.getChildByPath("reactor")
                        if (lifed != null) {
                            for (d2 in lifed) {
                                val scriptd = d2.getChildByPath("id")
                                if (scriptd != null) {
                                    val rname = MapleDataTool.getIntConvert(scriptd)
                                    if (!reactorlocations.containsKey(rname)) {
                                        reactorlocations[rname] = LinkedList()
                                    }
                                    val mapid = mdfe.name.substring(0, 9).toInt()
                                    if (!reactorlocations[rname]!!.contains(mapid)) {
                                        reactorlocations[rname]!!.add(mapid)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    fun getString(name: String?, info: String?, maps: List<Int>?): String {
        var npStr1 = ("/*\r\n"
                + " * ActionName : " + name + "\r\n"
                + " * ReactorInfo : " + info + "\r\n")
        for (iz in maps!!) {
            npStr1 += " * Location : "
            npStr1 += iz.toString() + " (" + NPCScriptExtractor.getMapName(iz) + ")\r\n"
        }
        npStr1 += (" * \r\n"
                + " */\r\n"
                + "\r\n"
                + "function act() {\r\n"
                + "    rm.dropItems();\r\n"
                + "}\r\n")
        return npStr1
    }

    class ReactorDataInfo {
        var info: String? = null
        var action: String? = null
        var id = 0
        var maps: List<Int>? = null
    }
}