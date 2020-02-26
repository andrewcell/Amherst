/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import provider.MapleDataType;
import tools.HexTool;
import tools.data.MaplePacketLittleEndianWriter;

/**
 *
 * @author
 */
public class MapleCashItemComparator {

    private static final MapleDataProvider EtcRoot_12182 = MapleDataProviderFactory.getDataProvider(new File("wz1/Etc.wz"));
    private static final MapleDataProvider StringRoot_12182 = MapleDataProviderFactory.getDataProvider(new File("wz1/String.wz"));
    private static final MapleDataProvider EtcRoot_1241 = MapleDataProviderFactory.getDataProvider(new File("wz/Etc.wz"));
    private static final MapleDataProvider StringRoot_1241 = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz"));
    private static final MapleData Commodity_1241 = EtcRoot_1241.getData("Commodityo.img");
    private static final MapleData Commodity_12182 = EtcRoot_12182.getData("Commodity.img");
    private static final MapleData StringItem_1241 = StringRoot_1241.getData("Itemo.img");
    private static final MapleData StringEqp_12182 = StringRoot_12182.getData("Eqp.img");
    private static final MapleData StringCash_12182 = StringRoot_12182.getData("Cash.img");
    private static final Map<Integer, String> item_string_1241 = new LinkedHashMap<Integer, String>();
    private static final Map<Integer, String> item_string_12182 = new LinkedHashMap<Integer, String>();
    private static final Map<Integer, CommodityData> item_commodity_1241 = new LinkedHashMap<Integer, CommodityData>();
    private static final Map<Integer, CommodityData> item_commodity_12182 = new LinkedHashMap<Integer, CommodityData>();

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        System.out.println("Caching 1.2.41 Strings...");
        {
            for (MapleData d1 : StringItem_1241.getChildByPath("Eqp")) {
                for (MapleData d2 : d1.getChildren()) {
                    item_string_1241.put(Integer.parseInt(d2.getName()), MapleDataTool.getString("name", d2, ""));
                }
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms size : " + item_string_1241.size());

        System.out.println("Caching 1.2.182 Strings...");
        start = System.currentTimeMillis();
        {
            for (MapleData d1 : StringEqp_12182.getChildByPath("Eqp")) {
                for (MapleData d2 : d1.getChildren()) {
                    item_string_12182.put(Integer.parseInt(d2.getName()), MapleDataTool.getString("name", d2, ""));
                }
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms size : " + item_string_12182.size());

        start = System.currentTimeMillis();
        System.out.println("Caching 1.2.41 Commodities");
        {
            for (MapleData d1 : Commodity_1241.getChildren()) {
                CommodityData cd = new CommodityData();
                cd.itemid = MapleDataTool.getInt("ItemId", d1, 0);
//                int id = cd.itemid;
//                if ((id < 5010000 || id >= 5020000) && id / 1000000 == 5) {
//                    continue;
//                }
                int sn = MapleDataTool.getInt("SN", d1);
                if (sn >= 80000000 && sn < 90000000) { //메소 아이템 (금방울, 빨간 리본)
                    continue;
                }
                cd.count = MapleDataTool.getInt("Count", d1, 0);
                cd.price = MapleDataTool.getInt("Price", d1, 0);
                cd.priority = MapleDataTool.getInt("Priority", d1, 0);
                cd.gender = MapleDataTool.getInt("Gender", d1, 0);
                cd.onsale = MapleDataTool.getInt("OnSale", d1, 0);
                cd.class_ = MapleDataTool.getInt("Class", d1, 0);
                item_commodity_1241.put(sn, cd);
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms size : " + item_commodity_1241.size());

        start = System.currentTimeMillis();
        System.out.println("Caching 1.2.182 Commodities");
        {
            for (MapleData d1 : Commodity_12182.getChildren()) {
                CommodityData cd = new CommodityData();
                cd.itemid = MapleDataTool.getInt("ItemId", d1, -1);
//                int id = cd.itemid;
//                if ((id < 5010000 || id >= 5020000) && id / 1000000 == 5) {
//                    continue;
//                }
                int sn = MapleDataTool.getInt("SN", d1);
                if (sn >= 80000000 && sn < 90000000) { //메소 아이템 (금방울, 빨간 리본)
                    continue;
                }
                cd.count = MapleDataTool.getInt("Count", d1, -1);
                cd.price = MapleDataTool.getInt("Price", d1, -1);
                cd.priority = MapleDataTool.getInt("Priority", d1, 0);
                cd.gender = MapleDataTool.getInt("Gender", d1, 0);
                cd.onsale = MapleDataTool.getInt("OnSale", d1, -1);
                cd.class_ = MapleDataTool.getInt("Class", d1, 0);
                item_commodity_12182.put(sn, cd);
            }
        }
        System.out.println("Complete. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms size : " + item_commodity_12182.size());

//        int i = 3676;
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        int size = 0;
        for (Entry<Integer, CommodityData> cd : item_commodity_12182.entrySet()) {
            CommodityData cdv = cd.getValue();
            if (cdv.itemid == -1 || cdv.count == -1 || cdv.price == -1 || cdv.onsale <= 0 || item_string_12182.get(cdv.itemid) == null) {
                continue;
            }
            if (//cdv.itemid > 9000000 || //패키지
                    //cdv.itemid / 1000000 == 5 || //캐시소비/꾸미기아이템
                    cdv.itemid / 10000 == 111 || //반지
                    cdv.itemid / 10000 == 180 //펫장비
                    ) {
                continue;
            }
            if (!item_commodity_1241.containsKey(cd.getKey()) && !item_string_1241.containsKey(cdv.itemid)) {
                mplew.writeInt(cd.getKey());
                mplew.writeShort(0x200);
                mplew.write(1);
                ++size;
                if (size >= 10) {
                    break;
                }
                //겹치지 않는 1.2.182에서 추가된 Commodity
//                System.out.println("    <imgdir name=\""+(i++)+"\">\r\n"
//                        + "        <int name=\"SN\" value=\""+cd.getKey()+"\"/>\r\n"
//                        + "        <int name=\"ItemId\" value=\""+cdv.itemid+"\"/>\r\n"
//                        + "        <int name=\"Count\" value=\""+cdv.count+"\"/>\r\n"
//                        + "        <int name=\"Price\" value=\""+cdv.price+"\"/>\r\n"
//                        + "        <int name=\"Period\" value=\"0\"/>\r\n"
//                        + "        <int name=\"Priority\" value=\"100\"/>\r\n"
//                        + "        <int name=\"ReqPOP\" value=\"0\"/>\r\n"
//                        + "        <int name=\"ReqLEV\" value=\"0\"/>\r\n"
//                        + "        <int name=\"Gender\" value=\""+cdv.gender+"\"/>\r\n"
//                        + "        <int name=\"OnSale\" value=\"0\"/>\r\n"
//                        + "        <int name=\"Class\" value=\"3\"/>\r\n"
//                        + "        <int name=\"PbCash\" value=\"30\"/>\r\n"
//                        + "        <int name=\"PbPoint\" value=\"30\"/>\r\n"
//                        + "        <int name=\"PbGift\" value=\"30\"/>\r\n"
//                        + "    </imgdir>\r\n\r\n");
                //System.out.println(cd.getKey() + " : " + cdv.itemid + " - " + item_string_12182.get(cdv.itemid));
            }
        }
        System.out.println(HexTool.toString(mplew.getPacket()));
        System.out.println("size : "+size);

        //추가부분. 필요없으니 삭제해도 무방.

//        MapleDataProvider prod = MapleDataProviderFactory.getDataProvider(new File("wz1/Etc.wz"));
//        MapleDataProvider proo = MapleDataProviderFactory.getDataProvider(new File("wz/Etc.wz"));
//        Map<Integer, List<Integer>> prodList = new HashMap<Integer, List<Integer>>();
//        Map<Integer, List<Integer>> prooList = new HashMap<Integer, List<Integer>>();
//
//        for (MapleData d1d : prod.getData("CashPackage.img")) {
//            List<Integer> l1 = new ArrayList<Integer>();
//            for (MapleData d2d : d1d.getChildByPath("SN")) {
//                l1.add(MapleDataTool.getInt(d2d));
//            }
//            prodList.put(Integer.parseInt(d1d.getName()), l1);
//        }
//        for (MapleData d2d : proo.getData("CashPackage.img")) {
//            List<Integer> l2 = new ArrayList<Integer>();
//            for (MapleData d3d : d2d.getChildByPath("SN")) {
//                l2.add(MapleDataTool.getInt(d3d));
//            }
//            prooList.put(Integer.parseInt(d2d.getName()), l2);
//        }
//
//        for (Entry<Integer, List<Integer>> e : prodList.entrySet()) {
//            if (!prooList.containsKey(e.getKey())) { //중복이 아닐때.
//                boolean bln = false;
//                for (int iz : e.getValue()) {
//                    if (!item_commodity_1241.containsKey(iz)) {
//                        bln = true;
//                        break;
//                    }
//                }
//                if (bln) {
//                    continue; //sn이 없는게 있는 패키지. 즉 패스
//                }
//                int i = 4085;
//                for (Entry<Integer, CommodityData> cd : item_commodity_12182.entrySet()) {
//                    CommodityData cdv = cd.getValue();
//                    if (cdv.itemid == e.getKey() && cdv.onsale >= 1) {
//                        System.out.println("    <imgdir name=\"" + (i++) + "\">\r\n"
//                                + "        <int name=\"SN\" value=\"" + cd.getKey() + "\"/>\r\n"
//                                + "        <int name=\"ItemId\" value=\"" + cdv.itemid + "\"/>\r\n"
//                                + "        <int name=\"Count\" value=\"" + cdv.count + "\"/>\r\n"
//                                + "        <int name=\"Price\" value=\"" + cdv.price + "\"/>\r\n"
//                                + "        <int name=\"Period\" value=\"0\"/>\r\n"
//                                + "        <int name=\"Priority\" value=\"100\"/>\r\n"
//                                + "        <int name=\"ReqPOP\" value=\"0\"/>\r\n"
//                                + "        <int name=\"ReqLEV\" value=\"0\"/>\r\n"
//                                + "        <int name=\"Gender\" value=\"" + cdv.gender + "\"/>\r\n"
//                                + "        <int name=\"OnSale\" value=\"0\"/>\r\n"
//                                + "        <int name=\"Class\" value=\"3\"/>\r\n"
//                                + "        <int name=\"PbCash\" value=\"30\"/>\r\n"
//                                + "        <int name=\"PbPoint\" value=\"30\"/>\r\n"
//                                + "        <int name=\"PbGift\" value=\"30\"/>\r\n"
//                                + "    </imgdir>\r\n\r\n");
//                    }
//                }
////                System.out.println("    <imgdir name=\"" + e.getKey() + "\">");
////                System.out.println("        <imgdir name=\"SN\">");
////                for (int i = 0; i < e.getValue().size(); ++i) {
////                    //sn이 다 있는데 캐시패키지에 없으면 추가.
////                    System.out.println("            <int name=\"" + i + "\" value=\"" + e.getValue().get(i) + "\"/>");
////                }
////                System.out.println("        </imgdir>");
////                System.out.println("    </imgdir>");
//            }
//        }
////        System.out.println("Size : " + Integer.toHexString(size));
////        System.out.println(HexTool.toString(mplew.getPacket()));

    }
//Packet : 

    public static final class CommodityData {

        int itemid;
        int price;
        int count;
        int priority;
        int gender;
        int onsale;
        int class_;
    }
}
