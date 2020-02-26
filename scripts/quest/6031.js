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
 * Quest ID : 6031
 * Quest Name : 휴즈의 과학 수업
 * Quest Progress Info : 스탠은 과학 수업을 들으려면 오르비스탑 어딘가에 숨어서 자신만의 연구를 하고 있는 #b휴즈#k를 찾아가라고 했다.
 * Quest End Info : 휴즈의 정신없는 과학 수업을 모두 들었다. 으아 정말 정신없어! 어쨌든 수업 끝-!
 * End NPC : 2012017
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
        if (qm.getQuestStatus(6031) == 0) {
            qm.forceStartQuest();
            qm.dispose();
        } else {
            qm.sendNext("어서 와. 스탠에게 이야기는 들었어. 귀찮게 말이지. 나한테 왜 이런 걸 부탁하는건지 모르겠네. 과학이라는 게 뭐라고 생각해? 난 한 번도 생각해 본 적이 없어. 그런 나에게 과학의 기본을 설명하라니 그거 좀 웃기지 않아?");
        }
    } else if (status == 1) {
        qm.sendNext("과학이란 어려운 게 아니라구. 생활 속에 녹아 있단 말이지. 여기 이 기계를 좀 봐. 복잡해 보여? 어려워 보이냐고! 아냐 하나도 다르지 않아! 마치 내가 정상인 것처럼 말이지. 하지만 사람들은 지레 겁을 먹지. 선입견을 가지면서 말이야. 그건 좋지 않아 좋지 않다고!!")
    } else if (status == 2) {
        qm.sendNext("잘~ 생각해봐야 해. 중요한 건 이해한다는 거야. 이해하려고 노력하는 거지. 자신이 이해하는 것! 그것을 넘어서는 것! 그리고 그걸 다시 이해하는 것! 그게 바로 핵심이라고... 뭔지 알아? 알아 듣겠어?")
    } else if (status == 3) {
        qm.sendYesNo("물리적인 법칙? 수식? 실험? 그런 건 다 어중이떠중이야. 중요한건 그게 아니라고! 아...오랫만에 말을 많이 했더니 피곤하군. 이만 가봐. 수업은 끝났어.");
    } else if (status == 4) {
        if (selection == 1) {
            var qr = qm.getQuestRecord(6029);
            var info = qr.getCustomData();
            if (info == null) {
                info = "000";
                qr.setCustomData("000");
            }
            info = info.substr(0, 1) + "1" + info.substr(2, 1);
            qr.setCustomData(info);
            qm.getPlayer().updateQuest(qr, true);
            qm.showQuestCompleteEffect();
            qm.forceCompleteQuest();
            qm.dispose();
        } else {
            qm.sendOk("젠장.. 피곤하다니까. 뭐 그래도 수업을 다시 듣고 싶다면 특별히 한번쯤은 더 들려주도록 하지.");
            qm.dispose();
        }
    }
}