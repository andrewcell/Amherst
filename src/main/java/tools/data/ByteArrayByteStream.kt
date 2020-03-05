package tools.data

import tools.HexTool
import java.io.IOException


class ByteArrayByteStream (private val arr: ByteArray) {
    private var pos = 0
    /**
     * Returns the numbers of bytes read from the stream.
     */
    var bytesRead: Long = 0
        private set
    /**
     * Gets the current position of the stream.
     */
    val position: Long
        get() = pos.toLong()

    /*
     * Seeks the pointer the the specified position.
     * @param offset The position you wish to seek to.
     */
    @Throws(IOException::class)
    fun seek(offset: Long) {
        pos = offset.toInt()
    }

    /**
     * Reads a byte from the current position.
     * @return The byte as an integer.
     */
    fun readByte(): Int {
        bytesRead++
        return arr[pos++].toInt() and 0xFF
    }

    /*
     * Returns the current stream as a hexadecimal string of values.
     * Shows the entire stream, and the remaining data at the current position.
     * @return The current stream as a string.
     * @see java.lang.Object.toString
     */
    override fun toString(): String {
        return toString(false)
    }

    fun toString(b: Boolean): String {
        var nows = ""
        if (arr.size - pos > 0) {
            val now = ByteArray(arr.size - pos)
            System.arraycopy(arr, pos, now, 0, arr.size - pos)
            nows = HexTool.toString(now)
        }
        return if (b) {
            "All: " + HexTool.toString(arr) + "\nNow: " + nows
        } else {
            "Data: $nows"
        }
    }

    /*
     * Returns the number of bytes available from the stream.
     * @return Number of bytes available as a long integer.
     */
    fun available(): Long {
        return (arr.size - pos).toLong()
    }

}