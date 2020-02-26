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
 * PortalName : skyrom
 * Location : 260000302 (아리안트궁전 - 아리안트 궁전<복도>)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getQuestStatus(3935) == 1 && !pi.haveItem(4031574)) {
        if (pi.getPlayerCount(926000010) > 0) {
            pi.playerMessage("이미 이 안에 다른 누군가가 들어가서 스카이롬을 훔치는 중입니다.");
            return;
        }
        var map = pi.getClient().getChannelServer().getMapFactory().getMap(926000010);
        map.resetFully();
        map.shuffleReactors();
        pi.playPortalSE();
        pi.warp(926000010);
    }
}
