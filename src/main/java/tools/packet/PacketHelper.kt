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
package tools.packet

import client.MapleCharacter
import client.inventory.Equip
import client.inventory.Item
import client.inventory.MapleInventoryType
import client.inventory.MaplePet
import constants.GameConstants
import constants.GameConstants.isBullet
import constants.GameConstants.isEvan
import constants.GameConstants.isMercedes
import constants.GameConstants.isResist
import constants.GameConstants.isThrowingStar
import handling.Buffstat
import server.MapleItemInformationProvider
import server.MapleShop
import server.MapleShopItem
import server.marriage.MarriageManager
import server.movement.LifeMovementFragment
import server.shops.AbstractPlayerStore
import server.shops.IMaplePlayerShop
import server.shops.MapleMiniGame
import tools.BitTools
import tools.Pair
import tools.StringUtil
import tools.data.MaplePacketLittleEndianWriter
import java.util.*

object PacketHelper {
    const val FT_UT_OFFSET = 116445060000000000L // KST
    const val MAX_TIME = 150842304000000000L //00 80 05 BB 46 E6 17 02
    const val ZERO_TIME = 94354848000000000L //00 40 E0 FD 3B 37 4F 01
    const val PERMANENT = 150841440000000000L // 00 C0 9B 90 7D E5 17 02
    @JvmStatic
    fun getKoreanTimestamp(realTimestamp: Long): Long {
        return getTime(realTimestamp)
    }

    @JvmStatic
    fun getTime(realTimestamp: Long): Long {
        if (realTimestamp == -1L) {
            return MAX_TIME
        } else if (realTimestamp == -2L) {
            return ZERO_TIME
        } else if (realTimestamp == -3L) {
            return PERMANENT
        }
        return realTimestamp * 10000 + FT_UT_OFFSET
    }

    fun getFileTimestamp(_timeStampinMillis: Long, roundToMinutes: Boolean): Long {
        var timeStampinMillis = _timeStampinMillis
        if (SimpleTimeZone.getDefault().inDaylightTime(Date())) {
            timeStampinMillis -= 3600000L
        }
        val time: Long
        time = if (roundToMinutes) {
            timeStampinMillis / 1000 / 60 * 600000000
        } else {
            timeStampinMillis * 10000
        }
        return time + FT_UT_OFFSET
    }

    fun addQuestInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        val started = chr.startedQuests
        //        if (GameConstants.GMS) {
//            mplew.write(1); //idk
//        }
        mplew.writeShort(started.size)
        for (q in started) {
            mplew.writeShort(q.quest.id)
            if (q.hasMobKills()) {
                val sb = StringBuilder()
                for (kills in q.mobKills.values) {
                    sb.append(StringUtil.getLeftPaddedStr(kills.toString(), '0', 3))
                }
                mplew.writeMapleAsciiString(sb.toString())
            } else {
                if (q.customData != null) {
                    if (q.customData.startsWith("time_")) {
                        mplew.writeShort(9)
                        mplew.write(1)
                        mplew.writeLong(getTime(q.customData.substring(5).toLong()))
                    } else {
                        mplew.writeMapleAsciiString(q.customData)
                    }
                } else {
                    mplew.writeZeroBytes(2)
                }
            }
        }
        //        mplew.writeShort(0); //dunno
//        if (GameConstants.GMS) {
//            mplew.write(1); //dunno
//        }
        val completed = chr.completedQuests
        mplew.writeShort(completed.size)
        for (q in completed) {
            mplew.writeShort(q.quest.id)
            //            if (!GameConstants.GMS) {
//                mplew.writeShort(0);
//            }
            mplew.writeLong(getTime(q.completionTime))
        }
    }

    fun addSkillInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        val skills = chr.skills
        mplew.writeShort(skills.size)
        for ((key, value) in skills) {
            mplew.writeInt(key.id)
            mplew.writeInt(value.skillevel)
            //addExpirationTime(mplew, skill.getValue().expiration);
//if (skill.getKey().isFourthJob()) {
            if (key.id / 10000 % 100 > 0
                    && key.id / 10000 % 10 == 2) {
                mplew.writeInt(value.masterlevel.toInt())
            }
            //}
        }
    }

    fun addCoolDownInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        val cd = chr.cooldowns
        mplew.writeShort(cd.size)
        for (cooling in cd) {
            mplew.writeInt(cooling.skillId)
            mplew.writeShort((cooling.length + cooling.startTime - System.currentTimeMillis()).toInt() / 1000)
        }
    }

    fun addRocksInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        val mapz = chr.regRocks
        for (i in 0..4) { // VIP teleport map
            mplew.writeInt(mapz[i])
        }
        val map = chr.rocks
        for (i in 0..9) { // VIP teleport map
            mplew.writeInt(map[i])
        }
    }

    fun addRingInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.writeShort(0)
        //01 00 = size
