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
 * PortalName : hontale_boss2
 * Location : 240060100 (생명의동굴 - 시험의 동굴2)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var map = pi.getPlayer().getMap();
    if (map.getReactorById(2408003).getState() <= 0) {
        pi.mapMessage(6, "동굴 깊은 곳에서 무시무시한 생명체가 나타납니다.");
        var pos = map.getReactorById(2408003).getPosition();
        pi.spawnMonster(8810025, 1, pos);
        map.getReactorById(2408003).forceHitReactor(0);
        map.getReactorById(2408003).forceHitReactor(1);
    }
}
