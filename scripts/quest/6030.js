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
 * Quest ID : 6030
 * Quest Name : 카슨의 연금술 수업
 * Quest Progress Info : 스탠은 연금술 수업을 들으려면 제뉴미스트협회장인 #b카슨#k을 찾아가라고 했다.
 * Quest End Info : 마가티아의 제뉴미스트협회장 카슨으로부터 지루한 연금술 수업을 들었다. 아 드디어 수업 끝-!
 * End NPC : 2111000
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
        if (qm.getQuestStatus(6030) == 0) {
            qm.forceStartQuest();
            qm.dispose();
        } else {
            qm.sendNext("어서 오게. 자네를 보낸다는 스탠의 연락은 이미 받았네. 기초 연금술에 대한 수업을 받으면 된다고 했던가?");
        }
    } else if (status == 1) {
        qm.sendNext("연금술의 기본을 정의하자면 #b순환#k과 #b교환#k이라고 할 수 있네.우선 순환이란 물질을 구성하는 성질이 서로 일정한 규칙을 가지고 변화한다는 것을 말하지. 물은 나무로, 나무는 불로, 불은 흙으로, 흙은 금으로, 금은 다시 물로 변하는 것처럼 말이지. 이것은 연금술의 가장 기초이면서 세상 모든 물질의 기본적인 성질이라네.")
    } else if (status == 2) {
        qm.sendNext("교환은 순환과는 조금 다르지. 순환이 정해진 범위 안에서 물질의 성질을 바꾸는 힘이라면 교환은 물질의 절대적인 양에 대한 개념이라네. 무에서 유를 만들 수 없듯이 연금술을 통해서 전에 없던 새로운 것을 만들 수는 없다네. 항상 그곳에 존재했던 것 존재했던 물질을 순환법칙으로 가공하여 새로운 것으로 교환하는 것 그것이 연금술의 핵심이지.")
    } else if (status == 3) {
        qm.sendYesNo("자네의 표정을 보아하니 과연 내 말을 잘 알아들었는지 알 수가 없구만. 하긴 연금술을 그렇게 단시간 안에 모두 이해할 수 있다면 자네는 천년에 한번 나올까 말까한 인재일테니까. 어쨌든 수업을 마치도록 하겠네. 스탠에게는 수업을 들었다고 연락해 두지.");
    } else if (status == 4) {
        if (selection == 1) {
            var qr = qm.getQuestRecord(6029);
            var info = qr.getCustomData();
            if (info == null) {
                info = "000";
                qr.setCustomData("000");
            }
            info = "1" + info.substr(1, 2);
            qr.setCustomData(info);
            qm.getPlayer().updateQuest(qr, true);
            qm.showQuestCompleteEffect();
            qm.forceCompleteQuest();
            qm.dispose();
        } else {
            qm.sendOk("수업을 다시 듣고 싶은건가? 그렇다면 내게 다시 말을 걸게나.");
            qm.dispose();
        }
    }
}
