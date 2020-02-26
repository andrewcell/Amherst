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
 * Quest ID : 2215
 * Quest Name : 구겨진 종이조각 다시 찾기
 * Quest Progress Info : 제이엠은 혀를 차며 하는 수 없으니 다시 한 번 정보원 목록을 주겠다고 말했다. 하지만 이번에는 #b정보료 2000 메소#k를 지불하라며, 쓰레기통 안에 메소를 넣어두라는 말도 덧붙였다. 그럼 #b#m107000300##k로 가자.
 * Quest End Info : 쓰레기통에서 정보원 명단을 꺼내고 대신 2000 메소를 넣어두었다.
 * End NPC : 1052108
 * 
 * @author T-Sun
 *
 */

var status = -1;

function end(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (!qm.isQuestActive(2215)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        var date = qm.getCurrentDate().substring(8, 10);
        if (date >= 17 && date <= 20) {
            qm.sendYesNo("#b(먼지 투성이인 쓰레기통 내부에 손을 넣자 바스락거리는 뭔가가 만져집니다. 뭔가를 꺼내겠습니까?)");
        } else {
            qm.sendOk("#b(먼지 투성이인 쓰레기통 내부에 손을 넣어봤지만, 딱히 쓰레기가 아닌 물건은 없는 것 같습니다.)");
            qm.dispose();
        }
    } else if (status == 1) {
        if (selection == 1) {
            if (qm.getPlayer().getMeso() >= 2000)
                qm.sendNext("#b(거미줄로 범벅이 된 구겨진 종이조각을 꺼냈다. 그리고 2000메소를 넣었다..)");
            else {
                qm.sendOk("2000메소가 없는 것 같다.");
                qm.dispose();
            }
        } else {
            qm.dispose();
        }
    } else if (status == 2) {
        qm.gainMeso(-2000);
        qm.gainItem(4031894, 1);
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
