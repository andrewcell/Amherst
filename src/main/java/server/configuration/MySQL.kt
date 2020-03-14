package server.configuration

data class MySQL(
        val username: String,
        val password: String,
        val port: Short,
        val host: String,
        val database: String,
        val encoding: String
)