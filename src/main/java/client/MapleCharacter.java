package client;

import client.anticheat.CheatTracker;
import client.anticheat.ReportType;
import client.inventory.Equip;
import client.inventory.Item;
import client.inventory.ItemFlag;
import client.inventory.ItemLoader;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryType;
import client.inventory.MapleMount;
import client.inventory.MaplePet;
import client.inventory.MapleRing;
import constants.GameConstants;
import constants.ServerConstants;
import constants.ServerConstants.PlayerGMRank;
import database.DatabaseConnection;
import database.DatabaseConnection_XE;
import database.DatabaseException;
import handling.channel.ChannelServer;
import handling.login.LoginInformationProvider.JobType;
import handling.login.LoginServer;
import handling.world.CharacterTransfer;
import handling.world.MapleMessenger;
import handling.world.MapleMessengerCharacter;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PartyOperation;
import handling.world.PlayerBuffStorage;
import handling.world.PlayerBuffValueHolder;
import handling.world.World;
import handling.world.family.MapleFamily;
import handling.world.family.MapleFamilyBuff;
import handling.world.family.MapleFamilyCharacter;
import handling.world.guild.MapleGuild;
import handling.world.guild.MapleGuildCharacter;
import java.awt.Point;
import java.awt.Rectangle;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Deque;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import scripting.AbstractPlayerInteraction;
import scripting.EventInstanceManager;
import scripting.NPCScriptManager;
import server.CashShop;
import server.MapleAchievements;
import server.MapleCarnivalChallenge;
import server.MapleCarnivalParty;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.MaplePortal;
import server.MapleShop;
import server.MapleStatEffect;
import server.MapleStorage;
import server.MapleTrade;
import server.Randomizer;
import server.Timer.CloneTimer;
import server.Timer.MapTimer;
import server.life.MapleMonster;
import server.life.MapleNPC;
import server.life.MobSkill;
import server.life.MobSkillFactory;
import server.life.PlayerNPC;
import server.log.DBLogger;
import server.log.LogType;
import server.maps.AnimatedMapleMapObject;
import server.maps.FieldLimitType;
import server.maps.MapleDoor;
import server.maps.MapleFoothold;
import server.maps.MapleMap;
import server.maps.MapleMapFactory;
import server.maps.MapleMapObject;
import server.maps.MapleMapObjectType;
import server.maps.MapleSummon;
import server.maps.SavedLocationType;
import server.marriage.MarriageEventAgent;
import server.marriage.MarriageManager;
import server.movement.LifeMovementFragment;
import server.quest.MapleQuest;
import server.shops.IMaplePlayerShop;
import server.shops.MapleMiniGame;
import tools.ConcurrentEnumMap;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.MaplePacketCreator.GainExpPacket;
import tools.Pair;
import tools.StringUtil;
import tools.Triple;
import tools.packet.CSPacket;
import tools.packet.MobPacket;
import tools.packet.MonsterCarnivalPacket;
import tools.packet.PetPacket;
import tools.packet.PlayerShopPacket;
import tools.packet.TemporaryStatsPacket;
import tools.packet.UIPacket;

public class MapleCharacter extends AnimatedMapleMapObject implements Serializable {

    private static final long serialVersionUID = 845748950829L;
    private String name, chalktext, teleportname;
    private long lastCombo, lastfametime, keydown_skill, nextConsume, pqStartTime, lastDragonBloodTime, lastBeholderHealTime, lastBeholderBuffTime,
            lastBerserkTime, lastRecoveryTime, lastSummonTime, mapChangeTime, lastFishingTime, lastFairyTime,
            lastHPTime, lastMPTime, lastDOTTime, firstLoginTime;
    private byte gmLevel, gender, initialSpawnPoint, skinColor, guildrank = 5, allianceRank = 5,
            world, fairyExp, subcategory;
    private short level, mulung_energy, combo, availableCP, totalCP, hpApUsed, job, remainingAp, scrolledPosition;
    private int accountid, id, meso, exp, hair, face, mapid, fame,
            guildid = 0, fallcounter, maplepoints, acash, chair, itemEffect, points, vpoints,
            rank = 1, rankMove = 0, jobRank = 1, jobRankMove = 0, marriageId, engageId, marriageItemId, dotHP,
            battleshipHP, coconutteam, currentrep, totalrep, challenge, donatecash, bookCover, weddingGiftGive, locationed;
    private Point old;
    private int[] wishlist, rocks, savedLocations, regrocks, hyperrocks, remainingSp = new int[10];
    private transient AtomicInteger inst, insd;
    private transient List<LifeMovementFragment> lastres;
    private List<Integer> lastmonthfameids, lastmonthbattleids;
    private List<MapleDoor> doors;
    private List<MaplePet> pets;
    private transient Set<MapleMonster> controlled;
    private transient Set<MapleMapObject> visibleMapObjects;
    private transient ReentrantReadWriteLock visibleMapObjectsLock;
    private transient ReentrantReadWriteLock summonsLock;
    private transient ReentrantReadWriteLock controlledLock;
    private Map<MapleQuest, MapleQuestStatus> quests;
    private transient Map<Integer, Integer> linkMobs;
    private Map<Integer, String> questinfo;
    private Map<Skill, SkillEntry> skills;
    private transient Map<MapleBuffStat, MapleBuffStatValueHolder> effects;
    private transient List<MapleSummon> summons;
    private transient Map<Integer, MapleCoolDownValueHolder> coolDowns;
    private transient Map<MapleDisease, MapleDiseaseValueHolder> diseases;
    private Map<ReportType, Integer> reports;
    private CashShop cs;
    private transient Deque<MapleCarnivalChallenge> pendingCarnivalRequests;
    private transient MapleCarnivalParty carnivalParty;
    private BuddyList buddylist;
    private transient CheatTracker anticheat;
    private MapleClient client;
    private Connection connection1;
    private AbstractPlayerInteraction script;
    private transient MapleParty party;
    private PlayerStats stats;
    private transient MapleMap map;
    private transient MapleShop shop;
    private transient RockPaperScissors rps;
    private MonsterBook monsterbook;
    private MapleStorage storage;
    private transient boolean usingStrongBuff = false;
    private transient MapleTrade trade;
    private MapleMount mount;
    private List<Integer> finishedAchievements;
    private MapleMessenger messenger;
    private byte[] petStore;
    private transient IMaplePlayerShop playerShop;
    private boolean invincible, canTalk, smega, hasSummon;
    private MapleGuildCharacter mgc;
    private MapleFamilyCharacter mfc;
    private transient EventInstanceManager eventInstance;
    private MapleInventory[] inventory;
    private SkillMacro[] skillMacros = new SkillMacro[5];
    //private EnumMap<MapleTraitType, MapleTrait> traits;
    private MapleKeyLayout keylayout;
    private transient ScheduledFuture<?> mapTimeLimitTask;
    private transient List<Integer> pendingExpiration = null, pendingSkills = null;
    private boolean changed_wishlist, changed_trocklocations, changed_regrocklocations, changed_hyperrocklocations, changed_skillmacros, changed_achievements,
            changed_savedlocations, changed_pokemon, changed_questinfo, changed_skills, changed_reports;
    private boolean goDonateCashShop = false;
    private boolean searchingParty = false;
    private List<Integer> psearch_jobs;
    private int psearch_maxLevel;
    private int psearch_minLevel;
    private int psearch_membersNeeded;
    private int canGainNoteFame = 0;
    private transient PlayerRandomStream random1;
    private transient PlayerRandomStream random2;
    private transient PlayerRandomStream random3;
    public static int leafgage = 0;
    private int shiphp = 100;
    private int Shp = 0;
    private int tradeitemid = 0;
    private int trademeso = 0;
    private int tradechar = 0;
    private int trademe = 0;
    private int upitemid = 0;
    private Object coin;
    private boolean scrollmode = false;
    private ScheduledFuture<?> pendantOfSpirit = null; //1122017
    private int pendantExp = 0;

    private MapleCharacter(final boolean ChannelServer) {
        setStance(0);
        setPosition(new Point(0, 0));

        inventory = new MapleInventory[MapleInventoryType.values().length];
        for (MapleInventoryType type : MapleInventoryType.values()) {
            inventory[type.ordinal()] = new MapleInventory(type);
        }
        quests = new LinkedHashMap<MapleQuest, MapleQuestStatus>(); // Stupid erev quest.
        skills = new LinkedHashMap<Skill, SkillEntry>(); //Stupid UAs.
        stats = new PlayerStats();
        for (int i = 0; i < remainingSp.length; i++) {
            remainingSp[i] = 0;
        }

        if (ChannelServer) {
            changed_reports = false;
            changed_skills = false;
            changed_achievements = false;
            changed_wishlist = false;
            changed_trocklocations = false;
            changed_regrocklocations = false;
            changed_hyperrocklocations = false;
            changed_skillmacros = false;
            changed_savedlocations = false;
            changed_pokemon = false;
            changed_questinfo = false;
            scrolledPosition = 0;
            lastCombo = 0;
            mulung_energy = 0;
            combo = 0;
            keydown_skill = 0;
            nextConsume = 0;
            pqStartTime = 0;
            fairyExp = 0;
            mapChangeTime = 0;
            lastRecoveryTime = 0;
            battleshipHP = 0;
            lastDragonBloodTime = 0;
            lastBeholderBuffTime = 0;
            lastBeholderHealTime = 0;
            lastBerserkTime = 0;
            lastFishingTime = 0;
            lastFairyTime = 0;
            lastHPTime = 0;
            lastMPTime = 0;
            old = new Point(0, 0);
            coconutteam = 0;
            marriageItemId = 0;
            fallcounter = 0;
            challenge = 0;
            dotHP = 0;
            engageId = 0;
            marriageId = 0;
            lastSummonTime = 0;
            hasSummon = false;
            invincible = false;
            canTalk = true;
            searchingParty = false;
            finishedAchievements = new ArrayList<Integer>();
            reports = new EnumMap<ReportType, Integer>(ReportType.class);
            teleportname = "";
            smega = true;
            petStore = new byte[3];
            for (int i = 0; i < petStore.length; i++) {
                petStore[i] = (byte) -1;
            }
            wishlist = new int[10];
            rocks = new int[10];
            regrocks = new int[5];
            hyperrocks = new int[13];
            effects = new ConcurrentEnumMap<MapleBuffStat, MapleBuffStatValueHolder>(MapleBuffStat.class);
            coolDowns = new LinkedHashMap<Integer, MapleCoolDownValueHolder>();
            diseases = new ConcurrentEnumMap<MapleDisease, MapleDiseaseValueHolder>(MapleDisease.class);
            inst = new AtomicInteger(0);// 1 = NPC/ Quest, 2 = Duey, 3 = Hired Merch store, 4 = Storage
            insd = new AtomicInteger(-1);
            keylayout = new MapleKeyLayout();
            doors = new ArrayList<MapleDoor>();
            linkMobs = new HashMap<Integer, Integer>();
            controlled = new LinkedHashSet<MapleMonster>();
            controlledLock = new ReentrantReadWriteLock();
            summons = new LinkedList<MapleSummon>();
            summonsLock = new ReentrantReadWriteLock();
            visibleMapObjects = new LinkedHashSet<MapleMapObject>();
            visibleMapObjectsLock = new ReentrantReadWriteLock();
            pendingCarnivalRequests = new LinkedList<MapleCarnivalChallenge>();

            savedLocations = new int[SavedLocationType.values().length];
            for (int i = 0; i < SavedLocationType.values().length; i++) {
                savedLocations[i] = -1;
            }
            questinfo = new LinkedHashMap<Integer, String>();
            pets = new ArrayList<MaplePet>();
            random1 = new PlayerRandomStream();
            random2 = new PlayerRandomStream();
            random3 = new PlayerRandomStream();
        }
    }

