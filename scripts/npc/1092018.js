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
 * NPCID : 1092018
 * ScriptName : nautil_letter
 * NPCNameFunc : 휴지통
 * Location : 120000100 (노틸러스호 - 상층 복도)
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
	cm.sendNext("쓰다가 만 편지가 보인다.. 중요해 보이는 것 같다. 종이를 주워본다.");
    } else if (status == 1) {
	if (cm.haveItem(4031839)) {
	    cm.sendOk("이미 편지를 주웠다. 또 다시 주울 필요는 없다.");
	    cm.safeDispose();
	} else {
            if (!cm.canHold(4031839)) {
                cm.sendOk("인벤토리 공간이 부족합니다.");
                cm.dispose();
                return;
            }
	    cm.gainItem(4031839,1);
	    cm.sendOk("뭐라 적혀있는지는 모르겠다..");
	    cm.safeDispose();
	}
    }
}