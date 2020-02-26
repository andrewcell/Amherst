/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server.maps;

import client.MapleClient;
import java.awt.Point;
import tools.packet.CSPacket;

/**
 *
 * @author
 */
public class MapleMessageBox extends MapleMapObject {
    
    private int itemid;
    private String owner;
    private String msg;
    private long startTime;
    
    public MapleMessageBox(int itemid, Point pos, String owner, String message) {
        super();
        setPosition(pos);
        this.itemid = itemid;
        this.owner = owner;
        this.msg = message;
        this.startTime = System.currentTimeMillis();
    }
    
    public boolean shouldRemove() {
        return startTime + 600000L < System.currentTimeMillis();
    }
    
    public void expire(final MapleMap map) {
	map.broadcastMessage(CSPacket.destroyMessageBox(true, getObjectId()));
	map.removeMapObject(this);
    }

    @Override
    public MapleMapObjectType getType() {
        return MapleMapObjectType.MESSAGEBOX;
    }

    @Override
    public void sendSpawnData(MapleClient client) {
        client.getSession().write(CSPacket.spawnMessageBox(getObjectId(), itemid, owner, msg, (short) getPosition().x, (short) getPosition().y));
    }

    @Override
    public void sendDestroyData(MapleClient client) {
        client.getSession().write(CSPacket.destroyMessageBox(true, getObjectId()));
    }
    
}
