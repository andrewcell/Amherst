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
 * NPCID : 2060009
 * ScriptName : aqua_taxi
 * NPCNameFunc : 돌고래
 * Location : 230000000 (아쿠아로드 - 아쿠아리움)
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
        if (cm.getJob() == 0) {
            meso = 1000;
            meso2 = 100;
        } else {
            meso = 10000;
            meso2 = 1000;
        }
        if (cm.haveItem(4031242, 1)) {
            cm.sendSimple("안녕하세요~ 돌고래 택시입니다! 안전하고 편안하게 사각지대까지 모셔다 드립니다. 초보자는 요금을 90% 할인해 드립니다.\r\n\r\n#b#L0# #t4031242#으로 #m230030200#로 갑니다.#l\r\n#L1# " + meso + "메소를 내고 #m251000100#까지 갑니다.#l");
        } else {
            cm.sendSimple("안녕하세요~ 돌고래 택시입니다! 안전하고 편안하게 사각지대까지 모셔다 드립니다. 초보자는 요금을 90% 할인해 드립니다.\r\n\r\n#b#L0# " + meso2 + "메소를 내고 #m230030200#로 갑니다.#l\r\n#L1# " + meso + "메소를 내고 #m251000100#까지 갑니다.#l");
        }
    } else if (status == 1) {
        if (selection == 0) {
            if (cm.haveItem(4031242, 1)) {
                cm.gainItem(4031242, -1);
            } else if (cm.getMeso() >= meso2) {
                cm.gainMeso(-meso2);
            } else {
                cm.sendOk("티켓이나 메소를 분명 제대로 갖고 계신건지 확인해 보세요.");
                cm.dispose();
                return;
            }
            cm.warp(230030200, "st00" );
            cm.dispose();
        } else if (selection == 1) {
            if (cm.getMeso() >= meso) {
                cm.gainMeso(-meso);
                cm.warp(251000100);
                cm.dispose();
            } else {
                cm.sendOk("메소가 부족하신건 아닌지 확인해 보세요.");
                cm.dispose();
            }
        }
    }
}