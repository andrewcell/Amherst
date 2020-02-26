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

import java.awt.Point;
import scripting.EventInstanceManager;
import scripting.EventManager;
import server.life.MapleLifeFactory;
import server.life.MapleMonster;

/**
 *
 * @author Eternal
 */
public class NPCScriptSelfFunction {
    private NPCScriptVirtualMachine vm;
    public NPCScriptSelfFunction(NPCScriptVirtualMachine vms) {
        this.vm = vms;
    }
    
    public void say(String str) {
        if (vm.isStop()) {
            return;
        }
        vm.addSay(str);
    }
    
    public int askYesNo(String str) {
        if (vm.isStop()) {
            return -1;
        }
        return vm.askYesNo(str);
    }
    
    public int askAccept(String str) {
        if (vm.isStop()) {
            return -1;
        }
        return vm.askAccept(str);
    }
    
    public int askAcceptNoESC(String str) {
        if (vm.isStop()) {
            return -1;
        }
        return vm.askAcceptNoESC(str);
    }
    
    public int askMenu(String str) {
        if (vm.isStop()) {
            return -1;
        }
        return vm.askMenu(str);
    }
    
    public String askText(String str) {
        if (vm.isStop()) {
            return "";
        }
        return vm.askText(str);
    }
    
    
    public final void spawnMonster(final int mobid, int x, int y) {
        MapleMonster mob = MapleLifeFactory.getMonster(mobid);
        vm.getClient().getPlayer().getMap().spawnMonster_sSack(mob, new Point(x, y), -2);
    }
    
    public void flushSay() {
        vm.flushSay();
    }
    
    public final EventManager getEventManager(final String event) {
        return vm.getClient().getChannelServer().getEventSM().getEventManager(event);
    }

    public final EventInstanceManager getEventInstance() {
        return vm.getClient().getPlayer().getEventInstance();
    }
    
    
}
