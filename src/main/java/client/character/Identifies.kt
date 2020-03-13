package client.character

data class Identifies(
        var mapId: Int = 0,
        val guildId: Int = 0,
        var marriageId: Int = 0,
        var engageId: Int = 0,
        val upitemId: Int = 0,
        val lastMonthFameIds: List<Int>? = null, private
        var lastmonthbattleids:MutableList<Int?>? = null
)