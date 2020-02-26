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
 * NPCID : 2081010
 * ScriptName : s4blocking
 * NPCNameFunc : 무스
 * Location : 924000002 (히든스트리트 - 수련장 나가는 길)
 * Location : 924000000 (히든스트리트 - 수련장 가는 길)
 * Location : 924000001 (히든스트리트 - 무스의 수련장)
 * 
 * @author T-Sun
 *
 */
var status = -1;

function action(mode, type, selection){
    if (mode == 1) {
	status++
    } else {
	cm.dispose();
	return;
    }
    if (status == 0) {
	if (cm.getMapId() == 924000002) { // At Exit Map
	    cm.warp(240010400, 0);
	    cm.dispose();
	} else if (cm.getMapId() == 924000000) { // At start map
	    cm.sendNext("아, 수련장으로 가기 전에 먼저 알려줄게 하나 있어. 수련장에선 반드시 내가 준 #b#t1092041##k 아이템을 착용하고 있어야 해. 그렇지 않으면 죽게 될거야. 조심해~");
	} else {
	    cm.warp(924000002, 0);
	    cm.dispose();
	}
    } else if (status == 1) {
	cm.sendSimple("절대 #r방패를 착용하는 것#k을 잊어버리면 안돼! \r\n #b#L0# #t1092041# 받기.#l \r\n #b#L1# #m924000001# 가기.#l \r\n #b#L2# 내보내 주세요.#l");

    } else if (status == 2) {
	if (selection == 0) {
	    if (!cm.haveItem(1092041)) {
		if (cm.canHold(1092041)) {
		    cm.gainItem(1092041, 1);
		    cm.sendOk("음. 그럼 너에게 #t1092041#를 줄게. 인벤토리를 확인해 봐. 반드시 그걸 착용해야 해!");
		} else {
		    cm.sendOk("음... 인벤토리 공간이 부족한 건 아닌지 확인해 봐." );
		}
	    } else {
		cm.sendOk("이미 #t1092041##k를 갖고 있는 것 같은데?");
	    }
	    cm.safeDispose();
	} else if (selection == 1) {
	    cm.warp(924000001, 0);
	    cm.dispose();
	} else {
	    cm.warp(240010400, 0);
	    cm.dispose();
	}
    }
}