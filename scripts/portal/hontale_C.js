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
 * PortalName : hontale_C
 * Location : 240050200 (생명의동굴 - 선택의 동굴)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var state = pi.getMap().getReactorById(2408001).getState();
    if (!pi.isLeader()) {
        pi.playerMessage(5, "파티장이 동굴 선택을 결정할 수 있습니다.");
        return;
    }
    if (state == 1) {
        pi.partyMessage(6, "빛의 동굴로 이동됩니다.");
        pi.warpParty(240050300); //빛의 동굴
    } else if (state == 3) {
        pi.partyMessage(6, "어둠의 동굴로 이동됩니다.");
        pi.warpParty(240050310); //어둠의 동굴
    } else {
        pi.playerMessage(5, "아직 동굴이 선택되지 않았습니다.");
    }
}