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
 * NPCID : 1012007
 * ScriptName : pet_letter
 * NPCNameFunc : 프로드 - 조련사
 * Location : 100000202 (빅토리아로드 - 펫산책로)
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
	if (cm.haveItem(4031035)) {
	    cm.sendNext("오호~ #b#t4031035##k를 가져오셨군요! 좋아요! 펫과 좀 더 친해질 수 있도록 마법을 드리겠어요! 이야압~");
	} else {
	    cm.sendOk("펫을 산책시키러 오신건가요? #b#t4031035##k가 있다면 펫과 좀 더 친해질 수 있을텐데..~");
	    cm.dispose();
	}
    } else if (status == 1) {
	if (cm.getPlayer().getPet(0) == null) {
	    cm.sendNextPrev("어라라? 펫은 어디에 있나요? 설마.. 혼자 올라오셨다거나...");
	} else {
	    cm.gainItem(4031035, -1);
	    cm.gainClosenessAll(2);
	    cm.sendNextPrev("펫과 좀 더 친해지신게 느껴지시나요? 열심히 펫과 친밀도를 올려보세요~");
	}
	cm.dispose();
    }
}