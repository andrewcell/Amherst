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
 * NPCID : 2040027
 * ScriptName : ludi017
 * NPCNameFunc : 네번째 에오스의 돌
 * Location : 221020000 (에오스탑 - 에오스탑1층)
 * 
 * @author T-Sun
 *
 */
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            if (cm.haveItem(4001020))
                cm.sendYesNo("#b#t4001020##k를 사용하여 #b#p2040026##k이 있는 41층으로 이동하시겠습니까?");
             else {
                cm.sendOk("네번째 에오스의 돌이다. 하지만 #b#t4001020##k가 없어 활성화 시킬 수 없을 것 같다.");
                cm.dispose();
            }
        } else if (status == 1) {
            cm.gainItem(4001020, -1);
            cm.warp(221021700, "go00");
            cm.dispose();
        }
    }
}