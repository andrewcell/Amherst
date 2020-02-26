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
 * NPCID : 9201035
 * ScriptName : ringChange
 * NPCNameFunc : 제이콥 - 결혼반지 교환
 * Location : 680000000 ( - )
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
        var entry = cm.getMarriageData();
        if (entry != null && entry.getStatus() == 2) {
            var haveEngagementRing = false;
            for (var i = 4210000; i <= 4210011; ++i) {
                if (!haveEngagementRing && cm.haveItem(i, 1)) {
                    haveEngagementRing = true;
                    break;
                }
            }
            if (haveEngagementRing) {
                // 약혼반지 소유중
                cm.sendYesNo("안녕~♥ 어디선가 고소한 신혼의 냄새가 나는군~♥ 저런저런 아직도 약혼반지를 끼고 있는거야? 결혼을 했으면 멋~진 결혼반지로 바꿔줘야 하지 않겠어? 원한다면 내가 바꿔줄 수도 있는데 말이지 어때?")
                return;
            }
        }
        cm.sendOk("흠흠, 아름다운 사랑의 향기가 나는 것 같지 않아~♥?");
        cm.safeDispose();
    } else if (status == 1) {
        cm.sendNext("결혼반지는 착용할 수도 있으니까 꼭 한변 껴봐~♥");
    } else if (status == 2) {
        if (!cm.exchangeWeddingRing()) {
            cm.sendOk("장비 인벤토리 공간이 부족하거나 약혼반지를 제대로 갖고 있는지 확인해줄래?");
        }
        cm.dispose();
    }
}