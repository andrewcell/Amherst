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
 * NPCID : 2095000
 * ScriptName : s4mind
 * NPCNameFunc : 델리
 * Location : 925010200 (히든스트리트 - 델리를 찾으러 가는 길3)
 * Location : 925010400 (히든스트리트 - 노틸러스호 피난처)
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
    var mapid = cm.getPlayer().getMapId();
    if (mapid == 925010200) {
        if (status == 0) {
            cm.sendNext("당신은 누구시죠..? 네..? 슈린츠가 보내서 왔다구요?");
        } else if (status == 1) {
            cm.sendYesNo("다행이다.. 정말 무서웠어요. 그런데 아직도 저를 노리는 무서운 몬스터들이 많이 있어요. 그 몬스터들을 물리쳐 주시면 좋겠어요.");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("... 실망이에요.");
                cm.dispose();
            } else {
                cm.sendNext("정말 감사해요, 6분 동안 몬스터들로부터 저를 보호해 주시면 된답니다.");
            }
        } else if (status == 3) {
            var em = cm.getEventManager("ProtectDelli");
            em.setProperty("protect", "1");
            var eim = cm.getPlayer().getEventInstance();
            eim.restartEventTimer(360000);
            cm.warp(925010300);
            cm.dispose();
        }
    } else {
        if (cm.isQuestActive(6410)) {
            if (status == 0) {
                cm.sendNext("저를 구해주셔서 정말 고마워요. 당신은 친절한 사람이군요.");
            } else if (status == 1) {
                cm.forceStartQuest(6411, "p2");
                cm.showQuestClear(6410);
                cm.dispose();
            }
        } else {
            cm.warp(120000104);
            cm.dispose();
        }
    }
}