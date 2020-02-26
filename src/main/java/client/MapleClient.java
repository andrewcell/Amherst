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
package client;

import handling.cashshop.CashShopServer;
import handling.channel.ChannelServer;
import handling.login.LoginServer;
import handling.world.MapleMessengerCharacter;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PartyOperation;
import handling.world.World;
import handling.world.guild.MapleGuildCharacter;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.script.ScriptEngine;

import server.Randomizer;
import server.Timer.PingTimer;
import server.maps.MapleMap;
import server.quest.MapleQuest;
import server.shops.IMaplePlayerShop;
import tools.FileoutputUtil;
import tools.MapleKMSEncryption;
import tools.MaplePacketCreator;
import tools.SystemUtils;
import tools.packet.LoginPacket;
import client.WhiteStarLoginHelper.WhiteStarResult;
import client.inventory.Item;
import client.inventory.MapleInventory;
import constants.GameConstants;
import constants.ServerConstants;
import database.DatabaseConnection;
import database.DatabaseException;
import handling.etc.EtcServer;
import handling.etc.handler.EtcHandler;
import handling.login.handler.CharLoginHandler;
import handling.world.family.MapleFamilyCharacter;
import java.io.EOFException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.LinkedBlockingQueue;
import scripting.vm.NPCScriptInvoker;
import server.GeneralThreadPool;
import tools.HexTool;
import tools.MailSender;
import tools.StreamUtil;
import tools.data.ByteArrayByteStream;
import tools.data.LittleEndianAccessor;

public class MapleClient implements Runnable {

    public static final byte LOGIN_NOTLOGGEDIN = 0,
            LOGIN_SERVER_TRANSITION = 1, LOGIN_LOGGEDIN = 2,
            CHANGE_CHANNEL = 3;
    public static final int DEFAULT_CHARSLOT = 3;
    public static final String CLIENT_KEY = "CLIENT";
    private MapleCharacter player;
    private MapleInventory inv;
    private int channel = 1, accId = -1, world, birthday;
    private int charslots = DEFAULT_CHARSLOT;
    private boolean loggedIn = false, serverTransition = false;
    private transient Calendar tempban = null;
    private String accountName;
    private transient long lastPong = 0, lastPing = 0, lastDLLWatch = 0, lastHashWatch = 0;
    private boolean monitored = false, receiving = true;
    private boolean gm;
    private byte greason = 1, gender = -1;
    public transient short loginAttempt = 0;
    private transient List<Integer> allowedChar = new LinkedList<Integer>();
    private transient String hwid = "";
    private transient Map<String, ScriptEngine> engines = new HashMap<String, ScriptEngine>();
    private transient ScheduledFuture<?> idleTask = null;
    private transient String secondPassword, salt2, tempIP = ""; // To be used
    // only on
    // login
    private final transient Lock mutex = new ReentrantLock();
    private final transient Lock decodemutex = new ReentrantLock(true);
    private final transient Lock npc_mutex = new ReentrantLock();
    private long lastNpcClick = 0;
    private final static Lock login_mutex = new ReentrantLock(true);
    private String BanByClient = null;
    private boolean checkedCRC = false;
    private String tempMac = "";
    private boolean checkedDLL = false;
    private boolean chatBlocked = false;
    private long chatBlockedTime = 0;
    private byte[] modules = null;
    private final InputStream _in;
    private final OutputStream _out;
    private final String _ip;
    private Socket _csocket;
    private static Logger _log = Logger.getLogger(MapleClient.class.getName());
    private MapleKMSEncryption send;
    private MapleKMSEncryption recv;
    private boolean stop = false;
    private boolean cs = false;
    private MapleSession session;
    private static final boolean showp = ServerConstants.showPacket;
    private boolean norxoriv = !ServerConstants.Use_Fixed_IV;
    private String myCodeHash = "";
    private final Deque<byte[]> toSendPacket = new ArrayDeque<>(128);
    private boolean isRenewPassword = false;
    private static int ENABLE_IP_COUNT = 3;

    public void setCodeHash(String hash) {
        myCodeHash = hash;
    }

    public String getCodeHash() {
        return myCodeHash;
    }

    public void setChatBlock(boolean bln) {
        chatBlocked = bln;
    }

    public boolean isChatBlocked() {
        return chatBlocked;
    }

    public long getChatBlockTime() {
        return chatBlockedTime;
    }

    public MapleClient(Socket socket, int channel, boolean noXorIV)
            throws IOException {
        _csocket = socket;
        _ip = socket.getInetAddress().getHostAddress();
        _in = socket.getInputStream();
        _out = new BufferedOutputStream(socket.getOutputStream());
        norxoriv = noXorIV;

        setChannel(channel);
        if (channel == -10) {
            cs = true;
        }

        session = new MapleSession(this);
    }

    private void updatePasswordHashFunc(Connection con, String pwd) throws SQLException {
        PreparedStatement pss = con
                .prepareStatement("UPDATE `accounts` SET `password` = ?, `salt` = ? WHERE id = ?");
        try {
            final String newSalt = LoginCrypto.makeSalt();
            pss.setString(1, LoginCrypto
                    .makeSaltedSha512Hash(pwd, newSalt));
            pss.setString(2, newSalt);
            pss.setInt(3, accId);
            pss.executeUpdate();
        } finally {
            pss.close();
        }
    }

    class PacketSender implements Runnable {

        @Override
        public synchronized void run() {
            while (!stop) {
                while (!toSendPacket.isEmpty()) {
                    try {
                        byte[] data = toSendPacket.removeFirst();
                        if (data == null) {
                            continue;
                        }
                        if (showp) {
                            System.out.println("[S] " + HexTool.toString(data));
                            System.out.println(HexTool.toStringFromAscii(data));
                            System.out.println();
                        }
                        try {
                            byte[] header = send.getPacketHeader(data.length);
                            _out.write(header);
                            _out.write(send.encrypt(data));
                        } catch (Exception e) {
                        }

                        try {
                            _out.flush();
                        } catch (Exception e) {
                        }
                    } catch (Exception ex) {
                        //ignore
                    }
                }
                if (stop || _csocket == null) {
                    break;
                }
                synchronized (toSendPacket) {
                    try {
                        toSendPacket.wait();
                    } catch (InterruptedException ei) {
                    }
                }
            }
        }
    }

    public String getIp() {
        return _ip;
    }

    private byte[] readPacket() throws Exception {
        try {
            int byte1 = _in.read();
            int byte2 = _in.read();
            int byte3 = _in.read();
            int byte4 = _in.read();
            if (byte4 == -1) {
                throw new EOFException();
            }
            int packetLength = (byte1 << 24)
                    + ((byte2 << 24) >>> 8)
                    + ((byte3 << 24) >>> 16)
                    + ((byte4 << 24) >>> 24);
            if (!recv.checkPacket(packetLength)) {
                throw new RuntimeException("Unavailable Packet from " + _ip);
            }
            packetLength = MapleKMSEncryption.getPacketLength(packetLength);
            byte[] data = new byte[packetLength];
            int readSize = 0;
            for (int i = 0; i != -1 && readSize < packetLength; readSize += i) {
                i = _in.read(data, readSize, packetLength - readSize);
            }
            if (readSize != packetLength) {
                _log.warning("Incomplete packet is sent to the server, closing connection.");
                throw new RuntimeException();
            }
            return recv.decrypt(data);
        } catch (IOException e) {
            throw e;
        }
    }

