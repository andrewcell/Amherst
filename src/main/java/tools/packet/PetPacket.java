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

import client.inventory.Item;
import java.util.List;

import client.inventory.Pet;
import client.MapleStat;
import client.MapleCharacter;

import constants.GameConstants;
import handling.SendPacketOpcode;
import java.awt.Point;
import server.movement.LifeMovementFragment;
import tools.MaplePacketCreator;
import tools.data.MaplePacketLittleEndianWriter;

public class PetPacket {

    public static final byte[] updatePet(final Pet pet, final Item item, final boolean active) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.MODIFY_INVENTORY_ITEM.getValue());
        mplew.write(0);
        mplew.write(2);
        mplew.write(3);
        mplew.write(5);
        mplew.writeShort(pet.getInventoryPosition());
        mplew.write(0);
        mplew.write(5);
        mplew.writeShort(pet.getInventoryPosition());
        mplew.write(3);
        mplew.writeInt(pet.getPetItemId());
        mplew.write(1);
        mplew.writeLong(pet.getUniqueId());
        PacketHelper.addPetItemInfo(mplew, item, pet, active);
        return mplew.getPacket();
    }

    public static final byte[] showPet(final MapleCharacter chr, final Pet pet, final boolean remove, final boolean hunger) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SPAWN_PET.getValue());
        mplew.writeInt(chr.getId());
//		if (GameConstants.GMS) {
//			mplew.write(chr.getPetIndex(pet));
//		} else {
//			mplew.writeInt(chr.getPetIndex(pet));
//		}

        if (remove) {
            mplew.write(0);
            mplew.write(hunger ? 1 : 0);
        } else {
            mplew.write(1);
            mplew.writeInt(pet.getPetItemId());
            mplew.writeMapleAsciiString(pet.getName());
            mplew.writeLong(pet.getUniqueId());
            mplew.writeShort(pet.getPos().x);
            mplew.writeShort(pet.getPos().y - 20);
            mplew.write(pet.getStance());
            mplew.writeInt(0);
        }
        return mplew.getPacket();
    }

    public static final byte[] removePet(final int cid, final int index) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SPAWN_PET.getValue());
        mplew.writeInt(cid);
//		if (GameConstants.GMS) {
//			mplew.write(index);
//		} else {
//			mplew.writeInt(index);
//		}
        mplew.writeShort(0);
        return mplew.getPacket();
    }

    public static final byte[] movePet(final int cid, final List<LifeMovementFragment> moves, Point startPos) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.MOVE_PET.getValue());
        mplew.writeInt(cid);
//		if (GameConstants.GMS) {
//			mplew.write(slot);
//		} else {
//			mplew.writeInt(slot);
//		}
        //mplew.writeLong(pid);
        mplew.writePos(startPos);
        PacketHelper.serializeMovementList(mplew, moves);

        return mplew.getPacket();
    }

    public static final byte[] petChat(final int cid, final int un, final String text) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PET_CHAT.getValue());
        mplew.writeInt(cid);
        mplew.writeShort(un);
        mplew.writeMapleAsciiString(text);
        mplew.write(0); //hasQuoteRing

        return mplew.getPacket();
    }

    public static final byte[] commandResponse(final int cid, final byte command, final boolean success, final boolean food) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PET_COMMAND.getValue());
        mplew.writeInt(cid);
        mplew.write(food ? 1 : 0);
        mplew.write(command);
        if (!food) {
            mplew.write(success ? 1 : 0);
        }
        return mplew.getPacket();
    }

    public static final byte[] showOwnPetLevelUp() {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SHOW_ITEM_GAIN_INCHAT.getValue());
        mplew.write(4);
        mplew.write(0);

        return mplew.getPacket();
    }

    public static final byte[] showPetLevelUp(final MapleCharacter chr) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.SHOW_FOREIGN_EFFECT.getValue());
        mplew.writeInt(chr.getId());
        mplew.write(4);
        mplew.write(0);

        return mplew.getPacket();
    }

    public static final byte[] showPetUpdate(final MapleCharacter chr, final int uniqueId, final byte index) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.PET_UPDATE.getValue());
        mplew.writeInt(chr.getId());
//		if (GameConstants.GMS) {
//			mplew.write(index);
//		} else {
//			mplew.writeInt(index);
//		}
        mplew.writeLong(uniqueId);
        mplew.write(0); //not sure, probably not it

        return mplew.getPacket();
    }
    
    public static final byte[] loadPetPickupExceptionList(int cid, int petsn, List<Integer> items) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.PET_EXCEPTION_LIST.getValue());
        mplew.writeInt(cid);
        mplew.writeLong(petsn);
        mplew.write(items.size());
        for (int i : items) {
            mplew.writeInt(i);
        }
        return mplew.getPacket();
    }

    public static final byte[] petStatUpdate(final MapleCharacter chr) {
        final MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.UPDATE_STATS.getValue());
        mplew.write(0);
        mplew.writeInt((int) MapleStat.PET.getValue());



        byte count = 0;
        for (final Pet pet : chr.getPets()) {
            if (pet.isSummoned()) {
                mplew.writeLong(pet.getUniqueId());
                count++;
            }
        }
        while (count < 3) {
            mplew.writeZeroBytes(8);
            count++;
        }
        mplew.write(0);
        mplew.writeShort(0);

        return mplew.getPacket();
    }
}
