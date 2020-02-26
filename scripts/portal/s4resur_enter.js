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
 * PortalName : s4resur_enter
 * Location : 220070400 (시계탑최하층 - 잊혀진 회랑)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6134) == 1) {
	var em = pi.getEventManager("s4resurrection2");
	if (em == null) {
	    pi.playerMessage("You're not allowed to enter with unknown reason. Try again.");
	} else {
	    var prop = em.getProperty("started");
	    if (prop == null || prop.equals("false")) {
		em.startInstance(pi.getPlayer());
		return true;
	    } else {
		pi.playerMessage("이미 누군가가 퀘스트 클리어에 도전하는 중입니다.");
	    }
	}
    } else {
	pi.playerMessage("알 수 없는 힘으로 포탈이 봉인되어 있습니다.");
    }
    return false;
}