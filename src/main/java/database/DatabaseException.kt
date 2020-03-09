package database

import java.lang.RuntimeException

class DatabaseException : RuntimeException {
    val serialVersionUID: Long = -420103154764822555L
    constructor(message: String) : super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}