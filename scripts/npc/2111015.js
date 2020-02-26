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
 * NPCID : 2111015
 * ScriptName : alcadno_potion
 * NPCNameFunc : 러셀론의 책상
 * Location : 261020200 (알카드노 연구소 - 연구소 B-1 구역)
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
        if (cm.getDistance() > 7000) {
            cm.sendOk("조사하기에는 너무 멀다.")
            cm.dispose();
            return;
        }
        if (cm.isQuestActive(3314) && !cm.haveItem(2022198, 1)) {
            cm.sendOk("책상 위에는 작은 알약들이 여러 개 놓여 있다. 한 개만 가져 가자...");
            cm.gainItem(2022198, 1);
            cm.dispose();
        } else {
            cm.sendOk("책상 위에는 작은 알약들이 여러 개 놓여 있다.");
            cm.dispose();
        }
    }
}