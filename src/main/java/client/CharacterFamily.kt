package client

import constants.ServerConstants
import database.DatabaseConnection
import handling.world.World
import handling.world.family.MapleFamilyBuff
import handling.world.family.MapleFamilyCharacter
import server.log.Logger
import server.log.TypeOfLog
import server.quest.MapleQuest
/*
class CharacterFamily {
    fun usedBuffs(): List<Int> {
        val used: MutableList<Int> = mutableListOf()
        val z = MapleFamilyBuff.values()
        for (i in z) {
            if (!canUseFamilyBuff(z[i])) {
                used.add(i)
            }
        }
        return used
    }

    fun saveFamilyStatus() {
        try {
            val conn = DatabaseConnection.getConnection()
            val ps = conn?.prepareStatement("UPDATE characters SET familyid = ?, seniorid = ?, junior1 = ?, junior2 = ? WHERE id = ?")
            if (classes.mfc == null) {
                ps?.setInt(1, 0)
                ps?.setInt(2, 0)
                ps?.setInt(3, 0)
                ps?.setInt(4, 0)
            } else {
                ps?.setInt(1, classes.mfc!!.familyId)
                ps?.setInt(2, classes.mfc!!.seniorId)
                ps?.setInt(3, classes.mfc!!.junior1)
                ps?.setInt(4, classes.mfc!!.junior2)
            }
            ps?.setInt(5, information.id)
            ps?.executeUpdate()
            conn?.close()
            ps?.close()
        } catch (e: Exception) {
            if (ServerConstants.showPacket) e.printStackTrace()
            Logger.log("${e.message}", "MapleCharacter", TypeOfLog.ERROR)
        }
    }


    fun setFamily(newFamily: Int, newSenior: Int, newJunior1: Int, newJunior2: Int) {]
        val mfc = classes.mfc
        if (mfc == null || newFamily != mfc.familyId || newSenior != mfc.seniorId || newJunior1 != mfc.junior1 || newJunior2 != mfc.junior2) {
            makeMFC(newFamily, newSenior, newJunior1, newJunior2, information.firstLoginTime)
        }
    }

    fun canUseFamilyBuff(buff: MapleFamilyBuff): Boolean {
        val stat = getQuestNoAdd(MapleQuest.getInstance(buff.questID)) ?: return true
        if (stat.getCustomData() == null) stat.setCustomData("0")
        return (stat.getCustomData() + (24 * 3600000) < System.currentTimeMillis())
    }

    fun useFamilyBuff(buff: MapleFamilyBuff) {
        val stat = getQuestNAdd(MapleQuest.getInstance(buff.questID))
        stat?.customData = System.currentTimeMillis().toString()
    }

    fun makeMFC(familyId: Int, seniorId: Int, junior1: Int, junior2: Int, loginTime: Long) {\
        if (familyId > 0) {
            val f = World.Family.getFamily(familyId)
            if (f == null) {
                classes.mfc = null
            } else {
                classes.mfc = f.getMFC(information.id)
                if (classes.mfc == null) classes.mfc = f.addFamilyMemberInfo(this, seniorId, junior1, junior2)
                if (classes.mfc?.seniorId != seniorId) classes.mfc?.seniorId = seniorId
                if (classes.mfc?.junior1 != junior1) classes.mfc?.junior1 = junior1
                if (classes.mfc?.junior2 != junior2) classes.mfc?.junior2 = junior2
            }
        } else {
            classes.mfc = null
        }
    }

    fun getNoJuniors(mfc: MapleFamilyCharacter?): Int = mfc?.noJuniors ?: 0

    fun setTotalRep(mfc: MapleFamilyCharacter?, chr: MapleCharacter, rank: Int) {
        chr.information.totalrep = rank
        mfc?.totalRep = rank
    }

    fun setCurrentRep(mfc: MapleFamilyCharacter?, chr: MapleCharacter, rank: Int) {
        chr.information.currentrep = rank
        mfc?.currentRep = rank
    }
    fun getFamilyId(mfc: MapleFamilyCharacter?) = mfc?.familyId
    fun getSeniorId(mfc: MapleFamilyCharacter?) = mfc?.seniorId
    fun getJunior1(mfc: MapleFamilyCharacter?) = mfc?.junior1
    fun getJunior2(mfc: MapleFamilyCharacter?) = mfc?.junior2
}
*/
