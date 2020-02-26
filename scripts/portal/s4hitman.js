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
 * PortalName : s4hitman
 * Location : 101030104 (빅토리아로드 - 유적발굴단 캠프)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6201) == 1) {
        if (!pi.haveItem(4031452)) {
	    var map = 910200000;
            if (pi.getPlayerCount(910200000) == 0) {/*
			var marr = pi.getQuestRecord(110115);
			if (marr.getCustomData() == null) {
				marr.setCustomData("0");
			}
			var dat = parseInt(marr.getCustomData());
			if (dat + 12000000 >= java.lang.System.currentTimeMillis()) {
				pi.playerMessage("미공개된 유적은 20분에 한번씩만 입장 가능합니다.");
				return;
			} */
            pi.playPortalSE();
            pi.resetMap(map);
            pi.TimeMoveMap(map, 101030104, 1200);
            return true;
            } else {
                pi.playerMessage("이미 다른 누군가가 퀘스트에 도전중입니다.");
            }
        } else {
            pi.playerMessage("샨이 요청한 것을 끝냈습니다. 더 이상 입장할 필요가 없습니다.");
        }
    } else {
        pi.playerMessage("알 수 없는 힘으로 봉인되어 있습니다.");
    }
    return false;
}