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
 * PortalName : secretgate3_open
 * Location : 990000640 (샤레니안 - 수로의 미로)
 * 
 * @author T-Sun
 *
 */
/*
Stage 4: Mark of Evil Door - Guild Quest

@Author Lerk
*/

function enter(pi) {
    if (pi.getMap().getReactorByName("secretgate3").getState() == 1) {
	pi.playPortalSE();
        pi.warp(990000641, 1);
    } else {
        pi.playerMessage("문이 굳게 닫혀있습니다.");
    }
}
