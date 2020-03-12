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
package scripting;

import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Map.Entry;

import client.*;
import client.inventory.Equip;
import client.inventory.Item;
import constants.GameConstants;
import client.inventory.ItemFlag;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryType;
import client.inventory.MapleRing;
import server.MapleCarnivalParty;
import server.Randomizer;
import server.MapleInventoryManipulator;
import server.MapleShopFactory;
import server.MapleSquad;
import server.maps.MapleMap;
import server.quest.MapleQuest;
import tools.MaplePacketCreator;
import server.MapleItemInformationProvider;
import handling.channel.ChannelServer;
import handling.channel.MapleGuildRanking;
import database.DatabaseConnection;
import handling.channel.handler.HiredMerchantHandler;
import handling.channel.handler.PlayersHandler;
import handling.login.LoginInformationProvider;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PlayerBuffValueHolder;
import handling.world.World;
import handling.world.guild.MapleGuild;
import server.MapleCarnivalChallenge;
import java.util.HashMap;
import handling.world.guild.MapleGuildAlliance;
import java.io.File;
import java.sql.ResultSet;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.EnumMap;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;
import javax.script.Invocable;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import server.ItemInformation;
import server.MapleStatEffect;
import server.MedalRanking;
import server.MedalRanking.MedalRankingType;
import server.RankingWorker;
import server.RankingWorker.PokebattleInformation;
import server.RankingWorker.PokedexInformation;
import server.RankingWorker.PokemonInformation;
import server.Timer.CloneTimer;
import server.life.MapleLifeFactory;
import server.life.MapleMonster;
import server.life.MapleMonsterInformationProvider;
import server.life.MapleNPC;
import server.life.MonsterDropEntry;
import server.life.PlayerNPC;
import server.maps.Event_DojoAgent;
import server.marriage.MarriageDataEntry;
import tools.FileoutputUtil;
import tools.Pair;
import tools.StringUtil;
import tools.Triple;

public class NPCConversationManager extends AbstractPlayerInteraction {

    private String getText;
    private byte type; // -1 = NPC, 0 = start quest, 1 = end quest
    private byte lastMsg = -1;
    public boolean pendingDisposal = false;
    private Invocable iv;
    private int objectId;
    private MapleInventory inv;
    private MapleItemInformationProvider inp;
    private final Map<String, MapleMonster> nameToMob = new ConcurrentHashMap<String, MapleMonster>();
    static final Map<String, Integer> mobnames = new HashMap<>();

    public NPCConversationManager(MapleClient c, int npc, int questid, byte type, Invocable iv) {
        super(c, npc, questid);
        this.type = type;
        this.iv = iv;
    }

    public Invocable getIv() {
        return iv;
    }

        public void reloadChar() { // Basically !fakerelog in NPC function form.

                getPlayer().getClient().getSession().write(MaplePacketCreator.getCharInfo(getPlayer()));
                getPlayer().getMap().removePlayer(getPlayer());
                getPlayer().getMap().addPlayer(getPlayer());
            }
    

        
    public static int getMobName(int mid) {
        if (mobnames.isEmpty()) {
            MapleDataProvider p = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz"));
            MapleData d = p.getData("Mob.img");
            for (MapleData dd : d) {
                mobnames.put(MapleDataTool.getString("name", dd, "null"), Integer.parseInt(dd.getName()));
            }
        }
        return mobnames.get(mid);
    }

    public String getPNPCName() {
        if (id >= 9901000) {
            for (PlayerNPC pnpc : c.getChannelServer().getAllPlayerNPC()) {
                if (pnpc.getId() == id) {
                    return pnpc.getName();
                }
            }
        }
        return "";
    }

    public int getNpc() {
        return id;
    }

    public int getQuest() {
        return id2;
    }

    public byte getType() {
        return type;
    }

    public void safeDispose() {
        pendingDisposal = true;
    }

    public void dispose() {
        NPCScriptManager.getInstance().dispose(c);
    }

    public void setObjectId(int i) {
        objectId = i;
    }

    public int getObjectId() {
        return objectId;
    }

    public void sendNext(String text) {
        sendNext(text, id);
    }

    public void sendNext(String text, int id) {
        sendNext(text, id, 0);
    }

    public void sendNext(String text, int id, int type) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { //sendNext will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) type, text, "00 01", (byte) 0));
        lastMsg = 0;
    }

    public void sendPrev(String text) {
        sendPrev(text, id);
    }

