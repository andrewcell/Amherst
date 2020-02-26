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
 * NPCID : 1052100
 * ScriptName : hair_kerning1
 * NPCNameFunc : 돈 지오바네 - 미용실 원장
 * Location : 103000005 (빅토리아로드 - 커닝시티헤어숍)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150003;
var needItemColor = 5151003;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
        cm.sendSimple("커닝시티 헤어샵에 온걸 환영하네! 하하하! 나는 이 헤어샵의 원장, 돈 지오바네 라고 한다네! #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k 을 가져온다면 머리를 아주 아름~답게 손질해주지!\r\n\r\n#b#L0#머리 스타일 바꾸기#l\r\n#L1#머리 색깔 염색하기#l");
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
            cm.askAvatar("어떤 머리 스타일을 원하나?", newAvatar);
        } else if (selection == 1) {
            var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
            newAvatar = [
                currenthaircolo,
                currenthaircolo + 2,
                currenthaircolo + 3,
                currenthaircolo + 7,
                currenthaircolo + 5
            ];
            beauty = 2;
            cm.askAvatar("어떤 머리 색깔을 원하나?", newAvatar);
        }
    } else if (status == 2) {
        if (beauty == 1){
            if (cm.setAvatar(needItemHair, newAvatar[selection]) == 1) {
                cm.sendOk("머리 손질이 끝났다네! 후후. 정말 멋지군! 역시 내 솜씨는 훌륭하다니까!");
            } else {
                cm.sendOk("미안하지만 쿠폰 없이는 머리를 손질해줄 수 없다네.");
            }
        } else {
            if (cm.setAvatar(needItemColor, newAvatar[selection]) == 1) {
                cm.sendOk("머리 손질이 끝났다네! 후후. 정말 멋지군! 역시 내 솜씨는 훌륭하다니까!");
            } else {
                cm.sendOk("미안하지만 쿠폰 없이는 머리를 손질해줄 수 없다네.");
            }
        }
        cm.dispose();
    }
}
