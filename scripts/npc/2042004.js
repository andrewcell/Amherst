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
 * NPCID : 2042004
 * ScriptName : mc_roomout
 * NPCNameFunc : 조수 블루 - 몬스터 카니발
 * Location : 980000400 (몬스터 카니발 - 카니발 필드4<대기실>)
 * Location : 980000600 (몬스터 카니발 - 카니발 필드6<대기실>)
 * Location : 980000200 (몬스터 카니발 - 카니발 필드2<대기실>)
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
        var eim = cm.getPlayer().getEventInstance();
        eim.broadcastPlayerMsg(5, "누군가가 나가기 엔피시를 클릭하여 모두 나가집니다.");
        eim.disposeIfPlayerBelow(100, 980000000);
        cm.dispose();
    }
}