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
 * NPCID : 2100006
 * ScriptName : hair_ariant1
 * NPCNameFunc : 마즈라 - 미용실 원장
 * Location : 260000000 (버닝로드 - 아리안트)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150027;
var needItemColor = 5151022;

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
        cm.sendSimple("원하는 헤어라도 있는가~? 아리안트 미용실에 잘 오셨네~ #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k 만 있다면 멋진 헤어스타일로 바꿔드리지~\r\n\r\n#b#L0#머리 스타일 바꾸기#l\r\n#L1#머리 색깔 염색하기#l");
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
                
                30470+curColor,
                30490+curColor,
                30230+curColor,
                30200+curColor,
                30260+curColor,
                30290+curColor,
                30160+curColor,
                30050+curColor,
                30630+curColor
                ];
            } else {
                newAvatar = [
                31000+curColor,
                31040+curColor,
                31050+curColor,
                
                31490+curColor,
                31130+curColor,
                31420+curColor,
                31260+curColor,
                31110+curColor,
                31160+curColor,
                31300+curColor,
                31610+curColor,
                31030+curColor
                ];
            }
            cm.askAvatar("어떤 머리로 손질해주길 원하나~?", newAvatar);
        } else if (selection == 1) {
            var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
            newAvatar = [
            currenthaircolo,
            currenthaircolo + 3,
            currenthaircolo + 2,
            currenthaircolo + 4
            ];
            beauty = 2;
            cm.askAvatar("어떤 머리 색으로 원하나?", newAvatar);
        }
    } else if (status == 2) {
        if (beauty == 1){
            if (cm.setAvatar(needItemHair, newAvatar[selection]) == 1) {
                cm.sendOk("머리 손질이 끝났다네!");
            } else {
                cm.sendOk("미안하지만 쿠폰 없이는 머리를 손질해줄 수 없다네.");
            }
        } else {
            if (cm.setAvatar(needItemColor, newAvatar[selection]) == 1) {
                cm.sendOk("머리 손질이 끝났다네!");
            } else {
                cm.sendOk("미안하지만 쿠폰 없이는 머리를 손질해줄 수 없다네.");
            }
        }
        cm.dispose();
    }
}
