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
 * NPCID : 2012000
 * ScriptName : sell_ticket
 * NPCNameFunc : 이프
 * Location : 200000100 (오르비스 - 오르비스매표소)
 * 
 * @author T-Sun
 *
 */

var ticket = new Array(4031047, 4031074, 4031331, 4031576);
var ticket2 = new Array(4031046, 4031073, 4031330, 4031575);
var cost = new Array(3000, 2000, 2000, 2000);
var cost2 = new Array(1500, 1000, 1000, 1000);
var tmsg = new Array(15, 10, 10, 10);
var mapNames = new Array("빅토리아 아일랜드의 엘리니아", "루디브리엄", "미나르숲의 리프레", "니할 사막의 아리안트");
var select;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode == -1) {
        cm.dispose();
    } else {
        if(mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if(mode == 0) {
            cm.sendNext("그런가요? 여러곳으로 여행하는건 즐거운 일이지만 아직 볼일이 남아있으신가 보죠? 마음이 바뀌시면 다시 찾아오세요.");
            cm.dispose();
            return;
        }
        if(mode == 1) {
            status++;
        }
        if(status == 0) {
            var where = "안녕하세요. 어느곳으로 가고 싶으세요? 원하는 곳에 가시려면 여기서 표를 구입하셔야 한답니다.";
            for (var i = 0; i < ticket.length; i++) {
                where += "\r\n#L" + i + "##b" + mapNames[i] + "#k#l";
            }
            cm.sendSimple(where);
        } else if(status == 1) {
            select = selection;
            lvl = cm.getPlayerStat("LVL");
            if (lvl < 30) {
                cm.sendYesNo(""+mapNames[select]+" 로 가는 배는 매 "+tmsg[select]+" 분 마다 출발하고 있으며, 요금은 #b"+cost2[select]+" 메소#k입니다. 정말 #b#t"+ticket2[select]+"##k을 구입하시겠어요?");
            } else {
                cm.sendYesNo(""+mapNames[select]+" 로 가는 배는 매 "+tmsg[select]+" 분 마다 출발하고 있으며, 요금은 #b"+cost[select]+" 메소#k입니다. 정말 #b#t"+ticket[select]+"##k을 구입하시겠어요?");
            }
        } else if(status == 2) {
            if (lvl < 30) {
                if(cm.getMeso() < cost2[select] || !cm.canHold(ticket2[select])) {
                    cm.sendOk("확실히 #b"+cost2[select]+" 메소#k를 잘 가지고 계신건가요? 아니면 인벤토리가 가득찬건 아닌지 확인해 주세요.");
                    cm.dispose();
                } else {
                    cm.gainMeso(-cost2[select]);
                    cm.gainItem(ticket2[select],1);
                    cm.sendOk("#b#t"+ticket2[select]+"##k은 잘 받으셨나요? 배는 오른쪽 포탈을 통해 정거장으로 가시면 탑승하실 수 있답니다. 배 출발 시간에 늦지 않게 탑승해주세요~");
                    cm.dispose();
                }
            } else {
                if(cm.getMeso() < cost[select] || !cm.canHold(ticket[select])) {
                    cm.sendOk("확실히 #b"+cost[select]+" 메소#k를 잘 가지고 계신건가요? 아니면 인벤토리가 가득찬건 아닌지 확인해 주세요.");
                    cm.dispose();
                } else {
                    cm.gainMeso(-cost[select]);
                    cm.gainItem(ticket[select],1);
                    cm.sendOk("#b#t"+ticket[select]+"##k은 잘 받으셨나요? 배는 오른쪽 포탈을 통해 정거장으로 가시면 탑승하실 수 있답니다. 배 출발 시간에 늦지 않게 탑승해주세요~");
                    cm.dispose();
                }
            }
        }
    }
}
