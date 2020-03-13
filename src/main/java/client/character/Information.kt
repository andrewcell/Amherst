package client.character

import client.MapleQuestStatus
import client.PlayerStats
import client.Skill
import client.SkillEntry
import client.inventory.MapleInventory
import server.quest.MapleQuest

data class Information(
        var accountId: Int = 0,
        var availableCP: Short = 0,
        val battleshipHP: Int = 0,
        var canTalk: Boolean = true,
        var chair: Int = 0,
        var chalktext: String = "",
        var challenge: Int = 0,
        var coconutteam: Int = 0,
        var combo: Short = 0,
        var currentrep: Int = 0,
        var dotHP: Int = 0,
        var exp: Int = 0,
        var fairyExp: Byte = 0,
        var fallcounter: Int = 0,
        var fame: Int = 0,
        var firstLoginTime: Long = 0,
        var gender: Byte = 0,
        var gmLevel: Byte = 0,
        var hasSummon: Boolean = false,
        var hide: Boolean = false,
        var hpApUsed: Short = 0,
        val world: Byte = 0,
        var id: Int = 0,
        var initialSpawnPoint: Byte = 0,
        var itemEffect: Int = 0,
        var inventory: MutableList<MapleInventory> = mutableListOf(),
        val invincible: Boolean = false,
        var job: Short = 0,
        var name: String = "",
        var marriageItemId: Int = 0,
        var mulungEnergy: Short = 0,
        var monsterBookCover: Int = 0,
        var level: Short = 0,
        var locationed: Int = 0,

        var remainAp: Short = 0,
        var remainSp: IntArray = IntArray(10),

        var scrolledPosition: Short = 0,

        var smega: Boolean = true,
        val stats: PlayerStats = PlayerStats(),
        var subcategory:Byte = 0,
        var teleportname: String = "",
        var totalCP: Short = 0,
        var totalrep: Int = 0,
        var weddingGiftGive: Int = 0
) {
    //constructor(id: Int, name: String, level: Int, fame: Int, stat: PlayerStats) : this(id = id, name = name, level = level.toShort(), fame = fame, stats = stat)
}