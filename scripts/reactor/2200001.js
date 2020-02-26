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
 * ActionName : ludiPotal0
 * ReactorInfo : 922000020,922000021,22020300
 * Location : 220030200 (루디브리엄성 - 장난감공장<메인공정2>)
 * Location : 220030300 (루디브리엄성 - 장난감공장<2공정>4구역)
 * Location : 220030400 (루디브리엄성 - 장난감공장<2공정>5구역)
 * 
 * @author T-Sun
 *
 */

function act() {
    rm.playerMessage("어딘가로 이동됩니다.");
    var r = java.lang.Math.random();
    if (r < 0.3) {
	rm.warp (922000020);
    } else if (r < 0.8) {
        rm.warp (922000021);
    } else {
	rm.warp(220020300);
    }
}