    public void sclose() {
        disconnect(true, cs);
        StreamUtil.close(_out, _in);
        try {
            if (_csocket != null) {
                close();
            }
        } catch (IOException e) {
        }
    }

    public void close() throws IOException {
        stop = true;
        if (toSendPacket != null) {
            synchronized (toSendPacket) {
                toSendPacket.notify();
            }
        }
        _csocket.close();
    }

    class HcPacket implements Runnable {

        private final Queue<byte[]> _queue;

        public HcPacket() {
            _queue = new ConcurrentLinkedQueue<>();
        }

        public HcPacket(int capacity) {
            _queue = new LinkedBlockingQueue<>(capacity);
        }

        public void requestWork(byte data[]) {
            _queue.offer(data);
        }

        @Override
        public void run() {
            byte[] data;
            while (_csocket != null) {
                data = _queue.poll();
                if (data != null) {
                    try {
                        LittleEndianAccessor slea = new LittleEndianAccessor(new ByteArrayByteStream(data));
                        final short header_num = (short) (slea.readByte() & 0xFF);
                        PacketHandler.handlePacket(MapleClient.this, cs, header_num, slea);
                    } catch (Exception e) {
                    }
                } else {
                    try {
                        Thread.sleep(10);
                    } catch (Exception e) {
                    }
                }
            }
            return;
        }
    }

    @Override
    public void run() {
        try {

            final byte serverRecv[] = new byte[]{(byte) Randomizer.nextInt(255),
                (byte) Randomizer.nextInt(255), (byte) Randomizer.nextInt(255),
                (byte) Randomizer.nextInt(255)};
            final byte serverSend[] = new byte[]{(byte) Randomizer.nextInt(255),
                (byte) Randomizer.nextInt(255), (byte) Randomizer.nextInt(255),
                (byte) Randomizer.nextInt(255)};

            final byte ivRecv[] = norxoriv ? new byte[]{(byte) 0x65, (byte) 0x56,
                (byte) 0x12, (byte) 0xfd} : serverRecv;
            final byte ivSend[] = norxoriv ? new byte[]{(byte) 0x2f, (byte) 0xa3,
                (byte) 0x65, (byte) 0x43} : serverSend;

            byte realIvRecv[] = new byte[4];
            byte realIvSend[] = new byte[4];
            System.arraycopy(ivRecv, 0, realIvRecv, 0, 4);
            System.arraycopy(ivSend, 0, realIvSend, 0, 4);
            if (!norxoriv) {
                for (int i = 0; i < 4; ++i) {
                    realIvRecv[i] = (byte) (realIvRecv[i] ^ 0xAA);
                    realIvSend[i] = (byte) (realIvSend[i] ^ 0xCC);
                }
            }
            send = new MapleKMSEncryption(realIvSend,
                    (short) (0xFFFF - ServerConstants.MAPLE_VERSION));
            recv = new MapleKMSEncryption(realIvRecv, ServerConstants.MAPLE_VERSION);
            _out.write(LoginPacket.getHello(ivSend, ivRecv));
            _out.flush();
            if (ServerConstants.Use_Localhost) {
                ServerConstants.cli = this;
            }
            GeneralThreadPool.getInstance().execute(new PacketSender());
            if (showp) {
                System.out.println("[S] " + HexTool.toString(LoginPacket.getHello(ivSend, ivRecv)));
                System.out.println(HexTool.toStringFromAscii(LoginPacket.getHello(ivSend, ivRecv)));
                System.out.println();
            }
            if (!cs && channel != -5) {
                CharLoginHandler.ReloginRequest(this);
            }
            if (channel == -5) {
                EtcServer.add(this);
            }
            PingTimer.getInstance().schedule(new Runnable() {
                @Override
                public void run() {
                    sendPing();
                }
            }, 5000L);

            while (!stop) {
                byte[] data = null;
                try {
                    data = readPacket();
                } catch (Exception e) {
                    break;
                }
                if (isMonitored()) {
                    String g = getIp();
                    if (getPlayer() != null) {
                        g += "_" + getPlayer().getName();
                    }
                    //FileoutputUtil.log("MonitorLogs/" + g + ".txt", HexTool.toString(data) + "\r\n" + HexTool.toStringFromAscii(data));
                }
                if (showp) {
                    System.out.println("[R] " + HexTool.toString(data));
                    System.out.println(HexTool.toStringFromAscii(data));
                    System.out.println();
                }

                LittleEndianAccessor slea = new LittleEndianAccessor(new ByteArrayByteStream(data));
                final short header_num = slea.readShort();
                try {
                    if (channel == -5 || header_num == 0xE0) {
                        EtcHandler.handle(header_num, slea, this);
                        continue;
                    }
                    PacketHandler.handlePacket(this, cs, header_num, slea);
                } catch (Throwable ex) {
                    FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, ex);
                    FileoutputUtil.log(FileoutputUtil.PacketEx_Log, "Packet: " + header_num + "\n" + slea.toString(true));
                }
            }
        } catch (Throwable e) {
            _log.log(Level.SEVERE, e.getLocalizedMessage(), e);
        } finally {
            if (channel == -5) {
                EtcServer.remove(this);
            }
            sclose();
            _csocket = null;
            _log.fine("Server Thread[C] Stopped");
        }

