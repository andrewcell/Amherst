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
 * NPCID : 9000007
 * ScriptName : Event04
 * NPCNameFunc : 천지
 * Location : 103010000 (빅토리아로드 - 커닝시티공사장)
 * 
 * @author T-Sun
 *
 */

var status = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.haveItem(4031019, 1)) {
            cm.sendNext("호오, #b#t4031019##k를 구해오다니. 너 보통내기가 아닌걸? 흐음.. 너, 그걸 나에게 주지 않을래? 나에게 준다면 #b#t4031017##k를 주도록 하지.")
        } else {
            cm.sendOk("건드리지 마라~ 다친다~")
            cm.safeDispose();
        }
    } else if (status == 1) {
        cm.sendNext("하지만, 이 문서를 해석하려면.. 아무래도 재료가 약간 필요할 것 같아. 재료는.. 중앙 던전에서 #b#t4000008# 50개#k 정도만 구해오면 될 것 같은데..");
    } else if (status == 2) {
        if (cm.haveItem(4000008, 50)) {
            cm.sendNext("엇? 그건 #b#t4000008# 50개#k! 좋아. 재료도 모였겠다, 이제 너에게 보상을 주도록 하지.");
        } else {
            cm.sendOk("재료를 구하면 다시 나에게 찾아오도록 해.")
            cm.dispose();
        }
    } else if (status == 3) {
        if (cm.canHold(4031017)) {
            if (cm.haveItem(4031017, 1)) {
                cm.sendOk("어이? 이미 #t4031017#를 갖고 있는거 아니야? 이미 갖고 있으면 줄 수 없다구.");
                cm.dispose();
            } else {
                cm.gainItem(4000008, -50);
                cm.gainItem(4031019, -1);
                cm.gainItemPeriod(4031017, 1, 1);
                cm.sendOk("이 매직박스는 1일 이내에 열어야 해. 그렇지 않으면 사라지고 말지. 지금 받은 즉시 열어 보도록 해. #b커닝시티#k의 #r몽땅따#k 아저씨에게 가 보면 이 상자를 열 수 있을거야.");
                cm.dispose();
            }
        } else {
            cm.sendOk("인벤토리 공간이 부족한거 아니야? 다시 한번 확인해 봐.");
            cm.dispose();
        }
    }
}