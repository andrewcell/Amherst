package tools.data

import java.awt.Point
import java.io.IOException
import java.nio.charset.Charset

/*
 * Provides a interface to a Little Endian stream of bytes.
 */
class LittleEndianAccessor (private val bs: ByteArrayByteStream) {
    /*
     * Class constructor - Wraps the accessor around a stream of bytes.
     * @param bs The byte stream to wrap the accessor around.
     */
    /*
     * Read a single byte from the stream.
     * @return The byte read.
     */
    fun readByte(): Byte {
        return bs.readByte().toByte()
    }

    /*
     * Reads an integer from the stream.
     * @return The integer read.
     */
    fun readInt(): Int {
        val byte1 = bs.readByte()
        val byte2 = bs.readByte()
        val byte3 = bs.readByte()
        val byte4 = bs.readByte()
        return (byte4 shl 24) + (byte3 shl 16) + (byte2 shl 8) + byte1
    }

    /*
     * Reads a short integer from the stream.
     * @return The short read.
     */
    fun readShort(): Short {
        val byte1 = bs.readByte()
        val byte2 = bs.readByte()
        return ((byte2 shl 8) + byte1).toShort()
    }

    fun readUShort(): Int {
        var quest = readShort().toInt()
        if (quest < 0) { //questid 50000 and above, WILL cast to negative, this was tested.
            quest += 65536 //probably not the best fix, but whatever
        }
        return quest
    }

    /*
     * Reads a single character from the stream.
     * @return The character read.
     */
    fun readChar(): Char {
        return readShort().toChar()
    }

    /*
     * Reads a long integer from the stream.
     * @return The long integer read.
     */
    fun readLong(): Long {
        val byte1 = bs.readByte()
        val byte2 = bs.readByte()
        val byte3 = bs.readByte()
        val byte4 = bs.readByte()
        val byte5 = bs.readByte().toLong()
        val byte6 = bs.readByte().toLong()
        val byte7 = bs.readByte().toLong()
        val byte8 = bs.readByte().toLong()
        return ((byte8 shl 56) + (byte7 shl 48) + (byte6 shl 40) + (byte5 shl 32) + (byte4 shl 24) + (byte3 shl 16) +
                (byte2 shl 8) + byte1)
    }

    /*
     * Reads a floating point integer from the stream.
     * @return The float-type integer read.
     */
    fun readFloat(): Float {
        return java.lang.Float.intBitsToFloat(readInt())
    }

    /*
     * Reads a double-precision integer from the stream.
     * @return The double-type integer read.
     */
    fun readDouble(): Double {
        return java.lang.Double.longBitsToDouble(readLong())
    }

    /*
     * Reads an ASCII string from the stream with length <code>n</code>.
     * @param n Number of characters to read.
     * @return The string read.
     */
    fun readAsciiString(n: Int): String {
        val ret = ByteArray(n)
        for (x in 0 until n) {
            ret[x] = readByte()
        }
        return String(ret, Charset.forName("MS949"))
    }

    /*
     * Gets the number of bytes read from the stream so far.
     * @return A long integer representing the number of bytes read.
     */
    val bytesRead: Long
        get() = bs.bytesRead

    /*
     * Reads a MapleStory convention lengthed ASCII string.
     * This consists of a short integer telling the length of the string,
     * then the string itself.
     * @return The string read.
     */
    fun readMapleAsciiString(): String {
        return readAsciiString(readShort().toInt())
    }

    /*
     * Reads a MapleStory Position information.
     * This consists of 2 short integer.
     * @return The Position read.
     */
    fun readPos(): Point {
        val x = readShort().toInt()
        val y = readShort().toInt()
        return Point(x, y)
    }

    /*
     * Reads <code>num</code> bytes off the stream.
     * @param num The number of bytes to read.
     * @return An array of bytes with the length of <code>num</code>
     */
    fun read(num: Int): ByteArray {
        val ret = ByteArray(num)
        for (x in 0 until num) {
            ret[x] = readByte()
        }
        return ret
    }

    fun available(): Long {
        return bs.available()
    }

    override fun toString(): String {
        return bs.toString()
    }

    fun toString(b: Boolean): String {
        return bs.toString(b)
    }

    /*
     * Seek the pointer to <code>offset</code>
     * @param offset The offset to seek to.
     */
    fun seek(offset: Long) {
        try {
            bs.seek(offset)
        } catch (e: IOException) {
            System.err.println("Seek failed$e")
        }
    }

    /*
     * Get the current position of the pointer.
     * @return The current position of the pointer as a long integer.
     */
    val position: Long
        get() = bs.position

    /*
     * Skip <code>num</code> number of bytes in the stream.
     * @param num The number of bytes to skip.
     */
    fun skip(num: Int) {
        seek(position + num)
    }

}