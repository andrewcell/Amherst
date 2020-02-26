/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import provider.MapleData;
import provider.MapleDataDirectoryEntry;
import provider.MapleDataEntry;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import provider.MapleDataType;

/**
 *
 * @author
 */
public class MapleStringCopier {

    private static final MapleDataProvider StringRoot_12182 = MapleDataProviderFactory.getDataProvider(new File("wz1/String.wz"));
    private static final MapleDataProvider StringRoot_1241 = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz"));
    private static final MapleData StringItem_1241 = StringRoot_1241.getData("Item.img");
    private static final MapleData StringEqp_12182 = StringRoot_12182.getData("Eqp.img");
    private static final Map<Integer, String> item_string_1241 = new LinkedHashMap<Integer, String>();
    private static final Map<Integer, String> item_string_12182 = new LinkedHashMap<Integer, String>();

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        System.out.println("Caching 1.2.41 Strings...");
        {
            for (MapleData d1 : StringItem_1241.getChildByPath("Eqp")) {
                if (d1.getType() == MapleDataType.PROPERTY) {
                    for (MapleData d2 : d1.getChildren()) {
                        item_string_1241.put(Integer.parseInt(d2.getName()), MapleDataTool.getString("name", d2, ""));
                    }
                } else {
                    item_string_1241.put(Integer.parseInt(d1.getName()), MapleDataTool.getString("name", d1, ""));
                }
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms");

        System.out.println("Caching 1.2.182 Strings...");
        start = System.currentTimeMillis();
        {
            for (MapleData d1 : StringEqp_12182.getChildByPath("Eqp")) {
                if (d1.getType() == MapleDataType.PROPERTY) {
                    for (MapleData d2 : d1.getChildren()) {
                        item_string_12182.put(Integer.parseInt(d2.getName()), MapleDataTool.getString("name", d2, ""));
                    }
                } else {
                    item_string_12182.put(Integer.parseInt(d1.getName()), MapleDataTool.getString("name", d1, ""));
                }
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms");

        System.out.println("Job started.");

        MapleDataProvider pro1 = MapleDataProviderFactory.getDataProvider(new File("wz/Sorted_Char.wz"));
        for (MapleDataDirectoryEntry mdde : pro1.getRoot().getSubdirectories()) {
            System.out.println();
            System.out.println(" -- " + mdde.getName() + " --");
            System.out.println();
            boolean hairface = mdde.getName().equalsIgnoreCase("face") || mdde.getName().equalsIgnoreCase("hair");
            for (MapleDataEntry mde : mdde.getFiles()) {
                System.out.println("            <imgdir name=\"" + mde.getName().substring(hairface ? 3 : 1, 8) + "\">");
                System.out.println("                <string name=\"name\" value=\""+item_string_12182.get(Integer.parseInt(mde.getName().substring(0, 8))) +"\"/>");
                System.out.println("            </imgdir>");
            }
        }
    }
}
