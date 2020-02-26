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
 * NPCID : 2101011
 * ScriptName : cejan
 * NPCNameFunc : 세쟌
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */
var status = 0;
function action(mode, type, selection) {
    if (status == 0) {
        cm.askAcceptDeclineNoESC("거기 누구냐!");
        status++;
    } else if (status == 1) {
        cm.playerMessage("왕비에게 들켜 궁전에서 쫓겨났습니다.");
        cm.warp(260000300);
        cm.dispose();
    }
}