//01 00 00 00 = gametype?
//03 00 00 00 = win
//00 00 00 00 = tie/loss
//01 00 00 00 = tie/loss
//16 08 00 00 = points
        val aRing = chr.getRings(true)
        val cRing = aRing.left!!
        mplew.writeShort(cRing.size)
        for (ring in cRing) {
            mplew.writeInt(ring.partnerChrId)
            mplew.writeAsciiString(ring.partnerName, 13)
            mplew.writeLong(ring.ringId.toLong())
            mplew.writeLong(ring.partnerRingId.toLong())
        }
        val fRing = aRing.mid!!
        mplew.writeShort(fRing.size)
        for (ring in fRing) {
            mplew.writeInt(ring.partnerChrId)
            mplew.writeAsciiString(ring.partnerName, 13)
            mplew.writeLong(ring.ringId.toLong())
            mplew.writeLong(ring.partnerRingId.toLong())
            mplew.writeInt(ring.itemId)
        }
        val mRing = aRing.right!!
        mplew.writeShort(mRing.size)
        for (ring in mRing) {
            mplew.writeInt(chr.marriageId) //marriage no
            val data = MarriageManager.getInstance().getMarriage(chr.marriageId)
            mplew.writeInt(data.groomId)
            mplew.writeInt(data.brideId)
            mplew.writeShort(if (data.status == 2) 3 else data.status) //status 1 : 약혼  3 : 결혼
            mplew.writeInt(ring.itemId)
            mplew.writeInt(ring.itemId)
            mplew.writeAsciiString(data.groomName, 13)
            mplew.writeAsciiString(data.brideName, 13)
        }
    }

    fun addInventoryInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.writeInt(chr.meso) // mesos
        mplew.write(chr.getInventory(MapleInventoryType.EQUIP).slotLimit) // equip slots
        mplew.write(chr.getInventory(MapleInventoryType.USE).slotLimit) // use slots
        mplew.write(chr.getInventory(MapleInventoryType.SETUP).slotLimit) // set-up slots
        mplew.write(chr.getInventory(MapleInventoryType.ETC).slotLimit) // etc slots
        mplew.write(chr.getInventory(MapleInventoryType.CASH).slotLimit) // cash slots
        var iv = chr.getInventory(MapleInventoryType.EQUIPPED)
        val equipped = iv.newList()
        Collections.sort(equipped)
        //        mplew.write(0);
