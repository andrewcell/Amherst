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
 * NPCID : 9000041
 * ScriptName : Donation
 * NPCNameFunc : 기부함
 * Location : 105040300 (던전 - 슬리피우드)
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * Location : 120000000 (빅토리아로드 - 노틸러스 선착장)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 100000200 (빅토리아로드 - 헤네시스공원)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.isQuestActive(29503)) {
            var d = cm.getPlayer().getOneInfo(29503, "trymap");
            if (d == cm.getPlayer().getMapId()) {
                if (cm.getPlayer().getMeso() < 100000) {
                    cm.sendOk("최소 기부 금액은 10만 메소 입니다.");
                    cm.dispose();
                    return;
                }
                cm.sendGetNumber("얼마를 기부하시겠습니까? 최소 기부금액은 100,000 메소입니다.\r\n기부 가능 최대금액은 2,147,483,647 메소입니다.\r\n#b< 현재 소지금액 : " + cm.getPlayer().getMeso() + " 메소 >#k", 100000, 100000, Math.min(cm.getPlayer().getMeso(), (2147483647 - parseInt(cm.getPlayer().getOneInfo(29503, "money")))));
            } else {
                cm.sendOk("내가 기부하려는 마을은... #b#m" + d + "##k였던가?");
                cm.dispose();
            }
        } else {
            cm.sendOk("자율적인 기금을 받는 자선 냄비다.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (cm.getPlayer().getMeso() >= selection) {
            if (2147483647 - parseInt(cm.getPlayer().getOneInfo(29503, "money")) < selection) {
                cm.sendOk("기부하려는 액수가 너무 큽니다. " + (2147483647 - parseInt(cm.getPlayer().getOneInfo(29503, "money"))) + " 메소 이하로 입력해 주세요.");
                cm.dispose();
                return;
            }
            cm.sendOk(selection + " 메소를 기부하셨습니다. 마을 사람들은 당신의 선행을 잊지 않을 것입니다.");
            cm.gainMeso(-selection);
            cm.getPlayer().updateOneInfo(29503, "money", (parseInt(cm.getPlayer().getOneInfo(29503, "money")) + selection));
        }
        cm.dispose();
        //
    }
}