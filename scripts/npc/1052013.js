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
 * NPCID : 1052013
 * ScriptName : go_pcmap
 * NPCNameFunc : 컴퓨터
 * Location : 193000000 (프리미엄로드 - 커닝시티게임방)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var select;
function start() {
	status=-1;
    action(1,0,0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
	return;
    } else {
        if (mode == 0) {
 	cm.dispose();
	return;
        } 
        else if (mode == 1)
            status++;
        else
            status--;
	if (status == 0) {
		cm.sendSimple("메이플스토리에 오신것을 환영합니다.\r\n\r\n#b#L0##m190000000##l\r\n#L1##m191000000##l\r\n#L2##m192000000##l\r\n#L3##m195000000##l\r\n#L4##m196000000##l\r\n#L5##m197000000##l#k");
	} else if (status == 1) {
		if (selection == 0)
			cm.warp(190000000);
		else if (selection == 1)
			cm.warp(191000000);
		else if (selection == 2)
			cm.warp(192000000);
		else if (selection == 3)
			cm.warp(195000000);
		else if (selection == 4)
			cm.warp(196000000);
		else if (selection == 5)
			cm.warp(197000000);
		cm.dispose();
	} else if (status == 2) {
		
	}

}
}