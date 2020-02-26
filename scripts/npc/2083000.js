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
/*
 * NPCID : 2083000
 * ScriptName : hontale_enterToE
 * NPCNameFunc : 결사대 암호석판
 * Location : 240050000 (생명의동굴 - 동굴 입구)
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    
    if (status == 0) {
        if (cm.getPlayer().getParty() == null) {
            cm.sendOk("파티를 이루고 있지 않아 암호 석판을 읽을 수 없습니다.");
            cm.dispose();
            return;
        }
        if (!cm.haveItem(4001086, 1)) {
            cm.sendOk("암호석판을 읽어보려 하지만, 무슨 문자가 적혀있는지 알 수 없습니다. 혼테일 결사대원이라면 읽을 수 있을 것 같습니다.");
            cm.dispose();
            return;
        }
        cm.sendYesNo("암호석판이 빛나더니 석판 뒤로 문이 열렸습니다. 문을 이용해서 입장하시겠습니까?");
    } else if (status == 1) {
        cm.warpParty(240050400);
        cm.dispose();
    }
}
