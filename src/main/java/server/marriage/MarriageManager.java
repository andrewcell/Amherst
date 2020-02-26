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
package server.marriage;

import client.MapleCharacter;
import client.inventory.Item;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import handling.channel.handler.DueyHandler;
import handling.world.World;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 *
 * @author Eternal
 */
public class MarriageManager {

    private static MarriageManager instance = null;
    private AtomicInteger runningId;
    private final Map<Integer, MarriageDataEntry> marriages;
    private final List<Integer> toDeleteIds;
    private final Map<Integer, MarriageEventAgent> eventagents;

    private MarriageManager() {
        marriages = new HashMap<Integer, MarriageDataEntry>();
        toDeleteIds = new ArrayList<Integer>();
        eventagents = new HashMap<Integer, MarriageEventAgent>();
        loadAll();
    }

    public static MarriageManager getInstance() {
        if (instance == null) {
            instance = new MarriageManager();
        }
        return instance;
    }

    private void loadAll() {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            runningId = new AtomicInteger(0);
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM `wedding_data`");
            rs = ps.executeQuery();
            while (rs.next()) {
                if (rs.getInt("id") > runningId.get()) {
                    runningId.set(rs.getInt("id"));
                }
                MarriageDataEntry data = new MarriageDataEntry(rs.getInt("id"), false);
                data.setGroomId(rs.getInt("groomId"));
                data.setBrideId(rs.getInt("brideId"));
                data.setGroomName(rs.getString("groomName"));
                data.setBrideName(rs.getString("brideName"));
                data.setStatus(rs.getInt("status"));
                data.setWeddingStatus(rs.getInt("weddingStatus"));
                data.setTicketType(MarriageTicketType.getTypeById(rs.getInt("ticketType")));
                data.setEngagementTime(rs.getLong("EngagementTime"));
                data.setMakeReservationTime(rs.getLong("MakeReservationTime"));
                data.setDivorceTimeGroom(rs.getLong("RequestDivorceTimeGroom"));
                data.setDivorceTimeBride(rs.getLong("RequestDivorceTimeBride"));
                PreparedStatement ps2 = null;
                ResultSet rs2 = null;
                try {
                    ps2 = con.prepareStatement("SELECT * FROM `wedding_wishlists` WHERE marriageid = ?");
                    ps2.setInt(1, data.getMarriageId());
                    rs2 = ps2.executeQuery();
                    while (rs2.next()) {
                        if (rs2.getInt("gender") == 0) {
                            data.getGroomWishList().add(rs2.getString("string"));
                        } else {
                            data.getBrideWishList().add(rs2.getString("string"));
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace(System.err);
                } finally {
                    if (rs2 != null) {
                        try {
                            rs2.close();
                        } catch (Exception ig) {
                        }
                    }
                    if (ps2 != null) {
                        try {
                            ps2.close();
                        } catch (Exception ig) {
                        }
                    }
                }
                try {
                    ps2 = con.prepareStatement("SELECT * FROM `wedding_reserved` WHERE marriageid = ?");
                    ps2.setInt(1, data.getMarriageId());
                    rs2 = ps2.executeQuery();
                    while (rs2.next()) {
                        data.getReservedPeopleList().add(rs2.getInt("chrid"));
                    }
                } catch (Exception e) {
                    e.printStackTrace(System.err);
                } finally {
                    if (rs2 != null) {
                        try {
                            rs2.close();
                        } catch (Exception ig) {
                        }
                    }
                    if (ps2 != null) {
                        try {
                            ps2.close();
                        } catch (Exception ig) {
                        }
                    }
                }
                marriages.put(rs.getInt("id"), data);
            }
        } catch (Exception e) {
            e.printStackTrace(System.err);
        } finally {
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
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public void saveAll() {
        System.out.println("Saving Marriage Informations... ");
        Connection con = null;
        PreparedStatement ps = null;
        String query = null;
        String query2 = null;
        String query3 = null;
        if (!toDeleteIds.isEmpty()) {
            try {
                con = DatabaseConnection.getConnection();
                query = "DELETE FROM `wedding_data` WHERE ";
                query2 = "DELETE FROM `wedding_reserved` WHERE ";
                query3 = "DELETE FROM `wedding_wishlists` WHERE ";
                Iterator<Integer> ids = toDeleteIds.iterator();
                while (ids.hasNext()) {
                    Integer id = ids.next();
                    query += "`id` = '" + id + "'";
                    query2 += "`marriageid` = '" + id + "'";
                    query3 += "`marriageid` = '" + id + "'";
                    if (ids.hasNext()) {
                        query += " OR ";
                        query2 += " OR ";
                        query3 += " OR ";
                    }
                }
                ps = con.prepareStatement(query);
                ps = con.prepareStatement(query2);
                ps = con.prepareStatement(query3);
                ps.executeUpdate();
                ps.close();

            } catch (Exception e) {
                e.printStackTrace(System.err);
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
        for (MarriageDataEntry data : marriages.values()) {
            if (data.isNewData()) {
                query = "INSERT INTO `wedding_data` (`groomId`, `brideId`, `groomName`, `brideName`, `status`, `weddingStatus`, `ticketType`, `EngagementTime`, `MakeReservationTime`, `RequestDivorceTimeGroom`, `RequestDivorceTimeBride`, `id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            } else {
                query = "UPDATE `wedding_data` SET `groomId` = ?, `brideId` = ?, `groomName` = ?, `brideName` = ?, `status` = ?, `weddingStatus` = ?, `ticketType` = ?, `EngagementTime` = ?, `MakeReservationTime` = ?, `RequestDivorceTimeGroom` = ?, `RequestDivorceTimeBride` = ? WHERE `id` = ?";
            }
            try {
                con = DatabaseConnection.getConnection();
                ps = con.prepareStatement(query);
                ps.setInt(1, data.getGroomId());
                ps.setInt(2, data.getBrideId());
                ps.setString(3, data.getGroomName());
                ps.setString(4, data.getBrideName());
                ps.setInt(5, data.getStatus());
                ps.setInt(6, data.getWeddingStatus());
                ps.setInt(7, (data.getTicketType() == null) ? 0 : data.getTicketType().getItemId());
                ps.setLong(8, data.getEngagementTime());
                ps.setLong(9, data.getMakeReservationTime());
                ps.setLong(10, data.getDivorceTimeGroom());
                ps.setLong(11, data.getDivorceTimeBride());
                ps.setInt(12, data.getMarriageId());
                ps.executeUpdate();
                ps.close();
                data.setNewData(false);
                ps = con.prepareStatement("DELETE FROM `wedding_wishlists` WHERE `marriageid` = ?");
                ps.setInt(1, data.getMarriageId());
                ps.executeUpdate();
                ps.close();
                ps = con.prepareStatement("INSERT INTO `wedding_wishlists` (marriageid, gender, string) VALUES (?, ?, ?)");
                ps.setInt(1, data.getMarriageId());
                for (String str : data.getGroomWishList()) {
                    ps.setInt(2, 0);
                    ps.setString(3, str);
                    ps.addBatch();
                }
                for (String str : data.getBrideWishList()) {
                    ps.setInt(2, 1);
                    ps.setString(3, str);
                    ps.addBatch();
                }
                ps.executeBatch();
                ps = con.prepareStatement("DELETE FROM `wedding_reserved` WHERE `marriageid` = ?");
                ps.setInt(1, data.getMarriageId());
                ps.executeUpdate();
                ps.close();
                ps = con.prepareStatement("INSERT INTO `wedding_reserved` (marriageid, chrid) VALUES (?, ?)");
                ps.setInt(1, data.getMarriageId());
                for (Integer i : data.getReservedPeopleList()) {
                    ps.setInt(2, i);
                    ps.addBatch();
                }
                ps.executeBatch();
                ps.close();
                saveWeddingPresent(data.getGroomPresentList(), data.getGroomId());
                saveWeddingPresent(data.getBridePresentList(), data.getBrideId());
            } catch (Exception e) {
                e.printStackTrace(System.err);
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

    public MarriageDataEntry makeNewMarriage(int groomId) {
        MarriageDataEntry data = new MarriageDataEntry(runningId.incrementAndGet(), true);
        marriages.put(data.getMarriageId(), data);
        return data;
    }

    public MarriageDataEntry getMarriage(int id) {
        return marriages.get(id);
    }

    public void deleteMarriage(int id) {
        MarriageDataEntry entry = marriages.remove(id);
        if (entry.getStatus() == 2) { // 결혼상태. 이혼임.
            processDivorce(entry.getBrideId());
            processDivorce(entry.getGroomId());
        }
        toDeleteIds.add(id);
    }

    private static void processDivorce(int cid) {
        int chan = World.Find.findChannel(cid);
        if (chan >= 0) {
            MapleCharacter chr = ChannelServer.getInstance(chan).getPlayerStorage().getCharacterById(cid);
            if (chr != null) {
                for (int i = 1112300; i <= 1112311; ++i) {
                    chr.removeAllEquip(i, true);
                }
                for (int i = 4210000; i <= 4210011; ++i) {
                    chr.removeAll(i, true);
                }
                chr.setMarriageId(0);
                chr.dropMessage(1, "이혼이 성립되었습니다.");
            }
        }
    }

    public MarriageEventAgent getEventAgent(int channel) {
        if (!eventagents.containsKey(channel)) {
            eventagents.put(channel, new MarriageEventAgent(channel));
        }
        return eventagents.get(channel);
    }

    private void saveWeddingPresent(List<Item> toSaveList, int cid) {
        if (!toSaveList.isEmpty()) {
            for (Item item : toSaveList) {
                DueyHandler.addItemToDB(item, 0, "안젤리크", cid, false, "미처 받지 못하신 결혼 선물을 택배로 보내드립니다.", 0, true);
            }
        }
    }
}
