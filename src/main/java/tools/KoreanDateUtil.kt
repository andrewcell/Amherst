package tools

import java.util.Date
import java.util.SimpleTimeZone

import tools.packet.PacketHelper

/*
 * Provides a suite of tools for manipulating Korean Timestamps.
 */
object KoreanDateUtil {
    private const val ITEM_YEAR2000 = -1085019342
    private const val REAL_YEAR2000 = 946681229830L

    /*
     * Converts a Unix Timestamp into File Time
     * @param realTimestamp The actual timestamp in milliseconds.
     * @return A 64-bit long giving a filetime timestamp
     */
    fun getTempBanTimestamp(realTimestamp: Long): Long { // long time = (realTimestamp / 1000);//seconds
        return realTimestamp * 10000 + PacketHelper.FT_UT_OFFSET
    }

    /*
     * Gets a timestamp for item expiration.
     * @param realTimestamp The actual timestamp in milliseconds.
     * @return The Korean timestamp for the real timestamp.
     */
    fun getItemTimestamp(realTimestamp: Long): Int {
        val time = ((realTimestamp - REAL_YEAR2000) / 1000 / 60).toInt() // convert to minutes
        return (time * 35.762787).toInt() + ITEM_YEAR2000
    }

    val isDST: Boolean
        get() = SimpleTimeZone.getDefault().inDaylightTime(Date())

    fun getFileTimestamp(_timeStampinMillis: Long, roundToMinutes: Boolean): Long {
        var timeStampinMillis = _timeStampinMillis
        if (isDST) {
            timeStampinMillis -= 3600000L
        }
        val time: Long
        time = if (roundToMinutes) {
            timeStampinMillis / 1000 / 60 * 600000000
        } else {
            timeStampinMillis * 10000
        }
        return time + PacketHelper.FT_UT_OFFSET
    }
}