/*
 * Copyright (C) 2013 Nemesis Maple Story Online Server Program

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package scripting.vm;

import client.MapleCharacter;
import client.MapleClient;
import client.inventory.Equip;
import client.inventory.MapleInventoryType;
import constants.GameConstants;
import handling.channel.ChannelServer;
import java.awt.Point;
import scripting.NPCScriptManager;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import server.MaplePortal;
import server.Randomizer;
import server.log.DBLogger;
import server.log.LogType;
import server.maps.MapleMap;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;

/**
 *
 * @author Eternal
 */
public class NPCScriptTargetFunction {

    private NPCScriptVirtualMachine vm;

    public NPCScriptTargetFunction(NPCScriptVirtualMachine vms) {
        this.vm = vms;
    }

    public void message(String msg) {
        if (vm.isStop()) {
            return;
        }
        vm.getClient().getPlayer().dropMessage(5, msg);
    }

    public void music(String path) {
        if (vm.isStop()) {
            return;
        }
        vm.getClient().sendPacket(MaplePacketCreator.musicChange(path));
    }
    
    public void fmusic(String path) {
        vm.getClient().sendPacket(MaplePacketCreator.musicChange(path));
    }
    
    public void changeMusic(String path) {
        if (vm.isStop()) {
            return;
        }
        getPlayer().getMap().changeMusic(path);
        getPlayer().getMap().broadcastMessage(MaplePacketCreator.musicChange(path));
    }

    public final boolean haveItem(final int itemid) {
        return haveItem(itemid, 1);
    }

    public final boolean haveItem(final int itemid, final int quantity) {
        return haveItem(itemid, quantity, false, true);
    }

    public final boolean haveItem(final int itemid, final int quantity, final boolean checkEquipped, final boolean greaterOrEquals) {
        return vm.getClient().getPlayer().haveItem(itemid, quantity, checkEquipped, greaterOrEquals);
    }

    public final boolean canHold() {
        for (int i = 1; i <= 5; i++) {
            if (vm.getClient().getPlayer().getInventory(MapleInventoryType.getByType((byte) i)).getNextFreeSlot() <= -1) {
                return false;
            }
        }
        return true;
    }

    public final boolean canHoldSlots(final int slot) {
        for (int i = 1; i <= 5; i++) {
            if (vm.getClient().getPlayer().getInventory(MapleInventoryType.getByType((byte) i)).isFull(slot)) {
                return false;
            }
        }
        return true;
    }

    public final int getInvSlots(final int i) {
        return (vm.getClient().getPlayer().getInventory(MapleInventoryType.getByType((byte) i)).getNumFreeSlot());
    }

    public final boolean canHold(final int itemid) {
        return vm.getClient().getPlayer().getInventory(GameConstants.getInventoryType(itemid)).getNextFreeSlot() > -1;
    }

    public final boolean canHold(final int itemid, final int quantity) {
        return MapleInventoryManipulator.checkSpace(vm.getClient(), itemid, quantity, "");
    }

    public final void gainItemPeriod(final int id, final short quantity, final int period) { //period is in days
        gainItem(id, quantity, false, period, -1, "");
    }

    public final void gainItemPeriod(final int id, final short quantity, final long period, final String owner) { //period is in days
        gainItem(id, quantity, false, period, -1, owner);
    }

