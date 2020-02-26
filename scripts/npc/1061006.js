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
 * NPCID : 1061006
 * ScriptName : flower_in
 * NPCNameFunc : 이상한 모양의 석상
 * Location : 105040300 (던전 - 슬리피우드)
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
	if (cm.haveItem(4031025, 10)) {
	    cm.sendNext("이미 #t4031025#를 가지고 있는 것 같습니다.");
	    cm.dispose();
	} else if (cm.haveItem(4031028, 30)) {
	    cm.sendNext("이미 #t4031028#를 가지고 있는 것 같습니다.");
	    cm.dispose();
	} else if (cm.haveItem(4031026, 20)) {
	    cm.sendNext("이미 #t4031026#를 가지고 있는 것 같습니다.");
	    cm.dispose();
	} else if (cm.getQuestStatus(2052) >= 1 || cm.getQuestStatus(2053) >= 1 || cm.getQuestStatus(2054) >= 1){
	    cm.sendYesNo("석상에 손을 대자 어디론가 빨려드는듯한 느낌이 듭니다. 이대로 이동하시겠습니까?");
	} else {
            cm.sendOk("이상하게 생긴 석상입니다.");
            cm.dispose();
        }

    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("석상에서 손을 떼자 아무일도 없던 것처럼 원래대로 돌아왔습니다.");
            cm.dispose();
            return;
        }
	if (cm.getQuestStatus(2054) >= 1) {
	    cm.warp(105040314, 0);
	} else if (cm.getQuestStatus(2053) >= 1) {
	    cm.warp(105040312, 0);
	} else if (cm.getQuestStatus(2052) >= 1) {
	    cm.warp(105040310, 0);
	}
	cm.dispose();
    }
}	

