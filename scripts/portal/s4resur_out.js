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
 * PortalName : s4resur_out
 * Location : 922020000 (히든스트리트 - 잊혀진 어둠)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (!pi.haveItem(4031448)) {
        if (pi.canHold(4031448)) {
            pi.gainItem(4031448, 1);
        } else {
            pi.playerMessage("인벤토리 공간이 부족합니다.");
            return false;
        }
    }
    pi.warp(220070400, 0);
    return true;
}