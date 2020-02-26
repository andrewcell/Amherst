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
 * PortalName : ghostgate_open
 * Location : 990000700 (샤레니안 - 샤렌 3세의 무덤)
 * 
 * @author T-Sun
 *
 */
/*
Sharen III's Grave Exit - Guild Quest

@Author Lerk
*/

function enter(pi) {
    if (pi.getMap().getReactorByName("ghostgate").getState() == 1 || (pi.getPlayer().getEventInstance() != null && pi.getPlayer().getEventInstance().getProperty("stage4clear") != null && pi.getPlayer().getEventInstance().getProperty("stage4clear").equals("true"))) {
	pi.playPortalSE();
        pi.warp(990000800, 0);
    } else {
	pi.playerMessage("결계로 가로막혀 있어 지나갈 수 없습니다.");
    }
}