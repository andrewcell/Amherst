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
 * Quest ID : 29002
 * Quest Name : 칭호 도전 - 인기인!
 * Quest Progress Info : #b#e칭호 도전 - 인기인#n\n#k - 남은시간 : #Qdaylimit#일 #Qhourlimit#시간 #Qminlimit#분\n - 인기도 증가량 : #b#jpopgap##k / #jpopG#\n               #jgaugePop# #jperPop# %
 * Quest End Info : #b#e칭호 도전 - 인기인#n\n#k - 남은시간 : #Qdaylimit#일 #Qhourlimit#시간 #Qminlimit#분\n - 인기도 증가량 : #b#jpopgap##k / #jpopG#\n               #jgaugePop# #jperPop# %\n\n30일 동안 인기도 1000을 올렸다! 달리어도 이런 나의 인기에 놀란 눈치였는데, 결국 명예의 신관인 그에게서 '#b인기인#k'이라는 칭호를 받아내고 말았다. 훗, 이제 '#b메이플 아이돌스타#k'에 도전해 볼까?
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
        qm.sendNext("#v1142003# #e#b#t1142003##k\r\n\r\n - 제한시간 30일\r\n - 인기도 1000상승\r\n\r\n#n이 훈장의 주인이 될 자격이 있는지 시험해 보시겠소?");
    } else if (status == 1) {
        qm.sendNext("자, 30일의 시간을 줄테니 목적을 이루고 나에게 돌아오시오. 제한시간 내에 나에게 와서 확인을 받아야만 인정받을 수 있다는 것을 꼭 명심하시오. 그리고 이 도전을 완료하거나 포기하지 않는 이상 다른 칭호에 도전할 수는 없다는 것도 알아두시오.");
    } else if (status == 2) {
        var chr = qm.getPlayer();
        qm.forceStartQuest(29002, "time_" + (qm.getCurrentTime() + (86400000 * 30)));
        chr.updateInfoQuest(29002, "popG=1000;popS=" + chr.getFame());
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
        var addFame = qm.getPlayer().getFame() - qm.getPlayer().getOneInfo(29002, "popS");
        if (addFame < 1000) {
            qm.askAcceptDecline("그대의 인기도는 그동안 " + addFame + "만큼 올랐소. 목표인 1000을 달성하지 못했으니 이 칭호를 받기에는 무리라고 생각하오만... 그만 포기하시겠소?");
        } else {
            if (qm.getQuestRecord(29002).getCustomData().substring(5) < qm.getCurrentTime()) {
                qm.sendOk("이미 30일의 제한 시간이 지난 것 같소. 다시 도전하시오.");
                qm.forfeitQuest(29002);
                qm.dispose();
            } else {
                qm.sendNext("호오, 대단하오. 인기도의 훈장을 받을 자격이 충분하구려.");
                status = 1;
            }
        }
    } else if (status == 1) {
        if (selection == 1) {
            qm.forfeitQuest(29002);
            qm.sendOk("다음에 도전하려면 언제든지 또 오시오.");
            qm.dispose();
        } else {
            qm.sendOk("계속 도전을 해주시오.");
            qm.dispose();
        }
    } else if (status == 2) {
        if (qm.canHold(1142003)) {
            qm.gainItem(1142003, 1);
            qm.forceCompleteQuest();
            qm.showQuestCompleteEffect();
        } else {
            qm.sendOk("장비 인벤토리 공간이 충분한지 확인해주게.");
        }
        qm.dispose();
    }
}
