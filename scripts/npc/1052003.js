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
 * NPCID : 1052003
 * ScriptName : refine_kerning2
 * NPCNameFunc : 크리스 - 원석 가공 기술자
 * Location : 103000006 (빅토리아로드 - 커닝시티수리점)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;
var qty;
var equip;
var last_use; //last item is a use item

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1)
        status++;
    else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        var selStr = "제가 바로 이 수리점의 주인이지요! 핫핫핫. 약간의 수수료만 주신다면 원하시는 서비스를 제공해 드리도록 하지요.#b"
        var options = new Array("광석 제련","보석 제련","아이언 호그의 강철 발굽을 가져왔어요..","아대 합성");
        for (var i = 0; i < options.length; i++){
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
			
        cm.sendSimple(selStr);
    }
    else if (status == 1) {
        selectedType = selection;
        if (selectedType == 0){ //mineral refine
            var selStr = "어떤 광석을 제련하고 싶으신가요?#b";
            var minerals = new Array ("청동","강철","미스릴","아다만티움","은","오리할콘","금");
            for (var i = 0; i < minerals.length; i++){
                selStr += "\r\n#L" + i + "# " + minerals[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        }
        else if (selectedType == 1){ //jewel refine
            var selStr = "어떤 보석을 제련하고 싶으신가요?#b";
            var jewels = new Array ("가넷","자수정","아쿠아마린","에메랄드","오팔","사파이어","토파즈","다이아몬드","흑수정");
            for (var i = 0; i < jewels.length; i++){
                selStr += "\r\n#L" + i + "# " + jewels[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        }
        else if (selectedType == 2){ //foot refine
            var selStr = "아이언 호그의 철발굽에는 슬픈 전설이.. 아니라 숨겨진 잠재된 힘이 있다는걸 아는사람은 극히 드물지요. 그것을 제게 주시지 않겠어요? 그렇다면 보상은 섭섭치 않게 드리지요.";
            equip = false;
            cm.sendYesNo(selStr);
        }
        else if (selectedType == 3){ //claw refine
            var selStr = "아대 합성이요? 어떤걸 원하세요?#b";
            var claws = new Array ("블러드 기간틱#k - 도적 레벨. 60#b","사파이어 기간틱#k - 도적 레벨. 60#b","다크 기간틱#k - 도적 레벨. 60#b");
            for (var i = 0; i < claws.length; i++){
                selStr += "\r\n#L" + i + "# " + claws[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        }
        if (equip)
            status++;
    }
    else if (status == 2 && mode == 1) {
        selectedItem = selection;
        if (selectedType == 0){ //mineral refine
            var itemSet = new Array(4011000,4011001,4011002,4011003,4011004,4011005,4011006);
            var matSet = new Array(4010000,4010001,4010002,4010003,4010004,4010005,4010006);
            var matQtySet = new Array(10,10,10,10,10,10,10);
            var costSet = new Array(300,300,300,500,500,500,800);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 1){ //jewel refine
            var itemSet = new Array(4021000,4021001,4021002,4021003,4021004,4021005,4021006,4021007,4021008);
            var matSet = new Array(4020000,4020001,4020002,4020003,4020004,4020005,4020006,4020007,4020008);
            var matQtySet = new Array(10,10,10,10,10,10,10,10,10);
            var costSet = new Array (500,500,500,500,500,500,500,1000,3000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 2){ //special refine
            var itemSet = new Array(4011001,1);
            var matSet = new Array(4000039,1);
            var matQtySet = new Array (100,1);
            var costSet = new Array (1000,1)
            item = itemSet[0];
            mats = matSet[0];
            matQty = matQtySet[0];
            cost = costSet[0];
        }
		
        var prompt = "#t" + item + "# 아이템을 원하시나요? 얼마나 만들어보시고 싶으신가요?";
		
        cm.sendGetNumber(prompt,1,1,100)
    }
	
    else if (status == 3) {
        if (equip)
        {
            selectedItem = selection;
            qty = 1;
        }
        else
            qty = selection;
			
        last_use = false;
		
        if (selectedType == 3){ //claw refine
            var itemSet = new Array (1472023,1472024,1472025);
            var matSet = new Array(new Array (1472022,4011007,4021000,2012000),new Array (1472022,4011007,4021005,2012002),new Array (1472022,4011007,4021008,4000046));
            var matQtySet = new Array (new Array (1,1,8,10),new Array (1,1,8,10),new Array (1,1,3,5));
            var costSet = new Array (80000,80000,100000)
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
            if (selectedItem != 2)
                last_use = true;
        }
		
        var prompt = "흐음. ";
        if (qty == 1)
            prompt += "#t" + item + "# 1개";
        else
            prompt += "#t" + item + "# " + qty + "개";
			
        prompt += "를 제작하고 싶으신거군요? 좋아요. 약간의 수수료와 재료만 갖고오신다면 충분히 만들어 드릴 수 있답니다. 재료는 아래와 같아요. 아, 그리고 인벤토리 공간이 충분한지도 확인해 주세요.#b";
		
        if (mats instanceof Array){
            for (var i = 0; i < mats.length; i++) {
                prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] * qty + "개";
            }
        } else {
            prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty * qty + "개";
        }
		
        if (cost > 0) {
            prompt += "\r\n#i4031138# " + cost * qty + " 메소";
        }
        cm.sendYesNo(prompt);
    } else if (status == 4) {
        var complete = false;
		
        if (cm.getMeso() < cost * qty) {
            cm.sendOk("서비스를 받을 메소가 부족하시네요.")
            cm.dispose();
            return;
        } else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++) {
                    complete = cm.haveItem(mats[i], matQty[i] * qty);
                    if (!complete) {
                        break;
                    }
                }
            } else {
                complete = cm.haveItem(mats, matQty * qty);
            }	
        }
		
        if (!cm.canHold(item)) {
            complete = false;
        }
        if (!complete)
            cm.sendOk("재료가 부족하시거나 인벤토리 공간이 부족한건 아니신지 확인해 보시겠어요?");
        else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i] * qty);
                }
            } else {
                cm.gainItem(mats, -matQty * qty);
            }
            cm.gainMeso(-cost * qty);
            cm.gainItem(item, qty);
            cm.sendNext("휴, 다 되었답니다. 여기 완성품이에요.");
        }
        cm.dispose();
    }
}