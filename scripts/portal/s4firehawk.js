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
 * PortalName : s4firehawk
 * Location : 211042200 (폐광 - 시련의동굴3)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6240) == 1 || pi.getQuestStatus(6241) == 1) {
        if (!pi.haveItem(4001113)) {
            if (pi.getPlayerCount(921100200) == 0) {
                pi.playPortalSE();
                pi.resetMap(921100200);
                pi.TimeMoveMap(921100200, 211042200, 300);
                return true;
            } else {
                pi.playerMessage("이미 다른 누군가가 퀘스트에 도전중입니다.");
            }
        } else {
            pi.playerMessage("이미 피닉스의 알을 갖고 있어 입장할 수 없습니다.");
        }
    } else if (pi.getQuestStatus(6240) == 2 && pi.getQuestStatus(6241) == 0) {
        if (!pi.haveItem(4001113)) {
            pi.playPortalSE();
            pi.resetMap(921100200);
            pi.TimeMoveMap(921100200, 211042200, 300);
        } else {
            pi.playerMessage("이미 피닉스의 알을 갖고 있어 입장할 수 없습니다." );
        }
    } else {
        pi.playerMessage("알 수 없는 힘으로 봉인되어 있습니다.");
    }
    return false;
}