    public static MapleCharacter getDefault(final MapleClient client, final JobType type) {
        MapleCharacter ret = new MapleCharacter(false);
        ret.client = client;
        ret.map = null;
        ret.exp = 0;
        ret.gmLevel = 0;
        ret.job = (short) type.id;
        ret.meso = 0;
        ret.level = 1;
        ret.remainingAp = 0;
        ret.fame = 0;
        ret.accountid = client.getAccID();
        ret.buddylist = new BuddyList((byte) 20);

        ret.stats.str = 12;
        ret.stats.dex = 5;
        ret.stats.int_ = 4;
        ret.stats.luk = 4;
        ret.stats.maxhp = 50;
        ret.stats.hp = 50;
        ret.stats.maxmp = 5;
        ret.stats.mp = 5;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
            ps.setInt(1, ret.accountid);
            rs = ps.executeQuery();
            if (rs.next()) {
                ret.client.setAccountName(rs.getString("name"));
                ret.acash = rs.getInt("ACash");
                ret.maplepoints = rs.getInt("mPoints");
                ret.points = rs.getInt("points");
                ret.vpoints = rs.getInt("vpoints");
            }
        } catch (SQLException e) {
            System.err.println("Error getting character default" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return ret;
    }

    public final static MapleCharacter ReconstructChr(final CharacterTransfer ct, final MapleClient client, final boolean isChannel) {
        final MapleCharacter ret = new MapleCharacter(true); // Always true, it's change channel
        ret.client = client;
        if (!isChannel) {
            ret.client.setChannel(ct.channel);
        }
        ret.id = ct.characterid;
        ret.name = ct.name;
        ret.level = ct.level;
        ret.fame = ct.fame;

        ret.stats.str = ct.str;
        ret.stats.dex = ct.dex;
        ret.stats.int_ = ct.int_;
        ret.stats.luk = ct.luk;
        ret.stats.maxhp = ct.maxhp;
        ret.stats.maxmp = ct.maxmp;
        ret.stats.hp = ct.hp;
        ret.stats.mp = ct.mp;

        ret.chalktext = ct.chalkboard;
        ret.gmLevel = ct.gmLevel;
        ret.hide = false;
        ret.exp = ret.level >= 200  ? 0 : ct.exp;
        ret.hpApUsed = ct.hpApUsed;
        ret.remainingSp = ct.remainingSp;
        ret.remainingAp = ct.remainingAp;
        ret.meso = ct.meso;
        ret.skinColor = ct.skinColor;
        ret.gender = ct.gender;
        ret.job = ct.job;
        ret.hair = ct.hair;
        ret.face = ct.face;
        ret.locationed = ct.locationed;
        ret.accountid = ct.accountid;
        client.setAccID(ct.accountid);
        ret.mapid = ct.mapid;
        ret.initialSpawnPoint = ct.initialSpawnPoint;
        ret.world = ct.world;
        ret.guildid = ct.guildid;
        ret.guildrank = ct.guildrank;
        ret.allianceRank = ct.alliancerank;
        ret.points = ct.points;
        ret.vpoints = ct.vpoints;
        ret.fairyExp = ct.fairyExp;
        if (ret.guildid > 0) {
            ret.mgc = new MapleGuildCharacter(ret);
        }
        ret.buddylist = new BuddyList(ct.buddysize);
        ret.subcategory = ct.subcategory;
        ret.goDonateCashShop = ct.donateshop > 0;
        ret.firstLoginTime = ct.firstLoginTime;
        ret.makeMFC(ct.familyid, ct.seniorid, ct.junior1, ct.junior2, ret.firstLoginTime);
        ret.totalrep = ct.totalrep;
        ret.currentrep = ct.currentrep;
        ret.marriageId = ct.marriageId;
        ret.engageId = ct.engageId;
        ret.itemEffect = ct.itemEffect;

        if (isChannel) {
            final MapleMapFactory mapFactory = ChannelServer.getInstance(client.getChannel()).getMapFactory();
            ret.map = mapFactory.getMap(ret.mapid);
            if (ret.map == null) { //char is on a map that doesn't exist warp it to henesys
                ret.map = mapFactory.getMap(100000000);
            } else {
                if (ret.map.getForcedReturnId() != 999999999 && ret.map.getForcedReturnMap() != null) {
                    ret.map = ret.map.getForcedReturnMap();
                } else if (ret.mapid >= 925010000 && ret.mapid <= 925010300) {
                    ret.map = mapFactory.getMap(120000104);
                }
            }
            MaplePortal portal = ret.map.getPortal(ret.initialSpawnPoint);
            if (portal == null) {
                portal = ret.map.getPortal(0); // char is on a spawnpoint that doesn't exist - select the first spawnpoint instead
                ret.initialSpawnPoint = 0;
            }
            ret.setPosition(portal.getPosition());

            final int messengerid = ct.messengerid;
            if (messengerid > 0) {
                ret.messenger = World.Messenger.getMessenger(messengerid);
            }
        } else {

            ret.messenger = null;
        }
        int partyid = ct.partyid;
        if (partyid >= 0) {
            MapleParty party = World.Party.getParty(partyid);
            if (party != null && party.getMemberById(ret.id) != null) {
                ret.party = party;
            }
        }

        MapleQuestStatus queststatus_from;
        for (final Map.Entry<Integer, Object> qs : ct.Quest.entrySet()) {
            queststatus_from = (MapleQuestStatus) qs.getValue();
            queststatus_from.setQuest(qs.getKey());
            ret.quests.put(queststatus_from.getQuest(), queststatus_from);
        }
        for (final Map.Entry<Integer, SkillEntry> qs : ct.Skills.entrySet()) {
            ret.skills.put(SkillFactory.getSkill(qs.getKey()), qs.getValue());
        }
        for (final Integer zz : ct.finishedAchievements) {
            ret.finishedAchievements.add(zz);
        }
//        for (Entry<MapleTraitType, Integer> t : ct.traits.entrySet()) {
//            ret.traits.get(t.getKey()).setExp(t.getValue());
//        }
        for (final Map.Entry<Byte, Integer> qs : ct.reports.entrySet()) {
            ret.reports.put(ReportType.Companion.getById(qs.getKey()), qs.getValue());
        }
        ret.monsterbook = (MonsterBook) ct.monsterbook;
        ret.bookCover = ct.mbookcover;
        ret.inventory = (MapleInventory[]) ct.inventorys;
        ret.skillMacros = (SkillMacro[]) ct.skillmacro;
        ret.petStore = ct.petStore;
        ret.keylayout = new MapleKeyLayout(ct.keymap);
        ret.questinfo = ct.InfoQuest;
        ret.savedLocations = ct.savedlocation;
        ret.wishlist = ct.wishlist;
        ret.rocks = ct.rocks;
        ret.regrocks = ct.regrocks;
        ret.hyperrocks = ct.hyperrocks;
        ret.buddylist.loadFromTransfer(ct.buddies);
        // ret.lastfametime
        // ret.lastmonthfameids
        ret.keydown_skill = 0; // Keydown skill can't be brought over
        ret.lastfametime = ct.lastfametime;
        ret.lastmonthfameids = ct.famedcharacters;
        ret.lastmonthbattleids = ct.battledaccs;
        ret.storage = (MapleStorage) ct.storage;
        ret.cs = (CashShop) ct.cs;
        client.setAccountName(ct.accountname);
        ret.acash = ct.ACash;
        ret.donatecash = ct.DonateCash;
        ret.maplepoints = ct.MaplePoints;
        ret.anticheat = (CheatTracker) ct.anticheat;

        ret.anticheat.start(ret);
        ret.mount = new MapleMount(ret, ct.mount_itemid, ret.stats.getSkillByJob(1004, ret.job), ct.mount_Fatigue, ct.mount_level, ct.mount_exp);
        ret.expirationTask(false, false);
        ret.stats.recalcLocalStats(true, ret);
        client.setTempIP(ct.tempIP);

        return ret;
    }

    public static MapleCharacter loadCharFromDB(int charid, MapleClient client, boolean channelserver) {
        final MapleCharacter ret = new MapleCharacter(channelserver);
        ret.client = client;
        ret.id = charid;

        Connection con = null;
        PreparedStatement ps = null;
        PreparedStatement pse = null;
        ResultSet rs = null;

        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM characters WHERE id = ?");
            ps.setInt(1, charid);
            rs = ps.executeQuery();
            if (!rs.next()) {
                rs.close();
                ps.close();
                throw new RuntimeException("Loading the Char Failed (char not found)");
            }
            ret.name = rs.getString("name");
            ret.level = rs.getShort("level");
            ret.fame = rs.getInt("fame");

            ret.stats.str = rs.getShort("str");
            ret.stats.dex = rs.getShort("dex");
            ret.stats.int_ = rs.getShort("int");
            ret.stats.luk = rs.getShort("luk");
            ret.stats.maxhp = rs.getInt("maxhp");
            ret.stats.maxmp = rs.getInt("maxmp");
            ret.stats.hp = rs.getInt("hp");
            ret.stats.mp = rs.getInt("mp");
            ret.job = rs.getShort("job");
            ret.gmLevel = rs.getByte("gm");
            ret.hide = false;
            ret.exp = (ret.level >= 200) ? 0 : rs.getInt("exp");
            ret.hpApUsed = rs.getShort("hpApUsed");
            final String[] sp = rs.getString("sp").split(",");
            for (int i = 0; i < ret.remainingSp.length; i++) {
                ret.remainingSp[i] = Integer.parseInt(sp[i]);
            }
            ret.remainingAp = rs.getShort("ap");
            ret.meso = rs.getInt("meso");
            ret.skinColor = rs.getByte("skincolor");
            ret.gender = rs.getByte("gender");

            ret.hair = rs.getInt("hair");
            ret.locationed = rs.getInt("locationed");
            ret.face = rs.getInt("face");
            ret.accountid = rs.getInt("accountid");
            client.setAccID(ret.accountid);
            ret.mapid = rs.getInt("map");
            ret.initialSpawnPoint = rs.getByte("spawnpoint");
            ret.world = rs.getByte("world");
            ret.guildid = rs.getInt("guildid");
            ret.guildrank = rs.getByte("guildrank");
            ret.allianceRank = rs.getByte("allianceRank");
            ret.currentrep = rs.getInt("currentrep");
            ret.totalrep = rs.getInt("totalrep");
            ret.firstLoginTime = System.currentTimeMillis();
            ret.makeMFC(rs.getInt("familyid"), rs.getInt("seniorid"), rs.getInt("junior1"), rs.getInt("junior2"), ret.firstLoginTime);
            if (ret.guildid > 0) {
                ret.mgc = new MapleGuildCharacter(ret);
            }
            ret.buddylist = new BuddyList(rs.getByte("buddyCapacity"));
            ret.subcategory = rs.getByte("subcategory");
            ret.mount = new MapleMount(ret, 0, ret.stats.getSkillByJob(1004, ret.job), (byte) 0, (byte) 1, 0);
            ret.rank = rs.getInt("rank");
            ret.rankMove = rs.getInt("rankMove");
            ret.jobRank = rs.getInt("jobRank");
            ret.jobRankMove = rs.getInt("jobRankMove");
            ret.marriageId = rs.getInt("marriageId");
            ret.engageId = 0;
            ret.bookCover = rs.getInt("mbookcover");
//            for (MapleTrait t : ret.traits.values()) {
//                t.setExp(rs.getInt(t.getType().name()));
//            }
            if (channelserver) {
                ret.anticheat = new CheatTracker(ret);
                MapleMapFactory mapFactory = ChannelServer.getInstance(client.getChannel()).getMapFactory();
                ret.map = mapFactory.getMap(ret.mapid);
                if (ret.map == null) { //char is on a map that doesn't exist warp it to henesys
                    ret.map = mapFactory.getMap(100000000);
                }
                MaplePortal portal = ret.map.getPortal(ret.initialSpawnPoint);
                if (portal == null) {
                    portal = ret.map.getPortal(0); // char is on a spawnpoint that doesn't exist - select the first spawnpoint instead
                    ret.initialSpawnPoint = 0;
                }
                ret.setPosition(portal.getPosition());

                int partyid = rs.getInt("party");
                if (partyid >= 0) {
                    MapleParty party = World.Party.getParty(partyid);
                    if (party != null && party.getMemberById(ret.id) != null) {
                        ret.party = party;
                    }
                }
                final String[] pets = rs.getString("pets").split(",");
                for (int i = 0; i < ret.petStore.length; i++) {
                    ret.petStore[i] = Byte.parseByte(pets[i]);
                }
                rs.close();
                ps.close();
                ps = con.prepareStatement("SELECT * FROM achievements WHERE accountid = ?");
                ps.setInt(1, ret.accountid);
                rs = ps.executeQuery();
                while (rs.next()) {
                    ret.finishedAchievements.add(rs.getInt("achievementid"));
                }
                ps.close();
                rs.close();

                ps = con.prepareStatement("SELECT * FROM reports WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                while (rs.next()) {
                    if (ReportType.Companion.getById(rs.getByte("type")) != null) {
                        ret.reports.put(ReportType.Companion.getById(rs.getByte("type")), rs.getInt("count"));
                    }
                }

            }
            rs.close();
            ps.close();

            ps = con.prepareStatement("SELECT * FROM queststatus WHERE characterid = ?");
            ps.setInt(1, charid);
            rs = ps.executeQuery();
            pse = con.prepareStatement("SELECT * FROM queststatusmobs WHERE queststatusid = ?");

            while (rs.next()) {
                final int id = rs.getInt("quest");
                final MapleQuest q = MapleQuest.getInstance(id);
                final byte stat = rs.getByte("status");
                if ((stat == 1 || stat == 2) && channelserver && (q == null || q.isBlocked())) { //bigbang
                    continue;
                }
//                if (stat == 1 && channelserver && !q.canStart(ret, null)) { //bigbang
//                    continue;
//                }
                final MapleQuestStatus status = new MapleQuestStatus(q, stat);
                final long cTime = rs.getLong("time");
                if (cTime > -1) {
                    status.setCompletionTime(cTime * 1000);
                }
                status.setForfeited(rs.getInt("forfeited"));
                status.setCustomData(rs.getString("customData"));
                ret.quests.put(q, status);
                pse.setInt(1, rs.getInt("queststatusid"));
                final ResultSet rsMobs = pse.executeQuery();

                while (rsMobs.next()) {
                    status.setMobKills(rsMobs.getInt("mob"), rsMobs.getInt("count"));
                }
                rsMobs.close();
            }
            rs.close();
            ps.close();
            pse.close();

            if (channelserver) {

                ret.monsterbook = new MonsterBook();
                ret.monsterbook.loadCards(charid);

                ps = con.prepareStatement("SELECT * FROM inventoryslot where characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();

                if (!rs.next()) {
                    rs.close();
                    ps.close();
                    ret.getInventory(MapleInventoryType.EQUIP).setSlotLimit((byte) 32);
                    ret.getInventory(MapleInventoryType.USE).setSlotLimit((byte) 32);
                    ret.getInventory(MapleInventoryType.SETUP).setSlotLimit((byte) 32);
                    ret.getInventory(MapleInventoryType.ETC).setSlotLimit((byte) 32);
                    ret.getInventory(MapleInventoryType.CASH).setSlotLimit((byte) 60);
//                    throw new RuntimeException("No Inventory slot column found in SQL. [inventoryslot]");
                } else {
                    ret.getInventory(MapleInventoryType.EQUIP).setSlotLimit(rs.getByte("equip"));
                    ret.getInventory(MapleInventoryType.USE).setSlotLimit(rs.getByte("use"));
                    ret.getInventory(MapleInventoryType.SETUP).setSlotLimit(rs.getByte("setup"));
                    ret.getInventory(MapleInventoryType.ETC).setSlotLimit(rs.getByte("etc"));
                    ret.getInventory(MapleInventoryType.CASH).setSlotLimit(rs.getByte("cash"));
                }
                ps.close();
                rs.close();

                for (kotlin.Pair<Item, MapleInventoryType> mit : ItemLoader.INVENTORY.loadItems(false, charid).values()) {
                    ret.getInventory(mit.getSecond()).addFromDB(mit.getFirst());
                    if (mit.getFirst().getPet() != null) {
                        ret.pets.add(mit.getFirst().getPet());
                    }
                }

                ps = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
                ps.setInt(1, ret.accountid);
                rs = ps.executeQuery();
                if (rs.next()) {
                    ret.getClient().setAccountName(rs.getString("name"));
                    ret.acash = rs.getInt("ACash");
                    ret.donatecash = rs.getInt("DonateCash");
                    ret.maplepoints = rs.getInt("mPoints");
                    ret.points = rs.getInt("points");
                    ret.vpoints = rs.getInt("vpoints");

//                    if (rs.getTimestamp("lastlogon") != null) {
//                        final Calendar cal = Calendar.getInstance();
//                        cal.setTimeInMillis(rs.getTimestamp("lastlogon").getTime());
//                        if (cal.get(Calendar.DAY_OF_WEEK) + 1 == Calendar.getInstance().get(Calendar.DAY_OF_WEEK)) {
//                            ret.acash += 500;
//                        }
//                    }
                    if (rs.getInt("banned") > 0) {
                        rs.close();
                        ps.close();
                        ret.getClient().getSession().close(true);
                        throw new RuntimeException("Loading a banned character");
                    }
                    rs.close();
                    ps.close();

                    ps = con.prepareStatement("UPDATE accounts SET lastlogon = CURRENT_TIMESTAMP() WHERE id = ?");
                    ps.setInt(1, ret.accountid);
                    ps.executeUpdate();
                } else {
                    rs.close();
                }
                ps.close();

                ps = con.prepareStatement("SELECT * FROM questinfo WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();

                while (rs.next()) {
                    ret.questinfo.put(rs.getInt("quest"), rs.getString("customData"));
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT skillid, skilllevel, masterlevel, expiration FROM skills WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                Skill skil;
                while (rs.next()) {
                    final int skid = rs.getInt("skillid");
                    skil = SkillFactory.getSkill(skid);
                    int skl = rs.getInt("skilllevel");
                    byte msl = rs.getByte("masterlevel");
                    if (skil != null && GameConstants.isApplicableSkill(skid)) {
                        if (skl > skil.getMaxLevel() && skid < 92000000) {
                            if (!skil.isBeginnerSkill() && skil.canBeLearnedBy(ret.job) && !skil.isSpecialSkill()) {
                                ret.remainingSp[GameConstants.getSkillBookForSkill(skid)] += (skl - skil.getMaxLevel());
                            }
                            skl = (byte) skil.getMaxLevel();
                        }
                        if (msl > skil.getMaxLevel()) {
                            msl = (byte) skil.getMaxLevel();
                        }
                        ret.skills.put(skil, new SkillEntry(skl, msl, rs.getLong("expiration")));
                    } else if (skil == null) { //doesnt. exist. e.g. bb
                        if (!GameConstants.isBeginnerJob(skid / 10000) && skid / 10000 != 900 && skid / 10000 != 800 && skid / 10000 != 9000) {
                            ret.remainingSp[GameConstants.getSkillBookForSkill(skid)] += skl;
                        }
                    }
                }
                rs.close();
                ps.close();

                ret.expirationTask(false, true); //do it now

                /*if (!compensate_previousSP) {
                 for (Entry<Skill, SkillEntry> skill : ret.skills.entrySet()) {
                 if (!skill.getKey().isBeginnerSkill() && !skill.getKey().isSpecialSkill()) {
                 ret.remainingSp[GameConstants.getSkillBookForSkill(skill.getKey().getId())] += skill.getValue().skillevel;
                 skill.getValue().skillevel = 0;
                 }
                 }
                 ret.setQuestAdd(MapleQuest.getInstance(170000), (byte) 0, null); //set it so never again
                 }*/
                // END
                ps = con.prepareStatement("SELECT * FROM skillmacros WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                int position;
                while (rs.next()) {
                    position = rs.getInt("position");
                    SkillMacro macro = new SkillMacro(rs.getInt("skill1"), rs.getInt("skill2"), rs.getInt("skill3"), rs.getString("name"), rs.getInt("shout"), position);
                    ret.skillMacros[position] = macro;
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT `key`,`type`,`action` FROM keymap WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();

                final Map<Integer, Pair<Byte, Integer>> keyb = ret.keylayout.Layout();
                while (rs.next()) {
                    keyb.put(Integer.valueOf(rs.getInt("key")), new Pair<Byte, Integer>(rs.getByte("type"), rs.getInt("action")));
                }
                rs.close();
                ps.close();
                ret.keylayout.unchanged();

                ps = con.prepareStatement("SELECT `locationtype`,`map` FROM savedlocations WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                while (rs.next()) {
                    ret.savedLocations[rs.getInt("locationtype")] = rs.getInt("map");
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT `characterid_to`,`when` FROM famelog WHERE characterid = ? AND DATEDIFF(NOW(),`when`) < 30");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                ret.lastfametime = 0;
                ret.lastmonthfameids = new ArrayList<Integer>(31);
                while (rs.next()) {
                    ret.lastfametime = Math.max(ret.lastfametime, rs.getTimestamp("when").getTime());
                    ret.lastmonthfameids.add(Integer.valueOf(rs.getInt("characterid_to")));
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT `accid_to`,`when` FROM battlelog WHERE accid = ? AND DATEDIFF(NOW(),`when`) < 30");
                ps.setInt(1, ret.accountid);
                rs = ps.executeQuery();
                ret.lastmonthbattleids = new ArrayList<Integer>();
                while (rs.next()) {
                    ret.lastmonthbattleids.add(Integer.valueOf(rs.getInt("accid_to")));
                }
                rs.close();
                ps.close();

                ret.buddylist.loadFromDB(charid);
                ret.storage = MapleStorage.loadStorage(ret.accountid);
                ret.cs = new CashShop(ret.accountid, charid, ret.getJob());

                ps = con.prepareStatement("SELECT sn FROM wishlist WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                int i = 0;
                while (rs.next()) {
                    ret.wishlist[i] = rs.getInt("sn");
                    i++;
                }
                while (i < 10) {
                    ret.wishlist[i] = 0;
                    i++;
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT mapid FROM trocklocations WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                int r = 0;
                while (rs.next()) {
                    ret.rocks[r] = rs.getInt("mapid");
                    r++;
                }
                while (r < 10) {
                    ret.rocks[r] = 999999999;
                    r++;
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT mapid FROM regrocklocations WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                r = 0;
                while (rs.next()) {
                    ret.regrocks[r] = rs.getInt("mapid");
                    r++;
                }
                while (r < 5) {
                    ret.regrocks[r] = 999999999;
                    r++;
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT mapid FROM hyperrocklocations WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                r = 0;
                while (rs.next()) {
                    ret.hyperrocks[r] = rs.getInt("mapid");
                    r++;
                }
                while (r < 13) {
                    ret.hyperrocks[r] = 999999999;
                    r++;
                }
                rs.close();
                ps.close();

                ps = con.prepareStatement("SELECT * FROM mountdata WHERE characterid = ?");
                ps.setInt(1, charid);
                rs = ps.executeQuery();
                if (!rs.next()) {
                    PreparedStatement dps = con.prepareStatement("INSERT INTO mountdata (characterid, `Level`, `Exp`, `Fatigue`) VALUES (?, ?, ?, ?)");
                    dps.setInt(1, ret.id);
                    dps.setByte(2, (byte) 1);
                    dps.setInt(3, 0);
                    dps.setByte(4, (byte) 0);
                    dps.execute();
                    dps.close();
                    ps.close();
                    rs.close();
                    ps = con.prepareStatement("SELECT * FROM mountdata WHERE characterid = ?");
                    ps.setInt(1, charid);
                    rs = ps.executeQuery();
                    rs.next();
//                    throw new RuntimeException("No mount data found on SQL column");
                }
                final Item mount = ret.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -23);
                ret.mount = new MapleMount(ret, mount != null ? mount.getItemId() : 0, 1004, rs.getByte("Fatigue"), rs.getByte("Level"), rs.getInt("Exp"));
                ps.close();
                rs.close();

                ret.stats.recalcLocalStats(true, ret);
            } else { // Not channel server
                for (kotlin.Pair<Item, MapleInventoryType> mit : ItemLoader.INVENTORY.loadItems(true, charid).values()) {
                    ret.getInventory(mit.getSecond()).addFromDB(mit.getFirst());
                }
            }
        } catch (Exception ess) {
            ess.printStackTrace();
            System.out.println("Failed to load character..");
            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, ess);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (pse != null) {
                try {
                    pse.close();
                } catch (Exception e) {
                }
            }
        }
        return ret;
    }

    public static void saveNewCharToDB(final MapleCharacter chr, final JobType type, short db) {
        Connection con = null;
        PreparedStatement ps = null;
        PreparedStatement pse = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            con.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
            con.setAutoCommit(false);

            ps = con.prepareStatement("INSERT INTO characters (level, str, dex, luk, `int`, hp, mp, maxhp, maxmp, sp, ap, skincolor, gender, job, hair, face, map, meso, party, buddyCapacity, pets, subcategory, accountid, name, world, locationed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", DatabaseConnection.RETURN_GENERATED_KEYS);
            ps.setInt(1, chr.level); // Level
            final PlayerStats stat = chr.stats;
            ps.setShort(2, stat.getStr()); // Str
            ps.setShort(3, stat.getDex()); // Dex
            ps.setShort(4, stat.getLuk()); // Luk
            ps.setShort(5, stat.getInt()); // Int
            ps.setInt(6, stat.getHp()); // HP
            ps.setInt(7, stat.getMp());
            ps.setInt(8, stat.getMaxHp()); // MP
            ps.setInt(9, stat.getMaxMp());
            final StringBuilder sps = new StringBuilder();
            for (int i = 0; i < chr.remainingSp.length; i++) {
                sps.append(chr.remainingSp[i]);
                sps.append(",");
            }
            final String sp = sps.toString();
            ps.setString(10, sp.substring(0, sp.length() - 1));
            ps.setShort(11, (short) chr.remainingAp); // Remaining AP
            ps.setByte(12, chr.skinColor);
            ps.setByte(13, chr.gender);
            ps.setShort(14, chr.job);
            ps.setInt(15, chr.hair);
            ps.setInt(26, chr.locationed);
            ps.setInt(16, chr.face);
            ps.setInt(17, 000000000);
            ps.setInt(18, chr.meso); // Meso
            ps.setInt(19, -1); // Party
            ps.setByte(20, chr.buddylist.getCapacity()); // Buddylist
            ps.setString(21, "-1,-1,-1");
            ps.setInt(22, db); //for now
            ps.setInt(23, chr.getAccountID());
            ps.setString(24, chr.name);
            ps.setByte(25, chr.world);
            ps.executeUpdate();

            rs = ps.getGeneratedKeys();
            if (rs.next()) {
                chr.id = rs.getInt(1);
            } else {
                ps.close();
                rs.close();
                throw new DatabaseException("Inserting char failed.");
            }
            ps.close();
            rs.close();
            ps = con.prepareStatement("INSERT INTO queststatus (`queststatusid`, `characterid`, `quest`, `status`, `time`, `forfeited`, `customData`) VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)", DatabaseConnection.RETURN_GENERATED_KEYS);
            pse = con.prepareStatement("INSERT INTO queststatusmobs VALUES (DEFAULT, ?, ?, ?)");
            ps.setInt(1, chr.id);
            for (final MapleQuestStatus q : chr.quests.values()) {
                ps.setInt(2, q.getQuest().getId());
                ps.setInt(3, q.getStatus());
                ps.setInt(4, (int) (q.getCompletionTime() / 1000));
                ps.setInt(5, q.getForfeited());
                ps.setString(6, q.getCustomData());
                ps.execute();
                rs = ps.getGeneratedKeys();
                if (q.hasMobKills()) {
                    rs.next();
                    for (int mob : q.getMobKills().keySet()) {
                        pse.setInt(1, rs.getInt(1));
                        pse.setInt(2, mob);
                        pse.setInt(3, q.getMobKills(mob));
                        pse.execute();
                    }
                }
                rs.close();
            }
            ps.close();
            pse.close();

            ps = con.prepareStatement("INSERT INTO skills (characterid, skillid, skilllevel, masterlevel, expiration) VALUES (?, ?, ?, ?, ?)");
            ps.setInt(1, chr.id);

            for (final Entry<Skill, SkillEntry> skill : chr.skills.entrySet()) {
                if (GameConstants.isApplicableSkill(skill.getKey().getId())) { //do not save additional skills
                    ps.setInt(2, skill.getKey().getId());
                    ps.setInt(3, skill.getValue().skillevel);
                    ps.setByte(4, skill.getValue().masterlevel);
                    ps.setLong(5, skill.getValue().expiration);
                    ps.execute();
                }
            }
            ps.close();

            ps = con.prepareStatement("INSERT INTO inventoryslot (characterid, `equip`, `use`, `setup`, `etc`, `cash`) VALUES (?, ?, ?, ?, ?, ?)");
            ps.setInt(1, chr.id);
            ps.setByte(2, (byte) 32); // Eq
            ps.setByte(3, (byte) 32); // Use
            ps.setByte(4, (byte) 32); // Setup
            ps.setByte(5, (byte) 32); // ETC
            ps.setByte(6, (byte) 60); // Cash
            ps.execute();
            ps.close();

            ps = con.prepareStatement("INSERT INTO mountdata (characterid, `Level`, `Exp`, `Fatigue`) VALUES (?, ?, ?, ?)");
            ps.setInt(1, chr.id);
            ps.setByte(2, (byte) 1);
            ps.setInt(3, 0);
            ps.setByte(4, (byte) 0);
            ps.execute();
            ps.close();

            List<kotlin.Pair<Item, MapleInventoryType>> listing = new ArrayList<kotlin.Pair<Item, MapleInventoryType>>();
            for (final MapleInventory iv : chr.inventory) {
                for (final Item item : iv.list()) {
                    listing.add(new kotlin.Pair<Item, MapleInventoryType>(item, iv.getType()));
                }
            }
            ItemLoader.INVENTORY.saveItems(listing, con, chr.id);

            con.commit();
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
            e.printStackTrace();
            System.err.println("[charsave] Error saving character data");
            try {
                con.rollback();
            } catch (SQLException ex) {
                FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, ex);
                ex.printStackTrace();
                System.err.println("[charsave] Error Rolling Back");
            }
        } finally {
            try {
                con.setAutoCommit(true);
                con.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            } catch (SQLException e) {
                FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
                e.printStackTrace();
                System.err.println("[charsave] Error going back to autocommit mode");
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (pse != null) {
                try {
                    pse.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public void saveToDB(boolean dc, boolean fromcs) {
        Connection con = null;

        PreparedStatement ps = null;
        PreparedStatement pse = null;
        ResultSet rs = null;

        try {
            con = DatabaseConnection.getConnection();
            con.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
            con.setAutoCommit(false);

            ps = con.prepareStatement("UPDATE characters SET level = ?, fame = ?, str = ?, dex = ?, luk = ?, `int` = ?, exp = ?, hp = ?, mp = ?, maxhp = ?, maxmp = ?, sp = ?, ap = ?, gm = ?, skincolor = ?, gender = ?, job = ?, hair = ?, face = ?, map = ?, meso = ?, hpApUsed = ?, spawnpoint = ?, party = ?, buddyCapacity = ?, pets = ?, subcategory = ?, marriageId = ?, currentrep = ?, totalrep = ?, mbookcover = ?, name = ? WHERE id = ?", DatabaseConnection.RETURN_GENERATED_KEYS);
            ps.setInt(1, level);
            ps.setInt(2, fame);
            ps.setShort(3, stats.getStr());
            ps.setShort(4, stats.getDex());
            ps.setShort(5, stats.getLuk());
            ps.setShort(6, stats.getInt());
            ps.setInt(7, (level >= 200) ? 0 : exp);
            ps.setInt(8, stats.getHp() < 1 ? 50 : stats.getHp());
            ps.setInt(9, stats.getMp());
            ps.setInt(10, stats.getMaxHp());
            ps.setInt(11, stats.getMaxMp());
            final StringBuilder sps = new StringBuilder();
            for (int i = 0; i < remainingSp.length; i++) {
                sps.append(remainingSp[i]);
                sps.append(",");
            }
            final String sp = sps.toString();
            ps.setString(12, sp.substring(0, sp.length() - 1));
            ps.setShort(13, remainingAp);
            ps.setByte(14, gmLevel);
            ps.setByte(15, skinColor);
            ps.setByte(16, gender);
            ps.setShort(17, job);
            ps.setInt(18, hair);
            ps.setInt(19, face);
            if (!fromcs && map != null) {
                if (map.getForcedReturnId() != 999999999 && map.getForcedReturnMap() != null) {
                    ps.setInt(20, map.getForcedReturnId());
                } else if (mapid >= 925010000 && mapid <= 925010300) {
                    ps.setInt(20, 120000104);
                } else {
                    ps.setInt(20, stats.getHp() < 1 ? map.getReturnMapId() : map.getId());
                }
            } else {
                ps.setInt(20, mapid);
            }
            ps.setInt(21, meso);
            ps.setShort(22, hpApUsed);
            if (map == null) {
                ps.setByte(23, (byte) 0);
            } else {
                final MaplePortal closest = map.findClosestSpawnpoint(getTruePosition());
                ps.setByte(23, (byte) (closest != null ? closest.getId() : 0));
            }
            ps.setInt(24, party == null ? -1 : party.getId());
            ps.setShort(25, buddylist.getCapacity());
            final StringBuilder petz = new StringBuilder();
            int petLength = 0;
            for (final MaplePet pet : pets) {
                if (pet.getSummoned()) {
                    pet.saveToDb();
                    petz.append(pet.getInventoryPosition());
                    petz.append(",");
                    petLength++;
                }
            }
            while (petLength < 3) {
                petz.append("-1,");
                petLength++;
            }
            final String petstring = petz.toString();
            ps.setString(26, petstring.substring(0, petstring.length() - 1));
            ps.setByte(27, subcategory);
            ps.setInt(28, marriageId);
            ps.setInt(29, currentrep);
            ps.setInt(30, totalrep);
            ps.setInt(31, bookCover);
            ps.setString(32, name);
            ps.setInt(33, id);
            if (ps.executeUpdate() < 1) {
                ps.close();
                throw new DatabaseException("Character not in database (" + id + ")");
            }
            ps.close();
            if (changed_skillmacros) {
                deleteWhereCharacterId(con, "DELETE FROM skillmacros WHERE characterid = ?");
                for (int i = 0; i < 5; i++) {
                    final SkillMacro macro = skillMacros[i];
                    if (macro != null) {
                        ps = con.prepareStatement("INSERT INTO skillmacros (characterid, skill1, skill2, skill3, name, shout, position) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        ps.setInt(1, id);
                        ps.setInt(2, macro.getSkill1());
                        ps.setInt(3, macro.getSkill2());
                        ps.setInt(4, macro.getSkill3());
                        ps.setString(5, macro.getName());
                        ps.setInt(6, macro.getShout());
                        ps.setInt(7, i);
                        ps.execute();
                        ps.close();
                    }
                }
            }

            deleteWhereCharacterId(con, "DELETE FROM inventoryslot WHERE characterid = ?");
            ps = con.prepareStatement("INSERT INTO inventoryslot (characterid, `equip`, `use`, `setup`, `etc`, `cash`) VALUES (?, ?, ?, ?, ?, ?)");
            ps.setInt(1, id);
            ps.setByte(2, getInventory(MapleInventoryType.EQUIP).getSlotLimit());
            ps.setByte(3, getInventory(MapleInventoryType.USE).getSlotLimit());
            ps.setByte(4, getInventory(MapleInventoryType.SETUP).getSlotLimit());
            ps.setByte(5, getInventory(MapleInventoryType.ETC).getSlotLimit());
            ps.setByte(6, getInventory(MapleInventoryType.CASH).getSlotLimit());
            ps.execute();
            ps.close();

            saveInventory(con);

            if (changed_questinfo) {
                deleteWhereCharacterId(con, "DELETE FROM questinfo WHERE characterid = ?");
                ps = con.prepareStatement("INSERT INTO questinfo (`characterid`, `quest`, `customData`) VALUES (?, ?, ?)");
                ps.setInt(1, id);
                for (final Entry<Integer, String> q : questinfo.entrySet()) {
                    ps.setInt(2, q.getKey());
                    ps.setString(3, q.getValue());
                    ps.execute();
                }
                ps.close();
            }

            deleteWhereCharacterId(con, "DELETE FROM queststatus WHERE characterid = ?");
            ps = con.prepareStatement("INSERT INTO queststatus (`queststatusid`, `characterid`, `quest`, `status`, `time`, `forfeited`, `customData`) VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)", DatabaseConnection.RETURN_GENERATED_KEYS);
            pse = con.prepareStatement("INSERT INTO queststatusmobs VALUES (DEFAULT, ?, ?, ?)");
            ps.setInt(1, id);
            for (final MapleQuestStatus q : quests.values()) {
                ps.setInt(2, q.getQuest().getId());
                ps.setInt(3, q.getStatus());
                ps.setInt(4, (int) (q.getCompletionTime() / 1000));
                ps.setInt(5, q.getForfeited());
                ps.setString(6, q.getCustomData());
                ps.execute();
                rs = ps.getGeneratedKeys();
                if (q.hasMobKills()) {
                    rs.next();
                    for (int mob : q.getMobKills().keySet()) {
                        pse.setInt(1, rs.getInt(1));
                        pse.setInt(2, mob);
                        pse.setInt(3, q.getMobKills(mob));
                        pse.execute();
                    }
                }
                rs.close();
            }
            ps.close();
            pse.close();

            if (changed_skills) {
                deleteWhereCharacterId(con, "DELETE FROM skills WHERE characterid = ?");
                ps = con.prepareStatement("INSERT INTO skills (characterid, skillid, skilllevel, masterlevel, expiration) VALUES (?, ?, ?, ?, ?)");
                ps.setInt(1, id);

                for (final Entry<Skill, SkillEntry> skill : skills.entrySet()) {
                    if (GameConstants.isApplicableSkill(skill.getKey().getId())) { //do not save additional skills
                        ps.setInt(2, skill.getKey().getId());
                        ps.setInt(3, skill.getValue().skillevel);
                        ps.setByte(4, skill.getValue().masterlevel);
                        ps.setLong(5, skill.getValue().expiration);
                        ps.execute();
                    }
                }
                ps.close();
            }

            List<MapleCoolDownValueHolder> cd = getCooldowns();
            if (dc && cd.size() > 0) {
                ps = con.prepareStatement("INSERT INTO skills_cooldowns (charid, SkillID, StartTime, length) VALUES (?, ?, ?, ?)");
                ps.setInt(1, getId());
                for (final MapleCoolDownValueHolder cooling : cd) {
                    ps.setInt(2, cooling.skillId);
                    ps.setLong(3, cooling.startTime);
                    ps.setLong(4, cooling.length);
                    ps.execute();
                }
                ps.close();
            }

            if (changed_savedlocations) {
                deleteWhereCharacterId(con, "DELETE FROM savedlocations WHERE characterid = ?");
                ps = con.prepareStatement("INSERT INTO savedlocations (characterid, `locationtype`, `map`) VALUES (?, ?, ?)");
                ps.setInt(1, id);
                for (final SavedLocationType savedLocationType : SavedLocationType.values()) {
                    if (savedLocations[savedLocationType.getValue()] != -1) {
                        ps.setInt(2, savedLocationType.getValue());
                        ps.setInt(3, savedLocations[savedLocationType.getValue()]);
                        ps.execute();
                    }
                }
                ps.close();
            }

            if (changed_achievements) {
                ps = con.prepareStatement("DELETE FROM achievements WHERE accountid = ?");
                ps.setInt(1, accountid);
                ps.executeUpdate();
                ps.close();
                ps = con.prepareStatement("INSERT INTO achievements(charid, achievementid, accountid) VALUES(?, ?, ?)");
                for (Integer achid : finishedAchievements) {
                    ps.setInt(1, id);
                    ps.setInt(2, achid);
                    ps.setInt(3, accountid);
                    ps.execute();
                }
                ps.close();
            }

            if (changed_reports) {
                deleteWhereCharacterId(con, "DELETE FROM reports WHERE characterid = ?");
                ps = con.prepareStatement("INSERT INTO reports VALUES(DEFAULT, ?, ?, ?)");
                for (Entry<ReportType, Integer> achid : reports.entrySet()) {
                    ps.setInt(1, id);
                    ps.setByte(2, achid.getKey().getI());
                    ps.setInt(3, achid.getValue());
                    ps.execute();
                }
                ps.close();
            }

            if (buddylist.getChanged()) {
                deleteWhereCharacterId(con, "DELETE FROM buddies WHERE characterid = ?");
                ps = con.prepareStatement("INSERT INTO buddies (characterid, `buddyid`, `pending`, `groupname`) VALUES (?, ?, ?, ?)");
                ps.setInt(1, id);
                for (BuddyListEntry entry : buddylist.getBuddiesValues()) {
                    ps.setInt(2, entry.getCharacterId());
                    ps.setInt(3, entry.getVisible() ? 0 : 1);
                    ps.setString(4, entry.getGroup());
                    ps.execute();
                }
                ps.close();
                buddylist.setChanged(false);
            }

            ps = con.prepareStatement("UPDATE accounts SET `DonateCash` = ?, `ACash` = ?, `mPoints` = ?, `points` = ?, `vpoints` = ? WHERE id = ?");
            ps.setInt(1, donatecash);
            ps.setInt(2, acash);
            ps.setInt(3, maplepoints);
            ps.setInt(4, points);
            ps.setInt(5, vpoints);
            ps.setInt(6, client.getAccID());
            ps.executeUpdate();
            ps.close();

            if (storage != null) {
                storage.saveToDB();
            }
            if (cs != null) {
                cs.save(con);
            }
            //PlayerNPC.updateByCharId(this);
            keylayout.saveKeys(id, con);
            mount.saveMount(id, con);
            monsterbook.saveCards(id, con);

            if (changed_wishlist) {
                deleteWhereCharacterId(con, "DELETE FROM wishlist WHERE characterid = ?");
                for (int i = 0; i < getWishlistSize(); i++) {
                    ps = con.prepareStatement("INSERT INTO wishlist(characterid, sn) VALUES(?, ?) ");
                    ps.setInt(1, getId());
                    ps.setInt(2, wishlist[i]);
                    ps.execute();
                    ps.close();
                }
            }
            if (changed_trocklocations) {
                deleteWhereCharacterId(con, "DELETE FROM trocklocations WHERE characterid = ?");
                for (int i = 0; i < rocks.length; i++) {
                    if (rocks[i] != 999999999) {
                        ps = con.prepareStatement("INSERT INTO trocklocations(characterid, mapid) VALUES(?, ?) ");
                        ps.setInt(1, getId());
                        ps.setInt(2, rocks[i]);
                        ps.execute();
                        ps.close();
                    }
                }
            }

            if (changed_regrocklocations) {
                deleteWhereCharacterId(con, "DELETE FROM regrocklocations WHERE characterid = ?");
                for (int i = 0; i < regrocks.length; i++) {
                    if (regrocks[i] != 999999999) {
                        ps = con.prepareStatement("INSERT INTO regrocklocations(characterid, mapid) VALUES(?, ?) ");
                        ps.setInt(1, getId());
                        ps.setInt(2, regrocks[i]);
                        ps.execute();
                        ps.close();
                    }
                }
            }
            if (changed_hyperrocklocations) {
                deleteWhereCharacterId(con, "DELETE FROM hyperrocklocations WHERE characterid = ?");
                for (int i = 0; i < hyperrocks.length; i++) {
                    if (hyperrocks[i] != 999999999) {
                        ps = con.prepareStatement("INSERT INTO hyperrocklocations(characterid, mapid) VALUES(?, ?) ");
                        ps.setInt(1, getId());
                        ps.setInt(2, hyperrocks[i]);
                        ps.execute();
                        ps.close();
                    }
                }
            }
            changed_wishlist = false;
            changed_trocklocations = false;
            changed_regrocklocations = false;
            changed_hyperrocklocations = false;
            changed_skillmacros = false;
            changed_savedlocations = false;
            changed_pokemon = false;
            changed_questinfo = false;
            changed_achievements = false;
            changed_skills = false;
            changed_reports = false;
            con.commit();
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
            e.printStackTrace();
            System.err.println(MapleClient.getLogMessage(this, "[charsave] Error saving character data") + e);
            try {
                con.rollback();
            } catch (SQLException ex) {
                FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, ex);
                System.err.println(MapleClient.getLogMessage(this, "[charsave] Error Rolling Back") + e);
            }
        } finally {
            try {
                con.setAutoCommit(true);
                con.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
            } catch (SQLException e) {
                FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
                System.err.println(MapleClient.getLogMessage(this, "[charsave] Error going back to autocommit mode") + e);
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (pse != null) {
                try {
                    pse.close();
                } catch (Exception e) {
                }
            }
        }
    }

    private void deleteWhereCharacterId(Connection con, String sql) throws SQLException {
        deleteWhereCharacterId(con, sql, id);
    }

    public static void deleteWhereCharacterId(Connection con, String sql, int id) throws SQLException {
        Connection conn = null;
        if (con == null) {
            conn = con;
        }
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setInt(1, id);
        ps.executeUpdate();
        ps.close();
    }

    public static void deleteWhereCharacterId_NoLock(Connection con, String sql, int id) throws SQLException {
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setInt(1, id);
        ps.execute();
        ps.close();
    }

    public void saveInventory(Connection con) throws SQLException {
        List<kotlin.Pair<Item, MapleInventoryType>> listing = new ArrayList<kotlin.Pair<Item, MapleInventoryType>>();
        for (final MapleInventory iv : inventory) {
            for (final Item item : iv.list()) {
                listing.add(new kotlin.Pair<Item, MapleInventoryType>(item, iv.getType()));
            }
        }
        ItemLoader.INVENTORY.saveItems(listing, con, id);
    }

    public final PlayerStats getStat() {
        return stats;
    }

    public final void QuestInfoPacket(final tools.data.MaplePacketLittleEndianWriter mplew) {
        mplew.writeShort(questinfo.size());

        for (final Entry<Integer, String> q : questinfo.entrySet()) {
            mplew.writeShort(q.getKey());
            mplew.writeMapleAsciiString(q.getValue() == null ? "" : q.getValue());
        }
    }

    public final void updateInfoQuest(final int questid, final String data) {
        questinfo.put(questid, data);
        changed_questinfo = true;
//        if (questid == 29003) { //fucking hard coding..
//        } 
//        else {
        client.getSession().write(MaplePacketCreator.updateInfoQuest(questid, data));
//        }
    }

    public final String getInfoQuest(final int questid) {
        if (questinfo.containsKey(questid)) {
            return questinfo.get(questid);
        }
        return "";
    }

    public final int getNumQuest() {
        int i = 0;
        for (final MapleQuestStatus q : quests.values()) {
            if (q.getStatus() == 2 && !(q.isCustom())) {
                i++;
            }
        }
        return i;
    }

    public final byte getQuestStatus(final int quest) {
        final MapleQuest qq = MapleQuest.getInstance(quest);
        if (getQuestNoAdd(qq) == null) {
            return 0;
        }
        return getQuestNoAdd(qq).getStatus();
    }

    public final MapleQuestStatus getQuest(final MapleQuest quest) {
        if (!quests.containsKey(quest)) {
            return new MapleQuestStatus(quest, (byte) 0);
        }
        return quests.get(quest);
    }

    public final void setQuestAdd(final MapleQuest quest, final byte status, final String customData) {
        if (!quests.containsKey(quest)) {
            final MapleQuestStatus stat = new MapleQuestStatus(quest, status);
            stat.setCustomData(customData);
            quests.put(quest, stat);
        }
    }

    public final MapleQuestStatus getQuestNAdd(final MapleQuest quest) {
        if (!quests.containsKey(quest)) {
            final MapleQuestStatus status = new MapleQuestStatus(quest, (byte) 0);
            quests.put(quest, status);
            return status;
        }
        return quests.get(quest);
    }

    public final MapleQuestStatus getQuestNoAdd(final MapleQuest quest) {
        return quests.get(quest);
    }

    public final MapleQuestStatus getQuestRemove(final MapleQuest quest) {
        return quests.remove(quest);
    }

    public final void updateQuest(final MapleQuestStatus quest) {
        updateQuest(quest, false);
    }

    public void warpHere(String text) {
        MapleCharacter victim = getClient().getChannelServer().getPlayerStorage().getCharacterByName(text);
        victim.changeMap(getMap(), getMap().findClosestPortal(getTruePosition()));
    }

    public final void updateQuest(final MapleQuestStatus quest, final boolean update) {

        quests.put(quest.getQuest(), quest);
        if (!(quest.isCustom())) {
            client.getSession().write(MaplePacketCreator.updateQuest(quest));
            if (quest.getStatus() >= 1 && !update && quest.getNpc() != 0) {
                client.getSession().write(MaplePacketCreator.updateQuestInfo(this, quest.getQuest().getId(), quest.getNpc(), (byte) 8));
            }
        }
    }

    public final Map<Integer, String> getInfoQuest_Map() {
        return questinfo;
    }

    public final Map<MapleQuest, MapleQuestStatus> getQuest_Map() {
        return quests;
    }

    public Integer getBuffedValue(MapleBuffStat effect) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        return mbsvh == null ? null : Integer.valueOf(mbsvh.getValue());
    }

    public final Integer getBuffedSkill_X(final MapleBuffStat effect) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        if (mbsvh == null) {
            return null;
        }
        return mbsvh.getEffect().getX();
    }

    public final Integer getBuffedSkill_Y(final MapleBuffStat effect) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        if (mbsvh == null) {
            return null;
        }
        return mbsvh.getEffect().getY();
    }

    public boolean isBuffFrom(MapleBuffStat stat, Skill skill) {
        final MapleBuffStatValueHolder mbsvh = effects.get(stat);
        if (mbsvh == null || mbsvh.getEffect() == null) {
            return false;
        }
        return mbsvh.getEffect().isSkill() && mbsvh.getEffect().getSourceId() == skill.getId();
    }

    public int getBuffSource(MapleBuffStat stat) {
        final MapleBuffStatValueHolder mbsvh = effects.get(stat);
        return mbsvh == null ? -1 : mbsvh.getEffect().getSourceId();
    }

    public int getTrueBuffSource(MapleBuffStat stat) {
        final MapleBuffStatValueHolder mbsvh = effects.get(stat);
        return mbsvh == null ? -1 : (mbsvh.getEffect().isSkill() ? mbsvh.getEffect().getSourceId() : -mbsvh.getEffect().getSourceId());
    }

    public int getItemQuantity(int itemid, boolean checkEquipped) {
        int possesed = inventory[GameConstants.getInventoryType(itemid).ordinal()].countById(itemid);
        if (checkEquipped) {
            possesed += inventory[MapleInventoryType.EQUIPPED.ordinal()].countById(itemid);
        }
        return possesed;
    }

    public void setBuffedValue(MapleBuffStat effect, int value) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        if (mbsvh == null) {
            return;
        }
        mbsvh.setValue(value);
    }

    public void setSchedule(MapleBuffStat effect, ScheduledFuture<?> sched) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        if (mbsvh == null) {
            return;
        }
        mbsvh.getSchedule().cancel(false);
        mbsvh.setSchedule(sched);
    }

    public Long getBuffedStarttime(MapleBuffStat effect) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        return mbsvh == null ? null : mbsvh.getStartTime();
    }

    public MapleStatEffect getStatForBuff(MapleBuffStat effect) {
        final MapleBuffStatValueHolder mbsvh = effects.get(effect);
        return mbsvh == null ? null : mbsvh.getEffect();
    }

    public void doDragonBlood() {
        final MapleStatEffect bloodEffect = getStatForBuff(MapleBuffStat.DRAGONBLOOD);
        if (bloodEffect == null) {
            lastDragonBloodTime = 0;
            return;
        }
        prepareDragonBlood();
        if (stats.getHp() - bloodEffect.getX() <= 1) {
            cancelBuffStats(true, MapleBuffStat.DRAGONBLOOD);
        } else {
            addHP(-bloodEffect.getX());
            client.getSession().write(MaplePacketCreator.showOwnBuffEffect(bloodEffect.getSourceId(), 2, getLevel(), bloodEffect.getLevel()));
            map.broadcastMessage(MapleCharacter.this, MaplePacketCreator.showBuffeffect(getId(), bloodEffect.getSourceId(), 2, getLevel(), bloodEffect.getLevel()), false);
        }
    }

    public void doBeholderHealing() {
        if (getBuffSource(MapleBuffStat.SUMMON) != 1321007) {//beholder
            return;
        }
        Skill bHealing = SkillFactory.getSkill(1320008);
        int bHealingLvl = getSkillLevel(bHealing);
        if (bHealingLvl > 0) {
            final MapleStatEffect healEffect = bHealing.getEffect(bHealingLvl);
            int healInterval = healEffect.getX() * 1000;
            if (lastBeholderHealTime + healInterval < System.currentTimeMillis()
                    && getStat().getHp() + healEffect.getHp() <= getStat().getCurrentMaxHp()) {
                addHP(healEffect.getHp());
                getMap().broadcastMessage(this, MaplePacketCreator.summonSkill(id, 1321007, 5), getTruePosition());
                getMap().broadcastMessage(this, MaplePacketCreator.showBuffeffect(id, 1321007, 2, level, bHealingLvl), false);
                getClient().getSession().write(MaplePacketCreator.showOwnBuffEffect(1321007, 2, level, bHealingLvl));
                lastBeholderHealTime = System.currentTimeMillis();
            }
        }
    }

    public boolean canBeholderBuff() {
        if (lastBeholderBuffTime + 9000 < System.currentTimeMillis()) { //time safe
            lastBeholderBuffTime = System.currentTimeMillis();
            return true;
        }
        return false;
    }

    public final boolean canBlood(long now) {
        return lastDragonBloodTime > 0 && lastDragonBloodTime + 4000 < now;
    }

    private void prepareDragonBlood() {
        lastDragonBloodTime = System.currentTimeMillis();
    }

    public void doRecovery() {
        MapleStatEffect bloodEffect = getStatForBuff(MapleBuffStat.RECOVERY);
        if (bloodEffect != null) {
            prepareRecovery();
            if (stats.getHp() >= stats.getCurrentMaxHp()) {
                cancelEffectFromBuffStat(MapleBuffStat.RECOVERY);
            } else {
                healHP(bloodEffect.getX());
            }
        }
    }

    public final boolean canRecover(long now) {
        return lastRecoveryTime > 0 && lastRecoveryTime + 5000 < now;
    }

    private void prepareRecovery() {
        lastRecoveryTime = System.currentTimeMillis();
    }

    public void startMapTimeLimitTask(int time, final MapleMap to) {
        if (time <= 0) { //jail
            time = 1;
        }
        client.getSession().write(MaplePacketCreator.getClock(time));
        final MapleMap ourMap = getMap();
        time *= 1000;
        mapTimeLimitTask = MapTimer.getInstance().register(new Runnable() {
            @Override
            public void run() {
                if (ourMap.getId() == GameConstants.JAIL) {
                    getQuestNAdd(MapleQuest.getInstance(GameConstants.JAIL_TIME)).setCustomData(String.valueOf(System.currentTimeMillis()));
                    getQuestNAdd(MapleQuest.getInstance(GameConstants.JAIL_QUEST)).setCustomData("0"); //release them!
                }
                changeMap(to, to.getPortal(0));
            }
        }, time, time);
    }

    private final MapleMap getWarpMap(final int map) {
        return ChannelServer.getInstance(getClient().getChannel()).getMapFactory().getMap(map);
    }

    public final void warp(final int map) {
        final MapleMap mapz = getWarpMap(map);
        try {
            int overflow = 0;
            while (true) {
                MaplePortal p = mapz.getPortal(Randomizer.nextInt(mapz.getPortals().size()));
                if (p.getName().equals("sp")) {
                    changeMap(mapz, p);
                    break;
                }
                if (overflow >= 30) {
                    changeMap(mapz, mapz.getPortal(0));
                    break;
                }
                overflow++;
            }
        } catch (Exception e) {
            changeMap(mapz, mapz.getPortal(0));
        }
    }

    public final void warp(final int map, final int where) {
        final MapleMap mapz = getWarpMap(map);
        try {
            int overflow = 0;
            while (true) {
                MaplePortal p = mapz.getPortal(Randomizer.nextInt(mapz.getPortals().size()));
                if (overflow >= 30) {
                    changeMap(mapz, mapz.getPortal(where));
                    break;
                }
                overflow++;
            }
        } catch (Exception e) {
            changeMap(mapz, mapz.getPortal(where));
        }
    }

    public boolean canDOT(long now) {
        return lastDOTTime > 0 && lastDOTTime + 8000 < now;
    }

    public boolean hasDOT() {
        return dotHP > 0;
    }

    public void doDOT() {
        addHP(-(dotHP * 4));
        dotHP = 0;
        lastDOTTime = 0;
    }

    public void setDOT(int d, int source, int sourceLevel) {
        this.dotHP = d;
        addHP(-(dotHP * 4));
        map.broadcastMessage(MaplePacketCreator.getPVPMist(id, source, sourceLevel, d));
        lastDOTTime = System.currentTimeMillis();
    }

    public void cancelMapTimeLimitTask() {
        if (mapTimeLimitTask != null) {
            mapTimeLimitTask.cancel(false);
            mapTimeLimitTask = null;
        }
    }

    public int getNeededExp() {
        return GameConstants.getExpNeededForLevel(level);
    }

    public void registerEffect(MapleStatEffect effect, long starttime, ScheduledFuture<?> schedule, int from) {
        registerEffect(effect, starttime, schedule, effect.getStatups(), false, effect.getDuration(), from);
    }

    public void registerEffect(MapleStatEffect effect, long starttime, ScheduledFuture<?> schedule, Map<MapleBuffStat, Integer> statups, boolean silent, final int localDuration, final int cid) {
        if (effect.isHide()) {
            map.broadcastMessage(this, MaplePacketCreator.removePlayerFromMap(getId()), false);
        } else if (effect.isDragonBlood()) {
            prepareDragonBlood();
        } else if (effect.isRecovery()) {
            prepareRecovery();
        } else if (effect.isBerserk()) {
            checkBerserk();
        } else if (effect.isMonsterRiding_()) {
            getMount().startSchedule();
        }
        for (Entry<MapleBuffStat, Integer> statup : statups.entrySet()) {
            int value = statup.getValue().intValue();
            effects.put(statup.getKey(), new MapleBuffStatValueHolder(effect, starttime, schedule, value, localDuration, cid));
        }
        if (!silent) {
            stats.recalcLocalStats(this);
        }
        //System.out.println("Effect registered. Effect: " + effect.getSourceId());
    }

    public List<MapleBuffStat> getBuffStats(final MapleStatEffect effect, final long startTime) {
        final List<MapleBuffStat> bstats = new ArrayList<MapleBuffStat>();
        final Map<MapleBuffStat, MapleBuffStatValueHolder> allBuffs = new EnumMap<MapleBuffStat, MapleBuffStatValueHolder>(effects);
        for (Entry<MapleBuffStat, MapleBuffStatValueHolder> stateffect : allBuffs.entrySet()) {
            final MapleBuffStatValueHolder mbsvh = stateffect.getValue();
            if (mbsvh.getEffect().sameSource(effect) && (startTime == -1 || startTime == mbsvh.getStartTime())) {
                bstats.add(stateffect.getKey());
            }
        }
        return bstats;
    }

    private boolean deregisterBuffStats(List<MapleBuffStat> stats) {
        boolean clonez = false;
        List<MapleBuffStatValueHolder> effectsToCancel = new ArrayList<MapleBuffStatValueHolder>(stats.size());
        for (MapleBuffStat stat : stats) {
            final MapleBuffStatValueHolder mbsvh = effects.remove(stat);
            if (mbsvh != null) {
                boolean addMbsvh = true;
                for (MapleBuffStatValueHolder contained : effectsToCancel) {
                    if (mbsvh.getStartTime() == contained.getStartTime() && contained.getEffect() == mbsvh.getEffect()) {
                        addMbsvh = false;
                    }
                }
                if (addMbsvh) {
                    effectsToCancel.add(mbsvh);
                }
                if (stat == MapleBuffStat.SUMMON || stat == MapleBuffStat.PUPPET) {
                    final int summonId = mbsvh.getEffect().getSourceId();
                    final List<MapleSummon> toRemove = new ArrayList<MapleSummon>();
                    visibleMapObjectsLock.writeLock().lock(); //We need to lock this later on anyway so do it now to prevent deadlocks.
                    summonsLock.writeLock().lock();
                    try {
                        for (MapleSummon summon : summons) {
                            if (summon.getSkill() == summonId) { //removes bots n tots
                                map.broadcastMessage(MaplePacketCreator.removeSummon(summon, true));
                                map.removeMapObject(summon);
                                visibleMapObjects.remove(summon);
                                toRemove.add(summon);
                            }
                        }
                        for (MapleSummon s : toRemove) {
                            summons.remove(s);
                        }
                    } finally {
                        summonsLock.writeLock().unlock();
                        visibleMapObjectsLock.writeLock().unlock(); //lolwut
                    }
                } else if (stat == MapleBuffStat.DRAGONBLOOD) {
                    lastDragonBloodTime = 0;
                } else if (stat == MapleBuffStat.RECOVERY) {
                    lastRecoveryTime = 0;
                }
            }
        }
        for (MapleBuffStatValueHolder cancelEffectCancelTasks : effectsToCancel) {
            if (getBuffStats(cancelEffectCancelTasks.getEffect(), cancelEffectCancelTasks.getStartTime()).size() == 0) {
                if (cancelEffectCancelTasks.getSchedule() != null) {
                    cancelEffectCancelTasks.getSchedule().cancel(false);
                }
            }
        }
        return clonez;
    }

    /**
     * @param effect
     * Buffstats in the StatEffect are deregistered
     * @param startTime
     */
    public void cancelEffect(final MapleStatEffect effect, final long startTime) {
        if (effect == null) {
            return;
        }
        cancelEffect(effect, startTime, effect.getStatups(), true);
    }

    public void cancelEffect(final MapleStatEffect effect, final long startTime, Map<MapleBuffStat, Integer> statups, boolean recalcStat) {
        if (effect == null) {
            return;
        }
        List<MapleBuffStat> buffstats = new ArrayList<MapleBuffStat>(statups.keySet());

        if (buffstats.size() <= 0) {
            return;
        }
//        if (effect.isInfinity() && getBuffedValue(MapleBuffStat.INFINITY) != null) { //before
//            int duration = Math.max(effect.getDuration(), effect.alchemistModifyVal(this, effect.getDuration(), false));
//            final long start = getBuffedStarttime(MapleBuffStat.INFINITY);
//            duration += (int) ((start - System.currentTimeMillis()));
//            if (duration > 0) {
//                final int neworbcount = getBuffedValue(MapleBuffStat.INFINITY) + effect.getDamage();
//                final Map<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
//                stat.put(MapleBuffStat.INFINITY, neworbcount);
//                setBuffedValue(MapleBuffStat.INFINITY, neworbcount);
//                client.getSession().write(MaplePacketCreator.giveBuff(effect.getSourceId(), duration, stat, effect));
//                addHP((int) (effect.getHpR() * this.stats.getCurrentMaxHp()));
//                addMP((int) (effect.getMpR() * this.stats.getCurrentMaxMp()));
//                setSchedule(MapleBuffStat.INFINITY, BuffTimer.getInstance().schedule(new CancelEffectAction(this, effect, start, stat), effect.alchemistModifyVal(this, 4000, false)));
//                return;
//            }
//        }
        deregisterBuffStats(buffstats);
        if (effect.isMagicDoor()) {
            // remove for all on maps
            if (!getDoors().isEmpty()) {
                removeDoor();
                silentPartyUpdate();
            }
        } else if (effect.isMonsterRiding_()) {
            getMount().cancelSchedule();
        } else if (effect.isAranCombo()) {
            combo = 0;
        }
        // check if we are still logged in o.o
        cancelPlayerBuffs(buffstats, recalcStat);
        if (effect.isHide() && client.getChannelServer().getPlayerStorage().getCharacterById(this.getId()) != null) { //Wow this is so fking hacky...
            map.broadcastMessage(this, MaplePacketCreator.spawnPlayerMapobject(this), false);

            sendTemporaryStats();
            for (final MaplePet pet : pets) {
                if (pet.getSummoned()) {
                    map.broadcastMessage(this, PetPacket.showPet(this, pet, false, false), false);
                }
            }
        }

    }

    public void cancelBuffStats(boolean recalcStat, MapleBuffStat... stat) {
        List<MapleBuffStat> buffStatList = Arrays.asList(stat);
        deregisterBuffStats(buffStatList);
        cancelPlayerBuffs(buffStatList, recalcStat);
    }

    public void cancelEffectFromBuffStat(MapleBuffStat stat) {
        if (effects.get(stat) != null) {
            cancelEffect(effects.get(stat).getEffect(), -1);
        }
    }

    public void cancelEffectFromBuffStat(MapleBuffStat stat, int from) {
        if (effects.get(stat) != null && effects.get(stat).getCid() == from) {
            cancelEffect(effects.get(stat).getEffect(), -1);
        }
    }

    private void cancelPlayerBuffs(List<MapleBuffStat> buffstats, boolean recalcStat) {
        boolean write = client != null && client.getChannelServer() != null && client.getChannelServer().getPlayerStorage().getCharacterById(getId()) != null;
        if (write && recalcStat) {
            stats.recalcLocalStats(this);
        }
        client.getSession().write(TemporaryStatsPacket.cancelBuff(buffstats));
        map.broadcastMessage(this, TemporaryStatsPacket.cancelForeignBuff(getId(), buffstats), false);

    }

    public void dispel() {
        if (!isHidden()) {
            final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());
            for (MapleBuffStatValueHolder mbsvh : allBuffs) {
                if (mbsvh.getEffect().isSkill() && mbsvh.getSchedule() != null && !mbsvh.getEffect().isMorph() && !mbsvh.getEffect().isGmBuff() && !mbsvh.getEffect().isMonsterRiding()) {
                    cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
                }
            }
        }
    }

    public void dispelSkill(int skillid) {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().isSkill() && mbsvh.getEffect().getSourceId() == skillid) {
                cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
                break;
            }
        }
    }

    public void dispelSummons() {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().getSummonMovementType() != null) {
                cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
            }
        }
    }

    public void dispelBuff(int skillid) {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().getSourceId() == skillid) {
                cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
                break;
            }
        }
    }

