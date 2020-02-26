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
 * Quest ID : 2156
 * Quest Name : 소원을 들어주는 무지개색 달팽이 껍질!?
 * Quest Progress Info : 피아는 해안가 풀숲으로 가서 #r마노#k를 퇴치하고 #b#t2210006##k을 가져다 달라고 말했다... 넌 아무것도 안 하고 가만히만 있으면서 또 일을 시키겠다고? 이거 너무하지 않아? #t2210006#을 얻으면 혼자 다 써버릴까보다!
 * Quest End Info : #t2210006#은 소원을 들어주는 아이템이 아니라, 사용한 사람을 달팽이로 만들어버리는 아이템이었다. 휴우. 좋은 물건이라는 말에 욕심부리면 큰 코 다친다는 사실을 알게 되었다.
 * End NPC : 1012102
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
        if (!qm.isQuestActive(2156)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        var file = "#fUI/UIWindow.img/QuestIcon/";

        if (qm.haveItem(2210006, 1)) {
            qm.sendNext("좋아. 이게 바로 무지개색 달팽이 껍질이라 이거지? \r\n\r\n" + file + "4/0#\r\n\r\n\r\n" + file + "8/0# 7500 exp");
        } else {
            qm.sendOk("흠... #b#t2210006##k은 아직 구하지 못한 거야? 해안가 풀숲으로 가서 #b#o2220000##k를 잡아 보라니까?");
            qm.dispose();
        }

    } else if (status == 1) {
        qm.gainItem(2210006, -1);
        qm.gainMeso(30000);
        if (qm.getMorphState() != 2210006) {
            qm.getPlayer().addFame(3);
            qm.getPlayer().updateFame();
            qm.sendNext("무지개색 달팽이 껍질을 나누기로 하지 않았냐고? 하지만 이걸 반으로 갈랐다가는 효능이 없어질지도 모르잖아? 먼저 정보를 준 건 이 쪽이니까, 당연히 내가 가져야지! 후훗!");
            qm.showNpcSpecialEffect("act2156");
            qm.gainExp(7500);
        } else {
            qm.getPlayer().addFame(-1);
            qm.getPlayer().updateFame();
            qm.sendNext("뭐, 뭐야 그 모습은? 왜 달팽이가 되어서 온 거야?! 뭐? 무지개색 달팽이 껍질을 쓰니까 이렇게 되었다고? 그러고 보니 달팽이 전설에서도 보물의 위험에 대해 경고하는 말이 있었지.. 휴우. 다행이다. 안 먹어서. 욕심을 부리니까 그런 꼴이 된 거라고.");
            qm.gainExp(10000);
        }
        qm.showQuestCompleteEffect();
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
