package handling;

import handling.cashshop.CashShopServer;
import handling.channel.ChannelServer;
import handling.login.LoginServer;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import tools.Pair;
import constants.ServerConstants;

public class SessionOpen {

    private static final List<String> BlockedIP = new ArrayList<>();
    private static final Map<String, Long> BlockedTime = new ConcurrentHashMap<>();
    private static final Map<String, Pair<Long, Byte>> tracker = new ConcurrentHashMap<>();

    public static boolean sessionOpen(String host, byte serverType, int channel) {
        final String address = host;
        // Start of IP checking
        if (!ServerConstants.Use_Localhost) {
            if (BlockedIP.contains(address) && BlockedTime.containsKey(address)) {
                if (BlockedTime.get(address) + 1200000l > System.currentTimeMillis()) {
                    return false;
                } else {
                    BlockedIP.remove(address);
                    BlockedTime.remove(address);
                    return true;
                }
            }
            final Pair<Long, Byte> track = tracker.get(address);

            byte count;
            if (track == null) {
                count = 1;
            } else {
                count = track.right;

                final long difference = System.currentTimeMillis() - track.left;
                if (difference < 2000) { // Less than 2 sec
                    count++;
                } else if (difference > 20000) { // Over 20 sec
                    count = 1;
                }
                if (count >= 10) {
                    BlockedIP.add(address);
                    BlockedTime.put(address, System.currentTimeMillis());
                    tracker.remove(address); // Cleanup
                    return false;
                }
            }
            tracker.put(address,
                    new Pair<>(System.currentTimeMillis(), count));
        }
        // End of IP checking.
        if (serverType == ServerType.CHANNEL) {
            if (ChannelServer.getInstance(channel).isShutdown()) {
                return false;
            }
            if (!LoginServer.containsIPAuth(host)) {
                return false;
            }

        } else if (serverType == ServerType.CASHSHOP) {
            if (CashShopServer.isShutdown()) {
                return false;
            }
        } else {
            if (LoginServer.isShutdown()) {
                return false;
            }
        }
        LoginServer.removeIPAuth(host);
        return true;
    }
}
