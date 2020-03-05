package webapi

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class AccountController {
    @GetMapping("/accounts")
    fun account() {
        var map : HashMap<String, String> = HashMap()
        return
    }

}