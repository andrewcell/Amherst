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
 * NPCID : 2100009
 * ScriptName : face_ariant2
 * NPCNameFunc : 알딘 - 성형외과 의사
 * Location : 260000000 (버닝로드 - 아리안트)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var beauty = 0;
var needItem = 5152029;

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
	cm.sendNext("تحتاج جراحة التجميل؟ بحاجة#b#t"+needItem+"##k");
    } else if (status == 1) {
	cm.sendYesNo("قد تبدأ حقا تفعل؟");
    } else if (status == 2) {
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
	    cm.sendOk("انتهى.");
	} else {
	    cm.sendOk("تفعل أشياء ضرورية.");
	}
	cm.dispose();
    }
}
