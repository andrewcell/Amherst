package webapi

import client.LoginCrypto
import database.DatabaseConnection
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import webapi.data.LoginRequestBody
import webapi.data.Result
import webapi.data.Token

@RestController
class AccountController {
    @RequestMapping(value = ["login"], method = arrayOf(RequestMethod.POST))
    fun Login(@RequestBody request: LoginRequestBody): Any {
        val connection = DatabaseConnection.getConnection()
        val ps = connection!!.prepareStatement("SELECT * FROM accounts WHERE name=?")
        ps.setString(1, request.email)
        val rs = ps.executeQuery()
        if (rs.next()) {
            val salt = rs.getString("salt")
            if (LoginCrypto.checkSaltedSha512Hash(rs.getString("password"), request.password, salt)) {
                return Result(code = 200, comment = "success", data = Token(token = TokenManager.newToken(rs.getInt("id")), expireInHour = 1))
            } else {
                return Result(code = 401, comment = "Invalid account information.")
            }
        } else {
            return Result(code = 401, comment = "Invalid account information.")
        }
    }


}