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
 * NPCID : 2040045
 * ScriptName : party2_play
 * NPCNameFunc : 핑크 벌룬
 * Location : 922011000 (히든스트리트 - 버려진 탑<보너스>)
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
        cm.sendOk("보너스 맵에 오신것을 환영합니다. #b알리샤르#k를 쓰러뜨리셨다니 정말 놀랍군요. 시간이 별로 없으니 본론만 간단히 해볼까요? 이곳에는 여러 가지 상자가 있습니다. 파티원 전원이 제한 시간안에 상자를 부수고 안에 있는 물건을 입수하시면 됩니다. 운이 좋으면 정말 좋은 아이템이 나올수도 있으니 열심히 할 만한 가치가 있을 거에요. 그럼 힘내 주세요!");
        cm.safeDispose();
    }
}