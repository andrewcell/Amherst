package webapi.data

data class CharacterResponse (
        val world: Int,
        val name: String,
        val level: Int,
        val exp: Int,
        val stat: CharacterStat,
        val meso: Int,
        val job: String,
        val gender: Int,
        val map: String
)