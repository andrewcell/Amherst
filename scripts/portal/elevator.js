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
 * PortalName : elevator
 * Location : 222020100 (핼리오스탑 - 핼리오스탑2층)
 * Location : 222020200 (핼리오스탑 - 핼리오스탑99층)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var em = pi.getEventManager("elevator");
    if (em == null) {
        pi.playerMessage("엘리베이터가 고장났습니다.");
    } else {
        if (pi.getPlayer().getMap().getReactorByName("elevator").getState() == 0) {
            pi.playPortalSE();
            pi.warp(pi.getMapId() + 10);
        } else {
            pi.playerMessage("엘리베이터 문이 닫혀있습니다.");
        }
    }
}
