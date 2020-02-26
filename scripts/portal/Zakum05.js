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
 * PortalName : Zakum05
 * Location : 211042300 (폐광 - 자쿰으로통하는문)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var em = pi.getEventManager("ZakumBattle");
    if (em.getProperty("battle") != null && em.getProperty("battle").equals("1")) {
        pi.playerMessage("이미 자쿰과의 전투가 시작되어 입장하실 수 없습니다.");
    } else {
        pi.playPortalSE();
        pi.warp(pi.getPlayer().getMapId() + 100, "west00");
    }
}
