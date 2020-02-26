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
 * NPCID : 2012023
 * ScriptName : s4tornado
 * NPCNameFunc : 단풍잎 구슬
 * Location : 200000300 (오르비스 - 만남의 언덕)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    if (cm.getQuestStatus(6230) == 1) {
	if (!cm.haveItem(4031456)) {
	    if (cm.haveItem(4031476)) {
		if (cm.canHold(4031456)) {
		    cm.gainItem(4031456, 1);
		    cm.gainItem(4031476, -1);
		    cm.sendOk("단풍잎이 빛나는 유리구슬 속으로 빨려들어갔습니다." );
		    cm.safeDispose();
		} else {
		    cm.sendOk("인벤토리 공간이 부족합니다." );
		    cm.safeDispose();
		}
	    } else {
		cm.dispose();
	    }
	} else {
	    cm.dispose();
	}
    } else {
        cm.sendOk("투명한 구슬 속에 붉은 단풍잎이 있다.");
	cm.dispose();
    }
}