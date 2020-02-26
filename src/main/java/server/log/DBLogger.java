/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server.log;

import constants.ServerConstants;
import database.DatabaseConnection;
import handling.etc.EtcServer;
import java.sql.Connection;
import java.sql.SQLException;
import tools.packet.EtcPacket;

/**
 *
 * @author
 */
public class DBLogger {

    private static final DBLogger instance = new DBLogger();
    private final LogCommiter com = new LogCommiter(10000);

    public static DBLogger getInstance() {
        return instance;
    }
    
    /** Use for Server Shutdown.
     * This method will save logs that have not yet been commited to db.
     * 
     */
    public void shutdown (){
        com.shutdown();
    }
    
    /** Use for Admin Command.
     * Save Logs To DB right now.
     * 
     */
    public void forceCommitLogToDB() {
        com.commitToDB();
    }
    
    public void clearLog(int chat, int item, int trade) {
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            con.prepareStatement("DELETE FROM `log_chat` WHERE `time` < DATE_SUB(now(), INTERVAL "+chat+" DAY)").executeUpdate();
            con.prepareStatement("DELETE FROM `log_item` WHERE `time` < DATE_SUB(now(), INTERVAL "+item+" DAY)").executeUpdate();
            con.prepareStatement("DELETE FROM `log_trade` WHERE `time` < DATE_SUB(now(), INTERVAL "+trade+" DAY)").executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                }
            }
        }
    }
    
    private String getTimeString(long time) {
        java.sql.Timestamp stamp = new java.sql.Timestamp(time);
        return stamp.toString();
    }
    
    private String escape(String input) {
        return input.replace("\\", "\\\\").replace("\'", "\\'").replace("\"", "\\\"");
    }

    public void logChat(LogType.Chat type, int cid, String charname, String message, String etc) {
        EtcServer.broadcast(EtcPacket.getChatResult("["+type.name()+"] "+charname + " : ", message + "("+etc+")"));
        if (!ServerConstants.logChat) {
            return;
        }
        com.addQuery(String.format("INSERT INTO `log_chat` (`type`, `cid`, `charname`, `message`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%s', '%s', '%s')", type.i, cid, escape(charname), escape(message), escape(etc), getTimeString(System.currentTimeMillis())));
    }

    public void logItem(LogType.Item type, int cid, String name, int itemid, int quantity, String itemname, int meso, String etc) {
        if (!ServerConstants.logItem) {
            return;
        }
        com.addQuery(String.format("INSERT INTO `log_item` (`type`, `cid`, `name`, `itemid`, `quantity`, `itemname`, `meso`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%d', '%d', '%s', '%d', '%s', '%s')", type.i, cid, escape(name), itemid, quantity, escape(itemname), meso, escape(etc), getTimeString(System.currentTimeMillis())));
    }

    public void logTrade(LogType.Trade type, int cid, String name, String partnername, String item, String etc) {
        if (!ServerConstants.logTrade) {
            return;
        }
        if (name.equals(partnername)) {
            return;
        }
        com.addQuery(String.format("INSERT INTO `log_trade` (`type`, `cid`, `name`, `partnername`, `item`, `etc`, `time`) VALUES ('%d', '%d', '%s', '%s', '%s', '%s', '%s')", type.i, cid, escape(name), escape(partnername), escape(item), escape(etc), getTimeString(System.currentTimeMillis())));
    }
}
