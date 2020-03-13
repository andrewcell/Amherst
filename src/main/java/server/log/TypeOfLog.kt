package server.log

enum class TypeOfLog(message: String) {
    NORMAL(""), WARNING("**WARNING**"), ERROR("**ERROR**"), CRITICAL("**CRITICAL**"), TERMINATED("**TERMINATED**")
}