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
 * Quest ID : 29400
 * Quest Name : 칭호 도전 - 노련한 사냥꾼
 * Quest Progress Info : #b#e칭호 도전 - 노련한 사냥꾼#b#n\n\n#k - 남은 시간 : #Qdaylimit#일 #Qhourlimit#시간 #Qminlimit#분 #Qseclimit#초\n - 사냥한 몬스터 수 : #r#jmon##k 마리 / #jmg# 마리#k\n                             #jgaugeHunt# #jperHunt# %\n\n※ 자신의 레벨 이상의 몬스터만 인정\n   (120레벨 이상의 캐릭터는 120레벨 이상의\n   몬스터 사냥시 인정)\n\n#b#e칭호 도전 - 전설적인 사냥꾼#n(특급 칭호)#k\n\n - 사냥한 몬스터 수 1위\n
 * Quest End Info : #b#e칭호 도전 - 노련한 사냥꾼#b#n\n\n#k - 남은 시간 : #Qdaylimit#일 #Qhourlimit#시간 #Qminlimit#분 #Qseclimit#초\n - 사냥한 몬스터 수 : #r#jmon##k 마리 / #jmg# 마리#k\n                             #jgaugeHunt# #jperHunt# %\n\n※ 자신의 레벨 이상의 몬스터만 인정\n   (120레벨 이상의 캐릭터는 120레벨 이상의\n   몬스터 사냥시 인정)\n\n#b#e칭호 도전 - 전설적인 사냥꾼#n(특급 칭호)#k\n\n - 사냥한 몬스터 수 1위\n\n제한시간 안에 내 레벨 이상의 몬스터를 최대한 많이 사냥하는 사냥꾼 칭호에 도전하였다. 달리어는 '#b전설적인 사냥꾼#k'이 되기 위해서는 사냥 기록이 초기화되는 매월 초를 놓치지 말라고 조언해 주었다. 아, 일반 훈장을 잃어버렸을 때는 퀘스트를 다시 완료해야 얻을 수 있다고 하니 함부로 버리지 않도록 주의해야겠다.
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
        qm.sendNext("#v1142004# #e#b#t1142004##k\r\n\r\n - 제한시간 30일\r\n - 몬스터 100,000마리 사냥\r\n#n※ 자신의 레벨 이상의 몬스터만 인정\r\n   (120레벨 이상의 캐릭터는 120레벨 이상의 몬스터 인정)\r\n\r\n이 훈장의 주인이 될 자격이 있는지 시험해 보시겠소?");
    } else if (status == 1) {
        qm.sendNext(qm.getMedalRanking("ExpertHunter") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
    } else if (status == 2) {
        qm.sendNext("자, 30일의 시간을 줄테니 사냥을 마치고 나에게 돌아오시오. 제한시간 내에 나에게 와서 확인을 받아야만 인정받을 수 있다는 것을 꼭 명심하시오. 그리고 이 도전을 완료하거나 포기하지 않는 이상 다른 칭호에 도전할 수는 없다는 것도 알아두시오.");
    } else if (status == 3) {
        qm.forceStartQuest(29400, "time_" + (qm.getCurrentTime() + (86400000 * 30)));
        qm.getPlayer().updateInfoQuest(29400, "mg=100000;mon=0");
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
        var chr = qm.getPlayer();
        var sds = "그대가 사냥한 몬스터의 수는 " + chr.getOneInfo(29400, "mon") + " 마리고 목표는 " + chr.getOneInfo(29400, "mg") + " 마리라네. 무엇을 하겠는가?#b\r\n#L0# 현재 랭킹을 보고 싶습니다.#l";
        if (chr.getOneInfo(29400, "mon") >= 100000) {
            sds += "\r\n#L10# 도전에 성공했습니다. 훈장을 지급받겠습니다.#l";
        } else {
            sds += "\r\n#L5# 도전을 포기하고 싶습니다.#l";
        }
        qm.sendSimple(sds);
    } else if (status == 1) {
        if (selection == 0) {
            qm.sendOk(qm.getMedalRanking("ExpertHunter") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
            qm.dispose();
        } else if (selection == 5) {
            qm.forfeitQuest(29400);
            qm.sendOk("다음에 도전하려면 언제든지 또 오시오.");
            qm.dispose();
        } else if (selection == 10) {
            if (qm.getPlayer().getOneInfo(29400, "mon") >= 100000) {
                if (qm.getQuestRecord(29400).getCustomData().substring(5) < qm.getCurrentTime()) {
                    qm.sendOk("이미 30일의 제한 시간이 지난 것 같소. 다시 도전하시오.");
                    qm.forfeitQuest(29400);
                    qm.dispose();
                    return;
                }
                if (qm.getInvSlots(1) >= 2) {
                    qm.sendOk("호오, 대단하오. 훈장을 받을 자격이 충분하구려.");
                    qm.gainItem(1142004, 1);
                    qm.forceCompleteQuest();
                    qm.showQuestCompleteEffect();
                    if (qm.checkMedalScore("ExpertHunter", qm.getPlayer().getOneInfo(29400, "mon")) == 0) {
                        cm.removeItemFromWorld(1142005, "전설적인 사냥꾼 자격이 박탈되어, 칭호가 회수되었습니다.", false);
                        qm.gainItem(1142005, 1);
                    }
                    qm.dispose();
                } else {
                    qm.sendOk("장비 인벤토리 공간이 충분한지 확인해주게.");
                qm.dispose();
                }
            } else {
                qm.dispose();
            }
        } else {
            qm.dispose();
        }
    }
}
