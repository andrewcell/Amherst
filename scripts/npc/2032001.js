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
 * NPCID : 2032001
 * ScriptName : oldBook5
 * NPCNameFunc : 스피루나
 * Location : 200050001 (스카이로드 - 노파의집)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var selectedItem = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1)
        status++;
    else
        cm.dispose();
    if (status == 0 && mode == 1) {
        if (cm.getQuestStatus(3034) == 2) {
            var selStr = "착한 아이지.. 어려워하거나, 힘들어하거나.. 불평하지 않고 모든것을 받아들이지.. 그녀는 아마 나보다 훨씬 훌륭한 마녀가 될거야. 흠. 자네, 나에게 무얼 원하는가?"
				
            cm.sendYesNo(selStr);
        } else {
            cm.sendOk("지금 중요한 작업중인거 안보이는가? 썩 꺼져주게. 집중이 되질 않잖아!");
            cm.dispose();
        }
    } else if (status == 1 && mode == 1) {
        cm.sendGetNumber("호오? #t4005004#이 필요하다고? #b#p2020005##k의 부탁인건가? 흐음.. 어찌되었든, 그냥 줄 수는 없고 #b#t4004004# 10개#k와 50000메소만 준다면 #t4005004#을 주도록 하겠네.",1,1,100);
    } else if (status == 2 && mode == 1) {
        var complete = false;
        var itemID = 4005004;
        var matID = 4004004;
        var matQty = 10;
        var cost = 50000;
		
        if (cm.getMeso() < cost * selection) {
            cm.sendOk("흐음.. 재료가 부족하거나 인벤토리 공간이 없는거 아닌가? 다시 확인해봐.")
            cm.dispose();
            return;
        } else {
            complete = cm.haveItem(matID, matQty * selection);
        }
        if (!cm.canHold(itemID, selection)) {
            complete = false;
        }
        if (!complete)
            cm.sendOk("흐음.. 재료가 부족하거나 인벤토리 공간이 없는거 아닌가? 다시 확인해봐.");
        else {
            cm.gainItem(matID, -matQty * selection);
            cm.gainMeso(-cost * selection);
            cm.gainItem(itemID, selection);
            cm.sendOk("여기있네. 자, 이제 됐는가?");
        }
        cm.dispose();
    }
}
