/*
 This file is part of the ZeroFusion MapleStory Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 ZeroFusion organized by "RMZero213" <RMZero213@hotmail.com>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tools.wztosql

import database.DatabaseConnection
import database.DatabaseConnection.getConnection
import provider.MapleDataProvider
import provider.MapleDataProviderFactory
import provider.MapleDataTool
import server.quest.MapleQuestActionType
import server.quest.MapleQuestRequirementType
import tools.Pair
import java.io.File
import java.sql.PreparedStatement
import java.util.*

class DumpQuests(update: Boolean) {
    private val quest: MapleDataProvider?
    var isHadError = false
        protected set
    protected var update = false
    protected var id = 0
    private val con = getConnection()

    @Throws(Exception::class)
    fun dumpQuests() {
        if (!isHadError) {
            val psai = con!!.prepareStatement("INSERT INTO wz_questactitemdata(uniqueid, itemid, count, period, gender, job, jobEx, prop) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            val psas = con.prepareStatement("INSERT INTO wz_questactskilldata(uniqueid, skillid, skillLevel, masterLevel) VALUES (?, ?, ?, ?)")
            val psaq = con.prepareStatement("INSERT INTO wz_questactquestdata(uniqueid, quest, state) VALUES (?, ?, ?)")
            val ps = con.prepareStatement("INSERT INTO wz_questdata(questid, name, autoStart, autoPreComplete, viewMedalItem, selectedSkillID, blocked, autoAccept, autoComplete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
            val psr = con.prepareStatement("INSERT INTO wz_questreqdata(questid, type, name, stringStore, intStoresFirst, intStoresSecond) VALUES (?, ?, ?, ?, ?, ?)")
            val psq = con.prepareStatement("INSERT INTO wz_questpartydata(questid, rank, mode, property, value) VALUES(?,?,?,?,?)")
            val psa = con.prepareStatement("INSERT INTO wz_questactdata(questid, type, name, intStore, applicableJobs, uniqueid, stringStore) VALUES (?, ?, ?, ?, ?, ?, ?)")
            try {
                dumpQuests(psai, psas, psaq, ps, psr, psq, psa)
            } catch (e: Exception) {
                println("$id quest.")
                e.printStackTrace()
                isHadError = true
            } finally {
                psai.executeBatch()
                psai.close()
                psas.executeBatch()
                psas.close()
                psaq.executeBatch()
                psaq.close()
                psa.executeBatch()
                psa.close()
                psr.executeBatch()
                psr.close()
                psq.executeBatch()
                psq.close()
                ps.executeBatch()
                ps.close()
            }
        }
    }

    @Throws(Exception::class)
    fun delete(sql: String?) {
        val ps = con!!.prepareStatement(sql)
        ps.executeUpdate()
        ps.close()
    }

    @Throws(Exception::class)
    fun doesExist(sql: String?): Boolean {
        val ps = con!!.prepareStatement(sql)
        val rs = ps.executeQuery()
        val ret = rs.next()
        rs.close()
        ps.close()
        return ret
    }

    //kinda inefficient
    @Throws(Exception::class)
    fun dumpQuests(psai: PreparedStatement, psas: PreparedStatement, psaq: PreparedStatement, ps: PreparedStatement, psr: PreparedStatement, psq: PreparedStatement, psa: PreparedStatement) {
        if (!update) {
            delete("DELETE FROM wz_questdata")
            delete("DELETE FROM wz_questactdata")
            delete("DELETE FROM wz_questactitemdata")
            delete("DELETE FROM wz_questactskilldata")
            delete("DELETE FROM wz_questactquestdata")
            delete("DELETE FROM wz_questreqdata")
            delete("DELETE FROM wz_questpartydata")
            println("Deleted wz_questdata successfully.")
        }
        val checkz = quest!!.getData("Check.img")
        val actz = quest.getData("Act.img")
        val infoz = quest.getData("QuestInfo.img")
        val pinfoz = quest.getData("PQuest.img")
        println("Adding into wz_questdata.....")
        var uniqueid = 0
        for (qz in checkz.children) { //requirements first
            id = qz.name.toInt()
            if (update && doesExist("SELECT * FROM wz_questdata WHERE questid = $id")) {
                continue
            }
            ps.setInt(1, id)
            for (i in 0..1) {
                val reqData = qz.getChildByPath(i.toString())
                if (reqData != null) {
                    psr.setInt(1, id)
                    psr.setInt(2, i) //0 = start
                    for (req in reqData.children) {
                        if (MapleQuestRequirementType.getByWZName(req.name) == MapleQuestRequirementType.UNDEFINED) {
                            continue  //un-needed
                        }
                        psr.setString(3, req.name)
                        if (req.name == "fieldEnter") { //diff
                            psr.setString(4, MapleDataTool.getIntConvert("0", req, 0).toString())
                        } else if (req.name == "end" || req.name == "startscript" || req.name == "endscript") {
                            psr.setString(4, MapleDataTool.getString(req, ""))
                        } else {
                            psr.setString(4, MapleDataTool.getInt(req, 0).toString())
                        }
                        val intStore1 = StringBuilder()
                        val intStore2 = StringBuilder()
                        val dataStore: MutableList<Pair<Int, Int>> = LinkedList()
                        if (req.name == "job") {
                            val child = req.children
                            for (x in child.indices) {
                                dataStore.add(Pair(i, MapleDataTool.getInt(child[x], -1)))
                            }
                        } else if (req.name == "skill") {
                            val child = req.children
                            for (x in child.indices) {
                                val childdata = child[x] ?: continue
                                dataStore.add(Pair(MapleDataTool.getInt(childdata.getChildByPath("id"), 0),
                                        MapleDataTool.getInt(childdata.getChildByPath("acquire"), 0)))
                            }
                        } else if (req.name == "quest") {
                            val child = req.children
                            for (x in child.indices) {
                                val childdata = child[x] ?: continue
                                dataStore.add(Pair(MapleDataTool.getInt(childdata.getChildByPath("id"), 0),
                                        MapleDataTool.getInt(childdata.getChildByPath("state"), 0)))
                            }
                        } else if (req.name == "item" || req.name == "mob") {
                            val child = req.children
                            for (x in child.indices) {
                                val childdata = child[x] ?: continue
                                dataStore.add(Pair(MapleDataTool.getInt(childdata.getChildByPath("id"), 0),
                                        MapleDataTool.getInt(childdata.getChildByPath("count"), 0)))
                            }
                        } else if (req.name == "mbcard") {
                            val child = req.children
                            for (x in child.indices) {
                                val childdata = child[x] ?: continue
                                dataStore.add(Pair(MapleDataTool.getInt(childdata.getChildByPath("id"), 0),
                                        MapleDataTool.getInt(childdata.getChildByPath("min"), 0)))
                            }
                        } else if (req.name == "pet") {
                            val child = req.children
                            for (x in child.indices) {
                                val childdata = child[x] ?: continue
                                dataStore.add(Pair(i,
                                        MapleDataTool.getInt(childdata.getChildByPath("id"), 0)))
                            }
                        }
                        for (data in dataStore) {
                            if (intStore1.length > 0) {
                                intStore1.append(", ")
                                intStore2.append(", ")
                            }
                            intStore1.append(data.left)
                            intStore2.append(data.right)
                        }
                        psr.setString(5, intStore1.toString())
                        psr.setString(6, intStore2.toString())
                        psr.addBatch()
                    }
                }
                val actData = actz.getChildByPath("$id/$i")
                if (actData != null) {
                    psa.setInt(1, id)
                    psa.setInt(2, i) //0 = start
                    for (act in actData.children) {
                        if (MapleQuestActionType.getByWZName(act.name) == MapleQuestActionType.UNDEFINED) {
                            continue  //un-needed
                        }
                        psa.setString(3, act.name)
                        if (act.name == "sp") {
                            psa.setInt(4, MapleDataTool.getIntConvert("0/sp_value", act, 0))
                        } else {
                            try {
                                psa.setInt(4, MapleDataTool.getInt(act, 0))
                            } catch (d: NumberFormatException) {
                                psa.setInt(4, 0)
                            }
                        }
                        val applicableJobs = StringBuilder()
                        if (act.name == "sp" || act.name == "skill") {
                            var index = 0
                            while (true) {
                                if (act.getChildByPath("$index/job") != null) {
                                    for (d in act.getChildByPath("$index/job")) {
                                        if (applicableJobs.length > 0) {
                                            applicableJobs.append(", ")
                                        }
                                        applicableJobs.append(MapleDataTool.getInt(d, 0))
                                    }
                                    index++
                                } else {
                                    break
                                }
                            }
                        } else {
                            if (act.getChildByPath("job") != null) {
                                for (d in act.getChildByPath("job")) {
                                    if (applicableJobs.length > 0) {
                                        applicableJobs.append(", ")
                                    }
                                    applicableJobs.append(MapleDataTool.getInt(d, 0))
                                }
                            }
                        }
                        psa.setString(5, applicableJobs.toString())
                        psa.setInt(6, -1)
                        psa.setString(7, null)
                        if (act.name == "item") { //prop, job, gender, id, count
                            uniqueid++
                            psa.setInt(6, uniqueid)
                            psai.setInt(1, uniqueid)
                            for (iEntry in act.children) {
                                psai.setInt(2, MapleDataTool.getInt("id", iEntry, 0))
                                psai.setInt(3, MapleDataTool.getInt("count", iEntry, 0))
                                psai.setInt(4, MapleDataTool.getInt("period", iEntry, 0))
                                psai.setInt(5, MapleDataTool.getInt("gender", iEntry, 2))
                                psai.setInt(6, MapleDataTool.getInt("job", iEntry, -1))
                                psai.setInt(7, MapleDataTool.getInt("jobEx", iEntry, -1))
                                if (iEntry.getChildByPath("prop") == null) {
                                    psai.setInt(8, -2)
                                } else {
                                    psai.setInt(8, MapleDataTool.getInt("prop", iEntry, -1))
                                }
                                psai.addBatch()
                            }
                        } else if (act.name == "skill") {
                            uniqueid++
                            psa.setInt(6, uniqueid)
                            psas.setInt(1, uniqueid)
                            for (sEntry in act) {
                                psas.setInt(2, MapleDataTool.getInt("id", sEntry, 0))
                                psas.setInt(3, MapleDataTool.getInt("skillLevel", sEntry, 0))
                                psas.setInt(4, MapleDataTool.getInt("masterLevel", sEntry, 0))
                                psas.addBatch()
                            }
                        } else if (act.name == "quest") {
                            uniqueid++
                            psa.setInt(6, uniqueid)
                            psaq.setInt(1, uniqueid)
                            for (sEntry in act) {
                                psaq.setInt(2, MapleDataTool.getInt("id", sEntry, 0))
                                psaq.setInt(3, MapleDataTool.getInt("state", sEntry, 0))
                                psaq.addBatch()
                            }
                        } else if (act.name == "info") {
                            psa.setInt(4, 0)
                            psa.setString(7, MapleDataTool.getString(act))
                        } else if (act.name.equals("npcAct", ignoreCase = true)) {
                            psa.setInt(4, 0)
                            psa.setString(7, MapleDataTool.getString(act))
                        }
                        psa.addBatch()
                    }
                }
            }
            val infoData = infoz.getChildByPath(id.toString())
            if (infoData != null) {
                ps.setString(2, MapleDataTool.getString("name", infoData, ""))
                ps.setInt(3, if (MapleDataTool.getInt("autoStart", infoData, 0) > 0) 1 else 0)
                ps.setInt(4, if (MapleDataTool.getInt("autoPreComplete", infoData, 0) > 0) 1 else 0)
                ps.setInt(5, MapleDataTool.getInt("viewMedalItem", infoData, 0))
                ps.setInt(6, MapleDataTool.getInt("selectedSkillID", infoData, 0))
                ps.setInt(7, MapleDataTool.getInt("blocked", infoData, 0))
                ps.setInt(8, MapleDataTool.getInt("autoAccept", infoData, 0))
                ps.setInt(9, MapleDataTool.getInt("autoComplete", infoData, 0))
            } else {
                ps.setString(2, "")
                ps.setInt(3, 0)
                ps.setInt(4, 0)
                ps.setInt(5, 0)
                ps.setInt(6, 0)
                ps.setInt(7, 0)
                ps.setInt(8, 0)
                ps.setInt(9, 0)
            }
            ps.addBatch()
            val pinfoData = pinfoz.getChildByPath(id.toString())
            if (pinfoData != null && pinfoData.getChildByPath("rank") != null) {
                psq.setInt(1, id)
                for (d in pinfoData.getChildByPath("rank")) {
                    psq.setString(2, d.name)
                    for (c in d) {
                        psq.setString(3, c.name)
                        for (b in c) {
                            psq.setString(4, b.name)
                            psq.setInt(5, MapleDataTool.getInt(b, 0))
                            psq.addBatch()
                        }
                    }
                }
            }
            println("Added quest: $id")
        }
        println("Done wz_questdata...")
    }

    fun currentId(): Int {
        return id
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            var hadError = false
            var update = false
            val startTime = System.currentTimeMillis()
            for (file in args) {
                if (file.equals("-update", ignoreCase = true)) {
                    update = true
                }
            }
            var currentQuest = 0
            try {
                val dq = DumpQuests(update)
                println("Dumping quests")
                dq.dumpQuests()
                hadError = hadError or dq.isHadError
                currentQuest = dq.currentId()
            } catch (e: Exception) {
                hadError = true
                e.printStackTrace()
                println("$currentQuest quest.")
            }
            val endTime = System.currentTimeMillis()
            val elapsedSeconds = (endTime - startTime) / 1000.0
            val elapsedSecs = elapsedSeconds.toInt() % 60
            val elapsedMinutes = (elapsedSeconds / 60.0).toInt()
            var withErrors = ""
            if (hadError) {
                withErrors = " with errors"
            }
            println("Finished$withErrors in $elapsedMinutes minutes $elapsedSecs seconds")
        }
    }

    init {
        this.update = update
        quest = MapleDataProviderFactory.getDataProvider(File("wz/Quest.wz"))
        if (quest == null) {
            isHadError = true
        }
    }
}