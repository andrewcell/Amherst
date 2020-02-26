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
 * PortalName : q2073
 * Location : 100030000 (빅토리아로드 - 헤네시스동쪽숲)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(2073) == 1) {
        if (pi.getPlayerCount(900000000) == 0) {
            pi.TimeMoveMap(900000000, 100030000, 600);
        } else {
            pi.playerMessage(5, "이미 누군가가 이 안에서 퀘스트를 진행하는 중입니다.");
        }
    } else {
        pi.playerMessage(5,"알 수 없는 힘으로 가로막혀 있어 입장할 수 없다.");
    }
}