/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tools

import java.nio.charset.Charset
import java.text.SimpleDateFormat
import java.util.*

/**
 * Provides a suite of utilities for manipulating strings.
 *
 * @author Frz
 * @since Revision 336
 * @version 1.0
 */
object StringUtil {
    /**
     * Gets a string padded from the left to
     * `length` by
     * `padchar`.
     *
     * @param in The input string to be padded.
     * @param padchar The character to pad with.
     * @param length The length to pad to.
     * @return The padded string.
     */
    fun getLeftPaddedStr(`in`: String, padchar: Char, length: Int): String {
        val builder = StringBuilder(length)
        for (x in `in`.toByteArray(Charset.forName("MS949")).size until length) {
            builder.append(padchar)
        }
        builder.append(`in`)
        return builder.toString()
    }

    /**
     * Gets a string padded from the right to
     * `length` by
     * `padchar`.
     *
     * @param in The input string to be padded.
     * @param padchar The character to pad with.
     * @param length The length to pad to.
     * @return The padded string.
     */
    fun getRightPaddedStr(`in`: String, padchar: Char, length: Int): String {
        val builder = StringBuilder(`in`)
        for (x in `in`.toByteArray(Charset.forName("MS949")).size until length) {
            builder.append(padchar)
        }
        return builder.toString()
    }
    /**
     * Joins an array of strings starting from string
     * `start` with
     * `sep` as a seperator.
     *
     * @param arr The array of strings to join.
     * @param start Starting from which string.
     * @return The joined strings.
     */
    /**
     * Joins an array of strings starting from string
     * `start` with a space.
     *
     * @param arr The array of strings to join.
     * @param start Starting from which string.
     * @return The joined strings.
     */
    @JvmOverloads
    fun joinStringFrom(arr: Array<String?>, start: Int, sep: String? = " "): String {
        val builder = StringBuilder()
        for (i in start until arr.size) {
            builder.append(arr[i])
            if (i != arr.size - 1) {
                builder.append(sep)
            }
        }
        return builder.toString()
    }

    /**
     * Makes an enum name human readable (fixes spaces, capitalization, etc)
     *
     * @param enumName The name of the enum to neaten up.
     * @return The human-readable enum name.
     */
    fun makeEnumHumanReadable(enumName: String): String {
        val builder = StringBuilder(enumName.length + 1)
        for (word in enumName.split("_".toRegex()).toTypedArray()) {
            if (word.length <= 2) {
                builder.append(word) // assume that it's an abbrevation
            } else {
                builder.append(word[0])
                builder.append(word.substring(1).toLowerCase())
            }
            builder.append(' ')
        }
        return builder.substring(0, enumName.length)
    }

    /**
     * Counts the number of
     * `chr`'s in
     * `str`.
     *
     * @param str The string to check for instances of `chr`.
     * @param chr The character to check for.
     * @return The number of times `chr` occurs in `str`.
     */
    fun countCharacters(str: String, chr: Char): Int {
        var ret = 0
        for (i in 0 until str.length) {
            if (str[i] == chr) {
                ret++
            }
        }
        return ret
    }

    //        if (calz.getTime().getHours() >= 12) {
//            time = "오후 "+time;
//        } else {
//            time = "오전 "+time;
//        }
    val currentTime: String
        get() {
            val calz = Calendar.getInstance(TimeZone.getTimeZone("KST"), Locale.KOREAN)
            val simpleTimeFormat = SimpleDateFormat("HH:mm:ss")
            //        if (calz.getTime().getHours() >= 12) {
//            time = "오후 "+time;
//        } else {
//            time = "오전 "+time;
//        }
            return simpleTimeFormat.format(calz.time)
        }

    //        if (calz.getTime().getHours() >= 12) {
//            time = "오후 "+time;
//        } else {
//            time = "오전 "+time;
//        }
    val allCurrentTime: String
        get() {
            val calz = Calendar.getInstance(TimeZone.getTimeZone("KST"), Locale.KOREAN)
            val simpleTimeFormat = SimpleDateFormat("yyyy/MM/dd HH:mm:ss")
            //        if (calz.getTime().getHours() >= 12) {
//            time = "오후 "+time;
//        } else {
//            time = "오전 "+time;
//        }
            return simpleTimeFormat.format(calz.time)
        }

    fun getReadableMillis(startMillis: Long, endMillis: Long): String {
        val sb = StringBuilder()
        val elapsedSeconds = (endMillis - startMillis) / 1000.0
        val elapsedSecs = elapsedSeconds.toInt() % 60
        val elapsedMinutes = (elapsedSeconds / 60.0).toInt()
        val elapsedMins = elapsedMinutes % 60
        val elapsedHrs = elapsedMinutes / 60
        val elapsedHours = elapsedHrs % 24
        val elapsedDays = elapsedHrs / 24
        if (elapsedDays > 0) {
            val mins = elapsedHours > 0
            sb.append(elapsedDays)
            sb.append("일 ")
            if (mins) {
                val secs = elapsedMins > 0
                sb.append(elapsedHours)
                sb.append("시간 ")
                if (secs) {
                    val millis = elapsedSecs > 0
                    sb.append(elapsedMins)
                    sb.append("분 ")
                    if (millis) {
                        sb.append(elapsedSecs)
                        sb.append("초 ")
                    }
                }
            }
        } else if (elapsedHours > 0) {
            val mins = elapsedMins > 0
            sb.append(elapsedHours)
            sb.append("시간 ")
            if (mins) {
                val secs = elapsedSecs > 0
                sb.append(elapsedMins)
                sb.append("분 ")
                if (secs) {
                    sb.append(elapsedSecs)
                    sb.append("초 ")
                }
            }
        } else if (elapsedMinutes > 0) {
            val secs = elapsedSecs > 0
            sb.append(elapsedMinutes)
            sb.append("시간 ")
            if (secs) {
                sb.append(elapsedSecs)
                sb.append("초 ")
            }
        } else if (elapsedSeconds > 0) {
            sb.append(elapsedSeconds.toInt())
            sb.append("초 ")
        } else {
            sb.append("없음")
        }
        return sb.toString()
    }
}