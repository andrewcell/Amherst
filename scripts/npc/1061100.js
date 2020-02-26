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
 * NPCID : 1061100
 * ScriptName : hotel1
 * NPCNameFunc : 호텔 안내원
 * Location : 105040400 (던전 - 슬리피우드호텔)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var regcost = 499;
var vipcost = 999;
var iwantreg = 0;
var iwantvip = 0;
var tempvar;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1)
        cm.dispose();
    else {
        if (mode == 1)
            status++; if (mode == 0 && status == 1) {
            cm.dispose();
            return;
        } if (mode == 0 && status == 2) {
            cm.sendNext("언제라도 피로를 풀고 싶으시면 찾아오세요.");
            cm.dispose();
            return;
        }
        if (status == 0)
            cm.sendNext("안녕하세요~ 슬리피우드 호텔에 오신것을 환영합니다.");
        else if (status == 1)
{            cm.sendSimple("두가지 종류의 사우나가 준비되어 있습니다. 어디로 가보시겠어요?\r\n#b#L0#일반 사우나 입장 (" + regcost + " 메소)#l\r\n#L1#고급 사우나 입장 (" + vipcost + " 메소)#l");
	         }
        else if (status == 2) {
            if (selection == 0) {
                cm.sendYesNo("선택하신 사우나로 입장하시겠습니까? 평소보다 더 많은 HP와 MP가 회복됩니다.");
				iwantreg = 1;
			}
            else if (selection == 1)
{                cm.sendYesNo("고급 사우나를 선택하셨습니다. 정말 그곳으로 입장하시겠습니까? 평소보다 더 많은 HP와 MP가 회복되며, 특별한 아이템을 구매할 수도 있습니다.");
	        iwantvip = 1; }
		        }
        else if (status == 3) {
            if (iwantreg == 1) {
                if (cm.getMeso() >= regcost) {
                    cm.warp(105040401);
                    cm.gainMeso(-regcost);
                } else
                    cm.sendNext("메소가 부족합니다.");
            } else if (iwantvip == 1) {
                if (cm.getMeso() >= vipcost) {
                    cm.warp(105040402);
                    cm.gainMeso(-vipcost);
                } else
                    cm.sendNext("메소가 부족합니다.");
            }
            cm.dispose();
        }
    }
}