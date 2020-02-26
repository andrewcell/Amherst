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
 * NPCID : 1032003
 * ScriptName : herb_in
 * NPCNameFunc : 쉐인
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var check = 0;


function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        val = cm.getQuestStatus(2050);
        val2 = cm.getQuestStatus(2051);
        if (val2 == 0) {
            if (val == 1) {
                nPrice = cm.getPlayerStat("LVL") * 100;
                cm.sendYesNo("사비트라마의 부탁을 받고 온거야? 그냥 들어보내줄 순 없고, 약간의 입장료만 내면 들여보내줄게. 입장료는 " + nPrice + " 메소야.")
            } else if (val == 2) {
                cm.sendNext("다시 왔구나? 요금은 받지 않을게.");
            } else if (val == 0) {
                cm.sendOk("이 안에는 진귀한 약초가 있는 모양이야. 하지만 아무나 들여보내줄 순 없지.")
                cm.dispose();
            }
        } else if (val2 == 1) {
            nPrice = cm.getPlayerStat("LVL") * 200;
            cm.sendYesNo("다시 왔구나? 사비트라마의 부탁을 받고 온거야? 그냥 들어보내줄 순 없고, 약간의 입장료만 내면 들여보내줄게. 입장료는 " + nPrice + " 메소야.");
        } else if (val2 == 2) {
            cm.sendNext("다시 왔구나? 요금은 받지 않을게.");
        }
    } else if (status == 1) {
        if (val2 == 0) {
            if (val == 1) {
                if (selection == 0) {
                    cm.sendYesNo("흠. 마음이 바뀌면 다시 이야기 해.");
                } else {
                    if (cm.getMeso() >= nPrice) {
                        cm.gainMeso(-nPrice);
                        cm.warp(101000100);
                        cm.dispose();
                    }
                }
            } else if (val == 2) {
                cm.warp(101000100);
                cm.dispose();
            }
        } else if (val2 == 1) {
            if (selection == 0) {
                cm.sendYesNo("흠. 마음이 바뀌면 다시 이야기 해.");
            } else {
                if (cm.getMeso() >= nPrice) {
                    cm.gainMeso(-nPrice);
                    cm.warp(101000102);
                    cm.dispose();
                }
            }
        } else if (val2 == 2) {
            cm.warp(101000102);
            cm.dispose();
        }
    }
}	
