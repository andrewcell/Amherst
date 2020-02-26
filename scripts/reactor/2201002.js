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
 * ActionName : ludiMob2
 * ReactorInfo : 루디브리엄 범용리엑터
 * Location : 922010700 (히든스트리트 - 버려진 탑<7단계>)
 * 
 * @author T-Sun
 *
 */

function act() {
    rm.mapMessage("어딘가에 차원의 롬바드가 나타났습니다!");
    rm.spawnMob(9300010, 1, 42, -326);
}
