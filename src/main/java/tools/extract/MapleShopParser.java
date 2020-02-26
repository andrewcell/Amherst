/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import database.DatabaseConnection;
import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import server.MapleItemInformationProvider;
import server.ServerProperties;
import server.life.MapleLifeFactory;

/**
 *
 * @author
 */
public class MapleShopParser {

    public static void main(String[] args) throws Exception {
        File fr = new File("imgs");
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(fr);
        Connection con = DatabaseConnection.getConnection();
        PreparedStatement del1 = con.prepareStatement("DELETE FROM shops");
        PreparedStatement del2 = con.prepareStatement("DELETE FROM shopitems");
        PreparedStatement del3 = con.prepareStatement("ALTER TABLE  `shops` AUTO_INCREMENT =1");
        //
        del1.executeUpdate();
        del2.executeUpdate();
        del3.executeUpdate();
        del1.close();
        del2.close();
        del3.close();
        int shopid = 1;
        PreparedStatement ps1 = con.prepareStatement("INSERT INTO shops (`npcid`) VALUES (?)");
        PreparedStatement ps2 = con.prepareStatement("INSERT INTO shopitems (shopid, itemid, price, position) VALUES (?, ?, ?, ?)");

        System.setProperty("wz_path", ServerProperties.wzPath);
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        ii.runItems();
        ii.runEtc();
        MapleLifeFactory.loadQuestCounts();

        for (MapleData dd : pro.getData("NpcShop.img")) {
            int npcid = Integer.parseInt(dd.getName());
            try {
                if (MapleLifeFactory.getNPC(npcid) == null) {
                    System.out.println(npcid + " does not exists NPC.. continue.");
                    continue;
                }
            } catch (Exception e) {
                System.out.println(npcid + " does not exists NPC.. continue.");
                continue;
            }
            try {
                ps1.setInt(1, npcid);
                for (MapleData sp : dd.getChildren()) {
                    int i = Integer.parseInt(sp.getName());
                    int item = MapleDataTool.getInt("item", sp);
                    if (item / 10000 == 207 && item != 2070000) {
                        continue;
                    }
                    if (!ii.itemExists(item)) {
                        System.err.println(item + " Item does not exists.. continue.");
                        continue;
                    }
                    int price = MapleDataTool.getInt("price", sp, -1);
                    if (price == -1) {
                        continue;
                    }
                    ps2.setInt(1, shopid);
                    ps2.setInt(2, item);
                    ps2.setInt(3, price);
                    ps2.setInt(4, i);
                    ps2.addBatch();
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Shopid : " + npcid);
                return;
            }
            ps1.addBatch();
            shopid++;
        }
        ps1.executeBatch();
        ps2.executeBatch();
        ps1.close();
        ps2.close();

    }
}
