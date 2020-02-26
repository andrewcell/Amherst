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
 * PortalName : s4nest
 * Location : 240010700 (미나르숲 - 하늘 둥지1)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6241) == 1 || pi.getQuestStatus(6243) == 1) {
	if (pi.getJob() == 312) {
	    if (pi.haveItem(4001113)) {
		if (pi.getPlayerCount(924000100) > 0) {
		    pi.playerMessage("이미 다른 유저가 퀘스트를 클리어하는 중입니다.");
		    return false;
		}
		var em = pi.getEventManager("s4nest");
		if (em == null) {
		    pi.playerMessage("You're not allowed to enter with unknown reason. Try again." );
		} else {
		    em.startInstance(pi.getPlayer());
		    return true;
		}
	    } else {
		pi.playerMessage("피닉스의 알을 갖고 있지 않아 퀘스트에 도전할 수 없습니다." );
	    }
	} else if (pi.getJob() == 322) {
	    if (pi.haveItem(4001114)) {
		if (pi.getPlayerCount(924000100) > 0) {
		    pi.playerMessage("이미 다른 유저가 퀘스트를 클리어하는 중입니다.");
		    return false;
		}
		var em = pi.getEventManager("s4nest");
		if (em == null) {
		    pi.playerMessage("You're not allowed to enter with unknown reason. Try again." );
		} else {
		    em.startInstance(pi.getPlayer());
		    return true;
		}
	    } else {
		pi.playerMessage("피닉스의 알을 갖고 있지 않아 퀘스트에 도전할 수 없습니다." );
	    }
	}
    } else {
	pi.playerMessage("알 수 없는 힘으로 봉인되어 있습니다.");
    }
    return false;
}