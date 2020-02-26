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
 * Quest ID : 2233
 * Quest Name : 명성도를 올려보자!
 * Quest Progress Info : 이번에 #b리더 알#k이 내준 과제는 #r명성도 1,000#k 달성! 만만치 않은 목표다. 리더 알에 의하면 이 수치는 리더쉽과 주니어를 챙겨주는 세심한 배려 없이는 절대로 달성할 수 없다고 한다. 리더 알이 준 힌트는 주니어의 경험치 획득과 레벨업을 최대한 도와주라는 것이었다. 경험치...레벨 업이라... 어떻게 도와주지?\n\n#r리더쉽 1,000 달성#k\n(패밀리 창을 열어 명성도를 확인해 보자)
 * Quest End Info : 드디어 명성도가 1,000이 되었다! ...분발한 주니어에게 진심으로 감사하자.
 * End NPC : -1
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
        if (!qm.isQuestActive(2233)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        if (qm.getPlayer().getTotalRep() >= 1000) {
            qm.sendNext("오~! 명성도가 1,000이 넘다니.. 자네도 이제 유명한 모험가가 되었어. 정말 잘 했네!")
        } else {
            qm.sendOk("흐음, 아직 명성도 1000은 모으지 못한 모양이지? 조금 어려울 수 있지만 주니어들과 함께 사냥을 하다보면 금방 이룩할 수 있을걸세!");
            qm.dispose();
        }
    } else if (status == 1) {
        qm.sendNext("자네의 활약을 보면 나도 피가 다시 끓는군. 빨리 젊고 유능한 주니어를 다시 찾아봐야 겠어. 어떤가? 명성도를 올리는 것은 그리 어렵지 않지? 핵심은 주니어가 빠르게 성장하도록 지원과 관심을 아끼지 않는 것이라네..");
    } else if (status == 2) {
        qm.sendNext("그럼, 앞으로도 좋은 엘더가 되어 주게나.");
    } else if (status == 3) {
        qm.showQuestCompleteEffect();
        qm.gainExp(2400);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
