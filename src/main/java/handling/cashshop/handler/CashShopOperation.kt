package handling.cashshop.handler

import client.MapleCharacter
import client.MapleCharacterUtil
import client.MapleClient
import client.inventory.Item
import client.inventory.MapleInventoryIdentifier
import client.inventory.MapleInventoryType
import client.inventory.MapleRing
import constants.GameConstants
import constants.ServerConstants
import handling.cashshop.CashShopServer
import handling.channel.ChannelServer
import handling.login.LoginServer
import handling.world.CharacterTransfer
import handling.world.MaplePartyCharacter
import handling.world.PartyOperation
import handling.world.World
import org.springframework.boot.SpringApplication
import server.CashItemFactory
import server.MapleInventoryManipulator
import server.MapleItemInformationProvider
import server.log.DBLogger
import server.log.LogType
import server.log.Logger.log
import server.log.TypeOfLog
import tools.FileoutputUtil
import tools.MaplePacketCreator
import tools.data.LittleEndianAccessor
import tools.packet.CSPacket
import webapi.Application

class CashShopOperation {
    companion object {
        fun leaveCashShop(slea: LittleEndianAccessor, c: MapleClient, chr: MapleCharacter) {
            CashShopServer.playerStorage?.deregisterPlayer(chr)
            c.updateLoginState(MapleClient.LOGIN_SERVER_TRANSITION.toInt(), c.sessionIPAddress)
            try {
                World.ChannelChange_Data(CharacterTransfer(chr), chr.id, c.channel)
                LoginServer.setCodeHash(chr.id, c.codeHash)
                c.session.write(MaplePacketCreator.getChannelChange(c, ChannelServer.getInstance(c.channel).ip.split(":")[1].toInt()))
            } catch (e: Exception) {
                if (ServerConstants.showPacket) e.printStackTrace()
                log("${e.message}", "CashShopOperation", TypeOfLog.ERROR)
            } finally {
                val s = c.sessionIPAddress
                LoginServer.addIPAuth(s.substring(s.indexOf("/") + 1 , s.length))
                chr.saveToDB(false, true)
                c.player = null
                c.isReceiving = false
            }
        }

        fun enterCashShop(playerId: Int, c: MapleClient) {
            if (CashShopServer.isShutdown) {
                c.session.close(true)
                return
            }
            val transfer = CashShopServer.playerStorage?.getPendingCharacter(playerId)
            val chr = MapleCharacter.ReconstructChr(transfer, c, false)

            c.player = chr
            c.accID = chr.accountID
            if(!c.CheckIPAddress()) {
                c.session.close(true)
                return
            }
            val state: Byte = c.loginState
            var allowLogin = false
            if (state == MapleClient.LOGIN_SERVER_TRANSITION || state == MapleClient.CHANGE_CHANNEL) {
                if (!World.isCharacterListConnected(c.loadCharacterNames(c.world))) {
                    allowLogin = true
                }
            }
            if (!allowLogin) {
                c.player = null
                c.session.close(true)
                return
            }
            c.updateLoginState(MapleClient.LOGIN_LOGGEDIN.toInt(), c.sessionIPAddress)
            if (chr.party != null) {
                val party = chr.party
                World.Party.updateParty(party.id, PartyOperation.LOG_ONOFF, MaplePartyCharacter(chr))
            }
            CashShopServer.playerStorage?.registerPlayer(chr)
            c.session.write(CSPacket.warpCS(c))
            updateCashShop(c)
        }

        fun doCSPackets(c: MapleClient) {
            c.session.write(CSPacket.enableCSUse())
            c.session.write(CSPacket.showNXMapleTokens(c.player))
            c.session.write(CSPacket.getCSInventory(c))
            c.player.cashInventory.checkExpire(c)
        }

        fun updateCashShop(c: MapleClient) {
            c.session.write(CSPacket.getCSGifts(c))
            doCSPackets(c)
            c.session.write(CSPacket.sendWishList(c.player, false))
        }

        fun useCouponCode(code: String, c: MapleClient) {
            if (code.isEmpty()) {
                return
            }
            val info: Triple<Boolean, Int, Int>? = MapleCharacterUtil.getNXCodeInfo(code)

            if (info != null && info.first) {
                val type = info.second
                val item = info.third

                try {
                    MapleCharacterUtil.setNXCodeUsed(c.player.name, code)
                } catch (e: Exception) {
                    if (ServerConstants.showPacket) e.printStackTrace()
                }

                /*
                    Basically, this makes coupon codes do different things
                        Type 1: A-Cash,
                        Type 2: Maple Points
                        Type 3: Item.. use SN
                        Type 4: Mesos
                */
                val items: MutableMap<Int, Item> = HashMap()
                var maplePoints = 0
                var mesos = 0

                when (type) {
                    1, 2 -> {
                        c.player.modifyCSPoints(type, item, false)
                        maplePoints = item
                    }
                    3 -> {
                        val itemInfo = CashItemFactory.getInstance().getItem(item)
                        if (itemInfo == null) {
                            c.session.write(CSPacket.sendCSFail(0))
                            return
                        }
                        val slot = MapleInventoryManipulator.addId(c, itemInfo.id, 1, "", "Cash shop: coupon code" + " on " + FileoutputUtil.CurrentReadable_Date())
                        if (slot <= -1) {
                            c.session.write(CSPacket.sendCSFail(0))
                            return
                        } else {
                            items.put(item, c.player.getInventory(GameConstants.getInventoryType(item)).getItem(slot.toShort())!!)
                        }
                    }
                    4 -> {
                        c.player.gainMeso(item, false)
                        mesos = item
                    }
                }
                c.session.write(CSPacket.showCouponRedeemedItem(items, mesos, maplePoints, c))
            } else {
                c.session.write(CSPacket.sendCSFail(if(info == null) 131 else 129))
            }
        }

        fun buyCashItem(slea: LittleEndianAccessor, c: MapleClient, chr: MapleCharacter) {
            val action = slea.readByte().toInt()
            when (action) {
                0 -> {
                    slea.skip(2)
                    useCouponCode(slea.readMapleAsciiString(), c)
                }
                3 -> {
                    val toCharge = slea.readByte() + 1
                    val sn = slea.readInt()
                    val item = CashItemFactory.getInstance().getItem(sn)

                    if (item != null && chr.getCSPoints(toCharge) >= item.price) {
                        if (!item.genderEquals(c.player.gender.toInt())) {
                            c.session.write(CSPacket.sendCSFail(0))
                            return
                        } else if (c.player.cashInventory.itemsSize >= 100) {
                            c.session.write(CSPacket.sendCSFail(129))
                        }

                        for (i in GameConstants.cashBlock) {
                            if (item.id == i) {
                                c.player.dropMessage(1, cashBlockedMessage)
                                doCSPackets(c)
                                return
                            }
                        }
                        chr.modifyCSPoints(toCharge, -item.price, false)
                        val _item = chr.cashInventory.toItem(item)
                        if (_item != null && _item.uniqueId > 0 && _item.itemId == item.id && _item.quantity == item.count.toShort()) {
                            chr.cashInventory.addToInventory(_item)
                            c.session.write(CSPacket.showBoughtCSItem(_item, item.sn, c.accID))
                        } else {
                            c.session.write(CSPacket.sendCSFail(0))
                        }
                    } else {
                        c.session.write(CSPacket.sendCSFail(0))
                    }
                }
                4, 30 -> {
                    slea.skip(4)
                    val item = CashItemFactory.getInstance().getItem(slea.readInt())
                    val partnerName = slea.readMapleAsciiString()
                    val message = slea.readMapleAsciiString()
                    if (item == null || c.player.getCSPoints(1) < item.price || message.length > 73 || message.length < 1) {
                        c.session.write(CSPacket.sendCSFail(0))
                        doCSPackets(c)
                    }
                    val info = MapleCharacterUtil.getInfoByName(partnerName, c.player.world.toInt())
                    if (info == null || info.first.toInt() <= 0 || info.first == c.player.id || info.second == c.accID) {
                        c.session.write((CSPacket.sendCSFail(130)))
                        doCSPackets(c)
                        return
                    } else if (!item.genderEquals(info.third)) {
                        c.session.write((CSPacket.sendCSFail(130)))
                        doCSPackets(c)
                        return
                    } else {
                        c.player.cashInventory.gift(info.first, c.player.name, message, item.sn, MapleInventoryIdentifier.getInstance())
                        DBLogger.instance.logTrade(LogType.Trade.CashShopGift, c.player.id, c.player.name, partnerName, "Serial Number: ${item.sn} - ${item.count} ea / Cash : ${item.price}", "(CashShop) / Message : ${message}")
                        c.player.modifyCSPoints(1, -item.price, false)
                        c.session.write(CSPacket.sendGift(item.price, item.id, item.count, partnerName))
                        MapleCharacterUtil.sendNote(partnerName, c.player.name, "캐시샵에 선물이 도착했습니다. 확인해 주세요.", 0)
                    }
                }
                5 -> {
                    chr.clearWishlist()
                    if (slea.available() < 40) {
                        c.session.write(CSPacket.sendCSFail(0))
                        doCSPackets(c)
                        return
                    }
                    val wishlist = IntArray(10)
                    for (i in 0..10) {
                        wishlist[i] = slea.readInt()
                    }
                    chr.wishlist = wishlist
                    c.session.write(CSPacket.sendWishList(chr, true))
                }
                6 -> {
                    val toCharge = slea.readByte() + 1
                    val coupon = slea.readByte() > 0
                    val type: MapleInventoryType
                    val price: Int
                    val slotLimit: Int
                    val slot: Int
                    if (coupon) {
                        type = getInventoryType(slea.readInt())
                        price = 7600
                        slotLimit = 88
                        slot = 8
                    } else {
                        type = MapleInventoryType.getByType(slea.readByte())!!
                        price = 3800
                        slotLimit = 92
                        slot = 4
                    }
                    if (chr.getCSPoints(toCharge) >= price && chr.getInventory(type).slotLimit <= slotLimit) {
                        chr.modifyCSPoints(toCharge, -price, false)
                        chr.getInventory(type).addSlot(slot.toByte())
                        c.session.write(CSPacket.increasedInvSlots(type.type.toInt(), chr.getInventory(type).slotLimit.toInt()))
                    } else {
                        c.session.write(CSPacket.sendCSFail(141))
                    }
                }
                7 -> {
                    val toCharge = slea.readByte() + 1
                    val coupon = if (slea.readByte() > 0) 2 else 1
                    if (chr.getCSPoints(toCharge) >= 3800 * coupon && chr.storage.slots <= (48 - (4 * coupon))) {
                        chr.modifyCSPoints(toCharge, -3800 * coupon, false)
                        chr.storage.increaseSlots((4 * coupon).toByte())
                        chr.storage.saveToDB()
                        c.session.write(CSPacket.increasedStorageSlots(chr.storage.slots))
                    } else {
                        doCSFail(141, c)
                    }
                }
                8 -> {
                    slea.skip(1)
                    val toCharge = 1
                    val item = CashItemFactory.getInstance().getItem(slea.readInt())
                    val slots = c.characterSlots
                    if (item == null || c.player.getCSPoints(toCharge) < item.price || slots > 15 || item.id != 5430000) {
                        doCSFail(0, c)
                        doCSPackets(c)
                        return
                    }
                    if (c.gainCharacterSlot()) {
                        c.player.modifyCSPoints(toCharge, -item.price, false)
                        c.sendPacket(CSPacket.increasedCharacterSlots(slots + 1))
                    } else {
                        doCSFail(0, c)
                    }
                }
                12 -> {
                    val item = c.player.cashInventory.findByCashId(slea.readLong().toInt())
                    if (item != null && item.quantity > 0 && MapleInventoryManipulator.checkSpace(c, item.itemId, item.quantity.toInt(), item.owner)) {
                        val copiedItem = item.copy()
                        val pos = MapleInventoryManipulator.addbyItem(c, copiedItem, true)
                        if (pos >= 0) {
                            if (copiedItem.getPet() != null) {
                                copiedItem.getPet()!!.inventoryPosition = pos
                                c.player.addPet(copiedItem.petItem)
                            }
                            c.player.cashInventory.removeFromInventory(item)
                            c.session.write(CSPacket.confirmFromCSInventory(copiedItem, pos))
                        } else {
                            doCSFail(0, c)
                        }
                    } else {
                        doCSFail(0, c)
                    }
                }
                13 -> {
                    val uniqueId = slea.readLong().toInt()
                    val type = MapleInventoryType.getByType(slea.readByte())
                    val item = c.player.getInventory(type).findByUniqueId(uniqueId)

                    if (item != null && item.quantity > 0 && item.uniqueId > 0 && c.player.cashInventory.itemsSize < 100) {
                        val copiedItem = item.copy()
                        MapleInventoryManipulator.removeFromSlot(c, type, item.pos, item.quantity, false, false, false)
                        if (copiedItem.getPet() != null) {
                            c.player.removePetCS(copiedItem.getPet())
                        }
                        copiedItem.setPosition(0)
                        c.player.cashInventory.addToInventory(copiedItem)
                        c.session.write(CSPacket.confirmToCSInventory(item, c.accID, -1))
                    } else {
                        doCSFail(0, c)
                    }
                }
                25 -> {
                    slea.skip(4)
                    val uid = slea.readLong().toInt()
                    val item = c.player.cashInventory.findByCashId(uid)
                    if (item == null || item.expiration != (-1).toLong() || item.itemId / 1000000 != 1) {
                        doCSFail(129, c, true)
                    }
                    c.player.cashInventory.removeFromInventory(item)
                    c.session.write(CSPacket.payBackResult(uid, 0))
                }
                28, 34 -> {
                    //1.2.41 : 0x19 : crush
                    //1.2.41 : 0x1F : friendship
                    slea.skip(4)
                    val toCharge = 1
                    val item = CashItemFactory.getInstance().getItem(slea.readInt())
                    val partnerName = slea.readMapleAsciiString()
                    val message = slea.readMapleAsciiString()

                    if (item == null || !GameConstants.isEffectRing(item.id) || c.player.getCSPoints(toCharge) < item.price || message.length > 73 || message.length < 1) {
                        doCSFail(0, c, true)
                    } else if (!item.genderEquals(c.player.gender.toInt())) {
                        doCSFail(143, c, true)
                    } else if (c.player.cashInventory.itemsSize >= 100) {
                        doCSFail(129, c, true)
                    }

                    for (i in GameConstants.cashBlock) {
                        if (item.id == i) {
                            c.player.dropMessage(1, cashBlockedMessage)
                            doCSPackets(c)
                        }
                    }

                    val info = MapleCharacterUtil.getInfoByName(partnerName, c.player.world.toInt())
                    if (info == null || info.first <= 0 || info.first == c.player.id) {
                        doCSFail(144, c, true)
                    } else if (info.second == c.accID) {
                        doCSFail(130, c, true)
                    } else {
                        if (info.third == c.player.gender.toInt() && action == 28) {
                            doCSFail(143, c, true)
                        }
                        val error = MapleRing.createRing(item.id, c.player, partnerName, message, info.first, item.sn)
                        if (error != 1) {
                            doCSFail(0, c, true)
                        }
                        DBLogger.instance.logTrade(LogType.Trade.CashShopGift, c.player.id, c.player.name, partnerName, "Serial Number : ${item.sn} - ${item.count} ea / Cash : ${item.price}", "(CashShop) / Message : $message / ${if (action == 0x1C) "커플링" else "우정링"}")
                        c.player.modifyCSPoints(toCharge, -item.price, false)
                        c.session.write(CSPacket.sendGift(item.price, item.id, item.count, partnerName))
                        MapleCharacterUtil.sendNote(partnerName, c.player.name, "캐시샵에 선물이 도착했습니다. 확인해 주세요.", 0)
                    }
                }
                29 -> {
                    val toCharge = slea.readByte() + 1
                    val item = CashItemFactory.getInstance().getItem(slea.readInt())
                    var ccc: List<Int> = listOf()
                    if (item != null) {
                        ccc = CashItemFactory.getInstance().getPackageItems(item.id)
                    }
                    if (item == null || ccc.isEmpty() || c.player.getCSPoints(toCharge) < item.price) {
                        doCSFail(0, c, true)
                    } else if (!item.genderEquals(c.player.gender.toInt())) {
                        doCSFail(130, c, true)
                    } else if (c.player.cashInventory.itemsSize >= (100 - ccc.size)) {
                        doCSFail(129, c, true)
                    }

                    for (i in GameConstants.cashBlock) {
                        if (item.id == i) {
                            c.player.dropMessage(1, cashBlockedMessage)
                            doCSPackets(c)
                            return
                        }
                    }
                    val ccz = mapOf<Int, Item>().toMutableMap()
                    for (i in ccc) {
                        val cii = CashItemFactory.getInstance().getSimpleItem(i) ?: continue
                        val _item = c.player.cashInventory.toItem(cii)
                        if (_item == null || _item.uniqueId <= 0) continue
                        for (j in GameConstants.cashBlock) {
                            if (_item.itemId == j) {
                                c.player.dropMessage(1, cashBlockedMessage)
                                doCSPackets(c)
                                return
                            }
                        }
                        ccz.put(i, _item)
                    }
                    for (newItem in ccz.values) {
                        c.player.cashInventory.addToInventory(newItem)
                    }
                    chr.modifyCSPoints(toCharge, -item.price, false)
                    c.session.write(CSPacket.showBoughtCSPackage(ccz, c.accID))
                }
                31 -> {
                    val item = CashItemFactory.getInstance().getItem(slea.readInt())
                    if (item == null || !MapleItemInformationProvider.getInstance().isQuestItem(item.id)) doCSFail(0, c, true)
                    else if (c.player.meso < item.price) doCSFail(148, c, true)
                    else if (c.player.getInventory(GameConstants.getInventoryType(item.id)).getNextFreeSlot() < 0) doCSFail(129, c, true)
                    for (i in GameConstants.cashBlock) {
                        c.player.dropMessage(1, cashBlockedMessage)
                        doCSPackets(c)
                        return
                    }
                    val pos = MapleInventoryManipulator.addId(c, item.id, item.count.toShort(), null, "Cash shop: quest item" + " on " + FileoutputUtil.CurrentReadable_Date())
                    if (pos < 0) doCSFail(129, c, true)
                    chr.gainMeso(-item.price, false)
                    c.session.write(CSPacket.showBoughtCSQuestItem(item.price, item.count.toShort(), pos, item.id))
                }
                39 -> {
                    c.session.write(CSPacket.redeemResponse())
                }
                else -> doCSFail(0, c)
            }
            doCSPackets(c)
        }

        private fun doCSFail(errorCode: Int, c: MapleClient, doPacket: Boolean = false) {
            c.session.write(CSPacket.sendCSFail(errorCode))
            if (doPacket) doCSPackets(c)
        }

        fun getInventoryType(id: Int): MapleInventoryType {
            return when (id) {
                5020016 -> MapleInventoryType.EQUIP
                5020017 -> MapleInventoryType.USE
                5020018 -> MapleInventoryType.SETUP
                5020019 -> MapleInventoryType.ETC
                else -> MapleInventoryType.UNDEFINED
            }
        }

        val cashBlockedMessage = "현재 캐시샵에서 구매 불가능한 아이템입니다."
    }
}