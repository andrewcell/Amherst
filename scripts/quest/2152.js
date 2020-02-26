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
 * Quest ID : 2152
 * Quest Name : 소문의 진상-베티
 * Quest Progress Info : #m101000000#의 식물학자 #b#p1032104##k에게 소문에 대해서 물어보자.
 * Quest End Info : #p1032104#박사에게 떠도는 소문에 대해 물어보았다.
 * Start NPC : 1032104
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
        qm.sendSimple("어서와요. 용건이 뭐죠? \r\n#b #L0#귀신나무에 대해 아시는 것이 있나요?#l");
    } else if (status == 1) {
        qm.sendSimple("윈스턴 박사님의 연구를 도와 주고 있나 보군요? 글쎄요. 저도 박사님의 부탁을 받고 조사를 좀 해봤는데 알아낸 것이 없어요. 단지 요즘 페리온과의 접경지대에 있는 엘리니아의 숲이 급속도로 메말라가기 시작했다는 것을 알아냈죠. 진행속도는 느리지만 경계해야 할 일이에요.\r\n#b #L0#네. 시간을 내주셔서 감사합니다.#l");
    } else if (status == 2) {
        qm.sendNext("많은 도움이 되지 못한 것 같아서 미안하군요.");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainExp(200);
        qm.dispose();
    }
}
