/* 
 EpionWorld Season.2 : The Old KoreanMapleStory
 The client version is the release KMS 1.2.65
 All of Server structure made by : 토리(epionms_)
 Please do not sharing all of them
 */
package handling.channel.handler;

import client.MapleCharacter;
import client.MapleClient;
import client.MapleQuestStatus;
import client.SkillFactory;

import handling.cashshop.CashShopServer;
import handling.channel.ChannelServer;
import handling.login.LoginServer;
import handling.world.CharacterIdChannelPair;
import handling.world.CharacterTransfer;
import handling.world.MapleMessenger;
import handling.world.MapleMessengerCharacter;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PartyOperation;
import handling.world.PlayerBuffStorage;
import handling.world.World;
import handling.world.guild.MapleGuild;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import scripting.NPCScriptManager;
import server.MedalRanking;
import server.maps.FieldLimitType;
import server.marriage.MarriageManager;
import server.quest.MapleQuest;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.SystemUtils;
import tools.data.LittleEndianAccessor;
import tools.packet.CSPacket;
import tools.packet.FamilyPacket;

public class InterServerHandler {

    private static final List<Pair<Integer, String>> npcs = new ArrayList<Pair<Integer, String>>();

    static {
        npcs.add(new Pair<Integer, String>(2012010, "[엘마의 네펜데스 주스] 퀘스트가 없는 분은 클릭하세요."));
    }

