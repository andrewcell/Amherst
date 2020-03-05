package tools.data

import java.awt.Point
import java.awt.Rectangle
import java.io.ByteArrayOutputStream
import java.nio.charset.Charset

import tools.HexTool
/**
 * Writes a maplestory-packet little-endian stream of bytes.
 */
class MaplePacketLittleEndianWriter @JvmOverloads constructor(size: Int = 32) {
    private val baos: ByteArrayOutputStream = ByteArrayOutputStream(size)
    /*
     * Gets a
     * `MaplePacket` instance representing this sequence of bytes.
     * @return A `MaplePacket` with the bytes in this stream.
     */
    val packet: ByteArray
        get() = baos.toByteArray()

    /*
     * Changes this packet into a human-readable hexadecimal stream of bytes.
     * @return This packet as hex digits.
     */
    override fun toString(): String {
        return HexTool.toString(baos.toByteArray())
    }

    /*
     * Write the number of zero bytes
     * @param b The bytes to write.
     */
    fun writeZeroBytes(i: Int) {
        for (x in 0 until i) {
            baos.write(0)
        }
    }

    /*
     * Write an array of bytes to the stream.
     * @param b The bytes to write.
     */
    fun write(b: ByteArray) {
        for (x in b.indices) {
            baos.write(b[x].toInt())
        }
    }

    /*
     * Write a byte to the stream.
     * @param b The byte to write.
     */
    fun write(b: Byte) {
        baos.write(b.toInt())
    }

    fun write(b: Int) {
        baos.write(b)
    }

    /*
     * Write a short integer to the stream.
     * @param i The short integer to write.
     */
    fun writeShort(i: Int) {
        baos.write((i and 0xFF))
        baos.write((i ushr 8 and 0xFF))
    }

    /*
     * Writes an integer to the stream.
     * @param i The integer to write.
     */
    fun writeInt(i: Int) {
        baos.write((i and 0xFF))
        baos.write((i ushr 8 and 0xFF))
        baos.write((i ushr 16 and 0xFF))
        baos.write((i ushr 24 and 0xFF))
    }

    /*
     * Writes an ASCII string the the stream.
     * @param s The ASCII string to write.
     */
    fun writeAsciiString(s: String) {
        write(s.toByteArray(ASCII))
    }

    fun writeAsciiString(_s: String, max: Int) {
        var s = _s
        if (s.toByteArray(ASCII).size > max) {
            s = s.substring(0, max)
        }
        write(s.toByteArray(ASCII))
        for (i in s.toByteArray(ASCII).size until max) {
            write(0)
        }
    }

    /*
     * Writes a maple-convention ASCII string to the stream.
     * @param s The ASCII string to use maple-convention to write.
     */
    fun writeMapleAsciiString(s: String) {
        writeShort(s.toByteArray(ASCII).size)
        writeAsciiString(s)
    }

    fun writeOpcode(num: Int) {
        writeShort(num)
    }

    /*
     * Writes a 2D 4 byte position information
     * @param s The Point position to write.
     */
    fun writePos(s: Point) {
        writeShort(s.x)
        writeShort(s.y)
    }

    fun writeRect(s: Rectangle) {
        writeInt(s.x)
        writeInt(s.y)
        writeInt(s.x + s.width)
        writeInt(s.y + s.height)
    }

    /*
     * Write a long integer to the stream.
     * @param l The long integer to write.
     */
    fun writeLong(l: Long) {
        baos.write((l and 0xFF).toInt())
        baos.write((l ushr 8 and 0xFF).toInt())
        baos.write((l ushr 16 and 0xFF).toInt())
        baos.write((l ushr 24 and 0xFF).toInt())
        baos.write((l ushr 32 and 0xFF).toInt())
        baos.write((l ushr 40 and 0xFF).toInt())
        baos.write((l ushr 48 and 0xFF).toInt())
        baos.write((l ushr 56 and 0xFF).toInt())
    }

    companion object {
        private val ASCII = Charset.forName("MS949") // ISO-8859-1, UTF-8
    }
    /*
     * Constructor - initializes this stream with size
     * `size`.
     * @param size The size of the underlying stream.
     */
}