package client

class BuddyListEntry(val name: String, val characterId: Int, var group: String, var channel: Int, var visible: Boolean)  {
    fun isOnline(): Boolean = channel >= 0

    fun setOffline() {
        channel = -1
    }

    override fun hashCode(): Int {
        val prime = 31
        val result = 1
        return prime * result + characterId
    }

    override fun equals(obj: Any?): Boolean {
        if (this === obj) {
            return true
        }
        if (obj == null) {
            return false
        }
        if (javaClass != obj.javaClass) {
            return false
        }
        val other = obj as BuddyListEntry
        return characterId == other.characterId
    }


}