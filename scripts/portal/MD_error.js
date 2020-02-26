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
 * PortalName : MD_error
 * Location : 261020300 (알카드노 연구소 - 연구소 C-1 구역)
 * Location : 261020301 (미니던전 - 치명적 오류)
 * 
 * @author T-Sun
 *
 */
var baseid = 261020300;
var dungeonid = 261020301;
var dungeons = 39;
var minPartySize = 1;
var maxPartySize = 6;

function enter(pi) {
    if (pi.getMapId() == baseid) {
        if (pi.getParty() != null) {
          //if (party.size() > maxPartySize || inMap < minPartySize) {
            if (pi.isLeader()) {
                for (var i = 0; i < dungeons; i++) {
                    if (pi.getPlayerCount(dungeonid + i) == 0) {
                        pi.warpParty(dungeonid + i);
                        return;
                    }
                }
            //} else {
            //    pi.playerMessage(5, "파티장이 아닙니다.");
            //}
          } else {
              pi.playerMessage(5, "파티원이 모두 모여있지 않습니다.");
          }
        } else {
            for (var i = 0; i < dungeons; i++) {
                if (pi.getPlayerCount(dungeonid + i) == 0) {
                    pi.warp(dungeonid + i);
                    return;
                }
            }
          //}
        }
        pi.playerMessage(5, "모든 미니던전 인스턴스가 사용중입니다. 나중에 다시 시도하세요.");
    } else {
        pi.playPortalSE();
        pi.warp(baseid, "MD00");
    }
}
