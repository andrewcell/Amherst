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
 * NPCID : 2111013
 * ScriptName : absence_frame
 * NPCNameFunc : 액자
 * Location : 261000001 (마가티아 - 실종된 연금술사의 집)
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
        if (cm.getDistance() > 7000) {
            cm.sendOk("너무 거리가 멀어 조사할 수 없다.");
        } else if (cm.isQuestActive(3322) && !cm.haveItem(4031697)) {
            cm.sendOk("액자 뒤에 있는 고리를 풀어 열었다. 액자 속의 비밀 공간에 은색 펜던트가 들어 있다. 조심스럽게 펜던트를 꺼낸 후 액자를 닫고 테이블 위에 놓았다.")
            cm.gainItem(4031697, 1);
        } else {
            cm.sendOk("아무것도 없는 것 같다.")
        }
        cm.dispose();
    }
}