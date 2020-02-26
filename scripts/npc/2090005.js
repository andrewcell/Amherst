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
 * NPCID : 2090005
 * ScriptName : crane
 * NPCNameFunc : 학 - 워프 도우미
 * Location : 251000000 (무릉도원 - 백초마을)
 * Location : 250000100 (무릉 - 무릉 사원)
 * Location : 200000141 (오르비스 - 정거장<무릉행>)
 * 
 * @author T-Sun
 *
 */
var menu = new Array("무릉","오르비스","백초마을","무릉");
var cost = new Array(6000,6000,1500,1500);
var hak;
var display = "";
var btwmsg;
var method;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode == 0 && status == 0) {
        cm.dispose();
        return;
    } else if(mode == 0) {
        cm.sendNext("마음이 바뀌면 다시 찾아오세요.");
        cm.dispose();
        return;
    }
    status++;
    if (status == 0) {
        for(var i=0; i < menu.length; i++) {
            if(cm.getMapId() == 200000141 && i < 1) {
                display += "\r\n#L"+i+"##b"+menu[i]+"("+cost[i]+" 메소)#k";
            } else if(cm.getMapId() == 250000100 && i > 0 && i < 3) {
                display += "\r\n#L"+i+"##b"+menu[i]+"("+cost[i]+" 메소)#k";
            }
        }
        if(cm.getMapId() == 200000141 || cm.getMapId() == 251000000) {
            btwmsg = "#b무릉도원#k으로";
        } else if(cm.getMapId() == 250000100) {
            btwmsg = "#b오르비스#k로";
        }
        if(cm.getMapId() == 251000000) {
            cm.sendYesNo("안녕하세요? "+btwmsg+" 가고 싶으신가요? 지금 출발해 보시겠어요? 요금은 #b"+cost[3]+" 메소#k입니다.");
        } else {
            cm.sendSimple("안녕하세요? "+btwmsg+" 가고 싶으신가요? 지금 출발해 보시겠어요? 원하시는 것을 선택해 주세요.\r\n"+display);
        }
    } else if(status == 1) {
        if(selection == 2) {
            cm.sendYesNo("지금 #b"+menu[2]+"#k 쪽으로 가보시겠어요? 요금은 #b"+cost[2]+" 메소#k입니다.");
        } else {
            if(cm.getMeso() < cost[selection]) {
                cm.sendNext("충분한 메소를 소지하시지 않은 것 같군요.");
                cm.dispose();
            } else {
                if(cm.getMapId() == 251000000) {
                    cm.gainMeso(-cost[3]);
                    cm.warp(250000100);
                    cm.dispose();
                } else {
                    cm.gainMeso(-cost[selection]);
                    if (cm.getMapId() == 250000100) {
                        cm.TimeMoveMap(200090310, 200000100, 60);
                    } else {
                        cm.TimeMoveMap(200090300, 250000100, 60);
                    }
                    cm.dispose();
                }
            }
        }
    } else if(status == 2) {
        if(cm.getMeso() < cost[2]) {
            cm.sendNext("충분한 메소르 소지하시지 않은 것 같군요.");
            cm.dispose();
        } else {
            cm.gainMeso(-cost[2]);
            cm.warp(251000000);
            cm.dispose();
        }
    }
}