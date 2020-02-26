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
 * PortalName : s4iceeagle
 * Location : 211040700 (폐광 - 위험한절벽)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6242) == 1 || pi.getQuestStatus(6243) == 1) {
	if (!pi.haveItem(4001114)) {
		pi.playPortalSE();
		pi.warp(921100210, 0);
	} else {
	    pi.playerMessage("이미 프리져의 알을 갖고 있어 입장할 수 없습니다.");
	}
    } else if (pi.getQuestStatus(6242) == 2 && pi.getQuestStatus(6243) == 0) {
	if (!pi.haveItem(4001114)) {
	    pi.playPortalSE();
	    pi.warp(921100210, 0);
	} else {
	    pi.playerMessage("이미 프리져의 알을 갖고 있어 입장할 수 없습니다." );
	}
    } else {
	pi.playerMessage("알 수 없는 힘으로 봉인되어 있습니다.");
    }
    return false;
}