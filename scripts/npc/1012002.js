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
 * NPCID : 1012002
 * ScriptName : refine_henesys
 * NPCNameFunc : 비셔스 - 아이템 제작자
 * Location : 100000100 (빅토리아로드 - 헤네시스시장)
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
	var selStr = "흐음.. 궁수의 아이템이 필요한건가? 그렇다면 내가 도와줄 수 있는데.. 필요한 물건이라도 있어? 어떤 물건이 필요하지?#b"
	var options = new Array("활 제작","석궁 제작","장갑 제작","장갑 합성","재료 제작","화살 제작");
	for (var i = 0; i < options.length; i++) {
	    selStr += "\r\n#L" + i + "# " + options[i] + "#l";
	}
			
	cm.sendSimple(selStr);
    }
    else if (status == 1 && mode == 1) {
	selectedType = selection;
	if (selectedType == 0) { //bow refine
	    var selStr = "난 저격수였지. 하지만 활과 석궁은 그다지 차이가 많이 나진 않아... 어쨌든, 뭘 만들고 싶지?#b";
	    var items = new Array(1452002,1452003,1452001,1452000,1452005,1452006,1452007);
	    var suffix = new Array (" - 궁수 Lv. 10"," - 궁수 Lv. 15"," - 궁수 Lv. 20"," - 궁수 Lv. 25"," - 궁수 Lv. 30"," - 궁수 Lv. 35",
		" - 궁수 Lv. 40");
	    equip = true;
	    for (var i = 0; i < items.length; i++) {
		selStr += "\r\n#L" + i + "##z" + items[i] + "##k" + suffix[i] + "#l#b";
	    }
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 1) { //xbow refine
	    var selStr = "나는 한때 저격수였어. 석궁은 내 전문이지. 어떤 것을 만들어줄까?#b";
	    var items = new Array(1462001,1462002,1462003,1462000,1462004,1462005,1462006,1462007);
	    var suffix = new Array (" - 궁수 Lv. 12"," - 궁수 Lv. 18"," - 궁수 Lv. 22"," - 궁수 Lv. 28"," - 궁수 Lv. 32"," - 궁수 Lv. 38",
		" - 궁수 Lv. 42"," - 궁수 Lv. 50");
	    equip = true;
	    for (var i = 0; i < items.length; i++) {
		selStr += "\r\n#L" + i + "##z" + items[i] + "##k" + suffix[i] + "#l#b";
	    }
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 2) { //glove refine
	    var selStr = "좋아. 어떤 장갑을 만들어줬으면 좋겠지?#b";
	    var items = new Array(1082012,1082013,1082016,1082048,1082068,1082071,1082084,1082089);
	    var suffix = new Array (" - 궁수 Lv. 15"," - 궁수 Lv. 20"," - 궁수 Lv. 25"," - 궁수 Lv. 30"," - 궁수 Lv. 35",
		" - 궁수 Lv. 40"," - 궁수 Lv. 50"," - 궁수 Lv. 60");
	    equip = true;
	    for (var i = 0; i < items.length; i++) {
		selStr += "\r\n#L" + i + "##z" + items[i] + "##k" + suffix[i] + "#l#b";
	    }
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 3) { //glove upgrade
	    var selStr = "좋아. 어떤 장갑을 만들어줬으면 좋겠지??#b";
	    var items = new Array (1082015,1082014,1082017,1082018,1082049,1082050,1082069,1082070,1082072,1082073,1082085,1082083,1082090,1082091);
	    var suffix = new Array (" - 궁수 Lv. 20"," - 궁수 Lv. 20"," - 궁수 Lv. 25"," - 궁수 Lv. 25"," - 궁수 Lv. 30",
		" - 궁수 Lv. 30"," - 궁수 Lv. 35"," - 궁수 Lv. 35"," - 궁수 Lv. 40"," - 궁수 Lv. 40"," - 궁수 Lv. 50",
		" - 궁수 Lv. 50"," - 궁수 Lv. 60"," - 궁수 Lv. 60");
	    for (var i = 0; i < items.length; i++) {
		selStr += "\r\n#L" + i + "##z" + items[i] + "##k" + suffix[i] + "#l#b";
	    }
	    equip = true;
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 4) { //material refine
	    var selStr = "재료? 몇가지 재료 제작 방법을 알고 있으니 만들어 줄 수 있겠어.#b";
	    var materials = new Array ("나뭇가지로 가공된 나무 제작","장작으로 가공된 나무 제작","나사 15개 제작");
	    for (var i = 0; i < materials.length; i++) {
		selStr += "\r\n#L" + i + "# " + materials[i] + "#l";
	    }
	    equip = false;
	    cm.sendSimple(selStr);
	}
	else if (selectedType == 5) { //arrow refine
	    var selStr = "화살? 문제 없지.#b";
	    var arrows = new Array ("#t2060000#","#t2061000#","#t2060001#","#t2061001#","#t2060002#","#t2061002#");
	    for (var i = 0; i < arrows.length; i++) {
		selStr += "\r\n#L" + i + "# " + arrows[i] + "#l";
	    }
	    equip = true;
	    cm.sendSimple(selStr);
	}
	if (equip)
	    status++;
    }
    else if (status == 2 && mode == 1) {
	selectedItem = selection;
	if (selectedType == 4) { //material refine
	    var itemSet = new Array (4003001,4003001,4003000);
	    var matSet = new Array(4000003,4000018,new Array (4011000,4011001));
	    var matQtySet = new Array (10,5,new Array (1,1));
	    var costSet = new Array (0,0,0)
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
		
	var prompt = "만들고 싶은 아이템이 #b#t" + item + "##k 인가? 몇개를 만들고 싶어?";
		
	cm.sendGetNumber(prompt,1,1,100)
    }
    else if (status == 3 && mode == 1) {
	if (equip)
	{
	    selectedItem = selection;
	    qty = 1;
	}
	else
	    qty = selection;

	if (selectedType == 0) { //bow refine
	    var itemSet = new Array(1452002,1452003,1452001,1452000,1452005,1452006,1452007);
	    var matSet = new Array(new Array(4003001,4000000),new Array(4011001,4003000),new Array(4003001,4000016),new Array(4011001,4021006,4003000),
		new Array(4011001,4011006,4021003,4021006,4003000),new Array(4011004,4021000,4021004,4003000),new Array(4021008,4011001,4011006,4003000,4000014));
	    var matQtySet = new Array(new Array(5,30),new Array(1,3),new Array(30,50),new Array(2,2,8),new Array(5,5,3,3,30),new Array(7,6,3,35),new Array(1,10,3,40,50));
	    var costSet = new Array(800,2000,3000,5000,30000,40000,80000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 1) { //xbow refine
	    var itemSet = new Array(1462001,1462002,1462003,1462000,1462004,1462005,1462006,1462007);
	    var matSet = new Array(new Array(4003001,4003000),new Array(4011001,4003001,4003000),new Array(4011001,4003001,4003000),new Array(4011001,4021006,4021002,4003000),
		new Array(4011001,4011005,4021006,4003001,4003000),new Array(4021008,4011001,4011006,4021006,4003000),new Array(4021008,4011004,4003001,4003000),new Array(4021008,4011006,4021006,4003001,4003000));
	    var matQtySet = new Array(new Array(7,2),new Array(1,20,5),new Array(1,50,8),new Array(2,1,1,10),new Array(5,5,3,50,15),new Array(1,8,4,2,30),new Array(2,6,30,30),new Array(2,5,3,40,40));
	    var costSet = new Array (1000,2000,3000,10000,30000,50000,80000,200000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 2) { //glove refine
	    var itemSet = new Array(1082012,1082013,1082016,1082048,1082068,1082071,1082084,1082089);
	    var matSet = new Array(new Array(4000021,4000009),new Array(4000021,4000009,4011001),new Array(4000021,4000009,4011006),new Array(4000021,4011006,4021001),new Array(4011000,4011001,4000021,4003000),
		new Array(4011001,4021000,4021002,4000021,4003000),new Array(4011004,4011006,4021002,4000030,4003000),new Array(4011006,4011007,4021006,4000030,4003000));
	    var matQtySet = new Array(new Array(15,20),new Array(20,20,2),new Array(40,50,2),new Array(50,2,1),new Array(1,3,60,15),new Array(3,1,3,80,25),new Array(3,1,2,40,35),new Array(2,1,8,50,50));
	    var costSet = new Array(5000,10000,15000,20000,30000,40000,50000,70000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 3) { //glove upgrade
	    var itemSet = new Array (1082015,1082014,1082017,1082018,1082049,1082050,1082069,1082070,1082072,1082073,1082085,1082083,1082090,1082091);
	    var matSet = new Array(new Array(1082013,4021003),new Array(1082013,4021000),new Array(1082016,4021000),new Array(1082016,4021008),new Array(1082048,4021003),new Array(1082048,4021008),
		new Array(1082068,4011002),new Array(1082068,4011006),new Array(1082071,4011006),new Array(1082071,4021008),new Array(1082084,4011000,4021000),new Array(1082084,4011006,4021008),
		new Array(1082089,4021000,4021007),new Array(1082089,4021007,4021008));
	    var matQtySet = new Array (new Array(1,2),new Array(1,1),new Array(1,3),new Array(1,1),new Array(1,3),new Array(1,1),new Array(1,4),new Array(1,2),new Array(1,4),new Array(1,2),
		new Array(1,1,5),new Array(1,2,2),new Array(1,5,1),new Array(1,2,2));
	    var costSet = new Array (7000,7000,10000,12000,15000,20000,22000,25000,30000,40000,55000,60000,70000,80000);
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
	else if (selectedType == 5) { //arrow refine
	    var itemSet = new Array(2060000,2061000,2060001,2061001,2060002,2061002);
	    var matSet = new Array(new Array (4003001,4003004),new Array (4003001,4003004),new Array (4011000,4003001,4003004),new Array (4011000,4003001,4003004),
		new Array (4011001,4003001,4003005),new Array (4011001,4003001,4003005));
	    var matQtySet = new Array (new Array (1,1),new Array (1,1),new Array (1,3,10),new Array (1,3,10),new Array (1,5,15),new Array (1,5,15));
	    var costSet = new Array (0,0,0,0,0,0)
	    item = itemSet[selectedItem];
	    mats = matSet[selectedItem];
	    matQty = matQtySet[selectedItem];
	    cost = costSet[selectedItem];
	}
		
	var prompt = "만들고 싶은 아이템이 ";
	if (qty == 1)
	    prompt += "#t" + item + "#";
	else
	    prompt += " #t" + item + "#" + qty + "개";
	prompt += " 인가? 재료는 아래를 참조해.\r\n#b";
		
	if (mats instanceof Array) {
	    for(var i = 0; i < mats.length; i++) {
		prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] * qty + "개 ";
	    }
	}
	else {
	    prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty * qty + "개 ";
	}
		
	if (cost > 0)
	    prompt += "\r\n#i4031138# " + cost * qty + " 메소";
		
	cm.sendYesNo(prompt);
    }
    else if (status == 4 && mode == 1) {
		var complete = false;
		
        if (cm.getMeso() < cost * qty) {
            cm.sendOk("흐음.. 내 서비스를 이용하려면 약간의 수수료가 필요하다네. 수수료를 충분히 갖고 있는지 확인해 보게나.")
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
        if (!complete) {
            cm.sendOk("재료는 충분히 갖고 있는지, 인벤토리 공간이 부족한 건 아닌지 다시한번 확인해 보게나.");
        } else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -(matQty[i] * qty));
                }
            } else
                cm.gainItem(mats, -matQty * qty);
					
            if (cost > 0)
                cm.gainMeso(-(cost * qty));

            if (item >= 2060000 && item <= 2060002) //bow arrows
                cm.gainItem(item, 1000 - (item - 2060000) * 100);
            else if (item >= 2061000 && item <= 2061002) //xbow arrows
                cm.gainItem(item, 1000 - (item - 2061000) * 100);
            else if (item == 4003000)//screws
                cm.gainItem(4003000, 15 * qty);
            else
                cm.gainItem(item, qty);
            cm.sendOk("다 됐다네. 다른 원하는것이 있다면 언제든지 내게 말을 걸어주게.");
        }
        cm.dispose();
    }
}