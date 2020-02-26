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
 * NPCID : 2040021
 * ScriptName : make_ludi3
 * NPCNameFunc : 페이 - 신발 제작자
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
var stimID = 4130001;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }
    if (status == 0) {
	var selStr = "루디브리엄 신발 상점에 잘 오셨어요~ 무엇을 도와드릴까요?#b"
	var options = new Array("촉진제가 뭐죠?","전사 신발 제작","궁수 신발 제작","마법사 신발 제작","돚거 신발 제작",
	    "촉진제로 전사 신발 제작","촉진제로 궁수 신발 제작","촉진제로 마법사 신발 제작","촉진제로 돚거 신발 제작");
	for (var i = 0; i < options.length; i++){
	    selStr += "\r\n#L" + i + "# " + options[i] + "#l";
	}
			
	cm.sendSimple(selStr);
    } else if (status == 1) {
	selectedType = selection;
	var selStr;
	var shoes = Array();
	if (selectedType > 4)
	{
	    stimulator = true;
	    selectedType -= 4;
	}
	else
	    stimulator = false;
	if (selectedType == 0){ // what is stim
	    cm.sendNext("촉진제는 여러 아이템을 만들때 첨가할 수 있는 특수한 약이죠. 몬스터에게서 구하실 수 있을거에요. 어쨌든, 촉진제는 아이템을 만들때 일정 확률로 옵션이 더 좋아질 수 있게 됩니다. 하지만 10%의 확률로 제작에 실패할 수도 있으니 신중하게 결정해주세요.")
	    cm.dispose();
	    return;
	}
	if (selectedType == 1){ //warrior shoe
	    selStr = "전사의 신발을 원하세요? 어떤 아이템을 만들어 드릴까요?#b";
		var itemSet = new Array(1072003,1072039,1072040,1072041,1072002,1072112,1072113,1072000,1072126,1072127,1072132,1072133,1072134,1072135);
		var g = 0;
	    shoes = new Array ("#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 30#b","#z"+itemSet[g++]+"##k - 전사 레벨. 30#b",
		"#z"+itemSet[g++]+"##k - 전사 레벨. 35#b","#z"+itemSet[g++]+"##k - 전사 레벨. 35#b","#z"+itemSet[g++]+"##k - 전사 레벨. 35#b",
		"#z"+itemSet[g++]+"##k - 전사 레벨. 40#b","#z"+itemSet[g++]+"##k - 전사 레벨. 40#b","#z"+itemSet[g++]+"##k - 전사 레벨. 40#b",
		"#z"+itemSet[g++]+"##k - 전사 레벨. 50#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b","#z"+itemSet[g++]+"##k - 전사 레벨. 50#b");;
	}
	else if (selectedType == 2){ //bowman shoe
	    selStr = "궁수의 신발을 원하세요? 어떤 아이템을 만들어 드릴까요?#b";
	    var itemSet = new Array(1072079,1072080,1072081,1072082,1072083,1072101,1072102,1072103,1072118,1072119,1072120,1072121,1072122,1072123,1072124,1072125);
		var g = 0;
	    shoes = new Array ("#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 30#b",
		"#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 35#b",
		"#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 40#b",
		"#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b","#z"+itemSet[g++]+"##k - 궁수 레벨. 50#b");
	}
	else if (selectedType == 3){ //magician shoe
	    selStr = "마법사의 신발을 원하세요? 어떤 아이템을 만들어 드릴까요?#b";
	    var itemSet = new Array(1072075,1072076,1072077,1072078,1072089,1072090,1072091,1072114,1072115,1072116,1072117,1072140,1072141,1072142,1072143,1072136,1072137,1072138,1072139);
		var g = 0;
	    shoes = new Array ("#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 30#b",
		"#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 35#b",
		"#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 40#b",
		"#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b","#z"+itemSet[g++]+"##k - 마법사 레벨. 50#b");
	}
	else if (selectedType == 4){ //thief shoe
	    var itemSet = new Array(1072032,1072033,1072035,1072036,1072104,1072105,1072106,1072107,1072108,1072109,1072110,1072128,1072130,1072129,1072131);
		var g = 0;
	    selStr = "도적의 신발을 원하세요? 어떤 아이템을 만들어 드릴까요?#b";
	    shoes = new Array ("#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 30#b","#z"+itemSet[g++]+"##k - 도적 레벨. 30#b",
		"#z"+itemSet[g++]+"##k - 도적 레벨. 35#b","#z"+itemSet[g++]+"##k - 도적 레벨. 35#b","#z"+itemSet[g++]+"##k - 도적 레벨. 35#b",
		"#z"+itemSet[g++]+"##k - 도적 레벨. 40#b","#z"+itemSet[g++]+"##k - 도적 레벨. 40#b","#z"+itemSet[g++]+"##k - 도적 레벨. 40#b","#z"+itemSet[g++]+"##k - 도적 레벨. 40#b",
		"#z"+itemSet[g++]+"##k - 도적 레벨. 50#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b","#z"+itemSet[g++]+"##k - 도적 레벨. 50#b");
	}
		
	if (selectedType != 0)
	{
	    for (var i = 0; i < shoes.length; i++){
		selStr += "\r\n#L" + i + "# " + shoes[i] + "#l";
	    }
	    cm.sendSimple(selStr);
	}
    } else if (status == 2) {
	selectedItem = selection;
	if (selectedType == 1){ //warrior shoe
	    var itemSet = new Array(1072003,1072039,1072040,1072041,1072002,1072112,1072113,1072000,1072126,1072127,1072132,1072133,1072134,1072135);
	    var matSet = new Array(new Array(4021003,4011001,4000021,4003000),new Array(4011002,4011001,4000021,4003000),
		new Array(4011004,4011001,4000021,4003000),new Array(4021000,4011001,4000021,4003000),new Array(4011001,4021004,4000021,4000030,4003000),new Array(4011002,4021004,4000021,4000030,4003000),new Array(4021008,4021004,4000021,4000030,4003000),
		new Array(4011003,4000021,4000030,4003000,4000103),new Array(4011005,4021007,4000030,4003000,4000104),new Array(4011002,4021007,4000030,4003000,4000105),new Array(4021008,4011001,4021003,4000030,4003000),
		new Array(4021008,4011001,4011002,4000030,4003000),new Array(4021008,4011001,4011005,4000030,4003000),new Array(4021008,4011001,4011006,4000030,4003000));
	    var matQtySet = new Array(new Array(4,2,45,15),new Array(4,2,45,15),new Array(4,2,45,15),new Array(4,2,45,15),new Array(3,1,30,20,25),new Array(3,1,30,20,25),new Array(2,1,30,20,25),
		new Array(4,100,40,30,100),new Array(4,1,40,30,100),new Array(4,1,40,30,100),new Array(1,3,6,65,45),new Array(1,3,6,65,45),new Array(1,3,6,65,45),new Array(1,3,6,65,45));
	    var costSet = new Array(20000,20000,20000,20000,22000,22000,25000,38000,38000,38000,50000,50000,50000,50000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 2){ //bowman shoe
	    var itemSet = new Array(1072079,1072080,1072081,1072082,1072083,1072101,1072102,1072103,1072118,1072119,1072120,1072121,1072122,1072123,1072124,1072125);
	    var matSet = new Array(new Array(4000021,4021000,4003000),new Array(4000021,4021005,4003000),new Array(4000021,4021003,4003000),
		new Array(4000021,4021004,4003000),new Array(4000021,4021006,4003000),new Array(4021002,4021006,4000030,4000021,4003000),new Array(4021003,4021006,4000030,4000021,4003000),new Array(4021000,4021006,4000030,4000021,4003000),
		new Array(4021000,4003000,4000030,4000106),new Array(4021006,4003000,4000030,4000107),new Array(4011003,4003000,4000030,4000108),new Array(4021002,4003000,4000030,4000099),new Array(4011001,4021006,4021008,4000030,4003000,4000033),
		new Array(4011001,4021006,4021008,4000030,4003000,4000032),new Array(4011001,4021006,4021008,4000030,4003000,4000041),new Array(4011001,4021006,4021008,4000030,4003000,4000042));
	    var matQtySet = new Array(new Array(50,2,15),new Array(50,2,15),new Array(50,2,15),new Array(50,2,15),new Array(50,2,15),
		new Array(3,1,15,30,20),new Array(3,1,15,30,20),new Array(3,1,15,30,20),new Array(4,30,45,100),new Array(4,30,45,100),new Array(5,30,45,100),new Array(5,30,45,100),
		new Array(3,3,1,60,35,80),new Array(3,3,1,60,35,150),new Array(3,3,1,60,35,100),new Array(3,3,1,60,35,250));
	    var costSet = new Array(19000,19000,19000,19000,19000,19000,20000,20000,20000,32000,32000,40000,40000,50000,50000,50000,50000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 3){ //magician shoe
	    var itemSet = new Array(1072075,1072076,1072077,1072078,1072089,1072090,1072091,1072114,1072115,1072116,1072117,1072140,1072141,1072142,1072143,1072136,1072137,1072138,1072139);
	    var matSet = new Array(new Array(4021000,4000021,4003000),new Array(4021002,4000021,4003000),new Array(4011004,4000021,4003000),new Array(4021008,4000021,4003000),new Array(4021001,4021006,4000021,4000030,4003000),new Array(4021000,4021006,4000021,4000030,4003000),
		new Array(4021008,4021006,4000021,4000030,4003000),new Array(4021000,4000030,4000110,4003000),new Array(4021005,4000030,4000111,4003000),new Array(4011006,4021007,4000030,4000100,4003000),new Array(4021008,4021007,4000030,4000112,4003000),
		new Array(4021009,4011006,4021000,4000030,4003000),new Array(4021009,4011006,4021005,4000030,4003000),new Array(4021009,4011006,4021001,4000030,4003000),new Array(4021009,4011006,4021003,4000030,4003000));
	    var matQtySet = new Array(new Array(2,50,15),new Array(2,50,15),new Array(2,50,15),new Array(1,50,15),new Array(3,1,30,15,20),new Array(3,1,30,15,20),new Array(2,1,40,25,20),new Array(4,40,100,25),new Array(4,40,100,25),new Array(2,1,40,100,25),new Array(2,1,40,100,30),
		new Array(1,3,3,60,40),new Array(1,3,3,60,40),new Array(1,3,3,60,40),new Array(1,3,3,60,40));
	    var costSet = new Array(18000,18000,18000,18000,20000,20000,22000,30000,30000,35000,40000,50000,50000,50000,50000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 4){ //thief shoe
	    var itemSet = new Array(1072032,1072033,1072035,1072036,1072104,1072105,1072106,1072107,1072108,1072109,1072110,1072128,1072130,1072129,1072131);
	    var matSet = new Array(new Array(4011000,4000021,4003000),new Array(4011001,4000021,4003000),new Array(4011004,4000021,4003000),new Array(4011006,4000021,4003000),new Array(4021000,4021004,4000021,4000030,4003000),new Array(4021003,4021004,4000021,4000030,4003000),
		new Array(4021002,4021004,4000021,4000030,4003000),new Array(4021000,4000030,4000113,4003000),new Array(4021003,4000030,4000095,4003000),new Array(4021006,4000030,4000096,4003000),new Array(4021005,4000030,4000097,4003000),new Array(4011007,4021005,4000030,4000114,4003000),
		new Array(4011007,4021000,4000030,4000115,4003000),new Array(4011007,4021003,4000030,4000109,4003000),new Array(4011007,4021001,4000030,4000036,4003000));
	    var matQtySet = new Array(new Array(3,50,15),new Array(3,50,15),new Array(2,50,15),new Array(2,50,15),new Array(3,1,30,15,20),new Array(3,1,30,15,20),new Array(3,1,30,15,20),
		new Array(5,45,100,30),new Array(4,45,100,30),new Array(4,45,100,30),new Array(4,45,100,30),new Array(2,3,50,100,35),new Array(2,3,50,100,35),new Array(2,3,50,100,35),new Array(2,3,50,80,35));
	    var costSet = new Array(19000,19000,19000,21000,20000,20000,20000,40000,32000,35000,35000,50000,50000,50000,50000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
		
	//Ludi fee is -10%, array not changed unlike 2040016 and 2040020
	cost = cost * .9;
		
	var prompt = "#t" + item + "# 아이템이 필요한가요? 그렇다면 재료는 아래와 같이 모아오셔야 합니다. 그리고 인벤토리 공간이 충분한지도 확인해 주세요.\r\n#b";

	if(stimulator)
	    prompt += "\r\n#i"+stimID+"# #t" + stimID + "# 1개";

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
		
	if (cm.getMeso() < cost) {
	    cm.sendOk("음.. 메소가 부족하신 것 같은데요?")
	    cm.dispose();
	    return;
	} else {
	    if (mats instanceof Array) {
		for (var i = 0; i < mats.length; i++) {
		    complete = cm.haveItem(mats[i], matQty[i]);
		    if (!complete) {
			break;
		    }
		}
	    } else {
		complete = cm.haveItem(mats, matQty);
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
	    } else {
		cm.gainItem(mats, -matQty);
	    }
	    cm.gainMeso(-cost);
	    if (stimulator) { //check for stimulator
		cm.gainItem(stimID, -1);
		var deleted = Math.floor(Math.random() * 10);
		if (deleted != 0) {
		    cm.gainItem(item, 1, true);
		    cm.sendOk("자, 신발이 다 만들어 졌어요. 조심하세요. 아직 뜨겁거든요.");
		} else {
		    cm.sendOk("헉! 아무래도.. 촉진제를 사용하다가 사고가 발생한 모양이에요. 아쉽지만 촉진제로 아이템 제작에 실패한 것 같네요.");
		}
	    } else { //just give basic item
		cm.gainItem(item, 1);
		cm.sendOk("자, 신발이 다 만들어 졌어요. 조심하세요. 아직 뜨겁거든요.");
	    }
	}
	cm.safeDispose();
    }
}