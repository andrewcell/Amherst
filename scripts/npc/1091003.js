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
 * NPCID : 1091003
 * ScriptName : refine_nautillus
 * NPCNameFunc : 세릴 - 아이템 제작
 * Location : 120000200 (노틸러스호 - 중앙 복도)
 * 
 * @author T-Sun
 *
 */


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
	var selStr = "무기나 장갑을 만들고 싶다구? 그렇다면 제대로 찾아온 것 같군. 해적 세월 20년 동안 갈고 닦은 나의 장인 실력을 보여주지.#b";
	var options = new Array("너클 제작","건 제작","장갑 제작");
	for (var i = 0; i < options.length; i++){
	    selStr += "\r\n#L" + i + "# " + options[i] + "#l";
	}
			
	cm.sendSimple(selStr);
    }
    else if (status == 1 && mode == 1) {
	selectedType = selection;
	if (selectedType == 0){ //Making a Knuckler
	    var selStr = "만들 너클을 골라봐.#b";
	    var knucklers = new Array("#t1482001# (레벨 제한: 15, 해적)", "#t1482002# (레벨 제한: 20, 해적)", "#t1482003# (레벨 제한: 25, 해적)", "#t1482004# (레벨 제한: 30, 해적)", "#t1482005# (레벨 제한: 35, 해적)", "#t1482006# (레벨 제한: 40, 해적)", "#t1482007# (레벨 제한: 50, 해적)");
	    for (var i = 0; i < knucklers.length; i++){
		selStr += "\r\n#L" + i + "# " + knucklers[i] + "#l";
	    }
	    equip = true;
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 1){ //Making a Gun
	    var selStr = "만들 건을 골라봐.#b";
	    var guns = new Array("#t1492001# (레벨 제한: 15, 해적)", "#t1492002# (레벨 제한: 20, 해적)", "#t1492003# (레벨 제한: 25, 해적)", "#t1492004# (레벨 제한: 30, 해적)", "#t1492005# (레벨 제한: 35, 해적)", "#t1492006# (레벨 제한: 40, 해적)", "#t1492007# (레벨 제한: 50, 해적)");
	    for (var i = 0; i < guns.length; i++){
		selStr += "\r\n#L" + i + "# " + guns[i] + "#l";
	    }
	    equip = true;
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 2){ //Making a pair of pirate gloves
	    var selStr = "만들 장갑을 골라봐.#b";
            //1082180, 1082183, 1082186, 1082189, 1082192, 1082195, 1082198, 1082201
	    var gloves = new Array ("#t1082180#","#t1082183#","#t1082186#","#t1082189#","#t1082192#","#t1082195#","#t1082198#","#t1082201#");
	    for (var i = 0; i < gloves.length; i++){
		selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
	    }
	    equip = true;
	    cm.sendSimple(selStr);
	}
	if (equip)
	    status++;
    }
    else if (status == 3 && mode == 1) {
	if (equip)
	{
	    selectedItem = selection;
	    qty = 1;
	}
	else
	    qty = selection;

	if (selectedType == 0){ //Making a Knuckler
	    var itemSet = new Array(1482001, 1482002, 1482003, 1482004, 1482005, 1482006, 1482007);
	    var matSet = new Array(4000021, new Array(4011001,4011000,4000021,4003000), new Array(4011000,4011001,4003000), new Array(4011000,4011001,4000021,4003000), new Array(4011000,4011001,4000021,4003000), new Array(4011000,4011001,4021000,4000021,4003000), new Array(4000039,4011000,4011001,4000030,4000021,4003000));
	    var matQtySet = new Array(20, new Array(1,1,10,5), new Array(2,1,10), new Array(1,1,30,10), new Array(2,2,30,20), new Array(1,1,2,50,20), new Array(150,1,2,20,20,20));
	    var costSet = new Array(1000,2000,5000,15000,30000,50000,100000);
	    var levelLimitSet = new Array(15,20,25,30,35,40,50);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	    levelLimit = levelLimitSet[selectedItem];
	}
	else if (selectedType == 1){ //Making a Gun
	    var itemSet = new Array(1492001, 1492002, 1492003, 1492004, 1492005, 1492006, 1492007);
	    var matSet = new Array(new Array(4011000,4003000,4003001), new Array(4011000,4003000,4003001,4000021), new Array(4011000,4003000), new Array(4011001,4000021,4003000), new Array(4011006,4011001,4000021,4003000), new Array(4011004,4011001,4000021,4003000), new Array(4011006,4011004,4011001,4000030,4003000));
	    var matQtySet = new Array(new Array(1,5,1), new Array(1,10,5,10), new Array(2,10), new Array(2,10,10), new Array(10,2,5,10), new Array(1,2,10,20), new Array(1,2,4,30,30));
	    var costSet = new Array (1000,2000,5000,15000,30000,50000,100000);
	    var levelLimitSet = new Array(15,20,25,30,35,40,50);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	    levelLimit = levelLimitSet[selectedItem];
	}
	else if (selectedType == 2){ //Making a pair of pirate gloves
	    var itemSet = new Array(1082180, 1082183, 1082186, 1082189, 1082192, 1082195, 1082198, 1082201);
	    var matSet = new Array(new Array(4000021,4021003),4000021,new Array(4011000,4000021),new Array(4021006,4000021,4003000),new Array(4011000,4000021,4003000),new Array(4000021,4011000,4011001,4003000),new Array(4011000,4000021,4000030,4003000),new Array(4011007,4021008,4021007,4000030,4003000));
	    var matQtySet = new Array(new Array(15,1),35,new Array(2,20),new Array(2,50,10),new Array(3,60,15),new Array(80,3,3,25),new Array(3,20,40,30),new Array(1,1,1,50,50));
	    var costSet = new Array(1000,8000,15000,25000,30000,40000,50000,70000);
	    var levelLimitSet = new Array(15,20,25,30,35,40,50,60);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	    levelLimit = levelLimitSet[selectedItem];
	}
			
	prompt = "#t" + item + "# 제작에 필요한 아이템들이야. 레벨 제한은 " + levelLimit + " 이니까 착용 가능한지 확인해보라구.\r\n";
		
	if (mats instanceof Array){
	    for(var i = 0; i < mats.length; i++){
		prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "#" + matQty[i] * qty + " 개 ";
	    }
	}
	else {
	    prompt += "\r\n#i"+mats+"# #t" + mats + "#" + matQty * qty + " 개 ";
	}
		
	if (cost > 0)
	    prompt += "\r\n#i4031138# " + cost * qty + " 메소";
		
	cm.sendYesNo(prompt);
    }
    else if (status == 4 && mode == 1) {
	var pass = false;
		
	if (cm.getMeso() < cost * qty) {
	    cm.sendOk("메소는 제대로 갖고 있는거야?")
	    cm.dispose();
	    return;
	} else {
	    if (mats instanceof Array) {
		for (var i = 0; i < mats.length; i++) {
		    pass = cm.haveItem(mats[i], matQty[i] * qty);
		    if (!pass) {
			break;
		    }
		}
	    } else {
		pass = cm.haveItem(mats, matQty * qty);
	    }	
        }
			
	if (pass == false)
	    cm.sendNext("재료가 부족한 것 같은데? 다시 확인해봐.");
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
				
	    if (item == 4003000)//screws
		cm.gainItem(4003000, 15 * qty);
	    else
		cm.gainItem(item, qty);
	    cm.sendOk("자, 다 됐어. 근사하지 않아?");
	}
	cm.dispose();
    }
}