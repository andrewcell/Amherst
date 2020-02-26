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
 * NPCID : 2012008
 * ScriptName : skin_orbis1
 * NPCNameFunc : 로미 - 피부관리사
 * Location : 200000203 (오르비스공원 - 오르비스피부관리실)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var skin = Array(0, 1, 2, 3, 4);

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
	cm.dispose();
	return;
    } else {
	status++;
    }

    if (status == 0) {
	cm.sendNext("아름다운 피부로 가꾸시고 싶으신가요? 제가 도와드리도록 하지요. 서비스를 이용하려면 #b#t5153001##k 아이템을 가져오셔야 합니다.");
    } else if (status == 1) {
	cm.sendStyle("원하시는 피부를 골라보세요~", skin);
    } else if (status == 2){
	if (cm.setAvatar(5153001, skin[selection]) == 1) {
	    cm.sendOk("자~ 다 되었답니다. 아름다운 피부는 미의 기본.. 앞으로도 아름다운 피부를 가꾸시고 싶으시다면 저희 피부관리실을 찾아주세요.");
	} else {
	    cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 피부관리를 해드릴 수 없답니다.");
	}
	cm.dispose();
    }
}
