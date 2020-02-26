package server.log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.logging.Level;
import java.util.logging.Logger;

public class LogCommiter {

//    private final List<String> queries = new ArrayList<String>();
//    private long lastCommitTime = System.currentTimeMillis();
//    private static final int MAX_QUEUED_COUNT = 10240;
//    private ScheduledFuture<?> commitSchedule = null;
//    private Connection con = DatabaseConnection_C.getConnection();
//    private long interval;
//    private Boolean commiting = Boolean.FALSE;
//    private boolean shutdown = false;
//    private static final boolean commitOnServerDown = true;
    private FileOutputStream fos = null;
    private final File file;

    protected LogCommiter(long interval) {
//        if (!commitOnServerDown) {
//            final Runnable timer = new Runnable() {
//                @Override
//                public void run() {
//                    checkQuery();
//                }
//            };
//            this.interval = interval;
//            commitSchedule = Timer.CloneTimer.getInstance().register(timer, interval);
//        }
        file = new File("etcs/updatesql/log.sql");
        try {
            fos = new FileOutputStream(file);
            fos.write(("-- Amherst Log SQL -- " + System.getProperty("line.separator") + System.getProperty("line.separator")).getBytes(Charset.forName("MS949")));
        } catch (FileNotFoundException ex) {
            Logger.getLogger(LogCommiter.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(LogCommiter.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println("Amherst is now connectable.");
        System.out.println("----------------------------------------------------");
    }

    /**
     * shutdown safety.
     *
     */
    public void shutdown() {
        try {
            fos.close();
    //        commitToDB();
    //        System.out.println("[Log] Successfully commited last logs.");
    //        System.out.println("[Log] Successfully commited last logs.");
        } catch (IOException ex) {
            Logger.getLogger(LogCommiter.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    /**
     * Check if instance has enough queries to commit.
     *
     * @see server.log.LogCommiter#addQuery
     */
    private void checkQuery() {
//        if (!commitOnServerDown) {
//            if (lastCommitTime > System.currentTimeMillis() + interval) {
//                return;
//            }
//            if (shutdown) {
//                return;
//            }
//            if (queries.size() > MAX_QUEUED_COUNT && !commiting) {
//                commitToDB();
//            }
//        }
    }

    /**
     * Add SQL Statement to List. This class will try to commit to DB at an
     * interval of default 10 secs. (using 'Timer' class. (concurrent library
     * class)) <br/> This method will add string query statement to list of
     * reservation of commit.
     *
     * @param query <String> SQL Query Statement to commit
     */
    public void addQuery(String query) {
        try {
            //        if (!commitOnServerDown) {
            //            if (shutdown) {
            //                return;
            //            }
            //            checkQuery();
            //            synchronized (queries) {
            //                queries.add(query);
            //            }
            //        }
                    fos.write((query + ";" + System.getProperty("line.separator")).getBytes(Charset.forName("MS949")));
        } catch (IOException ex) {
        }

    }

    protected void commitToDB() {
//        Thread run = new Thread() {
//            @Override
//            public void run() {
//                if (shutdown) {
//                    return;
//                }
//                if (commiting) {
//                    return;
//                }
//                synchronized (commiting) {
//                    commiting = Boolean.TRUE;
//                    PreparedStatement ps = null;
//                    try {
//                        con.setTransactionIsolation(Connection.TRANSACTION_READ_UNCOMMITTED);
//                        con.setAutoCommit(false);
//                        synchronized (queries) {
//                            for (String query : queries) {
//                                try {
//                                    ps = con.prepareStatement(query);
//                                    ps.execute();
//                                    ps.close();
//                                } catch (Exception e) {
//                                }
//                            }
//                        }
//                        con.commit();
//                    } catch (Exception e) {
//                        FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
//                        e.printStackTrace();
//                        System.err.println("[log] Error Save Log");
//                        String faillog = "";
//                        synchronized (queries) {
//                            for (String query : queries) {
//                                faillog += query;
//                                faillog += "\r\n";
//                            }
//                        }
//                        FileoutputUtil.log("Log_FailCommit_" + System.currentTimeMillis() + ".txt", faillog);
//                    } finally {
//                        queries.clear();
//                        try {
//                            if (ps != null) {
//                                ps.close();
//                            }
//                            con.setAutoCommit(true);
//                            con.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
//                        } catch (SQLException e) {
//                            FileoutputUtil.outputFileError(FileoutputUtil.PacketEx_Log, e);
//                            e.printStackTrace();
//                            System.err.println("[log] Error going back to autocommit mode");
//                        }
//                    }
//                    lastCommitTime = System.currentTimeMillis();
//                    commiting = Boolean.FALSE;
//                }
//            }
//        };
//        run.setName("Log Commit Thread");
//        GeneralThreadPool.getInstance().execute(run);
    }
}
