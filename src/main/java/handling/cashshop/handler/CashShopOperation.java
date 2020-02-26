package handling.cashshop.handler;

import client.MapleCharacter;
import client.MapleCharacterUtil;
import client.MapleClient;
import client.inventory.Item;
import client.inventory.MapleInventoryIdentifier;
import client.inventory.MapleInventoryType;
import client.inventory.MapleRing;
import constants.GameConstants;
import handling.cashshop.CashShopServer;
import handling.channel.ChannelServer;
import handling.login.LoginServer;
import handling.world.CharacterTransfer;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PartyOperation;
import handling.world.World;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import server.CashItemFactory;
import server.CashItemInfo;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.log.DBLogger;
import server.log.LogType;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.Triple;
import tools.data.LittleEndianAccessor;
import tools.packet.CSPacket;

public class CashShopOperation {

    public static void LeaveCS(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        chr.goDonateShop(false);
        CashShopServer.getPlayerStorage().deregisterPlayer(chr);
        c.updateLoginState(MapleClient.LOGIN_SERVER_TRANSITION, c.getSessionIPAddress());
        try {
//            System.out.println("goDonate : "+chr.isDonateShop());
//            System.out.println("acash : "+chr.getCSPoints(1) + " maplepoint : "+chr.getCSPoints(2));
            World.ChannelChange_Data(new CharacterTransfer(chr), chr.getId(), c.getChannel());
//            System.out.println("acash : "+chr.getCSPoints(1) + " maplepoint : "+chr.getCSPoints(2));

            LoginServer.setCodeHash(chr.getId(), c.getCodeHash());
            c.getSession().write(MaplePacketCreator.getChannelChange(c, Integer.parseInt(ChannelServer.getInstance(c.getChannel()).getIP().split(":")[1])));
        } finally {
            final String s = c.getSessionIPAddress();
            LoginServer.addIPAuth(s.substring(s.indexOf('/') + 1, s.length()));
            chr.saveToDB(false, true);
            c.setPlayer(null);
            c.setReceiving(false);
            //c.getSession().close();
        }
    }

    public static void CashShopEnter(final int playerid, final MapleClient c) {
        if (CashShopServer.isShutdown()) {
            c.getSession().close(true);
            return;
        }
        CharacterTransfer transfer = CashShopServer.getPlayerStorage().getPendingCharacter(playerid);
//        boolean mts = false;
//        if (transfer == null) {
//            transfer = CashShopServer.getPlayerStorageMTS().getPendingCharacter(playerid);
//            mts = true;
//            if (transfer == null) {
//                c.getSession().close();
//                return;
//            }
//        }
        MapleCharacter chr = MapleCharacter.ReconstructChr(transfer, c, false);

        c.setPlayer(chr);
        c.setAccID(chr.getAccountID());

        if (!c.CheckIPAddress()) { // Remote hack
            c.getSession().close(true);
            return;
        }

        final int state = c.getLoginState();
        boolean allowLogin = false;
        if (state == MapleClient.LOGIN_SERVER_TRANSITION || state == MapleClient.CHANGE_CHANNEL) {
            if (!World.isCharacterListConnected(c.loadCharacterNames(c.getWorld()))) {
                allowLogin = true;
            }
        }
        if (!allowLogin) {
            c.setPlayer(null);
            c.getSession().close(true);
            return;
        }
        c.updateLoginState(MapleClient.LOGIN_LOGGEDIN, c.getSessionIPAddress());
//        if (mts) {
//            CashShopServer.getPlayerStorageMTS().registerPlayer(chr);
//            c.getSession().write(MTSCSPacket.startMTS(chr));
//	    final MTSCart cart = MTSStorage.getInstance().getCart(c.getPlayer().getId());
//	    cart.refreshCurrentView();
//            MTSOperation.MTSUpdate(cart, c);
//        } else {ㅅ
        if (chr.getParty() != null) {
            final MapleParty party = chr.getParty();
            World.Party.updateParty(party.getId(), PartyOperation.LOG_ONOFF, new MaplePartyCharacter(chr));
        }
        CashShopServer.getPlayerStorage().registerPlayer(chr);
        c.getSession().write(CSPacket.warpCS(c));
        CSUpdate(c);
        if (c.getPlayer().isDonateShop()) {
            c.getSession().write(MaplePacketCreator.musicChange("Bgm25/Title_Japan"));
        }
//        }

    }

