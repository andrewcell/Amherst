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
 * NPCID : 2040028
 * ScriptName : ludi024
 * NPCNameFunc : 장난감병정 마크
 * Location : 922000010 (히든스트리트 - 인형의 집)
 * 
 * @author T-Sun
 *
 */

var havePendulum = false;
var complete = false;
var inQuest = false;

function start() {
    if(cm.getQuestStatus(3230) == 1) {
        inQuest = true;
    } else {
        inQuest = false;
    }
    dh = cm.getEventManager("DollHouse");
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode == 0 && status == 0) {
        cm.dispose();
        return;
    } else if(mode == 0 && status == 1) {
        //cm.sendNext("I knew you'd stay. It's important that you finish what you've started! Now please go locate the different-looking dollhouse, break it, and bring #b#t4031094##k to me!");
        cm.dispose();
        return;
    }
    if(mode == 1) {
        status++;
    } else {
        status--;
    }
    if(inQuest == true) {
        if(status == 0) {
            if(cm.haveItem(4031145)) {
                cm.sendNext("오! 그것은 #b#t4031145##k가 아닌가요?! 그것을 제게 주시면 보상은 섭섭치 않게 해드리지요.");
                havePendulum = true;
            } else {
                cm.sendYesNo("아직 #b#t4031145##k를 찾지 못하신건가요? 그렇다면 #b에오스탑 100층#k으로 돌아가시고 싶으세요?");
            }
        } else if(status == 1) {
            if (havePendulum == true) {
                if(!cm.canHold(2000010)) {
                    cm.sendNext("인벤토리 공간이 부족하신건 아닌가요? 소비 인벤토리 탭을 충분히 비워주세요.");
                }
                if(complete == false) {
                    cm.completeQuest(3230);
                    cm.gainExp(2400);
                    cm.gainItem(4031145, -1);
                    cm.gainItem(2000010, 100);
                    complete = true;
                    cm.getPlayer().getEventInstance().removePlayer(cm.getChar());
                    cm.dispose();
                }
            } else {
                cm.getPlayer().getEventInstance().removePlayer(cm.getChar());
                cm.dispose();
            }
        }
    } else {
        if(status == 0) {
            cm.sendNext("What the... we have been forbidding people from entering this room due to the fact that a monster from another dimension is hiding out here. I don't know how you got in here, but I'll have to ask you to leave immediately, for it's dangerous to be inside this room.");
        } else if(status == 1) {
            cm.warp(221024400, 4);
            cm.dispose();
        }
    }
}