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
 * PortalName : dragonNest
 * Location : 240040610 (히든스트리트 - 위험한 둥지 밑)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.haveItem(4001094)) {
//        if (pi.getQuestStatus(3706) > 0) {
            if (pi.getPlayerCount(240040611) == 0) {
                pi.removeNpc(240040611, 2081008);
                pi.resetMap(240040611);
                pi.playPortalSE();
                pi.TimeMoveMap(240040611, 240040610, 300);
//                pi.warp(240040611, "sp");
            } else {
                pi.playerMessage(5, "이미 이 안에 들어가 누군가가 퀘스트를 완수하는 중입니다. 잠시 후 다시 시도해 주세요.");
            }
//        } else {
//            pi.playerMessage(5, "You do not have the quest started. Please try again later.");
//        }
    } else {
        pi.playerMessage(5, "이 안에 들어가기 위해서는 <나인 스피릿의 알> 이 필요하다.");
    }
}
