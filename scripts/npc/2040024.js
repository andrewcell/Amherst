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
 * NPCID : 2040024
 * ScriptName : ludi014
 * NPCNameFunc : 첫번째 에오스의 돌
 * Location : 221024400 (에오스탑 - 에오스탑100층)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.haveItem(4001020)) 
            cm.sendYesNo("#b#t4001020##k를 사용하여 #b#p2040025##k이 있는 71층으로 이동하시겠습니까?");
        else {
            cm.sendOk("첫번째 에오스의 돌이다. 하지만 #b#t4001020##k가 없어 활성화 시킬 수 없을 것 같다.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.dispose();
            return;
        }
        cm.gainItem(4001020, -1);
        cm.warp(221022900, "go00");
        cm.dispose();
    }
}
