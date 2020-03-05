package tools

/**
 * Provides utilities for manipulating collections of objects.
 */
object CollectionUtil {
    /*
     * Copies `count` items off of list, starting from the beginning.
     * @param <T> The type of the list.
     * @param list The list to copy from.
     * @param count The number of items to copy.
     * @return The copied list.
    */
    @JvmStatic
    fun <T> copyFirst(list: List<T>, count: Int): List<T> {
        val ret: MutableList<T> = ArrayList(if (list.size < count) list.size else count)
        var i = 0
        for (elem in list) {
            ret.add(elem)
            if (i++ > count) {
                break
            }
        }
        return ret
    }
}