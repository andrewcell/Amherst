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
 * NPCID : 2083005
 * ScriptName : s4holycharge
 * NPCNameFunc : 생명의 샘
 * Location : 240050400 (생명의동굴 - 혼테일의 동굴 입구)
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
        if (cm.getQuestStatus(6280) == 1) {
            if (cm.haveItem(4031454, 1)) {
                if (!cm.haveItem(4031455, 1)) {
                    if (cm.canHold(4031455)) {
                        cm.gainItem(4031454, -1);
                        cm.gainItem(4031455, 1);
                        cm.dispose();
                    } else {
                        cm.sendOk("인벤토리 공간이 부족하여 성수를 채집할 수 없습니다.");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("이미 #b#t4031455##k를 갖고 있습니다.");
                    cm.dispose();
                }
            }
        } else {
            cm.dispose();
        }
    }
}