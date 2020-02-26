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
 * NPCID : 2040032
 * ScriptName : ludi028
 * NPCNameFunc : 위버 - 조련사
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
    if (status == 0 && mode == 0) {
	cm.dispose();
	return;
    } else if (status >= 1 && mode == 0) {
	cm.sendNext("싫으면 어쩔 수 없지만.");
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendYesNo("펫과의 친밀도를 올리고 싶다 이건가? 좋아. 이 편지를 네르에게 가져다 주면 펫과의 친밀도가 상승할거야. 어때? 해보겠어?");
    } else if (status == 1) {
	if (cm.haveItem(4031128)) {
	    cm.sendNext("흐음? 이미 #b#t4031128##k를 갖고 있는데? 네르에게 이 편지를 가져가라구.");
	    cm.dispose();
	} else {
            if (!cm.canHold(4031128, 1)) {
                cm.sendOk("인벤토리 공간이 부족한건 아닌지 확인해보게.");
                cm.dispose();
                return;
            }
	    cm.gainItem(4031128, 1);
	    cm.sendOk("좋아. 내가 준 이 편지를 네르 에게 가져다 주면 된다네.");
	    cm.dispose();
	}
    }
}