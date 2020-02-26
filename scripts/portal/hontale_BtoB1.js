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
 * PortalName : hontale_BtoB1
 * Location : 240050100 (생명의동굴 - 미로방)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.haveItem(4001087, 1)) {
        pi.warp(240050101);
        pi.playerMessage(5, "첫 번째 미로방의 수정의 힘에 의해 어딘가로 이동됩니다.");
        pi.gainItem(4001087, -1);
    } else {
        pi.playerMessage(5, "미로방에 들어가는데 필요한 열쇠가 없습니다.");
    }
}
