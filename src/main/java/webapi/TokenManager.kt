package webapi

import java.util.*

object TokenManager {
    private val tokenList: MutableList<String> = mutableListOf()
    private val tokenIdList: MutableList<Int> = mutableListOf()

    private fun generateRandom(length: Int = 64): String {
        val leftLimit = 48 // numeral '0'
        val rightLimit = 122 // letter 'z'
        val targetStringLength = length
        val random = Random()
        val generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter { i: Int -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97) }
                .limit(targetStringLength.toLong())
                .collect({ StringBuilder() }, { obj: StringBuilder, codePoint: Int -> obj.appendCodePoint(codePoint) }) { obj: StringBuilder, s: StringBuilder? -> obj.append(s) }
                .toString()
        return generatedString
    }

    fun newToken(id: Int): String {
        if (id in tokenIdList) {
            val index = tokenIdList.indexOf(id)
            tokenIdList.remove(id)
            tokenList.remove(tokenList[index])
        }
        val token = generateRandom()
        tokenList.add(token)
        tokenIdList.add(id)
        return token
    }

    fun getAccountId(token: String): Int {
        if (token in tokenList) {
            val index = tokenList.indexOf(token)
            return tokenIdList[index]
        } else {
            return -1
        }
    }
}