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
 * PortalName : summondragon
 * Location : 240040611 (히든스트리트 - 나인스피릿의 둥지)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.haveItem(4001094)) {
	pi.getMap().getReactorByName("dragonBaby").forceHitReactor(1);
//	pi.getMap().getReactorByName("dragonBaby").forceStartReactor(pi.getClient());
//	pi.getMap().getReactorByName("dragonBaby2").hitReactor(pi.getClient());
	pi.playerMessage(5, "품안에 있던 나인스피릿의 알이 신비한 빛을 내며 둥지로 돌아갔다.");
	pi.gainItem(4001094, -1);
    }
}
