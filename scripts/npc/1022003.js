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
 * NPCID : 1022003
 * ScriptName : refine_perion
 * NPCNameFunc : 선더 - 아이템 제작자
 * Location : 102000000 (빅토리아로드 - 페리온)
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
    if (status == 0 && mode == 1) {
        var selStr = "난 세상 최고의 대장장이, 선더라고 한다네.#b"
        var options = new Array("광석 제련","보석 제련","헬멧 합성","방패 합성");
        for (var i = 0; i < options.length; i++){
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
			
        cm.sendSimple(selStr);
    }
    else if (status == 1 && mode == 1) {
        selectedType = selection;
        if (selectedType == 0){ //mineral refine
            var selStr = "어떤 광석을 제련해 보고 싶나?#b";
            var minerals = new Array ("#t4011000#","#t4011001#","#t4011002#","#t4011003#","#t4011004#","#t4011005#","#t4011006#");
            for (var i = 0; i < minerals.length; i++){
                selStr += "\r\n#L" + i + "# " + minerals[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = false;
        }
        else if (selectedType == 1){ //jewel refine
            var selStr = "어떤 보석을 제련해 보고 싶나?#b";
            var jewels = new Array ("#t4021000#","#t4021001#","#t4021002#","#t4021003#","#t4021004#","#t4021005#","#t4021006#","#t4021007#","#t4021008#");
            for (var i = 0; i < jewels.length; i++){
                selStr += "\r\n#L" + i + "# " + jewels[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = false;
        }
        else if (selectedType == 2){ //helmet refine
            var selStr = "어떤 헬멧을 만들어 보고 싶나?#b";
            var helmets = new Array (
                "#z1002042##k - 공용 Lv. 15#b",
                "#z1002041##k - 공용 Lv. 15#b",
                "#z1002002##k - 전사 Lv. 10#b",
                "#z1002044##k - 전사 Lv. 10#b",
                "#z1002003##k - 전사 Lv. 12#b",
                "#z1002040##k - 전사 Lv. 12#b",
                "#z1002007##k - 전사 Lv. 15#b",
                "#z1002052##k - 전사 Lv. 15#b",
                "#z1002011##k - 전사 Lv. 20#b",
                "#z1002058##k - 전사 Lv. 20#b",
                "#z1002009##k - 전사 Lv. 20#b",
                "#z1002056##k - 전사 Lv. 20#b",
                "#z1002087##k - 전사 Lv. 22#b",
                "#z1002088##k - 전사 Lv. 22#b",
                "#z1002049##k - 전사 Lv. 25#b",
                "#z1002050##k - 전사 Lv. 25#b",
                "#z1002047##k - 전사 Lv. 35#b",
                "#z1002048##k - 전사 Lv. 35#b",
                "#z1002099##k - 전사 Lv. 40#b",
                "#z1002098##k - 전사 Lv. 40#b",
                "#z1002085##k - 전사 Lv. 50#b",
                "#z1002028##k - 전사 Lv. 50#b",
                "#z1002022##k - 전사 Lv. 55#b",
                "#z1002101##k - 전사 Lv. 55#b");
            for (var i = 0; i < helmets.length; i++){
                selStr += "\r\n#L" + i + "# " + helmets[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = true;
        }
        else if (selectedType == 3){ //shield refine
            var selStr = "어떤 방패를 합성해 보고 싶나?#b";
            var shields = new Array (
            "#z1092014##k - 전사 Lv. 40#b",
            "#z1092013##k - 전사 Lv. 40#b",
            "#z1092010##k - 전사 Lv. 60#b",
            "#z1092011##k - 전사 Lv. 60#b");
            for (var i = 0; i < shields.length; i++){
                selStr += "\r\n#L" + i + "# " + shields[i] + "#l";
            }
            cm.sendSimple(selStr);
            equip = true;
        }
        if (equip)
            status++;
    }
    else if (status == 2 && mode == 1) {
        selectedItem = selection;
        if (selectedType == 0){ //mineral refine
            var itemSet = new Array(4011000,4011001,4011002,4011003,4011004,4011005,4011006);
            var matSet = new Array(4010000,4010001,4010002,4010003,4010004,4010005,4010006);
            var matQtySet = new Array(10,10,10,10,10,10,10);
            var costSet = new Array(300,300,300,500,500,500,800);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 1){ //jewel refine
            var itemSet = new Array(4021000,4021001,4021002,4021003,4021004,4021005,4021006,4021007,4021008);
            var matSet = new Array(4020000,4020001,4020002,4020003,4020004,4020005,4020006,4020007,4020008);
            var matQtySet = new Array(10,10,10,10,10,10,10,10,10);
            var costSet = new Array (500,500,500,500,500,500,500,1000,3000);
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

        if (selectedType == 2){ //helmet refine
            var itemSet = new Array(1002042,1002041,1002002,1002044,1002003,1002040,1002007,1002052,1002011,1002058,1002009,1002056,1002087,1002088,1002049,1002050,1002047,1002048,1002099,1002098,1002085,1002028,1002022,1002101);
            var matSet = new Array(new Array(1002001,4011002),new Array(1002001,4021006),new Array(1002043,4011001),new Array(1002043,4011002),new Array(1002039,4011001),new Array(1002039,4011002),new Array(1002051,4011001),new Array(1002051,4011002),new Array(1002059,4011001),new Array(1002059,4011002),
                new Array(1002055,4011001),new Array(1002055,4011002),new Array(1002027,4011002),new Array(1002027,4011006),new Array(1002005,4011006),new Array(1002005,4011005),new Array(1002004,4021000),new Array(1002004,4021005),new Array(1002021,4011002),new Array(1002021,4011006),new Array(1002086,4011002),
                new Array(1002086,4011004),new Array(1002100,4011007,4011001),new Array(1002100,4011007,4011002));
            var matQtySet = new Array(new Array(1,1),new Array(1,1),new Array(1,1),new Array(1,1),new Array(1,1),new Array(1,1),new Array(1,2),new Array(1,2),new Array(1,3),new Array(1,3),new Array(1,3),new Array(1,3),new Array(1,4),new Array(1,4),new Array(1,5),new Array(1,5),new Array(1,3),new Array(1,3),
                new Array(1,5),new Array(1,6),new Array(1,5),new Array(1,4),new Array(1,1,7),new Array(1,1,7));
            var costSet = new Array(500,300,500,800,500,800,1000,1500,1500,2000,1500,2000,2000,4000,4000,5000,8000,10000,12000,15000,20000,25000,30000,30000);
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];
        }
        else if (selectedType == 3){ //shield refine
            var itemSet = new Array (1092014,1092013,1092010,1092011);
            var matSet = new Array(new Array (1092012,4011003),new Array (1092012,4011002),new Array (1092009,4011007,4011004),new Array (1092009,4011007,4011003));
            var matQtySet = new Array (new Array (1,10),new Array (1,10),new Array (1,1,15),new Array (1,1,15));
            var costSet = new Array (100000,100000,120000,120000);
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
            cm.sendOk("메소#k 는 제대로 갖고 있는건나? 다시 한번 확인해보게.");
            cm.safeDispose();
        } else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++) {
                    if (matQty[i] * qty == 1) {
                        complete = cm.haveItem(mats[i]);
                    } else {
                        complete = cm.haveItem(mats[i], matQty[i] * qty);
                    }
                    if (!complete) {
                        break;
                    }
                }
            } else {
                complete = cm.haveItem(mats, matQty * qty);
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

                cm.gainMeso(-cost * qty);
                cm.gainItem(item,qty);
                cm.sendOk("자아.. 다 됐다구. 역시 완벽한 아이템이 탄생했잖아? 다른 작업도 필요하다면 다시 나에게 찾아오라구.");
            }
            cm.safeDispose();
        }
    }
}