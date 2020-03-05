package tools

import java.io.Closeable
import java.io.IOException
import java.util.logging.Level
import java.util.logging.Logger

object StreamUtil {
    private val _log = Logger.getLogger(StreamUtil::class.java.name)
    @JvmStatic
    fun close(vararg closeables: Closeable?) {
        for (c in closeables) {
            try {
                c?.close()
            } catch (e: IOException) {
                _log.log(Level.SEVERE, e.localizedMessage, e)
            }
        }
    }
}