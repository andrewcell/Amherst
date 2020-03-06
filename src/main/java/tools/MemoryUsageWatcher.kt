package tools

import java.lang.management.ManagementFactory

import handling.channel.ChannelServer
import handling.world.World
import server.log.Logger.log
import server.ShutdownServer

class MemoryUsageWatcher(rebootPercent: Int) : Thread("MemoryUsageWatcher") {
    private val minRebootUsage: Long
    private var overflowedCount = 0
    private var zz = 0
    private val mmb = ManagementFactory.getMemoryMXBean()
    override fun run() {
        var overflow = false
        while (!overflow) {
            try {
                val mem = mmb.heapMemoryUsage
                // System.out.println("[MemoryWatcher] Current Memory Usage : " + mem.getUsed() / 1024 + "K / Max : " + mem.getMax() / 1024 + "K / Online : " + ChannelServer.getOnlineConnections());
                if (mem.used > minRebootUsage) {
                    FileoutputUtil.log("MemoryWatcher.txt", "Memory Usage is overflowing. - Count : " + overflowedCount + " (minUsage : " + minRebootUsage / 1024 + "K) (Online : " + ChannelServer.getOnlineConnections() + ")")
                    // System.out.println("[Warning] Memory Usage is overflowing. - Count : " + overflowedCount + " (minUsage : " + minRebootUsage / 1024 + "K)");
                    overflowedCount++
                    zz = 0
                    if (overflowedCount >= maxOverflowCount) {
                        overflow = true
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[경고] 메모리 사용량 오버로 인해 안정 작업을 위해서 서버가 자동 재시작됩니다."))
                        val th = Thread(ShutdownServer.getInstance(), "ShutdownServer from MemoryWatcher")
                        ShutdownServer.getInstance().shutdown()
                        th.start()
                        break
                    } else if (maxOverflowCount * 0.75 <= overflowedCount) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[경고] 메모리 사용량 경고."))
                    } else if (maxOverflowCount * 0.9 <= overflowedCount) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[위험] 메모리 사용량 경고. 메모리 부족이 해결되지 않으면 서버가 재시작될 수 있습니다."))
                    }
                }
                sleep(10000L)
            } catch (e: Exception) {
            }
        }
    }

    companion object {
        private const val maxOverflowCount = 75
        @JvmStatic
        fun main(args: Array<String>) {
            MemoryUsageWatcher(5).start()
        }
    }

    init {
        val mem = mmb.heapMemoryUsage
        minRebootUsage = (mem.max * (rebootPercent / 100.0)).toLong()
        log("Memory Usage Watcher Started. Min Reboot Usage : ${minRebootUsage / 1024}K", "MemoryWatcher")
    }
}