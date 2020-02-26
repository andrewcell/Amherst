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
 * Quest ID : 2216
 * Quest Name : 몽땅따의 정보
 * Quest Progress Info : #p9000008#의 말에 의하면 #o6220000#은 #o3110100#와 매우 닮았지만 덩치가 훨씬 크고 마법까지 사용할 줄 아는 것 같다. ...그런데 이 사람, 표준어도 쓸 줄 알잖아?
 * Quest End Info : #p9000008#의 말에 의하면 #o6220000#은 #o3110100#와 매우 닮았지만 덩치가 훨씬 크고 마법까지 사용할 줄 아는 것 같다.
 * Start NPC : 9000008
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
        qm.askAcceptDecline("무슨 일인가해? 자물쇠 따기라면 이 몽땅따에게 모두 맡기라해~ 허어? 뒷골목의 제이엠이 보내서 왔다는 말인가해? #h0#... 흠. 정말인 모양이군. 좋아. 그럼 지금까지 모은 정보를 전해 주도록 하지.")
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendOk("늪지대를 여행하던 모험가의 말에 의하면, 다일은 보통의 리게이터와 꼭 닮았다고 하더군. 마치 리게이터를 #r부풀려 놓은 것처럼#k 거의 똑같이 생겼다는 거야. 하지만 리게이터와 달리 마법까지 사용할 수 있어 훨씬 무섭다더군.")
            qm.forceCompleteQuest();
            qm.showQuestCompleteEffect();
            qm.dispose();
        } else {
            qm.sendOk("정보를 들을 준비가 되시면 다시 말을 걸게.");
            qm.dispose();
        }
    }
}
