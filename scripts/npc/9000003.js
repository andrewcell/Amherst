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
 * NPCID : 9000003
 * ScriptName : Event03
 * NPCNameFunc : 바이칸
 * Location : 109010000 (히든스트리트 - 보물을찾아라)
 * 
 * @author T-Sun
 *
 */

var status = 0;
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
        if (cm.haveItem(4031018, 1)) {
            if (cm.haveItem(4031019, 1)) {
                cm.sendOk("흐음? 이미 #r#t4031019##k를 갖고 있는것 같은데? 이미 있다면 받을 수 없다구.");
                cm.safeDispose();
            } else {
                cm.sendNext("오오! 이것은 보물지도! 이것을 내게 주지 않겠나? 이것은 저번에 항해를 하다가 얻은건데 자네에게 필요할 듯 하니 주도록 하겠네. 받기 전에 인벤토리 공간이 있는지 확인해 주게나.");
            }
        } else {
            cm.sendOk("어이! #t4031018#를 얼른 찾아오란 말이야! #t4031018#가 없어서 항해를 나가지 못하고 있잖아!");
            cm.safeDispose();
        }
    } else if (status == 1 ) {
        if (cm.canHold(4031019)) {
            cm.gainItem(4031018, -1);
            cm.sendNext("고맙네~ ");
        } else {
            cm.sendNext("흐음? 인벤토리 공간은 충분히 갖고 있는건가?");
            cm.safeDispose();
        }
    } else if (status == 2) {
        cm.warp(109050000);
        cm.dispose();
    }
}