    public void sendPrev(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 0, text, "01 00", (byte) 0));
        lastMsg = 0;
    }

    public void sendNextPrev(String text) {
        sendNextPrev(text, id);
    }

    public void sendNextPrev(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 0, text, "01 01", (byte) 0));
        lastMsg = 0;
    }

    public void sendOk(String text) {
        sendOk(text, id);
    }

    public void sendOk(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 0, text, "00 00", (byte) 0));
        lastMsg = 0;
    }

    public void sendYesNo(String text) {
        sendYesNo(text, id);
    }

    public void sendYesNo(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 1, text, "", (byte) 0));
        lastMsg = 1;
    }

    public void sendAcceptDecline(String text) {
        askAcceptDecline(text);
    }

    public void sendAcceptDeclineNoESC(String text) {
        askAcceptDeclineNoESC(text);
    }

    public void askAcceptDecline(String text) {
        askAcceptDecline(text, id);
    }

    public void askAcceptDecline(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        lastMsg = (byte) 11;//(GameConstants.GMS ? 0xF : 0xE);
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) lastMsg, text, "", (byte) 0));
    }

    public void askAcceptDeclineNoESC(String text) {
        askAcceptDeclineNoESC(text, id);
    }

    public void askAcceptDeclineNoESC(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        lastMsg = (byte) 12;
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) lastMsg, text, "", (byte) 1));
    }

    public void askAvatar(String text, int... args) {
        if (lastMsg > -1) {
            return;
        }
        List<Integer> avatars = new ArrayList<Integer>();
        for (int i : args) {
            if (hasPath(i) || i < 100/* && (c.getPlayer().getFace() != i && c.getPlayer().getHair() != i && c.getPlayer().getSkinColor() != i)*/) {
                avatars.add(i);
            }
        }
        int[] avat = new int[avatars.size()];
        for (int i = 0; i < avatars.size(); ++i) {
            avat[i] = avatars.get(i);
        }
        c.getSession().write(MaplePacketCreator.getNPCTalkStyle(id, text, avat));
//        c.getSession().write(MaplePacketCreator.getNPCTalkStyle(id, text, args));
        lastMsg = 7;
    }

    public boolean hasPath(int avatar) {
        String path = "wz/Character.wz/";
        if (avatar >= 20000 && avatar < 30000) {
            path += "Face/";
        } else if (avatar >= 30000 && avatar < 40000) {
            path += "Hair/";
        } else if (avatar < 100) {
            return true;
        }
        path += "000" + avatar + ".img.xml";
        File f = new File(path);
        if (!f.exists()) {
            c.getPlayer().dropMessage(5, "Avatar " + avatar + " does not exists..");
        }
        return f.exists();
    }

    public void sendSimple(String text) {
        sendSimple(text, id);
    }

    public void sendSimple(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (!text.contains("#L")) { //sendSimple will dc otherwise!
            sendNext(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 4, text, "", (byte) 0));
        lastMsg = 4;
    }

    public void sendMSimple(String text, int id) {
        if (!text.contains("#L")) { //sendSimple will dc otherwise!
            sendNext(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalk(id, (byte) 4, text, "", (byte) 0));
        lastMsg = 4;
    }

    public void sendStyle(String text, int styles[]) {
        if (lastMsg > -1) {
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalkStyle(id, text, styles));
        lastMsg = 7;
    }

    public void sendGetNumber(String text, int def, int min, int max) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalkNum(id, text, def, min, max));
        lastMsg = 3;
    }

    public void sendGetText(String text) {
        sendGetText(text, id);
    }

    public void sendGetText(String text, int id) {
        if (lastMsg > -1) {
            return;
        }
        if (text.contains("#L")) { // will dc otherwise!
            sendSimple(text);
            return;
        }
        c.getSession().write(MaplePacketCreator.getNPCTalkText(id, text));
        lastMsg = 2;
    }

    public void setGetText(String text) {
        this.getText = text;
    }

    public String getText() {
        return getText;
    }

    public void setHair(int hair) {
        getPlayer().setHair(hair);
        getPlayer().updateSingleStat(MapleStat.HAIR, hair);
        getPlayer().equipChanged();
    }

    public void setFace(int face) {
        getPlayer().setFace(face);
        getPlayer().updateSingleStat(MapleStat.FACE, face);
        getPlayer().equipChanged();
    }

    public void setSkin(int color) {
        getPlayer().setSkinColor((byte) color);
        getPlayer().updateSingleStat(MapleStat.SKIN, color);
        getPlayer().equipChanged();
    }

    public int setRandomAvatar(int ticket, int... args_all) {
        if (!haveItem(ticket)) {
            return -1;
        }
        gainItem(ticket, (short) -1);

        List<Integer> avatars = new ArrayList<Integer>();
        for (int i : args_all) {
            if (hasPath(i) || i < 100/* && (c.getPlayer().getFace() != i && c.getPlayer().getHair() != i && c.getPlayer().getSkinColor() != i)*/) {
                avatars.add(i);
            }
        }
        int[] avat = new int[avatars.size()];
        for (int i = 0; i < avatars.size(); ++i) {
            avat[i] = avatars.get(i);
        }
        int args = avat[Randomizer.nextInt(avat.length)];
        if (args < 100) {
            c.getPlayer().setSkinColor((byte) args);
            c.getPlayer().updateSingleStat(MapleStat.SKIN, args);
        } else if (args < 30000) {
            c.getPlayer().setFace(args);
            c.getPlayer().updateSingleStat(MapleStat.FACE, args);
        } else {
            c.getPlayer().setHair(args);
            c.getPlayer().updateSingleStat(MapleStat.HAIR, args);
        }
        c.getPlayer().equipChanged();

        return 1;
    }

    public int setAvatar(int ticket, int args) {
        if (!haveItem(ticket)) {
            return -1;
        }
        gainItem(ticket, (short) -1);

        if (args < 100) {
            c.getPlayer().setSkinColor((byte) args);
            c.getPlayer().updateSingleStat(MapleStat.SKIN, args);
        } else if (args < 30000) {
            c.getPlayer().setFace(args);
            c.getPlayer().updateSingleStat(MapleStat.FACE, args);
        } else {
            c.getPlayer().setHair(args);
            c.getPlayer().updateSingleStat(MapleStat.HAIR, args);
        }
        c.getPlayer().equipChanged();

        return 1;
    }

    public void sendStorage() {
        c.getPlayer().setConversation(4);
        c.getPlayer().getStorage().sendStorage(c, id);
    }

    public void openShop(int id) {
        MapleShopFactory.getInstance().getShop(id).sendShop(c);
    }

    public void openShopNPC(int id) {
        MapleShopFactory.getInstance().getShop(id).sendShop(c, this.id);
    }

    public int gainGachaponItem(int id, int quantity) {
        return gainGachaponItem(id, quantity, c.getPlayer().getMap().getStreetName() + " - " + c.getPlayer().getMap().getMapName());
    }

    public int gainGachaponItem(int id, int quantity, final String msg) {
        try {
            if (!MapleItemInformationProvider.getInstance().itemExists(id)) {
                return -1;
            }
            final Item item = MapleInventoryManipulator.addbyId_Gachapon(c, id, (short) quantity);

            if (item == null) {
                return -1;
            }
            final byte rareness = GameConstants.gachaponRareItem(item.getItemId());
            if (rareness > 0) {
                World.Broadcast.broadcastMessage(MaplePacketCreator.getGachaponMega("[" + msg + "] " + c.getPlayer().getName(), " : Lucky winner of Gachapon!", item, rareness));
            }
            return item.getItemId();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }

    public void changeJob(int job) {
        c.getPlayer().changeJob(job);
    }

    public void startQuest(int idd) {
        MapleQuest.getInstance(idd).start(getPlayer(), id);
    }

    public void completeQuest(int idd) {
        MapleQuest.getInstance(idd).complete(getPlayer(), id);
    }

    public void forfeitQuest(int idd) {
        MapleQuest.getInstance(idd).forfeit(getPlayer());
    }

    public void forceStartQuest() {
        MapleQuest.getInstance(id2).forceStart(getPlayer(), getNpc(), null);
    }

    public void forceStartQuest(int idd) {
        MapleQuest.getInstance(idd).forceStart(getPlayer(), getNpc(), null);
    }

    public void forceStartQuest(String customData) {
        MapleQuest.getInstance(id2).forceStart(getPlayer(), getNpc(), customData);
    }

    public void forceCompleteQuest() {
        MapleQuest.getInstance(id2).forceComplete(getPlayer(), getNpc());
    }

    public void forceCompleteQuest(final int idd) {
        MapleQuest.getInstance(idd).forceComplete(getPlayer(), getNpc());
    }

    public String getQuestCustomData() {
        return c.getPlayer().getQuestNAdd(MapleQuest.getInstance(id2)).getCustomData();
    }

    public void setQuestCustomData(String customData) {
        getPlayer().getQuestNAdd(MapleQuest.getInstance(id2)).setCustomData(customData);
    }

    public int getMeso() {
        return getPlayer().getMeso();
    }

    public void gainAp(final int amount) {
        c.getPlayer().gainAp((short) amount);
    }

    public void expandInventory(byte type, int amt) {
        c.getPlayer().expandInventory(type, amt);
    }

    public void unequipEverything() {
        MapleInventory equipped = getPlayer().getInventory(MapleInventoryType.EQUIPPED);
        MapleInventory equip = getPlayer().getInventory(MapleInventoryType.EQUIP);
        List<Short> ids = new LinkedList<Short>();
        for (Item item : equipped.newList()) {
            ids.add(item.getPos());
        }
        for (short id : ids) {
            MapleInventoryManipulator.unequip(getC(), id, equip.getNextFreeSlot());
        }
    }

    public final void clearSkills() {
        Map<Skill, SkillEntry> skills = new HashMap<Skill, SkillEntry>(getPlayer().getSkills());
        for (Entry<Skill, SkillEntry> skill : skills.entrySet()) {
            getPlayer().changeSkillLevel(skill.getKey(), (byte) 0, (byte) 0);
        }
        skills.clear();
    }

    public boolean hasSkill(int skillid) {
        Skill theSkill = SkillFactory.getSkill(skillid);
        if (theSkill != null) {
            return c.getPlayer().getSkillLevel(theSkill) > 0;
        }
        return false;
    }

    public void updateBuddyCapacity(int capacity) {
        c.getPlayer().setBuddyCapacity((byte) capacity);
    }

    public int getBuddyCapacity() {
        return c.getPlayer().getBuddyCapacity();
    }

    public int partyMembersInMap() {
        int inMap = 0;
        if (getPlayer().getParty() == null) {
            return inMap;
        }
        for (MapleCharacter char2 : getPlayer().getMap().getCharactersThreadsafe()) {
            if (char2.getParty() != null && char2.getParty().getId() == getPlayer().getParty().getId()) {
                inMap++;
            }
        }
        return inMap;
    }

    public List<MapleCharacter> getPartyMembers() {
        if (getPlayer().getParty() == null) {
            return null;
        }
        List<MapleCharacter> chars = new LinkedList<MapleCharacter>(); // creates an empty array full of shit..
        for (MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            for (ChannelServer channel : ChannelServer.getAllInstances()) {
                MapleCharacter ch = channel.getPlayerStorage().getCharacterById(chr.getId());
                if (ch != null) { // double check <3
                    chars.add(ch);
                }
            }
        }
        return chars;
    }

    public void warpPartyWithExp(int mapId, int exp) {
        if (getPlayer().getParty() == null) {
            warp(mapId, 0);
            gainExp(exp);
            return;
        }
        MapleMap target = getMap(mapId);
        for (MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            MapleCharacter curChar = c.getChannelServer().getPlayerStorage().getCharacterByName(chr.getName());
            if ((curChar.getEventInstance() == null && getPlayer().getEventInstance() == null) || curChar.getEventInstance() == getPlayer().getEventInstance()) {
                curChar.changeMap(target, target.getPortal(0));
                curChar.gainExp(exp, true, false, true);
            }
        }
    }

    public void warpPartyWithExpMeso(int mapId, int exp, int meso) {
        if (getPlayer().getParty() == null) {
            warp(mapId, 0);
            gainExp(exp);
            gainMeso(meso);
            return;
        }
        MapleMap target = getMap(mapId);
        for (MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            MapleCharacter curChar = c.getChannelServer().getPlayerStorage().getCharacterByName(chr.getName());
            if ((curChar.getEventInstance() == null && getPlayer().getEventInstance() == null) || curChar.getEventInstance() == getPlayer().getEventInstance()) {
                curChar.changeMap(target, target.getPortal(0));
                curChar.gainExp(exp, true, false, true);
                curChar.gainMeso(meso, true);
            }
        }
    }

    public MapleSquad getSquad(String type) {
        return c.getChannelServer().getMapleSquad(type);
    }

    public int getSquadAvailability(String type) {
        final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
        if (squad == null) {
            return -1;
        }
        return squad.getStatus();
    }

    public boolean registerSquad(String type, int minutes, String startText) {
        if (c.getChannelServer().getMapleSquad(type) == null) {
            final MapleSquad squad = new MapleSquad(c.getChannel(), type, c.getPlayer(), minutes * 60 * 1000, startText);
            final boolean ret = c.getChannelServer().addMapleSquad(squad, type);
            if (ret) {
                final MapleMap map = c.getPlayer().getMap();

                map.broadcastMessage(MaplePacketCreator.getClock(minutes * 60));
                map.broadcastMessage(MaplePacketCreator.serverNotice(6, c.getPlayer().getName() + startText));
            } else {
                squad.clear();
            }
            return ret;
        }
        return false;
    }

    public final MapleCharacter getPlayerByName(String name) {
        MapleCharacter victim = getClient().getChannelServer().getPlayerStorage().getCharacterByName(name);
        return victim;
    }

    public boolean getSquadList(String type, byte type_) {
        try {
            final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
            if (squad == null) {
                return false;
            }
            if (type_ == 0 || type_ == 3) { // Normal viewing
                sendNext(squad.getSquadMemberString(type_));
            } else if (type_ == 1) { // Squad Leader banning, Check out banned participant
                sendSimple(squad.getSquadMemberString(type_));
            } else if (type_ == 2) {
                if (squad.getBannedMemberSize() > 0) {
                    sendSimple(squad.getSquadMemberString(type_));
                } else {
                    sendNext(squad.getSquadMemberString(type_));
                }
            }
            return true;
        } catch (NullPointerException ex) {
            FileoutputUtil.outputFileError(FileoutputUtil.ScriptEx_Log, ex);
            return false;
        }
    }

    public byte isSquadLeader(String type) {
        final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
        if (squad == null) {
            return -1;
        } else {
            if (squad.getLeader() != null && squad.getLeader().getId() == c.getPlayer().getId()) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public boolean reAdd(String eim, String squad) {
        EventInstanceManager eimz = getDisconnected(eim);
        MapleSquad squadz = getSquad(squad);
        if (eimz != null && squadz != null) {
            squadz.reAddMember(getPlayer());
            eimz.registerPlayer(getPlayer());
            return true;
        }
        return false;
    }

    public void banMember(String type, int pos) {
        final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
        if (squad != null) {
            squad.banMember(pos);
        }
    }

    public void acceptMember(String type, int pos) {
        final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
        if (squad != null) {
            squad.acceptMember(pos);
        }
    }

    public int addMember(String type, boolean join) {
        try {
            final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
            if (squad != null) {
                return squad.addMember(c.getPlayer(), join);
            }
            return -1;
        } catch (NullPointerException ex) {
            FileoutputUtil.outputFileError(FileoutputUtil.ScriptEx_Log, ex);
            return -1;
        }
    }

    public byte isSquadMember(String type) {
        final MapleSquad squad = c.getChannelServer().getMapleSquad(type);
        if (squad == null) {
            return -1;
        } else {
            if (squad.getMembers().contains(c.getPlayer())) {
                return 1;
            } else if (squad.isBanned(c.getPlayer())) {
                return 2;
            } else {
                return 0;
            }
        }
    }

    public void resetReactors() {
        getPlayer().getMap().resetReactors();
    }

    public void genericGuildMessage(int code) {
        c.getSession().write(MaplePacketCreator.genericGuildMessage((byte) code));
    }

    public void disbandGuild() {
        final int gid = c.getPlayer().getGuildId();
        if (gid <= 0 || c.getPlayer().getGuildRank() != 1) {
            return;
        }
        World.Guild.disbandGuild(gid);
    }

    public void increaseGuildCapacity(boolean trueMax) {
        if (c.getPlayer().getMeso() < 500000 && !trueMax) {
            c.getSession().write(MaplePacketCreator.serverNotice(1, "자네.. 메소는 충분히 갖고 있는건가?"));
            return;
        }
        final int gid = c.getPlayer().getGuildId();
        if (gid <= 0) {
            return;
        }
        if (World.Guild.increaseGuildCapacity(gid, trueMax)) {
            if (!trueMax) {
                c.getPlayer().gainMeso(-500000, true, true);
            } else {
                gainGP(-2000);
            }
            //sendNext("축하하네~ 길드 최대 인원이 늘어났네.");
        } else if (!trueMax) {
            sendNext("이미 길드 최대 인원 제한인 100 명이 된 것 같군.");
        } else {
            sendNext("길드 포인트가 충분히 있는지, 또는 이미 최대 인원 200명이 된건 아닌지 확인해 보게나.");
        }
    }

    public void displayGuildRanks() {
        c.getSession().write(MaplePacketCreator.showGuildRanks(id, MapleGuildRanking.getInstance().getRank()));
    }

    public boolean removePlayerFromInstance() {
        if (c.getPlayer().getEventInstance() != null) {
            c.getPlayer().getEventInstance().removePlayer(c.getPlayer());
            return true;
        }
        return false;
    }

    public boolean isPlayerInstance() {
        if (c.getPlayer().getEventInstance() != null) {
            return true;
        }
        return false;
    }

    public String EquipList2(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIP);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.list()) {
            stra.add("#L" + item.getItemId() + "##v" + item.getItemId() + "# #t" + item.getItemId() + "##l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public final Map<String, Integer> getEquipStats(final int itemId) {
        final ItemInformation i = inp.getItemInformation(itemId);
        if (i == null) {
            return null;
        }
        return i.equipStats;
    }

    public String EquippedListForId(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIPPED);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.list()) {
            stra.add("#L" + item.getItemId() + "# #t" + item.getItemId() + "##l\r\n");
            getPlayer().setUpItemSlot(item.getPos());
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String EquippedList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIPPED);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.list()) {
            stra.add("#L" + item.getPos() + "# #t" + item.getItemId() + "##l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String EquipList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIP);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.list()) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "# #t" + item.getItemId() + "##l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String ChoiceEquipList(int id, MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIP);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.listById(id)) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "# #t" + item.getItemId() + "# (" + item.getOwner() + ")#l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String ChoiceEquippedList(int id, MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIPPED);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.listById(id)) {
            stra.add("#L" + item.getPos() + "# #t" + item.getItemId() + "# 의 초월을 부탁드립니다.\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String UseList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory use = c.getPlayer().getInventory(MapleInventoryType.USE);
        List<String> stra = new LinkedList<String>();
        for (Item item : use.list()) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "##l");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String CashList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory cash = c.getPlayer().getInventory(MapleInventoryType.CASH);
        List<String> stra = new LinkedList<String>();
        for (Item item : cash.list()) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "# #b#t" + item.getItemId() + "##k#l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String ETCList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory etc = c.getPlayer().getInventory(MapleInventoryType.ETC);
        List<String> stra = new LinkedList<String>();
        for (Item item : etc.list()) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "# #b#t" + item.getItemId() + "##k#l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String ETCListToid(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory etc = c.getPlayer().getInventory(MapleInventoryType.ETC);
        List<String> stra = new LinkedList<String>();
        for (Item item : etc.list()) {
            stra.add("#L" + item.getItemId() + "##v" + item.getItemId() + "# #b#t" + item.getItemId() + "##k#l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String EquipListToid(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory equip = c.getPlayer().getInventory(MapleInventoryType.EQUIP);
        List<String> stra = new LinkedList<String>();
        for (Item item : equip.list()) {
            stra.add("#L" + item.getItemId() + "##v" + item.getItemId() + "# #t" + item.getItemId() + "##l\r\n");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public String SetupList(MapleClient c) {
        StringBuilder str = new StringBuilder();
        MapleInventory setup = c.getPlayer().getInventory(MapleInventoryType.SETUP);
        List<String> stra = new LinkedList<String>();
        for (Item item : setup.list()) {
            stra.add("#L" + item.getPos() + "##v" + item.getItemId() + "##l");
        }
        for (String strb : stra) {
            str.append(strb);
        }
        return str.toString();
    }

    public void changeStat(byte slot, int type, short amount) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem(slot);
        switch (type) {
            case 0:
                sel.setStr(amount);
                break;
            case 1:
                sel.setDex(amount);
                break;
            case 2:
                sel.setInt(amount);
                break;
            case 3:
                sel.setLuk(amount);
                break;
            case 4:
                sel.setHp(amount);
                break;
            case 5:
                sel.setMp(amount);
                break;
            case 6:
                sel.setWatk(amount);
                break;
            case 7:
                sel.setMatk(amount);
                break;
            case 8:
                sel.setWdef(amount);
                break;
            case 9:
                sel.setMdef(amount);
                break;
            case 10:
                sel.setAcc(amount);
                break;
            case 11:
                sel.setAvoid(amount);
                break;
            case 12:
                sel.setHands(amount);
                break;
            case 13:
                sel.setSpeed(amount);
                break;
            case 14:
                sel.setJump(amount);
                break;
            case 15:
                sel.setUpgradeSlots((byte) amount);
                break;
            case 16:
                sel.setViciousHammer((byte) amount);
                break;
            case 17:
                sel.setLevel((byte) amount);
                break;
            case 18:
                sel.setEnhance((byte) amount);
                break;
            case 19:
                sel.setPotential1(amount);
                break;
            case 20:
                sel.setPotential2(amount);
                break;
            case 21:
                sel.setPotential3(amount);
                break;
            case 22:
                sel.setOwner(getText());
                break;
            case 23:
                if (sel.getOwner() == null) {
                    sel.setOwner("★☆☆☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★☆☆☆☆☆☆☆☆☆") {
                    sel.setOwner("★★☆☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★☆☆☆☆☆☆☆☆") {
                    sel.setOwner("★★★☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★☆☆☆☆☆☆☆") {
                    sel.setOwner("★★★★☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★★☆☆☆☆☆☆") {
                    sel.setOwner("★★★★★☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★★★☆☆☆☆☆") {
                    sel.setOwner("★★★★★★☆☆☆☆");
                } else if (sel.getOwner() == "★★★★★★☆☆☆☆") {
                    sel.setOwner("★★★★★★★☆☆☆");
                } else if (sel.getOwner() == "★★★★★★★☆☆☆") {
                    sel.setOwner("★★★★★★★★☆☆");
                } else if (sel.getOwner() == "★★★★★★★★☆☆") {
                    sel.setOwner("★★★★★★★★★☆");
                } else if (sel.getOwner() == "★★★★★★★★★☆") {
                    sel.setOwner("★★★★★★★★★★");
                }
                break;
            default:
                break;
        }
        c.getPlayer().equipChanged();
    }

    public Item getinv(int accId) {
        return inv.findById(accId);
    }

    public String getOwner(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        switch (type) {
            case 0:
                return sel.getOwner();
            default:
                return null;
        }
    }

    public String getOwnerByEquipped(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem(slot);
        switch (type) {
            case 0:
                return sel.getOwner();
            default:
                return null;
        }
    }

    public short getEquippedItemStat(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem(slot);
        switch (type) {
            case 0:
                return sel.getStr();
            case 1:
                return sel.getDex();
            case 2:
                return sel.getInt();
            case 3:
                return sel.getLuk();
            case 4:
                return sel.getHp();
            case 5:
                return sel.getMp();
            case 6:
                return sel.getWatk();
            case 7:
                return sel.getMatk();
            case 8:
                return sel.getWdef();
            case 9:
                return sel.getMdef();
            case 10:
                return sel.getAcc();
            case 11:
                return sel.getAvoid();
            case 12:
                return sel.getHands();
            case 13:
                return sel.getSpeed();
            case 14:
                return sel.getJump();
            case 15:
                return sel.getUpgradeSlots();
            case 16:
                return sel.getViciousHammer();
            case 17:
                return sel.getLevel();
            case 18:
                return sel.getEnhance();
            case 20:
                return sel.getState();
            case 21:
                return sel.getHands();
            case 22:
                return sel.getFlag();
            default:
                return 0;
        }
    }

    public short getItemStat(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        switch (type) {
            case 0:
                return sel.getStr();
            case 1:
                return sel.getDex();
            case 2:
                return sel.getInt();
            case 3:
                return sel.getLuk();
            case 4:
                return sel.getHp();
            case 5:
                return sel.getMp();
            case 6:
                return sel.getWatk();
            case 7:
                return sel.getMatk();
            case 8:
                return sel.getWdef();
            case 9:
                return sel.getMdef();
            case 10:
                return sel.getAcc();
            case 11:
                return sel.getAvoid();
            case 12:
                return sel.getHands();
            case 13:
                return sel.getSpeed();
            case 14:
                return sel.getJump();
            case 15:
                return sel.getUpgradeSlots();
            case 16:
                return sel.getViciousHammer();
            case 17:
                return sel.getLevel();
            case 18:
                return sel.getEnhance();
            case 20:
                return sel.getState();
            case 21:
                return sel.getHands();
            case 22:
                return sel.getFlag();
            default:
                return 0;
        }
    }

    public short getIStr(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getStr();
    }

    public short getIDex(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getDex();
    }

    public short getIInt(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getInt();
    }

    public short getILuk(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getLuk();
    }

    public short getIUpgrade(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getUpgradeSlots();
    }

    public short getIMp(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getMp();
    }

    public short getIHp(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getHp();
    }

    public short getIWat(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getWatk();
    }

    public short getIMat(byte slot, int type) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        return sel.getMatk();
    }

    public void setOwner(byte slot, int type, String v) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        switch (type) {
            case 0:
                sel.setOwner(v);
                break;
            default:
                break;
        }
        c.getPlayer().equipChanged();
    }

    public void setOwner2(byte slot, int type, String v) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem(slot);
        switch (type) {
            case 0:
                sel.setOwner(v);
                break;
            default:
                break;
        }
        c.getPlayer().equipChanged();
    }

    public void changeStat2(byte slot, int type, short amount) {
        Equip sel = (Equip) c.getPlayer().getInventory(MapleInventoryType.EQUIP).getItem(slot);
        switch (type) {
            case 0:
                sel.setStr(amount);
                break;
            case 1:
                sel.setDex(amount);
                break;
            case 2:
                sel.setInt(amount);
                break;
            case 3:
                sel.setLuk(amount);
                break;
            case 4:
                sel.setHp(amount);
                break;
            case 5:
                sel.setMp(amount);
                break;
            case 6:
                sel.setWatk(amount);
                break;
            case 7:
                sel.setMatk(amount);
                break;
            case 8:
                sel.setWdef(amount);
                break;
            case 9:
                sel.setMdef(amount);
                break;
            case 10:
                sel.setAcc(amount);
                break;
            case 11:
                sel.setAvoid(amount);
                break;
            case 12:
                sel.setHands(amount);
                break;
            case 13:
                sel.setSpeed(amount);
                break;
            case 14:
                sel.setJump(amount);
                break;
            case 15:
                sel.setUpgradeSlots((byte) amount);
                break;
            case 16:
                sel.setViciousHammer((byte) amount);
                break;
            case 17:
                sel.setLevel((byte) amount);
                break;
            case 18:
                sel.setEnhance((byte) amount);
                break;
            case 19:
                sel.setPotential1(amount);
                break;
            case 20:
                sel.setPotential2(amount);
                break;
            case 21:
                sel.setPotential3(amount);
                break;
            case 22:
                sel.setOwner(getText());
                break;
            case 23:
                if (sel.getOwner() == null) {
                    sel.setOwner("★☆☆☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★☆☆☆☆☆☆☆☆☆") {
                    sel.setOwner("★★☆☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★☆☆☆☆☆☆☆☆") {
                    sel.setOwner("★★★☆☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★☆☆☆☆☆☆☆") {
                    sel.setOwner("★★★★☆☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★★☆☆☆☆☆☆") {
                    sel.setOwner("★★★★★☆☆☆☆☆");
                } else if (sel.getOwner() == "★★★★★☆☆☆☆☆") {
                    sel.setOwner("★★★★★★☆☆☆☆");
                } else if (sel.getOwner() == "★★★★★★☆☆☆☆") {
                    sel.setOwner("★★★★★★★☆☆☆");
                } else if (sel.getOwner() == "★★★★★★★☆☆☆") {
                    sel.setOwner("★★★★★★★★☆☆");
                } else if (sel.getOwner() == "★★★★★★★★☆☆") {
                    sel.setOwner("★★★★★★★★★☆");
                } else if (sel.getOwner() == "★★★★★★★★★☆") {
                    sel.setOwner("★★★★★★★★★★");
                }
                break;
            default:
                break;
        }
        c.getPlayer().equipChanged();
    }

    public void openDuey() {
        c.getPlayer().setConversation(2);
        c.getSession().write(MaplePacketCreator.sendDuey((byte) 9, null, null));
    }

    public void openMerchantItemStore() {
        c.getPlayer().setConversation(3);
        HiredMerchantHandler.displayMerch(c);
        //c.getSession().write(PlayerShopPacket.merchItemStore((byte) 0x22));
        //c.getPlayer().dropMessage(5, "Please enter ANY 13 characters.");
    }

    public final short getKegs() {
        return c.getChannelServer().getFireWorks().getKegsPercentage();
    }

    public boolean TimeCheck(int Start, int End) {
        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();
        if (date.getHours() >= Start && date.getHours() <= End) {
            return true;
        }
        return false;
    }

    public boolean WhatDay(int day) {
        Calendar calendar = Calendar.getInstance(Locale.KOREAN);
        Date date = calendar.getTime();
        if (date.getDay() == day) {
            return true;
        }
        return false;
    }

    public boolean TimeCheckWithMin(int start, int end) {
        Date date = new Date();
        date.setYear(2013);
        String year = "" + date.getYear();
        String hour = date.getHours() < 0 ? "0" + date.getHours() : "" + date.getHours();
        String min = date.getMinutes() < 0 ? "0" + date.getMinutes() : "" + date.getMinutes();
        int time = Integer.parseInt(year + hour + min);
        if (time >= start && time <= end) {
            return true;
        }
        return false;
    }

    public boolean TimeCheckWithMins(int Start, int End) {
        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();
        if (date.getHours() >= Start && date.getHours() <= End) {
            return true;
        }
        return false;
    }

    public void giveKegs(final int kegs) {
        c.getChannelServer().getFireWorks().giveKegs(c.getPlayer(), kegs);
    }

    public short getSun() {
        return c.getChannelServer().getFireWorks().getSun();
    }

    public final short getSunshines() {
        return c.getChannelServer().getFireWorks().getSunsPercentage();
    }

    public int getSunGage() {
        return c.getChannelServer().getFireWorks().getSunGage();
    }

    public void addSunshines(final int kegs) {
        c.getChannelServer().getFireWorks().giveSuns(c.getPlayer(), kegs);
    }

    public final short getDecorations() {
        return c.getChannelServer().getFireWorks().getDecsPercentage();
    }

    public void addDecorations(final int kegs) {
        try {
            c.getChannelServer().getFireWorks().giveDecs(c.getPlayer(), kegs);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public final MapleCarnivalParty getCarnivalParty() {
        return c.getPlayer().getCarnivalParty();
    }

    public final MapleCarnivalChallenge getNextCarnivalRequest() {
        return c.getPlayer().getNextCarnivalRequest();
    }

    public final MapleCarnivalChallenge getCarnivalChallenge(MapleCharacter chr) {
        return new MapleCarnivalChallenge(chr);
    }

    public void maxStats() {
        Map<MapleStat, Integer> statup = new EnumMap<MapleStat, Integer>(MapleStat.class);
        c.getPlayer().getStat().str = (short) 32767;
        c.getPlayer().getStat().dex = (short) 32767;
        c.getPlayer().getStat().int_ = (short) 32767;
        c.getPlayer().getStat().luk = (short) 32767;

        c.getPlayer().getStat().maxhp = 30000;
        c.getPlayer().getStat().maxmp = 30000;
        c.getPlayer().getStat().setHp(30000, c.getPlayer());
        c.getPlayer().getStat().setMp(30000, c.getPlayer());

        statup.put(MapleStat.STR, Integer.valueOf(32767));
        statup.put(MapleStat.DEX, Integer.valueOf(32767));
        statup.put(MapleStat.LUK, Integer.valueOf(32767));
        statup.put(MapleStat.INT, Integer.valueOf(32767));
        statup.put(MapleStat.HP, Integer.valueOf(30000));
        statup.put(MapleStat.MAXHP, Integer.valueOf(30000));
        statup.put(MapleStat.MP, Integer.valueOf(30000));
        statup.put(MapleStat.MAXMP, Integer.valueOf(30000));
        c.getPlayer().getStat().recalcLocalStats(c.getPlayer());
        c.getSession().write(MaplePacketCreator.updatePlayerStats(statup, c.getPlayer().getJob()));
    }

    public boolean getSR(Triple<String, Map<Integer, String>, Long> ma, int sel) {
        if (ma.mid.get(sel) == null || ma.mid.get(sel).length() <= 0) {
            dispose();
            return false;
        }
        sendOk(ma.mid.get(sel));
        return true;
    }

    public Equip getEquip(int itemid) {
        return (Equip) MapleItemInformationProvider.getInstance().getEquipById(itemid);
    }

    public void setExpiration(Object statsSel, long expire) {
        if (statsSel instanceof Equip) {
            ((Equip) statsSel).setExpiration(System.currentTimeMillis() + (expire * 24 * 60 * 60 * 1000));
        }
    }

    public void setLock(Object statsSel) {
        if (statsSel instanceof Equip) {
            Equip eq = (Equip) statsSel;
            if (eq.getExpiration() == -1) {
                eq.setFlag((short) (eq.getFlag() | ItemFlag.LOCK.getValue()));
            } else {
                eq.setFlag((short) (eq.getFlag() | ItemFlag.UNTRADEABLE.getValue()));
            }
        }
    }

    public boolean addFromDrop(Object statsSel) {
        if (statsSel instanceof Item) {
            final Item it = (Item) statsSel;
            return MapleInventoryManipulator.checkSpace(getClient(), it.getItemId(), it.getQuantity(), it.getOwner()) && MapleInventoryManipulator.addFromDrop(getClient(), it, false);
        }
        return false;
    }

    public boolean replaceItem(int slot, int invType, Object statsSel, int offset, String type) {
        return replaceItem(slot, invType, statsSel, offset, type, false);
    }

    public boolean replaceItem(int slot, int invType, Object statsSel, int offset, String type, boolean takeSlot) {
        MapleInventoryType inv = MapleInventoryType.Companion.getByType((byte) invType);
        if (inv == null) {
            return false;
        }
        Item item = getPlayer().getInventory(inv).getItem((byte) slot);
        if (item == null || statsSel instanceof Item) {
            item = (Item) statsSel;
        }
        if (offset > 0) {
            if (inv != MapleInventoryType.EQUIP) {
                return false;
            }
            Equip eq = (Equip) item;
            if (takeSlot) {
                if (eq.getUpgradeSlots() < 1) {
                    return false;
                } else {
                    eq.setUpgradeSlots((byte) (eq.getUpgradeSlots() - 1));
                }
                if (eq.getExpiration() == -1) {
                    eq.setFlag((short) (eq.getFlag() | ItemFlag.LOCK.getValue()));
                } else {
                    eq.setFlag((short) (eq.getFlag() | ItemFlag.UNTRADEABLE.getValue()));
                }
            }
            if (type.equalsIgnoreCase("Slots")) {
                eq.setUpgradeSlots((byte) (eq.getUpgradeSlots() + offset));
                eq.setViciousHammer((byte) (eq.getViciousHammer() + offset));
            } else if (type.equalsIgnoreCase("Level")) {
                eq.setLevel((byte) (eq.getLevel() + offset));
            } else if (type.equalsIgnoreCase("Hammer")) {
                eq.setViciousHammer((byte) (eq.getViciousHammer() + offset));
            } else if (type.equalsIgnoreCase("STR")) {
                eq.setStr((short) (eq.getStr() + offset));
            } else if (type.equalsIgnoreCase("DEX")) {
                eq.setDex((short) (eq.getDex() + offset));
            } else if (type.equalsIgnoreCase("INT")) {
                eq.setInt((short) (eq.getInt() + offset));
            } else if (type.equalsIgnoreCase("LUK")) {
                eq.setLuk((short) (eq.getLuk() + offset));
            } else if (type.equalsIgnoreCase("HP")) {
                eq.setHp((short) (eq.getHp() + offset));
            } else if (type.equalsIgnoreCase("MP")) {
                eq.setMp((short) (eq.getMp() + offset));
            } else if (type.equalsIgnoreCase("WATK")) {
                eq.setWatk((short) (eq.getWatk() + offset));
            } else if (type.equalsIgnoreCase("MATK")) {
                eq.setMatk((short) (eq.getMatk() + offset));
            } else if (type.equalsIgnoreCase("WDEF")) {
                eq.setWdef((short) (eq.getWdef() + offset));
            } else if (type.equalsIgnoreCase("MDEF")) {
                eq.setMdef((short) (eq.getMdef() + offset));
            } else if (type.equalsIgnoreCase("ACC")) {
                eq.setAcc((short) (eq.getAcc() + offset));
            } else if (type.equalsIgnoreCase("Avoid")) {
                eq.setAvoid((short) (eq.getAvoid() + offset));
            } else if (type.equalsIgnoreCase("Hands")) {
                eq.setHands((short) (eq.getHands() + offset));
            } else if (type.equalsIgnoreCase("Speed")) {
                eq.setSpeed((short) (eq.getSpeed() + offset));
            } else if (type.equalsIgnoreCase("Jump")) {
                eq.setJump((short) (eq.getJump() + offset));
            } else if (type.equalsIgnoreCase("ItemEXP")) {
                eq.setItemEXP(eq.getItemEXP() + offset);
            } else if (type.equalsIgnoreCase("Expiration")) {
                eq.setExpiration((long) (eq.getExpiration() + offset));
            } else if (type.equalsIgnoreCase("Flag")) {
                eq.setFlag((short) (eq.getFlag() + offset));
            }
            item = eq.copy();
        }
        MapleInventoryManipulator.removeFromSlot(getClient(), inv, (short) slot, item.getQuantity(), false);
        return MapleInventoryManipulator.addFromDrop(getClient(), item, false);
    }

    public boolean replaceItem(int slot, int invType, Object statsSel, int upgradeSlots) {
        return replaceItem(slot, invType, statsSel, upgradeSlots, "Slots");
    }

    public boolean isCash(final int itemId) {
        return MapleItemInformationProvider.getInstance().isCash(itemId);
    }

    public int getTotalStat(final int itemId) {
        return MapleItemInformationProvider.getInstance().getTotalStat((Equip) MapleItemInformationProvider.getInstance().getEquipById(itemId));
    }

    public int getReqLevel(final int itemId) {
        return MapleItemInformationProvider.getInstance().getReqLevel(itemId);
    }

    public MapleStatEffect getEffect(int buff) {
        return MapleItemInformationProvider.getInstance().getItemEffect(buff);
    }

    public void buffGuild(final int buff, final int duration, final String msg) {
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        if (ii.getItemEffect(buff) != null && getPlayer().getGuildId() > 0) {
            final MapleStatEffect mse = ii.getItemEffect(buff);
            for (ChannelServer cserv : ChannelServer.getAllInstances()) {
                for (MapleCharacter chr : cserv.getPlayerStorage().getAllCharacters()) {
                    if (chr.getGuildId() == getPlayer().getGuildId()) {
                        mse.applyTo(chr, chr, true, null, duration);
                        chr.dropMessage(5, "Your guild has gotten a " + msg + " buff.");
                    }
                }
            }
        }
    }

    public void givePartyBuff(int buff) {
        if (c.getPlayer().getParty() != null) {
            MapleStatEffect effect = getEffect(buff);
            for (MaplePartyCharacter pchr : c.getPlayer().getParty().getMembers()) {
                MapleCharacter chr = c.getPlayer().getMap().getCharacterById(pchr.getId());
                if (chr != null) {
                    effect.applyTo(chr);
                }
            }
        }
    }

    public void cancelBuff(int buff) {
        boolean canCancel = false;
        for (PlayerBuffValueHolder pbvh : new ArrayList<PlayerBuffValueHolder>(c.getPlayer().getAllBuffs())) {
            if (!pbvh.effect.isSkill() && pbvh.effect.getSourceId() == buff) {
                canCancel = true;
                break;
            }
        }
        if (canCancel) {
            c.getPlayer().cancelEffect(getEffect(buff), -1);
        }
    }

    public boolean createAlliance(String alliancename) {
        MapleParty pt = c.getPlayer().getParty();
        MapleCharacter otherChar = c.getChannelServer().getPlayerStorage().getCharacterById(pt.getMemberByIndex(1).getId());
        if (otherChar == null || otherChar.getId() == c.getPlayer().getId()) {
            return false;
        }
        try {
            return World.Alliance.createAlliance(alliancename, c.getPlayer().getId(), otherChar.getId(), c.getPlayer().getGuildId(), otherChar.getGuildId());
        } catch (Exception re) {
            re.printStackTrace();
            return false;
        }
    }

    public boolean addCapacityToAlliance() {
        try {
            final MapleGuild gs = World.Guild.getGuild(c.getPlayer().getGuildId());
            if (gs != null && c.getPlayer().getGuildRank() == 1 && c.getPlayer().getAllianceRank() == 1 && getMeso() > 5000000) {
                if (World.Alliance.getAllianceLeader(gs.getAllianceId()) == c.getPlayer().getId() && World.Alliance.changeAllianceCapacity(gs.getAllianceId())) {
                    gainMeso(-MapleGuildAlliance.CHANGE_CAPACITY_COST);
                    return true;
                }
            }
        } catch (Exception re) {
            re.printStackTrace();
        }
        return false;
    }

    public boolean disbandAlliance() {
        try {
            final MapleGuild gs = World.Guild.getGuild(c.getPlayer().getGuildId());
            if (gs != null && c.getPlayer().getGuildRank() == 1 && c.getPlayer().getAllianceRank() == 1) {
                if (World.Alliance.getAllianceLeader(gs.getAllianceId()) == c.getPlayer().getId() && World.Alliance.disbandAlliance(gs.getAllianceId())) {
                    return true;
                }
            }
        } catch (Exception re) {
            re.printStackTrace();
        }
        return false;
    }

    public byte getLastMsg() {
        return lastMsg;
    }

    public final void setLastMsg(final byte last) {
        this.lastMsg = last;
    }

    public final void maxAllSkills() {
        for (Skill skil : SkillFactory.getAllSkills()) {
            if (GameConstants.isApplicableSkill(skil.getId()) && skil.getId() < 90000000) { //no db/additionals/resistance skills
                teachSkill(skil.getId(), (byte) skil.getMaxLevel(), (byte) skil.getMaxLevel());
            }
        }
    }

    public final void maxSkillsByJob() {
        for (Skill skil : SkillFactory.getAllSkills()) {
            if (GameConstants.isApplicableSkill(skil.getId()) && skil.canBeLearnedBy(getPlayer().getJob())) { //no db/additionals/resistance skills
                teachSkill(skil.getId(), (byte) skil.getMaxLevel(), (byte) skil.getMaxLevel());
            }
        }
    }

    public final void resetStats(int str, int dex, int z, int luk) {
        c.getPlayer().resetStats(str, dex, z, luk);
    }

    public void giveLessSP(int maxLvl, int advLvl) {
        int diffLvl = Math.min(maxLvl, c.getPlayer().getLevel()) - advLvl;
        c.getPlayer().gainSP(diffLvl * 3);
    }

    public final boolean dropItem(int slot, int invType, int quantity) {
        MapleInventoryType inv = MapleInventoryType.Companion.getByType((byte) invType);
        if (inv == null) {
            return false;
        }
        return MapleInventoryManipulator.drop(c, inv, (short) slot, (short) quantity, true);
    }

    public final void sendRPS() {
        c.getSession().write(MaplePacketCreator.getRPSMode((byte) 8, -1, -1, -1));
    }

    public final void setQuestRecord(Object ch, final int questid, final String data) {
        ((MapleCharacter) ch).getQuestNAdd(MapleQuest.getInstance(questid)).setCustomData(data);
    }

    public final void doWeddingEffect(final Object ch) {
        final MapleCharacter chr = (MapleCharacter) ch;
        final MapleCharacter player = getPlayer();
        getMap().broadcastMessage(MaplePacketCreator.yellowChat(player.getName() + ", do you take " + chr.getName() + " as your wife and promise to stay beside her through all downtimes, crashes, and lags?"));
        CloneTimer.getInstance().schedule(new Runnable() {
            public void run() {
                if (chr == null || player == null) {
                    warpMap(680000500, 0);
                } else {
                    chr.getMap().broadcastMessage(MaplePacketCreator.yellowChat(chr.getName() + ", do you take " + player.getName() + " as your husband and promise to stay beside him through all downtimes, crashes, and lags?"));
                }
            }
        }, 10000);
        CloneTimer.getInstance().schedule(new Runnable() {
            public void run() {
                if (chr == null || player == null) {
                    if (player != null) {
                        setQuestRecord(player, 160001, "3");
                        setQuestRecord(player, 160002, "0");
                    } else if (chr != null) {
                        setQuestRecord(chr, 160001, "3");
                        setQuestRecord(chr, 160002, "0");
                    }
                    warpMap(680000500, 0);
                } else {
                    setQuestRecord(player, 160001, "2");
                    setQuestRecord(chr, 160001, "2");
                    sendNPCText(player.getName() + " and " + chr.getName() + ", I wish you two all the best on your " + chr.getClient().getChannelServer().getServerName() + " journey together!", 9201002);
                    chr.getMap().startExtendedMapEffect("You may now kiss the bride, " + player.getName() + "!", 5120006);
                    if (chr.getGuildId() > 0) {
                        World.Guild.guildPacket(chr.getGuildId(), MaplePacketCreator.sendMarriage(false, chr.getName()));
                    }
                }
            }
        }, 20000); //10 sec 10 sec

    }

    public void putKey(int key, int type, int action) {
        getPlayer().changeKeybinding(key, (byte) type, action);
        getClient().getSession().write(MaplePacketCreator.getKeymap(getPlayer().getKeyLayout()));
    }

    public void doRing(final String name, final int itemid) {
        PlayersHandler.DoRing(getClient(), name, itemid);
    }

    public int getNaturalStats(final int itemid, final String it) {
        Map<String, Integer> eqStats = MapleItemInformationProvider.getInstance().getEquipStats(itemid);
        if (eqStats != null && eqStats.containsKey(it)) {
            return eqStats.get(it);
        }
        return 0;
    }

    public boolean isEligibleName(String t) {
        return MapleCharacterUtil.canCreateChar(t, getPlayer().isGM()) && (!LoginInformationProvider.getInstance().isForbiddenName(t) || getPlayer().isGM());
    }

    public String checkDrop(int mobId) {
        final List<MonsterDropEntry> ranks = MapleMonsterInformationProvider.getInstance().retrieveDrop(mobId);
        if (ranks != null && ranks.size() > 0) {
            int num = 0, itemId = 0, ch = 0;
            MonsterDropEntry de;
            StringBuilder name = new StringBuilder();
            for (int i = 0; i < ranks.size(); i++) {
                de = ranks.get(i);
                if (de.chance > 0 && (de.questid <= 0 || (de.questid > 0 && MapleQuest.getInstance(de.questid).getName().length() > 0))) {
                    itemId = de.itemId;
                    if (num == 0) {
                        name.append("#e#b#o" + mobId + "##k#n의 드랍정보 입니다.");
                        name.append("\r\n");
                    }
                    String namez = "#z" + itemId + "#";
                    if (itemId == 0) { //meso
                        itemId = 4031041; //display sack of cash
                        namez = (de.Minimum * getClient().getChannelServer().getMesoRate()) + " ~ " + (de.Maximum * getClient().getChannelServer().getMesoRate()) + " 메소";
                    }
                    ch = de.chance * getClient().getChannelServer().getDropRate();
                    name.append((num + 1) + ") #v" + itemId + "#" + namez + " - " + (Integer.valueOf(ch >= 999999 ? 1000000 : ch).doubleValue() / 10000.0) + "% " + (de.questid > 0 && MapleQuest.getInstance(de.questid).getName().length() > 0 ? ("Requires quest " + MapleQuest.getInstance(de.questid).getName() + " to be started.") : "") + "\r\n");
                    num++;
                }
            }
            if (name.length() > 0) {
                return name.toString();
            }

        }
        return "No drops was returned.";
    }

    public String getLeftPadded(final String in, final char padchar, final int length) {
        return StringUtil.getLeftPaddedStr(in, padchar, length);
    }

    public String getReadableMillis(long startMillis, long endMillis) {
        return StringUtil.getReadableMillis(startMillis, endMillis);
    }

    public void sendUltimateExplorer() {
        getClient().getSession().write(MaplePacketCreator.ultimateExplorer());
    }

    public String getPokemonRanking() {
        StringBuilder sb = new StringBuilder();
        for (PokemonInformation pi : RankingWorker.getPokemonInfo()) {
            sb.append(pi.toString());
        }
        return sb.toString();
    }

    public String getPokemonRanking_Caught() {
        StringBuilder sb = new StringBuilder();
        for (PokedexInformation pi : RankingWorker.getPokemonCaught()) {
            sb.append(pi.toString());
        }
        return sb.toString();
    }

    public String getPokemonRanking_Ratio() {
        StringBuilder sb = new StringBuilder();
        for (PokebattleInformation pi : RankingWorker.getPokemonRatio()) {
            sb.append(pi.toString());
        }
        return sb.toString();
    }

    public void sendPendant(boolean b) {
        c.getSession().write(MaplePacketCreator.pendantSlot(b));
    }

    public void showNpcSpecialEffect(String str) {
        showNpcSpecialEffect(getNpc(), str);
    }

    public void showNpcSpecialEffect(int npcid, String str) {
        MapleMap map = getPlayer().getMap();
        for (MapleNPC obj : map.getAllNPCs()) {
            if (obj.getId() == npcid) {
                map.broadcastMessage(MaplePacketCreator.showNpcSpecialAction(obj.getObjectId(), str), obj.getPosition());
            }
        }
    }

    public final int getDojoPoints() {
        return dojo_getPts();
    }

    public final int dojo_getPts() {
        return c.getPlayer().getIntNoRecord(GameConstants.DOJO);
    }

    public final int getDojoRecord() {
        return c.getPlayer().getIntNoRecord(GameConstants.DOJO_RECORD);
    }

    public void setDojoRecord(final boolean reset) {
        if (reset) {
            c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.DOJO_RECORD)).setCustomData("0");
            c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.DOJO)).setCustomData("0");
        } else {
            c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.DOJO_RECORD)).setCustomData(String.valueOf(c.getPlayer().getIntRecord(GameConstants.DOJO_RECORD) + 1));
        }
    }

    public boolean start_DojoAgent(final boolean dojo, final boolean party) {
        if (dojo) {
            return Event_DojoAgent.warpStartDojo(c.getPlayer(), party);
        }
        return Event_DojoAgent.warpStartAgent(c.getPlayer(), party);
    }

    public void openWeddingPresent(int type, int gender) {
        MarriageDataEntry dataEntry = getMarriageAgent().getDataEntry();
        if (dataEntry != null) {
            if (type == 1) { // give
                c.getPlayer().setWeddingGive(gender);
                List<String> wishes;
                if (gender == 0) {
                    wishes = dataEntry.getGroomWishList();
                } else {
                    wishes = dataEntry.getBrideWishList();
                }
                c.sendPacket(MaplePacketCreator.showWeddingWishGiveDialog(wishes));
            } else if (type == 2) { // recv
                List<Item> gifts;
                if (gender == 0) {
                    gifts = dataEntry.getGroomPresentList();
                } else {
                    gifts = dataEntry.getBridePresentList();
                }
                c.sendPacket(MaplePacketCreator.showWeddingWishRecvDialog(gifts));
            }
        }
    }

    public boolean exchangeWeddingRing() {
        for (int i = 4210000; i <= 4210011; ++i) {
            int newItemId = 1112300 + (i % 100);
            if (haveItem(i, 1) && canHold(newItemId, 1)) {
                Item item = c.getPlayer().getInventory(MapleInventoryType.ETC).findById(i);
                MapleRing ring = item.getRing();
                gainItem(i, (short) -1);
                try {
                    MapleRing.Companion.changeItemByUniqueId(newItemId, ring.getRingId());
                } catch (Exception e) {
                    e.printStackTrace();
                }
//                Item newRing = MapleItemInformationProvider.getInstance().getEquipById(newItemId, ring.getRingId());
//                newRing.setRing(ring);
//                ring.setItemId(newItemId);
//                MapleInventoryManipulator.addbyItem(c, newRing);
                gainItem(newItemId, (short) 1);
                c.getPlayer().equipChanged();
                return true;
            }
        }
        return false;
    }

    public double getDistance() {
        return getPlayer().getMap().getNPCByOid(getObjectId()).getPosition().distanceSq(getPlayer().getPosition());
    }

    public String getMedalRanking(String type) {
        String ret = "현재 순위 ";
        ret += "\r\n\r\n";
        List<Pair<String, Integer>> l = MedalRanking.getReadOnlyRanking(MedalRanking.MedalRankingType.valueOf(type));
        if (l.isEmpty()) {
            ret += "현재 랭킹이 없습니다.";
        } else {
            int rank = 1;
            for (Pair<String, Integer> p : l) {
                String str;
                if (MedalRanking.MedalRankingType.valueOf(type).isDonor()) {
                    if (rank == 1) {
                        str = new DecimalFormat("#,###").format(p.right).replace("0", "?").replace("1", "?").replace("2", "?").replace("3", "?").replace("4", "?").replace("5", "?").replace("6", "?").replace("7", "?").replace("8", "?").replace("9", "?") + "#k 메소";
                    } else {
                        str = new DecimalFormat("#,###").format(p.right) + "#k 메소";
                    }
                } else if (MedalRankingType.valueOf(type) == MedalRankingType.ExpertHunter) {
                    str = new DecimalFormat("#,###").format(p.right) + "#k 마리";
                } else {
                    str = new DecimalFormat("#,###").format(p.right) + "#k";
                }
                ret += (rank++) + ". #b" + p.left + "#k : #r" + str + "\r\n";
            }
        }
        return ret;
    }

    public int checkMedalScore(String type, int score) {
        int z = MedalRanking.canMedalRank(MedalRanking.MedalRankingType.valueOf(type), c.getPlayer().getName(), score);
        if (z >= 0) {
            MedalRanking.addNewMedalRank(MedalRanking.MedalRankingType.valueOf(type), c.getPlayer().getName(), score);
        }
        return z;
    }

    public static String getMonsterName(int a) {
        MapleMonster mob = null;
        mob = MapleLifeFactory.getMonster(a);
        if (mob == null) {
            return "Lv.??? : ???";
        }
        return "Lv." + mob.getStats().getLevel() + " : " + mob.getStats().getName();
    }

    public static String MonsterDrop(int itemid) {
        String a = "";
        boolean check = false;
        try {
            ResultSet rs = DatabaseConnection.getConnection().prepareStatement("SELECT * FROM drop_data WHERE itemid = " + itemid).executeQuery();
            while (rs.next()) {
                check = true;
                if (!a.contains(getMonsterName(rs.getInt("dropperid")))) {
                    a = a + "\r\n" + getMonsterName(rs.getInt("dropperid"));
                }
            }
            rs.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        if (check) {
            return a;
        } else {
            return "#r드롭 몬스터정보를 찾지 못하였습니다.#k";
        }
    }

    public static String getItemNames(String a) {
        String b = "";

        try {
            for (Pair<Integer, String> itemPair : MapleItemInformationProvider.getInstance().getAllItemss()) {
                if (itemPair.right.contains(a)) {
                    b = b + "\r\n#L" + itemPair.left + "#" + itemPair.right + "#l";
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        if (!b.equals("")) {
            return b;
        } else {
            return "#r잘못된 아이템 이름입니다.#k";
        }
    }

    public void removeItemFromWorld(int itemid, String msg, boolean involveSelf) {
        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            for (MapleCharacter chr : cserv.getPlayerStorage().getAllCharacters()) {
                if (chr.getId() != c.getPlayer().getId() || involveSelf) {
                    if (chr.haveItem(itemid, 1, true, true)) {
                        if (itemid / 1000000 == 1) {
                            chr.removeAllEquip(itemid, false);
                        } else {
                            chr.removeAll(itemid, true);
                        }
                        if (msg != null && !msg.isEmpty()) {
                            chr.dropMessage(5, msg);
                        }
                    }
                }
            }
        }
    }
}
