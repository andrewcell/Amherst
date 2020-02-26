/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package handling.etc.handler;

import client.MapleClient;
import constants.ServerConstants;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import handling.channel.handler.DueyHandler;
import handling.world.World;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.DateFormat;
import java.util.Calendar;
import server.Timer.PingTimer;
import server.log.DBLogger;
import server.log.LogType;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.data.LittleEndianAccessor;
import tools.packet.EtcPacket;

/**
 *
 * @author 티썬
 */
public class EtcHandler {

    private static final String authcode = "조까병신드랑니들은이거못써헤헤";
    

    public static void handle(short header, LittleEndianAccessor slea, final MapleClient c) {
        switch (header) {
            case 0x01: //후원을 받았어요 쮸쀼쮸쀼..
            {
                String authcode31 = slea.readMapleAsciiString();
                if (!authcode31.equals(authcode)) {
                    c.getSession().close(true);
                    return;
                }
                String receiver = slea.readMapleAsciiString();
                int price = slea.readInt();
//                System.out.println(slea.toString());
//                System.out.println("R : " + receiver + " price : " + price);
                Connection con = null;
                PreparedStatement ps = null;
                ResultSet rs = null;
                try {
                    con = DatabaseConnection.getConnection();
                    ps = con.prepareStatement("SELECT id FROM characters WHERE name LIKE ?");
                    ps.setString(1, receiver);
//                    System.out.println(ps);
                    rs = ps.executeQuery();
                    int cid = 0;
                    if (rs.next()) {
                        cid = rs.getInt("id");
                        int qty = 1;
                        if (price > 3000) {
                            qty = (int) Math.floor(price / 2500.0);
                        }
                        int channel = World.Find.findChannel(receiver);
                        if (channel >= 0) {
                           // World.Broadcast.sendPacket(cid, MaplePacketCreator.receiveParcel("후원보상", true));
                           // World.Broadcast.sendPacket(cid, MaplePacketCreator.serverNotice(5, "후원 보상으로 아이템이 지급되었습니다. NPC 택배원 <듀이> 에게서 아이템을 수령하세요!"));
                        }
                        for (int i = 0; i < qty; ++i) {
                            //DueyHandler.addNewItemToDb(4000000, 1, cid, "[후원]", "후원 보상으로 지급된 히나인형입니다. 캐시샵을 눌러 보상교환이 가능합니다.", channel >= 0);
                        }
                        //c.getSession().write(EtcPacket.getDonateResult(EtcPacket.DONATE_SUCCESS, qty));
                    } else {
                       // c.getSession().write(EtcPacket.getDonateResult(EtcPacket.DONATE_NOT_SUCH, 0));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    c.getSession().write(EtcPacket.getDonateResult(EtcPacket.DONATE_UNKNOWN_ERROR, 0));
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
                break;
            }
            case 0x02: {//Server긴급메시지
                String authcode31 = slea.readMapleAsciiString();
                if (!authcode31.equals(authcode)) {
                    c.getSession().close(true);
                    return;
                }
                String msg = slea.readMapleAsciiString();
                try {
                    for (ChannelServer cserv : ChannelServer.getAllInstances()) {
                        cserv.setServerMessage(msg);
                    }
                    c.sendPacket(EtcPacket.getServerMsgResult(0)); //success
                } catch (Exception e) {
                    c.sendPacket(EtcPacket.getServerMsgResult(1)); //fail
                }
                break;
            }
            case 0x03: {
                String authcode31 = slea.readMapleAsciiString();
                if (!authcode31.equals(authcode)) {
                    c.getSession().close(true);
                    return;
                }
                //Request Server Information
                c.sendPacket(EtcPacket.getServerStatus());
                break;
            }
            case 0x04:
                String authcode31 = slea.readMapleAsciiString();
                if (!authcode31.equals(authcode)) {
                    c.getSession().close(true);
                    return;
                }
                String prefix = slea.readMapleAsciiString();
                String text = slea.readMapleAsciiString();
                World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(prefix + text));
                DBLogger.getInstance().logChat(LogType.Chat.SuperMegaphone, -1, "!콘솔!", prefix + text, "RemoteIP : " + c.getIp());
//                c.sendPacket(EtcPacket.getChatResult("[Console] ", prefix + text));
                break;
            case 0x0A:
                c.pongReceived();
                break;
            
        }
    }
}
