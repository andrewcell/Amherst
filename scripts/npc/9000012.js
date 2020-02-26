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
 * NPCID : 9000012
 * ScriptName : Event09
 * NPCNameFunc : 해리 - 이벤트 도우미
 * Location : 109080003 (히든스트리트 - G★ 코코넛 시즌)
 * Location : 109080002 (히든스트리트 - 코코넛 시즌)
 * Location : 109080001 (히든스트리트 - 코코넛 시즌)
 * Location : 109080000 (히든스트리트 - 코코넛 시즌)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var sel = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {

        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple("즐거운 이벤트에~ 필요한게 있어?\r\n\r\n#b#L0# 이곳에서 나가고 싶어요.#l\r\n#L1# 무기를 구매할래요. (#t1322005# : 가격 -1 메소)#l");
    } else if (status == 1) {
        sel = selection;
        if (selection == 0) {
            cm.sendYesNo("지금 나가면 24시간동안 다른 이벤트에 참여할 수 없어. 정말 지금 나가고 싶어?");
        } else if (selection == 1) {
            cm.sendYesNo("#t1322005#를 1 메소에 구매하고 싶어?");
        }
    } else if (status == 2)  {
        if (sel == 0) {
            cm.warp(109050001);
            cm.dispose();
        } else if (sel == 1) {
            if (cm.canHold(1322005) && cm.getMeso() >= 1) {
                cm.gainMeso(-1);
                cm.gainItem(1322005, 1);
                cm.sendOk("아이템은 I를 누르면 나타나는 인벤토리에서 '장비' 탭을 클릭한 후, 방금 내가 준 #t1322005#를 더블클릭하면 장비할 수 있어. 행운을 빈다구~")
                cm.dispose();
            } else {
                cm.sendOk("인벤토리 공간이 부족하거나 메소가 부족한건 아닌지 확인해 줘.");
                cm.dispose();
            }
        }
    }
}