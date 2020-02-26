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
 * PortalName : hontale_Bopen
 * Location : 240050101 (생명의동굴 - 첫번째 미로방)
 * Location : 240050102 (생명의동굴 - 두번째 미로방)
 * Location : 240050103 (생명의동굴 - 세번째 미로방)
 * Location : 240050104 (생명의동굴 - 네번째 미로방)
 * Location : 240050105 (생명의동굴 - 다섯번째 미로방)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var eim = pi.getPlayer().getEventInstance();
    var progress = eim.getProperty("stage1progress");
    if (progress == null) {
        eim.setProperty("stage1progress", "0");
        progress = "0";
    }
    progress = parseInt(progress);
    if (pi.getPlayer().getMapId() == 240050101) { //첫번째 미로방
        if (progress == 0) {
            pi.playerMessage(5, "알 수 없는 힘으로 포탈이 막혀있어 이동할 수 없습니다.");
        } else {
            pi.playPortalSE();
            pi.warp(240050102);
        }
    }
    if (pi.getPlayer().getMapId() == 240050102) { //두번째 미로방
        if (progress <= 1) {
            pi.playerMessage(5, "알 수 없는 힘으로 포탈이 막혀있어 이동할 수 없습니다.");
        } else {
            pi.playPortalSE();
            pi.warp(240050103);
        }
    }
    if (pi.getPlayer().getMapId() == 240050103) { //세번째 미로방
        if (progress <= 2) {
            pi.playerMessage(5, "알 수 없는 힘으로 포탈이 막혀있어 이동할 수 없습니다.");
        } else {
            pi.playPortalSE();
            pi.warp(240050104);
        }
    }
    if (pi.getPlayer().getMapId() == 240050104) { //네번째 미로방
        if (progress <= 3) {
            pi.playerMessage(5, "알 수 없는 힘으로 포탈이 막혀있어 이동할 수 없습니다.");
        } else {
            pi.playPortalSE();
            pi.warp(240050105);
        }
    }
    
    if (pi.getPlayer().getMapId() == 240050105) { //다섯번째 미로방
        if (pi.haveItem(4001092, 1)) {
            pi.gainItem(4001092, -1);
            eim.broadcastPlayerMsg(5, "붉은 열쇠의 힘으로 이동되었습니다.");
            pi.playPortalSE();
            pi.warpParty(240050100);
            eim.setProperty("stage1progress", progress + 1);
        } else {
            pi.playerMessage(5, "알 수 없는 힘으로 포탈이 막혀있어 이동할 수 없습니다.");
        }
    }
}