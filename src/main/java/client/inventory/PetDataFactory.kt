package client.inventory

import provider.MapleData
import provider.MapleDataProvider
import provider.MapleDataProviderFactory
import provider.MapleDataTool
import server.Randomizer
import java.io.File

class PetDataFactory {
    companion object {
        private val dataRoot: MapleDataProvider = MapleDataProviderFactory.getDataProvider(File("${System.getProperty("wz_path")}/Item.wz"))
        private val petCommands: MutableMap<Int, List<PetCommand>> = HashMap()
        private val petHunger: MutableMap<Int, Int> = HashMap()

        fun getRandomPetCommand(petId: Int): PetCommand? {
            if (getPetCommand(petId, 0) == null) return null
            val gg = petCommands.get(Integer.valueOf(petId))
            return gg!![Randomizer.nextInt(gg.size)]
        }

        fun getPetCommand(petId: Int, skillId: Int): PetCommand? {
            var gg = petCommands.get(Integer.valueOf(petId))
            if (gg != null) {
                if (gg.size >= skillId && gg.isNotEmpty()) {
                    return gg.get(skillId)
                }
                return null
            }
            val skillData: MapleData = dataRoot.getData("Pet/$petId/.img")
            var theSkill = 0
            gg = ArrayList()
            while (true) {
                val dd = skillData.getChildByPath("interact/$theSkill") ?: break
                val retr = PetCommand(petId, theSkill, MapleDataTool.getInt("prob", dd, 0), MapleDataTool.getInt("inc", dd, 0))
                gg.add(retr)
                theSkill++
            }
            petCommands.put(Integer.valueOf(petId), gg)
            return if (gg.size >= skillId && gg.isNotEmpty()) gg.get(skillId) else null
        }

        fun getHunger(petId: Int): Int {
            var ret: Int? = petHunger.get(Integer.valueOf(petId))
            if (ret != null) return ret
            val hungerData = dataRoot.getData("Pet/$petId/.img").getChildByPath("info/hungry")
            ret = Integer.valueOf(MapleDataTool.getInt(hungerData, 1))
            petHunger[petId] = ret
            return ret
        }
    }
}