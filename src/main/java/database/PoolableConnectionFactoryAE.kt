package database

import org.apache.commons.dbcp.ConnectionFactory
import org.apache.commons.dbcp.PoolableConnectionFactory
import org.apache.commons.pool.KeyedObjectPoolFactory
import org.apache.commons.pool.ObjectPool
import java.sql.Connection
import java.sql.SQLException

class PoolableConnectionFactoryAE(connFactory: ConnectionFactory, pool: ObjectPool, stmtPoolFactory: KeyedObjectPoolFactory?, private val validationTimeout: Int, defaultReadOnly: Boolean, defaultAutoCommit: Boolean) : PoolableConnectionFactory(connFactory, pool, stmtPoolFactory, null, defaultReadOnly, defaultAutoCommit) {
    @Throws(SQLException::class)
    override fun validateConnection(conn: Connection?) {
        if (conn != null) {
            if (conn.isClosed) {
                throw SQLException("validateConnection: Connection closed.")
            }
        }
        if (conn != null) {
            if (validationTimeout >= 0 && !conn.isValid(validationTimeout)) {
                throw SQLException("validateConnection: Connection invalid.")
            }
        }
    }
}