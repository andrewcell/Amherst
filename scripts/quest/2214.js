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
 * Quest ID : 2214
 * Quest Name : 늪지대 오두막
 * Quest Progress Info : 제이엠의 말에 의하면 먼저 해야 할 일은 정보 수집인 것 같다. 제이엠은 늪지대 깊숙한 곳에 있는 #b오두막#k에 정보를 놓아둘 테니, #b오후 5시부터 8시 사이#k에 가서 찾아오라는데... 시간 맞춰서 #b#m107000300##k로 가자.
 * Quest End Info : 정보원의 이름이 적혀 있는 구겨진 종이조각을 손에 넣었다. 어서 종이에 쓰여 있는 이름들을 찾아가 보자.
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
        if (!qm.isQuestActive(2214)) {
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
            qm.sendNext("#b(거미줄로 범벅이 된 구겨진 종이조각을 꺼냈다.)");
        } else {
            qm.dispose();
        }
    } else if (status == 2) {
        qm.gainItem(4031894, 1);
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