//        mplew.write(0);
//        mplew.write(0);
//        mplew.write(0);
//        mplew.write(0);
//        mplew.write(0);
//        mplew.write(0);
/////////////////////////////////////////////////////////////////////////
// old version uses 1 byte slot packet
        for (item in equipped) {
            if (item.position < 0 && item.position > -100) {
                addItemInfo(mplew, item, false, false, true, false, chr)
            }
        }
        mplew.write(0) // start of equipped nx
        /////////////////////////////////////////////////////////////////////////
        for (item in equipped) {
            if (item.position <= -100 && item.position > -1000) {
                addItemInfo(mplew, item, false, false, true, false, chr)
            }
        }
        mplew.write(0) // start of equip inventory
        /////////////////////////////////////////////////////////////////////////
        iv = chr.getInventory(MapleInventoryType.EQUIP)
        for (item in iv.list()) {
            addItemInfo(mplew, item, false, false, true, false, chr)
        }
        mplew.write(0) // start of use inventory
        /////////////////////////////////////////////////////////////////////////
        iv = chr.getInventory(MapleInventoryType.USE)
        for (item in iv.list()) {
            addItemInfo(mplew, item, false, false, true, false, chr)
        }
        // s
        mplew.write(0) // start of set-up inventory
        /////////////////////////////////////////////////////////////////////////
        iv = chr.getInventory(MapleInventoryType.SETUP)
        for (item in iv.list()) {
            addItemInfo(mplew, item, false, false, true, false, chr)
        }
        mplew.write(0) // start of etc inventory
        /////////////////////////////////////////////////////////////////////////
        iv = chr.getInventory(MapleInventoryType.ETC)
        for (item in iv.list()) {
            if (item.position < 100) {
                addItemInfo(mplew, item, false, false, true, false, chr)
            }
        }
        mplew.write(0) // start of cash inventory
        /////////////////////////////////////////////////////////////////////////
        iv = chr.getInventory(MapleInventoryType.CASH)
        for (item in iv.list()) {
            addItemInfo(mplew, item, false, false, true, false, chr)
        }
        mplew.write(0)
        /////////////////////////////////////////////////////////////////////////
    }

    @JvmStatic
    fun addCharStats(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.writeInt(chr.id) // character id
        mplew.writeAsciiString(chr.name, 13)
        mplew.write(chr.gender) // gender (0 = male, 1 = female)
        mplew.write(chr.skinColor) // skin color
        mplew.writeInt(chr.face) // face
        mplew.writeInt(chr.hair) // hair
        mplew.writeZeroBytes(8)
        mplew.write(chr.level.toInt()) // level
        mplew.writeShort(chr.job.toInt()) // job
        chr.stat.connectData(mplew)
        mplew.writeShort(chr.remainingAp.toInt()) // remaining ap
        if (isEvan(chr.job.toInt()) || isResist(chr.job.toInt()) || isMercedes(chr.job.toInt())) {
            val size = chr.remainingSpSize
            mplew.write(size)
            for (i in chr.remainingSps.indices) {
                if (chr.getRemainingSp(i) > 0) {
                    mplew.write(i + 1)
                    mplew.write(chr.getRemainingSp(i))
                }
            }
        } else {
            mplew.writeShort(chr.remainingSp) // remaining sp
        }
        mplew.writeInt(chr.exp) // exp
        mplew.writeShort(chr.fame) // fame
        mplew.writeInt(chr.mapId) // current map id
        mplew.write(chr.initialSpawnpoint) // spawnpoint
    }

    @JvmStatic
    fun addCharLook(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter, mega: Boolean) {
        mplew.write(chr.gender)
        mplew.write(chr.skinColor)
        mplew.writeInt(chr.face)
        //mplew.writeInt(chr.getJob());
        mplew.write(if (mega) 0 else 1)
        mplew.writeInt(chr.hair)
        val myEquip: MutableMap<Byte, Int> = LinkedHashMap()
        val maskedEquip: MutableMap<Byte, Int?> = LinkedHashMap()
        val equip = chr.getInventory(MapleInventoryType.EQUIPPED)
        for (item in equip.newList()) {
            if (item.position < -127) { //not visible
                continue
            }
            var pos = (item.position * -1).toByte()
            if (pos < 100 && myEquip[pos] == null) {
                myEquip[pos] = item.itemId
            } else if (pos > 100 && pos.toInt() != 111) {
                pos = (pos - 100).toByte()
                if (myEquip[pos] != null) {
                    maskedEquip[pos] = myEquip[pos]
                }
                myEquip[pos] = item.itemId
            } else if (myEquip[pos] != null) {
                maskedEquip[pos] = item.itemId
            }
        }
        for ((key, value) in myEquip) {
            mplew.write(key)
            mplew.writeInt(value)
        }
        mplew.write(0xFF) // end of visible itens
        // masked itens
        for ((key, value) in maskedEquip) {
            mplew.write(key)
            mplew.writeInt(value!!)
        }
        mplew.write(0xFF) // ending markers
        val cWeapon = equip.getItem(-111)
        mplew.writeInt(cWeapon?.itemId ?: 0)
        mplew.writeInt(0) //...pet?
        //mplew.writeLong(0);
    }

    @JvmStatic
    fun addExpirationTime(mplew: MaplePacketLittleEndianWriter, time: Long) {
        mplew.writeLong(getTime(time))
    }

    @JvmStatic
    @JvmOverloads
    fun addItemInfo(mplew: MaplePacketLittleEndianWriter, item: Item, zeroPosition: Boolean, leaveOut: Boolean, trade: Boolean = false, bagSlot: Boolean = false, chr: MapleCharacter? = null) {
        var pos = item.position
        if (zeroPosition) {
            if (!leaveOut) {
                mplew.write(0)
            }
        } else {
            if (pos <= -1) {
                pos.times(-1)
                if (pos > 100 && pos < 1000) {
                    pos.minus(100)
                    pos.minus(100)
                }
            }
            if (bagSlot) {
                mplew.writeInt(pos % 100 - 1)
            } else if (!trade && item.type.toInt() == 1) {
                mplew.writeShort(pos.toInt())
            } else {
                mplew.write(pos.toInt())
            }
        }
        mplew.write(if (item.pet != null) 3 else item.type)
        mplew.writeInt(item.itemId)
        val hasUniqueId = item.uniqueId > 0
        //marriage rings arent cash items so dont have uniqueids, but we assign them anyway for the sake of rings
        mplew.write(if (hasUniqueId) 1 else 0)
        if (hasUniqueId) {
            mplew.writeLong(item.uniqueId.toLong())
        }
        if (item.pet != null) { // Pet
            addPetItemInfo(mplew, item, item.pet, true)
        } else {
            addExpirationTime(mplew, item.expiration)
            //mplew.writeInt(chr == null ? -1 : chr.getExtendedSlots().indexOf(item.getItemId()));
            if (item.type.toInt() == 1) {
                val equip = item as Equip
                mplew.write(equip.upgradeSlots)
                mplew.write(equip.level)
                mplew.writeShort(equip.str.toInt())
                mplew.writeShort(equip.dex.toInt())
                mplew.writeShort(equip.int.toInt())
                mplew.writeShort(equip.luk.toInt())
                mplew.writeShort(equip.hp.toInt())
                mplew.writeShort(equip.mp.toInt())
                mplew.writeShort(equip.watk.toInt())
                mplew.writeShort(equip.matk.toInt())
                mplew.writeShort(equip.wdef.toInt())
                mplew.writeShort(equip.mdef.toInt())
                mplew.writeShort(equip.acc.toInt())
                mplew.writeShort(equip.avoid.toInt())
                mplew.writeShort(equip.hands.toInt())
                mplew.writeShort(equip.speed.toInt())
                mplew.writeShort(equip.jump.toInt())
                mplew.writeMapleAsciiString(equip.owner)
                mplew.writeShort(equip.flag.toInt())
                mplew.write(if (equip.incSkill > 0) 1 else 0)
                mplew.write(Math.max(equip.baseLevel, equip.equipLevel)) // Item level
                mplew.writeInt(equip.expPercentage * 100000) // Item Exp... 10000000 = 100%
                if (equip.uniqueId <= 0) {
                    mplew.writeLong(if (equip.inventoryId <= 0) -1 else equip.inventoryId) //some tracking ID
                }
                mplew.writeLong(getTime(-2))
                mplew.writeInt(-1)
                //                mplew.write(equip.getIncSkill() > 0 ? 1 : 0);
//                mplew.write(Math.max(equip.getBaseLevel(), equip.getEquipLevel())); // Item level
//                mplew.writeInt(equip.getExpPercentage() * 100000); // Item Exp... 10000000 = 100%
//                mplew.writeInt(equip.getDurability());
//                mplew.writeInt(equip.getViciousHammer());
//                mplew.writeShort(equip.getPVPDamage()); //OR is it below MPR? TODOO
//                if (!hasUniqueId) {
//                    mplew.write(equip.getState()); //7 = unique for the lulz
//                    mplew.write(equip.getEnhance());
//                    mplew.writeShort(equip.getPotential1());
//                    mplew.writeShort(equip.getPotential2());
//                    mplew.writeShort(equip.getPotential3());
//                }
//                mplew.writeShort(equip.getHpR());
//                mplew.writeShort(equip.getMpR());
//                mplew.writeLong(getTime(-2));
//                mplew.writeInt(-1); //?
            } else {
                mplew.writeShort(item.quantity.toInt())
                mplew.writeMapleAsciiString(item.owner)
                mplew.writeShort(item.flag.toInt())
                if (isThrowingStar(item.itemId) || isBullet(item.itemId) || item.itemId / 10000 == 287) {
                    mplew.writeLong(if (item.inventoryId <= 0) -1 else item.inventoryId)
                }
            }
        }
    }

    @JvmStatic
    fun serializeMovementList(lew: MaplePacketLittleEndianWriter, moves: List<LifeMovementFragment>) {
        lew.write(moves.size)
        for (move in moves) {
            move.serialize(lew)
        }
    }

    @JvmStatic
    fun addAnnounceBox(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        if (chr.playerShop != null && chr.playerShop.isOwner(chr) && chr.playerShop.shopType.toInt() != 1 && chr.playerShop.isAvailable) {
            addInteraction(mplew, chr.playerShop)
        } else {
            mplew.write(0)
        }
    }

    @JvmStatic
    fun addInteraction(mplew: MaplePacketLittleEndianWriter, shop: IMaplePlayerShop) {
        mplew.write(shop.gameType)
        mplew.writeInt((shop as AbstractPlayerStore).objectId)
        mplew.writeMapleAsciiString(shop.getDescription())
        if (shop.getShopType().toInt() != 1) {
            mplew.write(if (shop.getPassword().length > 0) 1 else 0) //password = false
        }
        if (shop.getItemId() == 4080100) {
            mplew.write((shop as MapleMiniGame).pieceType)
        } else if (shop.getItemId() >= 4080000 && shop.getItemId() < 4080100) {
            mplew.write((shop as MapleMiniGame).pieceType)
        } else {
            mplew.write(shop.getItemId() % 10)
        }
        mplew.write(shop.getSize()) //current size
        mplew.write(shop.getMaxSize()) //full slots... 4 = 4-1=3 = has slots, 1-1=0 = no slots
        if (shop.getShopType().toInt() != 1) {
            mplew.write(if (shop.isOpen()) 0 else 1)
        }
    }

    @JvmStatic
    fun addCharacterInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.writeLong(-1) //flag
        // flag 1
        addCharStats(mplew, chr)
        mplew.write(chr.buddylist.capacity)
        // flag 2~64
        addInventoryInfo(mplew, chr)
        // flag 0x100
        addSkillInfo(mplew, chr)
        // flag 0x8000
        addCoolDownInfo(mplew, chr)
        // flag 0x200, 0x4000
        addQuestInfo(mplew, chr)
        // flag 0x400, 0x800
        addRingInfo(mplew, chr)
        // flag 0x1000
        addRocksInfo(mplew, chr)
        // flag 0x20000, 0x10000
        addMonsterBookInfo(mplew, chr)
        //..?
