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
 * ActionName : davyNPC0
 * ReactorInfo : 투명리액터:우양소환
 * Location : 925100500 (히든스트리트 - 해적선장의 위엄)
 * 
 * @author T-Sun
 *
 */

function act() {
    rm.mapMessage(5, "해적왕이 죽고 도라지 왕이 풀려났습니다!");
    rm.spawnNpc(2094001);
}