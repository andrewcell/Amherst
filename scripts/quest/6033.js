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
 * Quest ID : 6033
 * Quest Name : 스탠의 두 번째 가르침
 * Quest Progress Info : 스탠의 연락을 받고 마가티아로 그를 찾아갔다. 그런데 스탠이 다짜고짜 화를 내기 시작했다. 내가 만든 엉터리 물건을 시장에서 발견했는데 눈뜨고 못 볼 지경이라면서 해이해진 나의 마음을 다잡기 위해서 시험을 보겠다고 했다.\n시험의 내용은 중급 몬스터 결정 만들기...흐음...왠지 긴장되는걸.\n\n#i4260003# #t4260003# #b#c4260003# / 1
 * Quest End Info : 스탠은 해이해진 나의 마음가짐을 질책하며, 기본부터 잘못되어 있다고 했다. 결국 중급 몬스터 결정 만들기 시험을 간신히 통과하고 나서야 스탠의 시험을 통과할 수 있었고, 나의 제작 기술도 한 단계 발전했음을 느낄 수 있었다.
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
        if (!qm.isQuestActive(6033)) {
            qm.forceStartQuest(6033);
            qm.dispose();
            return;
        }
        qm.sendYesNo("그래 가져왔군. 어디 한번 볼까?");
    } else if (status == 1 && selection == 0) {
        qm.sendOk("뭐? 보여주기 싫다고? 그럼 나도 자네를 도와줄 이유는 없지.");
        qm.dispose();
        return;
    } else {
        qr = qm.getQuestRecord(6033);
        if (qr.getCustomData() == null) {
            if (status == 1) {
                qm.sendNext("엉터리군! 꽝이야! 이런 식으로 물건을 만드니까 문제가 생기는거다! 다시 만들어와!");
            } else if (status == 2) {
                qm.gainItem(4260003, -1);
                qr.setCustomData("1");
                qm.dispose();
            }
        } else if (qr.getCustomData().equals("1")) {
            if (status == 1) {
                file = "#fUI/UIWindow.img/QuestIcon/";
                qm.sendNext("뭐. 썩 맘에 들지는 않지만 일단은 통과다!! 앞으로도 절대 해이해지기 않도록 주의하라고!!\r\n\r\n"+file+"4/0#\r\n\r\n#fSkill/000.img/skill/0001007/icon# #q1007# (레벨 2)\r\n\r\n"+file+"8/0# 230000 exp");
            } else if (status == 2) {
                qm.gainItem(4260003, -1);
                qm.teachSkill(1007, 2);
                qm.gainExp(230000);
                qm.showQuestCompleteEffect();
                qm.forceCompleteQuest();
                qm.dispose();
            }
        } else {
            qm.sendOk(qr.getCustomData());
            qm.dispose();
        }
    }
}
