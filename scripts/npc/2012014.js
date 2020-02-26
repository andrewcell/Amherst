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
 * NPCID : 2012014
 * ScriptName : ossyria3_1
 * NPCNameFunc : 오르비스 마법석
 * Location : 200080200 (오르비스탑 - 오르비스탑<20층>)
 * 
 * @author T-Sun
 *
 */
var status = -1;
function action(mode, type, selection) {
    status++;
    if (status == 0) {
        if(cm.haveItem(4001019)) {
            cm.sendYesNo("#b#t4001019##k를 사용하여 #b#m200082100##k으로 이동하시겠습니까?");
        } else {
            cm.sendOk("엘나스로 이동할 수 있을 것 같은 마법석이다. 하지만 #b#t4001019##k가 없으면 활성화 시킬 수 없을 것 같다.");
            cm.dispose();
        }
    } else {
        if (mode > 0) {
            cm.gainItem(4001019, -1);
            cm.warp(200082100);
        }
        cm.dispose();
    }
}
