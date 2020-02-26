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
 * NPCID : 2010001
 * ScriptName : hair_orbis1
 * NPCNameFunc : 미노 - 헤어샵 원장
 * Location : 200000202 (오르비스공원 - 오르비스헤어샾)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150005;
var needItemColor = 5151005;

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
        cm.sendSimple("오르비스의 멋진 헤어숍 입니다. 여러분의 헤어 스타일을 책임져 드린답니다~ #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k 아이템을 가져와야 해요~\r\n\r\n#b#L0#머리 스타일 바꾸기#l\r\n#L1#머리 색깔 염색하기#l\r\n#L2#산발머리 쿠폰 사용하기");
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
                                
				30520+curColor, 
				30480+curColor, 
				30490+curColor, 
				30460+curColor, 
				30420+curColor, 
				30340+curColor, 
				30290+curColor, 
				30280+curColor, 
				30270+curColor, 
				30260+curColor, 
				30240+curColor, 
				30230+curColor];
            } else {
                newAvatar = [
				
				31040+curColor, 
				31000+curColor, 
				31050+curColor, 
                                
				31440+curColor, 
				31540+curColor, 
				31420+curColor, 
				31320+curColor, 
				31270+curColor, 
				31260+curColor, 
				31250+curColor, 
				31240+curColor, 
				31230+curColor, 
				31220+curColor, 
				31110+curColor, 
				31030+curColor, 
				31530+curColor];
            }
            cm.askAvatar("어떤 헤어 스타일을 원하시나요?", newAvatar);
        } else if (selection == 1) {
            var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
            newAvatar = [
                currenthaircolo,
                currenthaircolo + 1,
                currenthaircolo + 3,
                currenthaircolo + 4,
                currenthaircolo + 5
            ];
            beauty = 2;
            cm.askAvatar("어떤 헤어 색깔을 원하시나요?", newAvatar);
        } else if (selection == 2) {
            beauty = 3;
            if (Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10 == 31240) {
                cm.sendOk("이미 머리 손질이 끝나신 것 같은데요~? 다른 헤어가 필요하시다면 다시 제게 말을 걸어주세요~");
                cm.safeDispose();
            } else if (cm.getPlayerStat("GENDER") == 1) {
                cm.sendYesNo("정말 #i5154000# #t5154000# 아이템을 사용하시겠어요?");
            } else {
                cm.sendOk("죄송하지만 산발머리는 #r여성#k분만 이용이 가능해요. 다른 헤어를 원하신다면 다시 제게 말을 걸어주세요~");
                cm.safeDispose();
            }
        }
    } else if (status == 2) {
        if (beauty == 1){
            if (cm.setAvatar(needItemHair, newAvatar[selection]) == 1) {
                cm.sendOk("헤어 손질이 모두 끝났답니다. 다음에 또 이용해 주세요.");
            } else {
                cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 저희 헤어숍을 이용하실 수 없답니다.");
            }
        } else if (beauty == 2) {
            if (cm.setAvatar(needItemColor, newAvatar[selection]) == 1) {
                cm.sendOk("헤어 손질이 모두 끝났답니다. 다음에 또 이용해 주세요.");
            } else {
                cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 저희 헤어숍을 이용하실 수 없답니다.");
            }
        } else if (beauty == 3) {
            if (cm.setAvatar(5154000, 31240 + (cm.getPlayerStat("HAIR") % 10)) == 1) {
                cm.sendOk("헤어 손질이 모두 끝났답니다. 다음에 또 이용해 주세요.");
            } else {
                cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 저희 헤어숍을 이용하실 수 없답니다.");
            }
        }
        cm.dispose();
    }
}
