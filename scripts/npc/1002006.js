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
 * NPCID : 1002006
 * ScriptName : bookPrize
 * NPCNameFunc : 체프
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * 
 * @author T-Sun
 *
 */

var status = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.haveItem(4031048, 1)) {
            cm.sendYesNo("어? 그건 #b#t4031048##k 맞지? 음.. 그것을 나에게 주지 않겠어? 보상은 섭섭치 않게 해주지.");
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        var rand = Packages.server.Randomizer.rand(0, 6);
        var nItemId = 0;
        var nItemNum = 0;
        if (rand == 0) {
            nItemId = 2000004;
            nItemNum = 100;
        } else 
        if (rand == 1) {
            nItemId = 4011006;
            nItemNum = 10;
        } else 
        if (rand == 2) {
            nItemId = 4011000;
            nItemNum = 10;
        } else 
        if (rand == 3) {
            nItemId = 4011005;
            nItemNum = 10;
        } else 
        if (rand == 4) {
            nItemId = 4021005;
            nItemNum = 10;
        } else 
        if (rand == 5) {
            nItemId = 4021001;
            nItemNum = 10;
        } else if (rand == 6) {
            nItemId = 4021007;
            nItemNum = 10;
        }
        if (cm.canHold(2000004) && cm.canHold(4021007) && cm.haveItem(4031048, 1)) {
            cm.gainItem(4031048, -1);
            cm.gainItem(nItemId, nItemNum);
            cm.sendOk("자, #b#t"+nItemId+"# "+nItemNum+"#k개를 줄게. 고마워~");
        } else {
            cm.sendOk("인벤토리 공간이 충분한지, 혹은 비밀의 주문서는 제대로 갖고 있는거야?");
        }
        cm.dispose();
    }
}