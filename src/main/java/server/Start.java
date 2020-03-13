package server;

import client.MapleCharacter;
import client.SkillFactory;
import client.inventory.MapleInventoryIdentifier;
import constants.ServerConstants;
import database.DatabaseConnection;
import handling.cashshop.CashShopServer;
import handling.channel.ChannelServer;
import handling.channel.MapleGuildRanking;
import handling.etc.EtcServer;
import handling.etc.handler.EtcHandler;
import handling.login.LoginInformationProvider;
import handling.login.LoginServer;
import handling.world.World;
import handling.world.family.MapleFamily;
import handling.world.guild.MapleGuild;
import org.springframework.boot.SpringApplication;
import server.Timer.*;
import server.events.MapleOxQuizFactory;
import server.life.MapleLifeFactory;
import server.life.MapleMonsterInformationProvider;
import server.life.MobSkillFactory;
import server.life.PlayerNPC;
import server.log.DBLogger;
import server.log.Logger;
import server.log.TypeOfLog;
import server.marriage.MarriageManager;
import server.quest.MapleQuest;
import server.shops.MinervaOwlSearchTop;
import tools.*;
import webapi.Application;

import java.net.InetAddress;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.concurrent.atomic.AtomicInteger;

public class Start {

    public static final Start instance = new Start();
    public static long startTime = System.currentTimeMillis();
    public static AtomicInteger CompletedLoadingThreads = new AtomicInteger(0);
    public static MapleCharacter mc;

    public static void main(final String[] args) throws InterruptedException {
        System.setProperty("polyglot.js.nashorn-compat", "true");
        instance.run();
    }

