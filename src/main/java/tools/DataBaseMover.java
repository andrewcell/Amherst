/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools;

import client.inventory.Pet;
import constants.GameConstants;
import database.DatabaseConnection;
import database.DatabaseConnection_XE;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicInteger;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import provider.MapleDataType;
import server.ItemInformation;
import server.MapleItemInformationProvider;
import server.ServerProperties;
import server.maps.SavedLocationType;

/**
 *
 * @author
 */
public class DataBaseMover {

    private static final Map<Integer, CharacterInfo> charinfos = new LinkedHashMap<Integer, CharacterInfo>();
    private static final Map<Integer, AccountInfo> accinfos = new LinkedHashMap<Integer, AccountInfo>();
    private static MapleItemInformationProvider ii = null;
    private static boolean noCommit = true;

    public static void main(String[] args) throws Exception {
        MapleItemInformationProvider.getInstance().runItems();
        ii = MapleItemInformationProvider.getInstance();

        Connection to = DatabaseConnection.getConnection();
        Connection from = DatabaseConnection_XE.getConnection();
        to.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
        to.setAutoCommit(false);
        from.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
        from.setAutoCommit(false);

        AtomicInteger count = new AtomicInteger(0);
        long start = System.currentTimeMillis();
        PreparedStatement ps;
        PreparedStatement add;
        PreparedStatement add2;
        PreparedStatement bdd;
        PreparedStatement bdd2;
        PreparedStatement cdd;
        ResultSet rs;
        int total = 0;

        delTableContents("accounts");
        total = getTotalRows("SELECT COUNT(*) FROM accounts");
        ps = from.prepareStatement("SELECT * FROM accounts");
        add = to.prepareStatement("INSERT INTO accounts (`id`, `name`, `password`, `gm`, `ACash`, `gender`, `banned`, `banreason`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (rs.getInt("id") != 30 && rs.getInt("id") != 2394) {
                continue;
            }
            add.setInt(1, rs.getInt("id"));
            add.setString(2, rs.getString("email"));
            add.setString(3, rs.getString("password"));
            add.setInt(4, rs.getInt("gm"));
            PreparedStatement getcash = from.prepareStatement("SELECT itemuid FROM sinventory WHERE aid = ? AND slot = ? AND invtype = ? AND world = 0");
            getcash.setInt(1, rs.getInt("id"));
            getcash.setInt(2, 10002);
            getcash.setInt(3, 7);
            ResultSet getcs = getcash.executeQuery();
            int cash = 0;
            if (getcs.next()) {
                add.setInt(5, getcs.getInt("itemuid")); //cash
                cash = getcs.getInt("itemuid");
            } else {
                add.setInt(5, 0);
            }
            getcs.close();
            add.setInt(6, rs.getInt("gender"));
            add.setInt(7, rs.getInt("ban") > 0 ? 1 : 0);
            add.setInt(8, rs.getInt("ban"));
            AccountInfo accinfo = new AccountInfo();
            accinfo.cash = cash;
            accinfos.put(rs.getInt("id"), accinfo);
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Account] " + rs.getString("email") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }

        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("accountswait");
        total = getTotalRows("SELECT COUNT(*) FROM accountswait");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM accountswait");
        add = to.prepareStatement("INSERT INTO accountswait(`id`, `email`, `password`, `gender`, `sended`, `authcode`) VALUES (?, ?, ?, ?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            add.setInt(1, rs.getInt("id"));
            add.setString(2, rs.getString("email"));
            add.setString(3, rs.getString("password"));
            add.setInt(4, rs.getInt("gender"));
            add.setTimestamp(5, rs.getTimestamp("sended"));
            add.setString(6, rs.getString("authcode"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[AccountsWait] " + rs.getString("email") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("characters");
        total = getTotalRows("SELECT COUNT(*) FROM characters");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM characters");
        add = to.prepareStatement("INSERT INTO characters ("
                + "`id`, `accountid`, `world`, `name`, `level`, `exp`, `str`, `dex`, `luk`, `int`, "
                + "`hp`, `mp`, `maxhp`, `maxmp`, `meso`, `hpApUsed`, `job`, `skincolor`, `gender`, "
                + "`fame`, `hair`, `face`, `ap`, `map`, `spawnpoint`, `buddyCapacity`, `guildid`, "
                + "`guildrank`, `sp`) VALUES ("
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!accinfos.containsKey(rs.getInt("accountid"))) {
                count.incrementAndGet();
                continue;
            }
            add.setInt(1, rs.getInt("id"));
            add.setInt(2, rs.getInt("accountid"));
            add.setInt(3, rs.getInt("world"));
            add.setString(4, rs.getString("name"));
            add.setInt(5, rs.getInt("level"));
            add.setInt(6, rs.getInt("exp"));
            add.setInt(7, rs.getInt("str"));
            add.setInt(8, rs.getInt("dex"));
            add.setInt(9, rs.getInt("luk"));
            add.setInt(10, rs.getInt("int"));
            add.setInt(11, rs.getInt("hp"));
            add.setInt(12, rs.getInt("mp"));
            add.setInt(13, rs.getInt("maxhp"));
            add.setInt(14, rs.getInt("maxmp"));
            add.setInt(15, rs.getInt("meso"));
            add.setInt(16, rs.getInt("hpapused") + rs.getInt("mpapused"));
            add.setInt(17, rs.getInt("job"));
            add.setInt(18, rs.getInt("skin"));
            add.setInt(19, rs.getInt("gender"));
            add.setInt(20, rs.getInt("fame"));
            add.setInt(21, rs.getInt("hair"));
            add.setInt(22, rs.getInt("face"));
            add.setInt(23, rs.getInt("ap"));
            add.setInt(24, rs.getInt("map"));
            add.setInt(25, rs.getInt("startpoint"));
            add.setInt(26, rs.getInt("buddycapacity"));
            add.setInt(27, rs.getInt("guildid") == -1 ? 0 : rs.getInt("guildid"));
            add.setInt(28, rs.getInt("guildrank") == -1 ? 5 : rs.getInt("guildrank"));
            add.setString(29, rs.getInt("sp") + ",0,0,0,0,0,0,0,0,0");
            CharacterInfo cinfo = new CharacterInfo();
            cinfo.accountid = rs.getInt("accountid");
            cinfo.name = rs.getString("name");
            charinfos.put(Integer.valueOf(rs.getInt("id")), cinfo);
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Character] " + rs.getString("name") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("buddies");
        total = getTotalRows("SELECT COUNT(*) FROM buddy");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM buddy");
        add = to.prepareStatement("INSERT INTO buddies (characterid, buddyid, pending) VALUES (?, ?, 0)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("charid1"))) || !charinfos.containsKey(Integer.valueOf(rs.getInt("charid2")))) {
                if (!noCommit) {
                    System.out.println("[Buddies] " + rs.getInt("id") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            if (rs.getInt("linked") == 0) {
                if (!noCommit) {
                    System.out.println("[Buddies] " + rs.getInt("id") + " Continue... - not linked [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("charid1"));
            add.setInt(2, rs.getInt("charid2"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Buddies] " + rs.getInt("id") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("gifts");
        total = getTotalRows("SELECT COUNT(*) FROM cashshopgifts");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM cashshopgifts");
        add = to.prepareStatement("INSERT INTO gifts (`recipient`, `from`, `message`, `sn`, `uniqueid`) VALUES (?, ?, ?, ?, ?) ");
        rs = ps.executeQuery();
        while (rs.next()) {
            int id = getCharIdByName(rs.getString("to"));
            if (id == -1) {
                continue;
            }
            add.setInt(1, id);
            add.setString(2, rs.getString("from"));
            add.setString(3, rs.getString("message"));
            add.setInt(4, rs.getInt("sn"));
            add.setInt(5, rs.getInt("uid1"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Cashshop Gifts] " + rs.getString("from") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("guilds");
        total = getTotalRows("SELECT COUNT(*) FROM guilds");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM guilds");
        add = to.prepareStatement("INSERT INTO guilds ("
                + "`guildid`, `leader`, `logo`, `logoColor`, `name`, "
                + "`rank1title`, `rank2title`, `rank3title`, `rank4title`, `rank5title`, "
                + "`capacity`, `logoBG`, `logoBGColor`) VALUES ("
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            add.setInt(1, rs.getInt("id"));
            add.setInt(2, rs.getInt("leaderid"));
            add.setInt(3, rs.getInt("logo"));
            add.setInt(4, rs.getInt("logoColor"));
            add.setString(5, rs.getString("name"));
            add.setString(6, rs.getString("ranktitle1"));
            add.setString(7, rs.getString("ranktitle2"));
            add.setString(8, rs.getString("ranktitle3"));
            add.setString(9, rs.getString("ranktitle4"));
            add.setString(10, rs.getString("ranktitle5"));
            add.setInt(11, rs.getInt("capacity"));
            add.setInt(12, rs.getInt("logoBG"));
            add.setInt(13, rs.getInt("logoBGColor"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Guilds] " + rs.getString("name") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("pets");
        delTableContents("rings");

        delTableContents("inventoryitems");
        delTableContents("inventoryequipment");
        delTableContents("dueyitems");
        delTableContents("dueypackages");
        total = getTotalRows("SELECT COUNT(*) FROM inventory");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM inventory LEFT JOIN items USING (itemuid) LEFT JOIN itemsequip USING (itemuid)");
        String str = "INSERT INTO inventoryitems ("
                + "`characterid`, `itemid`, `inventorytype`, `position`, "
                + "`quantity`, `owner`, `uniqueid`, `expiredate`) VALUES ("
                + "?, ?, ?, ?, "
                + "?, ?, ?, ?)";
        add = to.prepareStatement(str, Statement.RETURN_GENERATED_KEYS);
        add2 = to.prepareStatement("INSERT INTO inventoryequipment ("
                + "`inventoryitemid`, `upgradeslots`, `level`, `str`, `dex`, "
                + "`int`, `luk`, `hp`, `mp`, `watk`, "
                + "`matk`, `wdef`, `mdef`, `acc`, `avoid`, "
                + "`hands`, `speed`, `jump`) VALUES ("
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (rs.getInt("itemid") <= 0) {
                if (!noCommit) {
                    System.out.println("[Inventory] " + rs.getInt("id") + " Deleted Item [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            if (changeItem(rs.getInt("itemid"), rs.getInt("cid"), rs.getInt("quantity"), rs.getInt("itemuid"))) {
                if (!noCommit) {
                    System.out.println("[Inventory] " + rs.getInt("id") + " OK - Changed. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[Inventory] " + rs.getInt("id") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("cid"));
            add.setInt(2, rs.getInt("itemid"));
            add.setInt(3, rs.getInt("invtype") == 0 ? -1 : rs.getInt("invtype"));
            add.setInt(4, rs.getInt("slot"));
            add.setInt(5, rs.getInt("quantity"));
            add.setString(6, rs.getString("owner"));
            add.setInt(7, rs.getInt("cash") == 0 ? -1 : rs.getInt("itemuid"));
            add.setLong(8, rs.getLong("expiration"));
            if (!noCommit) {
                add.executeUpdate();
            } else {
                if (rs.getInt("itemid") == 1082002 || (rs.getInt("itemid") >= 1082145 && rs.getInt("itemid") <= 1082150)) {
                    System.out.println(add);
                }
            }
            if (rs.getInt("itemid") / 1000000 == 1) {
                if (!noCommit) {
                    ResultSet ads = add.getGeneratedKeys();
                    ads.next();
                    long inventoryitemid = ads.getLong(1);
                    add2.setLong(1, inventoryitemid);
                } else {
                    add2.setLong(1, -1);
                }
                add2.setInt(2, rs.getInt("upgradeslots"));
                add2.setInt(3, rs.getInt("upgradelevels"));
                add2.setInt(4, rs.getInt("str"));
                add2.setInt(5, rs.getInt("dex"));
                add2.setInt(6, rs.getInt("int"));
                add2.setInt(7, rs.getInt("luk"));
                add2.setInt(8, rs.getInt("hp"));
                add2.setInt(9, rs.getInt("mp"));
                add2.setInt(10, rs.getInt("watk"));
                add2.setInt(11, rs.getInt("magic"));
                add2.setInt(12, rs.getInt("pdd"));
                add2.setInt(13, rs.getInt("mdd"));
                add2.setInt(14, rs.getInt("acc"));
                add2.setInt(15, rs.getInt("avoid"));
                add2.setInt(16, rs.getInt("hands"));
                add2.setInt(17, rs.getInt("speed"));
                add2.setInt(18, rs.getInt("jumps"));
                if (!noCommit) {
                    add2.executeUpdate();
                } else {
                    if (rs.getInt("itemid") == 1082002 || (rs.getInt("itemid") >= 1082145 && rs.getInt("itemid") <= 1082150)) {
                        System.out.println(add2);
                    }
                }
            }
            if (GameConstants.isPet(rs.getInt("itemid"))) {
                PreparedStatement petp = from.prepareStatement("SELECT * FROM itemspets WHERE itemuid = ?");
                petp.setInt(1, rs.getInt("itemuid"));
                ResultSet petr = petp.executeQuery();
                if (petr.next()) {
                    PreparedStatement peti = to.prepareStatement("INSERT INTO pets (`petid`, `name`, `level`, `closeness`, `fullness`, `flags`) VALUES (?, ?, ?, ?, ?, ?)");
                    peti.setInt(1, rs.getInt("itemuid"));
                    peti.setString(2, petr.getString("name"));
                    peti.setInt(3, GameConstants.getIntForCloseness(petr.getInt("closeness")));
                    peti.setInt(4, petr.getInt("closeness"));
                    peti.setInt(5, petr.getInt("fullness"));
                    peti.setInt(6, Pet.Companion.getPetFlag(rs.getInt("itemid")));
                    if (!noCommit) {
                        peti.executeUpdate();
                    }
                    peti.close();
                } else {
                    throw new RuntimeException("uid " + rs.getInt("itemuid") + " pet is null");
                }
                petr.close();
                petp.close();
                if (!noCommit) {
                    System.out.println("[Inventory] Pet " + rs.getInt("itemuid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
                }
            }
            if (GameConstants.isEffectRing(rs.getInt("itemid"))) {
                PreparedStatement ringp = from.prepareStatement("SELECT * FROM itemsrings WHERE uid1 = ?");
                ringp.setInt(1, rs.getInt("itemuid"));
                ResultSet ringr = ringp.executeQuery();
                if (ringr.next()) {
                    if (ringr.getInt("itemid") > 0) {
                        PreparedStatement ringi = to.prepareStatement("INSERT INTO rings "
                                + "(`ringid`, `partnerRingId`, `partnerChrId`, `itemid`, `partnername`) "
                                + "VALUES (?, ?, ?, ?, ?)");
                        ringi.setInt(1, ringr.getInt("uid1"));
                        ringi.setInt(2, ringr.getInt("uid2"));
                        ringi.setInt(3, ringr.getInt("partnercid"));
                        ringi.setInt(4, ringr.getInt("itemid"));
                        ringi.setString(5, ringr.getString("partnername"));
                        if (!noCommit) {
                            ringi.executeUpdate();
                        }
                        ringi.close();
                    }
                } else {
                    PreparedStatement ps2 = to.prepareStatement("UPDATE accounts SET ACash = ACash + 5000 WHERE id = ?");
                    ps2.setInt(1, rs.getInt("aid"));
                    if (!noCommit) {
                        ps2.executeUpdate();
                    }
                    ps2.close();
                }
                ringr.close();
                ringp.close();
                if (!noCommit) {
                    System.out.println("[Inventory] Ring " + rs.getInt("itemuid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
                }
            }

            if (!noCommit) {
                System.out.println("[Inventory] " + rs.getInt("id") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        add2.close();
        ps.close();
        rs.close();

        delTableContents("csitems");
        delTableContents("csequipment");
        total = getTotalRows("SELECT COUNT(*) FROM sinventory");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM sinventory LEFT JOIN items USING (itemuid) LEFT JOIN itemsequip USING (itemuid)");
        add = to.prepareStatement("INSERT INTO inventoryitems ("
                + "`accountid`, `itemid`, `inventorytype`, `position`, "
                + "`quantity`, `owner`, `uniqueid`, `expiredate`, `type`) VALUES ("
                + "?, ?, ?, ?, "
                + "?, ?, ?, ?, 1)", Statement.RETURN_GENERATED_KEYS);
        add2 = to.prepareStatement("INSERT INTO inventoryequipment ("
                + "`inventoryitemid`, `upgradeslots`, `level`, `str`, `dex`, "
                + "`int`, `luk`, `hp`, `mp`, `watk`, "
                + "`matk`, `wdef`, `mdef`, `acc`, `avoid`, "
                + "`hands`, `speed`, `jump`) VALUES ("
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?)");

        bdd = to.prepareStatement("INSERT INTO csitems ("
                + "`accountid`, `itemid`, `inventorytype`, `position`, "
                + "`quantity`, `owner`, `uniqueid`, `expiredate`, `type`) VALUES ("
                + "?, ?, ?, ?, "
                + "?, ?, ?, ?, 2)", Statement.RETURN_GENERATED_KEYS);
        bdd2 = to.prepareStatement("INSERT INTO csequipment ("
                + "`inventoryitemid`, `upgradeslots`, `level`, `str`, `dex`, "
                + "`int`, `luk`, `hp`, `mp`, `watk`, "
                + "`matk`, `wdef`, `mdef`, `acc`, `avoid`, "
                + "`hands`, `speed`, `jump`) VALUES ("
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?,"
                + "?, ?, ?, ?, ?, "
                + "?, ?, ?)");

        cdd = to.prepareStatement("INSERT INTO storages (accountid, slots, meso) VALUES (?, 4, ?)");

        rs = ps.executeQuery();
        while (rs.next()) {

//            slot
///protected static final int STORAGE_MESO = 10001;
//   protected static final int CASHSHOP_CASH = 10002;
//   protected static final int CASHSHOP_POINTS = 10003;
//            type
//            cashshop : 7
//            storage : 6

//            창고늘리기 비용 : 3800
            if (rs.getInt("itemid") <= 0 && rs.getInt("slot") < 10000) {
                if (!noCommit) {
                    System.out.println("[SharedInventory] Deleted Item [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }

            if (!accinfos.containsKey(Integer.valueOf(rs.getInt("aid")))) {
                if (!noCommit) {
                    System.out.println("[SharedInventory] Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            if (rs.getInt("slot") >= 10001 && rs.getInt("slot") <= 10003) {
                if (rs.getInt("slot") == 10001) {
                    cdd.setInt(1, rs.getInt("aid"));
                    cdd.setInt(2, rs.getInt("itemuid"));
                    if (!noCommit) {
                        cdd.executeUpdate();
                    }
                    if (!noCommit) {
                        System.out.println("[SharedInventory] Storage Inserted OK [" + count.incrementAndGet() + "/" + total + "]");
                    }
                    continue;
                } else {
                    if (!noCommit) {
                        System.out.println("[SharedInventory] is CashPoints.. Continue. [" + count.incrementAndGet() + "/" + total + "]");
                    }
                    continue;
                }
            }
            if (rs.getInt("itemid") >= 4100000 && rs.getInt("itemid") <= 4100010) {
                PreparedStatement upd = to.prepareStatement("UPDATE accounts SET ACash = ACash + 20000 WHERE id = ?");
                upd.setInt(1, rs.getInt("aid"));
                if (!noCommit) {
                    upd.executeUpdate();
                }
                upd.close();
//                if (!noCommit) {
                    System.out.println("[SharedInventory] is ExpCoupon.. To " + rs.getInt("aid") + " Continue. [" + count.incrementAndGet() + "/" + total + "]");
//                }
                continue;
            }

            int changei = changeItem(rs.getInt("itemid"), rs.getInt("aid"), "Sinv");

            if ((rs.getInt("slot") < 10001 || rs.getInt("slot") > 10003) && changei != -1 && !noCommit) {
                System.out.println("[SharedInventory] OK - Changed. [" + count.incrementAndGet() + "/" + total + "]");
                continue;
            }
            if (changei == -1 && ii.itemExists(rs.getInt("itemid"))) {
                changei = rs.getInt("itemid");
            } else if (changei == -1 && !ii.itemExists(rs.getInt("itemid"))) {
                count.incrementAndGet();
                continue;
            }

            if (changei == -1) {
                count.incrementAndGet();
                continue;
            }

            PreparedStatement toInsert = bdd;
            PreparedStatement toInsert2 = bdd2;
            if (rs.getInt("invtype") == 6) {
                toInsert = add;
                toInsert2 = add2;
            }

            toInsert.setInt(1, rs.getInt("aid"));
            toInsert.setInt(2, changei);
            toInsert.setInt(3, rs.getInt("invtype") == 0 ? -1 : changei / 1000000);
            toInsert.setInt(4, rs.getInt("slot"));
            toInsert.setInt(5, rs.getInt("quantity"));
            toInsert.setString(6, rs.getString("owner"));
            toInsert.setInt(7, rs.getInt("cash") == 0 ? -1 : rs.getInt("itemuid"));
            toInsert.setLong(8, rs.getLong("expiration"));
            if (!noCommit) {
                toInsert.executeUpdate();
            } else {
                if (rs.getInt("itemid") == 1082002 || (rs.getInt("itemid") >= 1082145 && rs.getInt("itemid") <= 1082150)) {
                    System.out.println(toInsert);
                }
            }
            if (changei / 1000000 == 1) {
                if (!noCommit) {
                    ResultSet ads = toInsert.getGeneratedKeys();
                    ads.next();
                    long inventoryitemid = ads.getLong(1);
                    toInsert2.setLong(1, inventoryitemid);
                } else {
                    toInsert2.setLong(1, -1);
                }
                toInsert2.setInt(2, rs.getInt("upgradeslots"));
                toInsert2.setInt(3, rs.getInt("upgradelevels"));
                toInsert2.setInt(4, rs.getInt("str"));
                toInsert2.setInt(5, rs.getInt("dex"));
                toInsert2.setInt(6, rs.getInt("int"));
                toInsert2.setInt(7, rs.getInt("luk"));
                toInsert2.setInt(8, rs.getInt("hp"));
                toInsert2.setInt(9, rs.getInt("mp"));
                toInsert2.setInt(10, rs.getInt("watk"));
                toInsert2.setInt(11, rs.getInt("magic"));
                toInsert2.setInt(12, rs.getInt("pdd"));
                toInsert2.setInt(13, rs.getInt("mdd"));
                toInsert2.setInt(14, rs.getInt("acc"));
                toInsert2.setInt(15, rs.getInt("avoid"));
                toInsert2.setInt(16, rs.getInt("hands"));
                toInsert2.setInt(17, rs.getInt("speed"));
                toInsert2.setInt(18, rs.getInt("jumps"));
                if (!noCommit) {
                    toInsert2.executeUpdate();
                } else {
                if (rs.getInt("itemid") == 1082002 || (rs.getInt("itemid") >= 1082145 && rs.getInt("itemid") <= 1082150)) {
                    System.out.println(toInsert2);
                }
            }
            }
            if (GameConstants.isPet(rs.getInt("itemid"))) {
                PreparedStatement petp = from.prepareStatement("SELECT * FROM itemspets WHERE itemuid = ?");
                petp.setInt(1, rs.getInt("itemuid"));
                ResultSet petr = petp.executeQuery();
                if (petr.next()) {
                    PreparedStatement peti = to.prepareStatement("INSERT INTO pets (`petid`, `name`, `level`, `closeness`, `fullness`, `flags`) VALUES (?, ?, ?, ?, ?, ?)");
                    peti.setInt(1, rs.getInt("itemuid"));
                    peti.setString(2, petr.getString("name"));
                    peti.setInt(3, GameConstants.getIntForCloseness(petr.getInt("closeness")));
                    peti.setInt(4, petr.getInt("closeness"));
                    peti.setInt(5, petr.getInt("fullness"));
                    peti.setInt(6, Pet.Companion.getPetFlag(rs.getInt("itemid")));
                    if (!noCommit) {
                        peti.executeUpdate();
                    }
                    peti.close();
                } else {
//                    throw new RuntimeException("uid " + rs.getInt("itemuid") + " pet is null");
                    count.incrementAndGet();
                    continue;
                }
                petr.close();
                petp.close();
                if (!noCommit) {
                    System.out.println("[SharedInventory] Pet " + rs.getInt("itemuid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
                }
            }
            if (GameConstants.isEffectRing(rs.getInt("itemid"))) {
                PreparedStatement ringp = from.prepareStatement("SELECT * FROM itemsrings WHERE uid1 = ?");
                ringp.setInt(1, rs.getInt("itemuid"));
                ResultSet ringr = ringp.executeQuery();
                if (ringr.next()) {
                    if (ringr.getInt("itemid") > 0) {
                        PreparedStatement ringi = to.prepareStatement("INSERT INTO rings "
                                + "(`ringid`, `partnerRingId`, `partnerChrId`, `itemid`, `partnername`) "
                                + "VALUES (?, ?, ?, ?, ?)");
                        ringi.setInt(1, ringr.getInt("uid1"));
                        ringi.setInt(2, ringr.getInt("uid2"));
                        ringi.setInt(3, ringr.getInt("partnercid"));
                        ringi.setInt(4, ringr.getInt("itemid"));
                        ringi.setString(5, ringr.getString("partnername"));
                        if (!noCommit) {
                            ringi.executeUpdate();
                        }
                        ringi.close();
                    }
                } else {
                    PreparedStatement ps2 = to.prepareStatement("UPDATE accounts SET ACash = ACash + 5000 WHERE id = ?");
                    ps2.setInt(1, rs.getInt("aid"));
                    if (!noCommit) {
                        ps2.executeUpdate();
                    }
                    ps2.close();
                }
                ringr.close();
                ringp.close();
                if (!noCommit) {
                    System.out.println("[Inventory] Ring " + rs.getInt("itemuid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
                }
            }
            if (!noCommit) {
                System.out.println("[SharedInventory] OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        add2.close();
        bdd.close();
        bdd2.close();
        cdd.close();
        ps.close();
        rs.close();



        delTableContents("inventoryslot");
        total = getTotalRows("SELECT COUNT(*) FROM inventoryslots");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM inventoryslots");
        add = to.prepareStatement("INSERT INTO inventoryslot (`characterid`, `equip`, `use`, `setup`, `etc`, `cash`) VALUES (?, ?, ?, ?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[InventorySlots] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("cid"));
            add.setInt(2, rs.getInt("equip"));
            add.setInt(3, rs.getInt("use"));
            add.setInt(4, rs.getInt("setup"));
            add.setInt(5, rs.getInt("etc"));
            add.setInt(6, 60);
            if (rs.getInt("storage") > 4) {
                PreparedStatement upd = to.prepareStatement("UPDATE accounts SET ACash = ACash + 3800 WHERE id = ?");
                upd.setInt(1, DataBaseMover.getAccIdByCharID(rs.getInt("cid")));
                if (!noCommit) {
                    upd.executeUpdate();
                }
                upd.close();
                if (!noCommit) {
                    System.out.println("[InventorySlot] Her/His Storage Added . Given 3800 cash to " + rs.getInt("cid") + "'s account.");
                }
            }
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[InventorySlots] " + rs.getInt("cid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("ipbans");
        total = getTotalRows("SELECT COUNT(*) FROM ipbans");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM ipbans");
        add = to.prepareStatement("INSERT INTO ipbans (`ip`) VALUES (?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            add.setString(1, rs.getString("ip"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[IPBAN] " + rs.getString("ip") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("notes");
        total = getTotalRows("SELECT COUNT(*) FROM memo");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM memo");
        add = to.prepareStatement("INSERT INTO notes (`from`, `to`, `message`, `timestamp`) VALUES (?, ?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            add.setString(1, rs.getString("sender"));
            add.setString(2, rs.getString("receiver"));
            add.setString(3, rs.getString("message"));
            add.setLong(4, rs.getTimestamp("time").getTime());
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Notes] " + rs.getString("message") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();


        delTableContents("skills");
        total = getTotalRows("SELECT COUNT(*) FROM skills");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM skills");
        add = to.prepareStatement("INSERT INTO skills (skillid, characterid, skilllevel, masterlevel, expiration) VALUES (?, ?, ?, 0, -1)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[Skills] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("skillid"));
            add.setInt(2, rs.getInt("cid"));
            add.setInt(3, rs.getInt("skilllevel"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[Skills] " + rs.getInt("cid") + " - " + rs.getInt("skillid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("wishlist");
        total = getTotalRows("SELECT COUNT(*) FROM wish");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM wish");
        add = to.prepareStatement("INSERT INTO wishlist (characterid, sn) VALUES (?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[WishList] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("cid"));
            add.setInt(2, rs.getInt("sn"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[WishList] " + rs.getInt("cid") + " - " + rs.getInt("sn") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("regrocklocations");
        total = getTotalRows("SELECT COUNT(*) FROM teleportrocks");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM teleportrocks");
        add = to.prepareStatement("INSERT INTO regrocklocations (characterid, mapid) VALUES (?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[TeleportRock] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            String[] pos = rs.getString("maps").split(",");
            for (String map : pos) {
                if (!map.equals("999999999")) {
                    add.setInt(1, rs.getInt("cid"));
                    add.setInt(2, Integer.parseInt(map));
                    if (!noCommit) {
                        add.executeUpdate();
                    }
                }
            }
            if (!noCommit) {
                System.out.println("[TeleportRock] " + rs.getInt("cid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("savedlocations");
        total = getTotalRows("SELECT COUNT(*) FROM previouslocation");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM previouslocation");
        add = to.prepareStatement("INSERT INTO savedlocations (characterid, locationtype, `map`) VALUES (?, ?, ?)");
        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[SavedLocation] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("cid"));
            int type = -1;
            if (rs.getString("type").equals("MARKET")) {
                type = SavedLocationType.FREE_MARKET.getValue();
            } else if (rs.getString("type").equals("FLORINA")) {
                type = SavedLocationType.FLORINA.getValue();
            } else if (rs.getString("type").equals("CHRISTMAS")) {
                type = SavedLocationType.CHRISTMAS.getValue();
            } else {
                if (!noCommit) {
                    System.out.println("[SavedLocation] " + rs.getInt("cid") + " is Not SavedLocation.. continue [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            if (type == -1) {
                if (!noCommit) {
                    System.out.println("[SavedLocation] " + rs.getInt("cid") + " is Not SavedLocation.. continue [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(2, type);
            add.setInt(3, rs.getInt("map"));
            if (!noCommit) {
                add.executeUpdate();
            }
            if (!noCommit) {
                System.out.println("[SavedLocation] " + rs.getInt("cid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        delTableContents("queststatus");
        delTableContents("queststatusmobs");
        total = getTotalRows("SELECT COUNT(*) FROM quests");
        count.set(0);
        ps = from.prepareStatement("SELECT * FROM quests");
        add = to.prepareStatement("INSERT INTO queststatus (characterid, quest, `status`, `time`, `customData`) VALUES (?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);

        rs = ps.executeQuery();
        while (rs.next()) {
            if (!charinfos.containsKey(Integer.valueOf(rs.getInt("cid")))) {
                if (!noCommit) {
                    System.out.println("[Quest] " + rs.getInt("cid") + " Continue... - did not cache. [" + count.incrementAndGet() + "/" + total + "]");
                }
                continue;
            }
            add.setInt(1, rs.getInt("cid"));
            add.setInt(2, rs.getInt("questid"));
            add.setInt(3, rs.getInt("status"));
            add.setInt(4, (int) (rs.getLong("end") / 1000));
            if (rs.getString("data") == null || rs.getString("data").isEmpty()) {
                add.setNull(5, java.sql.Types.VARCHAR);
            } else {
                add.setString(5, rs.getString("data"));
            }
            if (!noCommit) {
                add.executeUpdate();
                ResultSet addr = add.getGeneratedKeys();
                addr.next();
                int qstatusid = addr.getInt(1);
                add2 = from.prepareStatement("SELECT * FROM questmobs WHERE questid = ? AND cid = ?");
                add2.setInt(1, rs.getInt("questid"));
                add2.setInt(2, rs.getInt("cid"));
                ResultSet add2r = add2.executeQuery();
                if (add2r.next()) {
                    bdd = to.prepareStatement("INSERT INTO queststatusmobs (queststatusid, mob, `count`) VALUES (?, ?, ?)");
                    bdd.setInt(1, qstatusid);
                    bdd.setInt(2, add2r.getInt("mob"));
                    bdd.setInt(3, add2r.getInt("count"));
                    if (!noCommit) {
                        bdd.executeUpdate();
                    }
                    bdd.close();
                }
                add2r.close();
                add2.close();
                addr.close();
            }
            if (!noCommit) {
                System.out.println("[Quest] " + rs.getInt("cid") + " - " + rs.getInt("questid") + " OK [" + count.incrementAndGet() + "/" + total + "]");
            }
        }
        add.close();
        ps.close();
        rs.close();

        to.commit();

        from.setAutoCommit(true);
        from.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
        to.setAutoCommit(true);
        to.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
        System.out.println("[Complete] Job Complete in " + (System.currentTimeMillis() - start) + "ms.");

    }

    private static int getCharIdByName(String name) {
        int id = -1;
        for (Entry<Integer, CharacterInfo> cinfos : charinfos.entrySet()) {
            if (cinfos.getValue().name.equalsIgnoreCase(name)) {
                id = cinfos.getKey();
                break;
            }
        }
        return id;
    }

    private static int getAccIdByCharID(int cid) {
        return charinfos.get(cid).accountid;
    }

    private static int getTotalRows(String query) {
        try {
            Connection from = DatabaseConnection_XE.getConnection();
            PreparedStatement totalCount = from.prepareStatement(query);
            ResultSet totalrs = totalCount.executeQuery();
            totalrs.next();
            int total = totalrs.getInt(1);
            totalCount.close();
            totalrs.close();
            return total;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    private static void delTableContents(String query) {
        try {
            Connection to = DatabaseConnection.getConnection();
            PreparedStatement totalCount = to.prepareStatement("DELETE FROM " + query);
            if (!noCommit) {
                totalCount.executeUpdate();
            }
            totalCount.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private static final Map<Integer, Integer> changeitems = new HashMap<Integer, Integer>();
    private static final Map<Integer, String> itemnames = new HashMap<Integer, String>();

    static {
        changeitems.put(4100000, 4031119);
        changeitems.put(4100001, 4031119);
        changeitems.put(4100002, 4031119);
        changeitems.put(4100003, 4031119);
        changeitems.put(4100004, 4031119);
        changeitems.put(4100005, 4031119);
        changeitems.put(4100006, 4031119);
        changeitems.put(4100007, 4031119);
        changeitems.put(4100008, 4031119);
        changeitems.put(4100009, 4031119);
        changeitems.put(2170000, 5040000);
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/String"));
        for (MapleData d : pro.getData("Item.img")) {
            for (MapleData d2 : d.getChildren()) {
                if (d2.getType() == MapleDataType.PROPERTY) {
                    for (MapleData d3 : d2.getChildren()) {
                        if (MapleDataType.PROPERTY == d3.getType()) {
                            itemnames.put(Integer.valueOf(Integer.parseInt(d3.getName())), MapleDataTool.getString(d3.getChildByPath("name")));
                        } else if ((MapleDataType.STRING == d3.getType()) && (d3.getName().equals("name"))) {
                            itemnames.put(Integer.valueOf(Integer.parseInt(d2.getName())), MapleDataTool.getString(d3));
                        }
                    }
                }
            }
        }
    }

    private static boolean changeItem(int itemid, int charid, int quantity, int uid) {
        if (!ii.itemExists(itemid)) {
            if (!changeitems.containsKey(itemid)) {
                for (ItemInformation iff : ii.getAllItems()) {
                    if (iff.name.equalsIgnoreCase(itemnames.get(itemid))) {
                        if (itemid < 2000000) {
                            continue;
                        }
                        changeitems.put(itemid, iff.itemId);
                        if (!noCommit) {
                            System.out.println("[Items] Found Changed Item Code : " + itemid + " (" + itemnames.get(itemid) + ") -> " + iff.itemId + " (" + iff.name + " )");
                        }
                        break;
                    }
                }
            }
            if (!changeitems.containsKey(itemid)) {
                error(itemid, charid, "CharacterInv");
                return true;
            }
            int newitemid = changeitems.get(itemid);
            try {
                Connection con = DatabaseConnection.getConnection();
                PreparedStatement ps = con.prepareStatement("INSERT INTO dueypackages (RecieverId, SenderName, content, Quick, TimeStamp, Type) VALUES (?, ?, ?, 1, ?, 2)", Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, charid);
                ps.setString(2, "[시스템]");
                ps.setString(3, "아이템이 변경되어 대신 지급된 아이템 입니다. (" + ii.getName(newitemid) + ")");
                ps.setLong(4, System.currentTimeMillis());
                if (!noCommit) {
                    ps.executeUpdate();
                    ResultSet r = ps.getGeneratedKeys();
                    r.next();
                    int packid = r.getInt(1);
                    ps.close();
                    r.close();
                    ps = con.prepareStatement("INSERT INTO dueyitems (characterid, packageid, itemid, inventorytype, quantity, uniqueid, `type`) VALUES (?, ?, ?, ?, ?, ?, 6)");
                    ps.setInt(1, charid);
                    ps.setInt(2, packid);
                    ps.setInt(3, newitemid);
                    ps.setInt(4, newitemid / 1000000);
                    ps.setInt(5, quantity);
                    ps.setInt(6, ii.isCash(newitemid) ? uid : -1);
                    ps.executeUpdate();
                }
                ps.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return true;
        }
        return false;
    }

    private static void error(int itemid, int cid, String type) {
        try {
            File out = new File("f.txt");
            FileOutputStream fos = new FileOutputStream(out, true);
            String str = "Error : " + itemid + " to " + cid + " ( Type : " + type + " ) \r\n";
            fos.write(str.getBytes(Charset.forName("UTF-8")));
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static int changeItem(int itemid, int cid, String type) {
        if (!ii.itemExists(itemid)) {
            if (!changeitems.containsKey(itemid)) {
                for (ItemInformation iff : ii.getAllItems()) {
                    if (iff.name.equalsIgnoreCase(itemnames.get(itemid))) {
                        if (itemid < 2000000) {
                            continue;
                        }
                        changeitems.put(itemid, iff.itemId);
                        if (!noCommit) {
                            System.out.println("[Items] Found Changed Item Code : " + itemid + " (" + itemnames.get(itemid) + ") -> " + iff.itemId + " (" + iff.name + " )");
                        }
                        break;
                    }
                }
            }
            if (!changeitems.containsKey(itemid)) {
                error(itemid, cid, type);
                return -1;
            }
            int newitemid = changeitems.get(itemid);
            return newitemid;
        }
        return -1;
    }

    private static class CharacterInfo {

        protected String name;
        protected int accountid;
    }

    private static class AccountInfo {

        protected int cash;
    }
}
