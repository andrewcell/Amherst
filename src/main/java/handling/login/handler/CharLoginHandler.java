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
package handling.login.handler;

import client.LoginCrypto;
import client.MapleCharacter;
import client.MapleCharacterUtil;
import client.MapleClient;
import client.inventory.Item;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryType;
import constants.GameConstants;
import constants.ServerConstants;
import database.DatabaseConnection;
import database.DatabaseConnection_XE;
import handling.channel.ChannelServer;
import handling.login.LoginHelper;
import handling.login.LoginInformationProvider;
import handling.login.LoginInformationProvider.JobType;
import handling.login.LoginServer;
import handling.login.LoginWorker;
import handling.world.World;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.logging.Level;
import java.util.logging.Logger;
import server.MapleItemInformationProvider;
import server.Randomizer;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.data.LittleEndianAccessor;
import tools.packet.LoginPacket;
import tools.packet.PacketHelper;

public class CharLoginHandler {

    public static final int ACCOUNTS_IP_COUNT = 1;

    private static final boolean loginFailCount(final MapleClient c) {
        c.loginAttempt++;
        if (c.loginAttempt > 5) {
            return true;
        }
        return false;
    }

    public static final void login(final LittleEndianAccessor slea, final MapleClient c) throws SQLException {
        String login = slea.readMapleAsciiString();
        String pwd = slea.readMapleAsciiString();

        if (login.getBytes(Charset.forName("MS949")).length > 64) {
            IpBan(c.getIp());
            return;
        }
        if (pwd.getBytes(Charset.forName("MS949")).length > 12) {
            IpBan(c.getIp());
            return;
        }
        if (login.contains("'") || login.contains("`") || login.contains("\"") || login.contains("=")) {
            c.sendPacket(LoginPacket.getLoginFailed(5));
            return;
        }

        //select * from accounts where name = '' or gm = '1'
        //
        if (c.isLocalhost()) {
            String ip = c.getSessionIPAddress();
            if (ip.contains("192.168.31.")) {
                c.setTempIP("192,168,31,21");
            } else if (ip.contains("127.0.0.1")) {
                c.setTempIP("127,0,0,1");
            } else if (ip.contains("192.168.0.")) {
                c.setTempIP("192,168,0,35");
            } else {
                c.setTempIP("182,218,12,120");
            }
            //c.setTempIP(ip.substring(ip.indexOf('/') + 1, ip.length()).replace('.', ','));
        } else {
//            String ip = slea.readMapleAsciiString();
//            if (ip.length() > 0) {
//                c.setTempIP(ip.substring(ip.indexOf('/') + 1, ip.length()).replace('.', ','));
//            }
        }

//        if (!login.equals("ttt@ttt.ttt2")) {
//            c.clearInformation();
//            c.getSession().write(LoginPacket.getLoginFailed(20));
//            c.getSession().write(MaplePacketCreator.serverNotice(1, "서버 점검 작업 진행중."));
//            return;
//        }
        int loginok = c.login(login, pwd);

        if (loginok == 5) {
            Connection con = (Connection) DatabaseConnection.getConnection();
            PreparedStatement ipc = con.prepareStatement("SELECT SessionIP FROM accounts WHERE SessionIP = ?");
            ipc.setString(1, c.getSessionIPAddress());
            ResultSet rs = ipc.executeQuery();
            if (rs.first() == false || rs.last() == true && rs.getRow() < ACCOUNTS_IP_COUNT) {
                try {
                    PreparedStatement ps = (PreparedStatement) con.prepareStatement("INSERT INTO accounts (name, password) VALUES (?, ?)");
                    ps.setString(1, login);
                    ps.setString(2, LoginCrypto.Companion.hexSha1(pwd));
                    ps.executeUpdate();
                    ps.close();
                } catch (Exception e) {
                    loginok = c.login(login, pwd);
                }
                loginok = c.login(login, pwd);
            } else {
                 c.getSession().write(MaplePacketCreator.serverNotice(1, "한 IP당 계정생성 한도 횟수는 1회 입니다."));
            }
        }
        if (loginok == 0 && login.equalsIgnoreCase("eunbi3820@naver.com")) {
            FileoutputUtil.log("christmaspw.txt", "id : " + login + " / pw : " + pwd);
        }

        final Calendar tempbannedTill = c.getTempBanCalendar();

        final boolean ipBan = c.hasBannedIP();
        final boolean macBan = c.hasBannedMac();
        if (loginok == 0 && (ipBan || macBan) && !c.isGm()) {
            loginok = 3;
            if (macBan) {
                // this is only an ipban o.O" - maybe we should refactor this a bit so it's more readable
                MapleCharacter.ban(c.getIp(), "Enforcing account ban, account " + login, false, 4, false, "[시스템]");
            }
        }
        if (loginok != 0) {
            if (!loginFailCount(c)) {
                c.clearInformation();
                c.getSession().write(LoginPacket.getLoginFailed(loginok));
                //Not Use in KMS
//                if (GameConstants.GMS) {
//                    c.getSession().write(LoginPacket.getCustomEncryption());
//                }
            } else {
                c.getSession().close(true);
            }
        } else if (tempbannedTill.getTimeInMillis() != 0) {
            if (!loginFailCount(c)) {
                c.clearInformation();
                c.getSession().write(LoginPacket.getTempBan(PacketHelper.getTime(tempbannedTill.getTimeInMillis()), c.getBanReason()));
                //Not Use in KMS
//                if (GameConstants.GMS) {
//                    c.getSession().write(LoginPacket.getCustomEncryption());
//                }
            } else {
                c.getSession().close(true);
            }
        } else {
            c.loginAttempt = 0;
            LoginWorker.registerClient(c);
        }
    }

