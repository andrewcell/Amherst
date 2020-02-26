/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.scripts;

import java.io.File;
import java.io.FileOutputStream;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import tools.Triple;

/**
 *
 * @author
 */
public class QuestScriptExtractor {

    public static void main(String[] args) {
        //getNPCLocation(1);
        boolean MakeDafultNPC = true;
        try {
            long start = System.currentTimeMillis();
            File f1 = new File("wz/Quest.wz");
            File out1 = new File("QuestList.txt");
            FileOutputStream fos = new FileOutputStream(out1, false);
            MapleDataProvider mdp1 = MapleDataProviderFactory.getDataProvider(f1);
            for (MapleData d1 : mdp1.getData("Check.img")) {
                int quest = Integer.parseInt(d1.getName());
                System.out.print(quest + " Processing... ");
                int startnpc = 0;
                int endnpc = 0;
                String qname = "";
                String qinfo_progress = "";
                String qinfo_end = "";
                String end_qdata = "";

                MapleData startQuest = d1.getChildByPath("0");
                if (startQuest != null) {
                    if (startQuest.getChildByPath("startscript") != null) {
                        startnpc = MapleDataTool.getInt(startQuest.getChildByPath("npc"), -1);
                    }
                }
                MapleData completeQuest = d1.getChildByPath("1");
                if (completeQuest != null) {
                    if (completeQuest.getChildByPath("endscript") != null) {
                        endnpc = MapleDataTool.getInt(completeQuest.getChildByPath("npc"), -1);
                    }
                }

                Triple<String, String, String> qinfo = getQuestInfo(quest);

                qname = qinfo.getLeft();
                qinfo_progress = qinfo.getMid();
                qinfo_end = qinfo.getRight();
                end_qdata = getQuestCheckData(quest);

                String str = "Quest ID : " + quest + " ";
                if (startnpc != 0) {
                    str += "[hasStartScript] ";
                }
                if (endnpc != 0) {
                    str += "[hasEndScript] ";
                }

                if (startnpc == 0 && endnpc == 0 && end_qdata.isEmpty()) {
                    System.out.println("Passed.");
                    continue;
                }


                str += "Quest Name : " + qname + " ";
                if (!end_qdata.isEmpty()) {
                    str +="/ Quest End Data : " + end_qdata;
                }
                str += "\r\n";


                fos.write(str.getBytes("UTF-8"));

                if (MakeDafultNPC) {
                    File np1 = new File("scripts/quest/" + quest + ".js");
                    if (np1.exists() || (startnpc == 0 && endnpc == 0)) {
                        continue;
                    }
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
                            + " * Quest ID : " + quest + "\r\n";
                    npStr1 += " * Quest Name : " + qname + "\r\n";
                    npStr1 += " * Quest Progress Info : " + qinfo_progress + "\r\n";
                    npStr1 += " * Quest End Info : " + qinfo_end + "\r\n";
                    if (startnpc != 0) {
                        npStr1 += " * Start NPC : " + startnpc + "\r\n";
                    }
                    if (endnpc != 0) {
                        npStr1 += " * End NPC : " + endnpc + "\r\n";
                    }


                    npStr1 += " * \r\n"
                            + " * @author T-Sun\r\n"
                            + " *\r\n"
                            + " */\r\n"
                            + "\r\n";
                    npStr1 += "var status = -1;\r\n\r\n";
                    if (startnpc != 0) {
                        npStr1 += "function start(mode, type, selection) {\r\n"
                                + "    if (mode == 1 && type != 1 && type != 11) {\r\n"
                                + "        status++;\r\n"
                                + "    } else {\r\n"
                                + "        if ((type == 1 || type == 11) && mode == 1) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 1;\r\n"
                                + "        } else if ((type == 1 || type == 11) && mode == 0) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 0;\r\n"
                                + "        } else {\r\n"
                                + "            qm.dispose();\r\n"
                                + "            return;\r\n"
                                + "        }\r\n"
                                + "    }\r\n"
                                + "    if (status == 0) {\r\n"
                                + "        qm.sendOk(\"안녕하세요\");\r\n"
                                //+ "        qm.forceStartQuest();\r\n"
                                + "        qm.dispose();\r\n"
                                + "    } \r\n"
                                + "}\r\n";
                    }
                    if (endnpc != 0) {
                        npStr1 += "function end(mode, type, selection) {\r\n"
                                + "    if (mode == 1 && type != 1 && type != 11) {\r\n"
                                + "        status++;\r\n"
                                + "    } else {\r\n"
                                + "        if ((type == 1 || type == 11) && mode == 1) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 1;\r\n"
                                + "        } else if ((type == 1 || type == 11) && mode == 0) {\r\n"
                                + "            status++;\r\n"
                                + "            selection = 0;\r\n"
                                + "        } else {\r\n"
                                + "            qm.dispose();\r\n"
                                + "            return;\r\n"
                                + "        }\r\n"
                                + "    }\r\n"
                                + "    if (status == 0) {\r\n"
                                + "        qm.sendOk(\"안녕하세요\");\r\n"
                                //+ "        qm.forceCompleteQuest();\r\n"
                                + "        qm.dispose();\r\n"
                                + "    } \r\n"
                                + "}\r\n";
                    }
                    np2.write(npStr1.getBytes("UTF-8"));
                    np2.close();
                }
                System.out.println("OK");
            }
            fos.close();
            System.out.println("All Completed. Time : " + (System.currentTimeMillis() - start) + "ms");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Triple<String, String, String> getQuestInfo(int id) {
        MapleDataProvider mdp1 = MapleDataProviderFactory.getDataProvider(new File("wz/Quest.wz"));
        MapleData dd = mdp1.getData("QuestInfo.img");
        MapleData d1 = dd.getChildByPath(String.valueOf(id));
        return new Triple<String, String, String>(MapleDataTool.getString("name", d1, ""), MapleDataTool.getString("1", d1, ""), MapleDataTool.getString("2", d1, ""));
    }

    public static String getQuestCheckData(int id) {
        MapleDataProvider mdp1 = MapleDataProviderFactory.getDataProvider(new File("wz/Quest.wz"));
        MapleData dd = mdp1.getData("Check.img");
        MapleData d1 = dd.getChildByPath(String.valueOf(id));
        return MapleDataTool.getString("1/info/0", d1, "");
    }
}