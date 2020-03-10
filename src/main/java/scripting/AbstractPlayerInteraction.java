package scripting;

import client.MapleCharacter;
import client.MapleClient;
import client.MapleQuestStatus;
import client.MapleStat;
import client.Skill;
import client.SkillFactory;
import client.inventory.Equip;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryIdentifier;
import client.inventory.MapleInventoryType;
import client.inventory.MaplePet;
import constants.GameConstants;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.World;
import handling.world.guild.MapleGuild;
import java.awt.Point;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.MaplePortal;
import server.Randomizer;
import server.Timer;
import server.Timer.CloneTimer;
import server.events.MapleEvent;
import server.events.MapleEventType;
import server.life.MapleLifeFactory;
import server.life.MapleMonster;
import server.log.DBLogger;
import server.log.LogType;
import server.maps.Event_DojoAgent;
import server.maps.MapleMap;
import server.maps.MapleMapObject;
import server.maps.MapleReactor;
import server.maps.SavedLocationType;
import server.marriage.MarriageDataEntry;
import server.marriage.MarriageEventAgent;
import server.marriage.MarriageManager;
import server.marriage.MarriageTicketType;
import server.quest.MapleQuest;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.StringUtil;
import tools.packet.PetPacket;
import tools.packet.UIPacket;

public abstract class AbstractPlayerInteraction {

    protected MapleClient c;
    protected int id, id2;

    public AbstractPlayerInteraction(final MapleClient c, final int id, final int id2) {
        this.c = c;
        this.id = id;
        this.id2 = id2;
    }

    public final MapleClient getClient() {
        return c;
    }

    public final MapleClient getC() {
        return c;
    }

    public MapleCharacter getChar() {
        return c.getPlayer();
    }

    public final ChannelServer getChannelServer() {
        return c.getChannelServer();
    }

    public final MapleCharacter getPlayer() {
        return c.getPlayer();
    }

    public final EventManager getEventManager(final String event) {
        return c.getChannelServer().getEventSM().getEventManager(event);
    }

    public final EventInstanceManager getEventInstance() {
        return c.getPlayer().getEventInstance();
    }

    public final void warp(final int map) {
        final MapleMap mapz = getWarpMap(map);
        try {
            int overflow = 0;
            while (true) {
                MaplePortal p = mapz.getPortal(Randomizer.nextInt(mapz.getPortals().size()));
                if (p.getName().equals("sp")) {
                    c.getPlayer().changeMap(mapz, p);
                    break;
                }
                if (overflow >= 30) {
                    c.getPlayer().changeMap(mapz, mapz.getPortal(0));
                    break;
                }
                overflow++;
            }
        } catch (Exception e) {
            c.getPlayer().changeMap(mapz, mapz.getPortal(0));
        }
    }

    public final void warp_Instanced(final int map) {
        final MapleMap mapz = getMap_Instanced(map);
        try {
            c.getPlayer().changeMap(mapz, mapz.getPortal(Randomizer.nextInt(mapz.getPortals().size())));
        } catch (Exception e) {
            c.getPlayer().changeMap(mapz, mapz.getPortal(0));
        }
    }

    public final void warp_Instanced(final int map, int pid) {
        final MapleMap mapz = getMap_Instanced(map);
        try {
            c.getPlayer().changeMap(mapz, mapz.getPortal(pid));
        } catch (Exception e) {
            c.getPlayer().changeMap(mapz, mapz.getPortal(0));
        }
    }

    public final void warp(final int map, final int portal) {
        final MapleMap mapz = getWarpMap(map);
        if ((portal != 0 && map == c.getPlayer().getMapId()) || map == -1) { //test
            final Point portalPos = new Point(c.getPlayer().getMap().getPortal(portal).getPosition());
            if (portalPos.distanceSq(getPlayer().getTruePosition()) < 90000.0 || map == -1) { //estimation
                c.getSession().write(MaplePacketCreator.instantMapWarp((byte) portal)); //until we get packet for far movement, this will do
                c.getPlayer().getMap().movePlayer(c.getPlayer(), portalPos);
            } else {
                c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
            }
        } else {
            c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
        }
    }

    public final void warpS(final int map, final int portal) {
        final MapleMap mapz = getWarpMap(map);
        c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
    }

    public final void warp(final int map, String portal) {
        final MapleMap mapz = getWarpMap(map);
        if (map == 109060000 || map == 109060002 || map == 109060004) {
            portal = mapz.getSnowballPortal();
        }
        if (map == c.getPlayer().getMapId() || map == -1) { //test
            final Point portalPos = new Point(c.getPlayer().getMap().getPortal(portal).getPosition());
            if (portalPos.distanceSq(getPlayer().getTruePosition()) < 90000.0 || map == -1) { //estimation
                c.getSession().write(MaplePacketCreator.instantMapWarp((byte) c.getPlayer().getMap().getPortal(portal).getId()));
                c.getPlayer().getMap().movePlayer(c.getPlayer(), new Point(c.getPlayer().getMap().getPortal(portal).getPosition()));
            } else {
                c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
            }
        } else {
            c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
        }
    }

    public final void warpS(final int map, String portal) {
        final MapleMap mapz = getWarpMap(map);
        if (map == 109060000 || map == 109060002 || map == 109060004) {
            portal = mapz.getSnowballPortal();
        }
        c.getPlayer().changeMap(mapz, mapz.getPortal(portal));
    }

    public final void warpMap(final int mapid, final int portal) {
        final MapleMap map = getMap(mapid);
        for (MapleCharacter chr : c.getPlayer().getMap().getCharactersThreadsafe()) {
            chr.changeMap(map, map.getPortal(portal));
        }
    }

    public final void playPortalSE() {
        c.getSession().write(MaplePacketCreator.showOwnBuffEffect(0, 7, 1, 1));
    }

    private final MapleMap getWarpMap(final int map) {
        return ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(map);
    }

    public final MapleMap getMap() {
        return c.getPlayer().getMap();
    }

    public final MapleMap getMap(final int map) {
        return getWarpMap(map);
    }

    public final MapleMap getMap_Instanced(final int map) {
        return c.getPlayer().getEventInstance() == null ? getMap(map) : c.getPlayer().getEventInstance().getMapInstance(map);
    }

    public void spawnMonster(final int id, final int qty) {
        spawnMob(id, qty, c.getPlayer().getTruePosition());
    }

