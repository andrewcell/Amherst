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
 * NPCID : 1094003
 * ScriptName : nautil_Abel1
 * NPCNameFunc : 풀 숲
 * Location : 120000000 (빅토리아로드 - 노틸러스 선착장)
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
        if (cm.isQuestActive(2186)) {
            var rand = cm.rand(0,100);
            if (rand < 30 && !cm.haveItem(4031853, 1)) {
                cm.gainItem(4031853, 1);
                cm.sendOk("아벨의 안경을 찾았다.")
            } else if (rand < 60 && !cm.haveItem(4031854, 1)) {
                cm.gainItem(4031854, 1);
                cm.sendOk("안경을 찾았다. 하지만 아벨의 안경이 아닌듯 하다. 아벨의 안경은 검은 뿔테라는데...")
            } else if (rand <= 100 && !cm.haveItem(4031855, 1)) {
                cm.gainItem(4031855, 1);
                cm.sendOk("안경을 찾았다. 하지만 아벨의 안경이 아닌듯 하다. 아벨의 안경은 검은 뿔테라는데...")
            }
        }
        cm.dispose();
    }
}