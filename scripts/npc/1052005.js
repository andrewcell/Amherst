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
 * NPCID : 1052005
 * ScriptName : face_henesys2
 * NPCNameFunc : 돌팔이 - 무면허 의사
 * Location : 100000103 (빅토리아로드 - 헤네시스성형외과)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var beauty = 0;
var needItem = 5152000;

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
	cm.sendNext("험험. 이래뵈도 성형 수술 경력만 30년일세. 다만 원하는 얼굴이 나오지 않을수도 있지만.. #b#t"+needItem+"##k 을 가져오시면 무작위로 얼굴을 바꿔줄 수 있다네.");
    } else if (status == 1) {
	cm.sendYesNo("정말로 무작위로 얼굴을 바꿔보고 싶은가? 무슨 얼굴로 바뀌어도 책임지지 않는다네.");
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
	    cm.sendOk("자. 다 되었다네. 마음에 들었으면 좋겠군..");
	} else {
	    cm.sendOk("쿠폰이 없으면 얼굴을 바꿔줄 수 없다네.");
	}
	cm.dispose();
    }
}
