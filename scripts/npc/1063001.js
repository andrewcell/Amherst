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
 * NPCID : 1063001
 * ScriptName : viola_blue
 * NPCNameFunc : 파란색 꽃 무더기
 * Location : 105040313 (히든스트리트 - 끈기의깊은숲<4단계>)
 * 
 * @author T-Sun
 *
 */

var itemSet = new Array(4020005, 4020006, 4020004, 4020001, 4020003, 4020000, 4020002);
var rand = Math.floor(Math.random() * itemSet.length);


function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status >= 2 && mode == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1) {
	status++;
    } else {
	status--;
    }
    if (status == 0) {
	cm.warp(105040300);
            
	if (cm.getQuestStatus(2053) == 1 && !cm.haveItem(4031026, 20)) {
	    cm.gainItem(4031026, Math.random() < 0.3 ? 20 : 15);
	} else {
	    cm.gainItem(itemSet[rand], 2);
	}
	cm.dispose();
    }
}