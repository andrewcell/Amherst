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
 * NPCID : 2040025
 * ScriptName : ludi015
 * NPCNameFunc : 두번째 에오스의 돌
 * Location : 221022900 (에오스탑 - 에오스탑71층)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var map = 221024400;

function start() {
    if (cm.haveItem(4001020))
        cm.sendSimple("#b#t4001020##k로 #p"+cm.getNpc()+"#을 활성화 시켰습니다. 어디로 가시겠습니까?\r\n#b\r\n#L0#에오스 탑 100층#l\r\n#L1#에오스 탑 41층#l\r\n");
    else {
        cm.sendOk("#p"+cm.getNpc()+"#이다. 하지만 #b#t4001020##k가 없어 활성화 시킬 수 없을 것 같다.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == -1)
        cm.dispose();
    else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 1) {
            if (selection == 0)
                cm.sendYesNo("#b#t4001020##k를 사용하여 #p2040024##k이 있는 100층으로 이동하시겠습니까?");
            else {
                cm.sendYesNo("#b#t4001020##k를 사용하여 #p2040026##k이 있는 41층으로 이동하시겠습니까?");
                map = 221021700;
            }
        } else if (status == 2) {
            cm.gainItem(4001020, -1);
            cm.warp(map, "go00");
            cm.dispose();
        }
    }
}