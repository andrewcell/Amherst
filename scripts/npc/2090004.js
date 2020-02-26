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
 * NPCID : 2090004
 * ScriptName : make_murueng
 * NPCNameFunc : 도의진 - 물약제조사
 * Location : 250000000 (무릉도원 - 무릉)
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
        if (cm.isQuestActive(3821)) {
            cm.forceCompleteQuest(3821);
            cm.sendNext("퀘스트 완료.");
            cm.dispose();
            return;
        }
        var selStr = "다재다능한 나에게 무슨 볼일이신가? #b"
        var options = new Array("약을 만들고 싶어요","주문서를 만들고 싶어요","약재료를 기부하고 싶어요");
        for (var i = 0; i < options.length; i++){
            selStr += "\r\n#L" + i + "# " + options[i] + "#l";
        }
			
        cm.sendSimple(selStr);
    } else if (status == 1 && mode == 1) {
        selectedType = selection;
        var selStr;
        var items;
        if (selectedType == 0){ //Make a medicine
			if (cm.haveItem(4161030))
			{
				cm.sendSimple("어떤 약을 만들고 싶은가?\r\n#b#L0# #i2022145:# #t2022145##l\r\n#L1# #i2022146:# #t2022146##l\r\n#L2# #i2022147:# #t2022147##l\r\n#L3# #i2022148:# #t2022148##l\r\n#L4# #i2022149:# #t2022149##l\r\n#L5# #i2022150:# #t2022150##l\r\n#L6# #i2050004:# #t2050004##l\r\n#L7# #i4031554:# #t4031554##l");
				cm.dispose();
			} else {
			    cm.sendNext("약을 만들고 싶다면 먼저 약초와 약에 관련된 책을 먼저 공부하게나. 기본적인 지식이 있어야 무엇이든 할 수 있는 법이지.");
				cm.dispose();
				return;
			}
        } 
        else if(selectedType == 1){//Make a scroll
            selStr = "만들고 싶은 주문서를 선택하게나.#b";
            itemSet = new Array(2043000,2043100,2043200,2043300,2043700,2043800,2044000,2044100,2044200,2044300,2044400,2044500,2044600,2044700);
        } 
        else if(selectedType == 2){//Donate medicine ingredients
            selStr = "엇? 그게 정말인가? 약재를 기부해주겠다니. 기부는 #b100#k개 단위로 받고 있다네. 기부를 해준다면 주문서를 만들 수 있는 구슬을 주겠네. 무엇을 기부해주겠는가?#b";
            itemSet = new Array(4000276,4000277,4000278,4000279,4000280,4000291,4000292,4000286,4000287,4000293, 4000294,4000298,4000284,4000288,4000285,4000282,4000295,4000289,4000296);
        }
        else {
            cm.dispose();
            return;
        }
        for (var i = 0; i < itemSet.length; i++){
            selStr += "\r\n#L" + i + "# #z" + itemSet[i] + "##l";
        }
        cm.sendSimple(selStr);
    }
    else if (status == 2 && mode == 1){
        selectedItem = selection;
        if (selectedType == 1){ //Scrolls
            var itemSet = new Array(2043000,2043100,2043200,2043300,2043700,2043800,2044000,2044100,2044200,2044300,2044400,2044500,2044600,2044700,2044800,2044900);
            var matSet = new Array(new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),
                new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),
                new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001),new Array(4001124,4010001));
            var matQtySet = new Array(new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),
                new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),new Array(100, 10),
                new Array(100, 10));
            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            var prompt = "흐음. #t" + item + "#를 만들어 보고 싶은가?  #t" + item +"#를 만들기 위해선 #b#t4001124##k과 #b강철의 원석 10개#k가 필요하다네.";
            if (mats instanceof Array){
                for(var i = 0; i < mats.length; i++){
                    prompt += "\r\n#i"+mats[i]+"# #t" + mats[i] + "# " + matQty[i] + "개";
                }
            }
            else {
                prompt += "\r\n#i"+mats+"# #t" + mats + "# " + matQty + "개";
            }
            cm.sendYesNo(prompt);
        } 
        else if(selectedType == 2){
            status = 3;
            var itemSet = new Array(4000276,4000277,4000278,4000279,4000280,4000291,4000292,4000286,4000287,4000293, 4000294,4000298,4000284,4000288,4000285,4000282,4000295,4000289,4000296,4031435);
            item = itemSet[selectedItem];
            var prompt = "정말 나에게 #b#t " + item + "# 100개를 기부해 줄텐가?#k";
            cm.sendYesNo(prompt);
        }
    }else if (status == 3 && mode == 1) {
		if (selectedType == 2)
		{
			if (cm.haveItem(item, 100))
			{
				if (!cm.canHold(4001124))
				{
					cm.sendOk("흐음. 구슬을 받을 인벤토리 공간이 부족한건 아닌지 확인해 보게나.");
					cm.dispose();
					return;
				}
				cm.gainItem(4001124, 1);
				cm.gainItem(item, -100);
				cm.dispose();
				cm.sendOk("고맙네~ 다음에도 부탁하겠네.");
				return;
			}
		}


        var complete = false;
        if (mats instanceof Array) {
            for(var i = 0; i < mats.length; i++)
            {
                if (matQty[i] == 1)	{
                    if (!cm.haveItem(mats[i]))
                    {
                        complete = false;
                    }
                }
                else {
                    var count = 0;
                    var iter = cm.getInventory(4).listById(mats[i]).iterator();
                    while (iter.hasNext()) {
                        count += iter.next().getQuantity();
                    }
                    if (count < matQty[i])
                        complete = false;
                }					
            }
        }
        else {
            if (!cm.haveItem(mats[i], matQty))
                complete = false;
        }
			
        if (!complete || !cm.canHold(item))
            cm.sendOk("재료가 부족하거나 인벤토리에 공간이 부족한건 아닌지 확인해 보게나.");
        else {
            if (mats instanceof Array) {
                for (var i = 0; i < mats.length; i++){
                    cm.gainItem(mats[i], -matQty[i]);
                }
            }
            else
                cm.gainItem(mats, -matQty);
			cm.gainItem(item, 1);
        }
        cm.dispose();
    }
}
		
