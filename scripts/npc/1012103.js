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
 * NPCID : 1012103
 * ScriptName : hair_henesys1
 * NPCNameFunc : 나탈리 - 미용실 원장
 * Location : 100000104 (빅토리아로드 - 헤네시스헤어샾)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 5150001;
var needItemColor = 5151001;

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
        cm.sendSimple("어디가도 멋진 헤어스타일을 만들 곳은 여기 뿐이란 말이지. 서비스를 이용하려면 #b#i"+needItemHair+"# #t"+needItemHair+"##k 또는 #b#i"+needItemColor+"# #t"+needItemColor+"##k 아이템을 가져와야 해요~\r\n\r\n#b#L0#머리 스타일 바꾸기#l\r\n#L1#머리 색깔 염색하기#l");
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
				30480+curColor, 
				30440+curColor, 
				30470+curColor, 
				30410+curColor, 
				30330+curColor, 
				30310+curColor, 
				30210+curColor, 
				30200+curColor, 
				30150+curColor, 
				30140+curColor, 
				30120+curColor, 
				30060+curColor, 
				30670+curColor
                            ];
            } else {
                newAvatar = [
				31050+curColor, 
				31040+curColor, 
				31000+curColor, 
				31070+curColor, 
				31080+curColor, 
				31030+curColor, 
				31340+curColor, 
				31480+curColor, 
				31490+curColor, 
				31410+curColor, 
				31310+curColor, 
				31300+curColor, 
				31160+curColor, 
				31100+curColor, 
				31150+curColor, 
				31640+curColor
                            ];
            }
            cm.askAvatar("오호호~ 어떤 헤어스타일을 원하시나요 고객님?", newAvatar);
        } else if (selection == 1) {
            var currenthaircolo = Math.floor((cm.getPlayerStat("HAIR") / 10)) * 10;
            newAvatar = [
                currenthaircolo + 1,
                currenthaircolo + 2,
                currenthaircolo + 4,
                currenthaircolo + 7
            ];
            beauty = 2;
            cm.askAvatar("머리를 염색하고 싶으시군요? 원하시는 색을 골라보세요.", newAvatar);
        }
    } else if (status == 2) {
        if (beauty == 1){
            if (cm.setAvatar(needItemHair, newAvatar[selection]) == 1) {
                cm.sendOk("자~ 다 되었답니다. 어떠세요? 저희 미용실만의 최고의 솜씨를 발휘해 보았답니다.");
            } else {
                cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 머리 손질을 해드릴 수 없답니다.");
            }
        } else {
            if (cm.setAvatar(needItemColor, newAvatar[selection]) == 1) {
                cm.sendOk("자~ 다 되었답니다. 어떠세요? 저희 미용실만의 최고의 솜씨를 발휘해 보았답니다.");
            } else {
                cm.sendOk("죄송하지만 쿠폰을 가져오시지 않으면 머리 손질을 해드릴 수 없답니다.");
            }
        }
        cm.dispose();
    }
}
