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
 * NPCID : 2041001
 * ScriptName : goOutWaitingRoom
 * NPCNameFunc : 에린 - 선원
 * Location : 200000122 (오르비스 - 출발하기전<루디브리엄행>)
 * Location : 220000111 (루디브리엄 - 출발하기전<오르비스행>)
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
        cm.sendYesNo("아직 배가 출발하려면 잠시 있어야 합니다만.. 지금 내려서 정거장으로 돌아가실 수도 있답니다. 어떠세요? 지금 돌아가보시겠어요? 지금 내려도 표는 환불되지 않으니 신중하게 생각해주세요.");
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("잠시 후 배가 출발할 예정이니 조금만 기다려 주세요~");
            cm.dispose();
        } else {
            cm.warp(cm.getPlayer().getMapId() - 1);
            cm.dispose();
        }
    }
}