//        mplew.writeShort(0);
//        mplew.write(0);
//        mplew.write(0);
// flag 0x40000
        chr.QuestInfoPacket(mplew) // for every questinfo: int16_t questid, string questdata
        // flag 0x80000 unknown
        mplew.writeShort(0) // PQ rank?
        // int32_t id, int16_t some data
    }

    fun addMonsterBookInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.writeInt(chr.monsterBookCover)
        mplew.write(0)
        chr.monsterBook.addCardPacket(mplew)
    }

    @JvmStatic
    fun addPetItemInfo(mplew: MaplePacketLittleEndianWriter, item: Item?, pet: MaplePet, active: Boolean) {
        if (item == null) {
            mplew.writeLong(getKoreanTimestamp((System.currentTimeMillis() * 1.5).toLong()))
        } else {
            addExpirationTime(mplew, if (item.expiration <= System.currentTimeMillis()) -1 else item.expiration)
        }
        pet.getName()?.let { mplew.writeAsciiString(it, 13) }
        mplew.write(pet.level)
        mplew.writeShort(pet.closeness.toInt())
        mplew.write(pet.fullness)
        if (item == null) {
            mplew.writeLong(getKoreanTimestamp((System.currentTimeMillis() * 1.5).toLong()))
        } else {
            addExpirationTime(mplew, if (item.expiration <= System.currentTimeMillis()) -1 else item.expiration)
        }
        mplew.writeShort(0)
        mplew.writeShort(pet.flags.toInt())
        mplew.writeInt(if (pet.petItemId == 5000054 && pet.getSecondsLeft() > 0) pet.getSecondsLeft() else 0)
    }

    @JvmStatic
    fun addShopInfo(mplew: MaplePacketLittleEndianWriter, shop: MapleShop /*, final MapleClient c*/) {
        val ii = MapleItemInformationProvider.getInstance()
        mplew.writeShort(shop.items.size /* + c.getPlayer().getRebuy().size()*/) // item count
        for (item in shop.items) {
            addShopItemInfo(mplew, item, shop, ii, null)
        }
        //        for (Item i : c.getPlayer().getRebuy()) {
//            addShopItemInfo(mplew, new MapleShopItem(i.getItemId(), (int) ii.getPrice(i.getItemId()), i.getQuantity()), shop, ii, i);
//        }
    }

    fun addShopItemInfo(mplew: MaplePacketLittleEndianWriter, item: MapleShopItem, shop: MapleShop?, ii: MapleItemInformationProvider, i: Item?) {
        mplew.writeInt(item.itemId)
        mplew.writeInt(item.price)
        //        if (GameConstants.GMS) {
//            mplew.write(0);
//        }
//        mplew.writeInt(item.getReqItem());
//        mplew.writeInt(item.getReqItemQ());
//        mplew.writeLong(0);
//        if (GameConstants.GMS) {
//            mplew.writeInt(0); //category? 7 = special
//        }
//mplew.writeLong(0);
        if (!isThrowingStar(item.itemId) && !isBullet(item.itemId)) {
            mplew.writeShort(1) // stacksize o.o
            mplew.writeShort(item.buyable.toInt())
        } else {
            mplew.writeZeroBytes(6)
            mplew.writeShort(BitTools.doubleToShortBits(ii.getPrice(item.itemId)))
            mplew.writeShort(ii.getSlotMax(item.itemId).toInt())
        }
        //mplew.writeShort(ii.getSlotMax(item.getItemId())); //its this for both for official servers, who cares though
//        if (GameConstants.GMS) { //TODO JUMP
//            mplew.write(i == null ? 0 : 1);
//            if (i != null) {
//                addItemInfo(mplew, i, true, true);
//            }
//        }
//        if (GameConstants.GMS && shop.getRanks().size() > 0) {
//            mplew.write(item.getRank() >= 0 ? 1 : 0);
//            if (item.getRank() >= 0) {
//                mplew.write(item.getRank());
//            }
//        }
    }

    fun addJaguarInfo(mplew: MaplePacketLittleEndianWriter, chr: MapleCharacter) {
        mplew.write(chr.getIntNoRecord(GameConstants.JAGUAR))
        mplew.writeZeroBytes(20) //probably mobID of the 5 mobs that can be captured.
    }

    @JvmStatic
    fun <E : Buffstat?> writeSingleMask(mplew: MaplePacketLittleEndianWriter, statup: E) {
        for (i in 0 until GameConstants.MAX_BUFFSTAT) {
            mplew.writeInt(if (i == statup!!.position - 1) statup.value else 0)
        }
    }

    @JvmStatic
    fun <E : Buffstat?> writeMask(mplew: MaplePacketLittleEndianWriter, statups: Collection<E>) {
        val mask = IntArray(GameConstants.MAX_BUFFSTAT)
        for (statup in statups) {
            mask[statup!!.position - 1] = mask[statup.position - 1] or statup.value
        }
        for (i in mask.indices) {
            mplew.writeInt(mask[i])
        }
    }

    fun <E : Buffstat?> writeBuffMask(mplew: MaplePacketLittleEndianWriter, statups: Collection<Pair<E, Int?>>) {
        val mask = IntArray(GameConstants.MAX_BUFFSTAT)
        for (statup in statups) {
            mask[statup.left!!.position - 1] = mask[statup.left!!.position - 1] or statup.left!!.value
        }
        for (i in mask.indices) {
            mplew.writeInt(mask[i])
        }
    }

    @JvmStatic
    fun <E : Buffstat?> writeBuffMask(mplew: MaplePacketLittleEndianWriter, statups: Map<E, Int?>) {
        val mask = IntArray(GameConstants.MAX_BUFFSTAT)
        for (statup in statups.keys) {
            mask[statup!!.position - 1] = mask[statup.position - 1] or statup.value
        }
        for (i in mask.indices) {
            mplew.writeInt(mask[i])
        }
    }
}