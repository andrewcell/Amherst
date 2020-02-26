package database;

import server.ServerProperties

object DatabaseOption {
    val MySQLURL: String = "jdbc:mysql://" + ServerProperties.mysqlHost + ":" + ServerProperties.mysqlPort + "/" + ServerProperties.mysqlDatabase + "?characterEncoding=" + ServerProperties.mysqlEncoding

    @JvmField
    val MySQLUSER: String = ServerProperties.mysqlUser

    @JvmField
    val MySQLPASS: String = ServerProperties.mysqlPass

    @JvmField
    var MySQLMINCONNECTION = 10

    @JvmField
    var MySQLMAXCONNECTION = 5000
}
