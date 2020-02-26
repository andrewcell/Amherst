package handling.login;

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

public class LoginServerThread extends Thread {

    protected ServerSocket _serverSocket;
    private static Logger _log = Logger.getLogger(LoginServerThread.class
            .getName());

    @Override
    public void run() {

        while (!LoginServer.isShutdown()) {
            try {
                Socket socket = _serverSocket.accept();
//                System.out.println("New Connection from "
//                        + socket.getInetAddress());
                String host = socket.getInetAddress().getHostAddress();
                if (SessionOpen.sessionOpen(host, ServerType.LOGIN, -1)) {
                    // Session OK!
                    MapleClient client = new MapleClient(socket, -1, !ServerConstants.Use_Fixed_IV);
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
