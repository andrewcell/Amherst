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
import provider.MapleData;
import provider.MapleDataFileEntry;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;

/**
 *
 * @author 티썬
 */
public class ReactorScriptExtractor {

    public static void main(String[] args) {
        try {

            boolean MakeDefaultReactors = true;
            long start = System.currentTimeMillis();
            getReactorLocation();
            cacheReactorData();
            File f1 = new File("ReactorList.txt");
            FileOutputStream fos1 = new FileOutputStream(f1, false);
            for (ReactorDataInfo rdi : reactors) {
                if (rdi.action != null && rdi.maps != null) {
                    String str = "";
                    str += rdi.id;
                    str += " : action = " + rdi.action + " (info : " + rdi.info.replace("&lt;", "<") + ")";
                    str += " - (";
                    for (int i : rdi.maps) {
                        str += i + ", ";
                    }
                    str = str.substring(0, str.length() - 2);
                    str += ") \r\n";
                    if (MakeDefaultReactors) {
                        File np1 = new File("scripts/reactor/" + rdi.id + ".js");
                        FileOutputStream np2 = new FileOutputStream(np1, false);
                        String npStr1 = getString(rdi.action, rdi.info, rdi.maps);
                        np2.write(npStr1.getBytes("UTF-8"));
                        np2.close();
                    }

                    fos1.write(str.getBytes(Charset.forName("UTF-8")));

                }
            }
            fos1.close();
            System.out.println("Job Done.. Time : " + (System.currentTimeMillis() - start) + "ms");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    private static final List<ReactorDataInfo> reactors = new ArrayList<ReactorDataInfo>();

    private static void cacheReactorData() throws NumberFormatException {
        System.out.println("Caching Reactors...");
        File root = new File("wz/Reactor.wz");
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(root);
        for (MapleDataFileEntry mdfe : pro.getRoot().getFiles()) {
            MapleData d = pro.getData(mdfe.getName());
            ReactorDataInfo rdi = new ReactorDataInfo();
            rdi.action = null;
            rdi.info = "정보없음";
            if (d.getChildByPath("info") != null) {
                MapleData d1 = d.getChildByPath("info");
                if (d1.getChildByPath("info") != null) {
                    rdi.info = MapleDataTool.getString("info", d1);
                }
            }
            if (d.getChildByPath("action") != null) {
                rdi.action = MapleDataTool.getString("action", d);
            }
            rdi.id = Integer.parseInt(mdfe.getName().substring(0, 7));
            rdi.maps = reactorlocations.get(rdi.id);
            reactors.add(rdi);
        }
    }
    private static Map<Integer, List<Integer>> reactorlocations = new HashMap<Integer, List<Integer>>();

    public static void getReactorLocation() {
        System.out.println("Caching Reactor Locations...");
        for (int i = 0; i <= 9; ++i) {
            File ff = new File("wz/Map.wz/Map/Map" + i);
            if (ff.isDirectory()) {
                MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/Map.wz/Map/Map" + i));
                for (MapleDataFileEntry mdfe : pro.getRoot().getFiles()) {
                    MapleData d1 = pro.getData(mdfe.getName());
                    MapleData lifed = d1.getChildByPath("reactor");
                    if (lifed != null) {
                        for (MapleData d2 : lifed) {
                            MapleData scriptd = d2.getChildByPath("id");
                            if (scriptd != null) {
                                int rname = MapleDataTool.getIntConvert(scriptd);
                                if (!reactorlocations.containsKey(rname)) {
                                    reactorlocations.put(rname, new LinkedList<Integer>());
                                }
                                int mapid = Integer.parseInt(mdfe.getName().substring(0, 9));
                                if (!reactorlocations.get(rname).contains(mapid)) {
                                    reactorlocations.get(rname).add(mapid);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public static String getString(String name, String info, List<Integer> maps) {
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
                + " * ActionName : " + name + "\r\n"
                + " * ReactorInfo : " + info + "\r\n";

        for (Integer iz : maps) {
            npStr1 += " * Location : ";
            npStr1 += iz + " (" + NPCScriptExtractor.getMapName(iz) + ")\r\n";
        }

        npStr1 += " * \r\n"
                + " * @author T-Sun\r\n"
                + " *\r\n"
                + " */\r\n"
                + "\r\n"
                + "function act() {\r\n"
                + "    rm.dropItems();\r\n"
                + "}\r\n";
        return npStr1;
    }

    public static class ReactorDataInfo {

        public String info, action;
        public int id;
        public List<Integer> maps;
    }
}
