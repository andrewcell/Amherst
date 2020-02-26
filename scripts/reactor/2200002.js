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
 * ActionName : go922010201
 * ReactorInfo : 922010201로 추방
 * Location : 922010200 (히든스트리트 - 버려진 탑<2단계>)
 * 
 * @author T-Sun
 *
 */

function act() {
    rm.partyMessage("함정에 빠져 어딘가로 이동됩니다.");
    rm.warpMap(922010201, 0); //do not use warpParty -> 맵 어디에 있던지 전부 이동시키기 때문..
}
