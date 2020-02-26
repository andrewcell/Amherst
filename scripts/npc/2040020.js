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
 * NPCID : 2040020
 * ScriptName : make_ludi2
 * NPCNameFunc : 지로큰 - 장갑 제작자
 * Location : 220000303 (루디브리엄마을 - 지로큰과 페이의 집)
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
var stimulator = false;
var stimID = 4130000;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
        var selStr = "안녕하세요, 루디브리엄 장갑 상점이에요. 무엇을 도와드릴까요?#b"
        var options = new Array("촉진제가 뭐죠?","전사 장갑 제작","궁수 장갑 제작","마법사 장갑 제작","도적 장갑 제작",
            "촉진제로 전사 장갑 제작","촉진제로 궁수 장갑 제작","촉진제로 마법사 장갑 제작","촉진제로 돚거 장갑 제작");
        for (var i = 0; i < options.length; i++){
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
			
        cm.sendSimple(selStr);
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType > 4)
            stimulator = true;
        else
            stimulator = false;
        if (selectedType == 0) { //What's a stim?
            cm.sendNext("촉진제는 여러 아이템을 만들때 첨가할 수 있는 특수한 약이죠. 몬스터에게서 구하실 수 있을거에요. 어쨌든, 촉진제는 아이템을 만들때 일정 확률로 옵션이 더 좋아질 수 있게 됩니다. 하지만 10%의 확률로 제작에 실패할 수도 있으니 신중하게 결정해주세요.")
            cm.safeDispose();
        }
        else if (selectedType == 1){ //warrior glove
            var itemSet = new Array(1082007,1082008,1082023,1082009);
			var g = 0;
            var selStr = "전사 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var items = new Array ("#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 35#b","#z"+itemSet[g++]+"##k - 전사 레벨. 40#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 2){ //bowman glove
            var itemSet = new Array(1082048,1082068,1082071,1082084);
			var g = 0;
            var selStr = "궁수 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var items = new Array ("#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 3){ //magician glove
            var itemSet = new Array(1082051,1082054,1082062,1082081);
			var g = 0;
            var selStr = "마법사 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var items = new Array ("#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 4){ //thief glove
            var itemSet = new Array(1082042,1082046,1082075,1082065);
			var g = 0;
            var selStr = "돚거 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var gloves = new Array ("#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 35#b","#z"+itemSet[g++]+"##k - 도적 레벨. 40#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b");
            for (var i = 0; i < gloves.length; i++){
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 5){ //warrior glove w/ Stim
            var itemSet = new Array(1082005,1082006,1082035,1082036,1082024,1082025,1082010,1082011);
			var g = 0;
            var selStr = "촉진제를 통한 전사 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var crystals = new Array ("#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 35#b","#z"+itemSet[g++]+"##k - 전사 레벨. 35#b",
                "#z"+itemSet[g++]+"##k - 전사 레벨. 40#b","#z"+itemSet[g++]+"##k - 전사 레벨. 40#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b");
            for (var i = 0; i < crystals.length; i++){
                selStr += "\r\n#L" + i + "# " + crystals[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 6){ //bowman glove w/ stim
            var itemSet = new Array (1082049,1082050,1082069,1082070,1082072,1082073,1082085,1082083);
			var g = 0;
            var selStr = "촉진제를 통한 궁수 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var crystals = new Array ("#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b");
            for (var i = 0; i < crystals.length; i++){
                selStr += "\r\n#L" + i + "# " + crystals[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 7){ //magician glove w/ stim
            var itemSet = new Array(1082052,1082053,1082055,1082056,1082063,1082064,1082082,1082080);
			var g = 0;
            var selStr = "촉진제를 통한 마법사 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var items = new Array ("#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b",
                "#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
        else if (selectedType == 8){ //thief glove w/ stim
            var itemSet = new Array(1082043,1082044,1082047,1082045,1082076,1082074,1082067,1082066);
			var g = 0;
            var selStr = "촉진제를 통한 돚거 장갑이 필요하신가요? 어떤 아이템이 필요하세요?#b";
            var gloves = new Array ("#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 35#b","#z"+itemSet[g++]+"##k - 도적 레벨. 35#b","#z"+itemSet[g++]+"##k - 도적 레벨. 40#b",
                "#z"+itemSet[g++]+"##k - 도적 레벨. 40#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b");
            for (var i = 0; i < gloves.length; i++){
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
    } else if (status == 2) {
        selectedItem = selection;
        if (selectedType == 1){ //warrior glove
            var itemSet = new Array(1082007,1082008,1082023,1082009);
            var matSet = new Array(new Array(4011000,4011001,4003000),new Array(4000021,4011001,4003000),new Array(4000021,4011001,4003000),new Array(4011001,4021007,4000030,4003000));
            var matQtySet = new Array(new Array(3,2,15),new Array(30,4,15),new Array(50,5,40),new Array(3,2,30,45));
            var costSet = new Array(18000,27000,36000,45000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 2){ //bowman glove
            var itemSet = new Array(1082048,1082068,1082071,1082084);
            var matSet = new Array(new Array(4000021,4011006,4021001),new Array(4011000,4011001,4000021,4003000),new Array(4011001,4021000,4021002,4000021,4003000),new Array(4011004,4011006,4021002,4000030,4003000));
            var matQtySet = new Array(new Array(50,2,1),new Array(1,3,60,15),new Array(3,1,3,80,25),new Array(3,1,2,40,35));
            var costSet = new Array(18000,27000,36000,45000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 3){ //magician glove
            var itemSet = new Array(1082051,1082054,1082062,1082081);
            var matSet = new Array(new Array(4000021,4021006,4021000),new Array(4000021,4011006,4011001,4021000),new Array(4000021,4021000,4021006,4003000),new Array(4021000,4011006,4000030,4003000));
            var matQtySet = new Array(new Array(60,1,2),new Array(70,1,3,2),new Array(80,3,3,30),new Array(3,2,35,40));
            var costSet = new Array(22500,27000,36000,45000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 4){ //thief glove
            var itemSet = new Array(1082042,1082046,1082075,1082065);
            var matSet = new Array(new Array(4011001,4000021,4003000),new Array(4011001,4011000,4000021,4003000),new Array(4021000,4000101,4000021,4003000),new Array(4021005,4021008,4000030,4003000));
            var matQtySet = new Array(new Array(2,50,10),new Array(3,1,60,15),new Array(3,100,80,30),new Array(3,1,40,30));
            var costSet = new Array(22500,27000,36000,45000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 5){ //warrior glove w/stim
            var itemSet = new Array(1082005,1082006,1082035,1082036,1082024,1082025,1082010,1082011);
            var matSet = new Array(new Array(1082007,4011001),new Array(1082007,4011005),new Array(1082008,4021006),new Array(1082008,4021008),new Array(1082023,4011003),new Array(1082023,4021008),
                new Array(1082009,4011002),new Array(1082009,4011006));
            var matQtySet = new Array (new Array(1,1),new Array(1,2),new Array(1,3),new Array(1,1),new Array(1,4),new Array(1,2),new Array(1,5),new Array(1,4));
            var costSet = new Array (18000,22500,27000,36000,40500,45000,49500,54000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 6){ //bowman glove w/stim
            var itemSet = new Array (1082049,1082050,1082069,1082070,1082072,1082073,1082085,1082083);
            var matSet = new Array(new Array(1082048,4021003),new Array(1082048,4021008),new Array(1082068,4011002),new Array(1082068,4011006),new Array(1082071,4011006),new Array(1082071,4021008),new Array(1082084,4011000,4021000),new Array(1082084,4011006,4021008));
            var matQtySet = new Array (new Array(1,3),new Array(1,1),new Array(1,4),new Array(1,2),new Array(1,4),new Array(1,2),new Array(1,1,5),new Array(1,2,2));
            var costSet = new Array (13500,18000,19800,22500,27000,36000,49500,54000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 7){ //magician glove w/ stim
            var itemSet = new Array(1082052,1082053,1082055,1082056,1082063,1082064,1082082,1082080);
            var matSet = new Array(new Array(1082051,4021005),new Array(1082051,4021008),new Array(1082054,4021005),new Array(1082054,4021008),new Array(1082062,4021002),new Array(1082062,4021008),
                new Array(1082081,4021002),new Array(1082081,4021008));
            var matQtySet = new Array(new Array(1,3),new Array(1,1),new Array(1,3),new Array(1,1),new Array(1,4),new Array(1,2),new Array(1,5),new Array(1,3));
            var costSet = new Array (31500,36000,36000,40500,40500,45000,49500,54000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 8){ //thief glove w/ stim
            var itemSet = new Array(1082043,1082044,1082047,1082045,1082076,1082074,1082067,1082066);
            var matSet = new Array(new Array(1082042,4011004),new Array(1082042,4011006),new Array(1082046,4011005),new Array(1082046,4011006),new Array(1082075,4011006),new Array(1082075,4021008),new Array(1082065,4021000),new Array(1082065,4011006,4021008));
            var matQtySet = new Array(new Array(1,2),new Array(1,1),new Array(1,3),new Array(1,2),new Array(1,4),new Array(1,2),new Array(1,5),new Array(1,2,1));
            var costSet = new Array (13500,18000,19800,22500,36000,45000,49500,54000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
	var prompt = "#t" + item + "# 아이템이 필요한가요? 그렇다면 재료는 아래와 같이 모아오셔야 합니다. 그리고 인벤토리 공간이 충분한지도 확인해 주세요.\r\n#b";

	if (mats instanceof Array){
	    for(var i = 0; i < mats.length; i++){
		prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] + "개";
	    }
	}
	else {
	    prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty + "개";
	}
		
	if (cost > 0)
	    prompt += "\r\n#i4031138# " + cost + " 메소";
		
	cm.sendYesNo(prompt);
    } else if (status == 3) {
        var complete = false;
		qty = 1;
		
        if (cm.getMeso() < cost * qty) {
            cm.sendOk("음.. 메소가 부족하신 것 같은데요?")
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
			
        if (stimulator){ //check for stimulator
            if (!cm.haveItem(stimID)) {
                complete = false;
            }
        }
			
        if (!cm.canHold(item, 1)) {
            complete = false;
        }
        if (!complete)
            cm.sendOk("죄송하지만 재료를 올바르게 가져오신 것 같지 않네요. 혹은 인벤토리 공간이 부족한건 아니신가요?");
        else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i]);
                }
            }
            else
                cm.gainItem(mats, -matQty);
					
            cm.gainMeso(-cost);
            if (stimulator){ //check for stimulator
                cm.gainItem(stimID, -1);
                var deleted = Math.floor(Math.random() * 10);
                if (deleted != 0) {
                    cm.gainItem(item, 1, true);
                    cm.sendOk("자, 장갑이 다 만들어 졌어요. 조심하세요. 아직 뜨겁거든요.");
                } else {
                    cm.sendOk("헉! 아무래도.. 촉진제를 사용하다가 사고가 발생한 모양이에요. 아쉽지만 촉진제로 아이템 제작에 실패한 것 같네요.");
                }
            } else { //just give basic item
                cm.gainItem(item, 1);
                cm.sendOk("자, 장갑이 다 만들어 졌어요. 조심하세요. 아직 뜨겁거든요.");
            }
        }
        cm.safeDispose();
    }
}