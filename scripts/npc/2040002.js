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
 * NPCID : 2040002
 * ScriptName : ludi023
 * NPCNameFunc : 장난감병정 올슨
 * Location : 221024400 (에오스탑 - 에오스탑100층)
 * 
 * @author T-Sun
 *
 */
var dh;
var entry = true;

function start() {
    dh = cm.getEventManager("DollHouse");
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode == 0 && status == 0) {
	cm.sendNext("흐음.. 그런가요? 아쉽군요. 뭐 마음이 바뀌면 다시 찾아오세요.");
	cm.dispose();
	return;
    } else if(mode == 0 && status == 2) {
	cm.sendNext("흐음.. 아쉽군요. 부탁을 들어주실 준비가 되시면 찾아와주세요.");
	cm.dispose();
	return;
    }
    if (mode == 1) {
	status++;
    } else {
	status--;
    }
    if(cm.getQuestStatus(3230) == 1) {
	if(status == 0) {
	    cm.sendYesNo("흠.. #b#p2040001##k에게 얘기 많이 들었습니다. 그의 지루함을 달래기 위해서 많은 #b#t4031093##k를 가져다 주셨다구요.. 음.. 혹시 저를 도와주시지 않겠어요?");
	} else if(status == 1) {
	    cm.sendNext("감사합니다. 사실 #b#p2040001##k는 당신의 능력을 테스트하고 이 일을 해결할 자질이 있는지 시험해 봤습니다. 그래서 음.. 충분히 가능하실 것 같군요.");
	} else if(status == 2) {
	    cm.sendYesNo("다른 차원에서 온 괴물이 여기까지 와서 시계추를 훔쳐갔지 뭐에요. 이 방 안의 인형의 집 안에 그것을 숨겼는데 모두 똑같이 생겨서 어느게 어느건질 분간할 수 없더군요. 당신이 도와주시겠어요?");
	
	} else if(status == 3) {
	    cm.sendNext("감사합니다. 이 안에 보시면 많은 인형의 집이 있을테지만, 그 중 단 하나의 인형의 집만 아주 살짝 다른 모양을 하고 있다고 합니다. 어느건지는 직접 찾아봐주시기 바랍니다. 그리고 #b#v4031145# #t4031145##k를 찾아와 주시면 됩니다.");
	} else if(status == 4) {
	    if(dh == null || cm.getPlayerCount(922000010) > 0) {
		cm.sendPrev("이미 이 안에서 다른 사람이 시계추를 찾고 있는 것 같군요. 나중에 다시 찾아와주세요.");
	    } else {
		cm.removeAll(4031093);
		dh.startInstance(cm.getChar());
	    }
	    cm.dispose();
	}
    } else if(cm.getQuestStatus(3230) == 2) {
	cm.sendNext("저번에 저를 도와주신 분이군요. 그땐 정말 감사했습니다. 하하하~");
	cm.dispose();
    } else {
	cm.sendOk("저는 누구도 이 방에 들어가는것을 막기 위해 이 곳을 지키고 있지요. 죄송하지만 이제 저는 할 일을 해야겠군요.");
	cm.dispose();
    }
}