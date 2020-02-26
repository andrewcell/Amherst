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
 * NPCID : 1052012
 * ScriptName : go_pc
 * NPCNameFunc : 몽롱 - PC방 안내원
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * 
 * @author T-Sun
 *
 */

var status = -1;
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
        cm.sendYesNo("자네.. 혹시 PC방에서 접속한건 아닌가? 후후.. 그렇다면 이곳으로 들어가 보게. 익숙한 곳을 보게 될거야.");
    } else if (status == 1) {
        if (selection == 1)
            cm.sendOk("자네.. 피시방에서 접속한게 아닌 것 같은데?");
        else
            cm.sendOk("흠.. 그렇다면 어쩔 수 없지.")
        cm.dispose();
    }
}