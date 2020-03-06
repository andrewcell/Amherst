/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.scripts;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import provider.MapleData;
import provider.MapleDataFileEntry;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;

/**
 *
 * @author
 */
public class PortalScriptExtractor {

    private static Map<String, List<Integer>> portals = new HashMap<String, List<Integer>>();

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        boolean MakeDefaultPortal = true;
        getPortalLocation();
        File f1 = new File("PortalList.txt");
        try {
            FileOutputStream fos1 = new FileOutputStream(f1, false);
            String str = "";
            for (Entry<String, List<Integer>> e : portals.entrySet()) {
                str += e.getKey();
                str += " - (";
                for (int i : e.getValue()) {
                    str += i + ", ";
                }
                str = str.substring(0, str.length() - 2);
                str += ") \r\n";
                if (MakeDefaultPortal) {
                    File np1 = new File("scripts/portal/" + e.getKey() + ".js");
                    FileOutputStream np2 = new FileOutputStream(np1, false);
                    String npStr1 = getString(e.getKey(), e.getValue());
                    np2.write(npStr1.getBytes("UTF-8"));
                    np2.close();
                }
            }
            fos1.write(str.getBytes(Charset.forName("UTF-8")));
            fos1.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Job Completed... time : " + (System.currentTimeMillis() - start) + "ms");

    }

    public static String getString(String name, List<Integer> maps) {
        String npStr1 = "/*\r\n"
                + "This file is part of the OdinMS Maple Story Server\r\n"
                + "Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> \r\n"
                + "Matthias Butz <matze@odinms.de>\r\n"
                + "Jan Christian Meyer <vimes@odinms.de>\r\n"
                + "This program is free software: you can redistribute it and/or modify\r\n"
                + "it under the terms of the GNU Affero General Public License version 3\r\n"
                + "as published by the Free Software Foundation. You may not use, modify\r\n"
                + "or distribute this program under any other version of the\r\n"
                + "GNU Affero General Public License.\r\n"
                + "\r\n"
                + "This program is distributed in the hope that it will be useful,\r\n"
                + "but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n"
                + "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n"
                + "GNU Affero General Public License for more details.\r\n"
                + "\r\n"
                + "You should have received a copy of the GNU Affero General Public License\r\n"
                + "along with this program.  If not, see <http://www.gnu.org/licenses/>.\r\n"
                + " */"
                + "\r\n"
                + "/*\r\n"
                + " * PortalName : " + name + "\r\n";

        for (Integer iz : maps) {
            npStr1 += " * Location : ";
            npStr1 += iz + " (" + NPCScriptExtractor.getMapName(iz) + ")\r\n";
        }

        npStr1 += " * \r\n"
                + " * @author T-Sun\r\n"
                + " *\r\n"
                + " */\r\n"
                + "\r\n"
                + "function enter(pi) {\r\n"
                + "    pi.playerMessage(5, \"아직 코딩되지 않은 포탈입니다.\");\r\n"
                + "}\r\n";
        return npStr1;
    }

    public static void getPortalLocation() {
        System.out.println("Caching Portal Locations...");
        for (int i = 0; i <= 9; ++i) {
            File ff = new File("wz/Map.wz/Map/Map" + i);
            if (ff.isDirectory()) {
                MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/Map.wz/Map/Map" + i));
                for (MapleDataFileEntry mdfe : pro.rootForNavigation.getFiles()) {
                    MapleData d1 = pro.getData(mdfe.getName());
                    MapleData lifed = d1.getChildByPath("portal");
                    if (lifed != null) {
                        for (MapleData d2 : lifed) {
                            MapleData scriptd = d2.getChildByPath("script");
                            if (scriptd != null) {
                                String script = MapleDataTool.getString(scriptd);
                                if (script == null || script.isEmpty()) {
                                    continue;
                                }
                                if (!portals.containsKey(script)) {
                                    portals.put(script, new LinkedList<Integer>());
                                }
                                int mapid = Integer.parseInt(mdfe.getName().substring(0, 9));
                                if (!portals.get(script).contains(mapid)) {
                                    portals.get(script).add(mapid);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
