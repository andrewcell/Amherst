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
 * PortalName : Pianus
 * Location : 230040410 (아쿠아로드 - 위험한 동굴)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
//    if (pi.canBossEnterTime("pianus")) {
        if (pi.getPlayerCount(230040420) > 10) {
            pi.playerMessage("이 방은 이미 피아누스와의 전투를 위한 최대 인원수 만큼 가득 찼습니다.");
            return;
        }
        pi.playPortalSE();
        pi.warp(230040420);
//        pi.setBossRepeatTime("pianus", 60 * 12);
//    } else {
//        pi.playerMessage("피아누스의 동굴은 12시간에 한번씩만 입장할 수 있습니다.");
//    }
}
