/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package handling.etc;

import client.MapleClient;
import java.net.ServerSocket;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author
 */
public class EtcServer {

    private static EtcServerThread thread;
    private static final List<MapleClient> gmclients = new ArrayList<MapleClient>();

    public static void start() throws Exception {
        thread = new EtcServerThread();
        thread._serverSocket = new ServerSocket(1231);
        thread.start();
    }

    public static void add(MapleClient c) {
        synchronized (gmclients) {
            gmclients.add(c);
        }
    }
    public static void remove(MapleClient c) {
        synchronized (gmclients) {
            gmclients.remove(c);
        }
    }
    public static void broadcast(byte[] data) {
        synchronized (gmclients) {
            for (MapleClient cli : gmclients) {
                cli.sendPacket(data);
            }
        }
    }
}
