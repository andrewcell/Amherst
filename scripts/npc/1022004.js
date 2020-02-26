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
 * NPCID : 1022004
 * ScriptName : refine_perion2
 * NPCNameFunc : 스미스 - 아이템 제작자
 * Location : 102000000 (빅토리아로드 - 페리온)
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
        //	var selStr = "Um... Hi, I'm Mr. Thunder's apprentice. He's getting up there in age, so he handles most of the heavy-duty work while I handle some of the lighter jobs. What can I do for you?#b"
        //	var options = new Array("Make a glove","Upgrade a glove","Create materials");
        //	for (var i = 0; i < options.length; i++){
        //	    selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        //	}
			
        cm.sendSimple("난 선더님의 조수야. 뭘 해보고싶어?#b \r\n#L0# 장갑 제작#l\r\n#L1# 장갑 합성#l\r\n#L2# 재료 제작#l\r\n");
    }
    else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0){ //glove refine
            var selStr = "어떤 장갑을 만들어 보고 싶어?#b";
            var items = new Array (
                "#z1082003##k - 전사 Lv. 10#b",
                "#z1082000##k - 전사 Lv. 15#b",
                "#z1082004##k - 전사 Lv. 20#b",
                "#z1082001##k - 전사 Lv. 25#b",
                "#z1082007##k - 전사 Lv. 30#b",
                "#z1082008##k - 전사 Lv. 35#b",
                "#z1082023##k - 전사 Lv. 40#b",
                "#z1082009##k - 전사 Lv. 50#b",
                "#z1082059##k - 전사 Lv. 60#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = true;
        }
        else if (selectedType == 1){ //glove upgrade
            var selStr = "어떤 장갑을 합성해 보고 싶어?#b";
            var crystals = new Array (
                "#z1082005##k - 전사 Lv. 30#b",
                "#z1082006##k - 전사 Lv. 30#b",
                "#z1082035##k - 전사 Lv. 35#b",
                "#z1082036##k - 전사 Lv. 35#b",
                "#z1082024##k - 전사 Lv. 40#b",
                "#z1082025##k - 전사 Lv. 40#b",
                "#z1082010##k - 전사 Lv. 50#b",
                "#z1082011##k - 전사 Lv. 50#b",
                "#z1082060##k - 전사 Lv. 60#b",
                "#z1082061##k - 전사 Lv. 60#b");
            for (var i = 0; i < crystals.length; i++){
                selStr += "\r\n#L" + i + "# " + crystals[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = true;
        }
        else if (selectedType == 2){ //material refine
            var selStr = "재료? 그정도는 문제없어.#b";
            var materials = new Array ("나뭇가지로 가공된 나무 제작","장작으로 가공된 나무 제작","나사 15개 제작");
            for (var i = 0; i < materials.length; i++){
                selStr += "\r\n#L" + i + "# " + materials[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = false;
        }
        if (equip)
            status++;
    }
    else if (status == 2 && mode == 1) {
        selectedItem = selection;
        if (selectedType == 2){ //material refine
            var itemSet = new Array (4003001,4003001,4003000);
            var matSet = new Array(4000003,4000018,new Array (4011000,4011001));
            var matQtySet = new Array (10,5,new Array (1,1));
            var costSet = new Array (0,0,0)
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
		
        var prompt = "만들고 싶은 아이템이 #t" + item + "# 인가? 몇개를 만들고 싶나?\r\n";
		
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

        if (selectedType == 0){ //glove refine
            var itemSet = new Array(1082003,1082000,1082004,1082001,1082007,1082008,1082023,1082009,1082059);
            var matSet = new Array(new Array(4000021,4011001),4011001,new Array(4000021,4011000),4011001,new Array(4011000,4011001,4003000),new Array(4000021,4011001,4003000),new Array(4000021,4011001,4003000),
                new Array(4011001,4021007,4000030,4003000),new Array(4011007,4011000,4011006,4000030,4003000));
            var matQtySet = new Array(new Array(15,1),2,new Array(40,2),2,new Array(3,2,15),new Array(30,4,15),new Array(50,5,40),new Array(3,2,30,45),new Array(1,8,2,50,50));
            var costSet = new Array(1000,2000,5000,10000,20000,30000,40000,50000,70000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 1){ //glove upgrade
            var itemSet = new Array(1082005,1082006,1082035,1082036,1082024,1082025,1082010,1082011,1082060,1082061);
            var matSet = new Array(new Array(1082007,4011001),new Array(1082007,4011005),new Array(1082008,4021006),new Array(1082008,4021008),new Array(1082023,4011003),new Array(1082023,4021008),
                new Array(1082009,4011002),new Array(1082009,4011006),new Array(1082059,4011002,4021005),new Array(1082059,4021007,4021008));
            var matQtySet = new Array (new Array(1,1),new Array(1,2),new Array(1,3),new Array(1,1),new Array(1,4),new Array(1,2),new Array(1,5),new Array(1,4),new Array(1,3,5),new Array(1,2,2));
            var costSet = new Array (20000,25000,30000,40000,45000,50000,55000,60000,70000,80000);
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
        if (!complete)
            cm.sendOk("재료는 제대로 갖고 있는건가? 다시 한번 확인해보게. 만일 재료를 장비하고 있다면 장비를 해제하도록 하게. 혹은 인벤토리 공간이 부족한거 아닌가..? 제대로 다시 한번 확인해 보게.");
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
            cm.sendOk("자아.. 다 됐다구. 역시 완벽한 아이템이 탄생했잖아? 다른 작업도 필요하다면 다시 나에게 찾아오라구.");
        }
        cm.dispose();
    }
}