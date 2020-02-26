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
 * PortalName : undodraco
 * Location : 200090500 (비행중 - 시간의 신전 가는 길)
 * Location : 200090510 (비행중 - 미나르숲 가는 길)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getPlayer().getMapId() == 200090500) {
        pi.warp(240000110);
    } else {
        pi.warp(270000100, 2);
    }
    pi.cancelItem(2210006);
}
