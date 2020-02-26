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
 * NPCID : 2040047
 * ScriptName : party2_out
 * NPCNameFunc : 병정 앤더슨
 * Location : 922010000 (히든스트리트 - 버려진 탑<모험의 끝>)
 * Location : 922010100 (히든스트리트 - 버려진 탑<1단계>)
 * Location : 922010500 (히든스트리트 - 버려진 탑<5단계>)
 * Location : 922010600 (히든스트리트 - 버려진 탑<6단계>)
 * Location : 922010400 (히든스트리트 - 버려진 탑<4단계>)
 * Location : 922010300 (히든스트리트 - 버려진 탑<3단계>)
 * Location : 922010200 (히든스트리트 - 버려진 탑<2단계>)
 * Location : 922010900 (히든스트리트 - 시공의 균열)
 * Location : 922010800 (히든스트리트 - 버려진 탑<8단계>)
 * Location : 922010700 (히든스트리트 - 버려진 탑<7단계>)
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
        if (cm.getPlayer().getMapId() == 922010000) {
            cm.removeAll(4001022);
            cm.removeAll(4001023);
            cm.warp(221024500, 0);
            cm.dispose();
            return;
        }
        cm.sendYesNo("이곳에서 나가시면 처음부터 다시 클리어에 도전해야 합니다. 정말 나가시고 싶으세요? 만약 파티장이라면 전부 나가지게 된답니다.")
    } else if (status == 1) {
	if (selection == 0) {
		cm.sendOk("그런가요? 천천히 다시 도전해 보세요.");
		cm.dispose();
		return;
	}
        if (cm.isLeader()) {
            cm.warpParty_Instanced(922010000);
        } else {
            cm.warp(922010000);
        }
        cm.dispose();
    }
}