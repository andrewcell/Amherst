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
 * NPCID : 1052011
 * ScriptName : subway_out
 * NPCNameFunc : 나가는 곳
 * Location : 103000907 (3호선공사장 - B3<2구역>)
 * Location : 103000906 (3호선공사장 - B3<1구역>)
 * Location : 103000904 (3호선공사장 - B2<2구역>)
 * Location : 103000908 (3호선공사장 - B3<3구역>)
 * Location : 103000903 (3호선공사장 - B2<1구역>)
 * Location : 103000901 (3호선공사장 - B1<2구역>)
 * Location : 103000900 (3호선공사장 - B1<1구역>)
 * 
 * @author T-Sun
 *
 */

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status >= 0 && mode == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendYesNo("이곳에서 나가 매표소로 돌아가고 싶으세요? 입장권은 반환되지 않습니다.");
    } else if (status == 1) {
	cm.warp(103000000, 0);
	cm.dispose();
    }
}