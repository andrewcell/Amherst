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
 * PortalName : gryphius
 * Location : 240020100 (미나르숲 - 불과 어둠의 전장)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getPlayerCount(240020101) < 6) {
        pi.playPortalSE();
        pi.warp(240020101);
    } else {
        pi.playerMessage("그리프의 숲에 입장할 수 없습니다.");
    }
}
