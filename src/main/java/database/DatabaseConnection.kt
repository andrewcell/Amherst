package database

import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource
import org.apache.commons.dbcp.ConnectionFactory
import org.apache.commons.dbcp.DriverManagerConnectionFactory
import org.apache.commons.dbcp.PoolingDataSource
import org.apache.commons.pool.impl.GenericObjectPool
import kotlin.system.exitProcess

import server.log.Logger.log

object DatabaseConnection {
    private var dataSource: DataSource? = null
    private val connectionPool: GenericObjectPool = GenericObjectPool()
    /**
     * MySQL 5.0.51 community -> MySQL
     */
    private var databaseName: String? = null
    /**
     * MySQL 5.0.51 community -> 5
     */
    private var databaseMajorVersion = 0
    /**
     * MySQL 5.0.51 community -> 0
     */
    private var databaseMinorVersion = 0
    private var databaseProductVersion: String? = null

    /**
     * Connect to database. Using dhcp api from Apache common, create connection pool.
     */
    init {
        init()
    }
    @Throws
    @JvmStatic
    fun init() {
        synchronized(this) {
            if (dataSource != null) return@synchronized;

            try {
                Class.forName("com.mysql.cj.jdbc.Driver").getDeclaredConstructor().newInstance()
            } catch (ex: Throwable) {
                exitProcess(1)
            }

            if (DatabaseOption.MySQLMINCONNECTION > DatabaseOption.MySQLMAXCONNECTION) {
                DatabaseOption.MySQLMAXCONNECTION = DatabaseOption.MySQLMINCONNECTION
            }

            connectionPool.maxIdle = DatabaseOption.MySQLMINCONNECTION
            connectionPool.maxActive = DatabaseOption.MySQLMAXCONNECTION
            connectionPool.testOnBorrow = true
            connectionPool.maxWait = 5000

            try {
                dataSource = setupDataSource()
                val c: Connection? = getConnection()
                val dmd = c?.metaData
                databaseName = dmd?.databaseProductName
                databaseMajorVersion = dmd?.databaseMajorVersion!!
                databaseMinorVersion = dmd.databaseMinorVersion
                databaseProductVersion = dmd.databaseProductVersion
                log("MySQL Server : $databaseName $databaseProductVersion", "DatabaseConnection")
                log("MySQL Connection URL : ${DatabaseOption.MySQLURL}", "DatabaseConnection")
                c.close()
            } catch (e: Exception) {
                println(e.stackTrace)
                throw Exception()
            }

        }
    }

   // @Throws(Exception::class)
    private fun setupDataSource(): DataSource? {
        return try {
            val conFactory: ConnectionFactory = DriverManagerConnectionFactory(DatabaseOption.MySQLURL,
                    DatabaseOption.MySQLUSER, DatabaseOption.MySQLPASS)
            PoolableConnectionFactoryAE(conFactory, connectionPool, null, 1, false, true)
            PoolingDataSource(connectionPool)
        } catch (e: Exception) {
            println(e.message)
            throw Exception()
        }
    }

    @JvmStatic
    @Synchronized
    fun shutdown() {
        try {
            connectionPool.close()
        } catch (e: Exception) {
        }
        dataSource = null
    }

    @JvmStatic
    @Throws(SQLException::class)
    fun getConnection(): Connection? {
        if (connectionPool.getNumIdle() == 0) {
            connectionPool.setMaxActive(Math.min(connectionPool.getMaxActive() + 1, 10000))
        }

        return dataSource?.connection
    }

    @JvmStatic
    fun getActiveConnections(): Int = connectionPool.numActive

    @JvmStatic
    fun getIdleConnections(): Int = connectionPool.numIdle


    val CLOSE_CURRENT_RESULT = 1
    /**
     * The constant indicating that the current `ResultSet` object
     * should not be closed when calling `getMoreResults`.
     *
     * @since 1.4
     */
    val KEEP_CURRENT_RESULT = 2
    /**
     * The constant indicating that all `ResultSet` objects that
     * have previously been kept open should be closed when calling
     * `getMoreResults`.
     *
     * @since 1.4
     */
    val CLOSE_ALL_RESULTS = 3
    /**
     * The constant indicating that a batch statement executed successfully
     * but that no count of the number of rows it affected is available.
     *
     * @since 1.4
     */
    val SUCCESS_NO_INFO = -2
    /**
     * The constant indicating that an error occured while executing a
     * batch statement.
     *
     * @since 1.4
     */
    val EXECUTE_FAILED = -3
    /**
     * The constant indicating that generated keys should be made
     * available for retrieval.
     *
     * @since 1.4
     */
    @JvmField
    var RETURN_GENERATED_KEYS = 1
    /**
     * The constant indicating that generated keys should not be made
     * available for retrieval.
     *
     * @since 1.4
     */
    val NO_GENERATED_KEYS = 2

}