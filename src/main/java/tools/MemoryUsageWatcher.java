/*
 * Copyright (C) 2013 Nemesis Maple Story Online Server Program

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tools;

import handling.channel.ChannelServer;
import handling.world.World;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import server.ShutdownServer;

/**
 *
 * @author Eternal
 */
public class MemoryUsageWatcher extends Thread {

    private long minRebootUsage;
    private static int maxOverflowCount = 75;
    private int overflowedCount = 0;
    private int zz = 0;
    private MemoryMXBean mmb = java.lang.management.ManagementFactory.getMemoryMXBean();

    public MemoryUsageWatcher(int rebootPercent) {
        super("MemoryUsageWatcher");
        MemoryUsage mem = mmb.getHeapMemoryUsage();
        minRebootUsage = (long) (mem.getMax() * (rebootPercent / 100.0D));
        //System.out.println("[MemoryWatcher] Memory Usage Watcher Started. Min Reboot Usage : " + minRebootUsage / 1024 + "K");
    }

    @Override
    public void run() {
        boolean overflow = false;
        while (!overflow) {
            try {
                MemoryUsage mem = mmb.getHeapMemoryUsage();
               // System.out.println("[MemoryWatcher] Current Memory Usage : " + mem.getUsed() / 1024 + "K / Max : " + mem.getMax() / 1024 + "K / Online : " + ChannelServer.getOnlineConnections());
                if (mem.getUsed() > minRebootUsage) {
                    FileoutputUtil.log("MemoryWatcher.txt", "Memory Usage is overflowing. - Count : " + overflowedCount + " (minUsage : " + minRebootUsage / 1024 + "K) (Online : " + ChannelServer.getOnlineConnections() + ")");
                   // System.out.println("[Warning] Memory Usage is overflowing. - Count : " + overflowedCount + " (minUsage : " + minRebootUsage / 1024 + "K)");
                    overflowedCount++;
                    zz = 0;
                    if (overflowedCount >= maxOverflowCount) {
                        overflow = true;
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[경고] 메모리 사용량 오버로 인해 안정 작업을 위해서 서버가 자동 재시작됩니다."));
                        Thread th = new Thread(ShutdownServer.getInstance(), "ShutdownServer from MemoryWatcher");
                        ShutdownServer.getInstance().shutdown();
                        th.start();
                        break;
                    } else if (maxOverflowCount * 0.75D <= overflowedCount) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[경고] 메모리 사용량 경고."));
                    } else if (maxOverflowCount * 0.9D <= overflowedCount) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat("[위험] 메모리 사용량 경고. 메모리 부족이 해결되지 않으면 서버가 재시작될 수 있습니다."));
                    }
                }
                Thread.sleep(10000L);
            } catch (Exception e) {
            }
        }
    }

    public static void main(String[] args) {
        new MemoryUsageWatcher(5).start();
    }
}
