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
 * NPCID : 9020002
 * ScriptName : party1_out
 * NPCNameFunc : 네일리아
 * Location : 103000890 (히든스트리트 - 첫번째동행<나가는곳>)
 * Location : 103000802 (히든스트리트 - 첫번째동행<3관문>)
 * Location : 103000803 (히든스트리트 - 첫번째동행<4관문>)
 * Location : 103000800 (히든스트리트 - 첫번째동행<1관문>)
 * Location : 103000801 (히든스트리트 - 첫번째동행<2관문>)
 * Location : 103000804 (히든스트리트 - 첫번째동행<마지막관문>)
 * Location : 103000805 (히든스트리트 - 첫번째동행<보너스>)
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
        if (cm.getMapId() == 103000890) {
            cm.removeAll(4001008);
            cm.removeAll(4001007);
            cm.warp(103000000);
            cm.dispose();
        } else {
            cm.sendYesNo("정말 이곳에서 나가시겠습니까? 만일 이곳에서 나가시게 된다면, 처음부터 다시 도전해야 합니다. 당신이 파티장이라면 전부 나가지게 됩니다. 정말 나가시고 싶으세요?");
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("여유를 두고 파티원들과 함께 문제를 해결해 보시기 바래요.");
            cm.dispose();
        } else {
            if (cm.isLeader()) {
                cm.warpParty_Instanced(103000890);
                cm.dispose();
            } else {
                cm.warp(103000890);
                cm.dispose();
            }
        }
    }
}