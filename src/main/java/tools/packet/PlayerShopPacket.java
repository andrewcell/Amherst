/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package tools.packet;

import client.MapleCharacter;
import client.MapleClient;
import client.inventory.Item;
import handling.SendPacketOpcode;
import server.MerchItemPackage;
import server.Randomizer;
import server.shops.AbstractPlayerStore.BoughtItem;
import server.shops.HiredMerchant;
import server.shops.IMaplePlayerShop;
import server.shops.MapleMiniGame;
import server.shops.MaplePlayerShop;
import server.shops.MaplePlayerShopItem;
import tools.Pair;
import tools.data.MaplePacketLittleEndianWriter;

public class PlayerShopPacket {

    public static final byte[] addCharBox(final MapleCharacter c, final int type) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.UPDATE_CHAR_BOX.getValue());
        mplew.writeInt(c.getId());
        PacketHelper.addAnnounceBox(mplew, c);

        return mplew.getPacket();
    }

    public static final byte[] removeCharBox(final MapleCharacter c) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.UPDATE_CHAR_BOX.getValue());
        mplew.writeInt(c.getId());
        mplew.write(0);

        return mplew.getPacket();
    }

    public static final byte[] sendTitleBox() {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SEND_TITLE_BOX.getValue());
        mplew.write(7);

        return mplew.getPacket();
    }

    public static final byte[] sendPlayerShopBox(final MapleCharacter c) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.UPDATE_CHAR_BOX.getValue());
        mplew.writeInt(c.getId());
        PacketHelper.addAnnounceBox(mplew, c);

        return mplew.getPacket();
    }

    public static final byte[] getHiredMerch(final MapleCharacter chr, final HiredMerchant merch, final boolean firstTime) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());

        mplew.write(5);
        mplew.write(5);
        mplew.write(4);
        mplew.writeShort(merch.getVisitorSlot(chr));
        mplew.writeInt(merch.getItemId());
        mplew.writeMapleAsciiString("고용상인");

        for (final Pair<Byte, MapleCharacter> storechr : merch.getVisitors()) {
            mplew.write(storechr.left);
            PacketHelper.addCharLook(mplew, storechr.right, false);
            mplew.writeMapleAsciiString(storechr.right.getName());
            //mplew.writeShort(storechr.right.getJob());
        }
        mplew.write(-1);
        mplew.writeShort(0);
        mplew.writeMapleAsciiString(merch.getOwnerName());
        if (merch.isOwner(chr)) {
            mplew.writeInt(merch.getTimeLeft());
            mplew.write(firstTime ? 1 : 0);
            mplew.write(merch.getBoughtItems().size());
            for (BoughtItem SoldItem : merch.getBoughtItems()) {
                mplew.writeInt(SoldItem.id);
                mplew.writeShort(SoldItem.quantity); // number of purchased
                mplew.writeInt(SoldItem.totalPrice); // total price
                mplew.writeMapleAsciiString(SoldItem.buyer); // name of the buyer
            }
            mplew.writeInt(merch.getMeso());
        }
        mplew.writeMapleAsciiString(merch.getDescription());
        mplew.write(10);
        mplew.writeInt(merch.getMeso()); // meso
        mplew.write(merch.getItems().size());

        for (final MaplePlayerShopItem item : merch.getItems()) {
            mplew.writeShort(item.bundles);
            mplew.writeShort(item.item.getQuantity());
            mplew.writeInt(item.price);
            PacketHelper.addItemInfo(mplew, item.item, true, true);
        }
        return mplew.getPacket();
    }

    public static final byte[] getPlayerStore(final MapleCharacter chr, final boolean firstTime) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        IMaplePlayerShop ips = chr.getPlayerShop();
        mplew.write(5);
        switch (ips.getShopType()) {
            case 2:
                mplew.write(4);
                mplew.write(4);
                break;
            case 3:
                mplew.write(2);
                mplew.write(2);
                break;
            case 4:
                mplew.write(1);
                mplew.write(2);
                break;
        }
        mplew.writeShort(ips.getVisitorSlot(chr));
        PacketHelper.addCharLook(mplew, ((MaplePlayerShop) ips).getMCOwner(), false);
        mplew.writeMapleAsciiString(ips.getOwnerName());
        //mplew.writeShort(((MaplePlayerShop) ips).getMCOwner().getJob());
        for (final Pair<Byte, MapleCharacter> storechr : ips.getVisitors()) {
            mplew.write(storechr.left);
            PacketHelper.addCharLook(mplew, storechr.right, false);
            mplew.writeMapleAsciiString(storechr.right.getName());
            //mplew.writeShort(storechr.right.getJob());
        }
        mplew.write(0xFF);
        mplew.writeMapleAsciiString(ips.getDescription());
        mplew.write(10);
        mplew.write(ips.getItems().size());

        for (final MaplePlayerShopItem item : ips.getItems()) {
            mplew.writeShort(item.bundles);
            mplew.writeShort(item.item.getQuantity());
            mplew.writeInt(item.price);
            PacketHelper.addItemInfo(mplew, item.item, true, true);
        }
        return mplew.getPacket();
    }

    public static final byte[] shopChat(final String message, final int slot) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(6);
        mplew.write(8);
        mplew.write(slot);
        mplew.writeMapleAsciiString(message);

        return mplew.getPacket();
    }

    public static final byte[] shopErrorMessage(final int error, final int type) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x0A);
        mplew.write(type);
        mplew.write(error);

        return mplew.getPacket();
    }

    
    public static final byte[] shopTest(final int error, final int type) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x26);
        mplew.write(type);
        mplew.write(error);

        return mplew.getPacket();
    }
    public static final byte[] spawnHiredMerchant(final HiredMerchant hm) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SPAWN_HIRED_MERCHANT.getValue());
        mplew.writeInt(hm.getOwnerId());
        mplew.writeInt(hm.getItemId());
        mplew.writePos(hm.getTruePosition());
        mplew.writeShort(0);
        mplew.writeMapleAsciiString(hm.getOwnerName());
        PacketHelper.addInteraction(mplew, hm);

        return mplew.getPacket();
    }

    public static final byte[] destroyHiredMerchant(final int id) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.DESTROY_HIRED_MERCHANT.getValue());
        mplew.writeInt(id);

        return mplew.getPacket();
    }

    public static final byte[] shopItemUpdate(final IMaplePlayerShop shop) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x15);
        if (shop.getShopType() == 1) {
            mplew.writeInt(0);
        }
        mplew.write(shop.getItems().size());

        for (final MaplePlayerShopItem item : shop.getItems()) {
            mplew.writeShort(item.bundles);
            mplew.writeShort(item.item.getQuantity());
            mplew.writeInt(item.price);
            PacketHelper.addItemInfo(mplew, item.item, true, true);
        }
        return mplew.getPacket();
    }
    
    public static final byte[] showSoldShopItem(int pos, int quantity, String buyer) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x16);
        mplew.write(pos);
        mplew.writeShort(quantity);
        mplew.writeMapleAsciiString(buyer);
        return mplew.getPacket();
        
    }

    public static final byte[] shopVisitorAdd(final MapleCharacter chr, final int slot) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(4);
        mplew.write(slot);
        PacketHelper.addCharLook(mplew, chr, false);
        mplew.writeMapleAsciiString(chr.getName());
        //mplew.writeShort(chr.getJob());

        return mplew.getPacket();
    }

    public static final byte[] shopVisitorLeave(final byte slot) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x0A);
        mplew.write(slot);

        return mplew.getPacket();
    }

    public static final byte[] Merchant_Buy_Error(final byte message) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        // 2 = You have not enough meso
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x18);
        mplew.write(message);

        return mplew.getPacket();
    }

    public static final byte[] updateHiredMerchant(final HiredMerchant shop) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.UPDATE_HIRED_MERCHANT.getValue());
        mplew.writeInt(shop.getOwnerId());
        PacketHelper.addInteraction(mplew, shop);

        return mplew.getPacket();
    }

    public static final byte[] merchItem_Message(final byte op) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.MERCH_ITEM_MSG.getValue());
        mplew.write(op);

        return mplew.getPacket();
    }
    
    

    public static final byte[] merchItemAlreadyOpen(final int channel, final int room) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        //xx xx 25 70 C9 89 00 01 00 00 00 01 00 00 00
        mplew.writeOpcode(SendPacketOpcode.MERCH_ITEM_STORE.getValue());
        mplew.write(0x25);
        mplew.writeInt(9030000);
        mplew.writeInt(room);
        mplew.writeInt(channel);
        return mplew.getPacket();
    }
    
    public static final byte[] merchItemStore(final byte op) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        // [28 01] [22 01] - Invalid Asiasoft Passport
        // [28 01] [22 00] - Open Asiasoft pin typing
        mplew.writeOpcode(SendPacketOpcode.MERCH_ITEM_STORE.getValue());
        mplew.write(op);

        switch (op) {
            case 0x24:
            case 0x25:
            case 0x26:
                mplew.writeZeroBytes(8);
                break;
            default:
                mplew.write(0);
                break;
        }
        return mplew.getPacket();
    }

    public static final byte[] merchItemStore_ItemData(final MerchItemPackage pack) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.MERCH_ITEM_STORE.getValue());
        mplew.write(0x23);
        mplew.writeInt(9030000); // Fredrick
        mplew.writeShort(32272); // always the same..?
        mplew.writeZeroBytes(7);
        //10 27 00 00
        //27 00 00 00
        mplew.writeInt(pack.getMesos());
        mplew.writeZeroBytes(3);
        mplew.write(pack.getItems().size());
        for (final Item item : pack.getItems()) {
            PacketHelper.addItemInfo(mplew, item, true, true);
        }
        mplew.writeZeroBytes(3);

        return mplew.getPacket();
    }

    public static byte[] getMiniGame(MapleClient c, MapleMiniGame minigame) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(5);
        mplew.write(minigame.getGameType());
        mplew.write(minigame.getMaxSize());
        mplew.writeShort(minigame.getVisitorSlot(c.getPlayer()));
        PacketHelper.addCharLook(mplew, minigame.getMCOwner(), false);
        mplew.writeMapleAsciiString(minigame.getOwnerName());
        //mplew.writeShort(minigame.getMCOwner().getJob());
        for (Pair<Byte, MapleCharacter> visitorz : minigame.getVisitors()) {
            mplew.write(visitorz.left);
            PacketHelper.addCharLook(mplew, visitorz.right, false);
            mplew.writeMapleAsciiString(visitorz.right.getName());
            //mplew.writeShort(visitorz.getRight().getJob());
        }
        mplew.write(-1);
        mplew.write(0);
        addGameInfo(mplew, minigame.getMCOwner(), minigame);
        for (Pair<Byte, MapleCharacter> visitorz : minigame.getVisitors()) {
            mplew.write(visitorz.left);
            addGameInfo(mplew, visitorz.right, minigame);
        }
        mplew.write(-1);
        mplew.writeMapleAsciiString(minigame.getDescription());
        mplew.writeShort(minigame.getPieceType());
        return mplew.getPacket();
    }

    public static byte[] getMiniGameReady(boolean ready) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(ready ? 0x32 : 0x33);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameExitAfter(boolean ready) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(ready ? 0x30 : 0x31);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameStart(int loser) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x35);
        mplew.write(loser == 1 ? 0 : 1);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameSkip(int slot) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x37);
        //owner = 1 visitor = 0?
        mplew.write(slot);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameRequestTie() {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x2A);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameDenyTie() {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x2B);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameFull() {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.writeShort(5);
        mplew.write(2);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameMoveOmok(int move1, int move2, int move3) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x38);
        mplew.writeInt(move1);
        mplew.writeInt(move2);
        mplew.write(move3);
        return mplew.getPacket();
    }

    public static byte[] getMiniGameNewVisitor(MapleCharacter c, int slot, MapleMiniGame game) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(4);
        mplew.write(slot);
        PacketHelper.addCharLook(mplew, c, false);
        mplew.writeMapleAsciiString(c.getName());
        //mplew.writeShort(c.getJob());
        addGameInfo(mplew, c, game);
        return mplew.getPacket();
    }

    public static void addGameInfo(MaplePacketLittleEndianWriter mplew, MapleCharacter chr, MapleMiniGame game) {
        mplew.writeInt(game.getGameType()); // start of visitor; unknown
        mplew.writeInt(game.getWins(chr));
        mplew.writeInt(game.getTies(chr));
        mplew.writeInt(game.getLosses(chr));
        mplew.writeInt(game.getScore(chr)); // points
    }

    public static byte[] getMiniGameClose(byte number) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x0A);
        mplew.write(1);
        mplew.write(number);
        return mplew.getPacket();
    }

    public static byte[] getMatchCardStart(MapleMiniGame game, int loser) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x35);
        mplew.write(loser == 1 ? 0 : 1);
        int times = game.getPieceType() == 1 ? 20 : (game.getPieceType() == 2 ? 30 : 12);
        mplew.write(times);
        for (int i = 1; i <= times; i++) {
            mplew.writeInt(game.getCardId(i));
        }
        return mplew.getPacket();
    }

    public static byte[] getMatchCardSelect(int turn, int slot, int firstslot, int type) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x3C);
        mplew.write(turn);
        mplew.write(slot);
        if (turn == 0) {
            mplew.write(firstslot);
            mplew.write(type);
        }
        return mplew.getPacket();
    }

    public static byte[] getMiniGameResult(MapleMiniGame game, int type, int x) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
        mplew.write(0x36);
        mplew.write(type); //lose = 0, tie = 1, win = 2
        game.setPoints(x, type);
        if (type != 0) {
            game.setPoints(x == 1 ? 0 : 1, type == 2 ? 0 : 1);
        }
        if (type != 1) {
            if (type == 0) {
                mplew.write(x == 1 ? 0 : 1); //who did it?
            } else {
                mplew.write(x);
            }
        }
        addGameInfo(mplew, game.getMCOwner(), game);
        for (Pair<Byte, MapleCharacter> visitorz : game.getVisitors()) {
            addGameInfo(mplew, visitorz.right, game);
        }

        return mplew.getPacket();
    }
