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
 * Quest ID : 2149
 * Quest Name : 소문의 진상-만지
 * Quest Progress Info : 오랫동안 #m102000000#에서 수련을 해 온 #b#p1022002##k에게 소문에 대해서 물어보자.
 * Quest End Info : #p1022002#에게 떠도는 소문에 대해 물어보았다.
 * Start NPC : 1022002
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start(mode, type, selection) {
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
        qm.sendSimple("...무슨 일이지? \r\n#b #L0#귀신나무에 대해 들어보신 적이 있나요?#l");
    } else if (status == 1) {
        qm.sendSimple("겁쟁이들의 이야기를 들은 모양이군. 귀신나무라니 그런게 있을리가 없지. 오랫동안 페리온의 바위산을 돌아다니며 수련을 했지만, 그런 나무는 본 적도 들은 적도 없어.\r\n#b #L0#아 그런가요?...#l");
    } else if (status == 2) {
        qm.sendNext("단지 요즘 동쪽 바위산에서 의문의 습격을 받는 일이 늘어났다고 하는데, 조금 신경이 쓰이는군...");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainExp(100);
        qm.dispose();
    }
}
