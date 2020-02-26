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
package handling.channel.handler;

import client.MapleCharacter;
import client.MapleCharacterUtil;
import client.MapleClient;
import client.inventory.Equip;
import client.inventory.Item;
import client.inventory.ItemFlag;
import client.inventory.ItemLoader;
import client.inventory.MapleInventoryType;
import constants.GameConstants;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import handling.world.World;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import server.MapleDueyActions;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.log.DBLogger;
import server.log.LogType;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.data.LittleEndianAccessor;

public class DueyHandler {

    /*
     * 19 = Successful
     * 18 = One-of-a-kind Item is already in Reciever's delivery
     * 17 = The Character is unable to recieve the parcel
     * 15 = Same account
     * 14 = Name does not exist
     */
    public static final void DueyOperation(final LittleEndianAccessor slea, final MapleClient c) {

        final byte operation = slea.readByte();

        switch (operation) {
            case 1: { // Start Duey, 13 digit AS
                //final String AS13Digit = slea.readMapleAsciiString();
                //		int unk = slea.readInt(); // Theres an int here, value = 1
                //  9 = error
                slea.skip(4);
                final int conv = c.getPlayer().getConversation();

                if (conv == 2) { // Duey
                    List<MapleDueyActions> list1 = new ArrayList<MapleDueyActions>();
                    List<MapleDueyActions> list2 = new ArrayList<MapleDueyActions>();
                    for (MapleDueyActions dp : loadItems(c.getPlayer().getId())) {
                        if (dp.isExpire()) {
                            list2.add(dp);
                        } else {
                            list1.add(dp);
                        }
                    }
                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 10, list1, list2));
                    for (MapleDueyActions dp : list2) {
                        removeItemFromDB(dp.getPackageId(), c.getPlayer().getId());
                    }
                }
                break;
            }
            case 3: { // Send Item
                if (c.getPlayer().getConversation() != 2) {
                    return;
                }
                final byte inventId = slea.readByte();
                final short itemPos = slea.readShort();
                short amount = slea.readShort();
                final int mesos = slea.readInt();
                final String recipient = slea.readMapleAsciiString();
                boolean quickdelivery = slea.readByte() > 0;
                String letter = "";
                int qq = 0;
                if (quickdelivery) {
                    if (!c.getPlayer().haveItem(5330000, 1) && !c.getPlayer().haveItem(5330001, 1)) {
                        return;
                    }
                    letter = slea.readMapleAsciiString();
                    qq = slea.readInt();
                }

                final int finalcost = mesos + GameConstants.getTaxAmount(mesos) + (quickdelivery ? 0 : 5000);

                if (mesos >= 0 && mesos <= 100000000 && c.getPlayer().getMeso() >= finalcost) {
                    final int accid = MapleCharacterUtil.getAccIdByName(recipient);
                    final int cid = MapleCharacterUtil.getIdByName(recipient);
                    if (accid != -1) {
                        if (accid != c.getAccID()) {


                            boolean recipientOn = false;
                            MapleClient rClient = null;
                            int channel = World.Find.findChannel(recipient);
                            if (channel > -1) {
                                recipientOn = true;
                                ChannelServer rcserv = ChannelServer.getInstance(channel);
                                rClient = rcserv.getPlayerStorage().getCharacterByName(recipient).getClient();
                            }



                            if (inventId > 0) {
                                final MapleInventoryType inv = MapleInventoryType.getByType(inventId);
                                final Item item = c.getPlayer().getInventory(inv).getItem((byte) itemPos);
                                if (item == null) {
                                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // Unsuccessfull
                                    return;
                                }
                                List<MapleDueyActions> dps = loadItems(cid);
                                for (MapleDueyActions mda : dps) {
                                    if (mda.getItem() != null) {
                                        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
                                        if (ii.isPickupRestricted(mda.getItem().getItemId()) && mda.getItem().getItemId() == item.getItemId()) {
                                            c.getSession().write(MaplePacketCreator.sendDuey((byte) 18, null, null)); // 고유아이템을 받는사람이 갖고있습니다.
                                            return;
                                        }
                                    }
                                }
                                final short flag = item.getFlag();
                                if (ItemFlag.UNTRADEABLE.check(flag) || ItemFlag.LOCK.check(flag)) {
                                    c.getSession().write(MaplePacketCreator.enableActions());
                                    return;
                                }
                                if (GameConstants.isThrowingStar(item.getItemId()) || GameConstants.isBullet(item.getItemId())) {
                                    if (item.getQuantity() == 0) {
                                        amount = 0;
                                    }
                                }
                                if (c.getPlayer().getItemQuantity(item.getItemId(), false) >= amount) {
                                    final MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
                                    if (!ii.isDropRestricted(item.getItemId()) && !ii.isAccountShared(item.getItemId())) {
                                        Item toSend = item.copy();
                                        if (!GameConstants.isThrowingStar(toSend.getItemId()) && !GameConstants.isBullet(toSend.getItemId())) {
                                            toSend.setQuantity(amount);
                                        }
                                        if (addItemToDB(toSend, mesos, c.getPlayer().getName(), cid, recipientOn, letter, qq, quickdelivery)) {
                                            if (GameConstants.isThrowingStar(toSend.getItemId()) || GameConstants.isBullet(toSend.getItemId())) {
                                                MapleInventoryManipulator.removeFromSlot(c, inv, (byte) itemPos, toSend.getQuantity(), true, false);
                                            } else {
                                                MapleInventoryManipulator.removeFromSlot(c, inv, (byte) itemPos, amount, true, false);
                                            }
                                            if (quickdelivery) {
                                                if (c.getPlayer().haveItem(5330001, 1)) {
                                                    MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5330001, 1, false, false);
                                                } else if (c.getPlayer().haveItem(5330000, 1)) {
                                                    MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5330000, 1, false, false);
                                                }
                                            }
                                            DBLogger.getInstance().logTrade(LogType.Trade.Duey, c.getPlayer().getId(), c.getPlayer().getName(), recipient, MapleItemInformationProvider.getInstance().getName(toSend.getItemId()) + " " + toSend.getQuantity() + "개 / 메소 : " + mesos, quickdelivery ? ("퀵배송 (메시지 : " + letter + ")") : "일반배송");

                                            c.getPlayer().gainMeso(-finalcost, false);
                                            c.getSession().write(MaplePacketCreator.sendDuey((byte) 19, null, null)); // Successfull
                                        } else {
                                            c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // Unsuccessful
                                        }
                                    } else {
                                        c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // Unsuccessfull
                                    }
                                } else {
                                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // Unsuccessfull
                                }
                            } else {
                                if (addMesoToDB(mesos, c.getPlayer().getName(), cid, recipientOn, letter, quickdelivery)) {
                                    c.getPlayer().gainMeso(-finalcost, false);
                                    DBLogger.getInstance().logTrade(LogType.Trade.Duey, c.getPlayer().getId(), c.getPlayer().getName(), recipient, "메소 : " + mesos, quickdelivery ? ("퀵배송 (메시지 : " + letter + ")") : "일반배송");
                                    if (quickdelivery) {
                                        if (c.getPlayer().haveItem(5330001, 1)) {
                                            MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5330001, 1, false, false);
                                        } else if (c.getPlayer().haveItem(5330000, 1)) {
                                            MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5330000, 1, false, false);
                                        }
                                    }
                                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 19, null, null)); // 성공적으로 발송하였습니다.
                                } else {
                                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // Unsuccessfull
                                }
                            }
                            if (recipientOn && rClient != null) {
                                if (quickdelivery) {
                                    rClient.getSession().write(MaplePacketCreator.receiveParcel(c.getPlayer().getName(), quickdelivery)); //택배물 도착1
                                }
                            }
                        } else {
                            c.getSession().write(MaplePacketCreator.sendDuey((byte) 15, null, null)); // 같은 계정의 캐릭터에게는 보낼 수 없습니다.
                        }
                    } else {
                        c.getSession().write(MaplePacketCreator.sendDuey((byte) 14, null, null)); // 받는 사람 이름을 다시 확인해주세요.
                    }
                } else {
                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 12, null, null)); // 택배 비용을 지불하기에 보유 메소가 부족합니다.
                }
                break;
            }
            case 5: { // Recieve Package
                if (c.getPlayer().getConversation() != 2) {
                    return;
                }
                final int packageid = slea.readInt();
                //System.out.println("Item attempted : " + packageid);
                final MapleDueyActions dp = loadSingleItem(packageid, c.getPlayer().getId());
                if (dp == null) {
                    return;
                }
                if (dp.isExpire() || !dp.canReceive()) { //packet edit;
                    return;
                }
                if (dp.getItem() != null && !MapleInventoryManipulator.checkSpace(c, dp.getItem().getItemId(), dp.getItem().getQuantity(), dp.getItem().getOwner())) {
                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 16, null, null)); // 받는 사람의 택배 보관함이 찼습니다.
                    return;
                } else if (dp.getMesos() < 0 || (dp.getMesos() + c.getPlayer().getMeso()) < 0) {
                    c.getSession().write(MaplePacketCreator.sendDuey((byte) 17, null, null)); // 택배를 받을 수 없는 캐릭터입니다.
                    return;
                }
                if (dp.getItem() != null) {
                    if (c.getPlayer().haveItem(dp.getItem().getItemId(), 1, true, true) && MapleItemInformationProvider.getInstance().isPickupRestricted(dp.getItem().getItemId())) {
                        c.getSession().write(MaplePacketCreator.sendDuey((byte) 18, null, null)); // 고유아이템이라 받을수 없어..
                        return;
                    }
                }
                removeItemFromDB(packageid, c.getPlayer().getId()); // Remove first
                //System.out.println("Item removed : " + packageid);
                if (dp.getItem() != null) {
                    MapleInventoryManipulator.addFromDrop(c, dp.getItem(), false);
                }
                if (dp.getMesos() != 0) {
                    c.getPlayer().gainMeso(dp.getMesos(), false);
                }
                c.getSession().write(MaplePacketCreator.removeItemFromDuey(false, packageid));
                break;
            }
            case 6: { // Remove package
                if (c.getPlayer().getConversation() != 2) {
                    return;
                }
                final int packageid = slea.readInt();
                removeItemFromDB(packageid, c.getPlayer().getId());
                c.getSession().write(MaplePacketCreator.removeItemFromDuey(true, packageid));
                break;
            }
            case 8: { // Close Duey
                c.getPlayer().setConversation(0);
                break;
            }
            default: {
                System.out.println("Unhandled Duey operation : " + slea.toString());
                break;
            }
        }

    }

    private static final boolean addMesoToDB(final int mesos, final String sName, final int recipientID, final boolean isOn, String content, boolean quick) {

        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO dueypackages (RecieverId, SenderName, Mesos, TimeStamp, Checked, Type, `Quick`, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            ps.setInt(1, recipientID);
            ps.setString(2, sName);
            ps.setInt(3, mesos);
            ps.setLong(4, System.currentTimeMillis());
            ps.setInt(5, isOn ? 0 : 1);
            ps.setInt(6, 3);
            ps.setInt(7, quick ? 1 : 0);
            ps.setString(8, content);

            ps.executeUpdate();
            ps.close();

            return true;
        } catch (SQLException se) {
            se.printStackTrace();
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

    public static boolean addNewItemToDb(int itemid, int quantity, int to, String from, String content, boolean ison) {
        Item item = null;
        if (itemid / 1000000 == 1) {
            item = MapleItemInformationProvider.getInstance().getEquipById(itemid);
        } else {
            item = new Item(itemid, (byte) 0, (short) quantity);
        }

        return addItemToDB(item, 0, from, to, ison, content, 1, true);
    }

    public static final boolean addItemToDB(final Item item, final int mesos, final String sName, final int recipientID, final boolean isOn, String content, int qq, boolean Quick) {

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO dueypackages (RecieverId, SenderName, Mesos, TimeStamp, Checked, Type, content, `Quick`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", DatabaseConnection.RETURN_GENERATED_KEYS);
            ps.setInt(1, recipientID);
            ps.setString(2, sName);
            ps.setInt(3, mesos);
            ps.setLong(4, System.currentTimeMillis());
            ps.setInt(5, isOn ? 0 : 1);

            ps.setInt(6, item.getType());
            ps.setString(7, content);
            ps.setInt(8, Quick ? 1 : 0);
            ps.executeUpdate();

            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                ItemLoader.DUEY.saveItems(Collections.singletonList(new Pair<Item, MapleInventoryType>(item, GameConstants.getInventoryType(item.getItemId()))), rs.getInt(1));
            }

            return true;
        } catch (SQLException se) {
            se.printStackTrace();
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public static final void checkReceivePackage(MapleCharacter chr) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT packageid, `Quick`, `TimeStamp`, `SenderName` FROM dueypackages WHERE RecieverId = ? AND Checked = 1 LIMIT 1");
            ps.setInt(1, chr.getId());
            rs = ps.executeQuery();
            boolean b = rs.next();
            if (b) {
                boolean quick = rs.getInt("Quick") == 1;
                long timestamp = rs.getLong("TimeStamp");
                String s = rs.getString("SenderName");
                if (rs.next() && !rs.getString("SenderName").startsWith("[") && !rs.getString("SenderName").endsWith("]")) {
                    chr.getClient().getSession().write(MaplePacketCreator.sendDuey((byte) 28, null, null));
                    reciveMsg(chr.getClient(), chr.getId());
                } else if (b) {
                    if (quick) {
                        chr.getClient().getSession().write(MaplePacketCreator.receiveParcel(s, true));
                        reciveMsg(chr.getClient(), chr.getId());
                    } else if (timestamp + 12 * 3600000L < System.currentTimeMillis()) {
                        chr.getClient().getSession().write(MaplePacketCreator.receiveParcel(s, false));
                        reciveMsg(chr.getClient(), chr.getId());
                    }
                }
            }
        } catch (SQLException se) {
            se.printStackTrace();
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

    public static final List<MapleDueyActions> loadItems(final int cid) {
        List<MapleDueyActions> packages = new LinkedList<MapleDueyActions>();
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM dueypackages WHERE RecieverId = ?");
            ps.setInt(1, cid);
            rs = ps.executeQuery();
            while (rs.next()) {
                MapleDueyActions dueypack = getItemByPID(rs.getInt("packageid"));
                dueypack.setSender(rs.getString("SenderName"));
                dueypack.setMesos(rs.getInt("Mesos"));
                dueypack.setSentTime(rs.getLong("TimeStamp"));
                dueypack.setContent(rs.getString("content"));
                dueypack.setQuick(rs.getInt("Quick") > 0);
                packages.add(dueypack);
            }
            return packages;
        } catch (SQLException se) {
            se.printStackTrace();
            return null;
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

    public static final MapleDueyActions loadSingleItem(final int packageid, final int charid) {
        List<MapleDueyActions> packages = new LinkedList<MapleDueyActions>();
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM dueypackages WHERE PackageId = ? and RecieverId = ?");
            ps.setInt(1, packageid);
            ps.setInt(2, charid);
            rs = ps.executeQuery();

            if (rs.next()) {
                MapleDueyActions dueypack = getItemByPID(packageid);
                dueypack.setSender(rs.getString("SenderName"));
                dueypack.setMesos(rs.getInt("Mesos"));
                dueypack.setSentTime(rs.getLong("TimeStamp"));
                dueypack.setContent(rs.getString("content"));
                dueypack.setQuick(rs.getInt("Quick") > 0);
                packages.add(dueypack);
                return dueypack;
            } else {
                return null;
            }
        } catch (SQLException se) {
//	    se.printStackTrace();
            return null;
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

    public static final void reciveMsg(final MapleClient c, final int recipientId) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE dueypackages SET Checked = 0 where RecieverId = ?");
            ps.setInt(1, recipientId);
            ps.executeUpdate();
            ps.close();
        } catch (SQLException se) {
            se.printStackTrace();
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

    private static final void removeItemFromDB(final int packageid, final int charid) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("DELETE FROM dueypackages WHERE PackageId = ? and RecieverId = ?");
            ps.setInt(1, packageid);
            ps.setInt(2, charid);
            ps.executeUpdate();
        } catch (SQLException se) {
            se.printStackTrace();
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

    private static final MapleDueyActions getItemByPID(final int packageid) {
        try {
            Map<Long, Pair<Item, MapleInventoryType>> iter = ItemLoader.DUEY.loadItems(false, packageid);
            if (iter != null && iter.size() > 0) {
                for (Pair<Item, MapleInventoryType> i : iter.values()) {
                    return new MapleDueyActions(packageid, i.getLeft());
                }
            }
        } catch (Exception se) {
            se.printStackTrace();
        }
        return new MapleDueyActions(packageid);
    }
}
