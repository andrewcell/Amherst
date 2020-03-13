package client.character

data class Rank(
        var jobRank: Int = 1,
        var jobRankMove: Int = 0,
        val rank: Int = 1,
        var guildrank: Byte = 5,
        var allianceRank: Byte = 5,
        var rankMove: Int = 0
)