    public static final void CashShopEnter(final MapleClient c, final MapleCharacter chr) {
        if (chr.hasBlockedInventory() || chr.getMap() == null || chr.getEventInstance() != null || c.getChannelServer() == null) {
            c.getSession().write(MaplePacketCreator.serverBlocked(2));
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (World.getPendingCharacterSize() >= 10) {
            chr.dropMessage(1, "The server is busy at the moment. Please try again in a minute or less.");
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final ChannelServer ch = ChannelServer.getInstance(c.getChannel());

        chr.changeRemoval();

        if (chr.getMessenger() != null) {
            MapleMessengerCharacter messengerplayer = new MapleMessengerCharacter(chr);
            World.Messenger.leaveMessenger(chr.getMessenger().getId(), messengerplayer);
        }
        PlayerBuffStorage.addBuffsToStorage(chr.getId(), chr.getAllBuffs());
        PlayerBuffStorage.addCooldownsToStorage(chr.getId(), chr.getCooldowns());
        PlayerBuffStorage.addDiseaseToStorage(chr.getId(), chr.getAllDiseases());

        World.ChannelChange_Data(new CharacterTransfer(chr), chr.getId(), -10);
        ch.removePlayer(chr);
        c.updateLoginState(MapleClient.CHANGE_CHANNEL, c.getSessionIPAddress());
        chr.saveToDB(false, false);
        chr.getMap().removePlayer(chr);

        LoginServer.setCodeHash(chr.getId(), c.getCodeHash());
        c.getSession().write(MaplePacketCreator.getChannelChange(c, Integer.parseInt(CashShopServer.getIPAddress().split(":")[1])));
        c.setPlayer(null);
        c.setReceiving(false);
    }

    public static final void Loggedin(final int playerid, final MapleClient c) {
        final ChannelServer channelServer = c.getChannelServer();
        if (channelServer.isShutdown()) {
            c.getSession().close(true);
            return;
        }
        MapleCharacter player;
        final CharacterTransfer transfer = channelServer.getPlayerStorage().getPendingCharacter(playerid);

        if (transfer == null) { // Player isn't in storage, probably isn't CC
            player = MapleCharacter.loadCharFromDB(playerid, c, true);
            Pair<String, String> ip = LoginServer.getLoginAuth(playerid);
            String s = c.getSessionIPAddress();
            if (ip == null || !s.substring(s.indexOf('/') + 1, s.length()).equals(ip.left)) {
                if (ip != null) {
                    LoginServer.putLoginAuth(playerid, ip.left, ip.right);
                }
                c.getSession().close(true);
                return;
            }
            c.setTempIP(ip.right);
        } else {
            player = MapleCharacter.ReconstructChr(transfer, c, true);
        }
        c.setPlayer(player);
        c.setAccID(player.getAccountID());
        if (!c.CheckIPAddress()) { // Remote hack
            c.getSession().close(true);
            return;
        }

        String codeHash = LoginServer.getCodeHash(playerid);
        if (codeHash == null) { // Hash is not found?!
            c.getSession().close(true);
            return;
        }
        c.setCodeHash(codeHash);

        final int state = c.getLoginState();
        boolean allowLogin = false;

        if (state == MapleClient.LOGIN_SERVER_TRANSITION || state == MapleClient.CHANGE_CHANNEL || state == MapleClient.LOGIN_NOTLOGGEDIN) {
            allowLogin = !World.isCharacterListConnected(c.loadCharacterNames(c.getWorld()));
            if (!allowLogin && (c.getPlayer().getName().equals("하켄")
                    || c.getPlayer().getName().equals("[시스템]")
                    || c.getPlayer().getName().equals("永遠"))) {
                allowLogin = true;
            }
        }
        if (!allowLogin) {
            c.setPlayer(null);
            c.getSession().close(true);
            return;
        }
        c.getChatBlockData();
        if (c.isChatBlocked()) {
            player.canTalk(false);
        }
        c.updateLoginState(MapleClient.LOGIN_LOGGEDIN, c.getSessionIPAddress());
        channelServer.addPlayer(player);
        player.giveCoolDowns(PlayerBuffStorage.getCooldownsFromStorage(player.getId()));
        player.silentGiveBuffs(PlayerBuffStorage.getBuffsFromStorage(player.getId()));
        player.giveSilentDebuff(PlayerBuffStorage.getDiseaseFromStorage(player.getId()));

        c.getSession().write(MaplePacketCreator.getCharInfo(player));
        player.removeAll(4031282, false);

        if (player.getMarriageId() > 0 && MarriageManager.getInstance().getMarriage(player.getMarriageId()) == null) {
            player.setMarriageId(0); // 파혼된 결혼/약혼
            for (int i = 1112300; i <= 1112311; ++i) { // 결혼 반지
                player.removeAllEquip(i, false);
            }
            for (int i = 4210000; i <= 4210011; ++i) { // 약혼 반지
                player.removeAll(i, false);
            }
            player.dropMessage(1, "이혼이 성립되었습니다.");
        }
        player.getMap().addPlayer(player);
        c.getSession().write(CSPacket.enableCSUse());
        c.getSession().write(MaplePacketCreator.setNPCScriptable(npcs));
        try {
            // Start of buddylist
            final int buddyIds[] = player.getBuddylist().getBuddyIds();
            World.Buddy.loggedOn(player.getName(), player.getId(), c.getChannel(), buddyIds);
            if (player.getParty() != null) {
                final MapleParty party = player.getParty();
                World.Party.updateParty(party.getId(), PartyOperation.LOG_ONOFF, new MaplePartyCharacter(player));
            }
            final CharacterIdChannelPair[] onlineBuddies = World.Find.multiBuddyFind(player.getId(), buddyIds);
            for (CharacterIdChannelPair onlineBuddy : onlineBuddies) {
                player.getBuddylist().get(onlineBuddy.getCharacterId()).setChannel(onlineBuddy.getChannel());
            }
            c.getSession().write(MaplePacketCreator.updateBuddylist(player.getBuddylist().getBuddiesValues()));

            // Start of Messenger
            final MapleMessenger messenger = player.getMessenger();
            if (messenger != null) {
                World.Messenger.silentJoinMessenger(messenger.getId(), new MapleMessengerCharacter(c.getPlayer()));
                World.Messenger.updateMessenger(messenger.getId(), c.getPlayer().getName(), c.getChannel());
            }

            // Start of Guild and alliance
            if (player.getGuildId() > 0) {
                World.Guild.setGuildMemberOnline(player.getMGC(), true, c.getChannel());
                c.getSession().write(MaplePacketCreator.showGuildInfo(player));
                final MapleGuild gs = World.Guild.getGuild(player.getGuildId());
                if (gs != null) {
                    final List<byte[]> packetList = World.Alliance.getAllianceInfo(gs.getAllianceId(), true);
                    if (packetList != null) {
                        for (byte[] pack : packetList) {
                            if (pack != null) {
                                c.getSession().write(pack);
                            }
                        }
                    }
                } else { //guild not found, change guild id
                    player.setGuildId(0);
                    player.setGuildRank((byte) 5);
                    player.setAllianceRank((byte) 5);
                    player.saveGuildStatus();
                }
            }
            if (player.getFamilyId() > 0) {
                World.Family.setFamilyMemberOnline(player.getMFC(), true, c.getChannel());
            }
            c.getSession().write(FamilyPacket.getFamilyData());
            c.getSession().write(FamilyPacket.getFamilyInfo(player));
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.Login_Error, e);
        }
        player.getClient().getSession().write(MaplePacketCreator.serverMessage(channelServer.getServerMessage()));
        player.sendMacros();
        player.showNote();
        player.updatePartyMemberHP();
        player.baseSkills();
        if (player.haveItem(1142005, 1, true, true) && player.getQuestStatus(29400) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.ExpertHunter).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.ExpertHunter, player.getName(), Integer.parseInt(player.getOneInfo(29400, "mon"))) != 0) {
                player.removeAllEquip(1142005, false);
                player.dropMessage(5, "전설적인 사냥꾼 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142006, 1, true, true) && player.getQuestStatus(29500) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.Pop).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.Pop, player.getName(), player.getFame()) != 0) {
                player.removeAllEquip(1142006, false);
                player.dropMessage(5, "메이플 아이돌스타 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142014, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.HenesysDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.HenesysDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142014, false);
                player.dropMessage(5, "헤네시스 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142015, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.ElliniaDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.ElliniaDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142015, false);
                player.dropMessage(5, "엘리니아 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142016, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.PerionDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.PerionDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142016, false);
                player.dropMessage(5, "페리온 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142017, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.KerningDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.KerningDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142017, false);
                player.dropMessage(5, "커닝시티 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142018, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.SleepyWoodDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.SleepyWoodDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142018, false);
                player.dropMessage(5, "슬리피우드 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142019, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.NautilusDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.NautilusDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142019, false);
                player.dropMessage(5, "노틸러스 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142030, 1, true, true) && player.getQuestStatus(29503) >= 1) {
            if (MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.LithDonor).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.LithDonor, player.getName(), Integer.parseInt(player.getOneInfo(29503, "money"))) != 0) {
                player.removeAllEquip(1142030, false);
                player.dropMessage(5, "리스항구 기부왕 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142007, 1, true, true) && player.getQuestStatus(29501) >= 1) {
            String d = player.getQuestNAdd(MapleQuest.getInstance(136000)).getCustomData();
            int d2 = 0;
            if (d == null) {
                d2 = 0;
            }
            d2 = Integer.parseInt(d);
            if (d2 == 0 || MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.HorntailSlayer).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.HorntailSlayer, player.getName(), d2) != 0) {
                player.removeAllEquip(1142007, false);
                player.dropMessage(5, "혼테일 슬레이어 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        if (player.haveItem(1142008, 1, true, true) && player.getQuestStatus(29502) >= 1) {
            String d = player.getQuestNAdd(MapleQuest.getInstance(136001)).getCustomData();
            int d2 = 0;
            if (d == null) {
                d2 = 0;
            }
            d2 = Integer.parseInt(d);
            if (d2 == 0 || MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.PinkbeanSlayer).isEmpty() || MedalRanking.canMedalRank(MedalRanking.MedalRankingType.PinkbeanSlayer, player.getName(), d2) != 0) {
                player.removeAllEquip(1142008, false);
                player.dropMessage(5, "핑크빈 슬레이어 자격이 박탈되어, 칭호가 회수되었습니다.");
            }
        }
        player.LoginCoin();
        c.getSession().write(MaplePacketCreator.getKeymap(player.getKeyLayout()));
        player.updatePetAuto();
        player.expirationTask(true, transfer == null);
        if (player.getJob() == 132) { // DARKKNIGHT
            player.checkBerserk();
        }
        player.spawnSavedPets();
        if (player.getStat().equippedSummon > 0) {
            SkillFactory.getSkill(player.getStat().equippedSummon).getEffect(1).applyTo(player);
        }
        DueyHandler.checkReceivePackage(player);
    }

    public static final void ChangeChannel(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getEventInstance() != null || chr.getMap() == null || (chr.isInBlockedMap() && !(chr.getMapId() >= 270010200 && chr.getMapId() <= 270030500)) || FieldLimitType.ChannelSwitch.check(chr.getMap().getFieldLimit())) {
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        if (World.getPendingCharacterSize() >= 10) {
            chr.dropMessage(1, "요청이 많아 일시적으로 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.");
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        final int chc = slea.readByte() + 1;
        if (!World.isChannelAvailable(chc)) {
            chr.dropMessage(1, "채널 수용량을 초과하였습니다. 잠시 후 다시 시도해 주세요.");
            c.getSession().write(MaplePacketCreator.enableActions());
            return;
        }
        chr.changeChannel(chc);
    }
}
