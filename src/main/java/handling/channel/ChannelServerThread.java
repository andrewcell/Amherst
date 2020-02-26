/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package handling.channel;

import client.MapleClient;
import constants.ServerConstants;
import handling.ServerType;
import handling.SessionOpen;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.logging.Logger;
import server.GeneralThreadPool;
import tools.SystemUtils;

/**
 *
 * @author Eternal
 */
public class ChannelServerThread extends Thread {

    protected ServerSocket _serverSocket;
    private static Logger _log = Logger.getLogger(ChannelServerThread.class
            .getName());
    final int channel;
    final int port;

    public ChannelServerThread(int chan, int p) {
        channel = chan;
        port = p;
    }

    @Override
    public void run() {

        while (!ChannelServer.getInstance(channel).isShutdown()) {
            try {
                Socket socket = _serverSocket.accept();
//                System.out.println("New Connection from "
//                        + socket.getInetAddress());
                String host = socket.getInetAddress().getHostAddress();
                if (SessionOpen.sessionOpen(host, ServerType.CHANNEL, channel)) {
                    // Session OK!
                    MapleClient client = new MapleClient(socket, channel, !ServerConstants.Use_Fixed_IV);
                    GeneralThreadPool.getInstance().execute(client);
                } else {
                    // Session Failed or Banned
                    _log.info("Session Opening Failed on (" + host + ")");
                }
            } catch (IOException ioe) {
            }
        }
    }
}
