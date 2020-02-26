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
 * NPCID : 2041009
 * ScriptName : hair_ludi2
 * NPCNameFunc : 미니 - 헤어샵 보조
 * Location : 220000004 (루디브리엄 - 루디브리엄헤어숍)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150006;
var needItemColor = 5151006;

function action(mode, type, selection) {
    
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
	cm.sendSimple("어서오세요~ #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k을 가져오시면 무작위로 머리 손질을 해 드린답니다. \r\n#b#L0#무작위로 머리 스타일 바꾸기#l\r\n#L1#무작위로 머리 색깔 염색하기#l");
    } else if (status == 1) {
	if (selection == 0) {
	    var hair = cm.getPlayerStat("HAIR");
	    newAvatar = [];
	    beauty = 1;

            var curColor = hair % 10;
            if (cm.getPlayerStat("GENDER") == 0) {
                newAvatar = [
				30030+curColor, 
				30020+curColor, 
				30000+curColor, 
				30510+curColor, 
				30340+curColor, 
				30710+curColor, 
				30300+curColor, 
				30050+curColor, 
				30160+curColor, 
				30190+curColor, 
				30280+curColor, 
				30240+curColor, 
				30150+curColor, 
				30650+curColor];
            } else {
                newAvatar = [
				31040+curColor, 
				31050+curColor, 
				31000+curColor, 
				31520+curColor, 
				31460+curColor, 
				31290+curColor, 
				31280+curColor, 
				31270+curColor, 
				31230+curColor, 
				31160+curColor, 
				31120+curColor, 
				31150+curColor, 
				31010+curColor, 
				31030+curColor, 
				31650+curColor ];
            }
	    cm.sendYesNo("무작위로 머리 손질을 받으시고 싶으신가요? 원하시는것을 정확하게 선택하셨는지 확인해 주시기 바랍니다. 정말 무작위로 머리 손질을 해 드릴까요?");

	} else if (selection == 1) {
	    var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
	    newAvatar = [];
	    beauty = 2;

            newAvatar = [
                currenthaircolo,
                currenthaircolo + 2,
                currenthaircolo + 3,
                currenthaircolo + 4,
                currenthaircolo + 5
            ];
	    cm.sendYesNo("무작위로 머리 손질을 받으시고 싶으신가요? 원하시는것을 정확하게 선택하셨는지 확인해 주시기 바랍니다. 정말 무작위로 머리 손질을 해 드릴까요?");
	}
    } else if (status == 2){
	if (beauty == 1){
	    if (cm.setRandomAvatar(needItemHair, newAvatar) == 1) {
		cm.sendOk("자~ 다 되었답니다. 어떠세요? 마음에 드셨으면 좋겠군요.");
	    } else {
		cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 머리 손질을 해드릴 수 없답니다.");
	    }
	} else {
	    if (cm.setRandomAvatar(needItemColor, newAvatar) == 1) {
		cm.sendOk("자~ 다 되었답니다. 어떠세요? 마음에 드셨으면 좋겠군요.");
	    } else {
		cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 머리 손질을 해드릴 수 없답니다.");
	    }
	}
	cm.safeDispose();
    }
}