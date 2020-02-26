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
 * PortalName : s4berserk
 * Location : 105090800 (던전 - 신전의입구4)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6153) == 1) {
	if (!pi.haveItem(4031471)) {
	    if (pi.haveItem(4031475)) {
		var em = pi.getEventManager("4jberserk");
		if (em == null) {
		    pi.playerMessage("알 수 없는 이유로 입장에 실패했습니다." );
		} else {
                    if (em.getProperty("state").equals("1")) {
                        pi.playerMessage("이미 이 안에 다른 누군가가 퀘스트에 도전중입니다.");
                        return;
                    }
                    pi.playPortalSE();
		    em.startInstance(pi.getPlayer());
		}
	    // start event here
	    // if ( ret != 0 ) target.message( "Other character is on the quest currently. Please try again later." );
	    } else {
		pi.playerMessage("잊혀진 신전으로 가는 열쇠가 필요합니다.");
	    }
	} else {
	    pi.playerMessage("이미 세이람의 방패를 갖고 있습니다.");
	}
    } else {
	pi.playerMessage("알 수 없는 힘으로 봉인되어 있습니다.");
    }
    return false;
}