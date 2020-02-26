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
 * NPCID : 9001108
 * ScriptName : outmoonFlower
 * NPCNameFunc : 정원지기 월묘
 * Location : 922230102 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230103 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230100 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230101 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230106 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230104 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230105 (히든스트리트 - 은은한 달꽃정원)
 * Location : 922230201 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230200 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230203 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230202 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230205 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230204 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230206 (히든스트리트 - 빛나는 달꽃정원)
 * Location : 922230306 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230305 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230304 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230300 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230301 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230302 (히든스트리트 - 향기로운 달꽃정원)
 * Location : 922230303 (히든스트리트 - 향기로운 달꽃정원)
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