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
 * NPCID : 2020005
 * ScriptName : oldBook1
 * NPCNameFunc : 알케스터
 * Location : 211000100 (엘나스 - 엘나스시장)
 * 
 * @author T-Sun
 *
 */

var selected;
var amount;
var totalcost;
var item = new Array(2050003, 2050004, 4006000, 4006001);
var cost = new Array(300, 400, 3000, 3000);
var maxelixer = 150;
var elixerprice = 3800;
var maxpelixer = 40;
var pelixerprice = 6800;
var msg = new Array("저주와 봉인 상태이상을 해제하는 아이템일세", "모든 상태이상을 해제하는 아이템일세", "강력한 마법을 사용하는데 필요한 아이템일세", "강력한 소환 마법 아이템을 사용하는데 필요한 아이템일세");
var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 2) {
            cm.sendNext("그런가? 언제든지 필요하면 다시 찾아오게나");
            cm.safeDispose();
            return;
        }
        status--;
    }

    if (status == 0) {
        if (cm.getQuestStatus(3035) == 2) {
            var selStr = "";
            for (var i = 0; i < item.length; i++) {
                selStr += "\r\n#L" + i + "# #b#t" + item[i] + "# (가격: " + cost[i] + " 메소)#k#l";
            }
            marr = cm.getQuestRecord(110310);
            elixer = cm.getQuestRecord(110311);
            pelixer = cm.getQuestRecord(110312);
            if (marr.getCustomData() == null || !marr.getCustomData().equals(cm.getCurrentDate().substr(0,8))) {
                marr.setCustomData(cm.getCurrentDate().substr(0,8));
                elixer.setCustomData(maxelixer);
                pelixer.setCustomData(maxpelixer);
            }
            if (elixer.getCustomData() == null) {
                elixer.setCustomData(maxelixer);
            }
            if (pelixer.getCustomData() == null) {
                pelixer.setCustomData(maxpelixer);
            }
            selStr += "\r\n#L100# #b#t2000004# (가격: "+elixerprice+" 메소) (오늘 남은수량 : " + elixer.getCustomData() + ")#k#l";
            selStr += "\r\n#L101# #b#t2000005# (가격: "+pelixerprice+" 메소) (오늘 남은수량 : " + pelixer.getCustomData() + ")#k#l";
            cm.sendSimple("오오, 자네는 저번에 #b#t4031056##k을 찾아준 고마운 젊은이가 아닌가! 어떻게 찾아왔는가? 무엇인가 필요한 아이템이라도 있는가?#b\r\n" + selStr);
        } else {
            cm.sendNext("나는 이곳에서 30년 이상을 살아온 연금술사, 알케스터라고 한다네.");
            cm.safeDispose();
        }
    } else if (status == 1) {
        selected = selection;
        if (selection >= 100) {
            if (selection == 100) {
                toBuy = 2000004;
                itemDesc = "HP와 MP를 최대 HP/MP의 50% 만큼 회복하는 아이템일세";
                perCost = elixerprice;
            } else if (selection == 101) {
                toBuy = 2000005;
                itemDesc = "HP와 MP를 모두 회복하는 아이템일세";
                perCost = pelixerprice;
            }
        } else {
            toBuy = item[selected];
            itemDesc = msg[selected];
            perCost = cost[selected];
        }
        cm.sendGetNumber("흐음.. #b#t" + toBuy + "##k 을 구매하고 싶단 말이지..? " + itemDesc + ". 몇개를 구매하고 싶은가? 가격은 #b" + perCost + " 메소#k일세.", 1, 1, 100);
    } else if (status == 2) {
        amount = selection;
        totalcost = perCost * amount;
        if (amount == 0) {
            cm.sendOk("If you're not going to buy anything, then I've got nothing to sell neither.");
            cm.dispose();
            return;
        }
        cm.sendYesNo("흠.. #r" + amount + "개의 #t" + toBuy + "##k 아이템을 구매하고 싶다 이건가? 가격은 개당 " + perCost + " 메소일세. 총 가격은 #r" + totalcost + " 메소#k라네. 정말 구매하고 싶은가?");
    } else if (status == 3) {
        if (selected == 100 && parseInt(elixer.getCustomData()) < amount) {
            cm.sendNext("흐음. 오늘 구매할 수 있는 양보다 적게 선택하게나. 오늘은 #b" + parseInt(elixer.getCustomData()) + "#k 개의 엘릭서를 더 구매할 수 있다네.");
            cm.dispose();
            return;
        } else if (selected == 101 && parseInt(pelixer.getCustomData()) < amount) {
            cm.sendNext("흐음. 오늘 구매할 수 있는 양보다 적게 선택하게나. 오늘은 #b" + parseInt(pelixer.getCustomData()) + "#k 개의 파워 엘릭서를 더 구매할 수 있다네.");
            cm.dispose();
            return;
        }



        if (cm.getMeso() < totalcost || !cm.canHold(toBuy)) {
            cm.sendNext("자네.. 분명 메소는 제대로 갖고 있는건가? 아니면 인벤토리 공간이 부족한건 아닌가?");
            cm.dispose();
            return;
        }
        if (selected >= 100) {
            if (selected == 100) {
                elixer.setCustomData((parseInt(elixer.getCustomData()) - amount) + "");
            }
            else if (selected == 101) {
                pelixer.setCustomData((parseInt(pelixer.getCustomData()) - amount) + "");
            }
        }
        cm.sendNext("자, 여기있네. 또 필요하면 언제든지 다시 찾아오게나.");
        cm.gainMeso(-totalcost);
        cm.gainItem(toBuy, amount);
        cm.safeDispose();
    }
}