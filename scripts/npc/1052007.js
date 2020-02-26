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
 * NPCID : 1052007
 * ScriptName : subway_in
 * NPCNameFunc : 개찰구
 * Location : 103000100 (빅토리아로드 - 지하철매표소)
 * 
 * @author T-Sun
 *
 */
var status = -1;


function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
            return;
    } else {
        if (mode == 1) {
            status++;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        lvl = cm.getPlayerStat("LVL");
        if (lvl < 20) {
            cm.sendOk("입장할 수 있는 구간이 없습니다..");
            cm.dispose();
        } else {
            subways = [
                {'name' : "공사장 B1", 'itemid' : 4031036, 'map' : 103000900},
                {'name' : "공사장 B2", 'itemid' : 4031037, 'map' : 103000903},
                {'name' : "공사장 B3", 'itemid' : 4031038, 'map' : 103000906}
            ];
            str = "안녕하세요~ 커닝시티 지하철 입니다. 입장하시고 싶은 구간을 선택하세요.\r\n#b\r\n";
            if (lvl > 19) {
                str += "#L0# 공사장 B1#l\r\n";
            }
            if (lvl > 29) {
                str += "#L1# 공사장 B2#l\r\n";
            }
            if (lvl > 39) {
                str += "#L2# 공사장 B3#l\r\n";
            }
            cm.sendSimple(str);
        }
    } else if (status == 1) {
        sel = subways[selection];
        if (cm.haveItem(sel['itemid'], 1)) {
            cm.gainItem(sel['itemid'], -1);
            cm.warp(sel['map'], "sp");
            cm.dispose();
        } else {
            cm.sendOk("입장권이 없으신 것 같습니다. #b지하철 공익요원#k 에게서 입장권을 구매해주세요.")
            cm.dispose();
        }
    }
}	