//
//    public static final byte[] MerchantBlackListView(final List<String> blackList) {
//        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
//
//        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
//        mplew.write(45);
//        mplew.writeShort(blackList.size());
//        for (String visit : blackList) {
//            mplew.writeMapleAsciiString(visit);
//        }
//        return mplew.getPacket();
//    }
//
//    public static final byte[] MerchantVisitorView(List<String> visitor) {
//        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
//
//        mplew.writeOpcode(SendPacketOpcode.PLAYER_INTERACTION.getValue());
//        mplew.write(44);
//        mplew.writeShort(visitor.size());
//        for (String visit : visitor) {
//            mplew.writeMapleAsciiString(visit);
//            mplew.writeInt(1); /////for the lul
//        }
//        return mplew.getPacket();
//    }

    
    public static final byte[] spawnFakeHiredMerchant(final HiredMerchant hm) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SPAWN_HIRED_MERCHANT.getValue());
        mplew.writeInt(Randomizer.rand(1333, 99999999));
        mplew.writeInt(hm.getItemId());
        mplew.writePos(hm.getTruePosition());
        mplew.writeShort(0);
        mplew.writeMapleAsciiString(Randomizer.nextInt()+"");
        PacketHelper.addInteraction(mplew, hm);

        return mplew.getPacket();
    }

}
