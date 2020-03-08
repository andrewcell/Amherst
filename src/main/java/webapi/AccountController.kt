package webapi

import org.springframework.web.bind.annotation.*
import database.DatabaseConnection
import tools.DataBaseMover

@RestController
class AccountController {
    @PostMapping(value=["login"])
    fun account() {
        val db = DatabaseConnection.getConnection()
        val ps = db!!.prepareStatement("SELECT * FROM accounts ")
        return
    }

}