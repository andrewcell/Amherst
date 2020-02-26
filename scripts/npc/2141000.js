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
 * NPCID : 2141000
 * ScriptName : PinkBeen_Summon
 * NPCNameFunc : 키르스턴
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
        cm.sendSimple("여신의 거울만 있으면... 다시 검은 마법사를 불러낼 수 있어!... 이, 이상해... 왜 검은 마법사를 불러내지 않는 거지? 이 기운은 뭐지? 검은 마법사와는 전혀 다른... 크아아악!\r\n\r\n#b#L9#(키르스턴의 어깨에 손을 댄다.)#l#k");
    } else if (status == 1) {
        cm.showNpcSpecialEffect("magic");
        cm.handlePinkbeanSummon(2000);
        cm.dispose();
    }
}