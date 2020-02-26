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
 * NPCID : 2111017
 * ScriptName : pipe1
 * NPCNameFunc : 첫번째 파이프손잡이
 * Location : 261000001 (마가티아 - 실종된 연금술사의 집)
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
//        if (cm.isQuestActive(3339)) {
        var qr = cm.getQuestRecord(164201);
        if (qr.getCustomData() == null) {
            qr.setCustomData(cm.shuffle("123"));
        }
        var qr2 = cm.getQuestRecord(164202);
        if (qr2.getCustomData() == null) {
            qr2.setCustomData("");
        }
        if (qr2.getCustomData().length() < 3)
            qr2.setCustomData(qr2.getCustomData() + (cm.getNpc() - 2111016));
        switch (qr2.getCustomData().length()) {
            case 1:
                if (qr.getCustomData().substring(0, 1).equals(qr2.getCustomData().substring(0, 1))) {
                    cm.sendOk("파이프가 날카로운 쇳소리와 함께 오른쪽으로 조금 돌아갔다.");
                } else {
                    qr2.setCustomData("");
                    cm.sendOk("... 파이프가 날카로운 쇳소리와 함께 돌아가려다가 멈추고, 원래대로 돌아갔다. 다시 처음부터 돌려보자.")
                }
                break;
            case 2:
                if (qr.getCustomData().substring(1, 2).equals(qr2.getCustomData().substring(1, 2))) {
                    cm.sendOk("파이프가 날카로운 쇳소리와 함께 왼쪽으로 조금 돌아갔다.");
                } else {
                    qr2.setCustomData("");
                    cm.sendOk("... 파이프가 날카로운 쇳소리와 함께 돌아가려다가 멈추고, 원래대로 돌아갔다. 다시 처음부터 돌려보자.")
                }
                break;
            default:
                if (qr.getCustomData().substring(2, 3).equals(qr2.getCustomData().substring(2, 3))) {
                    //Answer! 암호를 맞춰라
                    cm.sendGetText("파이프가 아래로 움직이면서 보안장치가 나타났다. 암호를 입력해야 한다.")
                    return;
                } else {
                    qr2.setCustomData("");
                    cm.sendOk("... 파이프가 날카로운 쇳소리와 함께 돌아가려다가 멈추고, 원래대로 돌아갔다. 다시 처음부터 돌려보자.")
                }
                break;
        }
        cm.dispose();
//        } else {
//            cm.sendOk("낡아서 녹이 슨 것 같은 쇠 파이프다.")
//            cm.dispose();
//        }
    } else if (status == 1) {
        if (cm.getText().equals("필리아는 내 사랑")) {
            var qr2 = cm.getQuestRecord(164202);
            qr2.setCustomData("");
            var qr = cm.getQuestRecord(164201);
            qr.setCustomData(cm.shuffle("123"));
            cm.playPortalSE();
            cm.warp(261000001, "sec00");
            cm.dispose();
        } else {
            var qr2 = cm.getQuestRecord(164202);
            qr2.setCustomData("");
            var qr = cm.getQuestRecord(164201);
            qr.setCustomData(cm.shuffle("123"));
            cm.sendOk("비밀번호가 틀린 것 같다. 보안장치가 사라지고 파이프가 원상태로 돌아갔다.");
            cm.dispose();
        }
    }
}