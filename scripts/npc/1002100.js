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
 * NPCID : 1002100
 * ScriptName : jane
 * NPCNameFunc : 제인
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var amount = -1;
var item;
var cost;
var rec;
var recName;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status <= 2 && mode == 0) {
        cm.dispose();
        return;
    } else if (status >= 3 && mode == 0) {
        cm.sendNext("아직 재료는 많이 남아 있답니다. 천천히 생각해보시고 다시 말을 걸어주세요.");
        cm.dispose();
        return;
    }
    if (mode == 1)
        status++;
    else
        status--;
    if (status == 0) {
        if (cm.getQuestStatus(2013) == 2) {
            cm.sendNext("당신이군요. 당신 덕분에 많은 것들을 해낼 수 있었어요. 여행자님을 위해서 물약을 만들어 드리겠어요.");
        } else {
            if (cm.getQuestStatus(2010) == 2)
                cm.sendNext("아직 제 물약을 구매하시기엔 충분히 강하지 않으신 것 같아요 ...");
            else
                cm.sendOk("제 꿈은 이곳 저곳 여행을 다니는 거랍니다. 여행자님처럼 말이죠... 하지만 저희 아버진 위험하다며 계속 허락해 주시지를 않아요...");
            cm.dispose();
        }
    } else if (status == 1) {
        var selStr = "어떤 아이템을 구매하시고 싶으세요? #b";
        var items = new Array(2000002, 2022003, 2022000, 2001000);
        var costs = new Array(310, 1060, 1600, 3120);
        for (var i = 0; i < items.length; i++) {
            selStr += "\r\n#L" + i + "##z" + items[i] + "# (가격 : " + costs[i] + " 메소)#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 2) {
        var itemSet = new Array(2000002, 2022003, 2022000, 2001000);
        var costSet = new Array(310, 1060, 1600, 3120);
        var recHpMp = new Array(300, 1000, 800, 1000);
        var recNames = new Array("HP", "HP", "MP","HP 와 MP");
        item = itemSet[selection];
        cost = costSet[selection];
        rec = recHpMp[selection];
        recName = recNames[selection];
        cm.sendGetNumber("#b#t" + item + "##k 아이템을 구매하고 싶으세요? #t" + item + "# 아이템은 " + rec + " " + recName + "를 회복시켜 줍니다. 몇개를 구매하시고 싶으세요?", 1, 1, 100);
    } else if (status == 3) {
        cm.sendYesNo("#b#t" + item + "##k 아이템을 #r" + selection + "#k 개 구매하시고 싶으세요? 개당 가격은 " + cost + " 메소 이며, 총 가격은 " + cost * selection + " 메소 입니다.");
        amount = selection;
    } else if (status == 4) {
        if (cm.getMeso() < cost * amount || !cm.canHold(item)) {
            cm.sendNext("메소가 부족하신건 아닌가요? 혹은 인벤토리 공간이 충분한지 확인해주세요.");
        } else {
            cm.gainMeso(-cost * amount);
            cm.gainItem(item, amount);
            cm.sendNext("와주셔서 고마워요. 더 도와드릴 일이 있다면 언제든지 다시 찾아와주세요.");
        }
        cm.dispose();
    }
}