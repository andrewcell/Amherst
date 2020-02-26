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
 * NPCID : 2040016
 * ScriptName : make_ludi1
 * NPCNameFunc : 파이 - 제련 기술자
 * Location : 220000300 (루디브리엄 - 루디브리엄 마을)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;
var qty;
var equip;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        var selStr = "제련을 하고 싶은거야? 보석? 광석? 원하는건 말만 하라고.#b"
        var options = new Array(" 광석 제련"," 보석 제련"," 희귀 보석 제련"," 크리스탈 제련"," 재료 제작"," 화살 제작");
        for (var i = 0; i < options.length; i++){
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0){ //mineral refine
            var selStr = "어떤 종류의 광석을 제련하고 싶어?#b";
            var minerals = new Array ("청동","강철","미스릴","아다만티움","은","오리할콘","금");
            for (var i = 0; i < minerals.length; i++){
                selStr += "\r\n#L" + i + "# " + minerals[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        } else if (selectedType == 1){ //jewel refine
            var selStr = "어떤 종류의 보석을 제련하고 싶어?#b";
            var jewels = new Array ("가넷","자수정","아쿠아마린","에메랄드","오팔","사파이어","토파즈","다이아몬드","흑수정");
            for (var i = 0; i < jewels.length; i++){
                selStr += "\r\n#L" + i + "# " + jewels[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        } else if (selectedType == 2){ //rock refine
            var selStr = "희귀 보석이라.. 어떤걸 생각하고 있어?#b";
            var items = new Array ("달의 돌","별의 돌");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        } else if (selectedType == 3){ //crystal refine
            var selStr = "크리스탈 제련..? 와. 구하기 어려웠을텐데.. 무슨 크리스탈 원석을 가져왔어?#b";
            var crystals = new Array ("힘의 크리스탈","지혜의 크리스탈","민첩의 크리스탈","행운의 크리스탈","어둠의 크리스탈");
            for (var i = 0; i < crystals.length; i++){
                selStr += "\r\n#L" + i + "# " + crystals[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        } else if (selectedType == 4){ //material refine
            var selStr = "몇가지 재료를 만들어 줄 수 있어.#b";
            var materials = new Array ("나뭇가지로 가공된 나무 제작","장작으로 가공된 나무 제작","나사 15개 제작");
            for (var i = 0; i < materials.length; i++){
                selStr += "\r\n#L" + i + "# " + materials[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        } else if (selectedType == 5){ //arrow refine
            var selStr = "화살도 문제 없어. 무얼 만들고 싶어?#b";
            var arrows = new Array ("활 전용 화살","석궁 전용 화살","활 전용 청동화살","석궁 전용 청동화살","활 전용 강철화살","석궁 전용 강철화살");
            for (var i = 0; i < arrows.length; i++){
                selStr += "\r\n#L" + i + "# " + arrows[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        }
        if (equip)
            status++;
    } else if (status == 2) {
        selectedItem = selection;
        if (selectedType == 0){ //mineral refine
            var itemSet = new Array(4011000,4011001,4011002,4011003,4011004,4011005,4011006);
            var matSet = new Array(4010000,4010001,4010002,4010003,4010004,4010005,4010006);
            var matQtySet = new Array(10,10,10,10,10,10,10);
            var costSet = new Array(270,270,270,450,450,450,720);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 1){ //jewel refine
            var itemSet = new Array(4021000,4021001,4021002,4021003,4021004,4021005,4021006,4021007,4021008);
            var matSet = new Array(4020000,4020001,4020002,4020003,4020004,4020005,4020006,4020007,4020008);
            var matQtySet = new Array(10,10,10,10,10,10,10,10,10);
            var costSet = new Array (450,450,450,450,450,450,450,900,2700);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 2){ //rock refine
            var itemSet = new Array(4011007,4021009);
            var matSet = new Array(new Array(4011000,4011001,4011002,4011003,4011004,4011005,4011006), new Array(4021000,4021001,4021002,4021003,4021004,4021005,4021006,4021007,4021008));
            var matQtySet = new Array(new Array(1,1,1,1,1,1,1),new Array(1,1,1,1,1,1,1,1,1));
            var costSet = new Array(9000,13500);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 3){ //crystal refine
            var itemSet = new Array (4005000,4005001,4005002,4005003,4005004);
            var matSet = new Array(4004000,4004001,4004002,4004003,4004004);
            var matQtySet = new Array (10,10,10,10,10);
            var costSet = new Array (4500,4500,4500,4500,100000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 4){ //material refine
            var itemSet = new Array (4003001,4003001,4003000);
            var matSet = new Array(4000003,4000018,new Array (4011000,4011001));
            var matQtySet = new Array (10,5,new Array (1,1));
            var costSet = new Array (0,0,0);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
         var prompt = "#t" + item + "# 아이템을 만들어 보고 싶은거야? 몇개를 만들어 보고 싶어?";
		
        cm.sendGetNumber(prompt,1,1,100)
    } else if (status == 3) {
        if (equip) {
            selectedItem = selection;
            qty = 1;
        } else
            qty = selection;

        if (selectedType == 5){ //arrow refine
            var itemSet = new Array(2060000,2061000,2060001,2061001,2060002,2061002);
            var matSet = new Array(new Array (4003001,4003004),new Array (4003001,4003004),new Array (4011000,4003001,4003004),new Array (4011000,4003001,4003004),
                new Array (4011001,4003001,4003005),new Array (4011001,4003001,4003005));
            var matQtySet = new Array (new Array (1,1),new Array (1,1),new Array (1,3,10),new Array (1,3,10),new Array (1,5,15),new Array (1,5,15));
            var costSet = new Array (0,0,0,0,0,0);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
        var prompt = "그렇다면 ";
        if (qty == 1)
            prompt += "#t" + item + "# 아이템을 만들고 싶다는 것이로군?";
        else
            prompt += "#t" + item + "# " + qty + "개를 만들고 싶다는 것이로군?";
			
        prompt += " 그렇다면 다음과 같은 재료를 구해와야 해. 그리고 인벤토리 공간도 충분한지 확인해 봐.\r\n#b";
		
        if (mats instanceof Array){
            for(var i = 0; i < mats.length; i++){
                prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] * qty + "개";
            }
        }
        else {
            prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty * qty + "개";
        }
		
        if (cost > 0)
            prompt += "\r\n#i4031138# " + cost * qty + " 메소";
		
        cm.sendYesNo(prompt);
    } else if (status == 4) {
        var complete = false;
		
        if (cm.getMeso() < cost * qty) {
            cm.sendOk("메소가 부족한것 같은데?")
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
        if (!cm.canHold(item, qty)) {
            complete = false;
        }
        if (!complete)
            cm.sendOk("잠깐, 재료가 부족하거나 인벤토리 공간이 부족한거 아니야? 다시 한번 확인해 봐.");
        else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i] * qty);
                }
            }
            else
                cm.gainItem(mats, -matQty * qty);
					
            if (cost > 0)
                cm.gainMeso(-cost * qty);
				
            if (item >= 2060000 && item <= 2060002) //bow arrows
                cm.gainItem(item, 1000 - (item - 2060000) * 100);
            else if (item >= 2061000 && item <= 2061002) //xbow arrows
                cm.gainItem(item, 1000 - (item - 2061000) * 100);
            else if (item == 4003000)//screws
                cm.gainItem(4003000, 15 * qty);
            else
                cm.gainItem(item, qty);
            cm.sendOk("자 됐어. 다른 필요한 것이 있으면 다시 찾아와.");
        }
        cm.safeDispose();
    }
}