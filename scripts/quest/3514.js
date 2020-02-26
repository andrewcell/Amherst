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
 * Quest ID : 3514
 * Quest Name : 감정을 파는 마제사
 * Quest Progress Info : #p2140002#를 만났다. 그는 단번에 얼어붙은 감정을 알아보며, 감정을 녹여내고 싶다면 그가 판매하는 #b약#k을 사라고 말했다. 가격은 비싸지만 효과는 좋다며. 다만 부작용이 있으니 주의하라는데...
 * Quest End Info : #p2140002#의 약을 마셨다. 약의 부작용으로 모든 체력과 마력이 소모되며 일시적으로 전투불능이 되었지만 감정은 되찾은 것 같다. 이제 후회의 길 너머로 가보자.
 * End NPC : 2140002
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
        if (!qm.isQuestActive(3514)) {
            qm.forceStartQuest();
            qm.dispose();
        }
        if (!qm.haveItem(2022337, 1)) {
            qm.sendNext("호오~ 약은 다 먹은 모양이군. 어때? 말 그대로 최고의 효과 아니야? 역시 이 몸의 약이란 완벽해!")
        } else
            qm.dispose();
    } else if (status == 1) {
        qm.sendNext("뭐? ...그냥 체력이 왕창 떨어지면 되는 거 아니냐고? 흠흠. 누구야? 그런 헛소리를 하는 게... 그럴 리가 없잖아? 하하하하!")
    } else if (status == 2) {
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
