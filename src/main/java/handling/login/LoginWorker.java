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
package handling.login;

import client.MapleCharacter;
import java.util.Map;
import java.util.Map.Entry;

import client.MapleClient;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import tools.FileoutputUtil;
import tools.packet.LoginPacket;
import tools.MaplePacketCreator;
import handling.login.handler.CharLoginHandler;
import java.lang.ref.WeakReference;
import java.sql.Connection;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ScheduledFuture;
import server.Timer;

public class LoginWorker {

    private static long lastUpdate = 0;
    private static Deque<WeakReference> waiting = new LinkedList<WeakReference>();
    private static ScheduledFuture<?> waitingSchedule = null;

    static {
        waitingSchedule = Timer.WorldTimer.getInstance().register(new CheckUserLimit(), 10000L);
    }

    public static int getWaitingClients() {
        return waiting.size();
    }

    public static void registerWaitingClient(final MapleClient c) {
        waiting.add(new WeakReference<MapleClient>(c));
    }

    public static class CheckUserLimit implements Runnable {

        @Override
        public void run() {
            if (!waiting.isEmpty()) {
                int i = 100;
                int z = ChannelServer.getOnlineConnections();
                while (z < LoginServer.getUserLimit()) {
                    if (i <= 0) {
                        break;
                    }
                    MapleClient c = (MapleClient) waiting.removeFirst().get();
                    if (c != null) {
                        if (c.getLatency() > 0) {
                            if (LoginServer.isShutdown()) {
                                c.getSession().write(MaplePacketCreator.serverNotice(1, "로그인 서버가 종료되었습니다. 나중에 다시 접속해 주시기 바랍니다."));
                                c.getSession().close(true);
                                continue;
                            }
                            //System.out.println("Register OK!");
                            final int server = c.getWorld();
                            final int channel = c.getChannel();
                            final List<MapleCharacter> chars = c.loadCharacters(server);
                            if (chars != null && ChannelServer.getInstance(channel) != null) {
                                c.getSession().write(LoginPacket.getCharList(c.getSecondPassword(), chars, c.getCharacterSlots()));
                            } else {
                                c.getSession().close(true);
                            }
                        } else {
                            //System.out.println("Already Disconnected!");
                        }
                    }
                    --i;
                }
            }
        }
    }

    public static void registerClient(final MapleClient c) {
        boolean b = false;
        if (b && !c.isGm()) {
            c.getSession().write(MaplePacketCreator.serverNotice(1, "현재 서버에는 관리자만 접속이 가능합니다. \r\n서버의 문제를 수정하고 테스트중에 있으며, 조속히 해결하도록 노력하겠습니다.\r\n불편을 드려 죄송하며, 잠시만 기다려주시기를 당부드립니다."));
            c.getSession().write(LoginPacket.getLoginFailed(20));
            return;
        }
        c.updateMacs(c.getTempHwid());

        if (System.currentTimeMillis() - lastUpdate > 600000) { // Update once every 10 minutes
            lastUpdate = System.currentTimeMillis();
            final Map<Integer, Integer> load = ChannelServer.getChannelLoad();
            int usersOn = 0;
            if (load == null || load.size() <= 0) { // In an unfortunate event that client logged in before load
                lastUpdate = 0;
                c.getSession().write(LoginPacket.getLoginFailed(7));
                return;
            }
            final double loadFactor = 1200 / ((double) LoginServer.getUserLimit() / load.size());
            for (Entry<Integer, Integer> entry : load.entrySet()) {
                usersOn += entry.getValue();
                load.put(entry.getKey(), Math.min(1200, (int) (entry.getValue() * loadFactor)));
            }
            LoginServer.setLoad(load, usersOn);
            lastUpdate = System.currentTimeMillis();
        }

        if (c.finishLogin() == 0) {
            c.getSession().write(LoginPacket.getAuthSuccessRequest(c));
            CharLoginHandler.ServerListRequest(c);

            //start temp fix

            //CharLoginHandler.ServerStatusRequest(c);
            //c.setWorld(0);
            //c.setChannel(Randomizer.nextInt(ChannelServer.getAllInstances().size()) + 1);
            //c.getSession().write(LoginPacket.getCharList(c.getSecondPassword() != null, c.loadCharacters(0), c.getCharacterSlots()));

            //end temp fix



        } else {
            c.getSession().write(LoginPacket.getLoginFailed(7));
            return;
        }

        //if (!ServerConstants.isEligible(c.getSessionIPAddress())) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO iplog (accid, ip, time) VALUES (?, ?, ?)");
            ps.setInt(1, c.getAccID());
            ps.setString(2, c.getIp());
            ps.setString(3, FileoutputUtil.CurrentReadable_Time());
            ps.executeUpdate();
        } catch (SQLException e) {
            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        //}
    }
}
