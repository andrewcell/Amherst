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
 * PortalName : MD_golem
 * Location : 105040304 (던전 - 슬리피던전4)
 * Location : 105040320 (미니던전 - 무너진 골렘의 성터)
 * 
 * @author T-Sun
 *
 */

var baseid = 105040304;
var dungeonid = 105040320;
var dungeons = 39;
var party = cm.getParty().getMembers();
var inMap = 0;

function enter(pi) {
    if (pi.getMapId() == baseid) {
        if (pi.getParty() != null) {
            if (pi.isLeader()) {
              if (party.size() = inMap) {
                for (var i = 0; i < dungeons; i++) {
                    if (pi.getPlayerCount(dungeonid + i) == 0) {
                        pi.warpParty(dungeonid + i);
                        return;
                    }
                }
              } else {
                  pi.playerMessage(5, "파티원이 모두 모여있지 않습니다.");
              }
            } else {
                pi.playerMessage(5, "파티장이 아닙니다.");
            }
        } else {
            for (var i = 0; i < dungeons; i++) {
                if (pi.getPlayerCount(dungeonid + i) == 0) {
                    pi.warp(dungeonid + i);
                    return;
                }
            }
        }
        pi.playerMessage(5, "모든 미니던전 인스턴스가 사용중입니다. 나중에 다시 시도하세요.");
    } else {
        pi.playPortalSE();
        pi.warp(baseid, "MD00");
    }
}
