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
 * NPCID : 2030014
 * ScriptName : s4freeze_item
 * NPCNameFunc : 고대 빙석
 * Location : 921100100 (히든스트리트 - 얼음의 계곡)
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
        if (cm.getQuestStatus(6263) == 2) {
            if (cm.haveItem(4031450, 1)) {
                cm.sendYesNo("고대 빙석을 #b#t4031450##k를 사용하여 캐시겠습니까?");
                return;
            }
        }
        cm.sendOk("...");
        cm.dispose();
    } else if (status == 1) {
        if (cm.canHold(2280011)) {
            cm.gainItem(4031450, -1);
            cm.gainItem(2280011, 1);
            cm.sendOk("#b#t4031450##k를 사용해서 얼음을 깨자, 빙석의 가루가 떨어집니다.");
            cm.dispose();
        } else {
            cm.sendOk("인벤토리 공간이 부족합니다.")
            cm.dispose();
        }
    }
}