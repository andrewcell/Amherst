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
 * Quest ID : 2148
 * Quest Name : 소문의 진상-돼지와 함께 춤을
 * Quest Progress Info : #m102000000#에서 오래 살아 온 #b#p1020000##k에게 소문에 대해서 물어보자.
 * Quest End Info : #p1020000#에게 떠도는 소문에 대해 물어보았다.
 * Start NPC : 1020000
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendSimple("무슨 일이지? \r\n#b #L0#귀신나무에 대해 들어보신 적이 있나요?#l");
    } else if (status == 1) {
        qm.sendSimple("귀신나무? 아, 오래 전에 사라졌던 그 거대한 스텀프를 말하는 건가? 아버지의 아버지가 어릴 적에 그런 나무가 있었다는 이야기를 들은 적이 있었다네. 전해져 오는 소문에는 가지마다 붉은 천이 달려있는데 혼령의 피로 물들은거라고 하더군. 하지만 나도 실제로 본 적은 한번도 없다네. 그러니 진실인지는 알 수 없지.#b\r\n #L0#다른 소문은 듣지 못했나요?#l")
    } else if (status == 2) {
        qm.sendNext("애석하게도 나는 소문에 밝은 사람이 아니라네.");
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainExp(100);
        qm.dispose();
    }
}
