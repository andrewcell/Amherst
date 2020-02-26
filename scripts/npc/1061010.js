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
 * NPCID : 1061010
 * ScriptName : 3jobExit
 * NPCNameFunc : 빛나는 수정
 * Location : 108010101 (히든스트리트 - 차원의세계)
 * Location : 108010201 (히든스트리트 - 차원의세계)
 * Location : 108010301 (히든스트리트 - 차원의세계)
 * Location : 108010401 (히든스트리트 - 차원의세계)
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
        cm.sendYesNo("정말 이곳에서 나가시겠습니까?");
    } else if (status == 1) {
        if (selection == 1) {
            var map = cm.getPlayer().getMapId();
            if (map == 108010301) {
                cm.warp(105040305); //궁수
            } else if (map == 108010201) {
                cm.warp(100040106); //법사
            } else if (map == 108010101) {
                cm.warp(105070001); //전사
            } else if (map == 108010401) {
                cm.warp(107000402); //돚거
            } else if (map == 108010501) {
                cm.warp(105070200); //돚거
            }
            cm.dispose();
        } else {
            cm.dispose();
        }
    }
}