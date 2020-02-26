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
 * NPCID : 1032002
 * ScriptName : refine_ellinia
 * NPCNameFunc : 에뜨랑 - 아이템 제작자
 * Location : 101000000 (빅토리아로드 - 엘리니아)
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
var qty = 1;
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
    if (status == 0 && mode == 1) {
        cm.sendSimple("후후후후... 여기 좋은물건이 많으니 구경이라도 해보고 가지 그래..? \r\n#b#L0# 장갑 제작#l\r\n#L1# 장갑 합성#l\r\n#L2# 모자 합성#l\r\n#L3# 완드 제작#l\r\n#L4# 스태프 제작#l\r\n");
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0){ //glove refine
            var selStr = "어떤 장갑을 만들어 보고 싶나?#b";
            var items = new Array (
                "#z1082019##k - 마법사 Lv. 15#b",
                "#z1082020##k - 마법사 Lv. 20#b",
                "#z1082026##k - 마법사 Lv. 25#b",
                "#z1082051##k - 마법사 Lv. 30#b",
                "#z1082054##k - 마법사 Lv. 35#b",
                "#z1082062##k - 마법사 Lv. 40#b",
                "#z1082081##k - 마법사 Lv. 50#b",
                "#z1082086##k - 마법사 Lv. 60#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 1){ //glove upgrade
            var selStr = "어떤 장갑을 합성해 보고 싶나?#b";
            var items = new Array (
                "#z1082021##k - 마법사 Lv. 20#b",
                "#z1082022##k - 마법사 Lv. 20#b",
                "#z1082027##k - 마법사 Lv. 25#b",
                "#z1082028##k - 마법사 Lv. 25#b",
                "#z1082052##k - 마법사 Lv. 30#b",
                "#z1082053##k - 마법사 Lv. 30#b",
                "#z1082055##k - 마법사 Lv. 35#b",
                "#z1082056##k - 마법사 Lv. 35#b",
                "#z1082063##k - 마법사 Lv. 40#b",
                "#z1082064##k - 마법사 Lv. 40#b",
                "#z1082082##k - 마법사 Lv. 50#b",
                "#z1082080##k - 마법사 Lv. 50#b",
                "#z1082087##k - 마법사 Lv. 60#b",
                "#z1082088##k - 마법사 Lv. 60#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 2){ //hat upgrade
            var selStr = "어떤 모자를 합성해 보고 싶나?#b";
            var items = new Array (
                "#z1002065##k - 마법사 Lv. 30#b",
                "#z1002013##k - 마법사 Lv. 30#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 3){ //wand refine
            var selStr = "어떤 완드를 만들어 보고 싶나?#b";
            var items = new Array (
                "#z1372005##k - 공용 Lv. 8#b",
                "#z1372006##k - 공용 Lv. 13#b",
                "#z1372002##k - 공용 Lv. 18#b",
                "#z1372004##k - 마법사 Lv. 23#b",
                "#z1372003##k - 마법사 Lv. 28#b",
                "#z1372001##k - 마법사 Lv. 33#b",
                "#z1372000##k - 마법사 Lv. 38#b",
                "#z1372007##k - 마법사 Lv. 48#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        } else if (selectedType == 4){ //staff refine
            var selStr = "어떤 스태프를 만들어 보고 싶나?#b";
            var items = new Array (
                "#z1382000##k - 마법사 Lv. 10#b",
                "#z1382003##k - 마법사 Lv. 15#b",
                "#z1382005##k - 마법사 Lv. 15#b",
                "#z1382004##k - 마법사 Lv. 20#b",
                "#z1382002##k - 마법사 Lv. 25#b",
                "#z1382001##k - 마법사 Lv. 45#b");
            for (var i = 0; i < items.length; i++){
                selStr += "\r\n#L" + i + "# " + items[i] + "#l";
            }
            cm.sendSimple(selStr);
        }
    } else if (status == 2 && mode == 1) {
        selectedItem = selection;

        if (selectedType == 0){ //glove refine
            var itemSet = new Array(1082019,1082020,1082026,1082051,1082054,1082062,1082081,1082086);
            var matSet = new Array(4000021,new Array(4000021,4011001),new Array(4000021,4011006),new Array(4000021,4021006,4021000),new Array(4000021,4011006,4011001,4021000),
                new Array(4000021,4021000,4021006,4003000),new Array(4021000,4011006,4000030,4003000),new Array(4011007,4011001,4021007,4000030,4003000));
            var matQtySet = new Array(15,new Array(30,1),new Array(50,2),new Array(60,1,2),new Array(70,1,3,2),new Array(80,3,3,30),new Array(3,2,35,40),new Array(1,8,1,50,50));
            var costSet = new Array(7000,15000,20000,25000,30000,40000,50000,70000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 1){ //glove upgrade
            var itemSet = new Array(1082021,1082022,1082027,1082028,1082052,1082053,1082055,1082056,1082063,1082064,1082082,1082080,1082087,1082088);
            var matSet = new Array(new Array(1082020,4011001),new Array(1082020,4021001),new Array(1082026,4021000),new Array(1082026,4021008),new Array(1082051,4021005),
                new Array(1082051,4021008),new Array(1082054,4021005),new Array(1082054,4021008),new Array(1082062,4021002),new Array(1082062,4021008),
                new Array(1082081,4021002),new Array(1082081,4021008),new Array(1082086,4011004,4011006),new Array(1082086,4021008,4011006));
            var matQtySet = new Array(new Array(1,1),new Array(1,2),new Array(1,3),new Array(1,1),new Array(1,3),new Array(1,1),new Array(1,3),new Array(1,1),new Array(1,4),
                new Array(1,2),new Array(1,5),new Array(1,3),new Array(1,3,5),new Array(1,2,3));
            var costSet = new Array (20000,25000,30000,40000,35000,40000,40000,45000,45000,50000,55000,60000,70000,80000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 2){ //hat upgrade
            var itemSet = new Array(1002065,1002013);
            var matSet = new Array(new Array(1002064,4011001),new Array(1002064,4011006));
            var matQtySet = new Array(new Array(1,3),new Array(1,3));
            var costSet = new Array(40000,50000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 3){ //wand refine
            var itemSet = new Array (1372005,1372006,1372002,1372004,1372003,1372001,1372000,1372007);
            var matSet = new Array(4003001,new Array(4003001,4000001),new Array(4011001,4000009,4003000),new Array(4011002,4003002,4003000),new Array(4011002,4021002,4003000),
                new Array(4021006,4011002,4011001,4003000),new Array(4021006,4021005,4021007,4003003,4003000),new Array(4011006,4021003,4021007,4021002,4003002,4003000));
            var matQtySet = new Array (5,new Array(10,50),new Array(1,30,5),new Array(2,1,10),new Array(3,1,10),new Array(5,3,1,15),new Array(5,5,1,1,20),new Array(4,3,2,1,1,30));
            var costSet = new Array (1000,3000,5000,12000,30000,60000,120000,200000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        } else if (selectedType == 4){ //staff refine
            var itemSet = new Array (1382000,1382003,1382005,1382004,1382002,1382001);
            var matSet = new Array(4003001,new Array(4021005,4011001,4003000),new Array(4021003,4011001,4003000),new Array(4003001,4011001,4003000),
                new Array(4021006,4021001,4011001,4003000),new Array(4011001,4021006,4021001,4021005,4003000,4000010,4003003));
            var matQtySet = new Array (5,new Array(1,1,5),new Array(1,1,5),new Array(50,1,10),new Array(2,1,1,15),new Array(8,5,5,5,30,50,1));
            var costSet = new Array (2000,2000,2000,5000,12000,180000);
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
    } else if (status == 3 && mode == 1) {
        var complete = false;
		
        if (cm.getMeso() < cost) {
            cm.sendOk("메소#k 는 제대로 갖고 있는건나? 다시 한번 확인해보게.")
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
        if (!cm.canHold(item)) {
            complete = false;
        }
			
        if (!complete)
            cm.sendOk("재료는 제대로 갖고 있는건가? 다시 한번 확인해보게. 만일 재료를 장비하고 있다면 장비를 해제하도록 하게. 혹은 인벤토리 공간이 부족한거 아닌가..? 제대로 다시 한번 확인해 보게.");
        else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i]);
                }
            }
            else
                cm.gainItem(mats, -matQty);
					
            if (cost > 0)
                cm.gainMeso(-cost);
				
            cm.gainItem(item, 1);
            cm.sendOk("자아.. 다 됐다구. 역시 완벽한 아이템이 탄생했잖아? 다른 작업도 필요하다면 다시 나에게 찾아오라구.");
        }
        cm.dispose();
    }
}