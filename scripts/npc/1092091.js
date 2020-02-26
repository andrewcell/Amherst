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
 * NPCID : 1092091
 * ScriptName : mom_cow
 * NPCNameFunc : 엄마 젖소
 * Location : 912000100 (히든스트리트 - 노틸러스호 외양간)
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
        qr1 = cm.getQuestRecord(126640);
        qr2 = cm.getQuestRecord(126641);
        if (qr1.getCustomData() == null) {
            qr1.setCustomData("0");
        }
        if (qr2.getCustomData() == null) {
            qr2.setCustomData("0");
        }
        if (qr1.getCustomData().equals("0")) {
            qr1.setCustomData("1");
            qr2.setCustomData("1");
            cm.sendOk("우유를 적당히 채웁니다. 우유가 우유통의 1/3 정도 차있습니다.");
            cm.dispose();
        } else if (qr1.getCustomData().equals("1")) {
            if (qr2.getCustomData().equals("1")) {
                cm.sendOk("우유가 더 이상 나오지 않습니다.");
                cm.dispose();
            } else {
                qr1.setCustomData("2");
                qr2.setCustomData("1");
                cm.sendOk("우유를 적당히 채웁니다. 우유가 우유통의 2/3 정도 차있습니다.");
                cm.dispose();
            }
        } else if (qr1.getCustomData().equals("2")) {
            if (qr2.getCustomData().equals("1")) {
                cm.sendOk("우유가 더 이상 나오지 않습니다.");
                cm.dispose();
            } else {
                if (!cm.canHold(4031850)) {
                    cm.sendOk("인벤토리 공간이 부족합니다.");
                    cm.dispose();
                    return;
                }
                qr1.setCustomData("3");
                qr2.setCustomData("1");
                cm.sendOk("우유를 적당히 채웁니다. 우유통에 우유가 가득 차있습니다.");
                cm.gainItem(4031850, 1);
                cm.dispose();
            }
        } else {
            cm.sendOk("이미 우유통에 우유가 가득 차있습니다.");
            cm.dispose();
        }
    }
}