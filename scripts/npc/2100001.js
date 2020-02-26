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
 * NPCID : 2100001
 * ScriptName : make_ariant1
 * NPCNameFunc : 무하마드 - 아이템 제작자
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */

importPackage(Packages.client);

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;
var qty;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.sendNext("흐음? 그런가? 마음이 바뀌면 다시 찾아오게나.");
            cm.dispose();
            return;
        }
        if (mode == 0 && status >= 1){
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if(status == 0)
            cm.sendYesNo("광석이나 보석 제련에 관심이 있는가? 특히 이곳의 특산물인 리튬은 나밖에 제련할 수 없는 광석이라네.");
        if (status == 1 && mode == 1) {
            var selStr = "좋아, 자네. 마음에 드는군. 어떤 광석이나 보석을 제련해줄까? #b";
            var options = new Array("광석 제련","보석 제련","크리스탈 제련");
            for (var i = 0; i < options.length; i++){
                selStr += "\r\n#L" + i + "# " + options[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (status == 2 && mode == 1) {
            selectedType = selection;
            if (selectedType == 0){ //mineral refine
                var selStr = "어떤 광석을 제련하고 싶은가?#b";
                var minerals = new Array ("청동","강철","미스릴","아다만티움","은","오리할콘","금","리튬");
                for (var i = 0; i < minerals.length; i++){
                    selStr += "\r\n#L" + i + "# " + minerals[i] + "#l";
                }
                cm.sendSimple(selStr);
            }
            else if (selectedType == 1){ //jewel refine
                var selStr = "어떤 보석을 제련하고 싶은가?#b";
                var jewels = new Array ("가넷","자수정","아쿠아마린","에메랄드","오팔","사파이어","토파즈","다이아몬드","흑수정");
                for (var i = 0; i < jewels.length; i++){
                    selStr += "\r\n#L" + i + "# " + jewels[i] + "#l";
                }
                cm.sendSimple(selStr);
            }
            else if (selectedType == 2){ //Crystal refine
                var selStr = "크리스탈? 그 희귀한 물건 말인가? 그것의 원석들을 모아온건가? 자네도 대단하구만. 자 어떤 크리스탈을 제련해줬으면 좋겠나? #b";
                var crystals = new Array("힘의 크리스탈","지혜의 크리스탈","민첩성의 크리스탈","행운의 크리스탈");
                for (var i = 0; i < crystals.length; i++){
                    selStr += "\r\n#L" + i + "# " + crystals[i] + "#l";
                }
                cm.sendSimple(selStr);
            }
        }
        else if (status == 3 && mode == 1) {
            selectedItem = selection;
			
            if (selectedType == 0){ //mineral refine
                var itemSet = new Array(4011000,4011001,4011002,4011003,4011004,4011005,4011006,4011008);
                var matSet = new Array(4010000,4010001,4010002,4010003,4010004,4010005,4010006,4010007);
                var matQtySet = new Array(10,10,10,10,10,10,10,10);
                var costSet = new Array(270,270,270,450,450,450,720,270);
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
            else if (selectedType == 2){ //Crystal refine
                var itemSet = new Array(4005000,4005001,4005002,4005003);
                var matSet = new Array(4004000,4004001,4004002,4004003);
                var matQtySet = new Array(10,10,10,10);
                var costSet = new Array (4500,4500,4500,4500);
                item = itemSet[selectedItem];
                mats = matSet[selectedItem];
                matQty = matQtySet[selectedItem];
                cost = costSet[selectedItem];
            }			
            var prompt = "#t" + item + "#.. 이것을 제련하기 위해선 아래와 같은 재료가 필요하다네. 얼마나 만들고 싶은가?";
		
            if (mats instanceof Array){
                for(var i = 0; i < mats.length; i++){
                    prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] + "개 ";
                }
            }
            else {
                prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty + "개 ";
            }
		
            if (cost > 0)
                prompt += "\r\n#i4031138# " + cost + " 메소";
			
            cm.sendGetNumber(prompt,1,1,100)
        }
        else if (status == 4 && mode == 1) {
            var complete = false;
            qty = selection;
		
            if (cm.getMeso() < cost * qty) {
                cm.sendOk("흐음.. 수수료가 부족한 것 같구만.")
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
                cm.sendNext("인벤토리 공간이 부족한건 아닌지, 혹은 부족한 재료가 있는건 아닌지 확인해보게나.");
            else {
                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++){
                        cm.gainItem(mats[i], -matQty[i] * qty);
                    }
                }
                else
                    cm.gainItem(mats, -matQty * qty);
					
                cm.gainMeso(-cost * qty);
                cm.gainItem(item,qty);
                cm.sendOk("자, 다 됐다네. 훌륭한 예술 작품이지. 다른 물건이 필요하다면 언제든지 다시 나를 찾게나.");
            }
            cm.dispose();
        }
    }
}