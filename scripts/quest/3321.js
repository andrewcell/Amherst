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
 * Quest ID : 3321
 * Quest Name : 실종된 연금술사, 드랭
 * Quest Progress Info : 약간은 우울한 듯한 얼굴... 하지만 차분해 보이는 #p2111002#은, 끔찍한 실험으로 사람들을 놀라게 할 것 같지는 않아 보였다. 무심코 하는 그의 말을 잘 들어보니, 놀랍게도 그의 아내는 #b#p2111004##k인 것 같다! 그는 필리아에게 #b은 펜던트#k를 선물하고 싶었다는데... \n\n ...은으로 된 펜던트? 그러고 보니 전에 #p2040050#가 #p2111002#의 비밀 연구노트가 있는 곳을 열어줄 열쇠는 은으로 만든 물건이라고 하지 않았던가? 그 펜던트가 #p2111002#의 집에 있었다니...
 * Quest End Info : #p2111006#의 놀라운 힘 덕분에 #p2111002#과 대화할 수 있었다. 
 * Start NPC : 2111002
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
        qm.sendNext("...어째서 이런 곳에 오신 건지 모르지만... 연금술사의 실험실은 그리 즐거운 곳이 아닙니다. 연금술사가 아닌 사람의 눈에는 무척 지루하다더군요. 하긴... 그녀야 요정이니 더 재미없어 보일지도 모르겠군요...  ");
    } else if (status == 1) {
        qm.sendNext("그녀가 누구냐고요? 그녀는... 제 아내입니다. 그러고 보니 그녀의 얼굴을 못 본지도 꽤 오래 되었군요... 딸 아이의 얼굴이 가물가물할 정도이니... 그녀가 무척 화를 내겠군요. 물론 상냥한 그녀는 곧 용서해 줄 테지만요... ");
    } else if (status == 2) {
        qm.sendNext("...하지만 어쩔 수 없지요. 이 연구를 마치기 전까지 그녀의 얼굴을 보지 않겠다고 결심했으니까요. 무척 보고 싶지만... 연구를 마치기 전까지는... 연구만 마치면 영원히 #b#p2111004##k의 얼굴을 볼 수 있을 겁니다.");
    } else if (status == 3) {
        qm.sendNext("그러고 보니 #b펜던트#k를 아직도 그녀에게 선물하지 못했군요. 그녀에게 들킬까봐 #b액자 뒤#k에 숨겨 놓기까지 했었는데... 그녀의 얼굴을 볼 수 없으니 선물조차 할 수 없네요. 언제쯤이면 그녀를 볼 수 있을까요... ");
    } else if (status == 4) {
        qm.askAcceptDecline("...쓸데없는 이야기가 너무 길어졌군요. 죄송합니다만, 연구를 계속 해야 해서... 그만 이 연구실에서 나가주십시오.");
    } else if (status == 5) {
        if (selection == 0) {
            qm.sendOk("무례하신 분이군요...");
        } else {
            qm.forceStartQuest();
            qm.warp(261020401, 0);
        }
        qm.dispose();
    }
}
