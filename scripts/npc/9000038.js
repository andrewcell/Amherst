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
 * NPCID : 9000038
 * ScriptName : Raid_party
 * NPCNameFunc : 요원 냥
 * Location : 970030000 (히든스트리트 - 요원강화 특별훈련장)
 * Location : 970030007 (히든스트리트 - 두번째 쉼터)
 * Location : 970030006 (히든스트리트 - 첫번째 쉼터)
 * Location : 970030010 (히든스트리트 - 마지막 쉼터)
 * Location : 970030009 (히든스트리트 - 네번째 쉼터)
 * Location : 970030008 (히든스트리트 - 세번째 쉼터)
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