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
 * NPCID : 1063000
 * ScriptName : viola_pink
 * NPCNameFunc : 분홍색 꽃 무더기
 * Location : 105040311 (히든스트리트 - 끈기의깊은숲<2단계>)
 * 
 * @author T-Sun
 *
 */

var itemSet = new Array(4010003, 4010000, 4010002, 4010005, 4010004, 4010001);
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
            
	if (cm.getQuestStatus(2052) == 1 && !cm.haveItem(4031025, 10)) {
	    cm.gainItem(4031025, Math.random() < 0.3 ? 10 : 8);
	} else {
	    cm.gainItem(itemSet[rand], 2);
	}
	cm.dispose();
    }
}