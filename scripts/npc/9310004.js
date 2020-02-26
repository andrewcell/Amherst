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
 * NPCID : 9310004
 * ScriptName : shanghai001
 * NPCNameFunc : 임경찰
 * Location : 701010320 (중국 - 중원 산악지대2)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.getQuestStatus(4103) == 1) {
            if (cm.haveItem(4031289) && !cm.haveItem(4031227)) {
                cm.sendNext("안녕하세요? 저는 임경찰입니다. 이 안은 아무나 출입 할 수 없습니다. 하지만 당신은 비밀임무 수행중이신 것 같군요. 안으로 보내드릴테니 그곳의 #b정경찰#k을 만나 보시기 바랍니다.");
            } else if (cm.haveItem(4031227)) {
                cm.sendOk("앗..! 그것은 #b#t4031227##k 아닌가요? 드디어.. 상해를 구해주셨군요! 상해의 #b#p9310005##k에게 말을 걸어보세요. 분명 좋은 보상을 줄거에요.");
                cm.safeDispose();
            } else {
                cm.sendOk("안녕하세요? 저는 임경찰입니다. 이 안은 아무나 출입 할 수 없습니다. ");
                cm.safeDispose();
            }
        } else if (cm.getQuestStatus(4103) == 2) {
	    cm.sendNext("안녕하세요? 저는 임경찰입니다. 이 안은 아무나 출입 할 수 없습니다. 하지만 당신은 비밀임무 수행중이신 것 같군요. 안으로 보내드릴테니 그곳의 #b정경찰#k을 만나 보시기 바랍니다.");
	} else {
            cm.sendOk("안녕하세요? 저는 임경찰입니다. 이 안은 아무나 출입 할 수 없습니다. ")
            cm.safeDispose();
        }
    } else if (status == 1) {
            cm.warp(701010321);
            cm.dispose();
    }
}