    public void cancelAllBuffs_() {
        effects.clear();
    }

    public void cancelAllBuffs() {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
        }
    }

    public void cancelMorphs() {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().isMorph()) {
                cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
                continue;
            }
        }
    }

    public int getMorphState() {
        LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());
        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().isMorph()) {
                return mbsvh.getEffect().getSourceId();
            }
        }
        return -1;
    }

    public void silentGiveBuffs(List<PlayerBuffValueHolder> buffs) {
        if (buffs == null) {
            return;
        }
        for (PlayerBuffValueHolder mbsvh : buffs) {
            mbsvh.effect.silentApplyBuff(this, mbsvh.startTime, mbsvh.localDuration, mbsvh.statup, mbsvh.cid);
        }
    }

    public List<PlayerBuffValueHolder> getAllBuffs() {
        final List<PlayerBuffValueHolder> ret = new ArrayList<PlayerBuffValueHolder>();
        final Map<Pair<Integer, Byte>, Integer> alreadyDone = new HashMap<Pair<Integer, Byte>, Integer>();
        final LinkedList<Entry<MapleBuffStat, MapleBuffStatValueHolder>> allBuffs = new LinkedList<Entry<MapleBuffStat, MapleBuffStatValueHolder>>(effects.entrySet());
        for (Entry<MapleBuffStat, MapleBuffStatValueHolder> mbsvh : allBuffs) {
            final Pair<Integer, Byte> key = new Pair<Integer, Byte>(mbsvh.getValue().getEffect().getSourceId(), mbsvh.getValue().getEffect().getLevel());
            if (alreadyDone.containsKey(key)) {
                ret.get(alreadyDone.get(key)).statup.put(mbsvh.getKey(), mbsvh.getValue().getValue());
            } else {
                alreadyDone.put(key, ret.size());
                final EnumMap<MapleBuffStat, Integer> list = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
                list.put(mbsvh.getKey(), mbsvh.getValue().getValue());
                ret.add(new PlayerBuffValueHolder(mbsvh.getValue().getStartTime(), mbsvh.getValue().getEffect(), list, mbsvh.getValue().getLocalDuration(), mbsvh.getValue().getCid()));
            }
        }
        return ret;
    }

    public final MapleMap getMap(final int map) {
        return getWarpMap(map);
    }

    public final void warpParty(final int mapId) {
        final MapleMap target = getMap(mapId);
        if (getParty() == null || getParty().getMembers().size() == 1) {
            changeMap(target);
            return;
        }
        final int cMap = getMapId();
        for (final MaplePartyCharacter chr : getParty().getMembers()) {
            final MapleCharacter curChar = getClient().getChannelServer().getPlayerStorage().getCharacterById(chr.getId());
            if (curChar != null && (curChar.getMapId() == cMap || curChar.getEventInstance() == getEventInstance())) {
                curChar.changeMap(target, target.getPortal(0));
            }
        }
    }

    public void cancelMagicDoor() {
        final LinkedList<MapleBuffStatValueHolder> allBuffs = new LinkedList<MapleBuffStatValueHolder>(effects.values());

        for (MapleBuffStatValueHolder mbsvh : allBuffs) {
            if (mbsvh.getEffect().isMagicDoor()) {
                cancelEffect(mbsvh.getEffect(), mbsvh.getStartTime());
                break;
            }
        }
    }

    public int getSkillLevel(int skillid) {
        return getSkillLevel(SkillFactory.getSkill(skillid));
    }

    public int getTotalSkillLevel(int skillid) {
        return getTotalSkillLevel(SkillFactory.getSkill(skillid));
    }

    public final void handleBattleshipHP(int damage) {
        if (damage < 0) {
            final MapleStatEffect effect = getStatForBuff(MapleBuffStat.MONSTER_RIDING);
            if (effect != null && effect.getSourceId() == 5221006) {
                battleshipHP += damage;
                client.getSession().write(MaplePacketCreator.skillCooldown(5221999, battleshipHP / 10));
                if (battleshipHP <= 0) {
                    battleshipHP = 0;
                    client.getSession().write(MaplePacketCreator.skillCooldown(5221006, effect.getCooldown()));
                    addCooldown(5221006, System.currentTimeMillis(), effect.getCooldown() * 1000);
                    cancelEffectFromBuffStat(MapleBuffStat.MONSTER_RIDING);
                }
            }
        }
    }

    public final void handleOrbgain() {
        int orbcount = getBuffedValue(MapleBuffStat.COMBO);
        Skill combo;
        Skill advcombo;

        switch (getJob()) {
            case 1110:
            case 1111:
            case 1112:
                combo = SkillFactory.getSkill(11111001);
                advcombo = SkillFactory.getSkill(11110005);
                break;
            default:
                combo = SkillFactory.getSkill(1111002);
                advcombo = SkillFactory.getSkill(1120003);
                break;
        }

        MapleStatEffect ceffect = null;
        int advComboSkillLevel = getTotalSkillLevel(advcombo);
        if (advComboSkillLevel > 0) {
            ceffect = advcombo.getEffect(advComboSkillLevel);
        } else if (getSkillLevel(combo) > 0) {
            ceffect = combo.getEffect(getTotalSkillLevel(combo));
        } else {
            return;
        }

        if (orbcount < ceffect.getX() + 1) {
            int neworbcount = orbcount + 1;
            if (advComboSkillLevel > 0 && ceffect.makeChanceResult()) {
                if (neworbcount < ceffect.getX() + 1) {
                    neworbcount++;
                }
            }
            EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
            stat.put(MapleBuffStat.COMBO, neworbcount);
            setBuffedValue(MapleBuffStat.COMBO, neworbcount);
            int duration = ceffect.getDuration();
            duration += (int) ((getBuffedStarttime(MapleBuffStat.COMBO) - System.currentTimeMillis()));

            client.getSession().write(TemporaryStatsPacket.giveBuff(combo.getId(), duration, stat, ceffect));
            map.broadcastMessage(this, TemporaryStatsPacket.giveForeignBuff(getId(), stat, ceffect), false);
        }
    }

    public void handleOrbconsume(int howmany) {
        Skill combo;

        if (getJob() == 1000 || getJob() == 1100 || getJob() == 1110 || getJob() == 1111 || getJob() == 1112) {
            combo = SkillFactory.getSkill(11111001);
        } else {
            combo = SkillFactory.getSkill(1111002);
        }

        if (getSkillLevel(combo) <= 0) {
            return;
        }
        MapleStatEffect ceffect = getStatForBuff(MapleBuffStat.COMBO);
        if (ceffect == null) {
            return;
        }
        EnumMap<MapleBuffStat, Integer> stat = new EnumMap<MapleBuffStat, Integer>(MapleBuffStat.class);
        stat.put(MapleBuffStat.COMBO, Math.max(1, getBuffedValue(MapleBuffStat.COMBO) - howmany));
        setBuffedValue(MapleBuffStat.COMBO, Math.max(1, getBuffedValue(MapleBuffStat.COMBO) - howmany));
        int duration = ceffect.getDuration();
        duration += (int) ((getBuffedStarttime(MapleBuffStat.COMBO) - System.currentTimeMillis()));

        client.getSession().write(TemporaryStatsPacket.giveBuff(combo.getId(), duration, stat, ceffect));
        map.broadcastMessage(this, TemporaryStatsPacket.giveForeignBuff(getId(), stat, ceffect), false);
    }

    public void silentEnforceMaxHpMp() {
        stats.setMp(stats.getMp(), this);
        stats.setHp(stats.getHp(), true, this);
    }

    public void enforceMaxHpMp() {
        Map<MapleStat, Integer> statups = new EnumMap<MapleStat, Integer>(MapleStat.class);
        if (stats.getMp() > stats.getCurrentMaxMp()) {
            stats.setMp(stats.getMp(), this);
            statups.put(MapleStat.MP, Integer.valueOf(stats.getMp()));
        }
        if (stats.getHp() > stats.getCurrentMaxHp()) {
            stats.setHp(stats.getHp(), this);
            statups.put(MapleStat.HP, Integer.valueOf(stats.getHp()));
        }
        if (statups.size() > 0) {
            client.getSession().write(MaplePacketCreator.updatePlayerStats(statups, getJob()));
        }
    }

    public MapleMap getMap() {
        return map;
    }

    public void setMap(MapleMap newmap) {
        this.map = newmap;
    }

    public void setMap(int PmapId) {
        this.mapid = PmapId;
    }

    public int getMapId() {
        if (map != null) {
            return map.getId();
        }
        return mapid;
    }

    public byte getInitialSpawnpoint() {
        return initialSpawnPoint;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public final short getLevel() {
        return level;
    }

    public final int getFame() {
        return fame;
    }

    public final int getFallCounter() {
        return fallcounter;
    }

    public final MapleClient getClient() {
        return client;
    }

    public final void setClient(final MapleClient client) {
        this.client = client;
    }

    public int getExp() {
        return exp;
    }

    public short getRemainingAp() {
        return remainingAp;
    }

    public int getRemainingSp() {
        return remainingSp[GameConstants.getSkillBook(job)]; //default
    }

    public int getRemainingSp(final int skillbook) {
        return remainingSp[skillbook];
    }

    public int[] getRemainingSps() {
        return remainingSp;
    }

    public int getRemainingSpSize() {
        int ret = 0;
        for (int i = 0; i < remainingSp.length; i++) {
            if (remainingSp[i] > 0) {
                ret++;
            }
        }
        return ret;
    }

    public short getHpApUsed() {
        return hpApUsed;
    }

    public void setHidden(boolean f) {
        hide = f;
        client.getSession().write(MaplePacketCreator.GmHide(hide));
        if (hide) {
            map.broadcastMessage(this, MaplePacketCreator.removePlayerFromMap(getId()), false);
        } else {
            map.broadcastMessage(this, MaplePacketCreator.spawnPlayerMapobject(this), false);
            sendTemporaryStats();

            for (final MaplePet pet : pets) {
                if (pet.getSummoned()) {
                    map.broadcastMessage(this, PetPacket.showPet(this, pet, false, false), false);
                }
            }
        }
    }
    boolean hide = false;

    public boolean isVacFucking() {
        if (getQuestNoAdd(MapleQuest.getInstance(170980)) == null) {
            return false;
        }
        return getQuestNAdd(MapleQuest.getInstance(170980)).getCustomData().equals("1");
    }

    public boolean isMovePlayerFucking() {
        if (getQuestNoAdd(MapleQuest.getInstance(170981)) == null) {
            return false;
        }
        return getQuestNAdd(MapleQuest.getInstance(170981)).getCustomData().equals("1");
    }

    public boolean isApplyDamageFucking() {
        if (getQuestNoAdd(MapleQuest.getInstance(170982)) == null) {
            return false;
        }
        return getQuestNAdd(MapleQuest.getInstance(170982)).getCustomData().equals("1");
    }

    public boolean isGSD() {
        if (getQuestNoAdd(MapleQuest.getInstance(170983)) == null) {
            return false;
        }
        return getQuestNAdd(MapleQuest.getInstance(170983)).getCustomData().equals("1");
    }

    public boolean isHidden() {
        return hide;
//        return getBuffSource(MapleBuffStat.DARKSIGHT) / 1000000 == 9;
    }

    public void setHpApUsed(short hpApUsed) {
        this.hpApUsed = hpApUsed;
    }

    public byte getSkinColor() {
        return skinColor;
    }

    public void setSkinColor(byte skinColor) {
        this.skinColor = skinColor;
    }

    public short getJob() {
        return job;
    }

    public byte getGender() {
        return gender;
    }

    public int getHair() {
        return hair;
    }

    public int getFace() {
        return face;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setExp(int exp) {
        this.exp = exp;
    }

    public void setHair(int hair) {
        this.hair = hair;
    }

    public void setFace(int face) {
        this.face = face;
    }

    public void setFame(int fame) {
        this.fame = fame;
    }

    public void setFallCounter(int fallcounter) {
        this.fallcounter = fallcounter;
    }

    public Point getOldPosition() {
        return old;
    }

    public void setOldPosition(Point x) {
        this.old = x;
    }

    public void setRemainingAp(short remainingAp) {
        this.remainingAp = remainingAp;
    }

    public void setRemainingSp(int remainingSp) {
        this.remainingSp[GameConstants.getSkillBook(job)] = remainingSp; //default
    }

    public void setRemainingSp(int remainingSp, final int skillbook) {
        this.remainingSp[skillbook] = remainingSp;
    }

    public void setGender(byte gender) {
        this.gender = gender;
    }

    public void setInvincible(boolean invinc) {
        invincible = invinc;
    }

    public boolean isInvincible() {
        return invincible;
    }

    public CheatTracker getCheatTracker() {
        return anticheat;
    }

    public BuddyList getBuddylist() {
        return buddylist;
    }

    public void addFame(int famechange) {
        this.fame += famechange;
//        getTrait(MapleTraitType.charm).addLocalExp(famechange);
//        if (this.fame >= 50) {
//            finishAchievement(7);
//        }
    }

    public void updateFame() {
        updateSingleStat(MapleStat.FAME, this.fame);
    }

    public void changeMapBanish(final int mapid, final String portal, final String msg) {
        dropMessage(5, msg);
        final MapleMap map = client.getChannelServer().getMapFactory().getMap(mapid);
        changeMap(map, map.getPortal(portal));
    }

    public void changeMap(final MapleMap to, final Point pos) {
        changeMapInternal(to, pos, MaplePacketCreator.getWarpToMap(to, 0x80, this), null);
    }

    public void changeMap(final MapleMap to) {
        changeMapInternal(to, to.getPortal(0).getPosition(), MaplePacketCreator.getWarpToMap(to, 0, this), to.getPortal(0));
    }

    public void changeMap(final MapleMap to, final MaplePortal pto) {
        changeMapInternal(to, pto.getPosition(), MaplePacketCreator.getWarpToMap(to, pto.getId(), this), null);
    }

    public void changeMapPortal(final MapleMap to, final MaplePortal pto) {
        changeMapInternal(to, pto.getPosition(), MaplePacketCreator.getWarpToMap(to, pto.getId(), this), pto);
    }

    private void changeMapInternal(final MapleMap to, final Point pos, byte[] warpPacket, final MaplePortal pto) {
        if (to == null) {
            return;
        }
        final int nowmapid = map.getId();
        if (eventInstance != null) {
            eventInstance.changedMap(this, to.getId());
        }
        if (map.getId() == nowmapid) {
            client.getSession().write(warpPacket);
            if (isHidden()) {
                client.getSession().write(MaplePacketCreator.GmHide(isHidden()));
            }
            final boolean shouldChange = client.getChannelServer().getPlayerStorage().getCharacterById(getId()) != null;
            final boolean shouldState = map.getId() == to.getId();
            if (shouldChange && shouldState) {
                to.setCheckStates(false);
            }
            MapleMap oldMap = map;
            if (shouldChange) {
                map = to;
                oldMap.removePlayer(this);
                setPosition(pos);
                if (getPet(0) != null) {
                    getPet(0).setPos(pos);
                    getPet(0).setStance(0);
                }
                setStance(0);
                to.addPlayer(this);
                stats.relocHeal(this);
                if (shouldState) {
                    to.setCheckStates(true);
                }
            } else {
                map.removePlayer(this);
            }
        }
    }

    public void cancelChallenge() {
        if (challenge != 0 && client.getChannelServer() != null) {
            final MapleCharacter chr = client.getChannelServer().getPlayerStorage().getCharacterById(challenge);
            if (chr != null) {
                chr.dropMessage(6, getName() + " 님이 요청을 거절하였습니다.");
                chr.setChallenge(0);
            }
            dropMessage(6, "요청을 거절하였습니다.");
            challenge = 0;
        }
    }

    public void leaveMap(MapleMap map) {
        controlledLock.writeLock().lock();
        visibleMapObjectsLock.writeLock().lock();
        try {
            for (MapleMonster mons : controlled) {
                if (mons != null) {
                    mons.setController(null);
                    mons.setControllerHasAggro(false);
                    map.updateMonsterController(mons);
                }
            }
            controlled.clear();
            visibleMapObjects.clear();
        } finally {
            controlledLock.writeLock().unlock();
            visibleMapObjectsLock.writeLock().unlock();
        }
        if (chair != 0) {
            chair = 0;
        }
        cancelChallenge();
        clearLinkMid();
        cancelFishingTask();
        cancelMapTimeLimitTask();
        searchingParty = false;
        if (getTrade() != null) {
            MapleTrade.cancelTrade(getTrade(), client, this);
        }
        if (getPlayerShop() != null) {
            if (getPlayerShop().isOwner(this) && getPlayerShop().getShopType() != 1) {
                getPlayerShop().closeShop(false, getPlayerShop().isAvailable(), false); //how to return the items?
            } else {
                final IMaplePlayerShop ips = getPlayerShop();
                if (ips != null && ips instanceof MapleMiniGame) {
                    MapleMiniGame game = (MapleMiniGame) ips;
                    if (!game.isOpen()) {
                        game.nextLoser();
                        try {
                            game.broadcastToVisitors(PlayerShopPacket.getMiniGameResult(game, 0, game.getVisitorSlot(this)));
                        } catch (Exception ex) {
                        }
                        game.setOpen(true);
                        game.update();
                        game.setExitAfter(this);
                        game.checkExitAfterGame();
                    }
                }
                //getPlayerShop().removeVisitor(this, true);
            }
            setPlayerShop(null);
        }
        if (MarriageEventAgent.isWeddingMap(map.getId())) {
            MarriageManager.getInstance().getEventAgent(getClient().getChannel()).checkLeaveMap(this, getMapId());
        }
    }

    public void changeJob(int newJob) {
        try {
            cancelEffectFromBuffStat(MapleBuffStat.SHADOWPARTNER);
            this.job = (short) newJob;
            updateSingleStat(MapleStat.JOB, newJob);
            if (!GameConstants.isBeginnerJob(newJob)) {
                remainingSp[GameConstants.getSkillBook(newJob)]++;
                if (newJob % 10 >= 2) {
                    remainingSp[GameConstants.getSkillBook(newJob)] += 2;
                }
                if (newJob % 10 >= 1 && level >= 70) { //3rd job or higher. lucky for evans who get 80, 100, 120, 160 ap...
                    remainingAp += 5;
                    updateSingleStat(MapleStat.AVAILABLEAP, remainingAp);
                    //MAKER STILL EXISTS
//                    final Skill skil = SkillFactory.getSkill(stats.getSkillByJob(1007, getJob()));
//                    if (skil != null && getSkillLevel(skil) <= 0) {
//                        dropMessage(-1, "You have gained the Maker skill.");
//                        changeSkillLevel(skil, skil.getMaxLevel(), (byte) skil.getMaxLevel());
//                    }
                }
                if (!isGM()) {
                    resetStatsByJob(true);
                    if (getLevel() > (newJob == 200 ? 8 : 10) && newJob % 100 == 0) { //first job
                        remainingSp[GameConstants.getSkillBook(newJob)] += 3 * (getLevel() - (newJob == 200 ? 8 : 10));
                    }

//                    else if (newJob == 2200) {
//                        MapleQuest.getInstance(22100).forceStart(this, 0, null);
//                        MapleQuest.getInstance(22100).forceComplete(this, 0);
//                        expandInventory((byte) 1, 4);
//                        expandInventory((byte) 2, 4);
//                        expandInventory((byte) 3, 4);
//                        expandInventory((byte) 4, 4);
//                        client.getSession().write(MaplePacketCreator.getEvanTutorial("UI/tutorial/evan/14/0"));
//                        dropMessage(5, "The baby Dragon hatched and appears to have something to tell you. Click the baby Dragon to start a conversation.");
//                    }
                }
                client.getSession().write(MaplePacketCreator.updateSp(this, false, false));
            }

            int maxhp = stats.getMaxHp(), maxmp = stats.getMaxMp();

            switch (job) {
                case 300:
                    maxhp += Randomizer.rand(100, 150);
                    maxmp += Randomizer.rand(30, 50);
                    expandInventory((byte) 1, 4);
                    expandInventory((byte) 2, 4);
                    break;
                case 310:
                case 320:
                    maxhp += Randomizer.rand(300, 350);
                    maxmp += Randomizer.rand(150, 200);
                    expandInventory((byte) 4, 4);
                    break;
                case 100:
                    maxhp += Randomizer.rand(200, 250);
                    expandInventory((byte) 1, 4);
                    expandInventory((byte) 2, 4);
                    expandInventory((byte) 3, 4);
                    expandInventory((byte) 4, 4);
                    break;
                case 110:
                    maxhp += Randomizer.rand(300, 350);
                    expandInventory((byte) 2, 4);
                    expandInventory((byte) 4, 4);
                    break;
                case 120:
                case 130:
                    maxhp += Randomizer.rand(100, 150);
                    expandInventory((byte) 2, 4);
                    expandInventory((byte) 4, 4);
                    break;
                case 200:
                    maxmp += Randomizer.rand(100, 150);
                    break;
                case 210:
                case 220:
                case 230:
                    expandInventory((byte) 2, 4);
                    maxmp += Randomizer.rand(450, 500);
                    break;
                case 400:
                case 500:
                    maxhp += Randomizer.rand(100, 150);
                    maxmp += Randomizer.rand(30, 50);
                    expandInventory((byte) 1, 4);
                    expandInventory((byte) 4, 4);
                    break;
                case 510:
                case 520:
                case 410:
                case 420:
                    maxhp += Randomizer.rand(300, 350);
                    maxmp += Randomizer.rand(150, 200);
                    expandInventory((byte) 2, 4);
                    break;
            }

            if (maxhp >= 30000) {
                maxhp = 30000;
            }
            if (maxmp >= 30000) {
                maxmp = 30000;
            }
            stats.setInfo(maxhp, maxmp, maxhp, maxmp);
            Map<MapleStat, Integer> statup = new EnumMap<MapleStat, Integer>(MapleStat.class);
            statup.put(MapleStat.MAXHP, Integer.valueOf(maxhp));
            statup.put(MapleStat.MAXMP, Integer.valueOf(maxmp));
            statup.put(MapleStat.HP, Integer.valueOf(maxhp));
            statup.put(MapleStat.MP, Integer.valueOf(maxmp));
            stats.recalcLocalStats(this);
            client.getSession().write(MaplePacketCreator.updatePlayerStats(statup, getJob()));
            map.broadcastMessage(this, MaplePacketCreator.showForeignEffect(getId(), 8), false);
            silentPartyUpdate();
            guildUpdate();
            baseSkills();
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.ScriptEx_Log, e); //all jobs throw errors :(
        }
    }

    public void baseSkills() {
        if (GameConstants.getJobNumber(job) >= 3) { //third job.
            List<Integer> skills = SkillFactory.getSkillsByJob(job);
            if (skills != null) {
                for (int i : skills) {
                    final Skill skil = SkillFactory.getSkill(i);
                    if (skil != null && !skil.isInvisible() && skil.isFourthJob() && getSkillLevel(skil) <= 0 && getMasterLevel(skil) <= 0 && skil.getMasterLevel() > 0) {
                        changeSkillLevel(skil, (byte) 0, (byte) skil.getMasterLevel()); //usually 10 master
                    }
                }
            }
            //redemption for completed quests. holy fk. ex
	    /*List<MapleQuestStatus> cq = getCompletedQuests();
             for (MapleQuestStatus q : cq) {
             for (MapleQuestAction qs : q.getQuest().getCompleteActs()) {
             if (qs.getType() == MapleQuestActionType.skill) {
             for (Pair<Integer, Pair<Integer, Integer>> skill : qs.getSkills()) {
             final Skill skil = SkillFactory.getSkill(skill.left);
             if (skil != null && getSkillLevel(skil) <= skill.right.left && getMasterLevel(skil) <= skill.right.right) {
             changeSkillLevel(skil, (byte) (int)skill.right.left, (byte) (int)skill.right.right);
             }
             }
             } else if (qs.getType() == MapleQuestActionType.item) { //skillbooks
             for (MapleQuestAction.QuestItem item : qs.getItems()) {
             if (item.itemid / 10000 == 228 && !haveItem(item.itemid,1)) { //skillbook
             //check if we have the skill
             final Map<String, Integer> skilldata = MapleItemInformationProvider.getInstance().getSkillStats(item.itemid);
             if (skilldata != null) {
             byte i = 0;
             Skill finalSkill = null;
             Integer skillID = 0;
             while (finalSkill == null) {
             skillID = skilldata.get("skillid" + i);
             i++;
             if (skillID == null) {
             break;
             }
             final Skill CurrSkill = SkillFactory.getSkill(skillID);
             if (CurrSkill != null && CurrSkill.canBeLearnedBy(job) && getSkillLevel(CurrSkill) <= 0 && getMasterLevel(CurrSkill) <= 0) {
             finalSkill = CurrSkill;
             }
             }
             if (finalSkill != null) {
             //may as well give the skill
             changeSkillLevel(finalSkill, (byte) 0, (byte)10);
             //MapleInventoryManipulator.addById(client, item.itemid, item.count);
             }
             }
             }
             }
             }
             }
             }*/
        }
    }

    public void gainAp(short ap) {
        this.remainingAp += ap;
        updateSingleStat(MapleStat.AVAILABLEAP, this.remainingAp);
    }

    public void gainSP(int sp) {
        this.remainingSp[GameConstants.getSkillBook(job)] += sp; //default
        client.getSession().write(MaplePacketCreator.updateSp(this, false));
        client.getSession().write(UIPacket.getSPMsg((byte) sp, (short) job));
    }

    public void gainSP(int sp, final int skillbook) {
        this.remainingSp[skillbook] += sp; //default
        client.getSession().write(MaplePacketCreator.updateSp(this, false));
        client.getSession().write(UIPacket.getSPMsg((byte) sp, (short) 0));
    }

    public void resetSP(int sp) {
        for (int i = 0; i < remainingSp.length; i++) {
            this.remainingSp[i] = sp;
        }
        client.getSession().write(MaplePacketCreator.updateSp(this, false));
    }

    public void resetAPSP() {
        resetSP(0);
        gainAp((short) -this.remainingAp);
    }

    public void changeSkillLevel(final Skill skill, int newLevel, byte newMasterlevel) { //1 month
        if (skill == null) {
            return;
        }
        changeSkillLevel(skill, newLevel, newMasterlevel, skill.isTimeLimited() ? (System.currentTimeMillis() + (long) (30L * 24L * 60L * 60L * 1000L)) : -1);
    }

    public void changeSkillLevel(final Skill skill, int newLevel, byte newMasterlevel, long expiration) {
        if (skill == null || (!GameConstants.isApplicableSkill(skill.getId()) && !GameConstants.isApplicableSkill_(skill.getId()))) {
            return;
        }
        client.getSession().write(MaplePacketCreator.updateSkill(skill.getId(), newLevel, newMasterlevel, expiration));
        if (newLevel == 0 && newMasterlevel == 0) {
            if (skills.containsKey(skill)) {
                skills.remove(skill);
            } else {
                return; //nothing happen
            }
        } else {
            skills.put(skill, new SkillEntry(newLevel, newMasterlevel, expiration));
        }
        changed_skills = true;
        if (GameConstants.isRecoveryIncSkill(skill.getId())) {
            stats.relocHeal(this);
        }
        if (skill.getId() < 80000000) {
            stats.recalcLocalStats(this);
        }
    }

    public void changeSkillLevel_Skip(final Skill skill, int newLevel, byte newMasterlevel) {
        changeSkillLevel_Skip(skill, newLevel, newMasterlevel, false);
    }

    public void changeSkillLevel_Skip(final Skill skill, int newLevel, byte newMasterlevel, boolean write) {
        if (skill == null) {
            return;
        }
        if (write) {
            client.getSession().write(MaplePacketCreator.updateSkill(skill.getId(), newLevel, newMasterlevel, -1L));
        }
        if (newLevel == 0 && newMasterlevel == 0) {
            if (skills.containsKey(skill)) {
                skills.remove(skill);
            } else {
                return; //nothing happen
            }
        } else {
            skills.put(skill, new SkillEntry(newLevel, newMasterlevel, -1L));
        }

    }

    public int getMobQuantity() {
        MapleMap map = client.getPlayer().getMap();
        double range = Double.POSITIVE_INFINITY;
        List<MapleMapObject> monsters = map.getMapObjectsInRange(client.getPlayer().getPosition(), range, Arrays.asList(MapleMapObjectType.MONSTER));
        return monsters.size();
    }

    public void playerDead() {
        if (getEventInstance() != null) {
            getEventInstance().playerKilled(this);
        }
        cancelAllBuffs();
        cancelAllDebuffs();
        dispelSummons();
        dotHP = 0;
        lastDOTTime = 0;

        boolean reduceDeathExp = true;
        if (getMapId() / 1000000 == 109) { //Event Map
            reduceDeathExp = false;
        } else if (getMapId() / 10000000 == 98) { //Carnival
            reduceDeathExp = false;
        }
        if (!GameConstants.isBeginnerJob(job) && reduceDeathExp) {
            int charms = getItemQuantity(5130000, false);
            if (charms > 0) {
                MapleInventoryManipulator.removeById(client, MapleInventoryType.CASH, 5130000, 1, true, false);

                charms--;
                if (charms > 0xFF) {
                    charms = 0xFF;
                }
                client.getSession().write(CSPacket.useCharm((byte) charms, (byte) 0));
            } else {
                float diepercentage = 0.0f;
                int expforlevel = getNeededExp();
                if (map.isTown() || FieldLimitType.RegularExpLoss.check(map.getFieldLimit())) {
                    diepercentage = 0.01f;
                } else {
                    float decRate;
                    if (getJob() / 100 == 3) {
                        decRate = 0.08F;
                    } else {
                        decRate = 0.2F;
                    }
                    diepercentage = decRate / getStat().luk + 0.05F;
                }

                float myExpF = getExp() - expforlevel * diepercentage;
                if (myExpF <= 0.0F) {
                    myExpF = 0.0F;
                }
                float ff = expforlevel - 1;
                if (myExpF < ff - 1.0F) {
                    ff = myExpF;
                }
                this.exp = (int) ff;
            }
            this.updateSingleStat(MapleStat.EXP, this.exp);
        }
    }

    public void updatePartyMemberHP() {
        if (party != null && client.getChannelServer() != null) {
            final int channel = client.getChannel();
            for (MaplePartyCharacter partychar : party.getMembers()) {
                if (partychar != null && partychar.getMapid() == getMapId() && partychar.getChannel() == channel) {
                    final MapleCharacter other = client.getChannelServer().getPlayerStorage().getCharacterByName(partychar.getName());
                    if (other != null) {
                        other.getClient().getSession().write(MaplePacketCreator.updatePartyMemberHP(getId(), stats.getHp(), stats.getCurrentMaxHp()));
                    }
                }
            }
        }
    }

    public void receivePartyMemberHP() {
        if (party == null) {
            return;
        }
        int channel = client.getChannel();
        for (MaplePartyCharacter partychar : party.getMembers()) {
            if (partychar != null && partychar.getMapid() == getMapId() && partychar.getChannel() == channel) {
                MapleCharacter other = client.getChannelServer().getPlayerStorage().getCharacterByName(partychar.getName());
                if (other != null) {
                    client.getSession().write(MaplePacketCreator.updatePartyMemberHP(other.getId(), other.getStat().getHp(), other.getStat().getCurrentMaxHp()));
                }
            }
        }
    }

    public void healHP(int delta) {
        addHP(delta);
        client.getSession().write(MaplePacketCreator.showOwnHpHealed(delta));
        getMap().broadcastMessage(this, MaplePacketCreator.showHpHealed(getId(), delta), false);
    }

    public void healMP(int delta) {
        addMP(delta);
        client.getSession().write(MaplePacketCreator.showOwnHpHealed(delta));
        getMap().broadcastMessage(this, MaplePacketCreator.showHpHealed(getId(), delta), false);
    }

    /**
     * Convenience function which adds the supplied parameter to the current hp
     * then directly does a updateSingleStat.
     *
     * @see MapleCharacter(int)
     * @param delta
     */
    public void addHP(int delta) {
        if (stats.setHp(stats.getHp() + delta, this)) {
            updateSingleStat(MapleStat.HP, stats.getHp());
        }
    }

    /**
     * Convenience function which adds the supplied parameter to the current mp
     * then directly does a updateSingleStat.
     *
     * @see MapleCharacter(int)
     * @param delta
     */
    public void addMP(int delta) {
        if (stats.setMp(stats.getMp() + delta, this)) {
            updateSingleStat(MapleStat.MP, stats.getMp());
        }
    }

    public void addMPHP(int hpDiff, int mpDiff) {
        Map<MapleStat, Integer> statups = new EnumMap<MapleStat, Integer>(MapleStat.class);

        if (stats.setHp(stats.getHp() + hpDiff, this)) {
            statups.put(MapleStat.HP, Integer.valueOf(stats.getHp()));
        }
        if (stats.setMp(stats.getMp() + mpDiff, this)) {
            statups.put(MapleStat.MP, Integer.valueOf(stats.getMp()));
        }
        if (statups.size() > 0) {
            client.getSession().write(MaplePacketCreator.updatePlayerStats(statups, getJob()));
        }
    }

    public void updateSingleStat(MapleStat stat, int newval) {
        updateSingleStat(stat, newval, false);
    }

    /**
     * Updates a single stat of this MapleCharacter for the client. This method
     * only creates and sends an update packet, it does not update the stat
     * stored in this MapleCharacter instance.
     *
     * @param stat
     * @param newval
     * @param itemReaction
     */
    public void updateSingleStat(MapleStat stat, int newval, boolean itemReaction) {
        if (stat == MapleStat.AVAILABLESP) {
            client.getSession().write(MaplePacketCreator.updateSp(this, itemReaction, false));
            return;
        }
        Map<MapleStat, Integer> statup = new EnumMap<MapleStat, Integer>(MapleStat.class);
        statup.put(stat, newval);
        client.getSession().write(MaplePacketCreator.updatePlayerStats(statup, itemReaction, getJob()));
    }

    public void gainExp(int total, final boolean show, final boolean inChat, final boolean white) {
        try {
            total *= GameConstants.getExpModByLevel(level);
            int prevexp = getExp();
            int needed = getNeededExp();
            if (total > 0) {
                stats.checkEquipLevels(this, total); //gms like
            }
            if (level >= 200) {
                setExp(0);
            } else {
                boolean leveled = false;
                long tot = exp + total;
                if (tot >= needed) {
                    exp += total;
                    levelUp();
                    leveled = true;
                    if (level >= 200) {
                        setExp(0);
                    } else {
                        needed = getNeededExp();
                        if (exp >= needed) {
                            setExp(needed - 1);
                        }
                    }
                } else {
                    exp += total;
                }
                if (total > 0) {
                    familyRep(prevexp, needed, leveled);
                }
            }
            if (total != 0) {
                if (exp < 0) { // After adding, and negative
                    if (total > 0) {
                        setExp(needed);
                    } else if (total < 0) {
                        setExp(0);
                    }
                }
                updateSingleStat(MapleStat.EXP, getExp());
                if (show) { // still show the expgain even if it's not there
                    if (inChat) {
                        client.getSession().write(GainExpPacket.GainExp_Quest(total));
                    } else {
                        client.getSession().write(GainExpPacket.GainExp_Normal(total, white, 0));
                    }
                }
            }
        } catch (Exception e) {
            FileoutputUtil.outputFileError(FileoutputUtil.ScriptEx_Log, e); //all jobs throw errors :(
        }
    }

    public void familyRep(int prevexp, int needed, boolean leveled) {
        if (mfc != null) {
            int onepercent = needed / 100;
            if (onepercent <= 0) {
                return;
            }
            int percentrep = (getExp() / onepercent - prevexp / onepercent);
            if (leveled) {
                percentrep = 100 - percentrep + (level / 2);
            }
            if (percentrep > 0) {
                int sensen = World.Family.setRep(mfc.getFamilyId(), mfc.getSeniorId(), percentrep * 10, level, name);
                if (sensen > 0) {
                    World.Family.setRep(mfc.getFamilyId(), sensen, percentrep * 5, level, name); //and we stop here
                }
            }
        }
    }

    public void gainExpMonster(int gain, final boolean show, final boolean white, final byte pty, boolean partyBonusMob, final int partyBonusRate) {
        gain *= GameConstants.getExpModByLevel(level);
        int total = gain;
        int partyinc = 0;
        int prevexp = getExp();
        int equip = (gain / 10) * pendantExp;
        if (pendantExp >= 1) {
            total += equip;
        }
        if (pty > 1) {
            final double rate = (partyBonusRate > 0 ? (partyBonusRate / 100.0) : (map == null || !partyBonusMob || map.getPartyBonusRate() <= 0 ? 0.05 : (map.getPartyBonusRate() / 100.0)));
            partyinc = (int) (((float) (gain * rate)) * (pty + (rate > 0.05 ? -1 : 1)));
            total += partyinc;
        }

        if (gain > 0 && total < gain) { //just in case
            total = Integer.MAX_VALUE;
        }
        int needed = getNeededExp();
        if (total > 0) {
            stats.checkEquipLevels(this, total); //gms like
        }
        if (level >= 200) {
            setExp(0);
        } else {
            boolean leveled = false;
            if (exp + total >= needed || exp >= needed) {
                exp += total;
                levelUp();
                leveled = true;
                if (level >= 200) {
                    setExp(0);
                } else {
                    needed = getNeededExp();
                    if (exp >= needed) {
                        setExp(needed);
                    }
                }
            } else {
                exp += total;
            }
            if (total > 0) {
                familyRep(prevexp, needed, leveled);
            }
        }
        if (gain != 0) {
            if (exp < 0) { // After adding, and negative
                if (gain > 0) {
                    setExp(getNeededExp());
                } else if (gain < 0) {
                    setExp(0);
                }
            }
            updateSingleStat(MapleStat.EXP, getExp());
            if (show) { // still show the expgain even if it's not there
                if (pendantExp >= 1) {
                    client.getSession().write(MaplePacketCreator.GainExpPacket.GainExp_Normal(gain + equip, white, pty));
                } else {
                    client.getSession().write(MaplePacketCreator.GainExpPacket.GainExp_Normal(gain, white, pty));
                }
            }
        }
    }

    public int partyMembersInMap() {
        int inMap = 0;
        for (MapleCharacter char2 : getClient().getPlayer().getMap().getCharacters()) {
            if (char2.getParty() == getClient().getPlayer().getParty()) {
                inMap++;
            }
        }
        return inMap;
    }

    public void forceReAddItem_NoUpdate(Item item, MapleInventoryType type) {
        getInventory(type).removeSlot(item.getPos());
        getInventory(type).addFromDB(item);
    }

    public void forceReAddItem(Item item, MapleInventoryType type) { //used for stuff like durability, item exp/level, probably owner?
        forceReAddItem_NoUpdate(item, type);
        if (type != MapleInventoryType.UNDEFINED) {
            client.getSession().write(MaplePacketCreator.updateSpecialItemUse(item, type == MapleInventoryType.EQUIPPED ? (byte) 1 : type.getType(), this));
        }
    }

    public void forceReAddItem_Flag(Item item, MapleInventoryType type) { //used for flags
        forceReAddItem_NoUpdate(item, type);
        if (type != MapleInventoryType.UNDEFINED) {
            client.getSession().write(MaplePacketCreator.updateSpecialItemUse_(item, type == MapleInventoryType.EQUIPPED ? (byte) 1 : type.getType(), this));
        }
    }

    public void forceReAddItem_Book(Item item, MapleInventoryType type) { //used for mbook
        forceReAddItem_NoUpdate(item, type);
        if (type != MapleInventoryType.UNDEFINED) {
            client.getSession().write(MaplePacketCreator.upgradeBook(item, this));
        }
    }

    public void silentPartyUpdate() {
        if (party != null) {
            World.Party.updateParty(party.getId(), PartyOperation.SILENT_UPDATE, new MaplePartyCharacter(this));
        }
    }

    public boolean isGM() {
        return gmLevel >= PlayerGMRank.GM.getLevel();
    }

    public int getGMLevel() {
        return gmLevel;
    }

    public boolean hasGmLevel(int level) {
        return gmLevel >= level;
    }

    public final MapleInventory getInventory(MapleInventoryType type) {
        return inventory[type.ordinal()];
    }

    public final MapleInventory[] getInventorys() {
        return inventory;
    }

    public final void expirationTask(boolean pending, boolean firstLoad) {
        final MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        if (pending) {
            if (pendingExpiration != null) {
                for (Integer z : pendingExpiration) {
                    client.getSession().write(CSPacket.itemExpired(z.intValue()));
                    if (!firstLoad) {
                        final Pair<Integer, String> replace = ii.replaceItemInfo(z.intValue());
                        if (replace != null && replace.left > 0 && replace.right.length() > 0) {
                            dropMessage(5, replace.right);
                        }
                    }
                }
            }
            pendingExpiration = null;
            if (pendingSkills != null) {
                for (Integer z : pendingSkills) {
                    client.getSession().write(MaplePacketCreator.updateSkill(z, 0, 0, -1));
                    client.getSession().write(MaplePacketCreator.serverNotice(5, "[" + SkillFactory.getSkillName(z) + "] skill has expired and will not be available for use."));
                }
            } //not real msg
            pendingSkills = null;
            return;
        }
        final MapleQuestStatus stat = getQuestNoAdd(MapleQuest.getInstance(GameConstants.PENDANT_SLOT));
        long expiration;
        final List<Integer> ret = new ArrayList<Integer>();
        final long currenttime = System.currentTimeMillis();
        final List<Triple<MapleInventoryType, Item, Boolean>> toberemove = new ArrayList<Triple<MapleInventoryType, Item, Boolean>>(); // This is here to prevent deadlock.
        final List<Item> tobeunlock = new ArrayList<Item>(); // This is here to prevent deadlock.

        for (final MapleInventoryType inv : MapleInventoryType.values()) {
            for (final Item item : getInventory(inv)) {
                expiration = item.getExpiration();

                if ((expiration != -1 && !GameConstants.isPet(item.getItemId()) && currenttime > expiration) || (firstLoad && ii.isLogoutExpire(item.getItemId()))) {
                    if (ItemFlag.LOCK.check(item.getFlag())) {
                        tobeunlock.add(item);
                    } else if (currenttime > expiration) {
                        toberemove.add(new Triple<MapleInventoryType, Item, Boolean>(inv, item, false));
                    }
                } else if (item.getItemId() == 5000054 && item.getPet() != null && item.getPet().getSecondsLeft() <= 0) {
                    toberemove.add(new Triple<MapleInventoryType, Item, Boolean>(inv, item, false));
                } else if (item.getPos() == -59) {
                    if (stat == null || stat.getCustomData() == null || Long.parseLong(stat.getCustomData()) < currenttime) {
                        toberemove.add(new Triple<MapleInventoryType, Item, Boolean>(inv, item, true));
                    }
                }
            }
        }
        Item item;
        for (final Triple<MapleInventoryType, Item, Boolean> itemz : toberemove) {
            item = itemz.mid;
            getInventory(itemz.left).removeItem(item.getPos(), item.getQuantity(), false);
            if (itemz.right && getInventory(GameConstants.getInventoryType(item.getItemId())).getNextFreeSlot() > -1) {
                item.setPosition(getInventory(GameConstants.getInventoryType(item.getItemId())).getNextFreeSlot());
                getInventory(GameConstants.getInventoryType(item.getItemId())).addFromDB(item);
            } else {
                ret.add(item.getItemId());
            }
            if (!firstLoad) {
                final Pair<Integer, String> replace = ii.replaceItemInfo(item.getItemId());
                if (replace != null && replace.left > 0) {
                    Item theNewItem = null;
                    if (GameConstants.getInventoryType(replace.left) == MapleInventoryType.EQUIP) {
                        theNewItem = ii.getEquipById(replace.left);
                        theNewItem.setPosition(item.getPos());
                    } else {
                        theNewItem = new Item(replace.left, item.getPos(), (short) 1, (byte) 0);
                    }
                    getInventory(itemz.left).addFromDB(theNewItem);
                }
            }
        }
        for (final Item itemz : tobeunlock) {
            itemz.setExpiration(-1);
            itemz.setFlag((short) (itemz.getFlag() - ItemFlag.LOCK.getValue()));
        }
        this.pendingExpiration = ret;

        final List<Integer> skilz = new ArrayList<Integer>();
        final List<Skill> toberem = new ArrayList<Skill>();
        for (Entry<Skill, SkillEntry> skil : skills.entrySet()) {
            if (skil.getValue().expiration != -1 && currenttime > skil.getValue().expiration) {
                toberem.add(skil.getKey());
            }
        }
        for (Skill skil : toberem) {
            skilz.add(skil.getId());
            this.skills.remove(skil);
            changed_skills = true;
        }
        this.pendingSkills = skilz;
        if (stat != null && stat.getCustomData() != null && Long.parseLong(stat.getCustomData()) < currenttime) { //expired bro
            quests.remove(MapleQuest.getInstance(7830));
            quests.remove(MapleQuest.getInstance(GameConstants.PENDANT_SLOT));
        }
    }

    public MapleShop getShop() {
        return shop;
    }

    public void setShop(MapleShop shop) {
        this.shop = shop;
    }

    public int getTrademe() {
        return trademe;
    }

    public void setTrademe(int a) {
        trademe = a;
    }

    public int getTradechar() {
        return tradechar;
    }

    public void setTradechar(int a) {
        tradechar = a;
    }

    public int getTrademeso() {
        return trademeso;
    }

    public void setTrademeso(int a) {
        trademeso = a;
    }

    public int getItemReqLevel(int upitemid) {
        return MapleItemInformationProvider.getInstance().getReqLevel(upitemid);
    }

    public int getUpItemSlot() {
        return upitemid;
    }

    public void setUpItemSlot(int a) {
        upitemid = a;
    }

    public int getTradeid() {
        return tradeitemid;
    }

    public void setTradeid(int a) {
        tradeitemid = a;
    }

    public int getSHp() {
        return Shp;
    }

    public void setSHp(int a) {
        Shp = a;
    }

    public int getShipHp() {
        return shiphp;
    }

    public void setShipHp(int a) {
        shiphp = a;
    }

    public int getMeso() {
        return meso;
    }

    public final int[] getSavedLocations() {
        return savedLocations;
    }

    public int getSavedLocation(SavedLocationType type) {
        return savedLocations[type.getValue()];
    }

    public void saveLocation(SavedLocationType type) {
        savedLocations[type.getValue()] = getMapId();
        changed_savedlocations = true;
    }

    public void saveLocation(SavedLocationType type, int mapz) {
        savedLocations[type.getValue()] = mapz;
        changed_savedlocations = true;
    }
    
    public void setLocation() {
        saveLocation(SavedLocationType.TOWN);
    }
    
    public int getLocation() {
        return getSavedLocation(SavedLocationType.TOWN);
    }

    public void clearSavedLocation(SavedLocationType type) {
        savedLocations[type.getValue()] = -1;
        changed_savedlocations = true;
    }

    public void gainMeso(int gain, boolean show) {
        gainMeso(gain, show, false);
    }

    public void gainMeso(int gain, boolean show, boolean inChat) {
        gainMeso(gain, show, inChat, false);
    }

    public void gainMeso(int gain, boolean show, boolean inChat, boolean hangDisable) {
        if (meso + gain < 0) {
            client.getSession().write(MaplePacketCreator.enableActions());
            return;
        }

        meso += gain;
//        if (meso >= 1000000) {
//            finishAchievement(31);
//        }
//        if (meso >= 10000000) {
//            finishAchievement(32);
//        }
//        if (meso >= 100000000) {
//            finishAchievement(33);
//        }
//        if (meso >= 1000000000) {
//            finishAchievement(34);
//        }
        updateSingleStat(MapleStat.MESO, meso, hangDisable);
//        client.getSession().write(MaplePacketCreator.enableActions());
        if (show) {
            client.getSession().write(MaplePacketCreator.showMesoGain(gain, inChat));
        }
    }

    public void controlMonster(MapleMonster monster, boolean aggro) {
        if (monster == null) {
            return;
        }
        monster.setController(this);
        controlledLock.writeLock().lock();
        try {
            controlled.add(monster);
        } finally {
            controlledLock.writeLock().unlock();
        }
        if (!isGSD()) {
            client.getSession().write(MobPacket.controlMonster(monster, false, aggro));
        }
        monster.sendStatus(client);
    }

    public void stopControllingMonster(MapleMonster monster) {
        if (monster == null) {
            return;
        }
        controlledLock.writeLock().lock();
        try {
            if (controlled.contains(monster)) {
                controlled.remove(monster);
            }
        } finally {
            controlledLock.writeLock().unlock();
        }
    }

    public void checkMonsterAggro(MapleMonster monster) {
        if (monster == null) {
            return;
        }
        if (monster.getController() == this) {
            monster.setControllerHasAggro(true);
        } else {
            monster.switchController(this, true);
        }
    }

    public int getControlledSize() {
        return controlled.size();
    }

    public int getAccountID() {
        return accountid;
    }

    public void mobKilled(final int id, final int skillID) {

        for (MapleQuestStatus q : quests.values()) {
            if (q.getStatus() != 1 || !q.hasMobKills()) {
                continue;
            }
            if (q.mobKilled(id, skillID)) {
                client.getSession().write(MaplePacketCreator.updateQuestMobKills(q));
                if (q.getQuest().canComplete(this, null)) {
                    client.getSession().write(MaplePacketCreator.getShowQuestCompletion(q.getQuest().getId()));
                }
            }
        }
    }

    public void showQuestCompletion(int qid) {
        client.getSession().write(MaplePacketCreator.getShowQuestCompletion(qid));
    }

    public final List<MapleQuestStatus> getStartedQuests() {
        List<MapleQuestStatus> ret = new LinkedList<MapleQuestStatus>();
        for (MapleQuestStatus q : quests.values()) {
            if (q.getStatus() == 1 && !q.isCustom() && !q.getQuest().isBlocked()) {
                ret.add(q);
            }
        }
        return ret;
    }

    public final List<MapleQuestStatus> getCompletedQuests() {
        List<MapleQuestStatus> ret = new LinkedList<MapleQuestStatus>();
        for (MapleQuestStatus q : quests.values()) {
            if (q.getStatus() == 2 && !q.isCustom() && !q.getQuest().isBlocked()) {
                ret.add(q);
            }
        }
        return ret;
    }

    public final List<Pair<Integer, Long>> getCompletedMedals() {
        List<Pair<Integer, Long>> ret = new ArrayList<Pair<Integer, Long>>();
        for (MapleQuestStatus q : quests.values()) {
            if (q.getStatus() == 2 && !q.isCustom() && !q.getQuest().isBlocked() && q.getQuest().getMedalItem() > 0 && GameConstants.getInventoryType(q.getQuest().getMedalItem()) == MapleInventoryType.EQUIP) {
                ret.add(new Pair<Integer, Long>(q.getQuest().getId(), q.getCompletionTime()));
            }
        }
        return ret;
    }

    public Map<Skill, SkillEntry> getSkills() {
        return Collections.unmodifiableMap(skills);
    }

    public int getTotalSkillLevel(final Skill skill) {
        if (skill == null) {
            return 0;
        }
        final SkillEntry ret = skills.get(skill);
        if (ret == null || ret.skillevel <= 0) {
            return 0;
        }
        return Math.min(skill.getTrueMax(), ret.skillevel);
    }

    public int getAllSkillLevels() {
        int rett = 0;
        for (Entry<Skill, SkillEntry> ret : skills.entrySet()) {
            if (!ret.getKey().isBeginnerSkill() && !ret.getKey().isSpecialSkill() && ret.getValue().skillevel > 0) {
                rett += ret.getValue().skillevel;
            }
        }
        return rett;
    }

    public long getSkillExpiry(final Skill skill) {
        if (skill == null) {
            return 0;
        }
        final SkillEntry ret = skills.get(skill);
        if (ret == null || ret.skillevel <= 0) {
            return 0;
        }
        return ret.expiration;
    }

    public int getSkillLevel(final Skill skill) {
        if (skill == null) {
            return 0;
        }
        final SkillEntry ret = skills.get(skill);
        if (ret == null || ret.skillevel <= 0) {
            return 0;
        }
        return ret.skillevel;
    }

    public byte getMasterLevel(final int skill) {
        return getMasterLevel(SkillFactory.getSkill(skill));
    }

    public byte getMasterLevel(final Skill skill) {
        final SkillEntry ret = skills.get(skill);
        if (ret == null) {
            return 0;
        }
        return ret.masterlevel;
    }

    public int ifimrank() {
        try {
            Connection con = DatabaseConnection.getConnection();
            PreparedStatement ps2 = con.prepareStatement("SELECT name FROM characters ORDER BY level DESC");
            ResultSet rs = ps2.executeQuery();
            int i = 0;
            int fucker = 0;
            while (rs.next()) {
                i++;
                if (rs.getString("name").equals(getName())) {
                    fucker = i;
                    break;
                }
            }
            rs.close();
            ps2.close();
            return fucker;
        } catch (SQLException e) {
            return 999;
        }
    }

    public boolean 주흔모드체크() {
        return scrollmode;
    }

    public void 주흔모드설정(boolean aa) {
        scrollmode = aa;
    }

    public void levelUp() {
        remainingAp += 5;
        int maxhp = stats.getMaxHp();
        int maxmp = stats.getMaxMp();

        if (job == 0 || job == 1000 || job == 2000) { // Beginner
            maxhp += Randomizer.rand(12, 16);
            maxmp += Randomizer.rand(10, 12);
        } else if ((job >= 100 && job <= 132)) { // Warrior
            final Skill improvingMaxHP = SkillFactory.getSkill(1000001);
            final int slevel = getSkillLevel(improvingMaxHP);
            if (slevel > 0) {
                maxhp += improvingMaxHP.getEffect(slevel).getX();
            }
            maxhp += Randomizer.rand(24, 28);
            maxmp += Randomizer.rand(4, 6);
        } else if (job >= 1100 && job <= 1111) {
            final Skill improvingMaxHP = SkillFactory.getSkill(11000000);
            final int slevel = getSkillLevel(improvingMaxHP);
            if (slevel > 0) {
                maxhp += improvingMaxHP.getEffect(slevel).getX();
            }
            maxhp += Randomizer.rand(24, 28);
            maxmp += Randomizer.rand(4, 6);
        } else if (job >= 200 && job <= 232) { // Magician
            final Skill improvingMaxMP = SkillFactory.getSkill(2000001);
            final int slevel = getSkillLevel(improvingMaxMP);
            if (slevel > 0) {
                maxmp += improvingMaxMP.getEffect(slevel).getX() * 2;
            }
            maxhp += Randomizer.rand(10, 14);
            maxmp += Randomizer.rand(22, 24);
        } else if (job >= 1200 && job <= 1212) { // Magician
            final Skill improvingMaxMP = SkillFactory.getSkill(12000000);
            final int slevel = getSkillLevel(improvingMaxMP);
            if (slevel > 0) {
                maxmp += improvingMaxMP.getEffect(slevel).getX() * 2;
            }
            maxhp += Randomizer.rand(10, 14);
            maxmp += Randomizer.rand(22, 24);
        } else if ((job >= 300 && job <= 322) || (job >= 400 && job <= 434) || (job >= 1300 && job <= 1311) || (job >= 1400 && job <= 1411)) { // Bowman, Thief, Wind Breaker and Night Walker
            maxhp += Randomizer.rand(20, 24);
            maxmp += Randomizer.rand(14, 16);
        } else if ((job >= 510 && job <= 512) || (job >= 1510 && job <= 1512)) { // Pirate
            final Skill improvingMaxHP = SkillFactory.getSkill((job / 1000 * 10000000) + 5100000);
            final int slevel = getSkillLevel(improvingMaxHP);
            if (slevel > 0) {
                maxhp += improvingMaxHP.getEffect(slevel).getX();
            }
            maxhp += Randomizer.rand(37, 41);
            maxmp += Randomizer.rand(18, 22);
        } else if ((job >= 500 && job <= 532) || job == 1500) { // Pirate
            maxhp += Randomizer.rand(20, 24);
            maxmp += Randomizer.rand(18, 22);
        }
        maxmp += stats.getTotalInt() / 10;

        if ((getTotalSkillLevel(1000001) > 0)) {
            getStat().maxhp += SkillFactory.getSkill(1000001).getEffect(getTotalSkillLevel(1000001)).getX();
        }
        if ((getTotalSkillLevel(11000000) > 0)) {
            getStat().maxhp += SkillFactory.getSkill(11000000).getEffect(getTotalSkillLevel(11000000)).getX();
        }
        if ((getTotalSkillLevel(2000001) > 0)) {
            getStat().maxmp += SkillFactory.getSkill(2000001).getEffect(getTotalSkillLevel(2000001)).getX();
        }

        exp -= getNeededExp();
        level += 1;


        if (level
                == 200 && !isGM()
                && getJob() / 100 != 5) {
            final StringBuilder sb = new StringBuilder("[축하] ");
            final Item medal = getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -21);
            if (medal != null) { // Medal
                sb.append("<");
                sb.append(MapleItemInformationProvider.getInstance().getName(medal.getItemId()));
                sb.append("> ");
            }
            sb.append(getName());
            sb.append(" 님이 레벨 200을 달성하셨습니다. 모두 축하해 주세요.");
            World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, sb.toString()));
            int map = 0;
            switch (getJob() / 100) {
                case 1:
                    map = 102000003;
                    break;
                case 2:
                    map = 101000003;
                    break;
                case 3:
                    map = 100000201;
                    break;
                case 4:
                    map = 103000003;
                    break;
            }
            int npc = 9901000;
            npc += ((getJob() / 100) - 1) * 100;
            MapleMap nmap = getClient().getChannelServer().getMapFactory().getMap(map);
            int count = 0;
            for (PlayerNPC pnpc : getClient().getChannelServer().getAllPlayerNPC()) {
                if (pnpc.getMapId() == map) {
                    ++count;
                }
            }
            if (count < 20) {
                npc += count;
                MapleNPC npctemplate = nmap.getNPCById(npc);
                if (null != npctemplate) {
                    PlayerNPC newpnpc = new PlayerNPC(this, npc, nmap, npctemplate.getTruePosition().x, npctemplate.getTruePosition().y, npctemplate.getF(), npctemplate.getFh());
                    newpnpc.addToServer();
                    PlayerNPC.sendBroadcastModifiedNPC(this, nmap, npc, false);
                    dropMessage(1, "만렙 축하의 의미로 자신의 엔피시가 직업 전직관에 생겨났습니다!");
                    dropMessage(5, "만렙 축하의 의미로 자신의 엔피시가 직업 전직관에 생겨났습니다!");
                }
            }
        }
        maxhp = Math.min(30000, Math.abs(maxhp));
        maxmp = Math.min(30000, Math.abs(maxmp));

        final Map<MapleStat, Integer> statup = new EnumMap<MapleStat, Integer>(MapleStat.class
        );

        statup.put(MapleStat.MAXHP, maxhp);

        statup.put(MapleStat.MAXMP, maxmp);

        statup.put(MapleStat.HP, maxhp);

        statup.put(MapleStat.MP, maxmp);

        statup.put(MapleStat.EXP, exp);

        statup.put(MapleStat.LEVEL,
                (int) level
        );

        if (isGM() || !GameConstants.isBeginnerJob(job)) { // Not Beginner, Nobless and Legend
            remainingSp[GameConstants.getSkillBook(this.job)] += 3;
            client.getSession().write(MaplePacketCreator.updateSp(this, false));
        }

        statup.put(MapleStat.AVAILABLEAP,
                (int) remainingAp
        );
        stats.setInfo(maxhp, maxmp, maxhp, maxmp);

        client.getSession()
                .write(MaplePacketCreator.updatePlayerStats(statup, getJob()));
        map.broadcastMessage(this, MaplePacketCreator.showForeignEffect(getId(), 0), false);
        stats.recalcLocalStats(
                this);
        silentPartyUpdate();

        if (getGuildId()
                > 0) {
            getGuild().gainGP(getLevel() - 1);
            World.Guild.guildPacket(getGuildId(), MaplePacketCreator.serverNotice(5, "<길드알림> " + getName() + "님이 레벨업하셨습니다. " + (getLevel() - 1) + "GP를 획득하였습니다."));
        }

        guildUpdate();

        familyUpdate();
    }

    public void familyUpdate() {
        if (mfc == null) {
            return;
        }
        World.Family.memberFamilyUpdate(mfc, this);
    }

    public void changeKeybinding(int key, byte type, int action) {
        if (type != 0) {
            keylayout.Layout().put(Integer.valueOf(key), new Pair<Byte, Integer>(type, action));
        } else {
            keylayout.Layout().remove(Integer.valueOf(key));
        }
    }

    public void sendMacros() {
        for (int i = 0; i < 5; i++) {
            if (skillMacros[i] != null) {
                client.getSession().write(MaplePacketCreator.getMacros(skillMacros));
                break;
            }
        }
    }

    /*public void setGuildMap(int guildid, int newprice, int mapid) throws SQLException {
        Connection con = DatabaseConnection.getConnection();
        PreparedStatement ps = con.prepareStatement("UPDATE GuildMap SET guild = ? , price = ? WHERE mapid = ?");
        ps.setInt(1, guildid);
        ps.setInt(2, newprice);
        ps.setInt(3, mapid);
        ps.executeUpdate();
    }*/
