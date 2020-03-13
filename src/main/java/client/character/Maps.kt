package client.character

import client.*
import client.anticheat.ReportType
import server.quest.MapleQuest
import tools.ConcurrentEnumMap
import java.util.*
import kotlin.collections.LinkedHashMap

data class Maps(
        @Transient val linkMobs: MutableMap<Int, Int> = HashMap(),
        val questInfo: Map<Int, String> = LinkedHashMap(),
        @Transient val effects: Map<MapleBuffStat, MapleBuffStatValueHolder> = ConcurrentEnumMap<MapleBuffStat, MapleBuffStatValueHolder>(MapleBuffStat::class.java),
        @Transient val coolDowns: Map<Int, MapleCoolDownValueHolder> = LinkedHashMap(),
        @Transient val diseases: Map<MapleDisease, MapleDiseaseValueHolder>? = ConcurrentEnumMap<MapleDisease, MapleDiseaseValueHolder>(MapleDisease::class.java),
        var reports: MutableMap<ReportType, Int> = EnumMap(ReportType::class.java),
        val quests: MutableMap<MapleQuest, MapleQuestStatus> = LinkedHashMap(),
        val skills: MutableMap<Skill, SkillEntry> = LinkedHashMap()
)