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
import java.net.InetAddress;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;
import server.Timer.BuffTimer;
import server.Timer.CheatTimer;
import server.Timer.CloneTimer;
import server.Timer.EtcTimer;
import server.Timer.EventTimer;
import server.Timer.MapTimer;
import server.Timer.PingTimer;
import server.Timer.WorldTimer;
import server.events.MapleOxQuizFactory;
import server.events.OnTimeGiver;
import server.life.MapleLifeFactory;
import server.life.MapleMonsterInformationProvider;
import server.life.MobSkillFactory;
import server.life.PlayerNPC;
import server.log.DBLogger;
import server.marriage.MarriageManager;
import server.quest.MapleQuest;
import server.shops.MinervaOwlSearchTop;
import tools.DatabaseBackup;
import tools.DeadLockDetector;
import tools.MaplePacketCreator;
import tools.MemoryUsageWatcher;
import tools.StringUtil;
import tools.SystemUtils;

public class Start {

    public static long startTime = System.currentTimeMillis();
    public static final Start instance = new Start();
    public static AtomicInteger CompletedLoadingThreads = new AtomicInteger(0);
    public static MapleCharacter mc;

    public void run() throws InterruptedException {

        DatabaseConnection.init();

        if (ServerProperties.adminOnly || ServerConstants.Use_Localhost) {
            ServerConstants.Use_Fixed_IV = false;
            System.out.println("[!!! Admin Only Mode Active !!!]");
        }

        String ip = ServerProperties.getIP();
        if (ip != null) {
            try {
                InetAddress address = InetAddress.getByName(ip);
                String raw_address = address.getHostAddress();

                ServerConstants.Gateway_IP = address.getAddress();

            } catch (Exception e) {
                e.printStackTrace();

                ServerConstants.Gateway_IP = new byte[]{(byte) 191, (byte) 233, (byte) 32, (byte) 84};
            }
        } else {
        }

        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE accounts SET loggedin = 0");
            ps.executeUpdate();
            ps.close();
        } catch (SQLException ex) {
            throw new RuntimeException("[EXCEPTION] Please check if the SQL server is active.");
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
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
        LoadingThread MarriageLoader = new LoadingThread(new Runnable() {
            public void run() {
                MarriageManager.getInstance();
            }
        }, "MarriageLoader", this);
        LoadingThread MedalRankingLoader = new LoadingThread(new Runnable() {
            public void run() {
                MedalRanking.loadAll();
            }
        }, "MedalRankingLoader", this);
        LoadingThread FamilyLoader = new LoadingThread(new Runnable() {
            public void run() {
                MapleFamily.loadAll(); //(this);
            }
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
                MapleInventoryIdentifier.getInstance();
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
//        MapleMonsterInformationProvider.getInstance().addExtra();
        try {
            EtcServer.start();
        } catch (Exception e) {
            throw new RuntimeException();
        }
        DatabaseBackup.getInstance().startTasking();
        LoginServer.setOn(); //now or later


        /* Handle Event */
        if (SystemUtils.getTimeMillisByDay(2013, 9, 18) < System.currentTimeMillis() && System.currentTimeMillis() < SystemUtils.getTimeMillisByDay(2013, 9, 23)) {
            Runnable eventStart = new Runnable() {
                @Override
                public void run() {
                    LoginServer.setFlag((byte) 1);
                    LoginServer.setEventMessage("#r18일 14시 ~ 22일 16시#k\r\r#b경험치 두배#k\r#b드롭률 두배#k");
                    for (ChannelServer cserv : ChannelServer.getAllInstances()) {
                        cserv.setExpRate(2);
                        cserv.setDropRate(2);
                        cserv.setServerMessage("");
                    }
                }
            };
            Runnable eventEnd = new Runnable() {
                @Override
                public void run() {
                    LoginServer.setFlag((byte) 0);
                    LoginServer.setEventMessage("");
                    for (ChannelServer cserv : ChannelServer.getAllInstances()) {
                        cserv.setExpRate(1);
                        cserv.setDropRate(1);
                    }
                }
            };
            SystemUtils.setScheduleAtTime(2013, 9, 18, 14, 0, 0, eventStart);
            SystemUtils.setScheduleAtTime(2013, 9, 22, 16, 0, 0, eventEnd);
            LoginServer.setEventMessage("#r18일 14시 ~ 22일 16시#k\r\r#b경험치 두배#k\r#b드롭률 두배#k\r\r9월 19일 목요일\r#b오후 3시#k \r#r온타임 이벤트#k");
        }

        if (ServerConstants.Use_Localhost) {
            new PacketSender().setVisible(true);
        }
        new MemoryUsageWatcher(88).start();
        new GUI().setVisible(false);
        new DeadLockDetector(60, DeadLockDetector.RESTART).start();
        DBLogger.instance.clearLog(14, 30, 21); //Log Clear interval 14/30/21 days
        EtcHandler.handle((short) 0, null, null); // initialize class
//        new PacketSender().setVisible(true);
    }

    public static class Shutdown implements Runnable {

        @Override
        public void run() {
            ShutdownServer.getInstance().run();
            ShutdownServer.getInstance().run();
        }
    }

    public static void main(final String args[]) throws InterruptedException {
        instance.run();
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

        private String LoadingThreadName;
        private long StartTime;
        private Runnable WrappedRunnable;
        private final Object ToNotify;

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

    public static void BroadcastMsgSchedule(final String msg, long schedule) {
        Timer.CloneTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(msg));
            }
        }, schedule);
    }

    public static void 출석초기화스케쥴(long schedule) {
        Timer.CloneTimer.getInstance().schedule(new Runnable() {
            @Override
            public void run() {
                try {
                    World.Broadcast.출석초기화();
                } catch (SQLException ex) {
                    Logger.getLogger(Start.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }, schedule);
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
