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
 * PortalName : enter_lpq
 * 제작 : 이터널썬
 * 루디브리엄 각 스테이지 포탈 체크
 *
 */

function enter(pi) {
    var mapid = pi.getPlayer().getMapId();
    var eim = pi.getPlayer().getEventInstance();
    if (eim.getProperty("stage") == null) {
        eim.setProperty("stage", "1");
    }
    if (mapid >= 922010100 && mapid <= 922010900) {
        //1단계
        var stage = parseInt(eim.getProperty("stage"));
        var curstage = mapid % 922010000 / 100;
        if (stage > curstage) {
            pi.playPortalSE();
            pi.warp(pi.getPortal().getTargetMapId(), pi.getPortal().getTarget());
            if (curstage + 1 < stage) {
                pi.getClient().getSession().write(Packages.tools.MaplePacketCreator.environmentChange("gate", 2));
            }
        } else {
            pi.playerMessage("지금은 이 포탈을 사용할 수 없습니다.");
        }
    }
}
