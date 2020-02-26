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
 * PortalName : ariant_Agit
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.getQuestStatus(3930) == 2 && pi.getQuestStatus(3933) == 2 && pi.getQuestStatus(3936) == 2) {
        pi.playPortalSE();
        pi.playerMessage("문 안쪽에서 잠금쇠가 열리는 소리가 들린다. 문이 조금 열렸다.");
        pi.warp(260000201, 1);
    } else {
        pi.playerMessage("이 문은 잠겨 있는 것 같다.")
    }
}