    public final void spawnMobOnMap(final int id, final int qty, final int x, final int y, final int map) {
        for (int i = 0; i < qty; i++) {
            getMap(map).spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(id), new Point(x, y));
        }
    }

    public final void spawnMob(final int id, final int qty, final int x, final int y) {
        spawnMob(id, qty, new Point(x, y));
    }

    public final void spawnMob(final int id, final int x, final int y) {
        spawnMob(id, 1, new Point(x, y));
    }

    private final void spawnMob(final int id, final int qty, final Point pos) {
        for (int i = 0; i < qty; i++) {
            c.getPlayer().getMap().spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(id), pos);
        }
    }

    public final void killMob(int ids) {
        c.getPlayer().getMap().killMonster(ids);
    }

    public final void killAllMob() {
        c.getPlayer().getMap().killAllMonsters(true);
    }

    public final void addHP(final int delta) {
        c.getPlayer().addHP(delta);
    }

    public final int getPlayerStat(final String type) {
        switch (type) {
            case "LVL":
                return c.getPlayer().getLevel();
            case "STR":
                return c.getPlayer().getStat().getStr();
            case "DEX":
                return c.getPlayer().getStat().getDex();
            case "INT":
                return c.getPlayer().getStat().getInt();
            case "LUK":
                return c.getPlayer().getStat().getLuk();
            case "HP":
                return c.getPlayer().getStat().getHp();
            case "MP":
                return c.getPlayer().getStat().getMp();
            case "MAXHP":
                return c.getPlayer().getStat().getMaxHp();
            case "MAXMP":
                return c.getPlayer().getStat().getMaxMp();
            case "RAP":
                return c.getPlayer().getRemainingAp();
            case "RSP":
                return c.getPlayer().getRemainingSp();
            case "GID":
                return c.getPlayer().getGuildId();
            case "GRANK":
                return c.getPlayer().getGuildRank();
            case "ARANK":
                return c.getPlayer().getAllianceRank();
            case "GM":
                return c.getPlayer().isGM() ? 1 : 0;
            case "GENDER":
                return c.getPlayer().getGender();
            case "FACE":
                return c.getPlayer().getFace();
            case "HAIR":
                return c.getPlayer().getHair();
        }
        return -1;
    }

    public final String getName() {
        return c.getPlayer().getName();
    }

    public void showQuestClear(int qid) {
        getPlayer().showQuestCompletion(qid);
    }

    public final boolean haveItem(final int itemid) {
        return haveItem(itemid, 1);
    }

    public final boolean haveItem(final int itemid, final int quantity) {
        return haveItem(itemid, quantity, false, true);
    }

    public final boolean haveItem(final int itemid, final int quantity, final boolean checkEquipped, final boolean greaterOrEquals) {
        return c.getPlayer().haveItem(itemid, quantity, checkEquipped, greaterOrEquals);
    }

    public final boolean canHold() {
        for (int i = 1; i <= 5; i++) {
            if (c.getPlayer().getInventory(MapleInventoryType.Companion.getByType((byte) i)).getNextFreeSlot() <= -1) {
                return false;
            }
        }
        return true;
    }

    public final boolean canHoldSlots(final int slot) {
        for (int i = 1; i <= 5; i++) {
            if (c.getPlayer().getInventory(MapleInventoryType.Companion.getByType((byte) i)).isFull(slot)) {
                return false;
            }
        }
        return true;
    }

    public final int getInvSlots(final int i) {
        return (c.getPlayer().getInventory(MapleInventoryType.Companion.getByType((byte) i)).getNumFreeSlot());
    }

    public final boolean canHold(final int itemid) {
        return c.getPlayer().getInventory(GameConstants.getInventoryType(itemid)).getNextFreeSlot() > -1;
    }

    public final boolean canHold(final int itemid, final int quantity) {
        return MapleInventoryManipulator.checkSpace(c, itemid, quantity, "");
    }

    public final MapleQuestStatus getQuestRecord(final int id) {
        return c.getPlayer().getQuestNAdd(MapleQuest.getInstance(id));
    }

    public final MapleQuestStatus getQuestNoRecord(final int id) {
        return c.getPlayer().getQuestNoAdd(MapleQuest.getInstance(id));
    }

    public final byte getQuestStatus(final int id) {
        return c.getPlayer().getQuestStatus(id);
    }

    public final boolean isQuestActive(final int id) {
        return getQuestStatus(id) == 1;
    }

    public final boolean isQuestFinished(final int id) {
        return getQuestStatus(id) == 2;
    }

    public final void showQuestMsg(final String msg) {
        c.getSession().write(MaplePacketCreator.showQuestMsg(msg));
    }

    public final void forceStartQuest(final int id, final String data) {
        MapleQuest.getInstance(id).forceStart(c.getPlayer(), 0, data);
    }

    public final void forceStartQuest(final int id, final int data, final boolean filler) {
        MapleQuest.getInstance(id).forceStart(c.getPlayer(), 0, filler ? String.valueOf(data) : null);
    }

    public void forceStartQuest(final int id) {
        MapleQuest.getInstance(id).forceStart(c.getPlayer(), 0, null);
    }

    public void forceCompleteQuest(final int id) {
        MapleQuest.getInstance(id).forceComplete(getPlayer(), 0);
    }

    public void spawnNpc(final int npcId) {
        c.getPlayer().getMap().spawnNpc(npcId, c.getPlayer().getPosition());
    }

    public final void spawnNpc(final int npcId, final int x, final int y) {
        c.getPlayer().getMap().spawnNpc(npcId, new Point(x, y));
    }

    public final void spawnNpc(final int npcId, final Point pos) {
        c.getPlayer().getMap().spawnNpc(npcId, pos);
    }

    public final void removeNpc(final int mapid, final int npcId) {
        c.getChannelServer().getMapFactory().getMap(mapid).removeNpc(npcId);
    }

    public final void removeNpc(final int npcId) {
        c.getPlayer().getMap().removeNpc(npcId);
    }

    public final void scheduleRemoveNpc(final int npcId, int millisecs) {
        Timer.MapTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                c.getPlayer().getMap().removeNpc(npcId);
            }
        }, millisecs);
    }

    public final void handlePinkbeanSummon(int millisecs) {
        Timer.MapTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                c.getPlayer().getMap().removeNpc(2141000);
                forceStartReactor(270050100, 2709000);
            }
        }, millisecs);
        for (MapleCharacter chr : getPlayer().getMap().getCharacters()) {
            if (chr.getQuestStatus(3522) == 1) {
                MapleQuestStatus stat = chr.getQuestNAdd(MapleQuest.getInstance(7402));
                stat.setCustomData("1");
                chr.updateQuest(stat, true);
                chr.showQuestCompletion(3522);
            }
            if (chr.getQuestStatus(3538) == 1) {
                MapleQuestStatus stat = chr.getQuestNAdd(MapleQuest.getInstance(7402));
                stat.setCustomData("1");
                chr.updateQuest(stat, true);
                chr.showQuestCompletion(3538);
            }
        }
    }

    public final void forceStartReactor(final int mapid, final int id) {
        MapleMap map = c.getChannelServer().getMapFactory().getMap(mapid);
        MapleReactor react;

        for (final MapleMapObject remo : map.getAllReactorsThreadsafe()) {
            react = (MapleReactor) remo;
            if (react.getReactorId() == id) {
                react.forceStartReactor(c);
                break;
            }
        }
    }

    public final void destroyReactor(final int mapid, final int id) {
        MapleMap map = c.getChannelServer().getMapFactory().getMap(mapid);
        MapleReactor react;

        for (final MapleMapObject remo : map.getAllReactorsThreadsafe()) {
            react = (MapleReactor) remo;
            if (react.getReactorId() == id) {
                react.hitReactor(c);
                break;
            }
        }
    }

    public final void hitReactor(final int mapid, final int id) {
        MapleMap map = c.getChannelServer().getMapFactory().getMap(mapid);
        MapleReactor react;

        for (final MapleMapObject remo : map.getAllReactorsThreadsafe()) {
            react = (MapleReactor) remo;
            if (react.getReactorId() == id) {
                react.hitReactor(c);
                break;
            }
        }
    }

    public final int getJob() {
        return c.getPlayer().getJob();
    }

    public final void gainNX(final int amount) {
        c.getPlayer().modifyCSPoints(1, amount, true);
    }

    public final void gainItemPeriod(final int id, final short quantity, final int period) { //period is in days
        gainItem(id, quantity, false, period, -1, "");
    }

    public final void gainItemPeriod(final int id, final short quantity, final long period, final String owner) { //period is in days
        gainItem(id, quantity, false, period, -1, owner);
    }

    public final void gainItem(final int id, final short quantity) {
        gainItem(id, quantity, false, 0, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats) {
        gainItem(id, quantity, randomStats, 0, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final int slots) {
        gainItem(id, quantity, randomStats, 0, slots, "");
    }

    public final void gainItem(final int id, final short quantity, final long period) {
        gainItem(id, quantity, false, period, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots) {
        gainItem(id, quantity, randomStats, period, slots, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots, final String owner) {
        gainItem(id, quantity, randomStats, period, slots, owner, c);
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots, final String owner, final MapleClient cg) {
        if (quantity >= 0) {
            final MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
            final MapleInventoryType type = GameConstants.getInventoryType(id);

            if (!MapleInventoryManipulator.checkSpace(cg, id, quantity, "")) {
                return;
            }
            if (type.equals(MapleInventoryType.EQUIP) && !GameConstants.isThrowingStar(id) && !GameConstants.isBullet(id)) {
                final Equip item = (Equip) (randomStats ? ii.randomizeStats((Equip) ii.getEquipById(id)) : ii.getEquipById(id));
                if (period > 0) {
                    item.setExpiration(System.currentTimeMillis() + (period * 24 * 60 * 60 * 1000));
                }
                if (slots > 0) {
                    item.setUpgradeSlots((byte) (item.getUpgradeSlots() + slots));
                }
                if (owner != null) {
                    item.setOwner(owner);
                }
                item.setGMLog("Received from interaction " + this.id + " (" + id2 + ") on " + FileoutputUtil.CurrentReadable_Time());
                final String name = ii.getName(id);
                if (id / 10000 == 114 && name != null && name.length() > 0) { //medal
                    final String msg = "<" + name + "> 칭호를 얻었습니다.";
//                    cg.getPlayer().dropMessage(-1, msg);
                    cg.getPlayer().dropMessage(5, msg);
                }
                MapleInventoryManipulator.addbyItem(cg, item.copy());
            } else {
                MapleInventoryManipulator.addById(cg, id, quantity, owner == null ? "" : owner, null, period, "Received from interaction " + this.id + " (" + id2 + ") on " + FileoutputUtil.CurrentReadable_Date());
            }
            DBLogger.instance.logItem(LogType.Item.FromScript, cg.getPlayer().getId(), cg.getPlayer().getName(), id, quantity, ii.getName(id), 0, "Script : " + this.id + " (" + id2 + ")");

        } else {
            MapleInventoryManipulator.removeById(cg, GameConstants.getInventoryType(id), id, -quantity, true, false);
            DBLogger.instance.logItem(LogType.Item.FromScript, cg.getPlayer().getId(), cg.getPlayer().getName(), id, quantity, MapleItemInformationProvider.getInstance().getName(id), 0, "Script : " + this.id + " (" + id2 + ")");
        }
        cg.getSession().write(MaplePacketCreator.getShowItemGain(id, quantity, true));
    }

    public final boolean removeItem(final int id) { //quantity 1
        if (MapleInventoryManipulator.removeById_Lock(c, GameConstants.getInventoryType(id), id)) {
            DBLogger.instance.logItem(LogType.Item.FromScript, c.getPlayer().getId(), c.getPlayer().getName(), id, -1, MapleItemInformationProvider.getInstance().getName(id), 0, "Script : " + this.id + " (" + id2 + ")");
            c.getSession().write(MaplePacketCreator.getShowItemGain(id, (short) -1, true));
            return true;
        }
        return false;
    }

    public final void changeMusic(final String songName) {
        getPlayer().getMap().broadcastMessage(MaplePacketCreator.musicChange(songName));
    }

    public final void worldMessage(final int type, final String message) {
        World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(type, message));
    }

    // default playerMessage and mapMessage to use type 5
    public final void playerMessage(final String message) {
        playerMessage(5, message);
    }

    public final void mapMessage(final String message) {
        mapMessage(5, message);
    }

    public final void guildMessage(final String message) {
        guildMessage(5, message);
    }

    public final void partyMessage(final String message) {
        partyMessage(5, message);
    }

    public final void playerMessage(final int type, final String message) {
        c.getPlayer().dropMessage(type, message);
    }

    public final void mapMessage(final int type, final String message) {
        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.serverNotice(type, message));
    }

    public final void guildMessage(final int type, final String message) {
        if (getPlayer().getGuildId() > 0) {
            World.Guild.guildPacket(getPlayer().getGuildId(), MaplePacketCreator.serverNotice(type, message));
        }
    }

    public void znjfl(String aa) throws SQLException {
        Connection con = null;
        PreparedStatement ps = null;
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement(aa + "");
        ps.executeUpdate();
        ps.close();
        c.getPlayer().dropMessage(6, "완료");
    }

    public final void partyMessage(final int type, final String message) {
        if (c.getPlayer().getParty() != null) {
            World.Party.partyPacket(c.getPlayer().getParty().getId(), MaplePacketCreator.serverNotice(type, message), null);
        }
    }

    public final MapleGuild getGuild() {
        return getGuild(getPlayer().getGuildId());
    }

    public final MapleGuild getGuild(int guildid) {
        return World.Guild.getGuild(guildid);
    }

    public final MapleParty getParty() {
        return c.getPlayer().getParty();
    }

    public final int getCurrentPartyId(int mapid) {
        return getMap(mapid).getCurrentPartyId();
    }

    public final boolean isLeader() {
        if (getPlayer().getParty() == null) {
            return false;
        }
        return getParty().getLeader().getId() == c.getPlayer().getId();
    }

    public final boolean isAllPartyMembersAllowedJob(final int job) {
        if (c.getPlayer().getParty() == null) {
            return false;
        }
        for (final MaplePartyCharacter mem : c.getPlayer().getParty().getMembers()) {
            if (mem.getJobId() / 100 != job) {
                return false;
            }
        }
        return true;
    }

    public final boolean allMembersHere() {
        if (c.getPlayer().getParty() == null) {
            return false;
        }
        for (final MaplePartyCharacter mem : c.getPlayer().getParty().getMembers()) {
            final MapleCharacter chr = c.getPlayer().getMap().getCharacterById(mem.getId());
            if (chr == null) {
                return false;
            }
        }
        return true;
    }

    public final int checkWeddingReservation() {
        int ret = checkWeddingInternal();
        if (ret > 0) {
            return ret;
        }
        MarriageDataEntry data = MarriageManager.getInstance().getMarriage(c.getPlayer().getMarriageId());
        if (data.getWeddingStatus() > 0) {
            return 8;
        }
        return 0;
    }

    public final int checkWeddingStart() {
        return checkWeddingInternal();
    }

    /**
     * 결혼 가능 여부 검사. <br/><br/>
     * 0: 성공<br/>
     * 1: 파티가 없다<br/>
     * 2: 파티원이 2명이 아님<br/>
     * 3: 약혼되어있지 않음<br/>
     * 4: 신랑신부가 같은맵에 없음<br/>
     * 5: 신랑신부가 파티에 있어야함<br/>
     * 6: 약혼상태가 아님<br/>
     * 7: 이미 파혼됨<br/>
     *
     * @return 결과값
     */
    private int checkWeddingInternal() {
        if (c.getPlayer().getParty() == null) {
            return 1;
        }
        // 신랑과 신부가 파티를 하고 있는지 체크
        if (c.getPlayer().getParty().getMembers().size() != 2) {
            return 2;
        }
        if (c.getPlayer().getMarriageId() <= 0) {
            return 3;
        }
        MarriageDataEntry data = MarriageManager.getInstance().getMarriage(c.getPlayer().getMarriageId());
        if (data == null) {
            return 7;
        }
        boolean foundGroom = false;
        boolean foundBride = false;
        for (final MaplePartyCharacter mem : c.getPlayer().getParty().getMembers()) {
            final MapleCharacter chr = c.getPlayer().getMap().getCharacterById(mem.getId());
            if (chr == null) {
                return 4;
            }
            if (chr.getId() == data.getGroomId()) {
                foundGroom = true;
            } else if (chr.getId() == data.getBrideId()) {
                foundBride = true;
            }
        }
        if (!foundGroom || !foundBride) {
            return 5;
        }
        if (data.getStatus() != 1) {
            return 6;
        }
        return 0;
    }

    public MarriageDataEntry getMarriageData() {
        return getMarriageData(c.getPlayer().getMarriageId());
    }

    public MarriageDataEntry getMarriageData(int marriageId) {
        return MarriageManager.getInstance().getMarriage(marriageId);
    }

    public MarriageEventAgent getMarriageAgent() {
        return getMarriageAgent(c.getChannel());
    }

    public MarriageEventAgent getMarriageAgent(int channel) {
        return MarriageManager.getInstance().getEventAgent(channel);
    }

    public void sendWeddingWishListInputDlg() {
        c.sendPacket(MaplePacketCreator.showWeddingWishInputDialog());
    }

    public final int makeWeddingReservation(int itemId) {
        int ret = checkWeddingReservation();
        if (ret > 0) {
            return ret;
        }
        MarriageDataEntry data = getMarriageData(getPlayer().getMarriageId());
        data.setWeddingStatus(1);
        if (itemId == 5251004) {
            data.setTicketType(MarriageTicketType.CheapTicket);
        } else if (itemId == 5251005) {
            data.setTicketType(MarriageTicketType.SweetieTicket);
        } else if (itemId == 5251006) {
            data.setTicketType(MarriageTicketType.PremiumTicket);
        }

        final MapleCharacter chr = c.getPlayer().getMap().getCharacterById(getPlayer().getGender() == 1 ? data.getGroomId() : data.getBrideId());
        if (chr != null) {
            NPCScriptManager.getInstance().start(chr.getClient(), 9201013);
        }
        sendWeddingWishListInputDlg();

        return 0;
    }

    public final void warpParty(final int mapId) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            warp(mapId, 0);
            return;
        }
        final MapleMap target = getMap(mapId);
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.changeMap(target, target.getPortal(0));
            }
        }
    }

    public final void warpParty(final int mapId, final int portal) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            if (portal < 0) {
                warp(mapId);
            } else {
                warp(mapId, portal);
            }
            return;
        }
        final boolean rand = portal < 0;
        final MapleMap target = getMap(mapId);
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                if (rand) {
                    try {
                        curChar.changeMap(target, target.getPortal(Randomizer.nextInt(target.getPortals().size())));
                    } catch (Exception e) {
                        curChar.changeMap(target, target.getPortal(0));
                    }
                } else {
                    curChar.changeMap(target, target.getPortal(portal));
                }
            }
        }
    }

    public final void warpParty_Instanced(final int mapId) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            warp_Instanced(mapId);
            return;
        }
        final MapleMap target = getMap_Instanced(mapId);

        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.changeMap(target, target.getPortal(0));
            }
        }
    }

    public final void warpParty_Instanced(final int mapId, int pid) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            warp_Instanced(mapId, pid);
            return;
        }
        final MapleMap target = getMap_Instanced(mapId);

        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.changeMap(target, target.getPortal(pid));
            }
        }
    }

    public void gainMeso(int gain) {
        DBLogger.instance.logItem(LogType.Item.FromScript, c.getPlayer().getId(), c.getPlayer().getName(), 0, 0, "메소", gain, "Script : " + this.id + " (" + this.id2 + ")");
        c.getPlayer().gainMeso(gain, true, true);
    }

    public void gainExp(int gain) {
        c.getPlayer().gainExp(gain, true, true, true);
    }

    public void gainExpR(int gain) {
        c.getPlayer().gainExp(gain * c.getChannelServer().getExpRate(), true, true, true);
    }

    public final void givePartyItems(final int id, final short quantity, final List<MapleCharacter> party) {
        for (MapleCharacter chr : party) {
            if (quantity >= 0) {
                MapleInventoryManipulator.addById(chr.getClient(), id, quantity, "Received from party interaction " + id + " (" + id2 + ")");
            } else {
                MapleInventoryManipulator.removeById(chr.getClient(), GameConstants.getInventoryType(id), id, -quantity, true, false);
            }
            chr.getClient().getSession().write(MaplePacketCreator.getShowItemGain(id, quantity, true));
        }
    }

    public final void givePartyItems(final int id, final short quantity) {
        givePartyItems(id, quantity, false);
    }

    public final void givePartyItems(final int id, final short quantity, final boolean removeAll) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            gainItem(id, (short) (removeAll ? -getPlayer().itemQuantity(id) : quantity));
            return;
        }

        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                gainItem(id, (short) (removeAll ? -curChar.itemQuantity(id) : quantity), false, 0, 0, "", curChar.getClient());
            }
        }
    }

    public final void givePartyExp_PQ(final int maxLevel, final double mod, final List<MapleCharacter> party) {
        for (final MapleCharacter chr : party) {
            final int amount = (int) Math.round(GameConstants.getExpNeededForLevel(chr.getLevel() > maxLevel ? (maxLevel + ((maxLevel - chr.getLevel()) / 10)) : chr.getLevel()) / (Math.min(chr.getLevel(), maxLevel) / 5.0) / (mod * 2.0));
            chr.gainExp(amount * c.getChannelServer().getExpRate(), true, true, true);
        }
    }

    public final void gainExp_PQ(final int maxLevel, final double mod) {
        final int amount = (int) Math.round(GameConstants.getExpNeededForLevel(getPlayer().getLevel() > maxLevel ? (maxLevel + (getPlayer().getLevel() / 10)) : getPlayer().getLevel()) / (Math.min(getPlayer().getLevel(), maxLevel) / 10.0) / mod);
        gainExp(amount * c.getChannelServer().getExpRate());
    }

    public final void givePartyExp_PQ(final int maxLevel, final double mod) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            final int amount = (int) Math.round(GameConstants.getExpNeededForLevel(getPlayer().getLevel() > maxLevel ? (maxLevel + (getPlayer().getLevel() / 10)) : getPlayer().getLevel()) / (Math.min(getPlayer().getLevel(), maxLevel) / 10.0) / mod);
            gainExp(amount * c.getChannelServer().getExpRate());
            return;
        }
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                final int amount = (int) Math.round(GameConstants.getExpNeededForLevel(curChar.getLevel() > maxLevel ? (maxLevel + (curChar.getLevel() / 10)) : curChar.getLevel()) / (Math.min(curChar.getLevel(), maxLevel) / 10.0) / mod);
                curChar.gainExp(amount * c.getChannelServer().getExpRate(), true, true, true);
            }
        }
    }

    public final void givePartyExp(final int amount, final List<MapleCharacter> party) {
        for (final MapleCharacter chr : party) {
            chr.gainExp(amount * c.getChannelServer().getExpRate(), true, true, true);
        }
    }

    public final void givePartyExp(final int amount, MapleCharacter chara) {
        final int cMap = chara.getMapId();
        for (final MaplePartyCharacter chr : chara.getParty().getMembers()) {
            final MapleCharacter curChar = chara.getClient().getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            curChar.gainExp(amount * chara.getClient().getChannelServer().getExpRate(), true, true, true);
        }
    }

    public final void givePartyExp(final int amount) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            gainExp(amount * c.getChannelServer().getExpRate());
            return;
        }
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.gainExp(amount * c.getChannelServer().getExpRate(), true, true, true);
            }
        }
    }

    public final void givePartyNX(final int amount, final List<MapleCharacter> party) {
        for (final MapleCharacter chr : party) {
            chr.modifyCSPoints(1, amount, true);
        }
    }

    public final void givePartyNX(final int amount) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            gainNX(amount);
            return;
        }
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.modifyCSPoints(1, amount, true);
            }
        }
    }

    public final void endPartyQuest(final int amount, final List<MapleCharacter> party) {
        for (final MapleCharacter chr : party) {
            chr.endPartyQuest(amount);
        }
    }

    public final void endPartyQuest(final int amount) {
        if (getPlayer().getParty() == null || getPlayer().getParty().getMembers().size() == 1) {
            getPlayer().endPartyQuest(amount);
            return;
        }
        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                curChar.endPartyQuest(amount);
            }
        }
    }

    public final void removeFromParty(final int id, final List<MapleCharacter> party) {
        for (final MapleCharacter chr : party) {
            final int possesed = chr.getInventory(GameConstants.getInventoryType(id)).countById(id);
            if (possesed > 0) {
                MapleInventoryManipulator.removeById(c, GameConstants.getInventoryType(id), id, possesed, true, false);
                chr.getClient().getSession().write(MaplePacketCreator.getShowItemGain(id, (short) -possesed, true));
            }
        }
    }

    public final void removeFromParty(final int id) {
        givePartyItems(id, (short) 0, true);
    }

    public final void useSkill(final int skill, final int level) {
        if (level <= 0) {
            return;
        }
        SkillFactory.getSkill(skill).getEffect(level).applyTo(c.getPlayer());
    }

    public final void useItem(final int id) {
        MapleItemInformationProvider.getInstance().getItemEffect(id).applyTo(c.getPlayer());
        c.getSession().write(UIPacket.getStatusMsg(id));
    }

    public final void cancelItem(final int id) {
        c.getPlayer().cancelEffect(MapleItemInformationProvider.getInstance().getItemEffect(id), -1);
    }

    public final int getMorphState() {
        return c.getPlayer().getMorphState();
    }

    public final int getDayOfWeek() {
        return Calendar.getInstance(TimeZone.getTimeZone("KST")).get(Calendar.DAY_OF_WEEK);
    }

    public final void removeAll(final int id) {
        c.getPlayer().removeAll(id);
    }

    public final void removeAllParty(final int id) {
        if (c.getPlayer().getParty() != null) {
            for (MaplePartyCharacter pchr : c.getPlayer().getParty().getMembers()) {
                MapleCharacter chr = c.getPlayer().getMap().getCharacterById(pchr.getId());
                if (chr != null) {
                    chr.removeAll(id, true);
                }
            }
        } else {
            c.getPlayer().removeAll(id, true);
        }
    }

    public final void gainCloseness(final int closeness, final int index) {
        final MaplePet pet = getPlayer().getPet(index);
        if (pet != null) {
            pet.setCloseness(pet.getCloseness() + (closeness * getChannelServer().getTraitRate()));
            getClient().getSession().write(PetPacket.updatePet(pet, getPlayer().getInventory(MapleInventoryType.CASH).getItem((byte) pet.getInventoryPosition()), true));
        }
    }

    public final void gainClosenessAll(final int closeness) {
        for (final MaplePet pet : getPlayer().getPets()) {
            if (pet != null && pet.getSummoned()) {
                pet.setCloseness(pet.getCloseness() + closeness);
                getClient().getSession().write(PetPacket.updatePet(pet, getPlayer().getInventory(MapleInventoryType.CASH).getItem((byte) pet.getInventoryPosition()), true));
            }
        }
    }

    public final void resetMap(final int mapid) {
        getMap(mapid).resetFully();
    }

    public final void openNpc(final int id, String key) {
        NPCScriptManager.getInstance().start(c, id, key);
    }

    public final void openNpc(final int id) {
        getClient().removeClickedNPC();
        NPCScriptManager.getInstance().start(getClient(), id);
    }

    public final void openNpc(final MapleClient cg, final int id) {
        cg.removeClickedNPC();

        NPCScriptManager.getInstance().start(cg, id);
    }

    public final int getMapId() {
        return c.getPlayer().getMap().getId();
    }

    public final boolean haveMonster(final int mobid) {
        for (MapleMapObject obj : c.getPlayer().getMap().getAllMonstersThreadsafe()) {
            final MapleMonster mob = (MapleMonster) obj;
            if (mob.getId() == mobid) {
                return true;
            }
        }
        return false;
    }

    public final int getChannelNumber() {
        return c.getChannel();
    }

    public int getMaxLevel(int skills) {
        Skill skill = SkillFactory.getSkill(skills);
        return skill.getMaxLevel();
    }

    public final int getMonsterCount(final int mapid) {
        return c.getChannelServer().getMapFactory().getMap(mapid).getNumMonsters();
    }

    public final void teachSkill(final int id, final int level, final byte masterlevel) {
        getPlayer().changeSkillLevel(SkillFactory.getSkill(id), level, masterlevel);
    }

    public final void teachSkill(final int id, int level) {
        final Skill skil = SkillFactory.getSkill(id);
        if (getPlayer().getSkillLevel(skil) > level) {
            level = getPlayer().getSkillLevel(skil);
        }
        getPlayer().changeSkillLevel(skil, level, (byte) skil.getMaxLevel());
    }

    public final int getPlayerCount(final int mapid) {
        return c.getChannelServer().getMapFactory().getMap(mapid).getCharactersSize();
    }

    public final MapleEvent getEvent(final String loc) {
        return c.getChannelServer().getEvent(MapleEventType.valueOf(loc));
    }

    public final int getSavedLocation(final String loc) {
        final Integer ret = c.getPlayer().getSavedLocation(SavedLocationType.fromString(loc));
        if (ret == null || ret == -1) {
            return 100000000;
        }
        return ret;
    }

    public long getBoatsTime(String type) {
        int arrivetime = 0;
        if (type.equalsIgnoreCase("eliorbis")) {
            arrivetime = 10;
        } else if (type.equalsIgnoreCase("ludileafreariantorbis")) {
            arrivetime = 5;
        }
        Calendar cal = Calendar.getInstance(Locale.KOREAN);
        int min = cal.get(Calendar.MINUTE);
        int secs = cal.get(Calendar.SECOND) + 60 * min;
        int wait = ((arrivetime + 5) * 60);
        int left = (wait - (secs % wait)) + (arrivetime * 60);
        return left * 1000L;
    }

    public final void saveLocation(final String loc) {
        c.getPlayer().saveLocation(SavedLocationType.fromString(loc));
    }

    public final void saveReturnLocation(final String loc) {
        c.getPlayer().saveLocation(SavedLocationType.fromString(loc), c.getPlayer().getMap().getReturnMap().getId());
    }

    public final void clearSavedLocation(final String loc) {
        c.getPlayer().clearSavedLocation(SavedLocationType.fromString(loc));
    }

    public final void summonMsg(final String msg) {
        if (!c.getPlayer().hasSummon()) {
            playerSummonHint(true);
        }
        c.getSession().write(UIPacket.summonMessage(msg));
    }

    public final void summonMsg(final int type) {
        if (!c.getPlayer().hasSummon()) {
            playerSummonHint(true);
        }
        c.getSession().write(UIPacket.summonMessage(type));
    }

    public final void showInstruction(final String msg, final int width, final int height) {
        c.getSession().write(MaplePacketCreator.sendHint(msg, width, height));
    }

    public final void playerSummonHint(final boolean summon) {
        c.getPlayer().setHasSummon(summon);
        c.getSession().write(UIPacket.summonHelper(summon));
    }

    public final String getInfoQuest(final int id) {
        return c.getPlayer().getInfoQuest(id);
    }

    public String getRanking(String job) {
        try {
            int int1 = 0;
            int int2 = 0;
            Connection con = DatabaseConnection.getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT * FROM characters WHERE job >= ? AND job <= ? AND gm = 0 ORDER BY level DESC LIMIT 10");
            if (job.equals("전사")) {
                int1 = 100;
                int2 = 132;
            } else if (job.equals("마법사")) {
                int1 = 200;
                int2 = 232;
            } else if (job.equals("궁수")) {
                int1 = 300;
                int2 = 322;
            } else if (job.equals("도적")) {
                int1 = 400;
                int2 = 422;
            } else if (job.equals("해적")) {
                int1 = 500;
                int2 = 522;
            } else if (job.equals("풍연")) {
                int1 = 1100;
                int2 = 1112;
            } else if (job.equals("해룡")) {
                int1 = 1200;
                int2 = 1212;
            } else if (job.equals("스우")) {
                int1 = 1500;
                int2 = 1512;
            } else if (job.equals("초보자")) {
                int1 = 0;
                int2 = 0;
            } else if (job.equals("전체")) {
                int1 = 0;
                int2 = 1999;
            } else if (job.equals("내랭킹")) {
                PreparedStatement ps2 = con.prepareStatement("SELECT name FROM characters ORDER BY level DESC");
                ResultSet rs = ps2.executeQuery();
                int i = 0;
                int fucker = 0;
                while (rs.next()) {
                    i++;
                    if (rs.getString("name").equals(c.getPlayer().getName())) {
                        fucker = i;
                        break;
                    }
                }
                rs.close();
                ps2.close();
                ps.close();
                return ("현재 #h # 님의 레벨 월드랭킹은 #b" + fucker + "등#k 입니다.");
            } else {
                ps.close();
                return "랭킹이 없습니다.";
            }
            ps.setInt(1, int1);
            ps.setInt(2, int2);
            ResultSet rs = ps.executeQuery();
            int i = 0;
            StringBuffer buf = new StringBuffer();
            buf.append("");
            while (rs.next()) {
                i++;
                if (i == 1) {
                    buf.append("1위 : #r<Lv." + rs.getString("level") + "> " + rs.getString("name") + "#k\r\n");
                } else if (i == 2) {
                    buf.append("2위 : #b<Lv." + rs.getString("level") + "> " + rs.getString("name") + "#k\r\n");
                } else if (i == 3) {
                    buf.append("3위 : #d<Lv." + rs.getString("level") + ">  " + rs.getString("name") + "#k\r\n");
                } else {
                    buf.append(i + "위 : <Lv." + rs.getString("level") + "> " + rs.getString("name") + "\r\n");
                }
            }
            rs.close();
            ps.close();
            return buf.toString();
        } catch (SQLException e) {
            return "랭킹을 출력할 수 없습니다.";
        }
    }

    public final void updateInfoQuest(final int id, final String data) {
        c.getPlayer().updateInfoQuest(id, data);
    }

    public final boolean getEvanIntroState(final String data) {
        return getInfoQuest(22013).equals(data);
    }

    public final void updateEvanIntroState(final String data) {
        updateInfoQuest(22013, data);
    }

