package tools;

import constants.ServerConstants;
import database.DatabaseOption;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import server.GeneralThreadPool;
import server.Timer.WorldTimer;

public class DatabaseBackup {

    public static DatabaseBackup instance = null;

    public static DatabaseBackup getInstance() {
        if (instance == null) {
            instance = new DatabaseBackup();
        }
        return instance;
    }

    private static boolean isName(String name) {
        String osname = System.getProperty("os.name");

        if ((osname == null) || (osname.length() <= 0)) {
            return false;
        }

        osname = osname.toLowerCase();
        name = name.toLowerCase();

        if (osname.indexOf(name) >= 0) {
            return true;
        }

        return false;
    }

    public void startTasking() {
//        WorldTimer tMan = WorldTimer.getInstance();
        Runnable r = new Runnable() {
            public void run() {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHH");
                    String name = sdf.format(Calendar.getInstance().getTime());
                    Process p = null;
                    if (isName("linux")) {
                        p = Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c", "/op/lampp/mysql/bin/mysqldump -u" + DatabaseOption.MySQLUSER + " -p" + DatabaseOption.MySQLPASS + " maplestory > dbbackup/" + name + ".sql.gz"});
                    } else {
                        p = Runtime.getRuntime().exec("cmd /C mysqldump -u" + DatabaseOption.MySQLUSER + " -p" + DatabaseOption.MySQLPASS + " maplestory > dbbackup\\" + name + ".sql");
                    }
                    p.getInputStream().read();
                    try {
                        p.waitFor();
                    } finally {
                        p.destroy();
                    }
                    if (isName("windows")) {
                        p = Runtime.getRuntime().exec("cmd /C gzip -9 dbbackup\\" + name + ".sql");
                        p.getInputStream().read();
                        try {
                            p.waitFor();
                        } finally {
                            p.destroy();
                        }
                        File toDel = new File("dbbackup\\" + name + ".sql");
                        toDel.delete();
                    }

                    String name2 = sdf.format(new Date(System.currentTimeMillis() - (86400000L * 14)));
                    File del = null;
                    if (isName("windows")) {
                        del = new File("dbbackup\\" + name2 + ".sql.gz");
                    } else if (isName("linux")) {
                        del = new File("dbbackup/" + name2 + ".sql.gz");
                    }
                    if ((del != null) && (del.exists())) {
                        del.delete();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
//        System.out.println("[DBBackup] DB Backup Started.");
//        GeneralThreadPool.getInstance().execute(r);
        r.run();
        //tMan.register(r, 3600000);
    }
}
