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
 * NPCID : 2022004
 * ScriptName : s4common1_out
 * NPCNameFunc : 타일러스
 * Location : 921100301 (히든스트리트 - 타일러스 호위 완료)
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
        if (cm.getQuestStatus(6192) == 1) {
            cm.sendNext("나를 호위해 줘서 고맙네. 일단 이곳에서 나간 후에 다시 이야기 하도록 하지.");
        } else {
            cm.warp(211000001, 0);
            cm.dispose();
        }
    } else if (status == 1) {
        if (!cm.haveItem(4031495)) {
            if (cm.canHold(4031495)) {
                cm.gainItem(4031495, 1);
                cm.warp(211000001, 0);
                cm.dispose();
            } else {
                cm.sendOk("인벤토리 공간이 부족한 것 같군. 기타 인벤토리 탭을 비운 후 다시 나에게 말을 걸게.");
                cm.safeDispose();
            }
        } else {
            cm.warp(211000001, 0);
            cm.dispose();
        }
    }
}