    public final void gainItem(final int id, final short quantity) {
        gainItem(id, quantity, false, 0, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats) {
        gainItem(id, quantity, randomStats, 0, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final int slots) {
        gainItem(id, quantity, randomStats, 0, slots, "");
    }

    public final void gainItem(final int id, final short quantity, final long period) {
        gainItem(id, quantity, false, period, -1, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots) {
        gainItem(id, quantity, randomStats, period, slots, "");
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots, final String owner) {
        gainItem(id, quantity, randomStats, period, slots, owner, vm.getClient());
    }

    public final void gainItem(final int id, final short quantity, final boolean randomStats, final long period, final int slots, final String owner, final MapleClient cg) {
        if (vm.isStop()) {
            return;
        }
        vm.flushSay();
        if (quantity >= 0) {
            final MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
            final MapleInventoryType type = GameConstants.getInventoryType(id);

            if (!MapleInventoryManipulator.checkSpace(cg, id, quantity, "")) {
                return;
            }
            if (type.equals(MapleInventoryType.EQUIP) && !GameConstants.isThrowingStar(id) && !GameConstants.isBullet(id)) {
                final Equip item = (Equip) (randomStats ? ii.randomizeStats((Equip) ii.getEquipById(id)) : ii.getEquipById(id));
                if (period > 0) {
                    item.setExpiration(System.currentTimeMillis() + (period * 24 * 60 * 60 * 1000));
                }
                if (slots > 0) {
                    item.setUpgradeSlots((byte) (item.getUpgradeSlots() + slots));
                }
                if (owner != null) {
                    item.setOwner(owner);
                }
                final String name = ii.getName(id);
                if (id / 10000 == 114 && name != null && name.length() > 0) { //medal
                    final String msg = "<" + name + "> 칭호를 얻었습니다.";
//                    cg.getPlayer().dropMessage(-1, msg);
                    cg.getPlayer().dropMessage(5, msg);
                }
                MapleInventoryManipulator.addbyItem(cg, item.copy());
            } else {
                MapleInventoryManipulator.addById(cg, id, quantity, owner == null ? "" : owner, null, period, "Received from interaction " + FileoutputUtil.CurrentReadable_Date());
            }
        } else {
            MapleInventoryManipulator.removeById(cg, GameConstants.getInventoryType(id), id, -quantity, true, false);
            DBLogger.instance.logItem(LogType.Item.FromScript, cg.getPlayer().getId(), cg.getPlayer().getName(), id, quantity, MapleItemInformationProvider.getInstance().getName(id), 0, "Script");
        }
        cg.getSession().write(MaplePacketCreator.getShowItemGain(id, quantity, true));
    }

    public MapleClient getClient() {
        return vm.getClient();
    }

    public MapleCharacter getPlayer() {
        return vm.getClient().getPlayer();
    }

    private final MapleMap getWarpMap(final int map) {
        return ChannelServer.getInstance(getClient().getChannel()).getMapFactory().getMap(map);
    }

    public final void warp(final int map) {
        if (vm.isStop()) {
            return;
        }
        vm.flushSay();
        final MapleMap mapz = getWarpMap(map);
        try {
            int overflow = 0;
            while (true) {
                MaplePortal p = mapz.getPortal(Randomizer.nextInt(mapz.getPortals().size()));
                if (p.getName().equals("sp")) {
                    getPlayer().changeMap(mapz, p);
                    break;
                }
                if (overflow >= 30) {
                    getPlayer().changeMap(mapz, mapz.getPortal(0));
                    break;
                }
                overflow++;
            }
        } catch (Exception e) {
            getPlayer().changeMap(mapz, mapz.getPortal(0));
        }
    }
    
    public final void warp(final int map, final int portal) {
        if (vm.isStop()) {
            return;
        }
        vm.flushSay();
        final MapleMap mapz = getWarpMap(map);
        if ((portal != 0 && map == getPlayer().getMapId()) || map == -1) { //test
            final Point portalPos = new Point(getPlayer().getMap().getPortal(portal).getPosition());
            if (portalPos.distanceSq(getPlayer().getTruePosition()) < 90000.0 || map == -1) { //estimation
                getClient().getSession().write(MaplePacketCreator.instantMapWarp((byte) portal)); //until we get packet for far movement, this will do
                getPlayer().getMap().movePlayer(getPlayer(), portalPos);
            } else {
                getPlayer().changeMap(mapz, mapz.getPortal(portal));
            }
        } else {
            getPlayer().changeMap(mapz, mapz.getPortal(portal));
        }
    }

    public void gainMeso(int gain) {
        if (vm.isStop()) {
            return;
        }
        vm.flushSay();
        DBLogger.instance.logItem(LogType.Item.FromScript, getPlayer().getId(), getPlayer().getName(), 0, 0, "메소", gain, "Script : VM - ");
        getPlayer().gainMeso(gain, true, true);
    }

    public void gainExp(int gain) {
        if (vm.isStop()) {
            return;
        }
        vm.flushSay();
        getPlayer().gainExp(gain, true, true, true);
    }
    
    public final void openLegacyNpc(final int id) {
        getClient().removeClickedNPC();
        NPCScriptInvoker.dispose(getClient());
        vm.openLegacyNpc = true;
        NPCScriptManager.getInstance().start(getClient(), id);
    }
    public final void openNpc(final int id) {
        getClient().removeClickedNPC();
        NPCScriptInvoker.dispose(getClient());
        vm.openLegacyNpc = true;
        NPCScriptInvoker.runNpc(getClient(), id, 0);
    }
}
