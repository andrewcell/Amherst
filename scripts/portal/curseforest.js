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
 * PortalName : curseforest
 * Location : 100040105 (히든스트리트 - 사악한기운의숲1)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.isQuestActive(2224) || pi.isQuestActive(2226)) {
        var time = pi.getCurrentDate().substring(8, 10);
        if ((time >= 17 && time <= 24) || time >= 0 && time <= 7) {
            pi.playPortalSE();
            pi.playerMessage("검은 소용돌이와 함께 저주받은 숲으로 들어섰다.");
            pi.warp(910100000, 1);
            return;
        }
    } else if (pi.getQuestStatus(2227) == 2) {
        var time = pi.getCurrentDate().substring(8, 10);
        if ((time >= 17 && time <= 24) || time >= 0 && time <= 7) {
            pi.playPortalSE();
            pi.playerMessage("검은 소용돌이와 함께 저주받은 숲으로 들어섰다.");
            pi.warp(910100001, 1);
            return;
        }
    }
    pi.playerMessage("무언가 알 수 없는 힘으로 가로막혀 있다.");

}
