package webapi

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import server.log.Logger.log

@SpringBootApplication
open class Application

fun main(args: Array<String>) {
    log("Web API Started.", "WebAPI")
    runApplication<Application>(*args)
}
