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
 * NPCID : 2111010
 * ScriptName : magatia_dark1
 * NPCNameFunc : 알카드노의 책장
 * Location : 926120000 (히든스트리트 - 불 꺼진 연구실)
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
            cm.playerMessage(5, "너무 멀어 조사할 수 없다.");
            cm.dispose();
            return;
        }
        if (cm.isQuestActive(3309) && !cm.haveItem(4031708, 1)) {
            cm.sendNext("어둠 속에서 책장이 만져진다... 눈에 힘을 주고 잘 살펴보자, 이상한 서류 뭉치가 보인다... 이게 바로 베딘이 말한 그 서류인 것 같다. 서류를 챙겼으니 베딘에게 돌아가자.")
            cm.gainItem(4031708, 1);
        }
        cm.dispose();
    }
}