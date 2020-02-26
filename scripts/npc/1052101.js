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
 * NPCID : 1052101
 * ScriptName : hair_kerning2
 * NPCNameFunc : 안드레아 - 미용실 보조
 * Location : 103000005 (빅토리아로드 - 커닝시티헤어숍)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150002;
var needItemColor = 5151002;

function action(mode, type, selection) {
    
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
	cm.sendSimple("이몸은~ 세상 최고의 헤어 디자이너를 꿈꾸는~ 안드레아 라고 하지~ #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k을 가져오시면 무작위로 머리 손질을 해 준다구~ \r\n#b#L0#무작위로 머리 스타일 바꾸기#l\r\n#L1#무작위로 머리 색깔 염색하기#l");
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
                                
				30360+curColor, 
				30370+curColor, 
				30450+curColor, 
				30350+curColor, 
				30190+curColor, 
				30180+curColor, 
				30160+curColor, 
				30130+curColor, 
				30110+curColor, 
				30050+curColor, 
				30040+curColor
                            ];
            } else {
                newAvatar = [
				31050+curColor, 
				31040+curColor, 
				31000+curColor, 
                                
				31010+curColor, 
				31510+curColor, 
				31170+curColor, 
				31180+curColor, 
				31330+curColor, 
				31140+curColor, 
				31130+curColor, 
				31120+curColor, 
				31090+curColor, 
				31060+curColor, 
				31020+curColor, 
				31010+curColor
                            ];
            }
	    cm.sendYesNo("정말로 무작위로 머리 손질을 받고 싶어~? 무슨 결과가 나와도 장담은 못한다구. 뭐 이 안드레아 님의 솜씨라면 뭐든지 아름다울 테지만~");

	} else if (selection == 1) {
	    var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
	    newAvatar = [];
	    beauty = 2;

            newAvatar = [
                currenthaircolo,
                currenthaircolo + 1,
                currenthaircolo + 2,
                currenthaircolo + 4,
                currenthaircolo + 6,
                currenthaircolo + 7
            ];
	    cm.sendYesNo("정말로 무작위로 머리 손질을 받고 싶어~? 무슨 결과가 나와도 장담은 못한다구. 뭐 이 안드레아 님의 솜씨라면 뭐든지 아름다울 테지만~");
	}
    } else if (status == 2){
	if (beauty == 1){
	    if (cm.setRandomAvatar(needItemHair, newAvatar) == 1) {
		cm.sendOk("이 몸의 판타스틱 하고 엘레강스한 ~ 솜씨가 어때? 반해버리겠지?");
	    } else {
		cm.sendOk("쿠폰이 없으면 아무리 이 몸이 관대하다고 해도 머리 손질을 해줄 수 없다구~");
	    }
	} else {
	    if (cm.setRandomAvatar(needItemColor, newAvatar) == 1) {
		cm.sendOk("이 몸의 판타스틱 하고 엘레강스한 ~ 솜씨가 어때? 반해버리겠지?");
	    } else {
		cm.sendOk("쿠폰이 없으면 아무리 이 몸이 관대하다고 해도 머리 손질을 해줄 수 없다구~");
	    }
	}
	cm.safeDispose();
    }
}