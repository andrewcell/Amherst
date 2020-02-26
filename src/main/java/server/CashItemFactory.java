package server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import database.DatabaseConnection;
import java.io.File;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;
import java.util.LinkedList;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import server.CashItemInfo.CashModInfo;

public class CashItemFactory {

    private final static CashItemFactory instance = new CashItemFactory();
    private final static int[] bestItems = new int[]{30000031, 30000031, 30000031, 30000031, 30000031};
    private final Map<Integer, CashItemInfo> itemStats = new HashMap<Integer, CashItemInfo>();
    private final Map<Integer, List<Integer>> itemPackage = new HashMap<Integer, List<Integer>>();
    private final Map<Integer, CashModInfo> itemMods = new HashMap<Integer, CashModInfo>();
    private final MapleDataProvider data = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wz_path") + "/Etc.wz"));
    private final List<Integer> donateSNs = new LinkedList<Integer>();
    private final List<Integer> incubatorSNs = new LinkedList<Integer>();

    public static final CashItemFactory getInstance() {
        return instance;
    }

    public void initialize() {
        final List<MapleData> cccc = data.getData("Commodity.img").getChildren();
        for (MapleData field : cccc) {
            int id = Integer.parseInt(field.getName());
            final int SN = MapleDataTool.getIntConvert("SN", field, 0);
            boolean bln = MapleDataTool.getIntConvert("OnSale", field, 0) > 0;
            final CashItemInfo stats = new CashItemInfo(MapleDataTool.getIntConvert("ItemId", field, 0),
                    MapleDataTool.getIntConvert("Count", field, 1),
                    MapleDataTool.getIntConvert("Price", field, 0), SN,
                    MapleDataTool.getIntConvert("Period", field, 0),
                    MapleDataTool.getIntConvert("Gender", field, 2),
                    bln && MapleDataTool.getIntConvert("Price", field, 0) > 0);

            if (SN > 0) {
                itemStats.put(SN, stats);
            }
        }

        //<editor-fold defaultstate="collapsed" desc="Donate KMS Shops">
        donateSNs.add(20000394);
        donateSNs.add(20000395);
        donateSNs.add(20000396);
        donateSNs.add(20100086);
        donateSNs.add(20100087);
        donateSNs.add(20100088);
        donateSNs.add(20600183);
        donateSNs.add(20000397);
        donateSNs.add(20000398);
        donateSNs.add(20600184);
        donateSNs.add(20000399);
        donateSNs.add(20600185);
        donateSNs.add(20600186);
        donateSNs.add(20600187);
        donateSNs.add(20600188);
        donateSNs.add(20600189);
        donateSNs.add(20000400);
        donateSNs.add(20600190);
        donateSNs.add(20000401);
        donateSNs.add(20600191);
        donateSNs.add(20600192);
        donateSNs.add(20600193);
        donateSNs.add(20600194);
        donateSNs.add(20600195);
        donateSNs.add(20000402);
        donateSNs.add(20600196);
        donateSNs.add(20600197);
        donateSNs.add(20600198);
        donateSNs.add(20000403);
        donateSNs.add(20600199);
        donateSNs.add(20000404);
        donateSNs.add(20600200);
        donateSNs.add(20600201);
        donateSNs.add(20600202);
        donateSNs.add(20000405);
        donateSNs.add(20600203);
        donateSNs.add(20600204);
        donateSNs.add(20600205);
        donateSNs.add(20600206);
        donateSNs.add(20600207);
//        donateSNs.add(20600208);
        donateSNs.add(20600209);
        donateSNs.add(20600210);
        donateSNs.add(20600211);
        donateSNs.add(20600212);
        donateSNs.add(20600213);
        donateSNs.add(20600214);
        donateSNs.add(20600215);
        donateSNs.add(20600216);
        donateSNs.add(20600217);
        donateSNs.add(20100089);
        donateSNs.add(20600218);
        donateSNs.add(20600219);
        donateSNs.add(20300255);
        donateSNs.add(20300256);
        donateSNs.add(20100090);
        donateSNs.add(20600220);
        donateSNs.add(20100091);
        donateSNs.add(20300257);
        donateSNs.add(20600221);
        donateSNs.add(20300258);
        donateSNs.add(20600222);
        donateSNs.add(20600223);
        donateSNs.add(20300259);
        donateSNs.add(20600224);
        donateSNs.add(20600225);
        donateSNs.add(20300260);
        donateSNs.add(20600226);
        donateSNs.add(20300261);
        donateSNs.add(20600227);
        donateSNs.add(20300262);
        donateSNs.add(20300263);
        donateSNs.add(20000406);
        donateSNs.add(20000407);
        donateSNs.add(20300264);
        donateSNs.add(20000408);
//        donateSNs.add(20300265);
        donateSNs.add(20000409);
        donateSNs.add(20300266);
        donateSNs.add(20000410);
        donateSNs.add(20300267);
        donateSNs.add(20000411);
        donateSNs.add(20300268);
        donateSNs.add(20000412);
        donateSNs.add(20300269);
        donateSNs.add(20000413);
        donateSNs.add(20000414);
        donateSNs.add(20000415);
        donateSNs.add(20300270);
        donateSNs.add(20000416);
        donateSNs.add(20300271);
        donateSNs.add(20300272);
        donateSNs.add(20300273);
        donateSNs.add(20000417);
        donateSNs.add(20300274);
        donateSNs.add(20300275);
        donateSNs.add(20300276);
        donateSNs.add(20300277);
        donateSNs.add(20000418);
        donateSNs.add(20300278);
        donateSNs.add(20300279);
        donateSNs.add(20300280);
        donateSNs.add(20000419);
        donateSNs.add(20300281);
        donateSNs.add(20300282);
        donateSNs.add(20300283);
        donateSNs.add(20300284);
        donateSNs.add(20300285);
        donateSNs.add(20000420);
        donateSNs.add(20300286);
        donateSNs.add(20000421);
        donateSNs.add(20300287);
        donateSNs.add(20000422);
        donateSNs.add(20300288);
        donateSNs.add(20000423);
        donateSNs.add(20300289);
        donateSNs.add(20000424);
        donateSNs.add(20300290);
        donateSNs.add(20000425);
        donateSNs.add(20000426);
        donateSNs.add(20000427);
        donateSNs.add(20300291);
        donateSNs.add(20300292);
        donateSNs.add(20300293);
        donateSNs.add(20300294);
        donateSNs.add(20000428);
        donateSNs.add(20000429);
        donateSNs.add(20000430);
        donateSNs.add(20000431);
        donateSNs.add(20000432);
        donateSNs.add(20000433);
        donateSNs.add(20000434);
        donateSNs.add(20300295);
        donateSNs.add(20300296);
        donateSNs.add(20300297);
        donateSNs.add(20300298);
        donateSNs.add(20300299);
        donateSNs.add(20300300);
        donateSNs.add(20300301);
        donateSNs.add(20300302);
        donateSNs.add(20300303);
        donateSNs.add(20300304);
        donateSNs.add(20300305);
        donateSNs.add(20300306);
        donateSNs.add(20300307);
        donateSNs.add(20300308);
        donateSNs.add(20300309);
        donateSNs.add(20300310);
        donateSNs.add(20100092);
        donateSNs.add(20300311);
        donateSNs.add(20100093);
        donateSNs.add(20300312);
        donateSNs.add(20300313);
        donateSNs.add(20300314);
        donateSNs.add(20300315);
        donateSNs.add(20300316);
        donateSNs.add(20300317);
        donateSNs.add(20000435);
        donateSNs.add(20000436);
        donateSNs.add(20000437);
        donateSNs.add(20000438);
        donateSNs.add(20000439);
        donateSNs.add(20000440);
        donateSNs.add(20000441);
        donateSNs.add(20000442);
        donateSNs.add(20000443);
        donateSNs.add(20000444);
        donateSNs.add(20000445);
        donateSNs.add(20000446);
        donateSNs.add(20000447);
        donateSNs.add(20000448);
        donateSNs.add(20000449);
        donateSNs.add(20000450);
        donateSNs.add(20000451);
        donateSNs.add(20000452);
        donateSNs.add(20600228);
        donateSNs.add(20600229);
        donateSNs.add(20600230);
        donateSNs.add(20600231);
        donateSNs.add(20600232);
        donateSNs.add(20600233);
        donateSNs.add(20500197);
        donateSNs.add(20500198);
        donateSNs.add(20500199);
        donateSNs.add(20500200);
        donateSNs.add(20500201);
        donateSNs.add(20500202);
        donateSNs.add(20500203);
        donateSNs.add(20500204);
        donateSNs.add(20500205);
        donateSNs.add(20500206);
        donateSNs.add(20500207);
        donateSNs.add(20500208);
        donateSNs.add(20500209);
        donateSNs.add(20500210);
        donateSNs.add(20500211);
        donateSNs.add(20500212);
        donateSNs.add(20500213);
        donateSNs.add(20500214);
        donateSNs.add(20500215);
        donateSNs.add(20500216);
        donateSNs.add(20500217);
        donateSNs.add(20500218);
        donateSNs.add(20500219);
        donateSNs.add(20500220);
        donateSNs.add(20500221);
        donateSNs.add(20500222);
        donateSNs.add(20500223);
        donateSNs.add(20500224);
        donateSNs.add(20500225);
        donateSNs.add(20500226);
        donateSNs.add(20500227);
        donateSNs.add(20500228);
        donateSNs.add(20500229);
        donateSNs.add(20500230);
        donateSNs.add(20500231);
        donateSNs.add(20500232);
        donateSNs.add(20500233);
        donateSNs.add(20500234);
        donateSNs.add(20500235);
        donateSNs.add(20500236);
        donateSNs.add(20500237);
        donateSNs.add(20500238);
        donateSNs.add(20500239);
        donateSNs.add(20400248);
        donateSNs.add(20400249);
        donateSNs.add(20400250);
        donateSNs.add(20400251);
        donateSNs.add(20400252);
        donateSNs.add(20400253);
        donateSNs.add(20400254);
        donateSNs.add(20400255);
        donateSNs.add(20400256);
        donateSNs.add(20400257);
        donateSNs.add(20400258);
        donateSNs.add(20400259);
        donateSNs.add(20400260);
        donateSNs.add(20400261);
        donateSNs.add(20400262);
        donateSNs.add(20400263);
        donateSNs.add(20400264);
        donateSNs.add(20400265);
        donateSNs.add(20400266);
        donateSNs.add(20400267);
        donateSNs.add(20400268);
        donateSNs.add(20400269);
        donateSNs.add(20400270);
        donateSNs.add(20400271);
        donateSNs.add(20400272);
        donateSNs.add(20400273);
        donateSNs.add(20400274);
        donateSNs.add(20400275);
        donateSNs.add(20400276);
        donateSNs.add(20400277);
        donateSNs.add(20400278);
        donateSNs.add(20400279);
        donateSNs.add(20400280);
        donateSNs.add(20400281);
        donateSNs.add(20400282);
        donateSNs.add(20400283);
        donateSNs.add(20400284);
        donateSNs.add(20400285);
        donateSNs.add(20400286);
        donateSNs.add(20400287);
        donateSNs.add(20400288);
        donateSNs.add(20400289);
        donateSNs.add(20400290);
        donateSNs.add(20400291);
        donateSNs.add(20400292);
        donateSNs.add(20400293);
        donateSNs.add(20400294);
        donateSNs.add(20400295);
        donateSNs.add(20400296);
        donateSNs.add(20400297);
        donateSNs.add(20400298);
        donateSNs.add(20400299);
        donateSNs.add(20400300);
        donateSNs.add(20400301);
        donateSNs.add(20400302);
        donateSNs.add(20400303);
        donateSNs.add(20400304);
        donateSNs.add(20400305);
        donateSNs.add(20400306);
        donateSNs.add(20800231);
        donateSNs.add(20800232);
        donateSNs.add(20800233);
        donateSNs.add(20800234);
        donateSNs.add(20800235);
        donateSNs.add(20800236);
        donateSNs.add(20800237);
        donateSNs.add(20800238);
        donateSNs.add(20800239);
        donateSNs.add(20800240);
        donateSNs.add(20800241);
        donateSNs.add(20800242);
        donateSNs.add(20800243);
        donateSNs.add(20800244);
        donateSNs.add(20800245);
        donateSNs.add(20800246);
        donateSNs.add(20800247);
        donateSNs.add(20700048);
        donateSNs.add(20700049);
        donateSNs.add(20700050);
        donateSNs.add(20700051);
        donateSNs.add(20700052);
        donateSNs.add(20700053);
        donateSNs.add(20700054);
        donateSNs.add(20700055);
        donateSNs.add(20700056);
//        donateSNs.add(20700057);
        donateSNs.add(20700058);
        donateSNs.add(20700059);
        donateSNs.add(20200083);
        donateSNs.add(20200084);
        donateSNs.add(20200085);
        donateSNs.add(20200086);
        donateSNs.add(20200087);
        donateSNs.add(20200088);
        donateSNs.add(20200089);
        donateSNs.add(20200090);
        donateSNs.add(20200091);
        donateSNs.add(20200092);
        donateSNs.add(20200093);
        donateSNs.add(20200094);
        donateSNs.add(20300318);
        donateSNs.add(20300319);
        donateSNs.add(20300320);
        donateSNs.add(20300321);
        donateSNs.add(20300322);
        donateSNs.add(20300323);
        donateSNs.add(20300324);
        donateSNs.add(20300325);
        donateSNs.add(20300326);
        donateSNs.add(20300327);
        donateSNs.add(20300328);
        donateSNs.add(20300329);
        donateSNs.add(20300330);
        donateSNs.add(20300331);
        donateSNs.add(20300332);
        donateSNs.add(20300333);
        donateSNs.add(20300334);
        donateSNs.add(20300335);
        donateSNs.add(21100099);
        donateSNs.add(20300336);
        donateSNs.add(20300337);
        donateSNs.add(20000453);
        donateSNs.add(20300338);
        donateSNs.add(21100100);
        donateSNs.add(20000454);
        donateSNs.add(20300339);
        donateSNs.add(21100101);
        donateSNs.add(21100102);
        donateSNs.add(20300340);
        donateSNs.add(20300341);
        donateSNs.add(20300342);
        donateSNs.add(21100103);
        donateSNs.add(20300343);
        donateSNs.add(20300344);
        donateSNs.add(20300345);
        donateSNs.add(21100104);
        donateSNs.add(20300346);
        donateSNs.add(20300347);
        donateSNs.add(20300348);
        donateSNs.add(20300349);
        donateSNs.add(21100105);
        donateSNs.add(20300350);
        donateSNs.add(20300351);
        donateSNs.add(20300352);
        donateSNs.add(20300353);
        donateSNs.add(21100106);
        donateSNs.add(20300354);
        donateSNs.add(20300355);
        donateSNs.add(20300356);
        donateSNs.add(20300357);
        donateSNs.add(21100107);
        donateSNs.add(20300358);
        donateSNs.add(20300359);
        donateSNs.add(20300360);
        donateSNs.add(21100108);
        donateSNs.add(20300361);
        donateSNs.add(21100109);
        donateSNs.add(20300362);
        donateSNs.add(21100110);
        donateSNs.add(21100111);
        donateSNs.add(20300363);
        donateSNs.add(21100112);
        donateSNs.add(20300364);
        donateSNs.add(21100113);
        donateSNs.add(20300365);
        donateSNs.add(20300366);
        donateSNs.add(20300367);
        donateSNs.add(20300368);
        donateSNs.add(20300369);
        donateSNs.add(20300370);
        donateSNs.add(20300371);
        donateSNs.add(20300372);
        donateSNs.add(20300373);
        donateSNs.add(20300374);
        donateSNs.add(20300375);
        donateSNs.add(20300376);
        donateSNs.add(21100114);
        donateSNs.add(20300377);
        donateSNs.add(20300378);
        donateSNs.add(20300379);
        donateSNs.add(21100115);
        donateSNs.add(21100116);
        donateSNs.add(21100117);
        donateSNs.add(21100118);
        donateSNs.add(20300380);
        donateSNs.add(21100119);
        donateSNs.add(20300381);
        donateSNs.add(20300382);
        donateSNs.add(20300383);
        donateSNs.add(21100120);
        donateSNs.add(20300384);
        donateSNs.add(21100121);
        donateSNs.add(20300385);
        donateSNs.add(21100122);
        donateSNs.add(20300386);
        donateSNs.add(20300387);
        donateSNs.add(20300388);
        donateSNs.add(20300389);
        donateSNs.add(20300390);
        donateSNs.add(21100123);
        donateSNs.add(20300391);
        donateSNs.add(21100124);
        donateSNs.add(21100125);
        donateSNs.add(21100126);
        donateSNs.add(21100127);
        donateSNs.add(21100128);
        donateSNs.add(21100129);
        donateSNs.add(21100130);
        donateSNs.add(21100131);
        donateSNs.add(21100132);
        donateSNs.add(21100133);
        donateSNs.add(21100134);
        donateSNs.add(21100135);
        donateSNs.add(21100136);
        donateSNs.add(21100137);
        donateSNs.add(21100138);
        donateSNs.add(21100139);
        donateSNs.add(21100140);
        donateSNs.add(21100141);
        donateSNs.add(21100142);
        donateSNs.add(21100143);
        donateSNs.add(21100144);
        donateSNs.add(21100145);
        donateSNs.add(21100146);
        donateSNs.add(21100147);
        donateSNs.add(21100148);
        donateSNs.add(21100149);
        donateSNs.add(21100150);
        donateSNs.add(21100151);
        donateSNs.add(21100152);
        donateSNs.add(20000455);
        
        incubatorSNs.add(10000804);
        incubatorSNs.add(50200014);
        incubatorSNs.add(50200033);
        incubatorSNs.add(50200038);
        
        incubatorSNs.add(10001570);
        incubatorSNs.add(70000197);
        incubatorSNs.add(10001608);
        incubatorSNs.add(70000198);
        
        donateSNs.addAll(incubatorSNs);

        //</editor-fold>

        final MapleData b = data.getData("CashPackage.img");
        for (MapleData c : b.getChildren()) {
            if (c.getChildByPath("SN") == null) {
                continue;
            }
            final List<Integer> packageItems = new ArrayList<Integer>();
            for (MapleData d : c.getChildByPath("SN").getChildren()) {
                packageItems.add(MapleDataTool.getIntConvert(d));
            }
            itemPackage.put(Integer.parseInt(c.getName()), packageItems);
        }

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM cashshop_modified_items");
            rs = ps.executeQuery();
            if (rs.next()) {
                CashModInfo ret = new CashModInfo(rs.getInt("serial"), rs.getInt("discount_price"), rs.getInt("mark"), rs.getInt("showup") > 0, rs.getInt("itemid"), rs.getInt("priority"), rs.getInt("package") > 0, rs.getInt("period"), rs.getInt("gender"), rs.getInt("count"), rs.getInt("meso"), rs.getInt("unk_1"), rs.getInt("for_pc"), rs.getInt("unk_3"), rs.getInt("extra_flags"));
                itemMods.put(ret.sn, ret);
                if (ret.showUp) {
                    final CashItemInfo cc = itemStats.get(Integer.valueOf(ret.sn));
                    if (cc != null) {
                        ret.toCItem(cc); //init
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
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
    }


    public List<Integer> getIncubatorSN() {
        return incubatorSNs;
    }
    public List<Integer> getDonateSN() {
        return donateSNs;
    }

    public final CashItemInfo getSimpleItem(int sn) {
        return itemStats.get(sn);
    }

    public final CashItemInfo getItem(int sn) {
        final CashItemInfo stats = itemStats.get(Integer.valueOf(sn));
        final CashModInfo z = getModInfo(sn);
        if (z != null && z.showUp) {
            return z.toCItem(stats); //null doesnt matter
        }
        if (stats == null || (!stats.onSale() && !donateSNs.contains(sn))) {
            return null;
        }
        //hmm
        return stats;
    }

    public CashItemInfo getItemForItemId(int itemid) {
        for (CashItemInfo cii : itemStats.values()) {
            if (cii.getId() == itemid) {
                return cii;
            }
        }
        return null;
    }

    public final List<Integer> getPackageItems(int itemId) {
        return itemPackage.get(itemId);
    }

    public final CashModInfo getModInfo(int sn) {
        return itemMods.get(sn);
    }

    public final Collection<CashModInfo> getAllModInfo() {
        return itemMods.values();
    }

    public final int[] getBestItems() {
        return bestItems;
    }

    public boolean containsKMSNewItems(int sN) {
        return getDonateSN().contains(sN);
    }

    public boolean isIncubator(int sN) {
        return getIncubatorSN().contains(sN);
    }
}
