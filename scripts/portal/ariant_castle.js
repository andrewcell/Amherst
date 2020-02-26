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
 * PortalName : ariant_castle
 * Location : 260000300 (아리안트 - 아리안트궁전)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.haveItem(4031582)) {
//        pi.gainItem(4031582, -1);
        pi.playPortalSE();
        pi.warp(260000301, "out00");
    } else {
        pi.playerMessage(5, "이곳에 출입하려면 궁전 출입 자격증이 필요합니다.");
    }
}