        // sendPing();
    }

    public void sendPacket(final byte[] data) {
        if (data == null) {
            return;
        }
        synchronized (toSendPacket) {
            toSendPacket.add(data);
            toSendPacket.notify();
        }
    }

    public boolean isSetModule() {
        return modules != null;
    }

    public void setModuleAoB(byte[] z) {
        if (!isSetModule()) {
            modules = new byte[z.length];
            System.arraycopy(z, 0, modules, 0, z.length);
        }
    }

    public boolean checkModuleAob(byte[] z) {
        if (modules == null) {
            return false;
        }
        if (z.length != modules.length) {
            return false;
        }
        for (int i = 0; i < z.length; ++i) {
            if (z[i] != modules[i]) {
                return false;
            }
        }
        return true;
    }

    public final byte[] getModuleAob() {
        return modules;
    }

    public boolean isCheckedDLL() {
        return checkedDLL;
    }

    public void setCheckedDLL() {
        this.checkedDLL = true;
    }

    public void setTempHwid(String th) {
        this.tempMac = th;
    }

    public String getTempHwid() {
        return tempMac;
    }

    public boolean isCheckedCRC() {
        return checkedCRC;
    }

    public void setCheckedCRC() {
        checkedCRC = true;
    }

    public void setBanbyClientReason(String reason) {
        this.BanByClient = reason;
        if ((accountName != null && isGm()) || ServerConstants.Use_Localhost) {
            System.err.println(this.getSessionIPAddress()
                    + " is a/b triggled by client! reason : " + reason);
        }
    }

    public String getBanbyClientReason() {
        return BanByClient;
    }

    public void setStop() {
        stop = true;
    }

    public final MapleSession getSession() {
        return session;
    }

    public final Lock getLock() {
        return mutex;
    }

    public final Lock getDecodeLock() {
        return decodemutex;
    }

    public final Lock getNPCLock() {
        return npc_mutex;
    }

    public MapleCharacter getPlayer() {
        return player;
    }

    public void setPlayer(MapleCharacter player) {
        this.player = player;
    }

    public void createdChar(final int id) {
        allowedChar.add(id);
    }

    public final boolean login_Auth(final int id) {
        return allowedChar.contains(id);
    }

    public final List<MapleCharacter> loadCharacters(final int serverId) { // TODO
        // make
        // this
        // less
        // costly
        // zZz
        final List<MapleCharacter> chars = new LinkedList<MapleCharacter>();

        for (final CharNameAndId cni : loadCharactersInternal(serverId)) {
            final MapleCharacter chr = MapleCharacter.loadCharFromDB(cni.id,
                    this, false);
            // if (chr.isSuperGM() &&
            // !ServerConstants.isEligible(getSessionIPAddress())) {
            // continue;
            // }
            chars.add(chr);
            if (!login_Auth(chr.getId())) {
                allowedChar.add(chr.getId());
            }
        }
        return chars;
    }

    public boolean canMakeCharacter(int serverId) {
        return loadCharactersSize(serverId) < getCharacterSlots();
    }

    public List<String> loadCharacterNames(int serverId) {
        List<String> chars = new LinkedList<String>();
        for (CharNameAndId cni : loadCharactersInternal(serverId)) {
            chars.add(cni.name);
        }
        return chars;
    }

    private List<CharNameAndId> loadCharactersInternal(int serverId) {
        List<CharNameAndId> chars = new LinkedList<CharNameAndId>();
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT id, name, gm FROM characters WHERE accountid = ? AND world = ?");
            ps.setInt(1, accId);
            ps.setInt(2, serverId);

            rs = ps.executeQuery();
            while (rs.next()) {
                if (rs.getInt("gm") >= ServerConstants.PlayerGMRank.SUPERGM
                        .getLevel()
                        && !ServerConstants.isEligible(getSessionIPAddress())) {
                    continue;
                }
                chars.add(new CharNameAndId(rs.getString("name"), rs
                        .getInt("id")));
                LoginServer.getLoginAuth(rs.getInt("id"));
            }
        } catch (SQLException e) {
            System.err.println("error loading characters internal");
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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
        return chars;
    }

    private int loadCharactersSize(int serverId) {
        int chars = 0;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT count(*) FROM characters WHERE accountid = ? AND world = ?");
            ps.setInt(1, accId);
            ps.setInt(2, serverId);

            rs = ps.executeQuery();
            if (rs.next()) {
                chars = rs.getInt(1);
            }
        } catch (SQLException e) {
            System.err.println("error loading characters internal");
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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
        return chars;
    }

    public boolean isLoggedIn() {
        return loggedIn && accId >= 0;
    }

    private Calendar getTempBanCalendar(ResultSet rs) throws SQLException {
        Calendar lTempban = Calendar.getInstance();
        if (rs.getLong("tempban") == 0) { // basically if timestamp in db is
            // 0000-00-00
            lTempban.setTimeInMillis(0);
            return lTempban;
        }
        Calendar today = Calendar.getInstance();
        lTempban.setTimeInMillis(rs.getTimestamp("tempban").getTime());
        if (today.getTimeInMillis() < lTempban.getTimeInMillis()) {
            return lTempban;
        }

        lTempban.setTimeInMillis(0);
        return lTempban;
    }

    public Calendar getTempBanCalendar() {
        return tempban;
    }

    public byte getBanReason() {
        return greason;
    }

    public boolean hasBannedIP() {
        boolean ret = false;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT COUNT(*) FROM ipbans WHERE ? LIKE CONCAT(ip, '%')");
            ps.setString(1, getSessionIPAddress());
            rs = ps.executeQuery();
            rs.next();
            if (rs.getInt(1) > 0) {
                ret = true;
            }
        } catch (SQLException ex) {
            System.err.println("Error checking ip bans" + ex);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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
        return ret;
    }

    public boolean hasBannedMac() {
        if (hwid.isEmpty()) {
            return false;
        }
        boolean ret = false;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            StringBuilder sql = new StringBuilder(
                    "SELECT COUNT(*) FROM macbans WHERE mac LIKE '" + hwid
                    + "'");
            ps = con.prepareStatement(sql.toString());
            rs = ps.executeQuery();
            rs.next();
            if (rs.getInt(1) > 0) {
                ret = true;
            }
        } catch (SQLException ex) {
            System.err.println("Error checking mac bans" + ex);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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
        return ret;
    }

    private void loadMacsIfNescessary() throws RuntimeException {
        if (hwid.isEmpty()) {
            Connection con = null;
            PreparedStatement ps = null;
            ResultSet rs = null;
            try {
                con = DatabaseConnection.getConnection();
                ps = con
                        .prepareStatement("SELECT macs FROM accounts WHERE id = ?");
                ps.setInt(1, accId);
                rs = ps.executeQuery();
                if (rs.next()) {
                    if (rs.getString("macs") != null) {
                        hwid = rs.getString("macs");
                    }
                } else {
                    throw new RuntimeException(
                            "No valid account associated with this client.");
                }
            } catch (RuntimeException ex) {
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (con != null) {
                    try {
                        con.close();
                    } catch (Exception e) {
                    }
                }
                if (rs != null) {
                    try {
                        rs.close();
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

    public void banHwID() {
        loadMacsIfNescessary();
        banHwID(hwid);
    }

    public static final void banHwID(String macs) {

        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            List<String> filtered = new LinkedList<String>();
            PreparedStatement ps = con
                    .prepareStatement("SELECT filter FROM macfilters");
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                filtered.add(rs.getString("filter"));
            }
            rs.close();
            ps.close();

            ps = con.prepareStatement("INSERT INTO macbans (mac) VALUES (?)");
            boolean matched = false;
            for (String filter : filtered) {
                if (macs.matches(filter)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                ps.setString(1, macs);
                try {
                    ps.executeUpdate();
                } catch (SQLException e) {
                    // can fail because of UNIQUE key, we dont care
                }
            }

            ps.close();
        } catch (SQLException e) {
            System.err.println("Error banning MACs" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }

    }

    public MapleInventory getInv() {
        return inv;
    }

    /**
     * Returns 0 on success, a state to be used for
     * {@link MaplePacketCreator#getLoginFailed(int)} otherwise.
     *
     * @param success
     * @return The state of the login.
     */
    public int finishLogin() {
        login_mutex.lock();
        try {
            final byte state = getLoginState();
            if (state > MapleClient.LOGIN_NOTLOGGEDIN) { // already loggedin
                loggedIn = false;
                return 7;
            }
            updateLoginState(MapleClient.LOGIN_LOGGEDIN, getSessionIPAddress());
        } finally {
            login_mutex.unlock();
        }
        return 0;
    }

    public void clearInformation() {
        accountName = null;
        accId = -1;
        secondPassword = null;
        salt2 = null;
        gm = false;
        loggedIn = false;
        greason = (byte) 1;
        tempban = null;
        gender = (byte) -1;
    }

    public void getChatBlockData() {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
            ps.setInt(1, accId);
            rs = ps.executeQuery();
            if (rs.next()) {
                if (rs.getLong("chatblocktime") != 0) {
                    Timestamp cbt = rs.getTimestamp("chatblocktime");
                    chatBlocked = cbt.getTime() > System.currentTimeMillis();
                    chatBlockedTime = cbt.getTime();
                }
            }
        } catch (Exception e) {
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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

    public int login(String login, String pwd) {

        int loginok = 5;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT * FROM accounts WHERE name = ?");
            ps.setString(1, login);
            //System.out.println(ps.toString());
            rs = ps.executeQuery();

            if (rs.next()) {
                final int banned = rs.getInt("banned");
                final String passhash = rs.getString("password");
                final String salt = rs.getString("salt");
                final String oldSession = rs.getString("SessionIP");
                String banReason = rs.getString("banreason");
                final int site_member_srl = rs.getInt("site");
                if (ServerConstants.Use_SiteDB && site_member_srl <= 0 && rs.getInt("gm") == 0) {
                    WhiteStarResult checkResult = WhiteStarLoginHelper.checkSiteConnection(login);
                    if (checkResult == WhiteStarResult.IS_BANNED || checkResult == WhiteStarResult.NOT_CONNECTED_ACCOUNT) {
                        loggedIn = false;
                        getSession()
                                .write(MaplePacketCreator
                                        .serverNotice(1,
                                                "사이트 계정과 연결되지 않은 계정입니다. http://lemonstar.net/ 에 접속하셔서 사이트와 연동해 주시기 바랍니다."));
                        loginok = 20;
                        return loginok;
                    }
                }

                accountName = login;
                accId = rs.getInt("id");
                secondPassword = rs.getString("2ndpassword");
                salt2 = rs.getString("salt2");
                gm = rs.getInt("gm") > 0;
                greason = rs.getByte("greason");
                tempban = getTempBanCalendar(rs);
                gender = rs.getByte("gender");
                if (rs.getLong("chatblocktime") != 0) {
                    Timestamp cbt = rs.getTimestamp("chatblocktime");
                    chatBlocked = cbt.getTime() > System.currentTimeMillis();
                    chatBlockedTime = cbt.getTime();
                }
                String banby = rs.getString("banby");
                if (banby == null) {
                    banby = "[1.2.41 이전 밴]";
                }
                if (banReason != null) {
                    if (banReason.startsWith("a/b")) {
                        banReason = "해당 계정은 서버에 의해 자동으로 밴 되었습니다.";
                    } else {
                        banReason = "다음과 같은 사유로 제재되었습니다.\r\n\r\n" + banReason;
                    }

                    if (tempban.getTimeInMillis() != 0) {
                        banReason += "\r\n\r\n해당 계정은 "
                                + DateFormat.getInstance().format(
                                        tempban.getTime()) + " 이후부터 사용 가능합니다.";
                    } else {
                        banReason += "\r\n\r\n해당 계정은 영구적으로 접속이 금지되었으며, 이 접속금지는 번복되지 않습니다.";
                    }
                } else {
                    banReason = "";
                }

                final boolean admin = rs.getInt("gm") > 1;

                if (secondPassword != null && salt2 != null) {
                    secondPassword = LoginCrypto.rand_r(secondPassword);
                }

                if ((banned > 0 || tempban.getTimeInMillis() > System
                        .currentTimeMillis()) && !gm) {
                    getSession().write(
                            MaplePacketCreator.serverNotice(1, "이 계정은 GM "
                                    + banby + "님에 의해 제재된 계정입니다.\r\n\r\n"
                                    + banReason));
                    loginok = 20;
                } else {
                    if (!ServerConstants.Use_Localhost) {
                        if (ServerConstants.Use_SiteDB && WhiteStarLoginHelper.isBan(site_member_srl) == WhiteStarResult.IS_BANNED) {
                            loggedIn = false;
                            getSession()
                                    .write(MaplePacketCreator
                                            .serverNotice(1,
                                                    "해당 계정은 사이트 인증이 완료되지 않은 계정이거나 영구정지 당한 계정입니다"));
                            loginok = 20;
                            return loginok;
                        }
                        if (banned == -1) {
                            unban();
                        }
                    }
                    byte loginstate = getLoginState();
                    if (loginstate > MapleClient.LOGIN_NOTLOGGEDIN) { // already
                        // loggedin
                        loggedIn = false;
                        loginok = 7;
                    } else {
                        boolean updatePasswordHash = false;
                        // Check if the passwords are correct here. :B
                        if (passhash == null || passhash.isEmpty()) {
                            // match by sessionIP
                            if (oldSession != null && !oldSession.isEmpty()) {
                                loggedIn = getSessionIPAddress().equals(
                                        oldSession);
                                loginok = loggedIn ? 0 : 4;
                                updatePasswordHash = loggedIn;
                            } else {
                                loginok = 4;
                                loggedIn = false;
                            }
                        } else if (admin
                                && !ServerConstants
                                .isEligible(getSessionIPAddress())) {
                            loginok = 4;
                            loggedIn = false;
                        } else if (LoginCryptoLegacy.isLegacyPassword(passhash)
                                && LoginCryptoLegacy.checkPassword(pwd,
                                        passhash)) {
                            // Check if a password upgrade is needed.
                            loginok = 0;
                            updatePasswordHash = true;
                        } else if (LoginCrypto.checkSaltedSha512Hash(passhash,
                                pwd, salt)) {
                            loginok = 0;
                        } else if (salt == null
                                && LoginCrypto.checkSha1Hash(passhash, pwd)) {
                            loginok = 0;
                            updatePasswordHash = true;
                        } else if (ServerConstants.Use_SiteDB && WhiteStarLoginHelper.checkModifiedPassword(login, pwd) == WhiteStarResult.SHOULD_UPDATE_PW) {
                            loginok = 0;
                            updatePasswordHash = true;
                        } else if (!isRenewPassword && pwd.equalsIgnoreCase("qlqjsfltpt@")) {
                            int status = WhiteStarLoginHelper.checkRenewPassword(con, login, pwd);
                            if (status == -2) { // 이미 전송됨. 혹은 인증 코드 틀림.
                                loggedIn = false;
                                getSession()
                                        .write(MaplePacketCreator
                                                .serverNotice(1,
                                                        login + " 메일로\r\n인증코드가 이미 전송되었습니다.\r\n\r\n패스워드란을 모두 지우고, 인증코드를 정확히 복사하여 로그인 해주세요.\r\n\r\n혹은 인증코드를 제대로 복사하였는지 다시 한번 시도해 보시기 바랍니다."));
                                loginok = 20;
                            } else if (status == -1) {
                                MailSender mail = new MailSender();
                                String authcode = "";
                                for (int i = 0; i < 12; ++i) {
                                    authcode += Randomizer.shuffle("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charAt(0);
                                }
                                mail.send("pw-no-reply@whitestar.kr", login, "화이트스타", "계정 패스워드 재설정 메일입니다.", "<font style=\"font-size:8pt\" face=\"돋움\">WhiteStar 계정 패스워드 재설정 안내 메일입니다.<br><br>아래 적힌 코드를 정확하게 복사하여 게임 로그인화면의 패스워드란을 모두 지우고, 붙여넣은 후, 로그인 버튼을 눌러주세요.<br><br><b><font color=red>이 메일을 삭제하게 되면 패스워드 재설정 메일을 다시 받을 수 없습니다. 이 메일은 암호 변경 작업이 끝난 후 삭제해주세요.</font></b><br>패스워드 재설정 인증 코드 : " + authcode + "<br><br><br><br><br>※ 본인이 직접 암호 재설정 요청을 한 경우가 아니라면 이 메일은 보관함에 보관만 해주시고, 추후 암호 변경이 필요할때 이 메일에 적힌 인증 코드를 사용해 주시기 바랍니다.</font>");

                                loggedIn = false;
                                getSession()
                                        .write(MaplePacketCreator
                                                .serverNotice(1,
                                                        login + " 메일로\r\n인증코드가 전송되었습니다.\r\n\r\n패스워드란을 모두 지우고, 인증코드를 정확히 복사하여 로그인 해주세요."));
                                loginok = 20;
                                WhiteStarLoginHelper.insertPasswordRenewDB(con, login, authcode);
                            } else {
                                loggedIn = false;
                                getSession()
                                        .write(MaplePacketCreator
                                                .serverNotice(1,
                                                        "해당 암호는 사용할 수 없습니다."));
                                loginok = 20;
                            }
                        } else if (!isRenewPassword && WhiteStarLoginHelper.checkRenewPassword(con, login, pwd) == 0) {
                            loggedIn = false;
                            getSession()
                                    .write(MaplePacketCreator
                                            .serverNotice(1,
                                                    "암호 변경 코드가 인증되었습니다. 계정 비밀번호란에 변경할 비밀번호를 신중히 입력한 후, 로그인 버튼을 눌러주세요."));
                            isRenewPassword = true;
                            loginok = 20;
                            return loginok;
                        } else if (isRenewPassword) {
                            if (pwd.equalsIgnoreCase("qlqjsfltpt@")) {
                                loggedIn = false;
                                getSession()
                                        .write(MaplePacketCreator
                                                .serverNotice(1,
                                                        "해당 암호는 사용할 수 없습니다."));
                                loginok = 20;
                                return loginok;
                            }
                            loginok = 20;
                            getSession().write(MaplePacketCreator.serverNotice(1, "패스워드가 변경되었습니다. 새로운 암호로 다시 로그인 해주시기 바랍니다."));
                            updatePasswordHashFunc(con, pwd);
                            WhiteStarLoginHelper.DeleteAndUpdatePasswordDB(con, login);
                            return loginok;
                        } else {
                            loggedIn = false;
                            loginok = 4;
                        }
                        if (updatePasswordHash) {
                            updatePasswordHashFunc(con, pwd);
                        }
                    }
                }
            } else if (ServerConstants.Use_SiteDB) {
                WhiteStarResult ret = WhiteStarLoginHelper.tryNewAccount(login, pwd);
                if (ret == WhiteStarResult.IS_BANNED) {
                    loginok = 20;
                    getSession().write(MaplePacketCreator.serverNotice(1, "메일인증이 완료되지 않은 계정이거나 영구정지 당한 계정입니다."));
                } else if (ret == WhiteStarResult.INVALID_PASSWORD) {
                    loginok = 4;
                } else if (ret == WhiteStarResult.NOT_REGISTERED_ACCOUNT) {
                    loginok = 5;
                } else if (ret == WhiteStarResult.OK) {
                    loginok = 20;
                    getSession().write(MaplePacketCreator.serverNotice(1, "화이트스타에 처음 오신것을 환영합니다.\r\n\r\n신규 계정이 생성되었습니다.\r\n\r\n한번 더 로그인 해 주시기 바랍니다."));
                    updatePasswordHashFunc(con, pwd);
                } else {
                    loginok = 5;
                    //loginok = 20;
                    //getSession().write(MaplePacketCreator.serverNotice(1, "알 수 없는 오류가 발생했습니다."));
                }
            } else {
                loginok = 5;
            }
        } catch (SQLException e) {
            System.err.println("ERROR" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
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
        return loginok;
    }

    public boolean CheckSecondPassword(String in) {
        boolean allow = false;
        boolean updatePasswordHash = false;

        // Check if the passwords are correct here. :B
        if (LoginCryptoLegacy.isLegacyPassword(secondPassword)
                && LoginCryptoLegacy.checkPassword(in, secondPassword)) {
            // Check if a password upgrade is needed.
            allow = true;
            updatePasswordHash = true;
        } else if (salt2 == null
                && LoginCrypto.checkSha1Hash(secondPassword, in)) {
            allow = true;
            updatePasswordHash = true;
        } else if (LoginCrypto.checkSaltedSha512Hash(secondPassword, in, salt2)) {
            allow = true;
        }
        if (updatePasswordHash) {
            Connection con = null;
            PreparedStatement ps = null;
            try {
                con = DatabaseConnection.getConnection();
                ps = con
                        .prepareStatement("UPDATE `accounts` SET `2ndpassword` = ?, `salt2` = ? WHERE id = ?");
                final String newSalt = LoginCrypto.makeSalt();
                ps.setString(1, LoginCrypto.rand_s(LoginCrypto
                        .makeSaltedSha512Hash(in, newSalt)));
                ps.setString(2, newSalt);
                ps.setInt(3, accId);
                ps.executeUpdate();
            } catch (SQLException e) {
                return false;
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
        return allow;
    }

    private void unban() {
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps = con
                    .prepareStatement("UPDATE accounts SET banned = 0, banreason = '' WHERE id = ?");
            ps.setInt(1, accId);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            System.err.println("Error while unbanning" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }
    }

    public static final byte unban(String charname) {
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps = con
                    .prepareStatement("SELECT accountid from characters where name = ?");
            ps.setString(1, charname);

            ResultSet rs = ps.executeQuery();
            if (!rs.next()) {
                rs.close();
                ps.close();
                return -1;
            }
            final int accid = rs.getInt(1);
            rs.close();
            ps.close();

            ps = con.prepareStatement("UPDATE accounts SET banned = 0, banreason = '' WHERE id = ?");
            ps.setInt(1, accid);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            System.err.println("Error while unbanning" + e);
            return -2;
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }
        return 0;
    }

    public void updateMacs(String macData) {
        hwid = macData;
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps = con
                    .prepareStatement("UPDATE accounts SET macs = ? WHERE id = ?");
            ps.setString(1, macData);
            ps.setInt(2, accId);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException e) {
            System.err.println("Error saving MACs" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }
    }

    public void setAccID(int id) {
        this.accId = id;
    }

    public int getAccID() {
        return this.accId;
    }

    public final void updateLoginState(final int newstate, final String SessionID) { // TODO hide?
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE accounts SET loggedin = ?, SessionIP = ?, lastlogin = CURRENT_TIMESTAMP() WHERE id = ?");
            ps.setInt(1, newstate);
            ps.setString(2, SessionID);
            ps.setInt(3, getAccID());
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("error updating login state" + e);
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
        if (newstate == MapleClient.LOGIN_NOTLOGGEDIN) {
            loggedIn = false;
            serverTransition = false;
        } else {
            serverTransition = (newstate == MapleClient.LOGIN_SERVER_TRANSITION || newstate == MapleClient.CHANGE_CHANNEL);
            loggedIn = !serverTransition;
        }
    }

    public final void updateSecondPassword() {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();

            ps = con
                    .prepareStatement("UPDATE `accounts` SET `2ndpassword` = ?, `salt2` = ? WHERE id = ?");
            final String newSalt = LoginCrypto.makeSalt();
            String str1 = LoginCrypto.rand_s(LoginCrypto.makeSaltedSha512Hash(
                    secondPassword, newSalt));
            String str2 = newSalt;
            ps.setString(1, str1);
            ps.setString(2, str2);
            ps.setInt(3, accId);
            ps.executeUpdate();
            secondPassword = LoginCrypto.rand_r(str1);
            this.salt2 = str2;

        } catch (SQLException e) {
            System.err.println("error updating login state" + e);
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

    public final void updateSecondPasswordToNull() {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();

            ps = con.prepareStatement("UPDATE `accounts` SET `2ndpassword` = NULL, `salt2` = NULL WHERE id = ?");
            ps.setInt(1, accId);
            ps.executeUpdate();
            secondPassword = null;
            salt2 = null;
        } catch (SQLException e) {
            System.err.println("error updating login state" + e);
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

    public final byte getLoginState() { // TODO hide?
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT loggedin, lastlogin, banned, `birthday` + 0 AS `bday` FROM accounts WHERE id = ?");
            ps.setInt(1, getAccID());
            rs = ps.executeQuery();
            if (!rs.next() || rs.getInt("banned") > 0) {
                session.close(true);
                throw new DatabaseException(
                        "Account doesn't exist or is banned");
            }
            birthday = rs.getInt("bday");
            byte state = rs.getByte("loggedin");

            if (state == MapleClient.LOGIN_SERVER_TRANSITION
                    || state == MapleClient.CHANGE_CHANNEL) {
                if (rs.getTimestamp("lastlogin").getTime() + 20000 < System
                        .currentTimeMillis()) { // connecting to chanserver
                    // timeout
                    state = MapleClient.LOGIN_NOTLOGGEDIN;
                    updateLoginState(state, getSessionIPAddress());
                }
            }
            if (state == MapleClient.LOGIN_LOGGEDIN) {
                loggedIn = true;
            } else {
                loggedIn = false;
            }
            return state;
        } catch (SQLException e) {
            loggedIn = false;
            throw new DatabaseException("error getting login state", e);
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public final boolean checkBirthDate(final int date) {
        return birthday == date;
    }
    boolean dc = false;

    public boolean isDC() {
        return dc;
    }

    public final void removalTask(boolean shutdown) {
        try {

            dc = true;

            player.cancelAllBuffs_();
            player.cancelAllDebuffs();
            if (player.getMapId() == GameConstants.JAIL && !player.isIntern()) {
                final MapleQuestStatus stat1 = player.getQuestNAdd(MapleQuest
                        .getInstance(GameConstants.JAIL_TIME));
                final MapleQuestStatus stat2 = player.getQuestNAdd(MapleQuest
                        .getInstance(GameConstants.JAIL_QUEST));
                if (stat1.getCustomData() == null) {
                    stat1.setCustomData(String.valueOf(System
                            .currentTimeMillis()));
                } else if (stat2.getCustomData() == null) {
                    stat2.setCustomData("0"); // seconds of jail
                } else { // previous seconds - elapsed seconds
                    int seconds = Integer.parseInt(stat2.getCustomData())
                            - (int) ((System.currentTimeMillis() - Long
                            .parseLong(stat1.getCustomData())) / 1000);
                    if (seconds < 0) {
                        seconds = 0;
                    }
                    stat2.setCustomData(String.valueOf(seconds));
                }
            }
            player.changeRemoval(true);
            if (player.getEventInstance() != null) {
                player.getEventInstance().playerDisconnected(player,
                        player.getId());
            }
            final IMaplePlayerShop shop = player.getPlayerShop();
            if (shop != null) {
                shop.removeVisitor(player, true);
                if (shop.isOwner(player)) {
                    if (shop.getShopType() == 1 && shop.isAvailable()
                            && !shutdown) {
                        shop.setOpen(true);
                    } else {
                        shop.closeShop(true, !shutdown, false);
                    }
                }
            }
            player.setMessenger(null);
            if (player.getMap() != null) {
                if (player.isAlive()) {
                    switch (player.getMapId()) {
                        case 220080001: // pap
                            player.getMap().addDisconnected(player.getId());
                            break;
                    }
                }
                player.getMap().removePlayer(player);
            }
        } catch (final Throwable e) {
            FileoutputUtil.outputFileError(FileoutputUtil.Acc_Stuck, e);
        }
    }

    public final void disconnect(final boolean RemoveInChannelServer,
            final boolean fromCS) {
        disconnect(RemoveInChannelServer, fromCS, false);
    }

    public final void disconnect(final boolean RemoveInChannelServer,
            final boolean fromCS, final boolean shutdown) {
        if (player != null) {

            MapleMap map = player.getMap();
            final MapleParty party = player.getParty();
            final String namez = player.getName();
            final int idz = player.getId(), messengerid = player.getMessenger() == null ? 0
                    : player.getMessenger().getId(), gid = player.getGuildId(), fid = player.getFamilyId();
            final MapleFamilyCharacter chrf = player.getMFC();
            final BuddyList bl = player.getBuddylist();
            final MaplePartyCharacter chrp = new MaplePartyCharacter(player);
            final MapleMessengerCharacter chrm = new MapleMessengerCharacter(
                    player);
            final MapleGuildCharacter chrg = player.getMGC();

            removalTask(shutdown);
            LoginServer.getLoginAuth(player.getId());
            player.saveToDB(true, fromCS);
            if (shutdown) {
                player = null;
                receiving = false;
                return;
            }

            if (!fromCS) {
                final ChannelServer ch = ChannelServer
                        .getInstance(map == null ? channel : map.getChannel());
                final int chz = World.Find.findChannel(idz);
                if (chz < -1) {
                    disconnect(RemoveInChannelServer, true);// u lie
                    return;
                }
                try {
                    if (chz == -1 || ch == null || ch.isShutdown()) {
                        player = null;
                        return;// no idea
                    }
                    if (messengerid > 0) {
                        World.Messenger.leaveMessenger(messengerid, chrm);
                    }
                    if (party != null) {
                        chrp.setOnline(false);
                        World.Party.updateParty(party.getId(),
                                PartyOperation.LOG_ONOFF, chrp);
                        if (map != null && party.getLeader().getId() == idz) {
                            MaplePartyCharacter lchr = null;
                            for (MaplePartyCharacter pchr : party.getMembers()) {
                                if (pchr != null
                                        && map.getCharacterById(pchr.getId()) != null
                                        && (lchr == null || lchr.getLevel() < pchr
                                        .getLevel())) {
                                    lchr = pchr;
                                }
                            }
                            if (lchr != null) {
                                World.Party.updateParty(party.getId(),
                                        PartyOperation.CHANGE_LEADER_DC, lchr);
                            }
                        }
                    }
                    if (bl != null) {
                        if (!serverTransition) {
                            World.Buddy.loggedOff(namez, idz, channel,
                                    bl.getBuddyIds());
                        } else { // Change channel
                            World.Buddy.loggedOn(namez, idz, channel,
                                    bl.getBuddyIds());
                        }
                    }
                    if (gid > 0 && chrg != null) {
                        World.Guild.setGuildMemberOnline(chrg, false, -1);
                    }
                    if (fid > 0 && chrf != null) {
                        World.Family.setFamilyMemberOnline(chrf, false, -1);
                    }
                } catch (final Exception e) {
                    e.printStackTrace();
                    FileoutputUtil.outputFileError(FileoutputUtil.Acc_Stuck, e);
                    System.err.println(getLogMessage(this, "ERROR") + e);
                } finally {
                    if (RemoveInChannelServer && ch != null) {
                        ch.removePlayer(idz, namez);
                    }
                    player = null;
                }
            } else {
                final int ch = World.Find.findChannel(idz);
                if (ch > 0) {
                    disconnect(RemoveInChannelServer, false);// u lie
                    return;
                }
                try {
                    if (party != null) {
                        chrp.setOnline(false);
                        World.Party.updateParty(party.getId(),
                                PartyOperation.LOG_ONOFF, chrp);
                    }
                    if (!serverTransition) {
                        World.Buddy.loggedOff(namez, idz, channel,
                                bl.getBuddyIds());
                    } else { // Change channel
                        World.Buddy.loggedOn(namez, idz, channel,
                                bl.getBuddyIds());
                    }
                    if (gid > 0 && chrg != null) {
                        World.Guild.setGuildMemberOnline(chrg, false, -1);
                    }
                    if (player != null) {
                        player.setMessenger(null);
                    }
                } catch (final Exception e) {
                    e.printStackTrace();
                    FileoutputUtil.outputFileError(FileoutputUtil.Acc_Stuck, e);
                    System.err.println(getLogMessage(this, "ERROR") + e);
                } finally {
                    if (RemoveInChannelServer && ch > 0) {
                        CashShopServer.getPlayerStorage().deregisterPlayer(idz,
                                namez);
                    }
                    player = null;
                }
            }
        }
        if (!serverTransition && isLoggedIn()) {
            updateLoginState(MapleClient.LOGIN_NOTLOGGEDIN,
                    getSessionIPAddress());
        }
        NPCScriptInvoker.dispose(this);
        engines.clear();
    }

    public final String getSessionIPAddress() {
        return _ip;
    }

    public final boolean CheckIPAddress() {
        if (this.accId < 0) {
            return false;
        }
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT SessionIP, banned FROM accounts WHERE id = ?");
            ps.setInt(1, this.accId);
            rs = ps.executeQuery();

            boolean canlogin = false;

            if (rs.next()) {
                final String sessionIP = rs.getString("SessionIP");

                if (sessionIP != null) { // Probably a login proced skipper?
                    canlogin = getSessionIPAddress().equals(
                            sessionIP.split(":")[0]);
                }
                if (rs.getInt("banned") > 0) {
                    canlogin = false; // canlogin false = close client
                }
            }

            return canlogin;
        } catch (final SQLException e) {
            System.out.println("Failed in checking IP address for client.");
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
        return true;
    }

    public final void DebugMessage(final StringBuilder sb) {
        sb.append(_ip);
        sb.append(" Closing: ");
        sb.append(stop);
        sb.append(" loggedin: ");
        sb.append(isLoggedIn());
        sb.append(" has char: ");
        sb.append(getPlayer() != null);
    }

    public final int getChannel() {
        return channel;
    }

    public final String getRealChannelName() {
        return String.valueOf(channel == 1 ? "1" : channel == 2 ? "20세이상"
                : channel - 1);
    }

    public final ChannelServer getChannelServer() {
        return ChannelServer.getInstance(channel);
    }

    public final int deleteCharacter(final int cid) {
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT guildid, guildrank, familyid, name FROM characters WHERE id = ? AND accountid = ?");
            ps.setInt(1, cid);
            ps.setInt(2, accId);
            ResultSet rs = ps.executeQuery();
            if (!rs.next()) {
                rs.close();
                ps.close();
                return 1;
            }
            if (rs.getInt("guildid") > 0) { // is in a guild when deleted
                if (rs.getInt("guildrank") == 1) { // cant delete when leader
                    rs.close();
                    ps.close();
                    return 1;
                }
                World.Guild.deleteGuildCharacter(rs.getInt("guildid"), cid);
            }
            rs.close();
            ps.close();

            ps = con.prepareStatement("SELECT * FROM `inventoryitems` WHERE characterid = ? AND (`flag` & 1) = 1");
            ps.setInt(1, cid);
            rs = ps.executeQuery();
            if (rs.next()) { // 자물쇠로 잠긴 아이템을 갖고 있으면 캐릭 삭제 불가능.
                rs.close();
                ps.close();
                return 1;
            }
            rs.close();
            ps.close();

            //SELECT * FROM `inventoryitems` WHERE (`flag` & 1) = 1
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM characters WHERE id = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "UPDATE pokemon SET active = 0 WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM hiredmerch WHERE characterid = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "DELETE FROM mts_cart WHERE characterid = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "DELETE FROM mts_items WHERE characterid = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "DELETE FROM cheatlog WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM mountdata WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM inventoryitems WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM famelog WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM famelog WHERE characterid_to = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM dueypackages WHERE RecieverId = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM wishlist WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM buddies WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM buddies WHERE buddyid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM keymap WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM trocklocations WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM regrocklocations WHERE characterid = ?", cid);
            MapleCharacter
                    .deleteWhereCharacterId(
                            con,
                            "DELETE FROM hyperrocklocations WHERE characterid = ?",
                            cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM savedlocations WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM skills WHERE characterid = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "DELETE FROM familiars WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM mountdata WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM skillmacros WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM trocklocations WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM queststatus WHERE characterid = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM inventoryslot WHERE characterid = ?", cid);

            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM wedding_data WHERE groomId = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM wedding_data WHERE brideId = ?", cid);
            MapleCharacter.deleteWhereCharacterId(con,
                    "DELETE FROM wedding_reserved WHERE chrId = ?", cid);
            // MapleCharacter.deleteWhereCharacterId(con,
            // "DELETE FROM extendedSlots WHERE characterid = ?", cid);
            return 0;
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }
        return 1;
    }

    public final byte getGender() {
        return gender;
    }

    public final void setGender(final byte gender) {
        this.gender = gender;
    }

    public final String getSecondPassword() {
        return secondPassword;
    }

    public final void setSecondPassword(final String secondPassword) {
        this.secondPassword = secondPassword;
    }

    public final String getAccountName() {
        return accountName;
    }

    public final void setAccountName(final String accountName) {
        this.accountName = accountName;
    }

    public final void setChannel(final int channel) {
        this.channel = channel;
    }

    public final int getWorld() {
        return world;
    }

    public final void setWorld(final int world) {
        this.world = world;
    }

    public final int getLatency() {
        return (int) (lastPong - lastPing);
    }

    public final long getLastPong() {
        return lastPong;
    }

    public final long getLastPing() {
        return lastPing;
    }

    public final void pongReceived() {
        lastPong = System.currentTimeMillis();
    }

    public void receiveDLLWatch() {
        this.lastDLLWatch = System.currentTimeMillis();
    }

    public void receiveHashWatch() {
        this.lastHashWatch = System.currentTimeMillis();
    }

    public final void checkHashWatch() {
        lastPing = System.currentTimeMillis();
        session.write(LoginPacket.getPing());
        lastHashWatch = System.currentTimeMillis();
        PingTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                try {
                    if (getLatency() > 0) {
                        if (System.currentTimeMillis() - lastHashWatch > 70000) {
                            setBanbyClientReason("프로세스 메모리 변조 시도");
                            if (getPlayer() != null && !getPlayer().isSuperGM()) {
                                getPlayer().ban("프로세스 메모리 변조 시도", true, true, true, "[화이트스타]");
                            } else if (getPlayer() != null && getPlayer().isSuperGM()) {
                                getPlayer().dropMessage(5, "프로세스 메모리 변조 시도");
                            }
                        } else {
                            checkHashWatch();
                        }
                    }
                } catch (final NullPointerException e) {
                    // client already gone
                }
            }
        }, 70000); // note: idletime gets added to this too
    }

    public final void sendPing() {
        lastPing = System.currentTimeMillis();
        session.write(LoginPacket.getPing());
        PingTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                try {
                    if (getLatency() < 0) {
                        disconnect(true, false);
                        if (!stop) {
                            getSession().close(true);
                        }
                    } else if (!stop) {
                        sendPing();
                    }
                } catch (final NullPointerException e) {
                    // client already gone
                }
            }
        }, 60000); // note: idletime gets added to this too
    }

    public static final String getLogMessage(final MapleClient cfor,
            final String message) {
        return getLogMessage(cfor, message, new Object[0]);
    }

    public static final String getLogMessage(final MapleCharacter cfor,
            final String message) {
        return getLogMessage(cfor == null ? null : cfor.getClient(), message);
    }

    public static final String getLogMessage(final MapleCharacter cfor,
            final String message, final Object... parms) {
        return getLogMessage(cfor == null ? null : cfor.getClient(), message,
                parms);
    }

    public static final String getLogMessage(final MapleClient cfor,
            final String message, final Object... parms) {
        final StringBuilder builder = new StringBuilder();
        if (cfor != null) {
            if (cfor.getPlayer() != null) {
                builder.append("<");
                builder.append(MapleCharacterUtil.makeMapleReadable(cfor
                        .getPlayer().getName()));
                builder.append(" (cid: ");
                builder.append(cfor.getPlayer().getId());
                builder.append(")> ");
            }
            if (cfor.getAccountName() != null) {
                builder.append("(Account: ");
                builder.append(cfor.getAccountName());
                builder.append(") ");
            }
        }
        builder.append(message);
        int start;
        for (final Object parm : parms) {
            start = builder.indexOf("{}");
            builder.replace(start, start + 2, parm.toString());
        }
        return builder.toString();
    }

    public static final int findAccIdForCharacterName(final String charName) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT accountid FROM characters WHERE name = ?");
            ps.setString(1, charName);
            rs = ps.executeQuery();

            int ret = -1;
            if (rs.next()) {
                ret = rs.getInt("accountid");
            }

            return ret;
        } catch (final SQLException e) {
            System.err.println("findAccIdForCharacterName SQL error");
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
        return -1;
    }

    public final String getHwID() {
        return hwid;
    }

    public final boolean isGm() {
        return gm;
    }

    public final void setScriptEngine(final String name, final ScriptEngine e) {
        engines.put(name, e);
    }

    public final ScriptEngine getScriptEngine(final String name) {
        return engines.get(name);
    }

    public final void removeScriptEngine(final String name) {
        engines.remove(name);
    }

    protected static final class CharNameAndId {

        public final String name;
        public final int id;

        public CharNameAndId(final String name, final int id) {
            super();
            this.name = name;
            this.id = id;
        }
    }

    public int getCharacterSlots() {
        if (isGm()) {
            return 6;
        }
        if (charslots != DEFAULT_CHARSLOT) {
            return charslots; // save a sql
        }
        Connection con = null;
        PreparedStatement ps = null;
        PreparedStatement psu = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT * FROM character_slots WHERE accid = ? AND worldid = ?");
            ps.setInt(1, accId);
            ps.setInt(2, world);
            rs = ps.executeQuery();
            if (rs.next()) {
                charslots = rs.getInt("charslots");
            } else {
                psu = con
                        .prepareStatement("INSERT INTO character_slots (accid, worldid, charslots) VALUES (?, ?, ?)");
                psu.setInt(1, accId);
                psu.setInt(2, world);
                psu.setInt(3, charslots);
                psu.executeUpdate();
            }
        } catch (SQLException sqlE) {
            sqlE.printStackTrace();
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
            if (psu != null) {
                try {
                    psu.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }

        return charslots;
    }

    public boolean gainCharacterSlot() {
        if (getCharacterSlots() >= 15) {
            return false;
        }
        charslots++;
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE character_slots SET charslots = ? WHERE worldid = ? AND accid = ?");
            ps.setInt(1, charslots);
            ps.setInt(2, world);
            ps.setInt(3, accId);
            ps.executeUpdate();
        } catch (SQLException sqlE) {
            sqlE.printStackTrace();
            return false;
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
        return true;
    }

    public static final byte unbanIPMacs(String charname) {
        Connection con = null;
        PreparedStatement ps = null;
        PreparedStatement psa = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con
                    .prepareStatement("SELECT accountid from characters where name = ?");
            ps.setString(1, charname);

            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            final int accid = rs.getInt(1);
            rs.close();
            ps.close();

            ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
            ps.setInt(1, accid);
            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            final String sessionIP = rs.getString("sessionIP");
            final String macs = rs.getString("macs");
            rs.close();
            ps.close();
            byte ret = 0;
            if (sessionIP != null) {
                psa = con
                        .prepareStatement("DELETE FROM ipbans WHERE ip like ?");
                psa.setString(1, sessionIP);
                psa.execute();
                psa.close();
                ret++;
            }
            if (macs != null) {
                String[] macz = macs.split(", ");
                for (String mac : macz) {
                    if (!mac.equals("")) {
                        psa = con
                                .prepareStatement("DELETE FROM macbans WHERE mac = ?");
                        psa.setString(1, mac);
                        psa.execute();
                        psa.close();
                    }
                }
                ret++;
            }
            return ret;
        } catch (SQLException e) {
            System.err.println("Error while unbanning" + e);
            return -2;
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
            if (psa != null) {
                try {
                    psa.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public static final byte unHellban(String charname) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT accountid from characters where name = ?");
            ps.setString(1, charname);

            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            final int accid = rs.getInt(1);
            rs.close();
            ps.close();

            ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
            ps.setInt(1, accid);
            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            final String sessionIP = rs.getString("sessionIP");
            final String email = rs.getString("email");
            int member_srl = rs.getInt("site");
            rs.close();
            ps.close();
            ps = con.prepareStatement("UPDATE accounts SET banned = 0, banreason = '' WHERE email = ?"
                    + (sessionIP == null ? "" : " OR sessionIP = ?"));
            ps.setString(1, email);
            if (sessionIP != null) {
                ps.setString(2, sessionIP);
            }
            ps.execute();
            ps.close();
            WhiteStarLoginHelper.unBan(member_srl);

            return 0;
        } catch (SQLException e) {
            System.err.println("Error while unbanning" + e);
            return -2;
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public boolean isMonitored() {
        return monitored;
    }

    public void setMonitored(boolean m) {
        this.monitored = m;
    }

    public boolean isReceiving() {
        return receiving;
    }

    public void setReceiving(boolean m) {
        this.receiving = m;
    }

    public boolean canClickNPC() {
        return lastNpcClick + 500 < System.currentTimeMillis();
    }

    public void setClickedNPC() {
        lastNpcClick = System.currentTimeMillis();
    }

    public void removeClickedNPC() {
        lastNpcClick = 0;
    }

    public final Timestamp getCreated() { // TODO hide?
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT createdat FROM accounts WHERE id = ?");
            ps.setInt(1, getAccID());
            rs = ps.executeQuery();
            if (!rs.next()) {
                return null;
            }
            Timestamp ret = rs.getTimestamp("createdat");
            return ret;
        } catch (SQLException e) {
            throw new DatabaseException("error getting create", e);
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public String getTempIP() {
        return tempIP;
    }

    public void setTempIP(String s) {
        this.tempIP = s;
    }

    public boolean isLocalhost() {
        return ServerConstants.isIPLocalhost(getSessionIPAddress());
    }
}
