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
 * PortalName : s4berserk_move
 * Location : 910500200 (히든스트리트 - 잊혀진 신전)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    var num = pi.getMap(910500200).getSpawnedMonstersOnMap();
    if (num <= 0) {
	pi.playPortalSE();
	pi.warp(910500200, "pt00");
	return true;
    }
    pi.playerMessage("포탈이 봉인되어 있습니다.");
    return true;
}