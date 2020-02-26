package database

import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.util.logging.Level
import java.util.logging.Logger
import server.ServerProperties

/**
 * All servers maintain a Database Connection. This class therefore "singletonices" the connection per process.
 */
object DatabaseConnection_XE {
    private var staticCon: Connection? = null
    const val CLOSE_CURRENT_RESULT = 1
    /**
     * The constant indicating that the current `ResultSet` object
     * should not be closed when calling `getMoreResults`.
     *
     * @since 1.4
     */
    const val KEEP_CURRENT_RESULT = 2
    /**
     * The constant indicating that all `ResultSet` objects that
     * have previously been kept open should be closed when calling
     * `getMoreResults`.
     *
     * @since 1.4
     */
    const val CLOSE_ALL_RESULTS = 3
    /**
     * The constant indicating that a batch statement executed successfully
     * but that no count of the number of rows it affected is available.
     *
     * @since 1.4
     */
    const val SUCCESS_NO_INFO = -2
    /**
     * The constant indicating that an error occured while executing a
     * batch statement.
     *
     * @since 1.4
     */
    const val EXECUTE_FAILED = -3
    /**
     * The constant indicating that generated keys should be made
     * available for retrieval.
     *
     * @since 1.4
     */
    const val RETURN_GENERATED_KEYS = 1
    /**
     * The constant indicating that generated keys should not be made
     * available for retrieval.
     *
     * @since 1.4
     */
    const val NO_GENERATED_KEYS = 2//119.205.197.89

    // touch the mysql driver
    @JvmStatic
    val connection: Connection?
        get() {
            try {
                Class.forName("com.mysql.jdbc.Driver") // touch the mysql driver
            } catch (e: ClassNotFoundException) {
                System.err.println("ERROR$e")
            }
            return if (staticCon != null) {
                staticCon
            } else try {
                val con = DriverManager.getConnection(
                        "jdbc:mysql://" + ServerProperties.mysqlHost + ":" + ServerProperties.mysqlPort + "/" + ServerProperties.mysqlDatabase + "?autoReconnect=true&characterEncoding=" + ServerProperties.mysqlEncoding + "&testOnBorrow=true",
                        ServerProperties.mysqlUser, ServerProperties.mysqlPass)
                staticCon = con
                con
            } catch (e: SQLException) {
                System.err.println("ERROR$e")
                null
            }
        }

    @JvmStatic
    fun closeAll() {
        if (staticCon != null) {
            try {
                staticCon!!.close()
            } catch (ex: SQLException) {
                Logger.getLogger(DatabaseConnection_XE::class.java.name).log(Level.SEVERE, null, ex)
            }
        }
    }
}