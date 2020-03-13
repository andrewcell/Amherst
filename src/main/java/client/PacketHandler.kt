package client

import handling.RecvPacketOpcode
import handling.RecvPacketOpcode.*
import handling.SendPacketOpcode
import handling.cashshop.handler.CashShopOperation.Companion.buyCashItem
import handling.cashshop.handler.CashShopOperation.Companion.doCSPackets
import handling.cashshop.handler.CashShopOperation.Companion.enterCashShop
import handling.cashshop.handler.CashShopOperation.Companion.leaveCashShop
import handling.cashshop.handler.CashShopOperation.Companion.updateCashShop
import handling.cashshop.handler.CashShopOperation.Companion.useCouponCode
import handling.channel.handler.*
import handling.login.handler.CharLoginHandler
import tools.FileoutputUtil
import tools.data.LittleEndianAccessor
import java.sql.SQLException

class PacketHandler {
    companion object {
        @Throws(SQLException::class)
        fun handlePacket(c: MapleClient, cs: Boolean, headerNumber: Short, slea: LittleEndianAccessor) {
            var header = RecvPacketOpcode.RSA_KEY
            for (rev in RecvPacketOpcode.values()) {
                if (rev.value == headerNumber) {
                    header = rev
                    break
                }
            }
            when (header) {
                PONG -> c.pongReceived()
                LOGIN_PASSWORD -> CharLoginHandler.login(slea, c)
                CHARLIST_REQUEST -> CharLoginHandler.CharlistRequest(slea, c)
                CHECK_CHAR_NAME -> CharLoginHandler.CheckCharName(slea.readMapleAsciiString(), c)
                CREATE_CHAR -> CharLoginHandler.CreateChar(slea, c)
                DELETE_CHAR -> CharLoginHandler.DeleteChar(slea, c)
                CHAR_SELECT -> CharLoginHandler.CharSelect(slea, c)
                CHAR_SELECT_WITH_SPW -> CharLoginHandler.Character_WithSecondPassword(slea, c)
                AUTH_SECOND_PASSWORD -> CharLoginHandler.AuthSecondPassword(slea, c)
                CHANGE_CHANNEL -> InterServerHandler.ChangeChannel(slea, c, c.player)
                PLAYER_LOGGEDIN -> {
                    val playerid = slea.readInt()
                    if (cs) {
                        enterCashShop(playerid, c)
                    } else {
                        InterServerHandler.Loggedin(playerid, c)
                    }
                }
                ENTER_CASH_SHOP -> InterServerHandler.CashShopEnter(c, c.player)
                MOVE_PLAYER -> PlayerHandler.MovePlayer(slea, c, c.player)
                CHAR_INFO_REQUEST -> {
                    c.player.updateTick(slea.readInt())
                    PlayerHandler.CharInfoRequest(slea.readInt(), c, c.player)
                }
                CLOSE_RANGE_ATTACK -> PlayerHandler.closeRangeAttack(slea, c, c.player, false)
                RANGED_ATTACK -> PlayerHandler.rangedAttack(slea, c, c.player)
                PASSIVE_ENERGY -> PlayerHandler.closeRangeAttack(slea, c, c.player, true)
                SPECIAL_MOVE -> PlayerHandler.SpecialMove(slea, c, c.player)
                FACE_EXPRESSION -> PlayerHandler.ChangeEmotion(slea.readInt(), c.player)
                TAKE_DAMAGE -> PlayerHandler.TakeDamage(slea, c, c.player)
                HEAL_OVER_TIME -> PlayerHandler.Heal(slea, c.player)
                CANCEL_BUFF -> PlayerHandler.CancelBuffHandler(slea.readInt(), c.player)
                MECH_CANCEL -> PlayerHandler.CancelMech(slea, c.player)
                CANCEL_ITEM_EFFECT -> PlayerHandler.CancelItemEffect(slea.readInt(), c.player)
                USE_CHAIR -> PlayerHandler.UseChair(slea.readInt(), c, c.player)
                CANCEL_CHAIR -> PlayerHandler.CancelChair(slea.readShort(), c, c.player)
                WHEEL_OF_FORTUNE -> {
                }
                USE_ITEMEFFECT -> PlayerHandler.UseItemEffect(slea.readInt(), c, c.player)
                SKILL_EFFECT -> PlayerHandler.SkillEffect(slea, c.player)
                QUICK_SLOT -> PlayerHandler.QuickSlot(slea, c.player)
                MESO_DROP -> {
                    c.player.updateTick(slea.readInt())
                    PlayerHandler.DropMeso(slea.readInt(), c.player)
                }
                CHANGE_KEYMAP -> PlayerHandler.ChangeKeymap(slea, c.player)
                CHANGE_MAP -> if (cs) {
                    leaveCashShop(slea, c, c.player)
                } else {
                    PlayerHandler.ChangeMap(slea, c, c.player)
                }
                CHANGE_MAP_SPECIAL -> {
                    if (slea.available() > 0) {
                        slea.skip(1)
                        PlayerHandler.ChangeMapSpecial(slea.readMapleAsciiString(), c, c.player)
                    }
                }
                USE_INNER_PORTAL -> {
                    slea.skip(1)
                    PlayerHandler.InnerPortal(slea, c, c.player)
                }
                TROCK_ADD_MAP -> PlayerHandler.TrockAddMap(slea, c, c.player)
                SKILL_MACRO -> PlayerHandler.ChangeSkillMacro(slea, c.player)
                GIVE_FAME -> PlayersHandler.GiveFame(slea, c, c.player)
                TRANSFORM_PLAYER -> PlayersHandler.TransformPlayer(slea, c, c.player)
                NOTE_ACTION -> PlayersHandler.Note(slea, c.player)
                NOTE_RECEIVE_GIFT -> PlayersHandler.NoteFame(c.player)
                USE_DOOR -> PlayersHandler.UseDoor(slea, c.player)
                DAMAGE_REACTOR -> PlayersHandler.HitReactor(slea, c)
                CLICK_REACTOR, TOUCH_REACTOR -> PlayersHandler.TouchReactor(slea, c)
                CLOSE_CHALKBOARD -> c.player.chalkboard = null
                ITEM_SORT -> InventoryHandler.ItemSort(slea, c)
                ITEM_GATHER -> InventoryHandler.ItemGather(slea, c)
                ITEM_MOVE -> InventoryHandler.ItemMove(slea, c)
                MOVE_BAG -> InventoryHandler.MoveBag(slea, c)
                SWITCH_BAG -> InventoryHandler.SwitchBag(slea, c)
                ITEM_PICKUP -> InventoryHandler.Pickup_Player(slea, c, c.player)
                USE_CASH_ITEM -> InventoryHandler.UseCashItem(slea, c)
                USE_ITEM -> InventoryHandler.UseItem(slea, c, c.player)
                USE_COSMETIC -> InventoryHandler.UseCosmetic(slea, c, c.player)
                USE_RETURN_SCROLL -> InventoryHandler.UseReturnScroll(slea, c, c.player)
                USE_UPGRADE_SCROLL -> {
                    c.player.updateTick(slea.readInt())
                    InventoryHandler.UseUpgradeScroll(slea.readShort(), slea.readShort(), 0.toShort(), c, c.player)
                }
                USE_FLAG_SCROLL, USE_POTENTIAL_SCROLL, USE_EQUIP_SCROLL -> {
                    c.player.updateTick(slea.readInt())
                    InventoryHandler.UseUpgradeScroll(slea.readShort(), slea.readShort(), 0.toShort(), c, c.player)
                }
                USE_SUMMON_BAG -> InventoryHandler.UseSummonBag(slea, c, c.player)
                USE_TREASUER_CHEST -> InventoryHandler.UseTreasureChest(slea, c, c.player)
                USE_SKILL_BOOK -> {
                    c.player.updateTick(slea.readInt())
                    InventoryHandler.UseSkillBook(slea.readShort().toByte(), slea.readInt(), c, c.player)
                }
                USE_CATCH_ITEM -> InventoryHandler.UseCatchItem(slea, c, c.player)
                USE_MOUNT_FOOD -> InventoryHandler.UseMountFood(slea, c, c.player)
                REWARD_ITEM -> InventoryHandler.UseRewardItem(slea.readShort().toByte(), slea.readInt(), c, c.player)
                HYPNOTIZE_DMG -> MobHandler.HypnotizeDmg(slea, c.player)
                MOB_NODE -> MobHandler.MobNode(slea, c.player)
                DISPLAY_NODE -> MobHandler.DisplayNode(slea, c.player)
                MOVE_LIFE -> MobHandler.MoveMonster(slea, c, c.player)
                AUTO_ASSIGN_AP -> StatsHandling.AutoAssignAP(slea, c, c.player)
                AUTO_AGGRO -> MobHandler.AutoAggro(slea.readInt(), c.player)
                FRIENDLY_DAMAGE -> MobHandler.FriendlyDamage(slea, c.player)
                REISSUE_MEDAL -> PlayerHandler.ReIssueMedal(slea, c, c.player)
                MONSTER_BOMB -> MobHandler.MonsterBomb(slea.readInt(), c.player)
                MOB_BOMB -> MobHandler.MobBomb(slea, c.player)
                NPC_SHOP -> NPCHandler.NPCShop(slea, c, c.player)
                NPC_TALK -> NPCHandler.NPCTalk(slea, c, c.player)
                HIRED_REMOTE -> InventoryHandler.useRemoteHiredMerchant(slea, c)
                NPC_TALK_MORE -> NPCHandler.NPCMoreTalk(slea, c)
                NPC_ACTION -> NPCHandler.NPCAnimation(slea, c)
                QUEST_ACTION -> NPCHandler.QuestAction(slea, c, c.player)
                STORAGE -> NPCHandler.Storage(slea, c, c.player)
                GENERAL_CHAT -> if (c.player != null && c.player.map != null) {
                    ChatHandler.GeneralChat(slea.readMapleAsciiString(), slea.readByte(), c, c.player)
                }
                PARTYCHAT -> ChatHandler.Others(slea, c, c.player)
                WHISPER -> ChatHandler.Whisper_Find(slea, c)
                MESSENGER -> ChatHandler.Messenger(slea, c)
                DISTRIBUTE_AP -> StatsHandling.DistributeAP(slea, c, c.player)
                DISTRIBUTE_SP -> {
                    c.player.updateTick(slea.readInt())
                    StatsHandling.DistributeSP(slea.readInt(), c, c.player)
                }
                PLAYER_INTERACTION -> PlayerInteractionHandler.PlayerInteraction(slea, c, c.player)
                GUILD_OPERATION -> GuildHandler.Guild(slea, c)
                DENY_GUILD_REQUEST -> GuildHandler.DenyGuildRequest(slea.readByte(), slea.readMapleAsciiString(), c)
                ALLIANCE_OPERATION -> AllianceHandler.HandleAlliance(slea, c, false)
                DENY_ALLIANCE_REQUEST -> AllianceHandler.HandleAlliance(slea, c, true)
                PUBLIC_NPC -> NPCHandler.OpenPublicNpc(slea, c)
                BBS_OPERATION -> BBSHandler.BBSOperation(slea, c)
                PARTY_OPERATION -> PartyHandler.PartyOperation(slea, c)
                DENY_PARTY_REQUEST -> PartyHandler.DenyPartyRequest(slea, c)
                ALLOW_PARTY_INVITE -> PartyHandler.AllowPartyInvite(slea, c)
                BUDDYLIST_MODIFY -> BuddyListHandler.BuddyOperation(slea, c)
                CYGNUS_SUMMON -> UserInterfaceHandler.CygnusSummon_NPCRequest(c)
                SHIP_OBJECT -> UserInterfaceHandler.ShipObjectRequest(slea.readInt(), c)
                BUY_CS_ITEM -> buyCashItem(slea, c, c.player)
                COUPON_CODE -> {
                    useCouponCode(slea.readMapleAsciiString(), c)
                    useCouponCode(slea.readMapleAsciiString(), c)
                    doCSPackets(c)
                }
                CS_UPDATE -> updateCashShop(c)
                DAMAGE_SUMMON -> {
                    slea.skip(4)
                    SummonHandler.DamageSummon(slea, c.player)
                }
                MOVE_SUMMON -> SummonHandler.MoveSummon(slea, c.player)
                SUMMON_ATTACK -> SummonHandler.SummonAttack(slea, c, c.player)
                SUB_SUMMON -> SummonHandler.SubSummon(slea, c.player)
                REMOVE_SUMMON -> SummonHandler.RemoveSummon(slea, c)
                SPAWN_PET -> PetHandler.SpawnPet(slea, c, c.player)
                MOVE_PET -> PetHandler.MovePet(slea, c.player)
                PET_CHAT -> PetHandler.PetChat(slea.readShort(), slea.readMapleAsciiString(), c.player)
                PET_COMMAND -> PetHandler.PetCommand(slea, c)
                PET_FOOD -> PetHandler.PetFood(slea, c, c.player)
                PET_LOOT -> InventoryHandler.Pickup_Pet(slea, c, c.player)
                PET_AUTO_POT -> PetHandler.Pet_AutoPotion(slea, c, c.player)
                MONSTER_CARNIVAL -> MonsterCarnivalHandler.MonsterCarnival(slea, c)
                DUEY_ACTION -> DueyHandler.DueyOperation(slea, c)
                USE_HIRED_MERCHANT -> HiredMerchantHandler.UseHiredMerchant(c, true)
                MERCH_ITEM_STORE -> HiredMerchantHandler.MerchantItemStore(slea, c)
                /*CANCEL_DEBUFF ->
                MAPLETV -> */
                LEFT_KNOCK_BACK -> PlayerHandler.leftKnockBack(slea, c)
                SNOWBALL -> PlayerHandler.snowBall(slea, c)
                COCONUT -> PlayersHandler.hitCoconut(slea, c)
                REPAIR -> NPCHandler.repair(slea, c)
                REPAIR_ALL -> NPCHandler.repairAll(c)
                GAME_POLL -> UserInterfaceHandler.InGame_Poll(slea, c)
                OWL -> InventoryHandler.Owl(slea, c)
                OWL_WARP -> InventoryHandler.OwlWarp(slea, c)
                USE_OWL_MINERVA -> InventoryHandler.OwlMinerva(slea, c)
                RPS_GAME -> NPCHandler.RPSGame(slea, c)
                UPDATE_QUEST -> NPCHandler.UpdateQuest(slea, c)
                USE_ITEM_QUEST -> NPCHandler.UseItemQuest(slea, c)
                RING_ACTION -> PlayersHandler.RingAction(slea, c)
                SOLOMON -> PlayersHandler.Solomon(slea, c)
                USE_TELE_ROCK -> InventoryHandler.TeleRock(slea, c)
                PAM_SONG -> InventoryHandler.PamSong(slea, c)
                REPORT -> PlayersHandler.Report(slea, c)
                PARTY_SEARCH_START -> PartyHandler.PartySearchStart(slea, c)
                PARTY_SEARCH_STOP -> PartyHandler.PartySearchStop(slea, c)
                REQUEST_FAMILY -> FamilyHandler.RequestFamily(slea, c)
                OPEN_FAMILY -> FamilyHandler.OpenFamily(slea, c)
                FAMILY_OPERATION -> FamilyHandler.FamilyOperation(slea, c)
                DELETE_JUNIOR -> FamilyHandler.DeleteJunior(slea, c)
                DELETE_SENIOR -> FamilyHandler.DeleteSenior(slea, c)
                USE_FAMILY -> FamilyHandler.UseFamily(slea, c)
                FAMILY_PRECEPT -> FamilyHandler.FamilyPrecept(slea, c)
                FAMILY_SUMMON -> FamilyHandler.FamilySummon(slea, c)
                ACCEPT_FAMILY -> FamilyHandler.AcceptFamily(slea, c)
                ITEM_MAKER -> ItemMakerHandler.ItemMaker(slea, c)
                WEDDING_PRESENT -> PlayersHandler.WeddingPresent(slea, c)
                MONSTER_BOOK_COVER -> PlayerHandler.ChangeMonsterBookCover(slea.readInt(), c, c.player)
                QUEST_POT_FEED -> InventoryHandler.QuestPotFeed(slea, c)
                QUEST_POT_OPEN -> InventoryHandler.QuestPotOpen(slea, c)
                QUEST_POT -> {
                }
                PET_EXCEPTION_LIST -> PetHandler.PetExceptionPickup(slea, c.player)
                CLIENT_ERROR -> {
                    if (slea.available() >= 18) {
                        val str = slea.readMapleAsciiString()
                        if (str.startsWith("Invalid Decoding")) {
                            val invalidPacketData = str.substring(43)
                            var opcode = ""
                            var op = 0
                            op += invalidPacketData.substring(0, 2).toInt(16)
                            op += invalidPacketData.substring(3, 5).toInt(16) shl 8
                            for (spo in SendPacketOpcode.values()) {
                                if (spo.value.toInt() == op) {
                                    opcode = " (Opcode : " + spo.name + " - 0x" + Integer.toHexString(op) + ")"
                                    break
                                }
                            }
                            FileoutputUtil.log("ClientErrorPacket.txt", "Invalid Packet Decoding" + opcode + "\r\n" + invalidPacketData.toUpperCase())
                        }
                    }
                }
                else -> return
            }
        }
    }
}