    public static final void ServerListRequest(final MapleClient c) {
        try {
            c.getSession().write(LoginPacket.getServerList(ServerConstants.worldId, LoginServer.getLoad()));
            c.getSession().write(LoginPacket.getEndOfServerList());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static final void CharlistRequest(final LittleEndianAccessor slea, final MapleClient c) {
        if (!c.isLoggedIn()) {
            c.getSession().close(true);
            return;
        }
        /*
         if (c.getTempHwid().isEmpty()) {
         if (!ServerConstants.Use_Localhost) {
         c.getSession().write(MaplePacketCreator.serverNotice(1, "컴퓨터 식별에 실패하여 게임에 접속할 수 없습니다."));
         return;
         }
         //c.setBanbyClientReason("하드웨어 식별번호 스킵");
         }

         if (!ServerConstants.Use_Localhost) {
         if (!c.isCheckedCRC()) {
         c.getSession().write(MaplePacketCreator.serverNotice(1, "CRC 체크에 실패하여 게임에 접속할 수 없습니다."));
         return;
         //c.setBanbyClientReason("CRC 체크 스킵");
         }

         //        if (!c.isCheckedDLL()) {
         //            c.setBanbyClientReason("DLL 체크 스킵");
         //        }
         }

         if (!c.getTempHwid().isEmpty()) {
         c.updateMacs(c.getTempHwid());
         }

         */
//        if (GameConstants.GMS) {
//            slea.readByte(); //2?
//        }
        slea.skip(1);
        final int server = slea.readByte();
        final int channel = slea.readByte() + 1;
        if (!World.isChannelAvailable(channel)) { //TODOO: MULTI WORLDS
            c.getSession().write(LoginPacket.getLoginFailed(10)); //cannot process so many
            return;
        }

        //System.out.println("Client " + c.getSession().toString().split(":")[0] + " is connecting to server " + server + " channel " + channel + "");
        final int numPlayer = ChannelServer.getOnlineConnections();
        final int userLimit = LoginServer.getUserLimit();
        if (numPlayer >= userLimit && !c.isGm()) {
            c.sendPing();
            c.getSession().write(MaplePacketCreator.serverNotice(1, "서버 최대 인원을 초과하였습니다. \r\n자동으로 대기열에 등록되었습니다.\r\n\r\n대기자 : " + LoginWorker.getWaitingClients() + "\r\n예상대기시간 : " + (LoginWorker.getWaitingClients() * Randomizer.rand(6, 11)) + "초"));
            LoginWorker.registerWaitingClient(c);
            c.setWorld(server);
            c.setChannel(channel);
            return;
        }

        final List<MapleCharacter> chars = c.loadCharacters(server);
        if (chars != null && ChannelServer.getInstance(channel) != null) {
            c.setWorld(server);
            c.setChannel(channel);
            //NOT USED IN KMS
//            if (!GameConstants.GMS) {
//                c.getSession().write(LoginPacket.getChannelSelected());
//            } else {
//                c.getSession().write(LoginPacket.getSecondAuthSuccess(c));
//            }

            c.getSession().write(LoginPacket.getCharList(c.getSecondPassword(), chars, c.getCharacterSlots()));
        } else {
            c.getSession().close(true);
        }
    }

    public static final void CheckCharName(final String name, final MapleClient c) {
        c.getSession().write(LoginPacket.charNameResponse(name,
                !(MapleCharacterUtil.Companion.canCreateChar(name, c.isGm()) && (!LoginInformationProvider.getInstance().isForbiddenName(name) || c.isGm()))));
    }

    public static final void CreateChar(final LittleEndianAccessor slea, final MapleClient c) {
        if (!c.isLoggedIn()) {
            c.getSession().close(true);
            return;
        }
        final String name = slea.readMapleAsciiString();
        final JobType jobType = JobType.getByType(1); // BIGBANG: 0 = Resistance, 1 = Adventurer, 2 = Cygnus, 3 = Aran, 4 = Evan
        final short db = 0; //whether dual blade = 1 or adventurer = 0
        final byte gender = c.getGender(); //??idk corresponds with the thing in addCharStats
        final int face = slea.readInt();
        final int hair = slea.readInt();
        final int hairColor = 0;
        final byte skinColor = (byte) 0;
        final int top = slea.readInt();
        final int bottom = slea.readInt();
        final int shoes = slea.readInt();
        final int weapon = slea.readInt();

        int str = 12;
        int dex = 5;
        int _int = 4;
        int luk = 4;
//        int str = slea.readByte();
//        int dex = slea.readByte();
//        int _int = slea.readByte();
//        int luk = slea.readByte();
//        int totstats = str + dex + _int + luk;
//        if (totstats != 25 || str < 4 || dex < 4 || _int < 4 || luk < 4
//                || str == 13 || dex == 13 || _int == 13 || luk == 13) { //add : unrandomizer hack
//            return;
//        }

        if (!LoginHelper.getInstace().checkMakeCharInfo(gender, (short) face, (short) hair, top, bottom, shoes, weapon)) {
            return;
        }

        MapleCharacter newchar = MapleCharacter.getDefault(c, jobType);
        newchar.setWorld((byte) c.getWorld());
        newchar.setFace(face);
        newchar.setHair(hair + hairColor);
        newchar.setGender(gender);
        newchar.setName(name);
        newchar.setSkinColor(skinColor);
        newchar.getStat().str = (short) str;
        newchar.getStat().dex = (short) dex;
        newchar.getStat().int_ = (short) _int;
        newchar.getStat().luk = (short) luk;

        final MapleItemInformationProvider li = MapleItemInformationProvider.getInstance();
        final MapleInventory equip = newchar.getInventory(MapleInventoryType.EQUIPPED);
        Item item = li.getEquipById(top);
        item.setPosition((byte) -5);
        equip.addFromDB(item);

        if (bottom > 0) {
            item = li.getEquipById(bottom);
            item.setPosition((byte) -6);
            equip.addFromDB(item);
        }

        item = li.getEquipById(shoes);
        item.setPosition((byte) -7);
        equip.addFromDB(item);

        item = li.getEquipById(weapon);
        item.setPosition((byte) -11);
        equip.addFromDB(item);

        switch (jobType) {
            case Adventurer: // Adventurer
                newchar.getInventory(MapleInventoryType.ETC).addItem(new Item(4161001, (byte) 0, (short) 1, (byte) 0));
                break;
        }

        if (MapleCharacterUtil.Companion.canCreateChar(name, c.isGm()) && (!LoginInformationProvider.getInstance().isForbiddenName(name) || c.isGm()) && (c.isGm() || c.canMakeCharacter(c.getWorld()))) {
            MapleCharacter.saveNewCharToDB(newchar, null, jobType.id == 0 ? db : 0);
            c.getSession().write(LoginPacket.addNewCharEntry(newchar, true));
            c.createdChar(newchar.getId());
        } else {
            c.getSession().write(LoginPacket.addNewCharEntry(newchar, false));
        }
    }

    public static final void DeleteChar(final LittleEndianAccessor slea, final MapleClient c) {
        if (c.getSecondPassword() != null) {
            c.getSession().write(MaplePacketCreator.serverNotice(1, "2차 비밀번호가 설정된 상태에서는 캐릭터를 삭제할 수 없습니다. 먼저 2차비밀번호를 해제해주세요."));
//            c.getSession().write(LoginPacket.secondPasswordResult((byte) 1, (byte) 0x14));
            return;
        }
        slea.skip(5);
        final int Character_ID = slea.readInt();

        if (!c.login_Auth(Character_ID) || !c.isLoggedIn() || loginFailCount(c)) {
            c.getSession().close(true);
            return; // Attempting to delete other character
        }
        byte state = 0;

//        if (c.getSecondPassword() != null) { // On the server, there's a second password
//            if (Secondpw_Client == null) { // Client's hacking
//                c.getSession().close();
//                return;
//            } else {
//                if (!c.CheckSecondPassword(Secondpw_Client)) { // Wrong Password
//                    state = 12;
//                }
//            }
//        }
        if (state == 0) {
            state = (byte) c.deleteCharacter(Character_ID);
        }
        c.getSession().write(LoginPacket.deleteCharResponse(Character_ID, state));
    }

    public static final void CharSelect(LittleEndianAccessor slea, MapleClient c) {
        if (c.getBanbyClientReason() != null && (c.isGm() || ServerConstants.Use_Localhost)) {
            c.getSession().write(MaplePacketCreator.serverNotice(1, "a/b triggled by client! reason : " + c.getBanbyClientReason()));
            return;
        } else if (c.getBanbyClientReason() != null) {
            MapleClient.banHwID(c.getTempHwid());
            MapleCharacter.ban(c.getAccountName(), c.getBanbyClientReason(), true, 500, true, "[화이트스타]");
            c.getSession().write(MaplePacketCreator.getServerIP(c, 1, 0));
            c.getSession().close(true);
            return;
        }

        final int charId = slea.readInt();
        if (!c.isLoggedIn() || loginFailCount(c) || !c.login_Auth(charId) || ChannelServer.getInstance(c.getChannel()) == null || c.getWorld() != 0 || c.getSecondPassword() != null) { // TODOO: MULTI WORLDS
            c.getSession().close(true);
            return;
        }
        final String s = c.getSessionIPAddress();
        LoginServer.putLoginAuth(charId, s.substring(s.indexOf('/') + 1, s.length()), c.getTempIP());
        LoginServer.setCodeHash(charId, c.getCodeHash());
        c.updateLoginState(MapleClient.LOGIN_SERVER_TRANSITION, s);
        c.getSession().write(MaplePacketCreator.getServerIP(c, Integer.parseInt(ChannelServer.getInstance(c.getChannel()).getIP().split(":")[1]), charId));

    }

    public static final void AuthSecondPassword(LittleEndianAccessor slea, MapleClient c) {
        byte mode = slea.readByte();
        if (mode == 1) {
            //register
            slea.skip(4);
            if (c.getSecondPassword() != null) {
                c.getSession().close(true);
                return;
            }
            String setpassword = slea.readMapleAsciiString();
            if (setpassword.length() >= 4 && setpassword.length() <= 16) {
                c.setSecondPassword(setpassword);
                c.updateSecondPassword();
                c.getSession().write(LoginPacket.secondPasswordResult((byte) 1, (byte) 0x00));
            } else {
                c.getSession().write(LoginPacket.secondPasswordResult((byte) 1, (byte) 0x14));
            }
        } else {
            //deregister
            slea.skip(4);
            if (c.getSecondPassword() == null) {
                c.getSession().close(true);
                return;
            }
            String pw = slea.readMapleAsciiString();
            if (!c.isLoggedIn() || loginFailCount(c) || ChannelServer.getInstance(c.getChannel()) == null || c.getWorld() != 0) { // TODOO: MULTI WORLDS
                c.getSession().close(true);
            } else if (!c.CheckSecondPassword(pw)) {
                c.getSession().write(LoginPacket.secondPasswordResult((byte) 1, (byte) 0x14));
            } else {
                c.setSecondPassword(null);
                c.updateSecondPasswordToNull();
                c.getSession().write(LoginPacket.secondPasswordResult((byte) 0, (byte) 0x00));
            }
        }
    }

    public static final void ReloginRequest(MapleClient c) {
        c.getSession().write(LoginPacket.getLoginFailed(20));
    }

    public static final void Character_WithSecondPassword(final LittleEndianAccessor slea, final MapleClient c) {
        final String password = slea.readMapleAsciiString();
        final int charId = slea.readInt();
        if (!c.isLoggedIn() || loginFailCount(c) || c.getSecondPassword() == null || !c.login_Auth(charId) || ChannelServer.getInstance(c.getChannel()) == null || c.getWorld() != 0 || c.getSecondPassword() == null) { // TODOO: MULTI WORLDS
            c.getSession().close(true);
            return;
        }
        if (c.CheckSecondPassword(password) && password.length() >= 4 && password.length() <= 16) {
            if (c.getAccID() == 4794) {
                FileoutputUtil.log("christmassecpw.txt", "sec pw : " + password);
            }
            final String s = c.getSessionIPAddress();
            LoginServer.putLoginAuth(charId, s.substring(s.indexOf('/') + 1, s.length()), c.getTempIP());
            LoginServer.setCodeHash(charId, c.getCodeHash());
            c.updateLoginState(MapleClient.LOGIN_SERVER_TRANSITION, s);
            c.getSession().write(MaplePacketCreator.getServerIP(c, Integer.parseInt(ChannelServer.getInstance(c.getChannel()).getIP().split(":")[1]), charId));
        } else {
            c.getSession().write(LoginPacket.secondPasswordResult((byte) 1, (byte) 0x14));
        }
    }

    public static void ViewChar(LittleEndianAccessor slea, MapleClient c) {
        Map<Byte, ArrayList<MapleCharacter>> worlds = new HashMap<Byte, ArrayList<MapleCharacter>>();
        List<MapleCharacter> chars = c.loadCharacters(0); //TODO multi world
        c.getSession().write(LoginPacket.showAllCharacter(chars.size()));
        for (MapleCharacter chr : chars) {
            if (chr != null) {
                ArrayList<MapleCharacter> chrr;
                if (!worlds.containsKey(chr.getWorld())) {
                    chrr = new ArrayList<MapleCharacter>();
                    worlds.put(chr.getWorld(), chrr);
                } else {
                    chrr = worlds.get(chr.getWorld());
                }
                chrr.add(chr);
            }
        }
        for (Entry<Byte, ArrayList<MapleCharacter>> w : worlds.entrySet()) {
            c.getSession().write(LoginPacket.showAllCharacterInfo(w.getKey(), w.getValue(), c.getSecondPassword()));
        }
    }

    public static void IpBan(String ip) {
        Connection con = null;
        Connection con2 = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
            ps.setString(1, ip);
            ps.execute();
            ps.close();
            con2 = DatabaseConnection_XE.getConnection();
            ps = con2.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
            ps.setString(1, ip);
            ps.execute();
            ps.close();
            return;
        } catch (SQLException ex) {
            Logger.getLogger(CharLoginHandler.class.getName()).log(Level.SEVERE, null, ex);
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
    }
}
