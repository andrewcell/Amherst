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
 * NPCID : 9000044
 * ScriptName : itemDoyo
 * NPCNameFunc : 길 잃은 도요새
 * Location : 910021000 (히든스트리트 - 높은 가지 아래)
 * Location : 910020104 (히든스트리트 - 도움닫기 발판으로 가는 가시덤불)
 * Location : 910020101 (히든스트리트 - 도움닫기 발판으로 가는 가시덤불)
 * Location : 910020100 (히든스트리트 - 도움닫기 발판으로 가는 가시덤불)
 * Location : 910020103 (히든스트리트 - 도움닫기 발판으로 가는 가시덤불)
 * Location : 910020102 (히든스트리트 - 도움닫기 발판으로 가는 가시덤불)
 * Location : 910020204 (히든스트리트 - 도움닫기 발판으로 가는 루팡의 놀이터)
 * Location : 910020203 (히든스트리트 - 도움닫기 발판으로 가는 루팡의 놀이터)
 * Location : 910020202 (히든스트리트 - 도움닫기 발판으로 가는 루팡의 놀이터)
 * Location : 910020201 (히든스트리트 - 도움닫기 발판으로 가는 루팡의 놀이터)
 * Location : 910020200 (히든스트리트 - 도움닫기 발판으로 가는 루팡의 놀이터)
 * Location : 910020300 (히든스트리트 - 도움닫기 발판으로 가는 점프대)
 * Location : 910020301 (히든스트리트 - 도움닫기 발판으로 가는 점프대)
 * Location : 910020302 (히든스트리트 - 도움닫기 발판으로 가는 점프대)
 * Location : 910020303 (히든스트리트 - 도움닫기 발판으로 가는 점프대)
 * Location : 910020304 (히든스트리트 - 도움닫기 발판으로 가는 점프대)
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