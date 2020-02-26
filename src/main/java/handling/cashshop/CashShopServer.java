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
package handling.cashshop;

import handling.channel.PlayerStorage;
import java.net.ServerSocket;
import server.ServerProperties;

public class CashShopServer {

    private static String ip = ServerProperties.getIP() + ":" + ServerProperties.getPort("cashshop");
    private final static int PORT = ServerProperties.getPort("cashshop");
    private static PlayerStorage players;
    private static boolean finishedShutdown = false;
    private static CashShopServerThread thread;

    public static final void run_startup_configurations() throws Exception {
        players = new PlayerStorage(-10);
        thread = new CashShopServerThread();
        thread._serverSocket = new ServerSocket(PORT);
        thread.start();
    }

    public static final String getIP() {
        return ip;
    }

    public static final PlayerStorage getPlayerStorage() {
        return players;
    }

    public static final void shutdown() {
        if (finishedShutdown) {
            return;
        }
        System.out.println("Saving all connected clients (CS)...");
        players.disconnectAll();
        System.out.println("Shutting down CS...");
        finishedShutdown = true;
    }

    public static boolean isShutdown() {
        return finishedShutdown;
    }
}
