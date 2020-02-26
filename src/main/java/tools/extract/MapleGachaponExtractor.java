/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import org.ini4j.Ini;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import server.MapleItemInformationProvider;
import server.ServerProperties;
import tools.Pair;

/**
 *
 * @author
 */
public class MapleGachaponExtractor {

    public static void main(String[] args) {
        String name = "imgs";
        String to = "gachapon.ini";

        final int Split = 8;

        File fromFile = new File(name);
        File toFile = new File(to);
        List<tools.Pair<Integer, Integer>> aaaz = new LinkedList<Pair<Integer, Integer>>();
        List<List<Pair<Integer, Integer>>> towns = new ArrayList<List<Pair<Integer, Integer>>>(Split);
        for (int i = 0; i < Split; ++i) {
            towns.add(new ArrayList<Pair<Integer, Integer>>());
        }
        try {
            MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(fromFile);
            MapleData data = pro.getData("Gachapon.img");
            int d = 0;
            //Gachapon.img 에서 모든 데이터를 빼와서 aaaz 리스트에 저장한다.
            for (MapleData ddd : data.getChildren()) {
                for (MapleData dd : ddd) {
                    String prob = MapleDataTool.getString("prob", dd, "0");
                    prob = prob.substring(4);
                    int da = (int) Math.round(Double.parseDouble(prob) * 1000000D);
                    aaaz.add(new Pair<Integer, Integer>(MapleDataTool.getInt("item", dd, 0), da));
                    d += da;
                }
            }
            //Split 개의 리스트에 각각 나누어 담는다.
            for (int i = 0; i < aaaz.size(); ++i) {
                Pair<Integer, Integer> pair = aaaz.get(i);
                for (int a = 0; a < Split; ++a) {
                    if (i % Split == a) {
                        towns.get(a).add(pair);
                    }
                }
            }

            //제대로 모두 들어간게 맞는지 검사한다.
            int asize = 0;
            for (int i = 0; i < Split; ++i) {
                asize += towns.get(i).size();
            }

            if (asize != aaaz.size()) {
                System.out.println("갯수가 틀림.");
                return;
            }

            MapleItemInformationProvider.getInstance().runItems();
            //ini 파일로 저장한다.
            Ini ini = new Ini();
            Ini.Section total = ini.add("TOTAL");
            for (int i = 0; i < Split; ++i) {
                int totald = 0;
                Ini.Section sec = ini.add("GACHAPON" + i);
                List<Pair<Integer, Integer>> debug = new ArrayList<Pair<Integer, Integer>>();
                for (Pair<Integer, Integer> pair : towns.get(i)) {
                    if (!sec.containsKey(pair.getLeft() + "")) {
                        String itemname = MapleItemInformationProvider.getInstance().getName(pair.getLeft());
                        if (itemname == null) {
                            continue;
                        }
                        totald += pair.getRight();
                        if (pair.getLeft() / 1000000 != 1) {
                            System.out.println(pair.getLeft() + " : " + itemname);
                        }
                        sec.add(pair.getLeft() + "", pair.getRight());
                        //아이템이름을 주석으로 만든다.
                        sec.putComment(pair.getLeft() + "", itemname);
                        debug.add(new Pair<Integer, Integer>(pair.getLeft(), pair.getRight()));
                    }
                }
                total.add("GACHAPON" + i, totald);
                int debugD = 0;
                for (Pair<Integer, Integer> p : debug) {
                    debugD += p.getRight();
                }
                if (totald != debugD) {
                    throw new RuntimeException("ERROR from add reward..");
                }
                
            }

            ini.store(toFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
