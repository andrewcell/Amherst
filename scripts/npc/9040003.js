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
 * NPCID : 9040003
 * ScriptName : guildquest1_NPC1
 * NPCNameFunc : 샤렌 3세의 영혼
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start() {
	action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1)
	status++;
    else {
	cm.dispose();
	return;
	}

    if (status == 0) {
	if (cm.getEventInstance().getProperty("leader").equals(cm.getPlayer().getName())) {
	    if (cm.getEventInstance().getProperty("stage4clear") != null && cm.getEventInstance().getProperty("stage4clear").equals("true")) {
		cm.sendOk("드디어 샤레니안을 구할 사람을 찾았구나.. 이제.. 편히 잠들 수 있겠어..");
		cm.safeDispose();
	    } else {
		var prev = cm.getEventInstance().setProperty("stage4clear","true",true);
		if (prev == null) {
		    cm.sendNext("드디어 샤레니안을 구할 사람을 찾았구나.. 이제.. 편히 잠들 수 있겠어..");
		} else { //if not null, was set before, and Gp already gained
		    cm.sendOk("드디어 샤레니안을 구할 사람을 찾았구나.. 이제.. 편히 잠들 수 있겠어..");
		    cm.safeDispose();
		}
	    }
	} else {
	    if (cm.getEventInstance().getProperty("stage4clear") != null && cm.getEventInstance().getProperty("stage4clear").equals("true"))
		cm.sendOk("드디어 샤레니안을 구할 사람을 찾았구나.. 이제.. 편히 잠들 수 있겠어..");
	    else
		cm.sendOk("파티장이 내게 말을 걸어야 한다네...");
	    cm.safeDispose();
	}
    } else if (status == 1) {
	cm.gainGP(10);
	cm.getMap().getReactorByName("ghostgate").forceHitReactor(1);
	cm.showEffect(true, "quest/party/clear");
	cm.playSound(true, "Party1/Clear");
	cm.dispose();
    }
}