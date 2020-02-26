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
 * Quest ID : 6032
 * Quest Name : 스탠의 실기 수업
 * Quest Progress Info : 스탠은 실기수업에는 준비가 필요하니 수업을 들을 준비가 되면 다시 말을 걸라고 했다.
 * Quest End Info : 스탠으로부터 실기 수업을 들었다. 실기 수업은 역시 재밌는것 같아-!
 * End NPC : 2110004
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
        if (qm.getQuestStatus(6032) == 0) {
            qm.forceStartQuest();
            qm.dispose();
        } else {
            qm.sendNext("자! 실기수업을 시작하겠다! 오늘의 실습 주제는 추귀고리 만들기야! 추귀고리를 만들기 위해서는 강철 4개, 하급 몬스터 결정 1개, 청동 1개가 필요하지. 자 이제부터 잘 보게. 추귀고리를 만들기 위해서는 중력의 연성법칙이 필요하거든.");
        }
    } else if (status == 1) {
        qm.sendNext("(스탠이 연성진을 모두 완성하자, 연성진에서 빛이 나면서 엄청난 섬광이 눈앞을 가렸다.)")
    } else if (status == 2) {
        qm.sendYesNo("자 모두 이해했나? 여기서 수업을 마치도록 하겠다.")
    } else if (status == 3) {
        if (selection == 1) {
            var qr = qm.getQuestRecord(6029);
            var info = qr.getCustomData();
            if (info == null) {
                info = "000";
                qr.setCustomData("000");
            }
            info = info.substr(0, 2) + "1";
            qr.setCustomData(info);
            qm.getPlayer().updateQuest(qr, true);
            qm.showQuestCompleteEffect();
            qm.forceCompleteQuest();
            qm.dispose();
        } else {
            qm.sendOk("흠, 이해하지 못한 것 같으니 한번만 다시 설명해 주도록 하지. 잠시 후에 다시 말을 걸게나.");
            qm.dispose();
        }
    }
}