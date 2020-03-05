package server.log

object Logger {
    val commiter = LogCommiter.commiterInstance

    @JvmStatic
    fun log(message: String, moduleName: String, type: TypeOfLog = TypeOfLog.NORMAL, noPrint: Boolean = false) {
        commiter.sendLog(message, moduleName, noPrint, type)
    }

}