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
 * Quest ID : 2151
 * Quest Name : 소문의 진상-주먹 펴고 일어서
 * Quest Progress Info : #m102000000#의 장로 #b#p1022000##k에게 소문에 대해서 물어보자.
 * Quest End Info : #p1022000#에게 떠도는 소문에 대해 물어보았다.
 * Start NPC : 1022000
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
        qm.sendSimple("무슨 일로 나를 찾아온건가? \r\n#b #L0#귀신나무에 대해 아시는 것이 있나요?#l");
    } else if (status == 1) {
        qm.sendSimple("귀신나무라... 아마도 스텀피를 말하는 것 같군.\r\n#b #L0#스텀피가 뭔가요?#l");
    } else if (status == 2) {
        qm.sendSimple("페리온이 아직 푸른 숲이었을때부터 지금까지 살아남은 아주 오래된 나무지. 하지만 오랜 세월을 지나는 동안 나무는 분노하기 시작했지. 숲을 파괴하는 인간을 보면서 분노했고, 메말라가는 숲을 보면서 분노했지.\r\n#b #L0#그래서 어떻게 되었나요?#l");
    } else if (status == 3) {
        qm.sendNext("결국 나무의 분노는 나무를 몬스터로 바꾸어 놓고 말았고, 이제는 닥치는 대로 땅의 양분을 갉아먹는 한낱 괴물이 되어버렸지. 너무 깊이 알려고 하지 말게. 자네의 호기심은 이해하지만, 그는 모든 스텀프들의 왕이야. 결코 쉽게 생각하면 안된다네.");
    } else if (status == 4) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainExp(100);
        qm.dispose();
    }
}
