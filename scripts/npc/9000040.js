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
 * NPCID : 9000040
 * ScriptName : medal_rank
 * NPCNameFunc : 달리어 - 명예의 신관
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
        cm.sendSimple(
                "보고싶은 랭킹을 선택하시오.\r\n\r\n#b \n\
#L0#메이플 아이돌스타#l\r\n \
#L1#전설적인 사냥꾼#l\r\n \
#L2#핑크빈 슬레이어#l\r\n \
#L3#혼테일 슬레이어#l\r\n \
#L4#리스항구 기부왕#l\r\n \
#L5#헤네시스 기부왕#l\r\n \
#L6#페리온 기부왕#l\r\n \
#L7#엘리니아 기부왕#l\r\n \
#L8#노틸러스 기부왕#l\r\n \
#L9#슬리피우드 기부왕#l\r\n \
#L10#커닝시티 기부왕#l");
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk(cm.getMedalRanking("Pop") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
        } else if (selection == 1) {
            cm.sendOk(cm.getMedalRanking("ExpertHunter") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
        } else if (selection == 2) {
            cm.sendOk(cm.getMedalRanking("PinkbeanSlayer") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
        } else if (selection == 3) {
            cm.sendOk(cm.getMedalRanking("HorntailSlayer") + "\r\n\r\n매월 초에 기록이 초기화된다는 것을 잊지마시오.");
        } else if (selection == 4) {
            cm.sendOk(cm.getMedalRanking("LithDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 5) {
            cm.sendOk(cm.getMedalRanking("HenesysDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 6) {
            cm.sendOk(cm.getMedalRanking("PerionDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 7) {
            cm.sendOk(cm.getMedalRanking("ElliniaDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 8) {
            cm.sendOk(cm.getMedalRanking("NautilusDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 9) {
            cm.sendOk(cm.getMedalRanking("SleepyWoodDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        } else if (selection == 10) {
            cm.sendOk(cm.getMedalRanking("KerningDonor") + "\r\n\r\n현 기부왕의 기부액수는 공개할 수 없으니 이해해 주시오. \r\n그리고 매월 초에 기록이 초기화된다는 것도 잊지 마시오.");
        }
        cm.dispose();
    }
}