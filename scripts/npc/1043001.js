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
 * NPCID : 1043001
 * ScriptName : bush2
 * NPCNameFunc : 약초 덤불
 * Location : 101000104 (히든스트리트 - 인내의숲<5단계>)
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
	if (cm.getQuestStatus(2051) == 1 && !cm.haveItem(4031032)) {
	    cm.gainItem(4031032, 1); // Double-Rooted Red Ginseng
	} else {
	    var rand = 1 + Math.floor(Math.random() * 4);
	    if (rand == 1) {
		cm.gainItem(4020007, 2); // Diamond Ore
	    } else if (rand == 2) {
		cm.gainItem(4020008, 2); // Black Crystal Ore
	    } else if (rand == 3) {
		cm.gainItem(4010006, 2); // Gold Ore
	    } else if (rand == 4) {
		cm.gainItem(1032013, 1); // Red-Hearted Earrings
	    }
	}
	cm.warp(101000000, 0);
	cm.dispose();
    }
}