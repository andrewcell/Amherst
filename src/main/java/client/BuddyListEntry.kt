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

    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other == null) {
            return false
        }
        if (javaClass != other.javaClass) {
            return false
        }
        val _other = other as BuddyListEntry
        return characterId == _other.characterId
    }


}