/*
    public int getGuildMap(int mapid) throws SQLException {
        Connection con = DatabaseConnection.getConnection();
        PreparedStatement ps;
        try {
            ps = con.prepareStatement("SELECT * FROM guildmap where mapid = ?");
            ps.setInt(1, mapid);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("guild");
            }
            ps.close();
            rs.close();
        } catch (SQLException ex) {
        }
        return 0;
    }
*/
    /*public int getGuildMapPrice(int mapid) throws SQLException {
        Connection con = DatabaseConnection.getConnection();
        PreparedStatement ps;
        try {
            ps = con.prepareStatement("SELECT * FROM guildmap where mapid = ?");
            ps.setInt(1, mapid);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("price");
            }
            ps.close();
            rs.close();
        } catch (SQLException ex) {
        }
        return 0;
    }*/

    public void updateMacros(int position, SkillMacro updateMacro) {
        skillMacros[position] = updateMacro;
        changed_skillmacros = true;
    }

    public final SkillMacro[] getMacros() {
        return skillMacros;
    }

    public void tempban(String reason, Calendar duration, int greason, boolean IPMac, String banby) {
        if (IPMac) {
            client.banHwID();
        }
//        client.getSession().write(MaplePacketCreator.GMPoliceMessage());
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps;
            if (IPMac) {
                ps = con.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
                ps.setString(1, client.getIp());
                ps.execute();
                ps.close();
            }

            client.getSession().close(true);

            ps = con.prepareStatement("UPDATE accounts SET tempban = ?, banreason = ?, greason = ?, banby = ? WHERE id = ?");
            Timestamp TS = new Timestamp(duration.getTimeInMillis());
            ps.setTimestamp(1, TS);
            ps.setString(2, reason);
            ps.setInt(3, greason);
            ps.setString(4, banby);
            ps.setInt(5, accountid);
            ps.execute();
            ps.close();
        } catch (SQLException ex) {
            System.err.println("Error while tempbanning" + ex);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }

    }

    public static boolean tempban(String reason, Calendar duration, int greason, String banby, String name) {
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps;

            int accid = MapleCharacterUtil.getAccIdByName(name);
            if (accid == -1) {
                return false;
            }

            ps = con.prepareStatement("UPDATE accounts SET tempban = ?, banreason = ?, greason = ?, banby = ? WHERE id = ?");
            Timestamp TS = new Timestamp(duration.getTimeInMillis());
            ps.setTimestamp(1, TS);
            ps.setString(2, reason);
            ps.setInt(3, greason);
            ps.setString(4, banby);
            ps.setInt(5, accid);
            ps.execute();
            ps.close();
        } catch (SQLException ex) {
            System.err.println("Error while tempbanning" + ex);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return true;
    }

    public final boolean ban(String reason, boolean IPMac, boolean autoban, boolean hellban, String banby) {
        if (lastmonthfameids == null) {
            throw new RuntimeException("Trying to ban a non-loaded character (testhack)");
        }

        Connection con = null;

        client.getSession().write(MaplePacketCreator.GMPoliceMessage());
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps = con.prepareStatement("UPDATE accounts SET banned = ?, banreason = ?, banby = ? WHERE id = ?");
            ps.setInt(1, autoban ? 2 : 1);
            ps.setString(2, reason);
            ps.setString(3, banby);
            ps.setInt(4, accountid);
            ps.execute();
            ps.close();

            if (IPMac) {
                client.banHwID();
                ps = con.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
                ps.setString(1, client.getSessionIPAddress());
                ps.execute();
                ps.close();

                if (hellban) {
                    PreparedStatement psa = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
                    psa.setInt(1, accountid);
                    ResultSet rsa = psa.executeQuery();
                    if (rsa.next()) {
                        PreparedStatement pss = con.prepareStatement("UPDATE accounts SET banned = ?, banreason = ?, banby = ? WHERE email = ? OR SessionIP = ?");
                        pss.setInt(1, autoban ? 2 : 1);
                        pss.setString(2, reason);
                        pss.setString(3, banby);
                        pss.setString(4, rsa.getString("email"));
                        pss.setString(5, client.getSessionIPAddress());
                        pss.execute();
                        pss.close();
                    }
                    rsa.close();
                    psa.close();
                    LoginHelper.doBan(rsa);

                }
            }
        } catch (SQLException ex) {
            System.err.println("Error while banning" + ex + " target : " + getName() + "(" + getId() + ")");
            return false;
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        client.getSession().close(true);
        return true;
    }

    public static boolean ban(String id, String reason, boolean accountId, int gmlevel, boolean hellban, String banby) {
        int z = 0;
        Connection con = null;
        try {
            con = DatabaseConnection.getConnection();
            PreparedStatement ps;
            if (id.matches("/[0-9]{1,3}\\..*")) {
                Connection con2 = DatabaseConnection_XE.getConnection();
                ps = con2.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
                ps.setString(1, id);
                ps.execute();
                ps.close();
                return true;
            }
            if (accountId) {
                ps = con.prepareStatement("SELECT id FROM accounts WHERE name = ?");
            } else {
                ps = con.prepareStatement("SELECT accountid FROM characters WHERE name = ?");
            }
            boolean ret = false;
            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                z = rs.getInt(1);
                PreparedStatement psb = con.prepareStatement("UPDATE accounts SET banned = 1, banreason = ?, banby = ? WHERE id = ? AND gm < ?");
                psb.setString(1, reason);
                psb.setString(2, banby);
                psb.setInt(3, z);
                psb.setInt(4, gmlevel);
                psb.execute();
                psb.close();

                if (gmlevel > 100) { //admin ban
                    PreparedStatement psa = con.prepareStatement("SELECT * FROM accounts WHERE id = ?");
                    psa.setInt(1, z);
                    ResultSet rsa = psa.executeQuery();
                    if (rsa.next()) {
                        String sessionIP = rsa.getString("sessionIP");
                        if (sessionIP != null && sessionIP.matches("/[0-9]{1,3}\\..*")) {
                            Connection con2 = DatabaseConnection_XE.getConnection();
                            PreparedStatement psz = con2.prepareStatement("INSERT INTO ipbans VALUES (DEFAULT, ?)");
                            psz.setString(1, sessionIP);
                            psz.execute();
                            psz.close();
                        }
                        if (rsa.getString("macs") != null) {
                            MapleClient.banHwID(rsa.getString("macs"));
                        }
                        if (hellban) {
                            PreparedStatement pss = con.prepareStatement("UPDATE accounts SET banned = 1, banreason = ?, banby = ? WHERE email = ?" + (sessionIP == null ? "" : " OR SessionIP = ?"));
                            pss.setString(1, reason);
                            pss.setString(2, banby);
                            pss.setString(3, rsa.getString("email"));
                            if (sessionIP != null) {
                                pss.setString(4, sessionIP);
                            }
                            pss.execute();
                            pss.close();
                            LoginHelper.doBan(rsa);
                        }
                    }
                    rsa.close();
                    psa.close();
                }
                ret = true;
            }
            rs.close();
            ps.close();
            return ret;
        } catch (SQLException ex) {
            System.err.println("Error while banning" + ex + " target : " + id + "(" + z + ")");
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return false;
    }

    /**
     * Oid of players is always = the cid
     */
    @Override
    public int getObjectId() {
        return getId();
    }

    /**
     * Throws unsupported operation exception, oid of players is read only
     */
    @Override
    public void setObjectId(int id) {
        throw new UnsupportedOperationException();
    }

    public MapleStorage getStorage() {
        return storage;
    }

    public void addVisibleMapObject(MapleMapObject mo) {
        visibleMapObjectsLock.writeLock().lock();
        try {
            visibleMapObjects.add(mo);
        } finally {
            visibleMapObjectsLock.writeLock().unlock();
        }
    }

    public void removeVisibleMapObject(MapleMapObject mo) {
        visibleMapObjectsLock.writeLock().lock();
        try {
            visibleMapObjects.remove(mo);
        } finally {
            visibleMapObjectsLock.writeLock().unlock();
        }
    }

    public boolean isMapObjectVisible(MapleMapObject mo) {
        visibleMapObjectsLock.readLock().lock();
        try {
            return visibleMapObjects.contains(mo);
        } finally {
            visibleMapObjectsLock.readLock().unlock();
        }
    }

    public Collection<MapleMapObject> getAndWriteLockVisibleMapObjects() {
        visibleMapObjectsLock.writeLock().lock();
        return visibleMapObjects;
    }

    public void unlockWriteVisibleMapObjects() {
        visibleMapObjectsLock.writeLock().unlock();
    }

    public boolean isAlive() {
        return stats.getHp() > 0;
    }

    @Override
    public void sendDestroyData(MapleClient client) {
        client.getSession().write(MaplePacketCreator.removePlayerFromMap(this.getObjectId()));
        //don't need this, client takes care of it
        /*if (dragon != null) {
         client.getSession().write(MaplePacketCreator.removeDragon(this.getId()));
         }
         if (android != null) {
         client.getSession().write(MaplePacketCreator.deactivateAndroid(this.getId()));
         }
         if (summonedFamiliar != null) {
         client.getSession().write(MaplePacketCreator.removeFamiliar(this.getId()));
         }*/
    }

    @Override
    public void sendSpawnData(MapleClient client) {
        if (client.getPlayer().allowedToTarget(this)) {
            client.getSession().write(MaplePacketCreator.spawnPlayerMapobject(this));
            sendTemporaryStats();
            client.getPlayer().receivePartyMemberHP();
            for (final MaplePet pet : pets) {
                if (pet.getSummoned()) {
                    client.getSession().write(PetPacket.showPet(this, pet, false, false));
                    break;
                }
            }
            if (summons != null && summons.size() > 0) {
                summonsLock.readLock().lock();
                try {
                    for (final MapleSummon summon : summons) {
                        if (client != getClient()) {
                            client.getSession().write(MaplePacketCreator.spawnSummon(summon, false));
                        }
                    }
                } finally {
                    summonsLock.readLock().unlock();
                }
            }
        }
    }

    public final void equipChanged() {
        if (map == null) {
            return;
        }
        map.broadcastMessage(this, MaplePacketCreator.updateCharLook(this), false);
        stats.recalcLocalStats(this);
        if (getMessenger() != null) {
            World.Messenger.updateMessenger(getMessenger().getId(), getName(), client.getChannel());
        }
    }

    public final MaplePet getPet(final int index) {
        byte count = 0;
        for (final MaplePet pet : pets) {
            if (pet.getSummoned()) {
                if (count == index) {
                    return pet;
                }
                count++;
            }
        }
        return null;
    }

    public void removePetCS(MaplePet pet) {
        pets.remove(pet);
    }

    public void addPet(final MaplePet pet) {
        if (pets.contains(pet)) {
            pets.remove(pet);
        }
        pets.add(pet);
        // So that the pet will be at the last
        // Pet index logic :(
    }

    public void removePet(MaplePet pet) {
        pet.setSummoned(0);
    }

    public final byte getPetIndex(final MaplePet petz) {
        byte count = 0;
        for (final MaplePet pet : pets) {
            if (pet.getSummoned()) {
                if (pet.getUniqueId() == petz.getUniqueId()) {
                    return count;
                }
                count++;
            }
        }
        return -1;
    }

    public final byte getPetIndex(final int petId) {
        byte count = 0;
        for (final MaplePet pet : pets) {
            if (pet.getSummoned()) {
                if (pet.getUniqueId() == petId) {
                    return count;
                }
                count++;
            }
        }
        return -1;
    }

    public final List<MaplePet> getSummonedPets() {
        List<MaplePet> ret = new ArrayList<MaplePet>();
        for (final MaplePet pet : pets) {
            if (pet.getSummoned()) {
                ret.add(pet);
            }
        }
        return ret;
    }

    public final byte getPetById(final int petId) {
        byte count = 0;
        for (final MaplePet pet : pets) {
            if (pet.getSummoned()) {
                if (pet.getPetItemId() == petId) {
                    return count;
                }
                count++;
            }
        }
        return -1;
    }

    public final List<MaplePet> getPets() {
        return pets;
    }

    public final void unequipAllPets() {
        for (final MaplePet pet : pets) {
            if (pet != null) {
                unequipPet(pet, false);
            }
        }
    }

    public void unequipPet(MaplePet pet, boolean hunger) {
        if (pet.getSummoned()) {
            pet.saveToDb();

            client.getSession().write(PetPacket.updatePet(pet, getInventory(MapleInventoryType.CASH).getItem((byte) pet.getInventoryPosition()), false));
            if (map != null) {
                map.broadcastMessage(this, PetPacket.showPet(this, pet, true, hunger), true);
            }
            removePet(pet);
            //List<Pair<MapleStat, Integer>> stats = new ArrayList<Pair<MapleStat, Integer>>();
            //stats.put(MapleStat.PET, Integer.valueOf(0)));
            //showpetupdate isn't done here...
            //if (GameConstants.GMS) {
            //    client.getSession().write(PetPacket.petStatUpdate(this));
            //}
            client.getSession().write(MaplePacketCreator.updatePlayerStats(Collections.singletonMap(MapleStat.PET, 0), 0));
            client.getSession().write(MaplePacketCreator.enableActions());
        }
    }

    /*    public void shiftPetsRight() {
     if (pets[2] == null) {
     pets[2] = pets[1];
     pets[1] = pets[0];
     pets[0] = null;
     }
     }*/
    public final long getLastFameTime() {
        return lastfametime;
    }

    public final List<Integer> getFamedCharacters() {
        return lastmonthfameids;
    }

    public final List<Integer> getBattledCharacters() {
        return lastmonthbattleids;
    }

    public FameStatus canGiveFame(MapleCharacter from) {
        if (lastfametime >= System.currentTimeMillis() - 60 * 60 * 24 * 1000) {
            return FameStatus.NOT_TODAY;
        } else if (from == null || lastmonthfameids == null || lastmonthfameids.contains(Integer.valueOf(from.getId()))) {
            return FameStatus.NOT_THIS_MONTH;
        }
        return FameStatus.OK;
    }

    public void hasGivenFame(MapleCharacter to) {
        lastfametime = System.currentTimeMillis();
        lastmonthfameids.add(Integer.valueOf(to.getId()));
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO famelog (characterid, characterid_to) VALUES (?, ?)");
            ps.setInt(1, getId());
            ps.setInt(2, to.getId());
            ps.execute();
        } catch (SQLException e) {
            System.err.println("ERROR writing famelog for char " + getName() + " to " + to.getName() + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public boolean canBattle(MapleCharacter to) {
        if (to == null || lastmonthbattleids == null || lastmonthbattleids.contains(Integer.valueOf(to.getAccountID()))) {
            return false;
        }
        return true;
    }

    public void hasBattled(MapleCharacter to) {
        lastmonthbattleids.add(Integer.valueOf(to.getAccountID()));
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO battlelog (accid, accid_to) VALUES (?, ?)");
            ps.setInt(1, getAccountID());
            ps.setInt(2, to.getAccountID());
            ps.execute();
        } catch (SQLException e) {
            System.err.println("ERROR writing battlelog for char " + getName() + " to " + to.getName() + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public final MapleKeyLayout getKeyLayout() {
        return this.keylayout;
    }

    public MapleParty getParty() {
        if (party == null) {
            return null;
        } else if (party.isDisbanded()) {
            party = null;
        }
        return party;
    }

    public byte getWorld() {
        return world;
    }

    public void setWorld(byte world) {
        this.world = world;
    }

    public void setParty(MapleParty party) {
        this.party = party;
    }

    public MapleTrade getTrade() {
        return trade;
    }

    public void setTrade(MapleTrade trade) {
        this.trade = trade;
    }

    public EventInstanceManager getEventInstance() {
//        if (eventInstance == null && isGM()) {
//            dropMessage(5, "심각 : 인스턴스 요청을 했지만 현재 캐릭터의 인스턴스가 발견되지 않음.");
//        }
        return eventInstance;
    }

    public void setEventInstance(EventInstanceManager eventInstance) {
        this.eventInstance = eventInstance;
    }

    public void addDoor(MapleDoor door) {
        doors.add(door);
    }

    public void clearDoors() {
        doors.clear();
    }

    public List<MapleDoor> getDoors() {
        return new ArrayList<MapleDoor>(doors);
    }

    public void setSmega() {
        if (smega) {
            smega = false;
            dropMessage(5, "You have set megaphone to disabled mode");
        } else {
            smega = true;
            dropMessage(5, "You have set megaphone to enabled mode");
        }
    }

    public boolean getSmega() {
        return smega;
    }

    public List<MapleSummon> getSummonsReadLock() {
        summonsLock.readLock().lock();
        return summons;
    }

    public int getSummonsSize() {
        return summons.size();
    }

    public void unlockSummonsReadLock() {
        summonsLock.readLock().unlock();
    }

    public void addSummon(MapleSummon s) {
        summonsLock.writeLock().lock();
        try {
            summons.add(s);
        } finally {
            summonsLock.writeLock().unlock();
        }
    }

    public void removeSummon(MapleSummon s) {
        summonsLock.writeLock().lock();
        try {
            summons.remove(s);
        } finally {
            summonsLock.writeLock().unlock();
        }
    }

    public int getChair() {
        return chair;
    }

    public int getItemEffect() {
        return itemEffect;
    }

    public void setChair(int chair) {
        this.chair = chair;
        stats.relocHeal(this);
    }

    public void setItemEffect(int itemEffect) {
        this.itemEffect = itemEffect;
    }

    @Override
    public MapleMapObjectType getType() {
        return MapleMapObjectType.PLAYER;
    }

    public int getGuildId() {
        return guildid;
    }

    public byte getGuildRank() {
        return guildrank;
    }

    public void setGuildId(int _id) {
        guildid = _id;
        if (guildid > 0) {
            if (mgc == null) {
                mgc = new MapleGuildCharacter(this);
            } else {
                mgc.setGuildId(guildid);
            }
        } else {
            mgc = null;
        }
    }

    public void setGuildRank(byte _rank) {
        guildrank = _rank;
        if (mgc != null) {
            mgc.setGuildRank(_rank);
        }
    }

    public MapleGuildCharacter getMGC() {
        return mgc;
    }

    public void setAllianceRank(byte rank) {
        allianceRank = rank;
        if (mgc != null) {
            mgc.setAllianceRank(rank);
        }
    }

    public byte getAllianceRank() {
        return allianceRank;
    }

    public MapleGuild getGuild() {
        if (getGuildId() <= 0) {
            return null;
        }
        return World.Guild.getGuild(getGuildId());
    }

    public void setJob(int j) {
        this.job = (short) j;
    }

    public void guildUpdate() {
        if (guildid <= 0) {
            return;
        }
        mgc.setLevel((short) level);
        mgc.setJobId(job);
        World.Guild.memberLevelJobUpdate(mgc);
    }

    public void saveGuildStatus() {
        MapleGuild.setOfflineGuildStatus(guildid, guildrank, allianceRank, id);
    }

    public void modifyCSPoints(int type, int quantity) {
        modifyCSPoints(type, quantity, false);
    }

    public void modifyCSPoints(int type, int quantity, boolean show) {

        if (goDonateCashShop) {
            type = 3;
        }

        switch (type) {
            case 1:
                if (acash + quantity < 0) {
                    if (show) {
                        dropMessage(-1, "캐시를 더 받을 수 없습니다. 캐시가 지급되지 않습니다.");
                    }
                    return;
                }
                acash += quantity;
                break;
            case 2:
                if (maplepoints + quantity < 0) {
                    if (show) {
                        dropMessage(-1, "메이플포인트를 더 받을 수 없습니다. 캐시가 지급되지 않습니다.");
                    }
                    return;
                }
                maplepoints += quantity;
                break;
            case 3:
                if (donatecash + quantity < 0) {
                    if (show) {
                        dropMessage(-1, "-");
                    }
                    return;
                }
                donatecash += quantity;
                break;

            default:
                break;
        }
        if (show && quantity != 0) {
            dropMessage(6, quantity + " 만큼의 " + (type == 1 ? "캐시를 " : type == 3 ? "후원보상 캐시를 " : " 메이플포인트를 ") + (quantity > 0 ? "얻었습니다." : "잃었습니다."));
            //client.getSession().write(MaplePacketCreator.showSpecialEffect(21));
        }
    }

    public int getRealP(int type) {
        if (type == 1) {
            return acash;
        }
        if (type == 2) {
            return maplepoints;
        }
        return 0;
    }

    public int getCSPoints(int type) {
        if (goDonateCashShop) {
//            System.out.println ("Real Acash : "+acash+" Real MPoints : "+maplepoints);
            type = 3;
        }
        switch (type) {
            case 1:
                return acash;
            case 2:
                return maplepoints;
            case 3:
                return donatecash;
            default:
                return 0;
        }
    }

    public final boolean hasEquipped(int itemid) {
        return inventory[MapleInventoryType.EQUIPPED.ordinal()].countById(itemid) >= 1;
    }

    public final boolean haveItem(int itemid, int quantity, boolean checkEquipped, boolean greaterOrEquals) {
        final MapleInventoryType type = GameConstants.getInventoryType(itemid);
        int possesed = inventory[type.ordinal()].countById(itemid);
        if (checkEquipped && type == MapleInventoryType.EQUIP) {
            possesed += inventory[MapleInventoryType.EQUIPPED.ordinal()].countById(itemid);
        }
        if (greaterOrEquals) {
            return possesed >= quantity;
        } else {
            return possesed == quantity;
        }
    }

    public final boolean haveItem(int itemid, int quantity) {
        return haveItem(itemid, quantity, true, true);
    }

    public final boolean haveItem(int itemid) {
        return haveItem(itemid, 1, true, true);
    }

    private void sendTemporaryStats() {
        MapleStatEffect eff = getStatForBuff(MapleBuffStat.MONSTER_RIDING);
        if (eff != null) {
            map.broadcastMessage(this, TemporaryStatsPacket.giveForeignMount(id, MapleStatEffect.parseMountInfo_Pure(this, eff.getSourceId()), eff.getSourceId(), MapleBuffStat.MONSTER_RIDING), false);
        }
        Integer val = getBuffedValue(MapleBuffStat.ENERGY_CHARGE);
        if (val != null) {
            map.broadcastMessage(this, TemporaryStatsPacket.giveEnergyChargeTest(id, 10000, 50), false);
        }
        eff = getStatForBuff(MapleBuffStat.DASH_SPEED);
        if (eff != null) {
            map.broadcastMessage(this, TemporaryStatsPacket.giveForeignPirate(Collections.singletonMap(MapleBuffStat.DASH_SPEED, getBuffedValue(MapleBuffStat.DASH_SPEED)), eff.getDuration() / 1000, id, eff.getSourceId()), false);
        }
    }

    public boolean isSearchingParty() {
        return searchingParty;
    }

    public void searchParty() {
        for (MapleCharacter chr : map.getCharacters()) {
            if (chr.getId() != id && chr.getParty() == null && chr.getLevel() >= psearch_minLevel && chr.getLevel() <= psearch_maxLevel && (psearch_jobs.isEmpty() || psearch_jobs.contains(Integer.valueOf(chr.getJob()))) && (isGM() || !chr.isGM())) {
                if (party != null && party.getMembers().size() < 6 && party.getMembers().size() < psearch_membersNeeded) {
                    if (party.getMembers().size() < 6) {
                        //c.getSession().write(MaplePacketCreator.partyStatusMessage(22, invited.getName()));
                        chr.getClient().getSession().write(MaplePacketCreator.partyInvite(this, true));
                    }
                    //chr.setParty(party);
                    //World.Party.updateParty(party.getId(), PartyOperation.JOIN, new MaplePartyCharacter(chr));
                    //chr.receivePartyMemberHP();
                    //chr.updatePartyMemberHP();
                } else {
                    searchingParty = false;
                    break;

                }
            }
        }
    }

    public static enum FameStatus {

        OK, NOT_TODAY, NOT_THIS_MONTH
    }

    public byte getBuddyCapacity() {
        return buddylist.getCapacity();
    }

    public void setBuddyCapacity(byte capacity) {
        buddylist.setCapacity(capacity);
        client.getSession().write(MaplePacketCreator.updateBuddyCapacity(capacity));
    }

    public MapleMessenger getMessenger() {
        return messenger;
    }

    public void setMessenger(MapleMessenger messenger) {
        this.messenger = messenger;
    }

    public void addCooldown(int skillId, long startTime, long length) {
        coolDowns.put(Integer.valueOf(skillId), new MapleCoolDownValueHolder(skillId, startTime, length));
    }

    public void removeCooldown(int skillId) {
        if (coolDowns.containsKey(Integer.valueOf(skillId))) {
            coolDowns.remove(Integer.valueOf(skillId));
        }
    }

    public boolean skillisCooling(int skillId) {
        return coolDowns.containsKey(Integer.valueOf(skillId));
    }

    public void giveCoolDowns(final int skillid, long starttime, long length) {
        addCooldown(skillid, starttime, length);
    }

    public void giveCoolDowns(final List<MapleCoolDownValueHolder> cooldowns) {
        int time;
        if (cooldowns != null) {
            for (MapleCoolDownValueHolder cooldown : cooldowns) {
                coolDowns.put(cooldown.skillId, cooldown);
            }
        } else {
            Connection con = null;
            PreparedStatement ps = null;
            ResultSet rs = null;
            try {
                con = DatabaseConnection.getConnection();
                ps = con.prepareStatement("SELECT SkillID,StartTime,length FROM skills_cooldowns WHERE charid = ?");
                ps.setInt(1, getId());
                rs = ps.executeQuery();
                while (rs.next()) {
                    if (rs.getLong("length") + rs.getLong("StartTime") - System.currentTimeMillis() <= 0) {
                        continue;
                    }
                    giveCoolDowns(rs.getInt("SkillID"), rs.getLong("StartTime"), rs.getLong("length"));
                }
                deleteWhereCharacterId(con, "DELETE FROM skills_cooldowns WHERE charid = ?");
            } catch (SQLException e) {
                System.err.println("Error while retriving cooldown from SQL storage");
            } finally {
                if (con != null) {
                    try {
                        con.close();
                    } catch (Exception e) {
                    }
                }
                if (rs != null) {
                    try {
                        rs.close();
                    } catch (Exception e) {
                    }
                }
                if (ps != null) {
                    try {
                        ps.close();
                    } catch (Exception e) {
                    }
                }
            }
        }
    }

    public int getCooldownSize() {
        return coolDowns.size();
    }

    public int getDiseaseSize() {
        return diseases.size();
    }

    public List<MapleCoolDownValueHolder> getCooldowns() {
        List<MapleCoolDownValueHolder> ret = new ArrayList<MapleCoolDownValueHolder>();
        for (MapleCoolDownValueHolder mc : coolDowns.values()) {
            if (mc != null) {
                ret.add(mc);
            }
        }
        return ret;
    }

    public final List<MapleDiseaseValueHolder> getAllDiseases() {
        return new ArrayList<MapleDiseaseValueHolder>(diseases.values());
    }

    public final boolean hasDisease(final MapleDisease dis) {
        return diseases.containsKey(dis);
    }

    public void giveDebuff(final MapleDisease disease, MobSkill skill) {
        giveDebuff(disease, skill.getX(), skill.getDuration(), skill.getSkillId(), skill.getSkillLevel());
    }

    public void giveDebuff(final MapleDisease disease, int x, long duration, int skillid, int level) {
        if (map != null && !hasDisease(disease)) {
            if (disease != MapleDisease.SEDUCE && disease != MapleDisease.STUN) {
                if (getBuffedValue(MapleBuffStat.HOLY_SHIELD) != null) {
                    return;
                }
            }
            diseases.put(disease, new MapleDiseaseValueHolder(disease, System.currentTimeMillis(), duration));
            client.getSession().write(TemporaryStatsPacket.giveDebuff(disease, x, skillid, level, (int) duration));
            map.broadcastMessage(this, TemporaryStatsPacket.giveForeignDebuff(id, disease, skillid, level, x), false);

            if (x > 0 && disease == MapleDisease.POISON) { //poison, subtract all HP
                addHP((int) -x);
            }
        }
    }

    public final void giveSilentDebuff(final List<MapleDiseaseValueHolder> ld) {
        if (ld != null) {
            for (final MapleDiseaseValueHolder disease : ld) {
                diseases.put(disease.disease, disease);
            }
        }
    }

    public void dispelDebuff(MapleDisease debuff) {
        if (hasDisease(debuff)) {
            client.getSession().write(TemporaryStatsPacket.cancelDebuff(debuff));
            map.broadcastMessage(this, TemporaryStatsPacket.cancelForeignDebuff(id, debuff), false);

            diseases.remove(debuff);
        }
    }

    public void dispelDebuffs() {
        List<MapleDisease> diseasess = new ArrayList<MapleDisease>(diseases.keySet());
        for (MapleDisease d : diseasess) {
            dispelDebuff(d);
        }
    }

    public void cancelAllDebuffs() {
        diseases.clear();
    }

    public void setLevel(final short level) {
        this.level = (short) (level - 1);
    }

    public void sendNote(String to, String msg) {
        sendNote(to, msg, 0);
    }

    public void sendNote(String to, String msg, int fame) {
        MapleCharacterUtil.sendNote(to, getName(), msg, fame);
    }

    public void showNote() {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM notes WHERE `to`=?", ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            ps.setString(1, getName());
            rs = ps.executeQuery();
            rs.last();
            int count = rs.getRow();
            rs.first();
            client.getSession().write(CSPacket.showNotes(this, rs, count));
        } catch (SQLException e) {
            System.err.println("Unable to show note" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public void deleteNote(int id, int fame) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT gift FROM notes WHERE `id`=?");
            ps.setInt(1, id);
            rs = ps.executeQuery();
            if (rs.next()) {
                if (rs.getInt("gift") == fame && fame > 0) { //not exploited! hurray
                    addFame(fame);
                    updateSingleStat(MapleStat.FAME, getFame());
                    client.getSession().write(MaplePacketCreator.getShowFameGain(fame));
                }
            }
            rs.close();
            ps.close();
            ps = con.prepareStatement("DELETE FROM notes WHERE `id`=?");
            ps.setInt(1, id);
            ps.execute();
        } catch (SQLException e) {
            System.err.println("Unable to delete note" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public int getMulungEnergy() {
        return mulung_energy;
    }

    public void mulung_EnergyModify(int inc) {
        if (inc > 0) {
            if (mulung_energy + inc > 300) {
                mulung_energy = 300;
            } else {
                mulung_energy += inc;
            }
        } else {
            mulung_energy = 0;
        }
        client.getSession().write(MaplePacketCreator.MulungEnergy(mulung_energy));
    }

    public void writeMulungEnergy() {
        client.getSession().write(MaplePacketCreator.MulungEnergy(mulung_energy));
    }

    public void writeEnergy(String type, String inc) {
        client.getSession().write(MaplePacketCreator.sendPyramidEnergy(type, inc));
    }

    public void writeStatus(String type, String inc) {
        client.getSession().write(MaplePacketCreator.sendGhostStatus(type, inc));
    }

    public void writePoint(String type, String inc) {
        client.getSession().write(MaplePacketCreator.sendGhostPoint(type, inc));
    }

    public final short getCombo() {
        return combo;
    }

    public void setCombo(final short combo) {
        this.combo = combo;
    }

    public final long getLastCombo() {
        return lastCombo;
    }

    public void setLastCombo(final long combo) {
        this.lastCombo = combo;
    }

    public final long getKeyDownSkill_Time() {
        return keydown_skill;
    }

    public void setKeyDownSkill_Time(final long keydown_skill) {
        this.keydown_skill = keydown_skill;
    }

    public void checkBerserk() { //berserk is special in that it doesn't use worldtimer :)
        if (job != 132/* || lastBerserkTime < 0 || lastBerserkTime + 10000 > System.currentTimeMillis()*/) {
            return;
        }
        final Skill BerserkX = SkillFactory.getSkill(1320006);
        final int skilllevel = getTotalSkillLevel(BerserkX);
        if (skilllevel >= 1 && map != null) {
            lastBerserkTime = System.currentTimeMillis();
            final MapleStatEffect ampStat = BerserkX.getEffect(skilllevel);
            stats.Berserk = stats.getHp() * 100 / stats.getCurrentMaxHp() <= ampStat.getX();
            client.getSession().write(MaplePacketCreator.showOwnBuffEffect(1320006, 1, getLevel(), skilllevel, (byte) (stats.Berserk ? 1 : 0)));
            map.broadcastMessage(this, MaplePacketCreator.showBuffeffect(getId(), 1320006, 1, getLevel(), skilllevel, (byte) (stats.Berserk ? 1 : 0)), false);
        } else {
            lastBerserkTime = -1;
        }
    }

    public void setChalkboard(String text) {
        this.chalktext = text;
        if (map != null) {
            map.broadcastMessage(CSPacket.useChalkboard(getId(), text));
        }
    }

    public String getChalkboard() {
        return chalktext;
    }

    public MapleMount getMount() {
        return mount;
    }

    public int[] getWishlist() {
        return wishlist;
    }

    public void clearWishlist() {
        for (int i = 0; i < 10; i++) {
            wishlist[i] = 0;
        }
        changed_wishlist = true;
    }

    public int getWishlistSize() {
        int ret = 0;
        for (int i = 0; i < 10; i++) {
            if (wishlist[i] > 0) {
                ret++;
            }
        }
        return ret;
    }

    public void setWishlist(int[] wl) {
        this.wishlist = wl;
        changed_wishlist = true;
    }

    public int[] getRocks() {
        return rocks;
    }

    public int getRockSize() {
        int ret = 0;
        for (int i = 0; i < 10; i++) {
            if (rocks[i] != 999999999) {
                ret++;
            }
        }
        return ret;
    }

    public void deleteFromRocks(int map) {
        for (int i = 0; i < 10; i++) {
            if (rocks[i] == map) {
                rocks[i] = 999999999;
                changed_trocklocations = true;
                break;
            }
        }
    }

    public void addRockMap() {
        if (getRockSize() >= 10) {
            return;
        }
        for (int i = 0; i < 10; ++i) {
            if (rocks[i] == 999999999) {
                rocks[i] = getMapId();
                changed_trocklocations = true;
                break;
            }
        }
    }

    public boolean isRockMap(int id) {
        for (int i = 0; i < 10; i++) {
            if (rocks[i] == id) {
                return true;
            }
        }
        return false;
    }

    public int[] getRegRocks() {
        return regrocks;
    }

    public int getRegRockSize() {
        int ret = 0;
        for (int i = 0; i < 5; i++) {
            if (regrocks[i] != 999999999) {
                ret++;
            }
        }
        return ret;
    }

    public void deleteFromRegRocks(int map) {
        for (int i = 0; i < 5; i++) {
            if (regrocks[i] == map) {
                regrocks[i] = 999999999;
                changed_regrocklocations = true;
                break;
            }
        }
    }

    public void addRegRockMap() {
        if (getRegRockSize() >= 5) {
            return;
        }
        for (int i = 0; i < 5; ++i) {
            if (regrocks[i] == 999999999) {
                regrocks[i] = getMapId();
                changed_regrocklocations = true;
                break;
            }
        }

    }

    public boolean isRegRockMap(int id) {
        for (int i = 0; i < 5; i++) {
            if (regrocks[i] == id) {
                return true;
            }
        }
        return false;
    }

    public int[] getHyperRocks() {
        return hyperrocks;
    }

    public int getHyperRockSize() {
        int ret = 0;
        for (int i = 0; i < 13; i++) {
            if (hyperrocks[i] != 999999999) {
                ret++;
            }
        }
        return ret;
    }

    public void deleteFromHyperRocks(int map) {
        for (int i = 0; i < 13; i++) {
            if (hyperrocks[i] == map) {
                hyperrocks[i] = 999999999;
                changed_hyperrocklocations = true;
                break;
            }
        }
    }

    public void addHyperRockMap() {
        if (getRegRockSize() >= 13) {
            return;
        }
        hyperrocks[getHyperRockSize()] = getMapId();
        changed_hyperrocklocations = true;
    }

    public boolean isHyperRockMap(int id) {
        for (int i = 0; i < 13; i++) {
            if (hyperrocks[i] == id) {
                return true;
            }
        }
        return false;
    }

    public List<LifeMovementFragment> getLastRes() {
        return lastres;
    }

    public void setLastRes(List<LifeMovementFragment> lastres) {
        this.lastres = lastres;
    }

    public void dropMessage(String message) {
        client.getSession().write(PlayerShopPacket.shopChat(message, 0)); //0 or what
    }

    public void dropMessage(int type, String message) {
        if (type == -1) {
            client.getSession().write(UIPacket.getMidMsg(message, true, 0));
        } else if (type < 0) {
            client.getSession().write(MaplePacketCreator.serverNotice(6, message));
        } else {
            client.getSession().write(MaplePacketCreator.serverNotice(type, message));
        }
    }

    public IMaplePlayerShop getPlayerShop() {
        return playerShop;
    }

    public void setPlayerShop(IMaplePlayerShop playerShop) {
        this.playerShop = playerShop;
    }

    public int getConversation() {
        return inst.get();
    }

    public void setConversation(int inst) {
        this.inst.set(inst);
    }

    public int getDirection() {
        return insd.get();
    }

    public void setDirection(int inst) {
        this.insd.set(inst);
    }

    public MapleCarnivalParty getCarnivalParty() {
        return carnivalParty;
    }

    public void setCarnivalParty(MapleCarnivalParty party) {
        carnivalParty = party;
    }

    public void addCP(int ammount) {
        totalCP += ammount;
        availableCP += ammount;
        totalCP = (short) Math.max(0, totalCP);
        availableCP = (short) Math.max(0, availableCP);
    }

    public void useCP(int ammount) {
        availableCP -= ammount;
        availableCP = (short) Math.max(0, availableCP);
    }

    public int getAvailableCP() {
        return availableCP;
    }

    public int getTotalCP() {
        return totalCP;
    }

    public void resetCP() {
        totalCP = 0;
        availableCP = 0;
    }

    public void addCarnivalRequest(MapleCarnivalChallenge request) {
        pendingCarnivalRequests.add(request);
    }

    public final MapleCarnivalChallenge getNextCarnivalRequest() {
        return pendingCarnivalRequests.pollLast();
    }

    public void clearCarnivalRequests() {
        pendingCarnivalRequests = new LinkedList<MapleCarnivalChallenge>();
    }

    public void startMonsterCarnival(final int enemyavailable, final int enemytotal) {
        client.getSession().write(MonsterCarnivalPacket.startMonsterCarnival(this, enemyavailable, enemytotal));
    }

    public void CPUpdate(final boolean party, final int available, final int total, final int team) {
        client.getSession().write(MonsterCarnivalPacket.CPUpdate(party, available, total, team));
    }

    public void playerDiedCPQ(final String name, final int lostCP, final int team) {
        client.getSession().write(MonsterCarnivalPacket.playerDiedMessage(name, lostCP, team));
    }

    public void setAchievementFinished(int id) {
        if (!finishedAchievements.contains(id)) {
            finishedAchievements.add(id);
            changed_achievements = true;
        }
    }

    public boolean achievementFinished(int achievementid) {
        return finishedAchievements.contains(achievementid);
    }

    public void finishAchievement(int id) {
        if (!achievementFinished(id)) {
            if (isAlive()) {
                MapleAchievements.getInstance().getById(id).finishAchievement(this);
            }
        }
    }

    public List<Integer> getFinishedAchievements() {
        return finishedAchievements;
    }

    public boolean getCanTalk() {
        return this.canTalk;
    }

    public void canTalk(boolean talk) {
        this.canTalk = talk;
    }

    public double getEXPMod() {
        return stats.expMod;
    }

    public int getDropMod() {
        return stats.dropMod;
    }

    public int getCashMod() {
        return stats.cashMod;
    }

    public void setPoints(int p) {
        this.points = p;
//        if (this.points >= 1) {
//            finishAchievement(1);
//        }
    }

    public int getPoints() {
        return points;
    }

    public void setVPoints(int p) {
        this.vpoints = p;
    }

    public int getVPoints() {
        return vpoints;
    }

    public CashShop getCashInventory() {
        return cs;
    }

    public void removeItem(int id, int quantity) {
        MapleInventoryManipulator.removeById(client, GameConstants.getInventoryType(id), id, -quantity, true, false);
        client.getSession().write(MaplePacketCreator.getShowItemGain(id, (short) quantity, true));
    }

    public void removeAll(int id) {
        removeAll(id, true);
    }

    public void removeAll(int id, boolean show) {
        MapleInventoryType type = GameConstants.getInventoryType(id);
        int possessed = getInventory(type).countById(id);

        if (possessed > 0) {
            DBLogger.instance.logItem(LogType.Item.FromScript, getId(), getName(), id, -possessed, MapleItemInformationProvider.getInstance().getName(id), 0, "Map : " + getMapId() + " Interaction ? : " + getConversation());

            MapleInventoryManipulator.removeById(getClient(), type, id, possessed, true, false);
            if (show) {
                getClient().getSession().write(MaplePacketCreator.getShowItemGain(id, (short) -possessed, true));
            }
        }
    }

    public void removeAllEquip(int id, boolean show) {
        MapleInventoryType type = GameConstants.getInventoryType(id);
        int possessed = getInventory(type).countById(id);

        if (possessed > 0) {
            DBLogger.instance.logItem(LogType.Item.FromScript, getId(), getName(), id, -possessed, MapleItemInformationProvider.getInstance().getName(id), 0, "Map : " + getMapId() + " Interaction ? : " + getConversation());

            MapleInventoryManipulator.removeById(getClient(), type, id, possessed, true, false);
            if (show) {
                getClient().getSession().write(MaplePacketCreator.getShowItemGain(id, (short) -possessed, true));
            }
        }
        if (type == MapleInventoryType.EQUIP) { //check equipped
            type = MapleInventoryType.EQUIPPED;
            possessed = getInventory(type).countById(id);

            if (possessed > 0) {
                Item equip = getInventory(type).findById(id);
                if (equip != null) {
                    getInventory(type).removeSlot(equip.getPos());
                    equipChanged();
                    getClient().sendPacket(MaplePacketCreator.dropInventoryItem(MapleInventoryType.EQUIP, equip.getPos()));
                }
            }
        }
    }

    public Triple<List<MapleRing>, List<MapleRing>, List<MapleRing>> getRings(boolean equip) {
        MapleInventory iv = getInventory(MapleInventoryType.EQUIPPED);
        List<Item> equipped = iv.newList();
        if (!equipped.isEmpty()) {
            equipped.addAll(getInventory(MapleInventoryType.EQUIP).list());
            equipped.addAll(getInventory(MapleInventoryType.ETC).list());
            Collections.sort(equipped);
        }
        List<MapleRing> crings = new ArrayList<MapleRing>(), frings = new ArrayList<MapleRing>(), mrings = new ArrayList<MapleRing>();
        MapleRing ring;
        for (Item item : equipped) {
            if (item.getRing() != null) {
                ring = item.getRing();
                ring.setEquipped(true);
                if (GameConstants.isEffectRing(item.getItemId())) {
                    if (equip) {
                        if (GameConstants.isCrushRing(item.getItemId())) {
                            crings.add(ring);
                        } else if (GameConstants.isFriendshipRing(item.getItemId())) {
                            frings.add(ring);
                        } else if (GameConstants.isMarriageRing(item.getItemId())) {
                            if (getMarriageId() > 0) {
                                mrings.add(ring);
                            }
                        }
                    } else {
                        if (crings.size() == 0 && GameConstants.isCrushRing(item.getItemId())) {
                            crings.add(ring);
                        } else if (frings.size() == 0 && GameConstants.isFriendshipRing(item.getItemId())) {
                            frings.add(ring);
                        } else if (mrings.size() == 0 && GameConstants.isMarriageRing(item.getItemId())) {
                            if (getMarriageId() > 0) {
                                mrings.add(ring);
                            }
                        } //for 3rd person the actual slot doesnt matter, so we'll use this to have both shirt/ring same?
                        //however there seems to be something else behind this, will have to sniff someone with shirt and ring, or more conveniently 3-4 of those
                    }
                }
            }
        }
        if (equip) {
            iv = getInventory(MapleInventoryType.EQUIP);
            for (Item item : iv.list()) {
                if (item.getRing() != null && GameConstants.isCrushRing(item.getItemId())) {
                    ring = item.getRing();
                    ring.setEquipped(false);
                    if (GameConstants.isFriendshipRing(item.getItemId())) {
                        frings.add(ring);
                    } else if (GameConstants.isCrushRing(item.getItemId())) {
                        crings.add(ring);
                    } else if (GameConstants.isMarriageRing(item.getItemId())) {
                        mrings.add(ring);
                    }
                }
            }
        }
        Collections.sort(frings, new MapleRing.RingComparator());
        Collections.sort(crings, new MapleRing.RingComparator());
        Collections.sort(mrings, new MapleRing.RingComparator());
        return new Triple<List<MapleRing>, List<MapleRing>, List<MapleRing>>(crings, frings, mrings);
    }

    public int getFH() {
        MapleFoothold fh = getMap().getFootholds().findBelow(getTruePosition());
        if (fh != null) {
            return fh.getId();
        }
        return 0;
    }

    public void gainItem(int id, short q) {
        MapleInventoryManipulator.addById(client, id, q, null);
    }

    public void startFairySchedule(boolean exp) {
        startFairySchedule(exp, false);
    }

    public void startFairySchedule(boolean exp, boolean equipped) {
        cancelFairySchedule(exp || stats.equippedFairy == 0);
        if (fairyExp <= 0) {
            fairyExp = (byte) stats.equippedFairy;
        }
        if (equipped && fairyExp < stats.equippedFairy * 3 && stats.equippedFairy > 0) {
            dropMessage(5, "The Fairy Pendant's experience points will increase to " + (fairyExp + stats.equippedFairy) + "% after one hour.");
        }
        lastFairyTime = System.currentTimeMillis();
    }

    public final boolean canFairy(long now) {
        return lastFairyTime > 0 && lastFairyTime + (60 * 60 * 1000) < now;
    }

    public final boolean canHP(long now, int time) {
        if (lastHPTime + time <= now) {
            lastHPTime = now;
            return true;
        }
        return false;
    }

    public final boolean canMP(long now, int time) {
        if (lastMPTime + time < now) {
            lastMPTime = now;
            return true;
        }
        return false;
    }

    public final boolean canHP2(long now, int time) {
        if (lastHPTime2 + time <= now) {
            lastHPTime2 = now;
            return true;
        }
        return false;
    }

    public final boolean canMP2(long now, int time) {
        if (lastMPTime2 + time < now) {
            lastMPTime2 = now;
            return true;
        }
        return false;
    }
    long lastHPTime2 = 0;
    long lastMPTime2 = 0;

    public final boolean canHPRecover(long now) {
        if (stats.hpRecoverTime > 0 && lastHPTime + stats.hpRecoverTime < now) {
            lastHPTime = now;
            return true;
        }
        return false;
    }

    public final boolean canMPRecover(long now) {
        if (stats.mpRecoverTime > 0 && lastMPTime + stats.mpRecoverTime < now) {
            lastMPTime = now;
            return true;
        }
        return false;
    }

    public void cancelFairySchedule(boolean exp) {
        lastFairyTime = 0;
        if (exp) {
            this.fairyExp = 0;
        }
    }

    public void doFairy() {
//        if (fairyExp < stats.equippedFairy * 3 && stats.equippedFairy > 0) {
//            fairyExp += stats.equippedFairy;
//            dropMessage(5, "The Fairy Pendant's EXP was boosted to " + fairyExp + "%.");
//        }
        if (getGuildId() > 0) {
//            World.Guild.gainGP(getGuildId(), 20, id);
//            client.getSession().write(UIPacket.getGPContribution(20));
        }
//        traits.get(MapleTraitType.will).addExp(5, this); //willpower every hour
//        startFairySchedule(false, true);
    }

    public byte getFairyExp() {
        return fairyExp;
    }

    public int getTeam() {
        return coconutteam;
    }

    public void setTeam(int v) {
        this.coconutteam = v;
    }

    public void spawnPet(byte slot) {
        final Item item = getInventory(MapleInventoryType.CASH).getItem(slot);
        if (item == null || item.getItemId() > 5002000 || item.getItemId() < 5000000) {
            return;
        }
        final MaplePet pet = item.getPet();
        if (pet != null && (item.getItemId() != 5000054 || pet.getSecondsLeft() > 0) && (item.getExpiration() == -1 || item.getExpiration() > System.currentTimeMillis())) {
            if (pet.getSummoned()) { // Already summoned, let's keep it
                unequipPet(pet, false);
            } else {
                if (getPet(0) != null) {
                    unequipPet(getPet(0), false);
                }
                final Point pos = getPosition();
                pet.setPos(pos);
                try {
                    pet.setFh(getMap().getFootholds().findBelow(pos).getId());
                } catch (NullPointerException e) {
                    pet.setFh(0); //lol, it can be fixed by movement
                }
                pet.setStance(0);
                pet.setSummoned(1); //let summoned be true..
                addPet(pet);
                getMap().broadcastMessage(this, PetPacket.showPet(this, pet, false, false), true);
                client.sendPacket(PetPacket.loadPetPickupExceptionList(getId(), pet.getUniqueId(), pet.getPickupExceptionList()));
                client.getSession().write(MaplePacketCreator.updatePlayerStats(Collections.singletonMap(MapleStat.PET, pet.getUniqueId()), 0));
            }
        }
        client.getSession().write(MaplePacketCreator.enableActions());
    }

    public final void spawnSavedPets() {
        for (int i = 0; i < petStore.length; i++) {
            if (petStore[i] > -1) {
                spawnPet(petStore[i]);
                break;
            }
        }
//        if (GameConstants.GMS) {
//            client.getSession().write(PetPacket.petStatUpdate(this));
//        }
        petStore = new byte[]{-1, -1, -1};
    }

    public final byte[] getPetStores() {
        return petStore;
    }

    public void resetStats(final int str, final int dex, final int int_, final int luk) {
        Map<MapleStat, Integer> stat = new EnumMap<MapleStat, Integer>(MapleStat.class
        );
        int total = stats.getStr() + stats.getDex() + stats.getLuk() + stats.getInt() + getRemainingAp();

        total -= str;
        stats.str = (short) str;

        total -= dex;
        stats.dex = (short) dex;

        total -= int_;
        stats.int_ = (short) int_;

        total -= luk;
        stats.luk = (short) luk;

        setRemainingAp(
                (short) total
        );
        stats.recalcLocalStats(
                this);
        stat.put(MapleStat.STR, str);

        stat.put(MapleStat.DEX, dex);

        stat.put(MapleStat.INT, int_);

        stat.put(MapleStat.LUK, luk);

        stat.put(MapleStat.AVAILABLEAP, total);

        client.getSession()
                .write(MaplePacketCreator.updatePlayerStats(stat, false, getJob()));
    }

    public byte getSubcategory() {
        return 0;
    }

    public void setSubcategory(int z) {
        this.subcategory = (byte) z;
    }

    public int itemQuantity(final int itemid) {
        return getInventory(GameConstants.getInventoryType(itemid)).countById(itemid);
    }

    public void setRPS(RockPaperScissors rps) {
        this.rps = rps;
    }

    public RockPaperScissors getRPS() {
        return rps;
    }

    public long getNextConsume() {
        return nextConsume;
    }

    public void setNextConsume(long nc) {
        this.nextConsume = nc;
    }

    public int getRank() {
        return rank;
    }

    public int getRankMove() {
        return rankMove;
    }

    public int getJobRank() {
        return jobRank;
    }

    public int getJobRankMove() {
        return jobRankMove;
    }

    public void changeChannel(final int channel) {
        final ChannelServer toch = ChannelServer.getInstance(channel);

        if (channel == client.getChannel() || toch == null || toch.isShutdown()) {
            client.getSession().write(MaplePacketCreator.serverBlocked(1));
            return;
        }
        changeRemoval();

        final ChannelServer ch = ChannelServer.getInstance(client.getChannel());
        if (getMessenger() != null) {
            World.Messenger.silentLeaveMessenger(getMessenger().getId(), new MapleMessengerCharacter(this));
        }
        PlayerBuffStorage.addBuffsToStorage(getId(), getAllBuffs());
        PlayerBuffStorage.addCooldownsToStorage(getId(), getCooldowns());
        PlayerBuffStorage.addDiseaseToStorage(getId(), getAllDiseases());
        World.ChannelChange_Data(new CharacterTransfer(this), getId(), channel);
        ch.removePlayer(this);
        client.updateLoginState(MapleClient.CHANGE_CHANNEL, client.getSessionIPAddress());
        final String s = client.getSessionIPAddress();
        LoginServer.addIPAuth(s.substring(s.indexOf('/') + 1, s.length()));
        LoginServer.setCodeHash(getId(), client.getCodeHash());
        client.getSession().write(MaplePacketCreator.getChannelChange(client, Integer.parseInt(toch.getIP().split(":")[1])));
        saveToDB(false, false);
        getMap().removePlayer(this);

        client.setPlayer(null);
        client.setReceiving(false);
    }

    public void expandInventory(byte type, int amount) {
        final MapleInventory inv = getInventory(MapleInventoryType.Companion.getByType(type));
        inv.addSlot((byte) amount);
        client.getSession().write(MaplePacketCreator.getSlotUpdate(type, (byte) inv.getSlotLimit()));
    }

    public boolean allowedToTarget(MapleCharacter other) {
        return other != null && (!other.isHidden() || getGMLevel() >= other.getGMLevel());
    }

    public void LoginCoin() {
        if (coin == null) {
            coin = server.Timer.WorldTimer.getInstance().register(new Runnable() {
                private int timeo;

                public void run() {
                    if (timeo == 0) {
                        timeo++;
                    } else if (timeo == -1) {
                        timeo = 0;
                    } else if (timeo != 0) {
                        modifyCSPoints(2, (70 + (15 * timeo)), false);
                        dropMessage(6, "★ 접속보상 : 접속후 " + 30 * timeo + "분이지나 " + (70 + (15 * timeo)) + "메이플포인트가 충전되었습니다.");
                        timeo++;
                    }
                }
            }, 1800000L * 1);
        }
    }

    public String getTOTOresultlist() throws SQLException {
        if (getTOTOresult(1) == 1) {
            return "홀";
        } else {
            return "짝";
        }
    }

    public void ResetTOTO1() throws SQLException {
        Connection con = null;
        PreparedStatement ps = null;
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement("delete FROM queststatus where quest = 55555;");
        ps.executeUpdate();
        ps.close();
    }

    public void ResetTOTO2() throws SQLException {
        Connection con = null;
        PreparedStatement ps = null;
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement("delete FROM queststatus where quest = 55556;");
        ps.executeUpdate();
        ps.close();
    }

    public int getTOTOresult(int id) throws SQLException {
        Connection con = DatabaseConnection.getConnection();
        PreparedStatement ps;
        try {
            ps = con.prepareStatement("SELECT * FROM epiontoto where id = ?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("th");
            }
            ps.close();
            rs.close();
        } catch (SQLException ex) {
        }
        return 0;
    }

    public void updateTOTOresult(int where, int th) {
        try {
            Connection con = DatabaseConnection.getConnection();
            PreparedStatement ps = con.prepareStatement("UPDATE `epiontoto` SET `th` = ? WHERE `id` = ?");
            ps.setInt(1, th);
            ps.setInt(2, where);
            ps.execute();
            ps.close();
        } catch (SQLException e) {
        }
    }

    public void giveItemToAllUser(int id, short q) {
        for (ChannelServer ch : ChannelServer.getAllInstances()) {
            for (MapleCharacter players : ch.getPlayerStorage().getAllCharacters()) {
                players.gainItem(id, q);
                this.getQuestRecord(id).setStatus(gender);
            }
        }
    }

    public int getMarriageId() {
        return marriageId;
    }

    public void setMarriageId(final int mi) {
        this.marriageId = mi;
    }

    public int getEngageId() {
        return engageId;
    }

    public void setEngageId(final int mi) {
        this.engageId = mi;
    }

    public int getMarriageItemId() {
        return marriageItemId;
    }

    public void setMarriageItemId(final int mi) {
        this.marriageItemId = mi;
    }

    // TODO: gvup, vic, lose, draw, VR
    public boolean startPartyQuest(final int questid) {
        boolean ret = false;
        MapleQuest q = MapleQuest.getInstance(questid);
        if (q == null || !q.isPartyQuest()) {
            return false;
        }
        if (!quests.containsKey(q) || !questinfo.containsKey(questid)) {
            final MapleQuestStatus status = getQuestNAdd(q);
            status.setStatus((byte) 1);
            updateQuest(status);
            switch (questid) {
                case 1300:
                case 1301:
                case 1302: //carnival, ariants.
                    updateInfoQuest(questid, "min=0;sec=0;date=0000-00-00;have=0;rank=F;try=0;cmp=0;CR=0;VR=0;gvup=0;vic=0;lose=0;draw=0");
                    break;
                case 1303: //ghost pq
                    updateInfoQuest(questid, "min=0;sec=0;date=0000-00-00;have=0;have1=0;rank=F;try=0;cmp=0;CR=0;VR=0;vic=0;lose=0");
                    break;
                case 1204: //herb town pq
                    updateInfoQuest(questid, "min=0;sec=0;date=0000-00-00;have0=0;have1=0;have2=0;have3=0;rank=F;try=0;cmp=0;CR=0;VR=0");
                    break;
                case 1206: //ellin pq
                    updateInfoQuest(questid, "min=0;sec=0;date=0000-00-00;have0=0;have1=0;rank=F;try=0;cmp=0;CR=0;VR=0");
                    break;
                default:
                    updateInfoQuest(questid, "min=0;sec=0;date=0000-00-00;have=0;rank=F;try=0;cmp=0;CR=0;VR=0");
                    break;
            }
            ret = true;
        } //started the quest.
        return ret;
    }

    public String getOneInfo(final int questid, final String key) {
        if (!questinfo.containsKey(questid) || key == null || MapleQuest.getInstance(questid) == null/* || !MapleQuest.getInstance(questid).isPartyQuest()*/) {
            return null;
        }
        final String[] split = questinfo.get(questid).split(";");
        for (String x : split) {
            final String[] split2 = x.split("="); //should be only 2
            if (split2.length == 2 && split2[0].equals(key)) {
                return split2[1];
            }
        }
        return null;
    }

    public void updateOneInfo(final int questid, final String key, final String value) {
        if (!questinfo.containsKey(questid) || key == null || value == null || MapleQuest.getInstance(questid) == null/* || !MapleQuest.getInstance(questid).isPartyQuest()*/) {
            return;
        }
        final String[] split = questinfo.get(questid).split(";");
        boolean changed = false;
        final StringBuilder newQuest = new StringBuilder();
        for (String x : split) {
            final String[] split2 = x.split("="); //should be only 2
            if (split2.length != 2) {
                continue;
            }
            if (split2[0].equals(key)) {
                newQuest.append(key).append("=").append(value);
            } else {
                newQuest.append(x);
            }
            newQuest.append(";");
            changed = true;
        }

        updateInfoQuest(questid, changed ? newQuest.toString().substring(0, newQuest.toString().length() - 1) : newQuest.toString());
    }

    public void recalcPartyQuestRank(final int questid) {
        if (MapleQuest.getInstance(questid) == null || !MapleQuest.getInstance(questid).isPartyQuest()) {
            return;
        }
        if (!startPartyQuest(questid)) {
            final String oldRank = getOneInfo(questid, "rank");
            if (oldRank == null || oldRank.equals("S")) {
                return;
            }
            String newRank = null;
            if (oldRank.equals("A")) {
                newRank = "S";
            } else if (oldRank.equals("B")) {
                newRank = "A";
            } else if (oldRank.equals("C")) {
                newRank = "B";
            } else if (oldRank.equals("D")) {
                newRank = "C";
            } else if (oldRank.equals("F")) {
                newRank = "D";
            } else {
                return;
            }
            final List<Pair<String, Pair<String, Integer>>> questInfo = MapleQuest.getInstance(questid).getInfoByRank(newRank);
            if (questInfo == null) {
                return;
            }
            for (Pair<String, Pair<String, Integer>> q : questInfo) {
                boolean found = false;
                final String val = getOneInfo(questid, q.right.left);
                if (val == null) {
                    return;
                }
                int vall = 0;
                try {
                    vall = Integer.parseInt(val);
                } catch (NumberFormatException e) {
                    return;
                }
                if (q.left.equals("less")) {
                    found = vall < q.right.right;
                } else if (q.left.equals("more")) {
                    found = vall > q.right.right;
                } else if (q.left.equals("equal")) {
                    found = vall == q.right.right;
                }
                if (!found) {
                    return;
                }
            }
            //perfectly safe
            updateOneInfo(questid, "rank", newRank);
        }
    }

    public void tryPartyQuest(final int questid) {
        if (MapleQuest.getInstance(questid) == null || !MapleQuest.getInstance(questid).isPartyQuest()) {
            return;
        }
        try {
            startPartyQuest(questid);
            pqStartTime = System.currentTimeMillis();
            updateOneInfo(questid, "try", String.valueOf(Integer.parseInt(getOneInfo(questid, "try")) + 1));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("tryPartyQuest error");
        }
    }

    public void endPartyQuest(final int questid) {
        if (MapleQuest.getInstance(questid) == null || !MapleQuest.getInstance(questid).isPartyQuest()) {
            return;
        }
        try {
            startPartyQuest(questid);
            if (pqStartTime > 0) {
                final long changeTime = System.currentTimeMillis() - pqStartTime;
                final int mins = (int) (changeTime / 1000 / 60), secs = (int) (changeTime / 1000 % 60);
                final int mins2 = Integer.parseInt(getOneInfo(questid, "min"));
                if (mins2 <= 0 || mins < mins2) {
                    updateOneInfo(questid, "min", String.valueOf(mins));
                    updateOneInfo(questid, "sec", String.valueOf(secs));
                    updateOneInfo(questid, "date", FileoutputUtil.CurrentReadable_Date());
                }
                final int newCmp = Integer.parseInt(getOneInfo(questid, "cmp")) + 1;
                updateOneInfo(questid, "cmp", String.valueOf(newCmp));
                updateOneInfo(questid, "CR", String.valueOf((int) Math.ceil((newCmp * 100.0) / Integer.parseInt(getOneInfo(questid, "try")))));
                recalcPartyQuestRank(questid);
                pqStartTime = 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("endPartyQuest error");
        }

    }

    public void havePartyQuest(final int itemId) {
        int questid = 0, index = -1;
        switch (itemId) {
            case 1002798:
                questid = 1200; //henesys
                break;
            case 1072369:
                questid = 1201; //kerning
                break;
            case 1022073:
                questid = 1202; //ludi
                break;
            case 1082232:
                questid = 1203; //orbis
                break;
            case 1002571:
            case 1002572:
            case 1002573:
            case 1002574:
                questid = 1204; //herbtown
                index = itemId - 1002571;
                break;
            case 1102226:
                questid = 1303; //ghost
                break;
            case 1102227:
                questid = 1303; //ghost
                index = 0;
                break;
            case 1122010:
                questid = 1205; //magatia
                break;
            case 1032061:
            case 1032060:
                questid = 1206; //ellin
                index = itemId - 1032060;
                break;
            case 3010018:
                questid = 1300; //ariant
                break;
            case 1122007:
                questid = 1301; //carnival
                break;
            case 1122058:
                questid = 1302; //carnival2
                break;
            default:
                return;
        }
        if (MapleQuest.getInstance(questid) == null || !MapleQuest.getInstance(questid).isPartyQuest()) {
            return;
        }
        startPartyQuest(questid);
        updateOneInfo(questid, "have" + (index == -1 ? "" : index), "1");
    }

    public void addCanGainFame() {
        canGainNoteFame++;
    }

    public boolean checkCanGainFameNGive() {
        if (canGainNoteFame > 0) {
            canGainNoteFame--;
            addFame(1);
            updateFame();
            return true;
        }
        return false;
    }

    public void resetStatsByJob(boolean beginnerJob) {
        int baseJob = (beginnerJob ? (job % 1000) : (((job % 1000) / 100) * 100)); //1112 -> 112 -> 1 -> 100
        boolean UA = getQuestNoAdd(MapleQuest.getInstance(GameConstants.ULT_EXPLORER)) != null;
        if (baseJob == 100) { //first job = warrior
            resetStats(UA ? 4 : 35, 4, 4, 4);
        } else if (baseJob == 200) {
            resetStats(4, 4, UA ? 4 : 20, 4);
        } else if (baseJob == 300 || baseJob == 400) {
            resetStats(4, UA ? 4 : 25, 4, 4);
        } else if (baseJob == 500) {
            resetStats(4, UA ? 4 : 20, 4, 4);
        } else if (baseJob == 0) {
            resetStats(4, 4, 4, 4);
        }
    }

    public boolean hasSummon() {
        return hasSummon;
    }

    public void setHasSummon(boolean summ) {
        this.hasSummon = summ;
    }

    public void removeDoor() {
        final MapleDoor door = getDoors().iterator().next();
        for (final MapleCharacter chr : door.getTarget().getCharactersThreadsafe()) {
            door.sendDestroyData(chr.getClient());
        }
        for (final MapleCharacter chr : door.getTown().getCharactersThreadsafe()) {
            door.sendDestroyData(chr.getClient());
        }
        for (final MapleDoor destroyDoor : getDoors()) {
            door.getTarget().removeMapObject(destroyDoor);
            door.getTown().removeMapObject(destroyDoor);
        }
        clearDoors();
    }

    public void changeRemoval() {
        changeRemoval(false);
    }

    public void changeRemoval(boolean dc) {
        if (getCheatTracker() != null && dc) {
            getCheatTracker().dispose();
        }
        dispelSummons();
        if (!dc) {
            cancelEffectFromBuffStat(MapleBuffStat.MONSTER_RIDING);
            cancelEffectFromBuffStat(MapleBuffStat.RECOVERY);
        }
        if (playerShop != null && !dc) {
            playerShop.removeVisitor(this, true);
            if (playerShop.isOwner(this)) {
                playerShop.setOpen(true);
            }
        }
        if (!getDoors().isEmpty()) {
            removeDoor();
        }
        NPCScriptManager.getInstance().dispose(client);
        cancelFairySchedule(false);
    }

    public void updateTick(int newTick) {
        anticheat.updateTick(newTick);
    }

    public String getTeleportName() {
        return teleportname;
    }

    public void setTeleportName(final String tname) {
        teleportname = tname;
    }

    public boolean isInBlockedMap() {
        if (!isAlive() || getMap().getSquadByMap() != null || getEventInstance() != null || getMap().getEMByMap() != null) {
            return true;
        }
        if ((getMapId() >= 680000210 && getMapId() <= 680000502) || (getMapId() / 10000 == 92502 && getMapId() >= 925020100) || (getMapId() / 10000 == 92503) || getMapId() == GameConstants.JAIL) {
            return true;
        }
        if ((getMapId() >= 270010200 && getMapId() <= 270030500)) {
            return true;
        }
        for (int i : GameConstants.blockedMaps) {
            if (getMapId() == i) {
                return true;
            }
        }
        return false;
    }

    public boolean isInTownMap() {
        if (hasBlockedInventory() || !getMap().isTown() || FieldLimitType.VipRock.check(getMap().getFieldLimit()) || getEventInstance() != null) {
            return false;
        }
        for (int i : GameConstants.blockedMaps) {
            if (getMapId() == i) {
                return false;
            }
        }
        return true;
    }

    public boolean hasBlockedInventory() {
        return !isAlive() || /*getTrade() != null ||*/ getConversation() > 0 || getDirection() >= 0 || getPlayerShop() != null || map == null;
    }

    public void startPartySearch(final List<Integer> jobs, final int maxLevel, final int minLevel, final int membersNeeded) {
        psearch_jobs = jobs;
        psearch_maxLevel = maxLevel;
        psearch_membersNeeded = membersNeeded;
        psearch_minLevel = minLevel;
        searchingParty = true;
        searchParty();
    }

    public void stopPartySearch() {
        searchingParty = false;
    }

    public int getChallenge() {
        return challenge;
    }

    public void setChallenge(int c) {
        this.challenge = c;
    }

    public void fakeRelog() {
        client.getSession().write(MaplePacketCreator.getCharInfo(this));
        final MapleMap mapp = getMap();
        mapp.setCheckStates(false);
        mapp.removePlayer(this);
        mapp.addPlayer(this);
        mapp.setCheckStates(true);
    }

    public boolean canSummon() {
        return canSummon(5000);
    }

    public boolean canSummon(int g) {
        if (lastSummonTime + g < System.currentTimeMillis()) {
            lastSummonTime = System.currentTimeMillis();
            return true;
        }
        return false;
    }

    public int getIntNoRecord(int questID) {
        final MapleQuestStatus stat = getQuestNoAdd(MapleQuest.getInstance(questID));
        if (stat == null || stat.getCustomData() == null) {
            return 0;
        }
        return Integer.parseInt(stat.getCustomData());
    }

    public int getIntRecord(int questID) {
        final MapleQuestStatus stat = getQuestNAdd(MapleQuest.getInstance(questID));
        if (stat.getCustomData() == null) {
            stat.setCustomData("0");
        }
        return Integer.parseInt(stat.getCustomData());
    }

    public void updatePetAuto() {
        if (getIntNoRecord(GameConstants.HP_ITEM) > 0) {
            client.getSession().write(MaplePacketCreator.petAutoHP(getIntRecord(GameConstants.HP_ITEM)));
        }
        if (getIntNoRecord(GameConstants.MP_ITEM) > 0) {
            client.getSession().write(MaplePacketCreator.petAutoMP(getIntRecord(GameConstants.MP_ITEM)));
        }
    }

    public void sendEnglishQuiz(String msg) {
        client.getSession().write(MaplePacketCreator.englishQuizMsg(msg));
    }

    public void setChangeTime() {
        mapChangeTime = System.currentTimeMillis();
    }

    public long getChangeTime() {
        return mapChangeTime;
    }

    public Map<ReportType, Integer> getReports() {
        return reports;
    }

    public void addReport(ReportType type) {
        Integer value = reports.get(type);
        reports.put(type, value == null ? 1 : (value + 1));
        changed_reports = true;
    }

    public void clearReports(ReportType type) {
        reports.remove(type);
        changed_reports = true;
    }

    public void clearReports() {
        reports.clear();
        changed_reports = true;
    }

    public final int getReportPoints() {
        int ret = 0;
        for (Integer entry : reports.values()) {
            ret += entry;
        }
        return ret;
    }

    public final String getReportSummary() {
        final StringBuilder ret = new StringBuilder();
        final List<Pair<ReportType, Integer>> offenseList = new ArrayList<Pair<ReportType, Integer>>();
        for (final Entry<ReportType, Integer> entry : reports.entrySet()) {
            offenseList.add(new Pair<ReportType, Integer>(entry.getKey(), entry.getValue()));
        }
        Collections.sort(offenseList, new Comparator<Pair<ReportType, Integer>>() {
            @Override
            public final int compare(final Pair<ReportType, Integer> o1, final Pair<ReportType, Integer> o2) {
                final int thisVal = o1.right;
                final int anotherVal = o2.right;
                return (thisVal < anotherVal ? 1 : (thisVal == anotherVal ? 0 : -1));
            }
        });
        for (int x = 0; x < offenseList.size(); x++) {
            ret.append(StringUtil.makeEnumHumanReadable(offenseList.get(x).left.name()));
            ret.append(": ");
            ret.append(offenseList.get(x).right);
            ret.append(" ");
        }
        return ret.toString();
    }

    public short getScrolledPosition() {
        return scrolledPosition;
    }

    public void setScrolledPosition(short s) {
        this.scrolledPosition = s;
    }

    public PlayerRandomStream getRandomStream1() {
        return random1;
    }

    public PlayerRandomStream getRandomStream2() {
        return random2;
    }

    public PlayerRandomStream getRandomStream3() {
        return random3;
    }

//    public MapleTrait getTrait(MapleTraitType t) {
//        return traits.get(t);
//    }
    public void forceCompleteQuest(int id) {
        MapleQuest.getInstance(id).forceComplete(this, 9270035); //troll
    }

    public void changeTeam(int newTeam) {
        this.coconutteam = newTeam;
        client.getSession().write(MaplePacketCreator.showEquipEffect(newTeam));

    }

    public void disease(int type, int level) {
        if (MapleDisease.getBySkill(type) == null) {
            return;
        }
        chair = 0;
        client.getSession().write(MaplePacketCreator.cancelChair(-1));
        map.broadcastMessage(this, MaplePacketCreator.showChair(id, 0), false);
        giveDebuff(MapleDisease.getBySkill(type), MobSkillFactory.getMobSkill(type, level));
    }

    public void clearAllCooldowns() {
        for (MapleCoolDownValueHolder m : getCooldowns()) {
            final int skil = m.skillId;
            removeCooldown(skil);
            client.getSession().write(MaplePacketCreator.skillCooldown(skil, 0));
        }
    }

    public Pair<Double, Boolean> modifyDamageTaken(double damage, MapleMapObject attacke, boolean mana_reflect) {
        Pair<Double, Boolean> ret = new Pair<Double, Boolean>(damage, false);
        if (damage <= 0) {
            return ret;
        }
        if (damage > 0) {
            if (attacke != null) {
                int damr = getBuffedValue(MapleBuffStat.POWERGUARD) != null ? getBuffedValue(MapleBuffStat.POWERGUARD) : 0;
                if (damr <= 0 && getBuffedValue(MapleBuffStat.MANA_REFLECTION) != null && mana_reflect) {
                    damr = getBuffedSkill_X(MapleBuffStat.MANA_REFLECTION) != null ? getBuffedSkill_X(MapleBuffStat.MANA_REFLECTION) : 0;
                }
                final int bouncedam_ = damr;
                if (bouncedam_ > 0) {
                    long bouncedamage = (long) (damage * bouncedam_ / 100);
                    long bouncer = (long) (damage * damr / 100);
                    if (!mana_reflect) {
                        damage -= bouncer;
                    }
                    if (attacke instanceof MapleMonster) {
                        final MapleMonster attacker = (MapleMonster) attacke;
                        bouncedamage = Math.min(bouncedamage, attacker.getMobMaxHp() / (mana_reflect ? 20 : 10));
                        attacker.damage(this, bouncedamage, true);
                        getMap().broadcastMessage(this, MobPacket.damageMonster(attacker.getObjectId(), bouncedamage), getTruePosition());
                    }
                    ret.right = true;
                }
            }
        }
        ret.left = damage;
        return ret;
    }

    public void dropItem(int itemId, final short quantity, int x, int y) {
        Point pos = null;
        pos = new Point(x, y);
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        Item toDrop;
        if (GameConstants.getInventoryType(itemId) == MapleInventoryType.EQUIP) {

            toDrop = ii.randomizeStats((Equip) ii.getEquipById(itemId));
        } else {
            toDrop = new client.inventory.Item(itemId, (byte) 0, (short) quantity, (byte) 0);
        }
        getMap().spawnItemDrop(getClient().getPlayer(), getClient().getPlayer(), toDrop, pos, true, true);
    }

    public void onAttack(long maxhp, int maxmp, int skillid, int oid, int totDamage) {
        if (stats.hpRecoverProp > 0) {
            if (Randomizer.nextInt(100) <= stats.hpRecoverProp) {//i think its out of 100, anyway
                if (stats.hpRecover > 0) {
                    healHP(stats.hpRecover);
                }
                if (stats.hpRecoverPercent > 0) {
                    addHP(((int) Math.min(maxhp, Math.min(((int) ((double) totDamage * (double) stats.hpRecoverPercent / 100.0)), stats.getMaxHp() / 2))));
                }
            }
        }
        if (stats.mpRecoverProp > 0) {
            if (Randomizer.nextInt(100) <= stats.mpRecoverProp) {//i think its out of 100, anyway

                healMP(stats.mpRecover);

            }
        }
        // effects
        if (skillid > 0) {
            final Skill skil = SkillFactory.getSkill(skillid);
            final MapleStatEffect effect = skil.getEffect(getTotalSkillLevel(skil));
            switch (skillid) {
                case 3111008:
                case 4101005:
                case 5111004://drain // Energy Drain
                    addHP(((int) Math.min(maxhp, Math.min(((int) ((double) totDamage * (double) effect.getX() / 100.0)), stats.getMaxHp() / 2))));
                    break;
                case 5211006:
                case 5220011: {//homing
                    clearLinkMid();
                    setLinkMid(oid, effect.getX());
                    break;
                }
            }
        }

    }

    public void clearLinkMid() {
        linkMobs.clear();
        cancelEffectFromBuffStat(MapleBuffStat.HOMING_BEACON);
    }

    public int getFirstLinkMid() {
        for (Integer lm : linkMobs.keySet()) {
            return lm.intValue();
        }
        return 0;
    }

    public Map<Integer, Integer> getAllLinkMid() {
        return linkMobs;
    }

    public void setLinkMid(int lm, int x) {
        linkMobs.put(lm, x);
    }

    public int getDamageIncrease(int lm) {
        if (linkMobs.containsKey(lm)) {
            return linkMobs.get(lm);
        }
        return 0;
    }

    public void setMonsterBookCover(int bookCover) {
        this.bookCover = bookCover;
    }

    public int getMonsterBookCover() {
        return bookCover;
    }

    public void afterAttack(int mobCount, int attackCount, int skillid) {
        switch (getJob()) {
            case 511:
            case 512: {
                handleEnergyCharge(5110001, mobCount * attackCount);
                break;
            }
            case 1510:
            case 1511:
            case 1512: {
                handleEnergyCharge(15100004, mobCount * attackCount);
                break;
            }
            case 111:
            case 112:
            case 1111:
            case 1112:
                if (skillid != 11111003 && skillid != 11111002 && skillid != 11111003 && skillid != 1111008 & getBuffedValue(MapleBuffStat.COMBO) != null) { // shout should not give orbs
                    handleOrbgain();
                }
                break;
        }
    }

    public Rectangle getBounds() {
        return new Rectangle(getTruePosition().x - 25, getTruePosition().y - 75, 50, 75);
    }

    public void goDonateShop(boolean bln) {
        goDonateCashShop = bln;
    }

    public boolean isDonateShop() {
        return goDonateCashShop;
    }

    public final void changeMusic(final String songName) {
        getClient().getSession().write(MaplePacketCreator.musicChange(songName));
    }

    public void toggleStrongBuff() {
        this.usingStrongBuff = !usingStrongBuff;
    }

    public boolean isStrongBuff() {
        return usingStrongBuff;
    }

    public MonsterBook getMonsterBook() {
        return monsterbook;
    }

    public int getFamilyId() {
        if (mfc == null) {
            return 0;
        }
        return mfc.getFamilyId();
    }

    public int getSeniorId() {
        if (mfc == null) {
            return 0;
        }
        return mfc.getSeniorId();
    }

    public int getJunior1() {
        if (mfc == null) {
            return 0;
        }
        return mfc.getJunior1();
    }

    public int getJunior2() {
        if (mfc == null) {
            return 0;
        }
        return mfc.getJunior2();
    }

    public int getCurrentRep() {
        return currentrep;
    }

    public int getTotalRep() {
        return totalrep;
    }

    public void setCurrentRep(int _rank) {
        currentrep = _rank;
        if (mfc != null) {
            mfc.setCurrentRep(_rank);
        }
    }

    public void setTotalRep(int _rank) {
        totalrep = _rank;
        if (mfc != null) {
            mfc.setTotalRep(_rank);
        }
    }

    public int getNoJuniors() {
        if (mfc == null) {
            return 0;
        }
        return mfc.getNoJuniors();
    }

    public MapleFamilyCharacter getMFC() {
        return mfc;
    }

    public void makeMFC(final int familyid, final int seniorid, final int junior1, final int junior2, long loginTime) {
        if (familyid > 0) {
            MapleFamily f = World.Family.getFamily(familyid);
            if (f == null) {
                mfc = null;
            } else {
                mfc = f.getMFC(id);
                if (mfc == null) {
                    mfc = f.addFamilyMemberInfo(this, seniorid, junior1, junior2);
                }
                if (mfc.getSeniorId() != seniorid) {
                    mfc.setSeniorId(seniorid);
                }
                if (mfc.getJunior1() != junior1) {
                    mfc.setJunior1(junior1);
                }
                if (mfc.getJunior2() != junior2) {
                    mfc.setJunior2(junior2);
                }
            }
        } else {
            mfc = null;
        }
    }

    public void setFamily(final int newf, final int news, final int newj1, final int newj2) {
        if (mfc == null || newf != mfc.getFamilyId() || news != mfc.getSeniorId() || newj1 != mfc.getJunior1() || newj2 != mfc.getJunior2()) {
            makeMFC(newf, news, newj1, newj2, firstLoginTime);
        }
    }

    public boolean canUseFamilyBuff(MapleFamilyBuff buff) {
        final MapleQuestStatus stat = getQuestNoAdd(MapleQuest.getInstance(buff.questID));
        if (stat == null) {
            return true;
        }
        if (stat.getCustomData() == null) {
            stat.setCustomData("0");
        }
        return Long.parseLong(stat.getCustomData()) + (24 * 3600000) < System.currentTimeMillis();
    }

    public void useFamilyBuff(MapleFamilyBuff buff) {
        final MapleQuestStatus stat = getQuestNAdd(MapleQuest.getInstance(buff.questID));
        stat.setCustomData(String.valueOf(System.currentTimeMillis()));
    }

    public List<Integer> usedBuffs() {
        //assume count = 1
        List<Integer> used = new ArrayList<Integer>();
        MapleFamilyBuff[] z = MapleFamilyBuff.values();
        for (int i = 0; i < z.length; i++) {
            if (!canUseFamilyBuff(z[i])) {
                used.add(i);
            }
        }
        return used;
    }

    public void saveFamilyStatus() {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE characters SET familyid = ?, seniorid = ?, junior1 = ?, junior2 = ? WHERE id = ?");
            if (mfc == null) {
                ps.setInt(1, 0);
                ps.setInt(2, 0);
                ps.setInt(3, 0);
                ps.setInt(4, 0);
            } else {
                ps.setInt(1, mfc.getFamilyId());
                ps.setInt(2, mfc.getSeniorId());
                ps.setInt(3, mfc.getJunior1());
                ps.setInt(4, mfc.getJunior2());
            }
            ps.setInt(5, id);
            ps.executeUpdate();
        } catch (SQLException se) {
            System.out.println("SQLException: " + se.getLocalizedMessage());
            se.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        //MapleFamily.setOfflineFamilyStatus(familyid, seniorid, junior1, junior2, currentrep, totalrep, id);
    }

    public int maxBattleshipHP(int skillid) {
        return (getTotalSkillLevel(skillid) * 5000) + ((getLevel() - 120) * 3000);
    }

    public int currentBattleshipHP() {
        return battleshipHP;
    }

    public void setBattleshipHP(int v) {
        this.battleshipHP = v;
    }

    public void decreaseBattleshipHP() {
        this.battleshipHP--;
    }

    public long getFirstLoginTime() {
        return firstLoginTime;
    }

    public void setWeddingGive(int l) {
        weddingGiftGive = l;
    }

    public int getWeddingGive() {
        return weddingGiftGive;
    }

    public final void handleEnergyCharge(final int skillid, final int targets) {
        final Skill echskill = SkillFactory.getSkill(skillid);
        final int skilllevel = getTotalSkillLevel(echskill);
        if (skilllevel > 0) {
            final MapleStatEffect echeff = echskill.getEffect(skilllevel);
            if (targets > 0) {
                if (getBuffedValue(MapleBuffStat.ENERGY_CHARGE) == null) {
                    echeff.applyEnergyBuff(this, true); // Infinity time
                } else {
                    Integer energyLevel = getBuffedValue(MapleBuffStat.ENERGY_CHARGE);
                    //TODO: bar going down
                    if (energyLevel < 10000) {
                        energyLevel += (echeff.getX() * targets);

                        client.getSession().write(MaplePacketCreator.showOwnBuffEffect(skillid, 2, getLevel(), skilllevel));
                        map.broadcastMessage(this, MaplePacketCreator.showBuffeffect(id, skillid, 2, getLevel(), skilllevel), false);

                        if (energyLevel >= 10000) {
                            energyLevel = 10000;
                        }
                        client.getSession().write(TemporaryStatsPacket.giveEnergyChargeTest(energyLevel, echeff.getDuration() / 1000));
                        setBuffedValue(MapleBuffStat.ENERGY_CHARGE, Integer.valueOf(energyLevel));
                    } else if (energyLevel == 10000) {
                        echeff.applyEnergyBuff(this, false); // One with time
                        setBuffedValue(MapleBuffStat.ENERGY_CHARGE, Integer.valueOf(10001));
                    }
                }
            }
        }
    }

    // 경규의 Methods
    public final MapleQuestStatus getQuestRecord(final int id) {
        return getQuestNAdd(MapleQuest.getInstance(id));
    }

    public void ServerNotice(String msg) { // 공지 메소드
        World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, msg));
    }

    public void ServerNoticeY(String msg) { // 공지 메소드
        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(msg));
    }

    public void setLocation(int map) { // 맵저장 관련 메소드
        locationed = map;
    }

    public String getMyInfo() { // 캐릭터인포
        if (getClient().getPlayer().getGuildId() == 0) {
            return "< Lv." + getLevel() + " " + getJobName() + " >";
        } else {
            return "< Lv." + getLevel() + " " + getJobName() + " " + getGuild().getName() + "소속 >";
        }
    }

    public String getJobName() {
        if (getJob() == 0) {
            return "초보자";
        } else if (getJob() == 100) {
            return "전사";
        } else if (getJob() == 110) {
            return "파이터";
        } else if (getJob() == 111) {
            return "크루세이더";
        } else if (getJob() == 112) {
            return "히어로";
        } else if (getJob() == 120) {
            return "페이지";
        } else if (getJob() == 121) {
            return "나이트";
        } else if (getJob() == 122) {
            return "팔라딘";
        } else if (getJob() == 130) {
            return "스피어맨";
        } else if (getJob() == 131) {
            return "용기사";
        } else if (getJob() == 132) {
            return "다크나이트";
        } else if (getJob() == 200) {
            return "마법사";
        } else if (getJob() == 210) {
            return "위자드(F.P)";
        } else if (getJob() == 211) {
            return "메이지(F.P)";
        } else if (getJob() == 212) {
            return "아크메이지(F.P)";
        } else if (getJob() == 220) {
            return "위자드(I.C)";
        } else if (getJob() == 221) {
            return "메이지(I.C)";
        } else if (getJob() == 222) {
            return "아크메이지(I.C)";
        } else if (getJob() == 230) {
            return "클레릭";
        } else if (getJob() == 231) {
            return "프리스트";
        } else if (getJob() == 232) {
            return "비숍";
        } else if (getJob() == 300) {
            return "궁수";
        } else if (getJob() == 310) {
            return "헌터";
        } else if (getJob() == 311) {
            return "레인저";
        } else if (getJob() == 312) {
            return "보우마스터";
        } else if (getJob() == 320) {
            return "사수";
        } else if (getJob() == 321) {
            return "저격수";
        } else if (getJob() == 322) {
            return "신궁";
        } else if (getJob() == 400) {
            return "도적";
        } else if (getJob() == 410) {
            return "어쎄신";
        } else if (getJob() == 411) {
            return "허밋";
        } else if (getJob() == 412) {
            return "나이트로드";
        } else if (getJob() == 420) {
            return "시프";
        } else if (getJob() == 421) {
            return "시프마스터";
        } else if (getJob() == 422) {
            return "섀도어";
        } else if (getJob() == 500) {
            return "해적";
        } else if (getJob() == 510) {
            return "인파이터";
        } else if (getJob() == 511) {
            return "버커니어";
        } else if (getJob() == 512) {
            return "바이퍼";
        } else if (getJob() == 520) {
            return "건슬링거";
        } else if (getJob() == 521) {
            return "발키리";
        } else if (getJob() == 522) {
            return "캡틴";
        } else if (getJob() == 522) {
            return "캡틴";
        } else if (getJob() == 900) {
            return "운영자";
        } else {
            return null;
        }
    }

    public void reloadChar() {
        getClient().getSession().write(MaplePacketCreator.getCharInfo(getClient().getPlayer()));
        getMap().removePlayer(getClient().getPlayer());
        getMap().addPlayer(getClient().getPlayer());
    }

    public void removeEquipped(short id) {
        MapleInventoryManipulator.removeFromSlot(client, MapleInventoryType.EQUIPPED, (short) id, (short) 1, false, false);
    }

    public void cancelFishingTask() {
        lastFishingTime = 0;
    }

    public void startFishingTask() {
        cancelFishingTask();
        lastFishingTime = System.currentTimeMillis();
    }

    public boolean canFish(long now) {
        return lastFishingTime > 0 && lastFishingTime + GameConstants.getFishingTime() < now;
    }

    public void doFish(long now) {
        lastFishingTime = now;
        if (client == null || client.getPlayer() == null || !client.isReceiving() || (!haveItem(4031851, 1, false, true)) || chair <= 0) {
            cancelFishingTask();
            return;
        }
        int rand = (int) Math.floor(Math.random() * 9);
        switch (rand) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                MapleQuestStatus cus = getQuestRecord(51234);
                if (cus.getCustomData() == null) {
                    cus.setCustomData("0");
                }
                int point = java.lang.Integer.parseInt(cus.getCustomData());
                cus.setCustomData((point + 1) + "");
                getClient().getSession().write(MaplePacketCreator.showSpecialEffect(15));
                MapleInventoryManipulator.removeById(client, MapleInventoryType.ETC, 4031851, 1, false, false);
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                MapleInventoryManipulator.removeById(client, MapleInventoryType.ETC, 4031851, 1, false, false);
                break;
        }
    }

    public void equipPendantOfSpirit() {
        if (pendantOfSpirit == null) {
            pendantOfSpirit = CloneTimer.getInstance().register(new Runnable() {
                @Override
                public void run() {
                    if (pendantExp < 3) {
                        pendantExp++;
                        dropMessage(5, "정령의 팬던트 효과로 접속한지  " + pendantExp + " 시간이지나 " + pendantExp + "0% 보너스 경험치를 획득합니다.");
                    }
                }
            }, 3600000); //1 hour
        }
    }

    public void unequipPendantOfSpirit() {
        if (pendantOfSpirit != null) {
            pendantOfSpirit.cancel(false);
            pendantOfSpirit = null;
        }
        pendantExp = 0;
    }

    public int getAllconnection() {
        java.util.Map<Integer, Integer> connected = World.getConnected();
        for (int i : connected.keySet()) {
            return connected.get(i);
        }
        return 0;
    }

    public final void SendopenNpcbyid(final int id, final int charid) {
        MapleCharacter partner = getClient().getChannelServer().getPlayerStorage().getCharacterById(charid);
        partner.openNpc2(id);
    }

    public final void SendopenNpc(final int id, final String name) {
        MapleCharacter partner = getClient().getChannelServer().getPlayerStorage().getCharacterByName(name);
        partner.openNpc2(id);
    }

    public final void SendopenNpcByString(final int id, final String name, final String sub) {
        MapleCharacter partner = getClient().getChannelServer().getPlayerStorage().getCharacterByName(name);
        partner.openNpc(id, sub);
    }

    public void openNpc2(int id) {
        NPCScriptManager.getInstance().start(getClient(), id);
    }

    public void openNpc(int id, String sub) {
        NPCScriptManager.getInstance().start(getClient(), id, sub);
    }
}