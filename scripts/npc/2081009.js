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
 * NPCID : 2081009
 * ScriptName : s4blocking_enter
 * NPCNameFunc : 무스
 * Location : 240010400 (미나르숲 - 숲의 갈림길)
 * 
 * @author T-Sun
 *
 */
var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }

    if (status == 0) {
	if (cm.getQuestStatus(6180) == 1) {
	    cm.sendNext("좋아. 방패 수련장으로 보내주도록 하지." );
	} else {
            cm.sendNext("방패 수련장? 어디서 그걸 들은거야?")
	    cm.dispose();
	}
    } else if (status == 1) {
	cm.warp(924000000, 0);
	cm.dispose();
    }
}