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
 * NPCID : 2111024
 * ScriptName : secretNPC
 * NPCNameFunc : 비밀통로
 * Location : 261010000 (제뉴미스트 연구소 - 연구소 1층 복도)
 * Location : 261020200 (알카드노 연구소 - 연구소 B-1 구역)
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
        if (cm.getQuestStatus(3360) >= 1) {
            c = 0; // 제뉴미스트
            if (cm.getPlayer().getMapId() == 261020200) {
                c = 1; // 알카드노
            }
            var qr = cm.getQuestRecord(7062);
            var curCode = qr.getCustomData().substring(c, c + 1);
            if (curCode.equals("0")) {
                cm.sendGetText("비밀번호를 입력하시오.");
            } else {
                cm.playPortalSE();
                cm.warp(261030000, c == 0 ? 2 : 1);
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        var qr1 = cm.getQuestRecord(7061);

        if (cm.getText().equals(qr1.getCustomData())) { // 비밀번호 일치
            var qr = cm.getQuestRecord(7062);
            if (c == 0) {
                qr.setCustomData("1" + qr.getCustomData().substring(1, 2));
            } else if (c == 1) {
                qr.setCustomData(qr.getCustomData().substring(0, 1) + "1");
            }
            cm.playerMessage("보안장치가 해제되었습니다. 출입허가명단에 등록되었습니다.")
            if (qr.getCustomData().equals("11")) {
                cm.setQuestByInfo(3360, "1", true);
            }
            cm.dispose();
        } else {
            cm.sendOk("... 비밀번호가 틀렸습니다.");
            cm.dispose();
        }
    }
}