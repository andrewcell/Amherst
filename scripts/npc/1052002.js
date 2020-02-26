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
 * NPCID : 1052002
 * ScriptName : refine_kerning
 * NPCNameFunc : 뒷골목의 제이엠 - 아이템 제작자
 * Location : 103000000 (빅토리아로드 - 커닝시티)
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
    else{
        cm.dispose();
        return;
    }
    if (status == 0 && mode == 1) {
        var selStr = "쉿... 조용히 하라구.. 자.. 좋은물건들이 많이 있으니 천천히 골라보도록 하라구.#b \r\n#L0# 장갑 제작#l\r\n#L1# 장갑 합성#l\r\n#L2# 아대 제작#l\r\n#L3# 아대 합성#l\r\n#L4# 재료 제작#l\r\n"	
        cm.sendSimple(selStr);
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0){ //glove refine
            var selStr = "어떤 장갑을 만들어 보고 싶어?#b";
            var gloves = new Array (
                "#z1082002##k - 공용 Lv. 10#b",
                "#z1082029##k - 도적 Lv. 15#b",
                "#z1082030##k - 도적 Lv. 15#b",
                "#z1082031##k - 도적 Lv. 15#b",
                "#z1082032##k - 도적 Lv. 20#b",
                "#z1082037##k - 도적 Lv. 25#b",
                "#z1082042##k - 도적 Lv. 30#b",
                "#z1082046##k - 도적 Lv. 35#b",
                "#z1082075##k - 도적 Lv. 40#b",
                "#z1082065##k - 도적 Lv. 50#b",
                "#z1082092##k - 도적 Lv. 60#b");
            for (var i = 0; i < gloves.length; i++){
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        } else if (selectedType == 1){ //glove upgrade
            var selStr = "어떤 장갑을 합성해 보고 싶어?#b";
            var gloves = new Array (
                "#z1082033##k - 도적 Lv. 20#b",
                "#z1082034##k - 도적 Lv. 20#b",
                "#z1082038##k - 도적 Lv. 25#b",
                "#z1082039##k - 도적 Lv. 25#b",
                "#z1082043##k - 도적 Lv. 30#b",
                "#z1082044##k - 도적 Lv. 30#b",
                "#z1082047##k - 도적 Lv. 35#b",
                "#z1082045##k - 도적 Lv. 35#b",
                "#z1082076##k - 도적 Lv. 40#b",
                "#z1082074##k - 도적 Lv. 40#b",
                "#z1082067##k - 도적 Lv. 50#b",
                "#z1082066##k - 도적 Lv. 50#b",
                "#z1082093##k - 도적 Lv. 60#b",
                "#z1082094##k - 도적 Lv. 60#b");
            for (var i = 0; i < gloves.length; i++){
                selStr += "\r\n#L" + i + "# " + gloves[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        } else if (selectedType == 2){ //claw refine
            var selStr = "어떤 아대를 제작해 보고 싶어?#b";
            var claws = new Array (
                "#z1472001##k - 도적 Lv. 15#b",
                "#z1472004##k - 도적 Lv. 20#b",
                "#z1472007##k - 도적 Lv. 25#b",
                "#z1472008##k - 도적 Lv. 30#b",
                "#z1472011##k - 도적 Lv. 35#b",
                "#z1472014##k - 도적 Lv. 40#b",
                "#z1472018##k - 도적 Lv. 50#b");
            for (var i = 0; i < claws.length; i++){
                selStr += "\r\n#L" + i + "# " + claws[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        } else if (selectedType == 3){ //claw upgrade
            var selStr = "어떤 아대를 합성해 보고 싶어?#b";
            var claws = new Array (
                "#z1472002##k - 도적 Lv. 15#b",
                "#z1472003##k - 도적 Lv. 15#b",
                "#z1472005##k - 도적 Lv. 20#b",
                "#z1472006##k - 도적 Lv. 20#b",
                "#z1472009##k - 도적 Lv. 30#b",
                "#z1472010##k - 도적 Lv. 30#b",
                "#z1472012##k - 도적 Lv. 35#b",
                "#z1472013##k - 도적 Lv. 35#b",
                "#z1472015##k - 도적 Lv. 40#b",
                "#z1472016##k - 도적 Lv. 40#b",
                "#z1472017##k - 도적 Lv. 40#b",
                "#z1472019##k - 도적 Lv. 50#b",
                "#z1472020##k - 도적 Lv. 50#b");
            for (var i = 0; i < claws.length; i++){
                selStr += "\r\n#L" + i + "# " + claws[i] + "#l";
            }
            equip = true;
            cm.sendSimple(selStr);
        } else if (selectedType == 4){ //material refine
            var selStr = "재료? 그정도는 문제없어.#b";
            var materials = new Array ("나뭇가지로 가공된 나무 제작","장작으로 가공된 나무 제작","나사 15개 제작");
            for (var i = 0; i < materials.length; i++){
                selStr += "\r\n#L" + i + "# " + materials[i] + "#l";
            }
            equip = false;
            cm.sendSimple(selStr);
        }
        if (equip)
            status++;
    } else if (status == 2 && mode == 1) {
        selectedItem = selection;
        if (selectedType == 4){ //material refine
            var itemSet = new Array (4003001,4003001,4003000);
            var matSet = new Array(4000003,4000018,new Array (4011000,4011001));
            var matQtySet = new Array (10,5,new Array (1,1));
            var costSet = new Array (0,0,0);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
        var prompt = "만들고 싶은 아이템이 #t" + item + "# 인가? 몇개를 만들고 싶나?\r\n";
		
        cm.sendGetNumber(prompt,1,1,100)
    }
    else if (status == 3 && mode == 1) {
        if (equip) {
            selectedItem = selection;
            qty = 1;
        }
        else
            qty = selection;

        if (selectedType == 0){ //glove refine
            var itemSet = new Array(1082002,1082029,1082030,1082031,1082032,1082037,1082042,1082046,1082075,1082065,1082092);
            var matSet = new Array(4000021,new Array(4000021,4000018),new Array(4000021,4000015),new Array(4000021,4000020),new Array(4011000,4000021),new Array(4011000,4011001,4000021),new Array(4011001,4000021,4003000),new Array(4011001,4011000,4000021,4003000),new Array(4021000,4000014,4000021,4003000),new Array(4021005,4021008,4000030,4003000),new Array(4011007,4011000,4021007,4000030,4003000));
            var matQtySet = new Array(15,new Array(30,20),new Array(30,20),new Array(30,20),new Array(2,40),new Array(2,1,10),new Array(2,50,10),new Array(3,1,60,15),new Array(3,200,80,30),new Array(3,1,40,30),new Array(1,8,1,50,50));
            var costSet = new Array(1000,7000,7000,7000,10000,15000,25000,30000,40000,50000,70000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 1){ //glove upgrade
            var itemSet = new Array(1082033,1082034,1082038,1082039,1082043,1082044,1082047,1082045,1082076,1082074,1082067,1082066,1082093,1082094);
            var matSet = new Array(new Array(1082032,4011002),new Array(1082032,4021004),new Array(1082037,4011002),new Array(1082037,4021004),new Array(1082042,4011004),new Array(1082042,4011006),new Array(1082046,4011005),new Array(1082046,4011006),new Array(1082075,4011006),new Array(1082075,4021008),new Array(1082065,4021000),new Array(1082065,4011006,4021008),new Array(1082092,4011001,4000014),new Array(1082092,4011006,4000027));
            var matQtySet = new Array(new Array(1,1),new Array(1,1),new Array(1,2),new Array(1,2),new Array(1,2),new Array(1,1),new Array(1,3),new Array(1,2),new Array(1,4),new Array(1,2),new Array(1,5),new Array(1,2,1),new Array(1,7,200),new Array(1,7,150));
            var costSet = new Array (5000,7000,10000,12000,15000,20000,22000,25000,40000,50000,55000,60000,70000,80000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 2){ //claw refine
            var itemSet = new Array(1472001,1472004,1472007,1472008,1472011,1472014,1472018);
            var matSet = new Array(new Array(4011001,4000021,4003000),new Array(4011000,4011001,4000021,4003000),new Array(1472000,4011001,4000021,4003001),new Array(4011000,4011001,4000021,4003000),new Array(4011000,4011001,4000021,4003000),new Array(4011000,4011001,4000021,4003000),new Array(4011000,4011001,4000030,4003000));
            var matQtySet = new Array(new Array(1,20,5),new Array(2,1,30,10),new Array(1,3,20,30),new Array(3,2,50,20),new Array(4,2,80,25),new Array(3,2,100,30),new Array(4,2,40,35));
            var costSet = new Array(2000,3000,5000,15000,30000,40000,50000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 3){ //claw upgrade
            var itemSet = new Array (1472002,1472003,1472005,1472006,1472009,1472010,1472012,1472013,1472015,1472016,1472017,1472019,1472020);
            var matSet = new Array(new Array(1472001,4011002),new Array(1472001,4011006),new Array(1472004,4011001),new Array(1472004,4011003),new Array(1472008,4011002),new Array(1472008,4011003),new Array(1472011,4011004),new Array(1472011,4021008),new Array(1472014,4021000),new Array(1472014,4011003),new Array(1472014,4021008),new Array(1472018,4021000),new Array(1472018,4021005));
            var matQtySet = new Array (new Array(1,1),new Array(1,1),new Array(1,2),new Array(1,2),new Array(1,3),new Array(1,3),new Array(1,4),new Array(1,1),new Array(1,5),new Array(1,5),new Array(1,2),new Array(1,6),new Array(1,6));
            var costSet = new Array (1000,2000,3000,5000,10000,15000,20000,25000,30000,30000,35000,40000,40000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
        var prompt = "만들고 싶은 아이템이 ";
        prompt += " #t" + item + "# " + qty + " 개 인가?";
        prompt += " 재료는 아래를 참조하게.\r\n#b";
        if (mats instanceof Array){
            for(var i = 0; i < mats.length; i++){
                prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] * qty + " 개";
            }
        }
        else {
            prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty * qty + " 개";
        }
		
        if (cost > 0)
            prompt += "\r\n#i4031138# " + cost * qty + " 메소";
        
        cm.sendYesNo(prompt);
    } else if (status == 4 && mode == 1) {
        var complete = false;
		
        if (cm.getMeso() < cost * qty) {
            cm.sendOk("메소#k 는 제대로 갖고 있는건나? 다시 한번 확인해보게.")
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
        if (!complete) {
            cm.sendOk("재료는 제대로 갖고 있는건가? 다시 한번 확인해보게. 만일 재료를 장비하고 있다면 장비를 해제하도록 하게. 혹은 인벤토리 공간이 부족한거 아닌가..? 제대로 다시 한번 확인해 보게.");
        } else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i] * qty);
                }
            } else {
                cm.gainItem(mats, -matQty * qty);
            }
            if (cost > 0) {
                cm.gainMeso(-cost * qty);
            }
            if (item == 4003000) {//screws
                cm.gainItem(4003000, 15 * qty);
            } else {
                cm.gainItem(item, qty);
            }
            cm.sendOk("자아.. 다 됐다구. 역시 완벽한 아이템이 탄생했잖아? 다른 작업도 필요하다면 다시 나에게 찾아오라구.");
        }
        cm.dispose();
    }
}