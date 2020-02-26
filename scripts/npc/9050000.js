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
 * NPCID : 9050000
 * ScriptName : pigmy0
 * NPCNameFunc : 소환수 피그미
 * Location : 100000000 (빅토리아로드 - 헤네시스)
 * 
 * @author T-Sun
 *
 */
var s_0 = 0;
var sel_0 = 0; 
var sel_1 = 0; 
var status = 0;
var town = Array("헤네시스","엘리니아","커닝시티","페리온","엘나스","루디브리엄","오르비스","아쿠아리움","노틸러스");
var egg = Array(4170000,4170001,4170002,4170003,4170004,4170005,4170006,4170007,4170009);
var canuseincubator = false;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 1 && s_0 == 0) {
            cm.sendNext("피그미가 많이 배고픈 것 같은데... 다음에 생각나면 꼭 먹을 것을 주세요.");
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            var msg = "피그미에게 어떤 행동을 하시겠습니까?\r\n#b";
            msg += "\r\n#L0#맛좋은 사료를 준다.#I";
            msg += "\r\n#L1#피그미가 할 말이 있는 것 같습니다.#I";
            cm.sendSimple(msg);
        } else if (status == 1) {
            s_0 = selection;
            if (selection == 0) {
                var map = cm.getPlayer().getMapId();
                time = cm.getQuestRecord(188100 + getTownCode(map));
                if (time.getCustomData() == null) {
                    time.setCustomData("00000000");
                }
                var curdate = cm.getCurrentDate().substring(0, 8);
                if (cm.haveItem(2120008)) {
                    cm.sendYesNo("피그미가 배고픈 것 같습니다. 귀여운 피그미가 좋아하는 #b맛좋은 사료#k를 주시겠습니까?");
                } else {
                    cm.sendNext("피그미는 아무 것이나 먹지 않습니다. #b맛좋은 사료#k가 있는지 확인해주세요.");
                    cm.dispose();
                }
            } else if (selection == 1) {
                var msg = "피그미가 자신이 낳은 알을 다른 지역의 알과 바꾸어 주겠다고 합니다. 어느 마을 피그미 에그를 교환하시겠습니까?\r\n";
                for (var i = 0; i < town.length; i++) {
                    msg += "\r\n#b#L" + i + "#" + town[i] + "#l#k";
                }
                cm.sendSimple(msg);
            }
        } else if (status == 2) {
            if (s_0 == 0) {
                var map = cm.getPlayer().getMapId();
                if (!cm.canHold(4170000 + getTownCode(map)) || !cm.haveItem(2120008, 1)) {
                    cm.sendOk("인벤토리 공간이 부족하거나 사료를 갖고 있지 않습니다.");
                    cm.dispose();
                    return;
                }
                time.setCustomData(curdate);
                cm.sendNext("피그미가 맛있는 것을 먹고 기분이 좋았는지 알을 낳았습니다.");
                cm.gainItem(2120008, -1);
                cm.gainItem(4170000 + getTownCode(map), 1);
                cm.dispose();
            } else if (s_0 == 1) {
                if (cm.haveItem(egg[selection])) {
                    var msg = "#b" + town[selection] + " 피그미 에그#k를 어느 마을 피그미 에그로 교환하시겠습니까?\r\n";
                    for (var i = 0; i < town.length; i++) {
                        msg += "\r\n#b#L" + i + "#" + town[i] + "#l#k";
                    }
                    cm.sendSimple(msg);
                    sel_0 = selection;
                } else {
                    cm.sendNext("#b#h #님#k은 " + town[selection] + " 피그미 에그를 가지고 있지 않습니다.");
                    cm.dispose();
                }
            }
        } else if (status == 3) {
            if (town[sel_0] == town[selection]) {
                cm.sendNext("같은 마을 에그로는 교환 하실 수 없습니다.");
                cm.dispose();
            } else {
                cm.sendGetNumber("#b#h #님#k은 " + town[sel_0] + " 피그미 에그를 #b" + cm.itemQuantity(egg[sel_0]) + "개#k 가지고 있습니다. 몇 개를 교환하시 겠습니까?\r\n#b< 예 : 3 >#k", 1, 1, cm.itemQuantity(egg[sel_0]));
            }
            sel_1 = selection;
        } else if (status == 4) {
            if (cm.haveItem(egg[sel_0], selection) && cm.canHold(egg[sel_1])) {
                cm.gainItem(egg[sel_0], -selection);
                cm.gainItem(egg[sel_1], selection);
                cm.sendNext("피그미 에그를 교환했습니다.");
            } else {
                cm.sendNext(cm.itemQuantity(egg[sel_0]) + " 이하의 숫자만 가능합니다.");
            }
            cm.dispose();
        }
    }
}


function getTownCode ( mapid ) {
    if (mapid == 100000000)
        return 0;
    if (mapid == 101000000)
        return 1;
    if (mapid == 103000000)
        return 2;
    if (mapid == 102000000)
        return 3;
    if (mapid == 211000000)
        return 4;
    if (mapid == 220000000)
        return 5;
    if (mapid == 200000000)
        return 6;
    if (mapid == 230000000)
        return 7;
    if (mapid == 120000000)
        return 9;
    return 0;
}