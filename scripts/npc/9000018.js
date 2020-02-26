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
 * NPCID : 9000018
 * ScriptName : pc_weapon
 * NPCNameFunc : 마틸다 - PC방 무기대여
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 260000000 (버닝로드 - 아리안트)
 * Location : 221000000 (루더스호수 - 지구방위본부)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 100000000 (빅토리아로드 - 헤네시스)
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
        cm.sendOk("PC방 무기 대여가 필요하신가요? 죄송하지만 현재 PC방에서 접속하고 계신것 같지 않군요.");
        cm.safeDispose();
    }
}