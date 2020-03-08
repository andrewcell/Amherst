package client.messages

import tools.StringUtil

object CommandProcessorUtil {
    fun joinAfterString(splitted: Array<String>, str: String?): String? {
        for (i in 1 until splitted.size) {
            if (splitted[i].equals(str, ignoreCase = true) && i + 1 < splitted.size) {
                return StringUtil.joinStringFrom(splitted, i + 1)
            }
        }
        return null
    }

    fun getOptionalIntArg(splitted: Array<String>, position: Int, def: Int): Int {
        return if (splitted.size > position) {
            try {
                splitted[position].toInt()
            } catch (nfe: NumberFormatException) {
                def
            }
        } else def
    }

    fun getNamedArg(splitted: Array<String>, startpos: Int, name: String?): String? {
        for (i in startpos until splitted.size) {
            if (splitted[i].equals(name, ignoreCase = true) && i + 1 < splitted.size) {
                return splitted[i + 1]
            }
        }
        return null
    }

    fun getNamedLongArg(splitted: Array<String>, startpos: Int, name: String?): Long? {
        val arg = getNamedArg(splitted, startpos, name)
        if (arg != null) {
            try {
                return arg.toLong()
            } catch (nfe: NumberFormatException) { // swallow - we don't really care
            }
        }
        return null
    }

    fun getNamedIntArg(splitted: Array<String>, startpos: Int, name: String?): Int? {
        val arg = getNamedArg(splitted, startpos, name)
        if (arg != null) {
            try {
                return arg.toInt()
            } catch (nfe: NumberFormatException) { // swallow - we don't really care
            }
        }
        return null
    }

    fun getNamedIntArg(splitted: Array<String>, startpos: Int, name: String?, def: Int): Int {
        return getNamedIntArg(splitted, startpos, name) ?: return def
    }

    fun getNamedDoubleArg(splitted: Array<String>, startpos: Int, name: String?): Double? {
        val arg = getNamedArg(splitted, startpos, name)
        if (arg != null) {
            try {
                return arg.toDouble()
            } catch (nfe: NumberFormatException) { // swallow - we don't really care
            }
        }
        return null
    }
}