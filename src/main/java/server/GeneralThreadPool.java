/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server;

import handling.login.LoginServer;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;

/**
 *
 * @author Eternal
 */
public class GeneralThreadPool {

    private static Logger _log = Logger.getLogger(GeneralThreadPool.class.getName());
    private static GeneralThreadPool _instance;
    private static final int SCHEDULED_CORE_POOL_SIZE = 10;
    private Executor _executor;
    private ScheduledExecutorService _scheduler;
    private ScheduledExecutorService _pcScheduler;
    private final int _pcSchedulerPoolSize = 1 + LoginServer.getUserLimit() / 20;

    public static GeneralThreadPool getInstance() {
        if (_instance == null) {
            _instance = new GeneralThreadPool();
        }
        return _instance;
    }

    private GeneralThreadPool() {
//        if (Config.THREAD_P_TYPE_GENERAL == 1) {
//            _executor = Executors.newFixedThreadPool(10);
//        } else 
//        if (Config.THREAD_P_TYPE_GENERAL == 2) {
        _executor = Executors.newCachedThreadPool();
//        } else {
//            _executor = null;
//        }
        _scheduler = Executors.newScheduledThreadPool(SCHEDULED_CORE_POOL_SIZE,
                new PriorityThreadFactory("GerenalSTPool", Thread.NORM_PRIORITY));
        _pcScheduler = Executors.newScheduledThreadPool(_pcSchedulerPoolSize,
                new PriorityThreadFactory("PcMonitorSTPool", Thread.NORM_PRIORITY));
    }

    public void execute(Runnable r) {
        if (_executor == null) {
            Thread t = new Thread(r);
            t.start();
        } else {
            _executor.execute(r);
        }
    }
    public void execute(Runnable r, String n) {
//        if (_executor == null) {
            Thread t = new Thread(r, n);
            t.start();
//        } else {
//            _executor.execute(r);
//        }
    }

    public void execute(Thread t) {
        t.start();
    }

    public ScheduledFuture<?> schedule(Runnable r, long delay) {
        try {
            if (delay <= 0) {
                _executor.execute(r);
                return null;
            }
            return _scheduler.schedule(r, delay, TimeUnit.MILLISECONDS);
        } catch (RejectedExecutionException e) {
            return null;
        }
    }

    public ScheduledFuture<?> scheduleAtFixedRate(Runnable r,
            long initialDelay, long period) {
        return _scheduler.scheduleAtFixedRate(r, initialDelay, period,
                TimeUnit.MILLISECONDS);
    }

//    public ScheduledFuture<?> pcSchedule(L1PcMonitor r, long delay) {
//        try {
//            if (delay <= 0) {
//                _executor.execute(r);
//                return null;
//            }
//            return _pcScheduler.schedule(r, delay, TimeUnit.MILLISECONDS);
//        } catch (RejectedExecutionException e) {
//            return null;
//        }
//    }
//    public ScheduledFuture<?> pcScheduleAtFixedRate(L1PcMonitor r,
//            long initialDelay, long period) {
//        return _pcScheduler.scheduleAtFixedRate(r, initialDelay, period,
//                TimeUnit.MILLISECONDS);
//    }
    private class PriorityThreadFactory implements ThreadFactory {

        private final int _prio;
        private final String _name;
        private final AtomicInteger _threadNumber = new AtomicInteger(1);
        private final ThreadGroup _group;

        public PriorityThreadFactory(String name, int prio) {
            _prio = prio;
            _name = name;
            _group = new ThreadGroup(_name);
        }

        /*
         * (non-Javadoc)
         * 
         * @see java.util.concurrent.ThreadFactory#newThread(java.lang.Runnable)
         */
        public Thread newThread(Runnable r) {
            Thread t = new Thread(_group, r);
            t.setName(_name + "-" + _threadNumber.getAndIncrement());
            t.setPriority(_prio);
            return t;
        }

        public ThreadGroup getGroup() {
            return _group;
        }
    }
}
