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
 * NPCID : 2040031
 * ScriptName : ludi027
 * NPCNameFunc : 문서뭉치
 * Location : 220000304 (루디브리엄마을 - 클로이의 집)
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
        var val = cm.getQuestStatus(3240);
        if (val == 1) {
            if (!cm.haveItem(4031034,1)) {
                cm.sendYesNo("종이 뭉치 사이에 뭔가 주문서 처럼 생긴게 보인다. 가져갈까?");
            } else {
                cm.sendOk("이미 #b#t4031034##k를 갖고 있는 것 같다.");
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.dispose();
        } else {
            if (cm.canHold(4031034)) {
                cm.gainItem(4031034, 1);
                cm.dispose();
            } else {
                cm.sendOk("인벤토리 공간이 부족합니다.");
                cm.dispose();
            }
        }
    }
}