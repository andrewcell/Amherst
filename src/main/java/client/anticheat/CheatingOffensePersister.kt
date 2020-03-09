package client.anticheat

import server.Timer
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock

class CheatingOffensePersister {
    val instance = CheatingOffensePersister()
    val toPersist = LinkedHashSet<CheatingOffenseEntry>()
    val mutex: Lock = ReentrantLock()

    init {
        Timer.CheatTimer.getInstance().register(PersistingTask(), 61000)
    }

    fun persistEntry(coe: CheatingOffenseEntry) {
        mutex.lock()
        try {
            toPersist.remove(coe)
            toPersist.add(coe)
        } finally {
            mutex.unlock()
        }
    }

    inner class PersistingTask : Runnable {
        override fun run() {
            mutex.lock()
            try {
                toPersist.clear()
            } finally {
                mutex.unlock()
            }
         }
    }
}