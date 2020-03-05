/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.scripts;

import java.io.File;
import java.io.FileOutputStream;
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
import server.maps.MapleMapFactory;
import tools.Pair;

/**
 *
 * @author
 */
public class NPCScriptExtractor {

    public static void main(String[] args) {
        //getNPCLocation(1);
        boolean MakeDafultNPC = true;
        try {
            long start = System.currentTimeMillis();
            File f1 = new File("wz/Npc.wz");
            File out1 = new File("NPCList.txt");
            FileOutputStream fos = new FileOutputStream(out1, false);
            MapleDataProvider mdp1 = MapleDataProviderFactory.getDataProvider(f1);
            for (MapleDataFileEntry mdfe1 : mdp1.getRoot().getFiles()) {
                MapleData d1 = mdp1.getData(mdfe1.getName()).getChildByPath("info/script/0");
                if (d1 != null) {
                    int in = Integer.parseInt(mdfe1.getName().substring(0, 7));
                    System.out.print(in +" Processing... ");
                    Pair<String, String> namefunc = getNPCNameFunc(in);
                    String str = in + ".js (scriptName = " + MapleDataTool.getString("script", d1) + ") : " + namefunc.left + namefunc.right;
                    List<Integer> locations = getNPCLocation(in);
                    if (!locations.isEmpty()) {
                        str += " (";
                        for (Integer i : locations) {
                            str += i + ", ";
                        }
                        str = str.substring(0, str.length() - 2);
                        str += ")";
                    }
                    str += "\r\n";
                    fos.write(str.getBytes("UTF-8"));

                    if (MakeDafultNPC) {
                        File np1 = new File("scripts/npc/" + in + ".js");
                        FileOutputStream np2 = new FileOutputStream(np1, false);
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
                                + " * NPCID : " + in + "\r\n"
                                + " * ScriptName : " + MapleDataTool.getString("script", d1) + "\r\n"
                                + " * NPCNameFunc : " + namefunc.left + namefunc.right + "\r\n";

                        for (Integer iz : locations) {
                            npStr1 += " * Location : ";
                            npStr1 += iz + " (" + getMapName(iz) + ")\r\n";
                        }

                        npStr1 += " * \r\n"
                                + " * @author T-Sun\r\n"
                                + " *\r\n"
                                + " */\r\n"
                                + "\r\n"
                                + "var status = -1;\r\n"
                                + "function action(mode, type, selection) {\r\n"
                                + "    if (mode == 1 && type != 1) {\r\n"
                                + "        status++;\r\n"
                                + "    } else {\r\n"
                                + "        if (type == 1 && mode == 1) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 1;\r\n"
                                + "        } else if (type == 1 && mode == 0) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 0;\r\n"
                                + "        } else {\r\n"
                                + "            cm.dispose();\r\n"
                                + "            return;\r\n"
                                + "        }\r\n"
                                + "    }\r\n"
                                + "    if (status == 0) {\r\n"
                                + "        cm.sendOk(\"테스트 엔피시 입니다!!\");\r\n"
                                + "        cm.safeDispose();\r\n"
                                + "    }\r\n"
                                + "}";
                        np2.write(npStr1.getBytes("UTF-8"));
                        np2.close();
                    }
                    
                    System.out.println("Complete.");
                }
            }
            fos.close();
            System.out.println("All Completed. Time : " + (System.currentTimeMillis() - start)+"ms");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Pair<String, String> getNPCNameFunc(int id) {
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz"));
        MapleData npc = pro.getData("Npc.img");
        for (MapleData d1 : npc) {
            if (d1.getName().equals(String.valueOf(id))) {
                Pair<String, String> ret = new Pair<String, String>("", "");
                MapleData str1 = d1.getChildByPath("name");
                if (str1 != null) {
                    ret.left = MapleDataTool.getString(str1, "");
                }
                MapleData str2 = d1.getChildByPath("func");
                if (str2 != null) {
                    ret.right = " - " + MapleDataTool.getString(str2, "");
                }
                return ret;
            }
        }
        return null;
    }
    private static Map<Integer, List<Integer>> npcs = new HashMap<Integer, List<Integer>>();

    public static List<Integer> getNPCLocation(int id) {
        List<Integer> ret = new ArrayList<Integer>();
        if (npcs.isEmpty()) {
            System.out.println("Caching NPC Locations...");
            for (int i = 0; i <= 9; ++i) {
                File ff = new File("wz/Map.wz/Map/Map" + i);
                if (ff.isDirectory()) {
                    MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/Map.wz/Map/Map" + i));
                    for (MapleDataFileEntry mdfe : pro.getRoot().getFiles()) {
                        MapleData d1 = pro.getData(mdfe.getName());
                        //System.out.println(mdfe.getName());
                        MapleData lifed = d1.getChildByPath("life");
                        if (lifed != null) {
                            List<Integer> npcc = new LinkedList<Integer>();
                            for (MapleData d2 : lifed) {
                                npcc.add(MapleDataTool.getIntConvert("id", d2));
                            }
                            npcs.put(Integer.parseInt(mdfe.getName().substring(0, 9)), npcc);
                        }
                    }
                }
            }
        }
        for (Entry<Integer, List<Integer>> e : npcs.entrySet()) {
            if (e.getValue().contains(id)) {
                ret.add(e.getKey());
            }
        }
        return ret;
    }

    public static String getMapName(int id) {
        MapleData nameData = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz")).getData("Map.img");
        try {
            String ret = "";
            ret += MapleDataTool.getString("streetName", nameData.getChildByPath(MapleMapFactory.getMapStringName(id)), "");
            ret += " - ";
            ret += MapleDataTool.getString("mapName", nameData.getChildByPath(MapleMapFactory.getMapStringName(id)), "").replace("&lt;", "<");
            return ret;
        } catch (Exception e) {
            return "?";
        }
    }
}
