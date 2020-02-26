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
package constants;

import client.MapleClient;
import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.util.LinkedList;
import java.util.List;
import javax.management.MBeanServer;
import javax.management.ObjectName;

public class ServerConstants implements ServerConstantsMBean {

    public static MapleClient cli = null;
    public static boolean serverType = false; // true : new, false : old
    
    public static byte[] Gateway_IP = {(byte) 10, (byte) 0, (byte) 0, (byte) 1}; // 여기서 아이피를 바꾸세요

    public static boolean showPacket = false;
    public static boolean Use_Localhost = false;//Boolean.parseBoolean(ServerProperties.getProperty("net.sf.odinms.world.admin")); // true = packets are logged, false = others can connect to server
    public static boolean Use_SiteDB = false;
    
    public static boolean logChat = false;
    public static boolean logTrade = false;
    public static boolean logItem = false;
    
    public static final short MAPLE_VERSION = (short) 65;
    public static final byte MAPLE_CHECK = 1;
    public static final byte MAPLE_PATCH = 1;
    public static boolean Use_Fixed_IV = false; // true = disable sniffing, false = server can connect to itself
   
    /*
     * Specifics which job gives an additional EXP to party
     * returns the percentage of EXP to increase
     */
    public static final byte Class_Bonus_EXP(final int job) {
        switch (job) {
            case 501:
            case 530:
            case 531:
            case 532:
            case 2300:
            case 2310:
            case 2311:
            case 2312:
            case 3100:
            case 3110:
            case 3111:
            case 3112:
            case 800:
            case 900:
            case 910:
                return 10;
        }
        return 0;
    }
    
    public static final int DLL_VERSION = 105;
    
    
    public static final List<String> eligibleIP = new LinkedList<String>(), localhostIP = new LinkedList<String>();

    public static enum PlayerGMRank {

        NORMAL('@', 0),
        DONATOR('#', 1),
        SUPERDONATOR('$', 2),
        INTERN('%', 3),
        GM('!', 4),
        SUPERGM('!', 5),
        ADMIN('!', 6);
        private char commandPrefix;
        private int level;

        PlayerGMRank(char ch, int level) {
            commandPrefix = ch;
            this.level = level;
        }

        public char getCommandPrefix() {
            return commandPrefix;
        }

        public int getLevel() {
            return level;
        }
    }

    public static enum CommandType {

        NORMAL(0),
        TRADE(1),
        POKEMON(2);
        private int level;

        CommandType(int level) {
            this.level = level;
        }

        public int getType() {
            return level;
        }
    }

    public static boolean isEligible(final String sessionIP) {
        return eligibleIP.contains(sessionIP.replace("/", ""));
    }


    public static boolean isIPLocalhost(final String sessionIP) {
        return localhostIP.contains(sessionIP.replace("/", "")) && ServerConstants.Use_Localhost;
    }

    static {
        localhostIP.add("hexSha1");
    }
    
    //Packeges.constants.localhostIP.remove("183.91.251.28");
    public static ServerConstants instance;

    public void run() {
        updateIP();
    }

   public void updateIP() {
        eligibleIP.clear();
        final String[] eligibleIPs = {"10.0.0.1"}; //관리자 아이피 추가 (GM캐릭터는 이 아이피에서만 접속가능)
        for (int i = 0; i < eligibleIPs.length; i++) {
            try {
                eligibleIP.add(InetAddress.getByName(eligibleIPs[i]).getHostAddress().replace("/", ""));
            } catch (Exception e) {
            }
        }
    }

    public static void registerMBean() {
        MBeanServer mBeanServer = ManagementFactory.getPlatformMBeanServer();
        try {
            instance = new ServerConstants();
            instance.updateIP();
            mBeanServer.registerMBean(instance, new ObjectName("constants:type=ServerConstants"));
        } catch (Exception e) {
            System.out.println("Error registering Shutdown MBean");
            e.printStackTrace();
        }
    }
}
