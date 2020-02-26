/**
 *
 */
package tools

import server.Timer
import java.util.*

/**
 * @author Eternal
 */
object SystemUtils {
    val usedMemoryMB: Long
        get() = (Runtime.getRuntime().totalMemory() - Runtime.getRuntime()
                .freeMemory()) / 1024L / 1024L

    fun getTimeMillisByDay(year: Int, month: Int, day: Int): Long {
        val cal = Calendar.getInstance()
        cal[Calendar.YEAR] = year
        cal[Calendar.MONTH] = month - 1
        cal[Calendar.DAY_OF_MONTH] = day
        cal[Calendar.HOUR_OF_DAY] = 0
        cal[Calendar.MINUTE] = 0
        cal[Calendar.SECOND] = 0
        return cal.timeInMillis
    }

    fun getTimeMillisByTime(year: Int, month: Int, day: Int, hourofday: Int, min: Int, sec: Int): Long {
        val cal = Calendar.getInstance()
        cal[Calendar.YEAR] = year
        cal[Calendar.MONTH] = month - 1
        cal[Calendar.DAY_OF_MONTH] = day
        cal[Calendar.HOUR_OF_DAY] = hourofday
        cal[Calendar.MINUTE] = min
        cal[Calendar.SECOND] = sec
        return cal.timeInMillis
    }

    fun setScheduleAtTime(year: Int, month: Int, day: Int, hour: Int, min: Int, sec: Int, r: Runnable) {
        val cal = Calendar.getInstance()
        cal[Calendar.YEAR] = year
        cal[Calendar.MONTH] = month - 1
        cal[Calendar.DAY_OF_MONTH] = day
        cal[Calendar.AM_PM] = if (hour >= 12) Calendar.PM else Calendar.AM
        cal[Calendar.HOUR] = hour - if (hour >= 12) 12 else 0
        cal[Calendar.MINUTE] = min
        cal[Calendar.SECOND] = sec
        val t = cal.timeInMillis - System.currentTimeMillis()
        if (t < 0) {
            println("Started Event Runnable...")
            r.run()
        } else {
            println("Scheduled Event Runnable... after " + StringUtil.getReadableMillis(0, t))
            Timer.EventTimer.getInstance().schedule(r, t)
        }
    }

    //if (SystemUtils.getTimeMillisByDay(2013, 5, 30) > System.currentTimeMillis()) {
//    return 0.23;
//} else if (SystemUtils.getTimeMillisByDay(2013, 7, 30) > System.currentTimeMillis()) {
//    return 0.35;
//} else if (SystemUtils.getTimeMillisByDay(2013, 8, 30) > System.currentTimeMillis()) {
//    return 0.45;
//}
    val hpModByDay: Double
        get() =//if (SystemUtils.getTimeMillisByDay(2013, 5, 30) > System.currentTimeMillis()) {
//    return 0.23;
//} else if (SystemUtils.getTimeMillisByDay(2013, 7, 30) > System.currentTimeMillis()) {
//    return 0.35;
//} else if (SystemUtils.getTimeMillisByDay(2013, 8, 30) > System.currentTimeMillis()) {
//    return 0.45;
//}
            1.0
}