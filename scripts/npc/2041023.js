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
 * NPCID : 2041023
 * ScriptName : s4efreet
 * NPCNameFunc : 플로
 * Location : 220050300 (시계탑최하층 - 시간의 통로)
 * 
 * @author T-Sun
 *
 */

function start() {
    if ((cm.getQuestStatus(6225) == 1 && cm.getQuestStatus(6226) == 2) || (cm.getQuestStatus(6315) == 1 && cm.getQuestStatus(6316) == 2)) {
	var ret = checkJob();
	if (ret == -1) {
	    cm.sendOk("먼저 파티를 구성하고 말을 걸어주세요.");
	} else if (ret == 0) {
	    cm.sendOk("파티 인원을 두명으로 맞춰주세요.");
	} else if (ret == 1) {
	    cm.sendOk("파티원 중 한명의 직업이 다른 세계로 입장하는데 맞지 않는 것 같군요.");
	} else if (ret == 2) {
	    cm.sendOk("파티원 중 한명의 레벨이 다른 세계로 입장하는데 맞지 않는 것 같군요.");
	} else {
	    var dd = cm.getEventManager("ElementThanatos");
	    if (dd != null) {
		dd.startInstance(cm.getParty(), cm.getMap());
	    } else {
		cm.sendOk("An unknown error occured.");
	    }
	}
    } else {
	cm.sendOk("속성의 타나토스요..? 지금 당신에겐 그것을 만날 필요 없어 보이는군요.");
    }
    cm.dispose();
}

function checkJob() {
    var party = cm.getParty();

    if (party == null) {
	return -1;
    }
    if (party.getMembers().size() != 2 && cm.getJob() != 500) {
	return 0;
    }
    var it = party.getMembers().iterator();

    while (it.hasNext()) {
	var cPlayer = it.next();

	if (cPlayer.getJobId() == 212 || cPlayer.getJobId() == 222 || cPlayer.getJobId() == 900) {
	    if (cPlayer.getLevel() < 120) {
		return 2;
	    }
	} else {
	    return 1;
	}
    }
    return 3;
}