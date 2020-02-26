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
 * NPCID : 2103008
 * ScriptName : thief_in2
 * NPCNameFunc : 기묘한 목소리
 * Location : 260010401 (히든스트리트 - 바위 언덕)
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
        if (cm.getQuestStatus(3925) == 2 && (cm.getQuestStatus(3926) == 0 || cm.getQuestStatus(3946) == 1)) {
            cm.sendGetText("동굴의 문을 열고 싶다면 암호를 말해라...")
        } else {
            cm.playerMessage("동굴 문은 꿈쩍도 하지 않는다.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (cm.getText().equals("열려라참깨") || cm.getText().equals("열려라 참깨")) {
            cm.playerMessage("암호를 말하자 신비한 힘이 동굴 안으로 인도한다.");
            cm.warp(260010402, 1);
            cm.dispose();
        } else {
            cm.playerMessage("동굴 문은 꿈쩍도 하지 않는다.");
            cm.dispose();
        }
    }
}