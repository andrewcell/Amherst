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
 * NPCID : 2043000
 * ScriptName : s4time
 * NPCNameFunc : 파풀라투스
 * Location : 922020300 (히든스트리트 - 시계탑의 근원)
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
        if (cm.isQuestActive(6363)) {
            status = 1;
            cm.sendYesNo("그럼 당신의 시간을 되돌릴 준비를 할게요. 이야아압~");
        } else {
            cm.sendYesNo("정말 나가고 싶어요?");
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.warp(220080000, 5);
        }
        cm.dispose();
    } else if (status == 2) {
        cm.warp(220080000, 5);
        cm.forceStartQuest(6364, "2");
        cm.showQuestClear(6363);
        cm.dispose();
    }
}