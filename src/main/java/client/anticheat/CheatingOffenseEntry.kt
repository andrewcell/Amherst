package client.anticheat

import java.lang.System.currentTimeMillis

class CheatingOffenseEntry(val offense: CheatingOffense,
                           val characterId: Int,
                           var count: Int = 0,
                           var lastOffense: Long? = null,
                           var parameter: String? = null,
                           val dbId: Int = -1) {

    fun incrementCount() {
        count++
        lastOffense = currentTimeMillis()
    }

    fun isExpired() = lastOffense!! < (currentTimeMillis() - offense.validityDuration)

    fun getPoints() = count * offense.validityDuration
}