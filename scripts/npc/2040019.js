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
 * NPCID : 2040019
 * ScriptName : face_ludi2
 * NPCNameFunc : 에버 - 보조 의사
 * Location : 220000003 (루디브리엄 - 루디브리엄성형외과)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var beauty = 0;
var needItem = 5152006;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendNext("싼 요금으로 성형수술을 받고 싶어? 그렇다면 잘 찾아왔군.. #b#t"+needItem+"##k 을 가져온다면 무작위로 얼굴을 바꿔줄게.");
    } else if (status == 1) {
	cm.sendYesNo("정말로 무작위로 얼굴을 바꿔보고 싶어? 신중하게 결정하라구.");
    } else if (status == 2){
	var face = cm.getPlayerStat("FACE");
	var facetype;

        if (cm.getPlayerStat("GENDER") == 0) {
            facetype = [20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20012, 20014, 20016, 20020, 20017];
        } else {
            facetype = [21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21012, 21014, 21016, 21020, 21017];
        }
	for (var i = 0; i < facetype.length; i++) {
	    facetype[i] = facetype[i] + face % 1000 - (face % 100);
	}

	if (cm.setRandomAvatar(needItem, facetype) == 1) {
	    cm.sendOk("시술이 끝났어. 마음에 들었으면 좋겠는데.");
	} else {
	    cm.sendOk("쿠폰이 없으면 얼굴을 바꿔줄 수 없어.");
	}
	cm.dispose();
    }
}