/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package client;

import java.lang.ref.WeakReference;

/** Using instead of IoSession class of Apache MINA Framework.
 * too lazy change all the usage 'getSession().write()' and 'getSession().close()'.
 *
 * @author Eternal
 */

public class MapleSession {

    private final WeakReference<MapleClient> client;

    protected MapleSession(MapleClient c) {
        client = new WeakReference<>(c);
    }

    public void write(byte[] data) {
        if (client.get() != null) {
            client.get().sendPacket(data);
        }
    }

    public void close() {
        if (client.get() != null) {
            client.get().setStop();
        }
    }

    public void close(boolean f) {
        close();
    }
}
