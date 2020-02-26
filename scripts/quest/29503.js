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
 * Quest ID : 29503
 * Quest Name : 칭호 도전 - 기부왕
 * Quest Progress Info : #b#e칭호 도전 - 기부왕#n(특급 칭호)\n#k\n - 남은 시간 : #Qminlimit#분 #Qseclimit#초\n - 기부액수 : #b#jmoney##k 메소\n\n매월 초에 모든 마을의 기부 기록이 초기화된다. 달리어는 단순히 많은 금액을 기부하는 것만으로는 이 칭호의 주인이 될 수 없다며 남다른 지혜를 발휘해줄 것을 당부하였다. 
 * Quest End Info : #b#e칭호 도전 - 기부왕#n(특급 칭호)\n#k\n - 남은 시간 : #Qminlimit#분 #Qseclimit#초\n - 기부한 마을 : #b#jm##k\n - 기부액수 : #b#jmoney##k 메소\n\n매월 초에 모든 마을의 기부 기록이 초기화된다. 달리어는 단순히 많은 금액을 기부하는 것만으로는 이 칭호의 주인이 될 수 없다며 남다른 지혜를 발휘해줄 것을 당부하였다. 
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
        qm.sendSimple("어떤 마을의 기부왕에 도전하시겠습니까?\r\n#b#L0# 헤네시스 기부왕.#l\r\n#L1# 엘리니아 기부왕.#l\r\n#L2# 페리온 기부왕.#l\r\n#L3# 커닝시티 기부왕.#l\r\n#L4# 슬리피우드 기부왕.#l\r\n#L5# 노틸러스 기부왕.#l\r\n#L6# 리스항구 기부왕.#l");
    } else if (status == 1) {
        selectedTown = selection;
        qm.getPlayer().updateInfoQuest(29503, "money=0");
        qm.sendNext("#v"+getMedalByMap(getMap(selectedTown))+"# #e#b#t"+getMedalByMap(getMap(selectedTown))+"##k\r\n\r\n - 제한시간 1시간\r\n - 마을에 최고액을 기부\r\n\r\n#n이 훈장의 주인이 될 자격이 있는지 시험해 보시겠소?");
    } else if (status == 2) {
        qm.sendNext(qm.getMedalRanking(getTown(selectedTown)) + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
    } else if (status == 3) {
        qm.forceStartQuest(29503, "time_" + (qm.getCurrentTime() + 3600000));
        qm.getPlayer().updateInfoQuest(29503, "money=0;trymap=" + getMap(selectedTown));
        qm.sendOk("그럼, 행운을 빌겠소. 1시간 이내에 나에게 돌아와서 심사를 받으시오. 그리고 이 도전을 완료하거나 포기하지 않는 이상 다른 칭호에 도전할 수는 없다는 것을 알아두시오.");
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
        qm.sendSimple("그대는 " + qm.getPlayer().getOneInfo(29503, "money") + " 메소를 기부하였군. 무엇을 하시겠소? \r\n#b#L0# 현재 랭킹을 보고 싶습니다.#l\r\n#L1# 스페셜 훈장에 도전하겠습니다.#l\r\n#L3# 도전을 포기하고 싶습니다.#l");
    } else if (status == 1) {
        if (selection == 0) {
            status = 2;
            qm.sendSimple("어느 마을의 랭킹을 보고 싶소?\r\n#b\
#L4#헤네시스 기부왕#l\r\n\
#L5#엘리니아 기부왕#l\r\n\
#L6#페리온 기부왕#l\r\n\
#L7#커닝시티 기부왕#l\r\n\
#L8#슬리피우드 기부왕#l\r\n\
#L9#노틸러스 기부왕#l\r\n\
#L10#리스항구 기부왕#l");
        } else if (selection == 3) {
            status = 3;
            qm.askAcceptDecline("더 이상 도전하지 않을 테요? 다른 칭호 퀘스트에 도전하기 위해서는 이 퀘스트를 포기해야 하오만...");
        } else if (selection == 1) {

            if (qm.getPlayer().getMapId() != qm.getPlayer().getOneInfo(29503, "trymap")) {
                qm.sendOk("그대가 기부를 한 마을은 #b#m" + qm.getPlayer().getOneInfo(29503, "trymap") + "##k인 걸로 아오만. 이 마을에 기부하려면 먼저 다른 마을의 기부를 포기하시오. 물론 한번 기부한 돈은 돌려받을 수 없겠지만...");
                qm.dispose();
                return;
            }

            if (qm.getPlayer().getOneInfo(29503, "money") < 100000) {
                qm.sendOk("명예의 신을 속일 수는 없소. 도전을 했으면 제대로 기부를 하고 오시오.");
                qm.dispose();
                return;
            }

            if (qm.getInvSlots(1) >= 1) {
                var s = qm.checkMedalScore(getTown(getTownNumberByMap(qm.getPlayer().getMapId())), qm.getPlayer().getOneInfo(29503, "money"));
                if (s == 0) {
                    qm.sendOk("호오, 대단하오. 훈장을 받을 자격이 충분하구려.");
                    qm.removeItemFromWorld(getMedalByMap(qm.getPlayer().getMapId()), "기부왕 자격이 박탈되어, 칭호가 회수되었습니다.", false);
                    qm.gainItem(getMedalByMap(qm.getPlayer().getMapId()), 1);
                    qm.forceCompleteQuest();
                    qm.showQuestCompleteEffect();
                } else {
                    qm.sendOk("그대는 " + qm.getPlayer().getOneInfo(29503, "money") + " 메소를 기부하였네만... 기부왕이 되기에는 모자라는군...\r\n 비록 최고는 아니지만 그대도 대단하다는 것은 틀림 없소.");
                    qm.forceCompleteQuest();
                    qm.showQuestCompleteEffect();
                }
                qm.dispose();
            } else {
                qm.sendOk("장비 인벤토리 공간이 충분한지 확인해주시오.");
                qm.dispose();
            }
        }
    } else if (status == 3) {
        if (selection >= 4 && selection <= 10)
            qm.sendOk(qm.getMedalRanking(getTown(selection - 4)) + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        qm.dispose();
    } else if (status == 4) {
        qm.forfeitQuest(29503);
        qm.dispose();
    }
}

function getTownNumberByMap(it) {
    if (it == 100000200) {
        return 0;
    } else if (it == 101000000) {
        return 1;
    } else if (it == 102000000) {
        return 2;
    } else if (it == 103000000) {
        return 3;
    } else if (it == 105040300) {
        return 4;
    } else if (it == 120000000) {
        return 5;
    } else if (it == 104000000) {
        return 6;
    }
}
function getMedalByMap(it) {
    if (it == 100000200) {
        return 1142014;
    } else if (it == 101000000) {
        return 1142015;
    } else if (it == 102000000) {
        return 1142016;
    } else if (it == 103000000) {
        return 1142017;
    } else if (it == 105040300) {
        return 1142018;
    } else if (it == 120000000) {
        return 1142019;
    } else if (it == 104000000) {
        return 1142030;
    }
}

function getTown(it) {
    if (it == 0) {
        return "HenesysDonor";
    } else if (it == 1) {
        return "ElliniaDonor";
    } else if (it == 2) {
        return "PerionDonor";
    } else if (it == 3) {
        return "KerningDonor";
    } else if (it == 4) {
        return "SleepyWoodDonor";
    } else if (it == 5) {
        return "NautilusDonor";
    } else if (it == 6) {
        return "LithDonor";
    }
}

function getMap(it) {
    if (it == 0) {
        return 100000200;
    } else if (it == 1) {
        return 101000000;
    } else if (it == 2) {
        return 102000000;
    } else if (it == 3) {
        return 103000000;
    } else if (it == 4) {
        return 105040300;
    } else if (it == 5) {
        return 120000000;
    } else if (it == 6) {
        return 104000000;
    }
}
