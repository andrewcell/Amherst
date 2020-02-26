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
 * NPCID : 2111011
 * ScriptName : absence_wall
 * NPCNameFunc : 벽
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
        if (cm.getDistance() > 5000) {
            cm.sendOk("너무 거리가 멀어 조사할 수 없다.");
            cm.dispose();
        } else if (cm.isQuestActive(3311)) {
            cm.sendYesNo("거미줄 틈으로 보이는 벽에 뭔가 글자들이 보이는 것 같다... 벽을 살피시겠습니까?");
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.setQuestByInfo(3311, "5", true);
            cm.sendNext("지저분한 낙서들 틈으로 유난히 선명하게 보이는 글자가 있다.  #b그것은 펜던트의 형태로 완성되었다...#k  무슨 말일까?")
        }
        cm.dispose();
    }

}