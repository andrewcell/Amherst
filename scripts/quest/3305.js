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
 * Quest ID : 3305
 * Quest Name : 제뉴미스트의 망토 다시 받기
 * Quest Progress Info : #p2111000#은 언짢은 얼굴로 다시 한 번 #t1102135#를 만들어 줄 테니 재료를 모아 오라고 말했다. 재료는 #b#t4000021##k과 #b#t4021003##k,#b10000메소#k라고 한다. 휴우... 다행히 다시 만들 수 있군. \n\n#i4000021##t4000021# #b#c4000021##k/10 \n#i4021003##t4021003# #b#c4021003##k/5
 * Quest End Info : #t1102135#를 다시 받았다. 이게 없으면 제뉴미스트로서 인정받을 수 없다. 절대 잃어버리지 말도록 하자.
 * Start NPC : 2111000
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
        if (qm.getPlayer().hasEquipped(1102135)) {
            qm.sendOk("제뉴미스트의 망토가 이미 있는걸 보니 새로운 망토가 필요하지 않겠군.");
            qm.dispose();
        } else if (qm.getQuestStatus(3347) == 2 || qm.getQuestStatus(3347) == 2 || qm.getQuestStatus(3347) == 2) {
            qm.sendOk("제뉴미스트로써 누릴 수 있는 혜택을 이미 다 받은 것 같은데... 유감이지만 더 이상 제뉴미스트의 망토를 재지급해 줄 수 없네.");
            qm.dispose();
        } else {
            qm.askAcceptDecline("으흠? 자네는 얼마 전에 제뉴미스트 소속이 된 연금술사 아닌가? 그런데 제뉴미스트의 망토는 어디에... 이런. 망토를 잃어버린 모양이군. 망토는 자랑스러운 제뉴미스트 학파임을 증명하는 소중한 것. 그런데 그런 것을 잃어버리다니... 정신이 있는 겐가? 매우 불쾌하군. 자네 같은 사람에게는 다시 망토를 주고 싶지 않지만... 어쩔 수 없지. 망토를 다시 받겠는가?");
        }
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendNext("한번 더 기회를 주도록 하지. 제뉴미스트의 망토를 만들고 싶다면, #b동물의 가죽 10개#k와 #b에메랄드 #k5개, 연성하는 사람을 위한 수고비 #b10000메소#k를 가져오게.");
            qm.forceStartQuest();
            qm.dispose();
        } else {
            qm.sendOk("싫다면 하는 수 없지. 자네는 더 이상 제뉴미스트 소속이 아닐세.");
            qm.dispose();
        }
    }
//    else if (status == 2) {
//        if (cm.haveItem(4021003, 5) && cm.haveItem(4000021, 10) && cm.getPlayer().getMeso() >= 10000 && cm.canHold(1102135)) {
//            cm.sendNext("이번만은 간단히 만들어 주겠지만... 제뉴미스트의 ")
//        } else {
//            cm.sendOk("재료는 제대로 갖고 있는건지, 혹은 인벤토리 공간이 부족한건 아닌지 확인해보게.");
//            cm.dispose();
//        }
//    }
}
