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
 * NPCID : 1072001
 * ScriptName : change_magician
 * NPCNameFunc : 마법사 전직교관
 * Location : 101020000 (빅토리아로드 - 엘리니아북쪽숲)
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
	if (cm.haveItem(4031009, 1)) {
            cm.sendYesNo("호오. 그것은 하인즈님의 편지가 아닌가? 자네가 바로 그 여행자인가 보군. 자, 이 안에서 수련을 받아보겠는가?");
        } else {
            cm.sendOk("흠.. 여기까지 어쩐 일인가?");
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("흐음? 수련을 받지 않는건가?");
            cm.dispose();
        } else if (selection == 1) {
            if (cm.haveItem(4031009, 1)) {
                cm.gainItem(4031009, -1);
                cm.removeAll(4031013);
                var rNum = cm.rand(0, 2);
                cm.warp(108000200 + rNum);
                cm.dispose();
            }
        }
    }
}	