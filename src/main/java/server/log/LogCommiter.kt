package server.log

import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.nio.charset.Charset
import java.util.logging.Level
import java.util.logging.Logger
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class LogCommiter {
    private var sql: FileOutputStream? = null
    private var log: FileOutputStream? = null
    private val sqlfile: File
    private val logfile: File

    fun shutdown() {
        try {
            sql!!.close()
            log!!.close()
        } catch (ex: IOException) {
            Logger.getLogger(LogCommiter::class.java.name).log(Level.SEVERE, null, ex)
        }
    }

    fun addQuery(query: String) {
        try {

            sql!!.write((query + ";" + System.getProperty("line.separator")).toByteArray(Charset.forName("UTF8")))
        } catch (ex: IOException) {
        }
    }

    fun sendLog(query: String, moduleName: String, noPrint: Boolean, type: TypeOfLog) {
        try {
            val datetimeNow: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            var TypeMessage: String = ""
            when (type) {
                TypeOfLog.WARNING -> TypeMessage = "*WARNING*"
                TypeOfLog.ERROR -> TypeMessage = "*ERROR*"
                TypeOfLog.CRITICAL -> TypeMessage = "*CRITICAL*"
                TypeOfLog.TERMINATED -> TypeMessage = "**TERMINATED**"
                else -> TypeMessage = ""
            }
            val message = "[$moduleName] $TypeMessage $query - $datetimeNow"
            log!!.write(message.toByteArray(Charset.forName("UTF8")))
            if (!noPrint) {
                println(message)
            }

        } catch (e: IOException) {
            println(e.stackTrace)
        }
    }

    init {
        val datetimeNow: String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH-mm-ss"))
        sqlfile = File("log-$datetimeNow.log")
        logfile = File("amherst-$datetimeNow.log")

        sqlfile.createNewFile()
        logfile.createNewFile()

        try {
            sql = FileOutputStream(sqlfile)
            log = FileOutputStream(logfile)
            sql!!.write((System.getProperty("line.separator") + System.getProperty("line.separator")).toByteArray(Charset.forName("UTF8")))
            log!!.write(("-- Amherst log started : $datetimeNow -- " + System.getProperty("line.separator") + System.getProperty("line.separator")).toByteArray(Charset.forName("UTF8")))
        } catch (ex: IOException) {
            Logger.getLogger(LogCommiter::class.java.name).log(Level.SEVERE, null, ex)
        }
    }

    companion object {
        @JvmField
        val instance = DBLogger()
        val commiterInstance = LogCommiter()
    }
}