    public static void BroadcastMsgSchedule(final String msg, long schedule) {
        Timer.CloneTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(msg));
            }
        }, schedule);
    }

    public void run() throws InterruptedException {
        Logger.log("-----BEGIN SERVER CONFIGURATION-----", "Start", TypeOfLog.NORMAL, false);
        DatabaseConnection.init();
        Logger.log("-----END SERVER CONFIGURATION-----", "Start", TypeOfLog.NORMAL, false);
        if (ServerProperties.adminOnly || ServerConstants.Use_Localhost) {
            ServerConstants.Use_Fixed_IV = false;
            System.out.println("[!!! Admin Only Mode Active !!!]");
        }

        String ip = ServerProperties.getIP();
        try {
            InetAddress address = InetAddress.getByName(ip);
            String raw_address = address.getHostAddress();
            ServerConstants.Gateway_IP = address.getAddress();
        } catch (Exception e) {
            e.printStackTrace();
        }

        try (Connection con = DatabaseConnection.getConnection(); PreparedStatement ps = con.prepareStatement("UPDATE accounts SET loggedin = 0")) {
            ps.executeUpdate();
        } catch (SQLException ex) {
            throw new RuntimeException("[EXCEPTION] Please check if the SQL server is active.");
        }
        World.init();
        WorldTimer.getInstance().start();
        EtcTimer.getInstance().start();
        MapTimer.getInstance().start();
        CloneTimer.getInstance().start();
        EventTimer.getInstance().start();
        BuffTimer.getInstance().start();
        PingTimer.getInstance().start();
        LoadingThread WorldLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleGuildRanking.getInstance().load();
                MapleGuild.loadAll(); //(this);
            }
        }, "WorldLoader", this);
        LoadingThread MarriageLoader = new LoadingThread(() -> MarriageManager.getInstance(), "MarriageLoader", this);
        LoadingThread MedalRankingLoader = new LoadingThread(() -> MedalRanking.loadAll(), "MedalRankingLoader", this);
        LoadingThread FamilyLoader = new LoadingThread(() -> {
            MapleFamily.loadAll(); //(this);
        }, "FamilyLoader", this);
        LoadingThread QuestLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleLifeFactory.loadQuestCounts();
                MapleQuest.initQuests();
            }
        }, "QuestLoader", this);
        LoadingThread ProviderLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleItemInformationProvider.getInstance().runEtc();
            }
        }, "ProviderLoader", this);
        LoadingThread MonsterLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleMonsterInformationProvider.getInstance().load();
                //BattleConstants.init();
            }
        }, "MonsterLoader", this);
        LoadingThread ItemLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleItemInformationProvider.getInstance().runItems();
            }
        }, "ItemLoader", this);
        LoadingThread SkillFactoryLoader = new LoadingThread(new Runnable() {
            public void run() {
                SkillFactory.load();
            }
        }, "SkillFactoryLoader", this);
        LoadingThread BasicLoader = new LoadingThread(new Runnable() {
            public void run() {
                LoginInformationProvider.getInstance();
                RandomRewards.load();
                RandomRewards.loadGachaponRewardFromINI("ini/gachapon.ini");
                MapleOxQuizFactory.getInstance();
                MapleCarnivalFactory.getInstance();
                MobSkillFactory.getInstance();
                SpeedRunner.loadSpeedRuns();
                MinervaOwlSearchTop.getInstance().loadFromFile();
            }
        }, "BasicLoader", this);
        LoadingThread MIILoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleInventoryIdentifier.Companion.getInstance();
            }
        }, "MIILoader", this);
        LoadingThread CashItemLoader = new LoadingThread(new Runnable() {
            public void run() {
                CashItemFactory.getInstance().initialize();
            }
        }, "CashItemLoader", this);

        LoadingThread[] LoadingThreads = {WorldLoader, FamilyLoader, QuestLoader, ProviderLoader, SkillFactoryLoader,
                BasicLoader, CashItemLoader, MIILoader, MonsterLoader, ItemLoader, MarriageLoader, MedalRankingLoader};

        for (Thread t : LoadingThreads) {
            t.start();
        }
        synchronized (this) {
            wait();
        }
        while (CompletedLoadingThreads.get() != LoadingThreads.length) {
            synchronized (this) {
                wait();
            }
        }
        MapleItemInformationProvider.getInstance().runQuest();

        try {
            LoginServer.run_startup_configurations();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        try {
            ChannelServer.startChannel_Main();
        } catch (Exception e) {
            throw new RuntimeException();
        }

        try {
            CashShopServer.run_startup_configurations();
        } catch (Exception e) {
            throw new RuntimeException();
        }

        //threads.
        CheatTimer.getInstance().register(AutobanManager.getInstance(), 60000);
        Runtime.getRuntime().addShutdownHook(new Thread(new Shutdown()));
        World.registerRespawn();
        //ChannelServer.getInstance(1).getMapFactory().getMap(910000000).spawnRandDrop(); //start it off
        ShutdownServer.registerMBean();
        ServerConstants.registerMBean();
        PlayerNPC.loadAll();// touch - so we see database problems early...
        //MapleMonsterInformationProvider.getInstance().addExtra();
        try {
            EtcServer.start();
        } catch (Exception e) {
            throw new RuntimeException();
        }
        DatabaseBackup.getInstance().startTasking();
        LoginServer.setOn(); //now or later

        if (ServerConstants.Use_Localhost) {
            new PacketSender().setVisible(true);
        }
        new MemoryUsageWatcher(88).start();
        new GUI().setVisible(false);
        new DeadLockDetector(60, DeadLockDetector.RESTART).start();
        DBLogger.instance.clearLog(14, 30, 21); //Log Clear interval 14/30/21 days
        EtcHandler.handle((short) 0, null, null); // initialize class
        SpringApplication.run(Application.class);
        //new PacketSender().setVisible(true);

    }

    public static class Shutdown implements Runnable {

        @Override
        public void run() {
            ShutdownServer.getInstance().run();
            ShutdownServer.getInstance().run();
        }
    }

    private static class LoadingThread extends Thread {

        protected String LoadingThreadName;

        private LoadingThread(Runnable r, String t, Object o) {
            super(new NotifyingRunnable(r, o, t));
            LoadingThreadName = t;
        }

        @Override
        public synchronized void start() {
            super.start();
        }
    }

    private static class NotifyingRunnable implements Runnable {

        private final Object ToNotify;
        private String LoadingThreadName;
        private long StartTime;
        private Runnable WrappedRunnable;

        private NotifyingRunnable(Runnable r, Object o, String name) {
            WrappedRunnable = r;
            ToNotify = o;
            LoadingThreadName = name;
        }

        public void run() {
            StartTime = System.currentTimeMillis();
            WrappedRunnable.run();
            synchronized (ToNotify) {
                CompletedLoadingThreads.incrementAndGet();
                ToNotify.notify();
            }
        }
    }

    private static class AutoShutdown implements Runnable {
        protected static Thread t = null;

        @Override
        public void run() {
            t = new Thread(ShutdownServer.getInstance());
            ShutdownServer.getInstance().shutdown();
            t.start();
        }
    }
}
