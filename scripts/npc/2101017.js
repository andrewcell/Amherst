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
 * NPCID : 2101017
 * ScriptName : aMatchPlay
 * NPCNameFunc : 세자르 - 근위대장
 * Location : 980010300 (아리안트 투기대회 - 세번째 투기장 입구)
 * Location : 980010301 (아리안트 투기대회 - 세번째 투기장)
 * Location : 980010201 (아리안트 투기대회 - 두번째 투기장)
 * Location : 980010200 (아리안트 투기대회 - 두번째 투기장 입구)
 * Location : 980010100 (아리안트 투기대회 - 첫번째 투기장 입구)
 * Location : 980010101 (아리안트 투기대회 - 첫번째 투기장)
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
        cm.sendOk("테스트 엔피시 입니다!!");
        cm.safeDispose();
    }
}