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
 * Quest ID : 29500
 * Quest Name : 칭호 도전 - 메이플 아이돌스타
 * Quest Progress Info : #b#e칭호 도전 - 메이플 아이돌스타#n(특급 칭호)\n\n#k - 인기도 : #b#jpop##k
 * Quest End Info : #b#e칭호 도전 - 메이플 아이돌스타#n(특급 칭호)\n\n#k - 인기도 : #b#jpop##k \n\n월드에서 인기도가 가장 높은 단 한명에게만 주어지는 명예의 칭호 '#b메이플 아이돌스타#k'. 달리어는 전략을 잘 세워야만 매달 1번씩만 도전할 수 있는 이 칭호의 주인이 될 수 있을 것이라고 충고하였다.
 * Start NPC : 9000040
 * End NPC : 9000040
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
        qm.sendNext("#v1142006# #e#b#t1142006##k\r\n\r\n - 인기도 랭킹 1위\r\n\r\n#n이 훈장의 주인이 될 자격이 있는지 시험해 보시겠소?");
    } else if (status == 1) {
        qm.sendNext(qm.getMedalRanking("Pop") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
    } else if (status == 2) {
        qm.askAcceptDecline("자, 업적을 달성하면 나에게 돌아오시오. 업적을 달성하고 나서 나에게 와서 확인을 받아야만 인정받을 수 있다는 것을 꼭 명심하시오. 그리고 이 도전을 완료하거나 포기하지 않는 이상 다른 칭호에 도전할 수는 없다는 것도 알아두시오. 그리고 여기서 도전을 수락하면, 1달 동안 아이돌 스타에 도전 할 수 없으니 신중하게 선택하시오.");
    } else if (status == 3) {
        if (selection == 1) {
            var qr = qm.getQuestRecord(149600);
            if (qr.getCustomData() == null || qr.getCustomData() < qm.getCurrentTime()) {
                qm.forceStartQuest(29500);
                qm.forceStartQuest(149600, (qm.getCurrentTime() + (86400000 * 30)));
            } else {
                qm.sendOk("아직 도전한지 1달이 지나지 않았소.");
            }
        }
        qm.dispose();
    }
}

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
        var sds = "무엇을 하겠는가?#b\r\n#L0# 현재 랭킹을 보고 싶습니다.#l";
        sds += "\r\n#L5# 도전을 포기하고 싶습니다.#l";
        sds += "\r\n#L10# 아이돌스타 랭킹에 도전하겠습니다.#l";
        qm.sendSimple(sds);
    } else if (status == 1) {
        if (selection == 0) {
            qm.sendOk(qm.getMedalRanking("Pop") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
            qm.dispose();
        } else if (selection == 5) {
            qm.forfeitQuest(29500);
            qm.sendOk("다음에 도전하려면 언제든지 또 오시오.");
            qm.dispose();
        } else if (selection == 10) {
            if (qm.getInvSlots(1) >= 1) {
                var s = qm.checkMedalScore("Pop", qm.getPlayer().getFame());
                if (s == 0) {
                    qm.sendOk("호오, 대단하오. 훈장을 받을 자격이 충분하구려.");
                    qm.removeItemFromWorld(1142006, "메이플 아이돌스타 자격이 박탈되어, 칭호가 회수되었습니다.", false);
                    qm.gainItem(1142006, 1);
                    qm.forceCompleteQuest();
                    qm.showQuestCompleteEffect();
                } else {
                    qm.sendOk("흠, 자네는 아이돌스타에 도전하기엔 인기도가 너무 낮소.");
                }
                qm.dispose();
            } else {
                qm.sendOk("장비 인벤토리 공간이 충분한지 확인해주게.");
                qm.dispose();
            }
        } else {
            qm.dispose();
        }
    }
}
