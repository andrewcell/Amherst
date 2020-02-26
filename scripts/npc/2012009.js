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
 * NPCID : 2012009
 * ScriptName : face_orbis2
 * NPCNameFunc : 리자 - 보조 의사
 * Location : 200000201 (오르비스공원 - 오르비스성형외과)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var beauty = 0;
var needItem = 5152004;

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
	cm.sendNext("가격이 저렴한 성형수술을 찾으시나요? #b#t"+needItem+"##k 을 가져오시면 무작위로 얼굴을 바꿔드리고 있습니다.");
    } else if (status == 1) {
	cm.sendYesNo("정말 무작위로 성형수술을 하시고 싶으신가요? 신중하게 결정해 주세요..");
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
	    cm.sendOk("시술이 끝났습니다. 시술결과가 마음에 드셨으면 좋겠군요.");
	} else {
	    cm.sendOk("쿠폰이 없으시다면 성형수술을 해드릴 수 없습니다.");
	}
	cm.dispose();
    }
}
