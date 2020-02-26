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
 * NPCID : 2032003
 * ScriptName : Zakum02
 * NPCNameFunc : 리라
 * Location : 280020001 (아도비스의임무2 - 화산의숨결<2단계>)
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
	cm.sendNext("훌륭합니다. 이곳까지 오시다니, 보통내기가 아니시군요. 약속대로 화산의 숨결을 드리도록 하지요. 받으시기 전에 인벤토리 공간이 충분한지 확인해주세요.");
    }
    else if (status == 1) {
	if (!cm.canHold(4031062,1)) {
	    cm.sendNext("흐음, 인벤토리 공간이 부족하신 것 같군요.");
	    cm.dispose();
	    return;
	}
	cm.gainItem(4031062,1);
	cm.warp(280090000);
	// if this is their first time, exp gain
	if (cm.getQuestStatus(100202) != 2) {
	    cm.startQuest(100202);
	    cm.completeQuest(100202);
	    cm.gainExp(10000);
	}
	cm.dispose();
    }
}