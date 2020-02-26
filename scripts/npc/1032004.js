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
 * NPCID : 1032004
 * ScriptName : herb_out
 * NPCNameFunc : 루이스
 * Location : 101000104 (히든스트리트 - 인내의숲<5단계>)
 * Location : 101000100 (히든스트리트 - 인내의숲<1단계>)
 * Location : 101000101 (히든스트리트 - 인내의숲<2단계>)
 * Location : 101000102 (히든스트리트 - 인내의숲<3단계>)
 * Location : 101000103 (히든스트리트 - 인내의숲<4단계>)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var zones = 0;
var selectedMap = -1;

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
	cm.sendYesNo("정말 이곳에서 나가고 #b엘리니아#k로 돌아가고 싶어?");
    } else if (status == 1) {
	cm.warp(101000000,0);
	cm.dispose();
    }
}	