    public static final void doCSPackets(MapleClient c) {
        c.getSession().write(CSPacket.enableCSUse());
        c.getSession().write(CSPacket.showNXMapleTokens(c.getPlayer()));
        c.getSession().write(CSPacket.getCSInventory(c));
        c.getPlayer().getCashInventory().checkExpire(c);
    }

    public static void CSUpdate(final MapleClient c) {
        c.getSession().write(CSPacket.getCSGifts(c));
        doCSPackets(c);
        c.getSession().write(CSPacket.sendWishList(c.getPlayer(), false));
    }

    public static void CouponCode(final String code, final MapleClient c) {
        if (code.length() <= 0) {
            return;
        }
        Triple<Boolean, Integer, Integer> info = null;
        try {
            info = MapleCharacterUtil.getNXCodeInfo(code);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (info != null && info.left) {
            int type = info.mid, item = info.right;
            try {
                MapleCharacterUtil.setNXCodeUsed(c.getPlayer().getName(), code);
            } catch (Exception e) {
                e.printStackTrace();
            }
            /*
             * Explanation of type!
             * Basically, this makes coupon codes do
             * different things!
             *
             * Type 1: A-Cash,
             * Type 2: Maple Points
             * Type 3: Item.. use SN
             * Type 4: Mesos
             */
            Map<Integer, Item> itemz = new HashMap<Integer, Item>();
            int maplePoints = 0, mesos = 0;
            switch (type) {
                case 1:
                case 2:
                    c.getPlayer().modifyCSPoints(type, item, false);
                    maplePoints = item;
                    break;
                case 3:
                    CashItemInfo itez = CashItemFactory.getInstance().getItem(item);
                    if (itez == null) {
                        c.getSession().write(CSPacket.sendCSFail(0));
                        return;
                    }
                    byte slot = MapleInventoryManipulator.addId(c, itez.getId(), (short) 1, "", "Cash shop: coupon code" + " on " + FileoutputUtil.CurrentReadable_Date());
                    if (slot <= -1) {
                        c.getSession().write(CSPacket.sendCSFail(0));
                        return;
                    } else {
                        itemz.put(item, c.getPlayer().getInventory(GameConstants.getInventoryType(item)).getItem(slot));
                    }
                    break;
                case 4:
                    c.getPlayer().gainMeso(item, false);
                    mesos = item;
                    break;
            }
            c.getSession().write(CSPacket.showCouponRedeemedItem(itemz, mesos, maplePoints, c));
        } else {
            c.getSession().write(CSPacket.sendCSFail(info == null ? 129 : 131)); //A1, 9F
        }
    }

    public static final void BuyCashItem(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        final int action = slea.readByte();
        if (action == 0) {
            slea.skip(2);
            CouponCode(slea.readMapleAsciiString(), c);
        } else if (action == 3) { //buy  1.2.65 OK
            //slea.skip(1);
            final int toCharge = slea.readByte() + 1;
            int sn = slea.readInt();
            final CashItemInfo item = CashItemFactory.getInstance().getItem(sn);

            if (item != null && chr.getCSPoints(toCharge) >= item.getPrice()) {
                if (!item.genderEquals(c.getPlayer().getGender())) {
                    c.getSession().write(CSPacket.sendCSFail(130));
                    doCSPackets(c);
                    return;
                } else if (c.getPlayer().getCashInventory().getItemsSize() >= 100) {
                    c.getSession().write(CSPacket.sendCSFail(129));
                    doCSPackets(c);
                    return;
                }

                if (!c.getPlayer().isDonateShop() && CashItemFactory.getInstance().containsKMSNewItems(sn)) {
                    c.getPlayer().dropMessage(1, "이 아이템을 구매할 수 없습니다.");
                    doCSPackets(c);
                    return;
                }

                for (int i : GameConstants.cashBlock) {
                    if (item.getId() == i) {
                        c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
                        doCSPackets(c);
                        return;
                    }
                }
                chr.modifyCSPoints(toCharge, -item.getPrice(), false);
                Item itemz = chr.getCashInventory().toItem(item);
                if (itemz != null && itemz.getUniqueId() > 0 && itemz.getItemId() == item.getId() && itemz.getQuantity() == item.getCount()) {
                    chr.getCashInventory().addToInventory(itemz);
                    //c.getSession().write(MTSCSPacket.confirmToCSInventory(itemz, c.getAccID(), item.getSN()));
                    c.getSession().write(CSPacket.showBoughtCSItem(itemz, item.getSN(), c.getAccID()));
                } else {
                    c.getSession().write(CSPacket.sendCSFail(0));
                }
            } else {
                c.getSession().write(CSPacket.sendCSFail(0));
            }
        } else if (action == 4 || action == 0x1E) { //gift, package    1.2.65 OK
            if (c.getPlayer().isGM() && !c.getPlayer().isSuperGM()) {
                c.getPlayer().dropMessage(1, "GM은 캐시를 선물할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            slea.skip(4); //idcode 2
            final CashItemInfo item = CashItemFactory.getInstance().getItem(slea.readInt());

            String partnerName = slea.readMapleAsciiString();
            String msg = slea.readMapleAsciiString();
            if (item == null || c.getPlayer().getCSPoints(1) < item.getPrice() || msg.length() > 73 || msg.length() < 1) { //dont want packet editors gifting random stuff =P
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            }
            if (!c.getPlayer().isDonateShop() && CashItemFactory.getInstance().containsKMSNewItems(item.getSN())) {
                c.getPlayer().dropMessage(1, "이 아이템을 구매할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            Triple<Integer, Integer, Integer> info = MapleCharacterUtil.getInfoByName(partnerName, c.getPlayer().getWorld());
            if (info == null || info.getLeft().intValue() <= 0 || info.getLeft().intValue() == c.getPlayer().getId() || info.getMid().intValue() == c.getAccID()) {
                c.getSession().write(CSPacket.sendCSFail(130)); //9E v75
                doCSPackets(c);
                return;
            } else if (!item.genderEquals(info.getRight().intValue())) {
                c.getSession().write(CSPacket.sendCSFail(130));
                doCSPackets(c);
                return;
            } else {

//                List<Integer> ccc = null;
//                if (item != null) {
//                    ccc = CashItemFactory.getInstance().getPackageItems(item.getId());
//                }
//                if (ccc == null) {
//                    c.getSession().write(CSPacket.sendCSFail(0));
//                    doCSPackets(c);
//                    return;
//                }
//                for (int z : ccc) {
//                    for (int i : GameConstants.cashBlock) {
//                        if (z == i) {
//                            c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
//                            doCSPackets(c);
//                            return;
//                        }
//                    }
//                }
                c.getPlayer().getCashInventory().gift(info.getLeft().intValue(), c.getPlayer().getName(), msg, item.getSN(), MapleInventoryIdentifier.getInstance());
                DBLogger.getInstance().logTrade(LogType.Trade.CashShopGift, c.getPlayer().getId(), c.getPlayer().getName(), partnerName, "시리얼 넘버 : " + item.getSN() + " - " + item.getCount() + " 개 / 캐시 : " + item.getPrice(), (c.getPlayer().isDonateShop() ? "후원캐시샵" : "일반캐시샵") + " / 메시지 : " + msg);

                c.getPlayer().modifyCSPoints(1, -item.getPrice(), false);
                c.getSession().write(CSPacket.sendGift(item.getPrice(), item.getId(), item.getCount(), partnerName));
                MapleCharacterUtil.sendNote(partnerName, c.getPlayer().getName(), "캐시샵에 선물이 도착했습니다. 확인해 주세요.", 0);
            }
        } else if (action == 5) { // Wishlist  1.2.65 OK
            chr.clearWishlist();
            if (slea.available() < 40) {
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            }
            int[] wishlist = new int[10];
            for (int i = 0; i < 10; i++) {
                wishlist[i] = slea.readInt();
            }
            chr.setWishlist(wishlist);
            c.getSession().write(CSPacket.sendWishList(chr, true));

        } else if (action == 6) { // Increase inv  1.2.65 OK
            //slea.skip(1);
            final int toCharge = slea.readByte() + 1;
            final boolean coupon = slea.readByte() > 0;
            if (coupon) {
                final MapleInventoryType type = getInventoryType(slea.readInt());

                if (chr.getCSPoints(toCharge) >= 7600 && chr.getInventory(type).getSlotLimit() <= 88) {
                    chr.modifyCSPoints(toCharge, -7600, false);
                    chr.getInventory(type).addSlot((byte) 8);
                    c.getSession().write(CSPacket.increasedInvSlots(type.getType(), chr.getInventory(type).getSlotLimit()));
                    //chr.dropMessage(1, "Slots has been increased to " + chr.getInventory(type).getSlotLimit());
                } else {
                    c.getSession().write(CSPacket.sendCSFail(141));
                }
            } else {
                final MapleInventoryType type = MapleInventoryType.getByType(slea.readByte());

                if (chr.getCSPoints(toCharge) >= 3800 && chr.getInventory(type).getSlotLimit() <= 92) {
                    chr.modifyCSPoints(toCharge, -3800, false);
                    chr.getInventory(type).addSlot((byte) 4);
                    c.getSession().write(CSPacket.increasedInvSlots(type.getType(), chr.getInventory(type).getSlotLimit()));
                    //chr.dropMessage(1, "Slots has been increased to " + chr.getInventory(type).getSlotLimit());
                } else {
                    c.getSession().write(CSPacket.sendCSFail(141));
                }
            }

        } else if (action == 7) { // Increase slot space   1.2.65 OK
            //slea.skip(1);
            final int toCharge = slea.readByte() + 1;
            final int coupon = slea.readByte() > 0 ? 2 : 1;
            if (chr.getCSPoints(toCharge) >= 3800 * coupon && chr.getStorage().getSlots() <= (48 - (4 * coupon))) {
                chr.modifyCSPoints(toCharge, -3800 * coupon, false);
                chr.getStorage().increaseSlots((byte) (4 * coupon));
                chr.getStorage().saveToDB();
                c.getSession().write(CSPacket.increasedStorageSlots(chr.getStorage().getSlots()));
                //chr.dropMessage(1, "Storage slots increased to: " + chr.getStorage().getSlots());
            } else {
                c.getSession().write(CSPacket.sendCSFail(141));
            }
        } else if (action == 8) { //...9 = pendant slot expansion  1.2.65 OK
            slea.skip(1);
            final int toCharge = 1;
            CashItemInfo item = CashItemFactory.getInstance().getItem(slea.readInt());
            int slots = c.getCharacterSlots();
            if (item == null || c.getPlayer().getCSPoints(toCharge) < item.getPrice() || slots > 15 || item.getId() != 5430000) {
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            }
            if (c.gainCharacterSlot()) {
                c.getPlayer().modifyCSPoints(toCharge, -item.getPrice(), false);
                c.sendPacket(CSPacket.increasedCharacterSlots(slots + 1));
            } else {
                c.getSession().write(CSPacket.sendCSFail(0));
            }
//        } else if (action == 9) { //...9 = pendant slot expansion
//            slea.readByte();
//            final int sn = slea.readInt();
//            CashItemInfo item = CashItemFactory.getInstance().getItem(sn);
//            int slots = c.getCharacterSlots();
//            if (item == null || c.getPlayer().getCSPoints(1) < item.getPrice() || item.getId() / 10000 != 555) {
//                c.getSession().write(MTSCSPacket.sendCSFail(0));
//                doCSPackets(c);
//                return;
//            }
//            MapleQuestStatus marr = c.getPlayer().getQuestNoAdd(MapleQuest.getInstance(GameConstants.PENDANT_SLOT));
//            if (marr != null && marr.getCustomData() != null && Long.parseLong(marr.getCustomData()) >= System.currentTimeMillis()) {
//                c.getSession().write(MTSCSPacket.sendCSFail(0));
//            } else {
//                c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.PENDANT_SLOT)).setCustomData(String.valueOf(System.currentTimeMillis() + ((long) item.getPeriod() * 24 * 60 * 60000)));
//                c.getPlayer().modifyCSPoints(1, -item.getPrice(), false);
//                chr.dropMessage(1, "Additional pendant slot gained.");
//            }
        } else if (action == 12) { //get item from csinventory 1.2.65 OK
            //uniqueid, 00 01 01 00, type->position(short)
            Item item = c.getPlayer().getCashInventory().findByCashId((int) slea.readLong());
            if (item != null && item.getQuantity() > 0 && MapleInventoryManipulator.checkSpace(c, item.getItemId(), item.getQuantity(), item.getOwner())) {
                Item item_ = item.copy();
                short pos = MapleInventoryManipulator.addbyItem(c, item_, true);
                if (pos >= 0) {
                    if (item_.getPet() != null) {
                        item_.getPet().setInventoryPosition(pos);
                        c.getPlayer().addPet(item_.getPet());
                    }
                    c.getPlayer().getCashInventory().removeFromInventory(item);
                    c.getSession().write(CSPacket.confirmFromCSInventory(item_, pos));
                } else {
                    c.getSession().write(CSPacket.sendCSFail(0));
                    System.out.println("pos가 0보다 작아");
                }
            } else {
                c.getSession().write(CSPacket.sendCSFail(0));
                System.out.println((item != null) + " " + (item.getQuantity() > 0) + " " + MapleInventoryManipulator.checkSpace(c, item.getItemId(), item.getQuantity(), item.getOwner()));
            }
        } else if (action == 13) { //put item in cash inventory  1.2.65 OK
            int uniqueid = (int) slea.readLong();
            MapleInventoryType type = MapleInventoryType.getByType(slea.readByte());
            Item item = c.getPlayer().getInventory(type).findByUniqueId(uniqueid);
            if (item != null && item.getQuantity() > 0 && item.getUniqueId() > 0 && c.getPlayer().getCashInventory().getItemsSize() < 100) {
                Item item_ = item.copy();
                MapleInventoryManipulator.removeFromSlot(c, type, item.getPosition(), item.getQuantity(), false, false, false);
                if (item_.getPet() != null) {
                    c.getPlayer().removePetCS(item_.getPet());
                }
                item_.setPosition((byte) 0);
                c.getPlayer().getCashInventory().addToInventory(item_);
                c.getSession().write(CSPacket.confirmToCSInventory(item, c.getAccID(), -1));
            } else {
                c.getSession().write(CSPacket.sendCSFail(0));
            }
        } else if (action == 0x1C || action == 0x22) { //36 = friendship, 30 = crush   1.2.65 OK
            if (c.getPlayer().isGM() && !c.getPlayer().isSuperGM()) {
                c.getPlayer().dropMessage(1, "GM은 캐시를 선물할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            //1.2.41 : 0x19 : crush
            //1.2.41 : 0x1F : friendship

            //c.getSession().write(MTSCSPacket.sendCSFail(0));
//            if (GameConstants.GMS) {
            slea.skip(4); //idcode2
//            } else {
//                slea.readMapleAsciiString(); // as13
//            }
            final int toCharge = 1;
            final CashItemInfo item = CashItemFactory.getInstance().getItem(slea.readInt());
            if (!c.getPlayer().isDonateShop() && CashItemFactory.getInstance().containsKMSNewItems(item.getSN())) {
                c.getPlayer().dropMessage(1, "이 아이템을 구매할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            final String partnerName = slea.readMapleAsciiString();
            final String msg = slea.readMapleAsciiString();
            if (item == null || !GameConstants.isEffectRing(item.getId()) || c.getPlayer().getCSPoints(toCharge) < item.getPrice() || msg.length() > 73 || msg.length() < 1) {
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            } else if (!item.genderEquals(c.getPlayer().getGender())) {
                c.getSession().write(CSPacket.sendCSFail(143));
                doCSPackets(c);
                return;
            } else if (c.getPlayer().getCashInventory().getItemsSize() >= 100) {
                c.getSession().write(CSPacket.sendCSFail(129));
                doCSPackets(c);
                return;
            }
            for (int i : GameConstants.cashBlock) { //just incase hacker
                if (item.getId() == i) {
                    c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
                    doCSPackets(c);
                    return;
                }
            }
            Triple<Integer, Integer, Integer> info = MapleCharacterUtil.getInfoByName(partnerName, c.getPlayer().getWorld());
            if (info == null || info.getLeft().intValue() <= 0 || info.getLeft().intValue() == c.getPlayer().getId()) {
                c.getSession().write(CSPacket.sendCSFail(144)); //9E v75
                doCSPackets(c);
                return;
            } else if (info.getMid().intValue() == c.getAccID()) {
                c.getSession().write(CSPacket.sendCSFail(130)); //9D v75
                doCSPackets(c);
                return;
            } else {
                if (info.getRight().intValue() == c.getPlayer().getGender() && action == 0x1C) {
                    c.getSession().write(CSPacket.sendCSFail(143)); //9B v75
                    doCSPackets(c);
                    return;
                }

                int err = MapleRing.createRing(item.getId(), c.getPlayer(), partnerName, msg, info.getLeft().intValue(), item.getSN());

                if (err != 1) {
                    c.getSession().write(CSPacket.sendCSFail(0)); //9E v75
                    doCSPackets(c);
                    return;
                }
                DBLogger.getInstance().logTrade(LogType.Trade.CashShopGift, c.getPlayer().getId(), c.getPlayer().getName(), partnerName, "시리얼 넘버 : " + item.getSN() + " - " + item.getCount() + " 개 / 캐시 : " + item.getPrice(), (c.getPlayer().isDonateShop() ? "후원캐시샵" : "일반캐시샵") + " / 메시지 : " + msg + " / " + (action == 0x1C ? "커플링" : "우정링"));
                c.getPlayer().modifyCSPoints(toCharge, -item.getPrice(), false);
                //c.getSession().write(MTSCSPacket.showBoughtCSItem(itemz, item.getSN(), c.getAccID()));
                c.getSession().write(CSPacket.sendGift(item.getPrice(), item.getId(), item.getCount(), partnerName));
                MapleCharacterUtil.sendNote(partnerName, c.getPlayer().getName(), "캐시샵에 선물이 도착했습니다. 확인해 주세요.", 0);
            }


        } else if (action == 29) { // 패키지 구매. 1.2.65 OK
            final int toCharge = slea.readByte() + 1;
            final CashItemInfo item = CashItemFactory.getInstance().getItem(slea.readInt());
            if (!c.getPlayer().isDonateShop() && CashItemFactory.getInstance().containsKMSNewItems(item.getSN())) {
                c.getPlayer().dropMessage(1, "이 아이템을 구매할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            List<Integer> ccc = null;
            if (item != null) {
                ccc = CashItemFactory.getInstance().getPackageItems(item.getId());
            }
            if (item == null || ccc == null || c.getPlayer().getCSPoints(toCharge) < item.getPrice()) {
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            } else if (!item.genderEquals(c.getPlayer().getGender())) {
                c.getSession().write(CSPacket.sendCSFail(130));
                doCSPackets(c);
                return;
            } else if (c.getPlayer().getCashInventory().getItemsSize() >= (100 - ccc.size())) {
                c.getSession().write(CSPacket.sendCSFail(129));
                doCSPackets(c);
                return;
            }
            for (int iz : GameConstants.cashBlock) {
                if (item.getId() == iz) {
                    c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
                    doCSPackets(c);
                    return;
                }
            }
            Map<Integer, Item> ccz = new HashMap<Integer, Item>();
            for (int i : ccc) {
                final CashItemInfo cii = CashItemFactory.getInstance().getSimpleItem(i);
                if (cii == null) {
                    continue;
                }
                Item itemz = c.getPlayer().getCashInventory().toItem(cii);
                if (itemz == null || itemz.getUniqueId() <= 0) {
                    continue;
                }
                for (int iz : GameConstants.cashBlock) {
                    if (itemz.getItemId() == iz) {
                        c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
                        doCSPackets(c);
                        return;
                    }
                }
                ccz.put(i, itemz);
            }
            for (Item itemsa : ccz.values()) {
                c.getPlayer().getCashInventory().addToInventory(itemsa);
            }
            chr.modifyCSPoints(toCharge, -item.getPrice(), false);
            c.getSession().write(CSPacket.showBoughtCSPackage(ccz, c.getAccID()));

        } else if (action == 31) { // Quest Item.. 1.2.65 OK
            final CashItemInfo item = CashItemFactory.getInstance().getItem(slea.readInt());
            if (!c.getPlayer().isDonateShop() && CashItemFactory.getInstance().containsKMSNewItems(item.getSN())) {
                c.getPlayer().dropMessage(1, "이 아이템을 구매할 수 없습니다.");
                doCSPackets(c);
                return;
            }
            if (item == null || !MapleItemInformationProvider.getInstance().isQuestItem(item.getId())) {
                c.getSession().write(CSPacket.sendCSFail(0));
                doCSPackets(c);
                return;
            } else if (c.getPlayer().getMeso() < item.getPrice()) {
                c.getSession().write(CSPacket.sendCSFail(148));
                doCSPackets(c);
                return;
            } else if (c.getPlayer().getInventory(GameConstants.getInventoryType(item.getId())).getNextFreeSlot() < 0) {
                c.getSession().write(CSPacket.sendCSFail(129));
                doCSPackets(c);
                return;
            }
            for (int iz : GameConstants.cashBlock) {
                if (item.getId() == iz) {
                    c.getPlayer().dropMessage(1, GameConstants.getCashBlockedMsg(item.getId()));
                    doCSPackets(c);
                    return;
                }
            }
            byte pos = MapleInventoryManipulator.addId(c, item.getId(), (short) item.getCount(), null, "Cash shop: quest item" + " on " + FileoutputUtil.CurrentReadable_Date());
            if (pos < 0) {
                c.getSession().write(CSPacket.sendCSFail(129));
                doCSPackets(c);
                return;
            }
            chr.gainMeso(-item.getPrice(), false);
            c.getSession().write(CSPacket.showBoughtCSQuestItem(item.getPrice(), (short) item.getCount(), pos, item.getId()));
        } else if (action == 0x19) { //Pay Back.. 1.2.65 OK
            slea.skip(4); //idcode2
            int uid = (int) slea.readLong();
            Item item = c.getPlayer().getCashInventory().findByCashId(uid);
            if (item == null || item.getExpiration() != -1 || item.getItemId() / 1000000 != 1) {
                c.getSession().write(CSPacket.sendCSFail(129));
                doCSPackets(c);
                return;
            }
            c.getPlayer().getCashInventory().removeFromInventory(item);
            c.getSession().write(CSPacket.payBackResult(uid, 0));
        } else if (action == 39) { //뭔진 모름
            c.getSession().write(CSPacket.redeemResponse());
        } else {
            c.getSession().write(CSPacket.sendCSFail(0));
        }
        doCSPackets(c);
    }

    private static final MapleInventoryType getInventoryType(final int id) {
        switch (id) {
            case 50200016:
                return MapleInventoryType.EQUIP;
            case 50200017:
                return MapleInventoryType.USE;
            case 50200018:
                return MapleInventoryType.SETUP;
            case 50200019:
                return MapleInventoryType.ETC;
            default:
                return MapleInventoryType.UNDEFINED;
        }
    }
}
