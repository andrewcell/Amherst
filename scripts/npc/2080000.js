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
 * NPCID : 2080000
 * ScriptName : minar_weapon
 * NPCNameFunc : 모스 - 무기 합성 기술자
 * Location : 240000000 (미나르숲 - 리프레)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var stimulator = false;
var bustedDagger = false;
var item;
var mats;
var matQty;
var cost;
var stimID;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {		
    if (mode == 1) {
	status++;
    } else {
	cm.dispose();
	return;
    }
    if (status == 0) {
	if (cm.haveItem(4001079)) {
	    bustedDagger = true;
	    cm.sendNext("#b코니언의 단도#k가 필요하다는 거지? #b코니언의 단도#k를 만드려면 망가진 단도를 수리하는 방법밖에 없어. 망가진 단도를 수리하려면 다음과 같은 재료가 필요하지. 만들어 보겠어?\r\n#b#i4001079# #t4001079# 1개\r\n#i4011001# #t4011001# 1개\r\n#i4011002# #t4011002# 1개");
	} else {
	    var selStr = "용의 힘은 아주 강력하지. 원한다면 그 힘을 네 무기에 담아줄게. 하지만 그 힘을 무기가 과연 버틸 수 있을지..#b";
	    var options = new Array("촉진제가 뭐죠?","전사 무기 제작","궁수 무기 제작","마법사 무기 제작","돚거 무기 제작",
		"촉진제로 전사 무기 제작","촉진제로 궁수 무기 제작","촉진제로 마법사 무기 제작","촉진제로 돚거 무기 제작");
	    for (var i = 0; i < options.length; i++){
		selStr += "\r\n#L" + i + "# " + options[i] + "#l";
	    }
	    cm.sendSimple(selStr);
	}

    } else if (status == 1) {
	if (bustedDagger) {
	    if (cm.haveItem(4011001) && cm.haveItem(4011002) && cm.haveItem(4001079) && cm.canHold(4001078)) {
		cm.gainItem(4011001, -1);
		cm.gainItem(4011002, -1);
		cm.gainItem(4001079, -1);
		cm.gainItem(4001078, 1);
	    } else {
		cm.sendOk("아이템은 제대로 모아 온거야? 그렇지 않은 것 같은데? 혹은 인벤토리 공간이 부족한건 아닌지 확인해 봐.");
	    }
	    cm.dispose();
	} else {
	    selectedType = selection;
	    if (selectedType > 4) {
		stimulator = true;
		selectedType -= 4;
	    }
	    else
		stimulator = false;
	    if (selectedType == 0) { //What's a stim?
		cm.sendNext("촉진제는 여러 아이템을 만들때 첨가할 수 있는 특수한 약이지. 몬스터에게서 구할 수 있을거야. 어쨌든, 촉진제는 아이템을 만들때 일정 확률로 옵션이 더 좋아질 수 있게 되지. 하지만 10%의 확률로 제작에 실패할 수도 있으니 신중하게 결정해야하지.")
		cm.dispose();
	    }
	    else if (selectedType == 1){ //warrior weapon
	    var itemSet = new Array(1302059,1312031,1322052,1402036,1412026,1422028,1432038,1442045);
		var g = 0;
		var selStr = "좋아. 드래곤의 힘을 담을 무기를 골라봐.#b";
		var weapon = new Array ("#z"+itemSet[g++]+"##k - 레벨. 110 한손검#b","#z"+itemSet[g++]+"##k - 레벨. 110 한손도끼#b","#z"+itemSet[g++]+"##k - 레벨. 110 한손둔기#b","#z"+itemSet[g++]+"##k - 레벨. 110 두손검#b","#z"+itemSet[g++]+"##k - 레벨. 110 두손도끼#b","#z"+itemSet[g++]+"##k - 레벨. 110 두손둔기#b",
		    "#z"+itemSet[g++]+"##k - 레벨. 110 창#b","#z"+itemSet[g++]+"##k - 레벨. 110 폴암#b");
		for (var i = 0; i < weapon.length; i++){
		    selStr += "\r\n#L" + i + "# " + weapon[i] + "#l";
		}
		cm.sendSimple(selStr);
	    }
	    else if (selectedType == 2){ //bowman weapon
	    var itemSet = new Array(1452044,1462039);
		var g = 0;
		var selStr = "좋아. 드래곤의 힘을 담을 무기를 골라봐.#b";
		var weapon = new Array ("#z"+itemSet[g++]+"##k - 레벨. 110 활#b","#z"+itemSet[g++]+"##k - 레벨. 110 석궁#b");
		for (var i = 0; i < weapon.length; i++){
		    selStr += "\r\n#L" + i + "# " + weapon[i] + "#l";
		}
		cm.sendSimple(selStr);
	    }
	    else if (selectedType == 3){ //magician weapon
	    var itemSet = new Array(1372032,1382036);
		var g = 0;
		var selStr = "좋아. 드래곤의 힘을 담을 무기를 골라봐.#b";
		var weapon = new Array ("#z"+itemSet[g++]+"##k - 레벨. 108 완드#b","#z"+itemSet[g++]+"##k - 레벨. 110 스태프#b");
		for (var i = 0; i < weapon.length; i++){
		    selStr += "\r\n#L" + i + "# " + weapon[i] + "#l";
		}
		cm.sendSimple(selStr);
	    }
	    else if (selectedType == 4){ //thief weapon
	    var itemSet = new Array(1332049,1332050,1472051);
		var g = 0;
		var selStr = "좋아. 드래곤의 힘을 담을 무기를 골라봐.#b";
		var weapon = new Array ("#z"+itemSet[g++]+"##k - 레벨. 110 STR 단검#b","#z"+itemSet[g++]+"##k - 레벨. 110 LUK 단검#b","#z"+itemSet[g++]+"##k - 레벨. 110 아대#b");
		for (var i = 0; i < weapon.length; i++){
		    selStr += "\r\n#L" + i + "# " + weapon[i] + "#l";
		}
		cm.sendSimple(selStr);
	    }
	}
    } else if (status == 2) {
	selectedItem = selection;
	if (selectedType == 1){ //warrior weapon
	    var itemSet = new Array(1302059,1312031,1322052,1402036,1412026,1422028,1432038,1442045);
	    var matSet = new Array(new Array(1302056,4000244,4000245,4005000),new Array(1312030,4000244,4000245,4005000),new Array(1322045,4000244,4000245,4005000),new Array(1402035,4000244,4000245,4005000),
		new Array(1412021,4000244,4000245,4005000),new Array(1422027,4000244,4000245,4005000),new Array(1432030,4000244,4000245,4005000),new Array(1442044,4000244,4000245,4005000));
	    var matQtySet = new Array(new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8),new Array(1,20,25,8));
	    var costSet = new Array(120000,120000,120000,120000,120000,120000,120000,120000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 2){ //bowman weapon
	    var itemSet = new Array(1452044,1462039);
	    var matSet = new Array(new Array(1452019,4000244,4000245,4005000,4005002),new Array(1462015,4000244,4000245,4005000,4005002));
	    var matQtySet = new Array(new Array(1,20,25,3,5),new Array(1,20,25,5,3));
	    var costSet = new Array(120000,120000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 3){ //magician weapon
	    var itemSet = new Array(1372032,1382036);
	    var matSet = new Array(new Array(1372010,4000244,4000245,4005001,4005003),new Array(1382035,4000244,4000245,4005001,4005003));
	    var matQtySet = new Array(new Array(1,20,25,6,2),new Array(1,20,25,6,2));
	    var costSet = new Array(120000,120000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 4){ //thief weapon
	    var itemSet = new Array(1332049,1332050,1472051);
	    var matSet = new Array(new Array(1332051,4000244,4000245,4005000,4005002),new Array(1332052,4000244,4000245,4005002,4005003),new Array(1472053,4000244,4000245,4005002,4005003));
	    var matQtySet = new Array(new Array(1,20,25,5,3),new Array(1,20,25,3,5),new Array(1,20,25,2,6));
	    var costSet = new Array(120000,120000,120000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 5){ //pirate weapon
	    var itemSet = new Array(1482013,1492013);
	    var matSet = new Array(new Array(1482012,4000244,4000245,4005000,4005002),new Array(1492012,4000244,4000245,4005000,4005002));
	    var matQtySet = new Array(new Array(1,20,25,5,3),new Array(1,20,25,3,5));
	    var costSet = new Array(120000,120000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
		
	var prompt = "흐음. 필요한 아이템이 #t" + item + "# 인거야? 재료는 다음과 같아. 인벤토리 공간이 충분한지도 확인해 보도록 해.#b";
		
	if (stimulator){
	    stimID = getStimID(item);
	    prompt += "\r\n#i"+stimID+"# #t" + stimID + "# 1개";
	}

	if (mats instanceof Array){
	    for(var i = 0; i < mats.length; i++){
		prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] + "개";
	    }
	} else {
	    prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty + "개";
	}
		
	if (cost > 0)
	    prompt += "\r\n#i4031138# " + cost + " 메소";
		
	cm.sendYesNo(prompt);
    }
    else if (status == 3 && mode == 1) {
	var complete = false;
		
	if (cm.getMeso() < cost) {
	    cm.sendOk("흐음.. 이정도의 수수료면 싼 편인데.. 그정도 돈도 없는거야?");
            cm.dispose();
            return;
	} else {
	    if (mats instanceof Array) {
		for(var i = 0; (complete || i == 0) && i < mats.length; i++) {
		    if (matQty[i] == 1)	{
			complete = cm.haveItem(mats[i], 1);
		    } else {
			complete = cm.haveItem(mats[i], matQty[i]);
		    }
		}
	    } else {
		complete = cm.haveItem(mats, matQty);
	    }
	}
			
	if (!complete) {
	    cm.sendOk("재료가 부족한 것 같은데? 아니면 인벤토리 공간이 부족한건 아닌지 확인해 봐!");
                cm.dispose();
                return;
        }
	if (stimulator){ //check for stimulator
	    if (!cm.haveItem(stimID)) {
		complete = false;
                cm.sendOk("재료는 분명 제대로 갖고 있는거야?");
                cm.dispose();
                return;
	    }
	}
        if (!cm.canHold(item)) {
            complete = false;
            cm.sendOk("인벤토리 공간이 부족한걸?");
            cm.dispose();
            return;
        }
			
	if (!complete)
	    cm.sendOk("재료가 부족한 것 같은데? 아니면 인벤토리 공간이 부족한건 아닌지 확인해 봐.");
	else {
	    if (mats instanceof Array) {
		for (var i = 0; i < mats.length; i++){
		    cm.gainItem(mats[i], -matQty[i]);
		}
	    } else
		cm.gainItem(mats, -matQty);
					
	    cm.gainMeso(-cost);
	    if (stimulator){ //check for stimulator
		cm.gainItem(stimID, -1);
		var deleted = Math.floor(Math.random() * 10);
		if (deleted != 0){
		    cm.gainItem(item, 1, true)
		    cm.sendOk("자, 여기 드래곤의 힘이 담긴 무기야. 유용하게 쓰도록 해.");
		} else {
		    cm.sendOk("음.. 이 무기는 드래곤의 힘을 담기에는 너무 약했었나봐.. 무기가 부서진 것 같아.");
		}
	    } else { //just give basic item
		cm.gainItem(item, 1);
		cm.sendOk("자, 여기 드래곤의 힘이 담긴 무기야. 유용하게 쓰도록 해.");
	    }
	}
	cm.dispose();
    }
}

function getStimID(equipID){
    var cat = Math.floor(equipID / 10000);
    var stimBase = 4130002; //stim for 1h sword
	
    switch (cat){
	case 130: //1h sword, do nothing
	    break;
	case 131: //1h axe
	    stimBase++;
	    break;
	case 132: //1h bw
	    stimBase += 2;
	    break;
	case 140: //2h sword
	    stimBase += 3;
	    break;
	case 141: //2h axe
	    stimBase += 4;
	    break;
	case 142: //2h bw
	    stimBase += 5;
	    break;
	case 143: //spear
	    stimBase += 6;
	    break;
	case 144: //polearm
	    stimBase += 7;
	    break;
	case 137: //wand
	    stimBase += 8;
	    break;
	case 138: //staff
	    stimBase += 9;
	    break;
	case 145: //bow
	    stimBase += 10;
	    break;
	case 146: //xbow
	    stimBase += 11;
	    break;
	case 133: //dagger
	    stimBase += 12;
	    break;
	case 147: //claw
	    stimBase += 13;
	    break;
	case 148: //knuckle
	    stimBase += 14;
	    break;
	case 149: //gun
	    stimBase += 15;
	    break;
    }
	
    return stimBase;
}