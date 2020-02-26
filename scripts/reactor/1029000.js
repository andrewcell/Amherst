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
 * ActionName : scaScript0
 * ReactorInfo : 엘리니아 꽃 리엑터
 * Location : 101040001 (히든스트리트 - 와일드보어의 땅)
 * 
 * @author T-Sun
 *
 */

function act() {
    var map = rm.getPlayer().getMap();
    //
    for (var i = 0; i < map.countMonsterById(3230300); ++i) {
        map.killMonster(3230300);
    }
    for (var i = 0; i < map.countMonsterById(3230301); ++i) {
        map.killMonster(3230301);
    }
}
