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
 * NPCID : 1063002
 * ScriptName : viola_white
 * NPCNameFunc : 흰색 꽃 무더기
 * Location : 105040316 (히든스트리트 - 끈기의깊은숲<7단계>)
 * 
 * @author T-Sun
 *
 */

var itemSet = new Array(4020007, 4020008, 4010006);
var rand = Math.floor(Math.random() * itemSet.length);

function action(mode, type, selection) {
    if (mode == 1) {
	cm.warp(105040300);
            
	if (cm.getQuestStatus(2054) == 1 && !cm.haveItem(4031028, 30)) {
	    cm.gainItem(4031028, Math.random() < 0.3 ? 30 : 20);
	} else {
	    cm.gainItem(itemSet[rand], 2);
	}
    }
    cm.dispose();
}