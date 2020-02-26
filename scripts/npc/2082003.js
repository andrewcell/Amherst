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
 * NPCID : 2082003
 * ScriptName : flyminidraco
 * NPCNameFunc : 코르바 - 은퇴한 용 조련사
 * Location : 240000110 (리프레 - 정거장)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendSimple("날개가 있다면 그 곳에 갈 수도 있겠지. 허나 그것만으로는 부족해. 검보다 날카로운 바람 사이를 날려면 단단한 비늘 역시 필요하거든. 돌아오는 방법까지 아는 하프링은 이제 나뿐이지... 그곳에 가겠다면 변신시켜 주겠네. 자네의 지금 모습이 무엇이든 이 순간만큼은 #b드래곤#k이 되는 걸세...\r\n #L0##b드래곤으로 변신하고 싶어요.#k#l");
    } else if (status == 1) {
        if (cm.getPlayerStat("LVL") < 90) {
            cm.sendOk("자네는 아직 그 곳으로 가기에는 너무 약한 모양이네. 좀 더 수련을 쌓고 다시 찾아오시게.");
            cm.dispose();
            return;
        }
        cm.warp(200090500, 0);
        cm.useItem(2210016);
        cm.dispose();
    }
}