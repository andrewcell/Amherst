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
 * NPCID : 1072004
 * ScriptName : inside_swordman
 * NPCNameFunc : 전사 전직교관
 * Location : 108000302 (히든스트리트 - 전사의바위산)
 * Location : 108000301 (히든스트리트 - 전사의바위산)
 * Location : 108000300 (히든스트리트 - 전사의바위산)
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
        if (cm.haveItem(4031013, 30)) {
            cm.sendNext("호오, 대단하군. 이렇게나 많은 검은 구슬을 모아올 줄이야. 좋네. 자네를 인정해주겠네. 이것을 갖고 주먹펴고일어서님께 돌아가 보게나.")
        } else {
            cm.sendYesNo("흐음. 아직 검은 구슬 30개는 모으지 못한 것 같군. 아직 검은구슬은 다 모으지 못했지만 바깥으로 나가고 싶은가? 지금 포기하면 처음부터 다시 시작해야한다네.");
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("그렇지. 아직 포기하기엔 이르다네. 조금만 더 노력해 보게");
            cm.dispose();
            return;
        }
        if (cm.haveItem(4031013, 30) && cm.canHold(4031012)) {
            cm.gainItem(4031012, 1);
        } else {
        cm.warp(102020300);
	    cm.dispose();
	    return;
        }
        cm.removeAll(4031013);
        cm.warp(102020300);
        cm.dispose();
    }
}