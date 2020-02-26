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
 * NPCID : 1081001
 * ScriptName : florina1
 * NPCNameFunc : 파이슨 - 여행가이드
 * Location : 110000000 (플로리나로드 - 플로리나비치)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var returnmap;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	cm.sendNext("아직 이곳에서 볼일이 남은 모양이지? #m"+returnmap+"# 맵으로 돌아가고 싶다면 언제든지 내게 말을 걸어주게.");
	cm.dispose();
	return;
    }
    if (status == 0) {
	returnmap = cm.getSavedLocation("FLORINA");
	cm.sendYesNo("음? 정말 #b#m110000000##k를 떠나고 싶은가? 그렇다면 #b#m"+returnmap+"##k 맵으로 돌아가고 싶은건가?");
    } else if (status == 1) {
	cm.warp(returnmap);
	cm.clearSavedLocation("FLORINA");
	cm.dispose();
    }
}
