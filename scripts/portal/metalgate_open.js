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
 * PortalName : metalgate_open
 * Location : 990000430 (샤레니안 - 신념의 방)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getMap().getReactorByName("metalgate").getState() == 1) {
        pi.playPortalSE();
	pi.warp(990000431, 0);
    }
    else {
	pi.playerMessage("지금은 포탈이 닫혀있습니다.");
    }
}
