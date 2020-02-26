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
 * NPCID : 2040052
 * ScriptName : library
 * NPCNameFunc : 사서 위즈
 * Location : 222020000 (핼리오스탑 - 핼리오스탑 도서관)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var questid = new Array(3615,3616,3617,3618,3630,3633,3639);
var questitem = new Array(4031235,4031236,4031237,4031238,4031270,4031280,4031298);
var i;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }

    if (status == 0) {
	var counter = 0;
	var books = "";

	for (var i = 0; i < questid.length; i++) {
	    if (cm.getQuestStatus(questid[i]) == 2) {
		counter++;
		books += "\r\n#v"+questitem[i]+"# #b#t"+questitem[i]+"##k";
	    }
	}
	if(counter == 0) {
	    cm.sendOk("#b#h ##k님은 아직 회수하신 책이 없군요.");
	    cm.safeDispose();
	} else {
	    cm.sendNext("어디보자... #b#h ##k님은 총 #b"+counter+"#k권의 책을 회수하셨군요. 다음과 같은 책을 회수하셨습니다.:\r\n"+books);
	}
    } else if (status == 1) {
	cm.sendNextPrev("저희 도서관은 모험가님께 진심으로 감사를 드리고 있습니다. #b#h ##k님의 도움으로, 잃어버린 책들과 이야기들을 다시 찾았답니다. 앞으로도 많은 도움을 부탁드립니다.");
    } else if (status == 2) {
	cm.dispose();
    }
}