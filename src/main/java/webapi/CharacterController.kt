package webapi

import database.DatabaseConnection
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import server.MapleCarnivalChallenge
import tools.scripts.NPCScriptExtractor

import webapi.data.*

data class Stat (
        val STR: Int,
        val DEX: Int,
        val INT: Int,
        val LUK: Int,
        val HP: Int,
        val MP: Int,
        val MaxHP: Int,
        val MaxMP: Int
)

data class Character (
        val world: Int,
        val name: String,
        val level: Int,
        val exp: Int,
        val stat: Stat,
        val meso: Int,
        val job: String,
        val gender: Int,
        val map: String
)

@RestController
@RequestMapping(value=["character"])
class CharacterController {
    @RequestMapping(value=["list"])
    fun list(@RequestBody request: RequestJSON): Result {
        val connection = DatabaseConnection.getConnection()
        val ps = connection!!.prepareStatement("SELECT * FROM characters WHERE accountid=?")

        val accountId = TokenManager.getAccountId(request.token)
        if (accountId == -1) {
            return Result(code=400, comment="Unauthorized")
        }
        ps.setInt(1, accountId)
        val rs = ps.executeQuery()
        val lstChar = mutableListOf<Character>()

        while(rs.next()) {
            val char = Character(
                    world = rs.getInt("world"),
                    name = rs.getString("name"),
                    level = rs.getInt("level"),
                    exp = rs.getInt("exp"),
                    stat = Stat(
                            STR = rs.getInt("str"),
                            DEX = rs.getInt("dex"),
                            INT = rs.getInt("int"),
                            LUK = rs.getInt("luk"),
                            HP = rs.getInt("hp"),
                            MP = rs.getInt("mp"),
                            MaxHP = rs.getInt("maxhp"),
                            MaxMP = rs.getInt("maxmp")
                    ),
                    meso = rs.getInt("meso"),
                    job = MapleCarnivalChallenge.getJobNameById(rs.getInt("job")),
                    gender = rs.getInt("gender"),
                    map = NPCScriptExtractor.getMapName(rs.getInt("map"))
            )

            lstChar.add(char)
        }

        return Result(code=200, comment="", data=lstChar)
    }

}