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
 * NPCID : 2040033
 * ScriptName : ludi029
 * NPCNameFunc : 네르 - 조련사
 * Location : 220000006 (루디브리엄 - 루디 펫 산책로)
 * 
 * @author T-Sun
 *
 */

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status >= 0 && mode == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	if (cm.haveItem(4031128)) {
	    cm.sendNext("이것은 형의편지! 와.. 설마 여기까지 펫과 함께 올라오신거에요? 대단하신데요~");
	} else {
	    cm.sendOk("여기까지 어쩐 일로 올라오신걸까요?");
	    cm.dispose();
	}
    } else if (status == 1) {
	if (cm.getPlayer().getPet(0) == null) {
	    cm.sendNextPrev("어라? 펫은 어디에 있나요? 설마 펫 없이 혼자 올라오셨나요? 그러시면 안되죠~");
	    cm.dispose();
	} else {
	    cm.gainItem(4031128, -1);
	    cm.gainClosenessAll(4);
	    cm.sendNextPrev("어때요? 펫과 더 친해지신 느낌이 드나요? 헤헤");
	    cm.dispose();
	}
    }
}