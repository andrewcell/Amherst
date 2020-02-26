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
 * Quest ID : 2218
 * Quest Name : 넬라의 정보
 * Quest Progress Info : #p1052103#의 말에 의하면 #m103000000# 마을에 있는 마법사 #b#p9020000##k가 요즘 부쩍 불안해 보인다고 한다... 뭔가 음모와 관계가 있는 걸까?
 * Quest End Info : #p1052103#의 말에 의하면 #m103000000# 마을에 있는 마법사 #b#p9020000##k가 요즘 부쩍 불안해 보인다고 한다... 뭔가 음모와 관계가 있는 걸까?
 * Start NPC : 1052103
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
        qm.askAcceptDecline("뭐야? 길이라도 잃었어? 그럼 왜 그렇게 쳐다보는 건데? ... 헤에. 그러고 보니 제이엠이 이름이 #h0#인 사람을 보면 정보를 건네주라고 했었지? 좋아. 수집한 정보를 너한테 말해줄게.")
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendNext("혹시 마법사 #r라케리스#k를 알아? 저쪽, 하수구 앞에서 모험가들을 모으는 여자 말이야. 요즘 그녀가 왠지 이상해. 어딘가 불안해 보인다고 할까, 수상해 보인다고 할까... 창백한 얼굴로 하수구 쪽을 볼 때도 많고.")
        } else {
            qm.sendOk("정보를 들을 준비가 되면 다시 말을 걸어줘.");
            qm.dispose();
        }
    } else if (status == 2) {
        qm.sendOk("뭐, 지레짐작한 것일 뿐일지도 모르지만, 어쨌든 그 여자는 #r요주의 인물#k이니까 다시 한 번 확인해 보는 게 좋을 거라고 제이엠한테 전해줘.")
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