//    public final void Aran_Start() {
//        c.getSession().write(UIPacket.Aran_Start());
//    }
    public final void evanTutorial(final String data, final int v1) {
        c.getSession().write(MaplePacketCreator.getEvanTutorial(data));
    }

    public final void showWZEffect(final String data) {
        c.getSession().write(UIPacket.ShowWZEffect(data));
    }

    public final void EarnTitleMsg(final String data) {
        c.getSession().write(UIPacket.EarnTitleMsg(data));
    }

    public final void EnableUI(final short i) {
        c.getSession().write(UIPacket.IntroEnableUI(i));
    }

    public final void DisableUI(final boolean enabled) {
        c.getSession().write(UIPacket.IntroDisableUI(enabled));
    }

    public final void MovieClipIntroUI(final boolean enabled) {
        c.getSession().write(UIPacket.IntroDisableUI(enabled));
        c.getSession().write(UIPacket.IntroLock(enabled));
    }

    public MapleInventoryType getInvType(int i) {
        return MapleInventoryType.Companion.getByType((byte) i);
    }

    public String getItemName(final int id) {
        return MapleItemInformationProvider.getInstance().getName(id);
    }

    public void gainPet(int id, String name, int level, int closeness, int fullness, long period, short flags) {
        if (id > 5002000 || id < 5000000) {
            id = 5000000;
        }
        if (level > 30) {
            level = 30;
        }
        if (closeness > 30000) {
            closeness = 30000;
        }
        if (fullness > 100) {
            fullness = 100;
        }
        try {
            MapleInventoryManipulator.addById(c, id, (short) 1, "", MaplePet.createPet(id, name, level, closeness, fullness, MapleInventoryIdentifier.getInstance(), id == 5000054 ? (int) period : 0, flags), 45, "Pet from interaction " + id + " (" + id2 + ")" + " on " + FileoutputUtil.CurrentReadable_Date());
        } catch (NullPointerException ex) {
            ex.printStackTrace();
        }
    }

    public void removeSlot(int invType, byte slot, short quantity) {
        MapleInventoryManipulator.removeFromSlot(c, getInvType(invType), slot, quantity, true);
    }

    public void gainGP(final int gp) {
        if (getPlayer().getGuildId() <= 0) {
            return;
        }
        World.Guild.gainGP(getPlayer().getGuildId(), gp); //1 for
        if (getPlayer().getEventInstance() != null) {
            getPlayer().getEventInstance().broadcastPacket(MaplePacketCreator.getShowGPGain(gp));
        }
    }

    public int getGP() {
        if (getPlayer().getGuildId() <= 0) {
            return 0;
        }
        return World.Guild.getGP(getPlayer().getGuildId()); //1 for
    }

    public void showMapEffect(String path) {
        getClient().getSession().write(UIPacket.MapEff(path));
    }

    public int itemQuantity(int itemid) {
        return getPlayer().itemQuantity(itemid);
    }

    public EventInstanceManager getDisconnected(String event) {
        EventManager em = getEventManager(event);
        if (em == null) {
            return null;
        }
        for (EventInstanceManager eim : em.getInstances()) {
            if (eim.isDisconnected(c.getPlayer()) && eim.getPlayerCount() > 0) {
                return eim;
            }
        }
        return null;
    }

    public boolean isAllReactorState(final int reactorId, final int state) {
        boolean ret = false;
        for (MapleReactor r : getMap().getAllReactorsThreadsafe()) {
            if (r.getReactorId() == reactorId) {
                ret = r.getState() == state;
            }
        }
        return ret;
    }

    public long getCurrentTime() {
        return System.currentTimeMillis();
    }

    public final void timeMoveMapP(final int destination, final int movemap, final int time) {
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            curChar.warp(movemap);
            curChar.getMap().broadcastMessage(MaplePacketCreator.getClock(time));
            CloneTimer tMan = CloneTimer.getInstance();
            Runnable r = new Runnable() {
                @Override
                public void run() {
                    if (curChar != null) {
                        if (curChar.getMapId() == movemap) {
                            curChar.warp(destination);
                        }
                    }
                }
            };
            tMan.schedule(r, time * 1000);
        }
    }

    public final void timeGiveItem(final int afteritem, final int time) {
        getClient().getSession().write(MaplePacketCreator.getClock(time));
        CloneTimer tMan = CloneTimer.getInstance();
        Runnable r = new Runnable() {
            @Override
            public void run() {
                if (getPlayer() != null) {
                    if (getPlayer().getMapId() == 910000020) {
                        getPlayer().gainItem(afteritem, (byte) 1);
                        getPlayer().dropMessage(1, "알이 부화하였습니다 인벤토리를 확인해주세요.");
                    } else {
                        getPlayer().dropMessage(1, "알부화가 실패하였습니다.");
                    }
                }
            }
        };
        tMan.schedule(r, time * 1000);
    }

    public final void timeMoveMap(final int destination, final int movemap, final int time) {
        warp(movemap, 0);
        getClient().getSession().write(MaplePacketCreator.getClock(time));
        CloneTimer tMan = CloneTimer.getInstance();
        Runnable r = new Runnable() {
            @Override
            public void run() {
                if (getPlayer() != null) {
                    if (getPlayer().getMapId() == movemap) {
                        warp(destination);
                    }
                }
            }
        };
        tMan.schedule(r, time * 1000);
    }

    public final void TimeMoveMapP(final int movemap, final int destination, final int time) {
        timeMoveMapP(destination, movemap, time);
    }

    public final void TimeMoveMap(final int movemap, final int destination, final int time) {
        timeMoveMap(destination, movemap, time);
    }

    public void spawnMonster(int id) {
        spawnMonster(id, 1, getPlayer().getTruePosition());
    }

    // summon one monster, remote location
    public void spawnMonster(int id, int x, int y) {
        spawnMonster(id, 1, new Point(x, y));
    }

    // multiple monsters, remote location
    public void spawnMonster(int id, int qty, int x, int y) {
        spawnMonster(id, qty, new Point(x, y));
    }

    // handler for all spawnMonster
    public void spawnMonster(int id, int qty, Point pos) {
        for (int i = 0; i < qty; i++) {
            getMap().spawnMonsterOnGroundBelow(MapleLifeFactory.getMonster(id), pos);
        }
    }

    public void sendNPCText(final String text, final int npc) {
        getMap().broadcastMessage(MaplePacketCreator.getNPCTalk(npc, (byte) 0, text, "00 00", (byte) 0));
    }

    public boolean getTempFlag(final int flag) {
        return (c.getChannelServer().getTempFlag() & flag) == flag;
    }

    public void logPQ(String text) {
//	FileoutputUtil.log(FileoutputUtil.PQ_Log, text);
    }

    public void outputFileError(Throwable t) {
        FileoutputUtil.outputFileError(FileoutputUtil.ScriptEx_Log, t);
    }

    public void trembleEffect(int type, int delay) {
        c.getSession().write(MaplePacketCreator.trembleEffect(type, delay));
    }

    public int nextInt(int arg0) {
        return Randomizer.nextInt(arg0);
    }

    public int rand(int a, int b) {
        return Randomizer.rand(a, b);
    }

    public MapleQuest getQuest(int arg0) {
        return MapleQuest.getInstance(arg0);
    }

    public void achievement(int a) {
        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.achievementRatio(a));
    }

    public final MapleInventory getInventory(int type) {
        return c.getPlayer().getInventory(MapleInventoryType.Companion.getByType((byte) type));
    }

    public int randInt(int arg0) {
        return Randomizer.nextInt(arg0);
    }

    public void sendDirectionStatus(int key, int value) {
        c.getSession().write(UIPacket.getDirectionInfo(key, value));
        c.getSession().write(UIPacket.getDirectionStatus(true));
    }

    public void sendDirectionInfo(String data) {
        c.getSession().write(UIPacket.getDirectionInfo(data, 2000, 0, -100, 0));
        c.getSession().write(UIPacket.getDirectionInfo(1, 2000));
    }

    public String getCurrentDate() {
        long cur = System.currentTimeMillis();
        Calendar cal = Calendar.getInstance(Locale.KOREAN);
        cal.setTimeInMillis(cur);
        return cal.get(Calendar.YEAR)
                + StringUtil.getLeftPaddedStr(String.valueOf(cal.get(Calendar.MONTH) + 1), '0', 2)
                + StringUtil.getLeftPaddedStr(String.valueOf(cal.get(Calendar.DAY_OF_MONTH)), '0', 2)
                + StringUtil.getLeftPaddedStr(String.valueOf(cal.get(Calendar.HOUR_OF_DAY)), '0', 2);
    }

    public final void setBossRepeatTime(String type, int min) {
        int qid = -1;
        if (type.equalsIgnoreCase("papulatus")) {
            qid = 199700;
        }
        if (type.equalsIgnoreCase("manon")) {
            qid = 199701;
        }
        if (type.equalsIgnoreCase("pianus")) {
            qid = 199702;
        }
        if (type.equalsIgnoreCase("griffey")) {
            qid = 199703;
        }
        if (qid == -1) {
            return;
        }
        for (MapleCharacter chr : getPlayer().getMap().getCharacters()) {
            MapleQuestStatus qr = chr.getQuestNAdd(MapleQuest.getInstance(qid));
            qr.setCustomData((System.currentTimeMillis() + min * 60000L) + "");
        }
    }

    public final boolean canBossEnterTime(String type) {
        int qid = -1;
        if (type.equalsIgnoreCase("papulatus")) {
            qid = 199700;
        }
        if (type.equalsIgnoreCase("manon")) {
            qid = 199701;
        }
        if (type.equalsIgnoreCase("pianus")) {
            qid = 199702;
        }
        if (type.equalsIgnoreCase("griffey")) {
            qid = 199703;
        }
        if (qid == -1) {
            return false;
        }
        MapleQuestStatus qr = getPlayer().getQuestNAdd(MapleQuest.getInstance(qid));
        if (qr.getCustomData() == null) {
            return true; //null pointer exception;
        }
        long time = Long.parseLong(qr.getCustomData());
        return time < System.currentTimeMillis();
    }

    public final void gainPartyExpPQ(int exp, String pq, int mod) {
        int qid = -1;
        if (pq.equalsIgnoreCase("ludipq")) {
            qid = 199600;
        }
        if (pq.equalsIgnoreCase("kerningpq")) {
            qid = 199601;
        }
        if (pq.equalsIgnoreCase("orbispq")) {
            qid = 199602;
        }
        if (pq.equalsIgnoreCase("rnj")) {
            qid = 199603;
        }
        if (pq.equalsIgnoreCase("ellin")) {
            qid = 199604;
        }

        final int cMap = getPlayer().getMapId();
        for (final MaplePartyCharacter chr : getPlayer().getParty().getMembers()) {
            final MapleCharacter curChar = getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getPlayer().getEventInstance())) {
                int modifiedExp = exp;
                if (qid > -1) {
                    double modd = mod / 100.0D;
                    MapleQuestStatus qr = curChar.getQuestNAdd(MapleQuest.getInstance(qid));
                    if (qr.getCustomData() == null) {
                        qr.setCustomData("0");
                    }
                    int count = Integer.parseInt(qr.getCustomData());
                    if (count > 0) {
                        modifiedExp *= modd;
                    }
                }
                curChar.gainExp(modifiedExp * c.getChannelServer().getExpRate(), true, true, true);
            }
        }
    }

    public final String shuffle(String origin) {
        return Randomizer.shuffle(origin);
    }

    public void showQuestCompleteEffect() {
        c.getSession().write(MaplePacketCreator.showSpecialEffect(9)); // Quest completion
        getPlayer().getMap().broadcastMessage(getPlayer(), MaplePacketCreator.showSpecialEffect(getPlayer().getId(), 9), false);
    }

    public final void dojo_getUp() {
        c.getSession().write(MaplePacketCreator.updateInfoQuest(1207, "pt=1;min=4;belt=1;tuto=1")); //todo
        c.getSession().write(MaplePacketCreator.Mulung_DojoUp2());
        c.getSession().write(MaplePacketCreator.instantMapWarp((byte) 6));
    }

    public final boolean dojoAgent_NextMap(final boolean dojo, final boolean fromresting) {
        if (dojo) {
            return Event_DojoAgent.warpNextMap(c.getPlayer(), fromresting, c.getPlayer().getMap());
        }
        return Event_DojoAgent.warpNextMap_Agent(c.getPlayer(), fromresting);
    }

    public final boolean dojoAgent_NextMap(final boolean dojo, final boolean fromresting, final int mapid) {
        if (dojo) {
            return Event_DojoAgent.warpNextMap(c.getPlayer(), fromresting, getMap(mapid));
        }
        return Event_DojoAgent.warpNextMap_Agent(c.getPlayer(), fromresting);
    }

    public void showEffect(boolean broadcast, String effect) {
        if (broadcast) {
            c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.showEffect(effect));
        } else {
            c.getSession().write(MaplePacketCreator.showEffect(effect));
        }
    }

    public void playSound(boolean broadcast, String sound) {
        if (broadcast) {
            c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.playSound(sound));
        } else {
            c.getSession().write(MaplePacketCreator.playSound(sound));
        }
    }

    public void playMusic(boolean broadcast, String sound) {
        if (broadcast) {
            c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.musicChange(sound));
        } else {
            c.getSession().write(MaplePacketCreator.musicChange(sound));
        }
    }

    public void setMapMusic(String sound) {
        c.getPlayer().getMap().changeMusic(sound);
        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.musicChange(sound));
    }

    public void environmentChange(boolean broadcast, String env) {
        if (broadcast) {
            c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.environmentChange(env, 2));
        } else {
            c.getSession().write(MaplePacketCreator.environmentChange(env, 2));
        }
    }

    public void clearEffect() {
        showEffect(true, "quest/party/clear");
        playSound(true, "Party1/Clear");
        environmentChange(true, "gate");
    }

    public void failEffect() {
        showEffect(true, "quest/party/wrong_kor");
        playSound(true, "Party1/Failed");
    }

    public void gainPop(int fameGain) {
        c.getPlayer().addFame(fameGain);
        c.getPlayer().updateSingleStat(MapleStat.FAME, c.getPlayer().getFame());
        c.getSession().write(MaplePacketCreator.getShowFameGain(fameGain));
    }

    public void setQuestByInfo(int qid, String info, boolean complete) {
        MapleQuestStatus stat = getQuestRecord(qid);
        stat.setCustomData(info);
        getPlayer().updateQuest(stat, true);
        if (complete) {
            showQuestClear(qid);
        }
    }
}
