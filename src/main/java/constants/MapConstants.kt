package constants

object MapConstants {
    fun isStartingEventMap(mapid: Int): Boolean {
        when (mapid) {
            109010000, 109020001, 109030001, 109030101, 109030201, 109030301, 109030401, 109040000, 109060001, 109060002, 109060003, 109060004, 109060005, 109060006, 109080000, 109080001, 109080002, 109080003 -> return true
        }
        return false
    }

    fun isEventMap(mapid: Int): Boolean {
        return mapid in 109010000..109049999 || mapid in 109050002..109089999 || mapid in 809040000..809040100
    }

    fun isCoconutMap(mapid: Int): Boolean {
        return mapid == 109080000 || mapid == 109080001 || mapid == 109080002 || mapid == 109080003 || mapid == 109080010 || mapid == 109080011 || mapid == 109080012 || mapid == 109090300 || mapid == 109090301 || mapid == 109090302 || mapid == 109090303 || mapid == 109090304 || mapid == 910040100
    }
}