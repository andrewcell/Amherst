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
 * NPCID : 2041026
 * ScriptName : giveupTimer
 * NPCNameFunc : 고스트헌터 밥
 * Location : 220070000 (시계탑최하층 - 잊혀진 시간의 길<1>)
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
        if (cm.isQuestActive(3250) && cm.haveItem(4220046)) {
            cm.sendYesNo("정말 타이머 키우기를 포기할거야?");
        } else {
            cm.sendOk("냠냠.. 햄버거가 제일 맛있어.")
            cm.safeDispose();
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.sendOk("수고했어. 다시 키우고 싶어지면 언제든지 나를 찾아와.")
            cm.gainItem(4220046, -1);
            cm.forfeitQuest(3250);
            cm.dispose();
        } else {
            cm.dispose();
        }
    }
}