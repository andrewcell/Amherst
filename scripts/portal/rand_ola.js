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
 * PortalName : rand_ola
 * Location : 109030001 (히든스트리트 - 올라~올라~<1단계>)
 * Location : 109030002 (히든스트리트 - 올라~올라~<2단계>)
 * Location : 109030003 (히든스트리트 - 올라~올라~<3단계>)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getEvent("OlaOla").isRunning() && pi.getEvent("OlaOla").isCharCorrect(pi.getPortal().getName(), pi.getMapId())) {
	pi.warp(pi.getMapId() == 109030003 ? 109050000 : (pi.getMapId() + 1), 0);
    } else {
	pi.warpS(pi.getMapId(), 0);
    }
}
