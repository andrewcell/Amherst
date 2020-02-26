/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package handling.channel;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import client.MapleCharacterUtil;
import client.MapleCharacter;

import handling.world.CharacterTransfer;
import handling.world.CheaterData;
import handling.world.World;
import java.util.concurrent.ConcurrentHashMap;
import server.Timer.PingTimer;
import server.shops.IMaplePlayerShop;

public class PlayerStorage {

//    private final ReentrantReadWriteLock mutex = new ReentrantReadWriteLock();
//    private final Lock rL = mutex.readLock(), wL = mutex.writeLock();
//    private final ReentrantReadWriteLock mutex2 = new ReentrantReadWriteLock();
//    private final Lock rL2 = mutex2.readLock(), wL2 = mutex2.writeLock();
    private final Map<String, MapleCharacter> nameToChar = new ConcurrentHashMap<String, MapleCharacter>();
    private final Map<Integer, MapleCharacter> idToChar = new ConcurrentHashMap<Integer, MapleCharacter>();
    private final Map<Integer, CharacterTransfer> PendingCharacter = new ConcurrentHashMap<Integer, CharacterTransfer>();
    private int channel;

    public PlayerStorage(int channel) {
        this.channel = channel;
        // Prune once every 15 minutes
        PingTimer.getInstance().register(new PersistingTask(), 60000);
    }

    public final ArrayList<MapleCharacter> getAllCharacters() {
        return new ArrayList<MapleCharacter>(idToChar.values());
    }

    public final void registerPlayer(final MapleCharacter chr) {
        nameToChar.put(chr.getName().toLowerCase(), chr);
        idToChar.put(chr.getId(), chr);
        World.Find.register(chr.getId(), chr.getName(), channel);
    }

    public final void registerPendingPlayer(final CharacterTransfer chr, final int playerid) {
        PendingCharacter.put(playerid, chr);//new Pair(System.currentTimeMillis(), chr));
    }

    public final void deregisterPlayer(final MapleCharacter chr) {
        nameToChar.remove(chr.getName().toLowerCase());
        idToChar.remove(chr.getId());
        World.Find.forceDeregister(chr.getId(), chr.getName());
    }

    public final void deregisterPlayer(final int idz, final String namez) {
        nameToChar.remove(namez.toLowerCase());
        idToChar.remove(idz);
        World.Find.forceDeregister(idz, namez);
    }

    public final int pendingCharacterSize() {
        return PendingCharacter.size();
    }

    public final void deregisterPendingPlayer(final int charid) {
        PendingCharacter.remove(charid);
    }

    public final CharacterTransfer getPendingCharacter(final int charid) {
        return PendingCharacter.remove(charid);
    }

    public final MapleCharacter getCharacterByName(final String name) {
        return nameToChar.get(name.toLowerCase());
    }

    public final MapleCharacter getCharacterById(final int id) {
        return idToChar.get(id);
    }

    public final int getConnectedClients() {
        return idToChar.size();
    }

    public final List<CheaterData> getCheaters() {
        final List<CheaterData> cheaters = new ArrayList<CheaterData>();

        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();

            if (chr.getCheatTracker().getPoints() > 0) {
                cheaters.add(new CheaterData(chr.getCheatTracker().getPoints(), MapleCharacterUtil.makeMapleReadable(chr.getName()) + " (" + chr.getCheatTracker().getPoints() + ") " + chr.getCheatTracker().getSummary()));
            }
        }
        return cheaters;
    }

    public final List<CheaterData> getReports() {
        final List<CheaterData> cheaters = new ArrayList<CheaterData>();

        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();

            if (chr.getReportPoints() > 0) {
                cheaters.add(new CheaterData(chr.getReportPoints(), MapleCharacterUtil.makeMapleReadable(chr.getName()) + " (" + chr.getReportPoints() + ") " + chr.getReportSummary()));
            }
        }
        return cheaters;
    }

    public final void disconnectAll() {
        disconnectAll(false);
    }

    public final void disconnectAll(final boolean checkGM) {
        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();

            if (!chr.isGM() || !checkGM) {
                chr.getClient().disconnect(false, false, true);
                chr.getClient().getSession().close(true);
                World.Find.forceDeregister(chr.getId(), chr.getName());
                itr.remove();
            }
        }
    }

    public final int save() {
        int ret = 0;
        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();
            final IMaplePlayerShop shop = chr.getPlayerShop();
            if (shop != null) {
                shop.removeVisitor(chr, true);
                if (shop.isOwner(chr)) {
                    shop.closeShop(true, false, false);
                }
            }
//            chr.getClient().disconnect(true, true);
            chr.saveToDB(true, false);
            chr.getClient().getSession().close(true);
            World.Find.forceDeregister(chr.getId(), chr.getName());
            itr.remove();
            ++ret;
        }
        return ret;
    }

    public final String getOnlinePlayers(final boolean byGM) {
        final StringBuilder sb = new StringBuilder();

        if (byGM) {
            final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
            while (itr.hasNext()) {
                sb.append(MapleCharacterUtil.makeMapleReadable(itr.next().getName()));
                sb.append(", ");
            }
        } else {
            final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
            MapleCharacter chr;
            while (itr.hasNext()) {
                chr = itr.next();

                if (!chr.isGM()) {
                    sb.append(MapleCharacterUtil.makeMapleReadable(chr.getName()));
                    sb.append(", ");
                }
            }
        }
        return sb.toString();
    }

    public final void broadcastPacket(final byte[] data) {
        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        while (itr.hasNext()) {
            itr.next().getClient().getSession().write(data);
        }
    }

    public final void broadcastSmegaPacket(final byte[] data) {
        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();

            if (chr.getClient().isLoggedIn() && chr.getSmega()) {
                chr.getClient().getSession().write(data);
            }
        }
    }

    public final void broadcastGMPacket(final byte[] data) {
        final Iterator<MapleCharacter> itr = nameToChar.values().iterator();
        MapleCharacter chr;
        while (itr.hasNext()) {
            chr = itr.next();

            if (chr.getClient().isLoggedIn() && chr.isIntern()) {
                chr.getClient().getSession().write(data);
            }
        }
    }

    public class PersistingTask implements Runnable {

        @Override
        public void run() {
            final long currenttime = System.currentTimeMillis();
            final Iterator<Map.Entry<Integer, CharacterTransfer>> itr = PendingCharacter.entrySet().iterator();

            while (itr.hasNext()) {
                if (currenttime - itr.next().getValue().TranferTime > 40000) { // 40 sec
                    itr.remove();
                }
            }
        }
    }
}
