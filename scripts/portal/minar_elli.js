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
 * PortalName : minar_elli
 * Location : 101010000 (빅토리아로드 - 엘리니아북쪽필드)
 * Location : 240010100 (미나르숲 - 미나르숲 서쪽 경계)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
try {
    if (pi.haveItem(4031346)) {
	if (pi.getMapId() == 240010100) {
	    pi.playPortalSE();
	    pi.warp(101010000, "minar00");
	} else {
	    pi.playPortalSE();
	    pi.warp(240010100, "elli00");
	}
	pi.gainItem(4031346, -1);
	pi.playerMessage("마법의 씨앗의 힘으로 어딘가로 이동됩니다..");
	return true;
    } else {
	pi.playerMessage("이 포탈을 사용하려면 마법의 씨앗이 필요합니다.");
	return false;
    }
} catch (e) {
    pi.playerMessage("Error: " + e);
}
}

