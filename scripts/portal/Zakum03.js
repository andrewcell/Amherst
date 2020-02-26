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
 * PortalName : Zakum03
 * Location : 280010000 (아도비스의임무1 - 알려지지않은폐광)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    var eim = pi.getPlayer().getEventInstance();
    if (eim != null) {
        if (eim.getProperty("clear") == null) {
            pi.playerMessage("아직 임무를 완료하지 못하여 다음 맵으로 이동할 수 없습니다.");
        } else {
            if (eim.getProperty("paper") == null) {
                if (pi.canHold(4031061, 1)) {
                    pi.gainExp(12000);
                    pi.gainItem(4031061, 1);
                    pi.playPortalSE();
                    pi.warp(280090000, 1);
                } else {
                    pi.playerMessage("인벤토리에 공간이 부족하여 다음 맵으로 이동할 수 없습니다.");
                }
            } else {
                if (pi.canHold(4031061, 1) && pi.canHold(2030007, 5)) {
                    pi.gainExp(20000);
                    pi.gainItem(2030007, 5);
                    pi.gainItem(4031061, 1);
                    pi.playPortalSE();
                    pi.warp(280090000, 1);
                } else {
                    pi.playerMessage("인벤토리에 공간이 부족하여 다음 맵으로 이동할 수 없습니다.");
                }
            }
        }
    } else {
        pi.playPortalSE();
        pi.warp(280090000);
    }
}
