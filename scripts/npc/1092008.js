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
 * NPCID : 1092008
 * ScriptName : s4mind_in
 * NPCNameFunc : 슈린츠
 * Location : 120000104 (노틸러스호 - 훈련장)
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
        if (cm.isQuestActive(6410)) {
            cm.sendYesNo("그럼 지금 바로 델리를 구하러 가볼래?");
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 1) {
            var qr = cm.getQuestRecord(6411);
            if (qr.getCustomData() == null) {
                var em = cm.getEventManager("ProtectDelli");
                if (em == null) {
                    cm.sendOk("서버에 오류가 있어서 지금은 안되겠어.");
                    cm.dispose();
                    return;
                }
                if (em.getProperty("state").equals("1")) {
                    cm.sendOk("이미 이 안에 다른 누군가가 델리를 구출하는 중이야. 나중에 다시 시도해 봐.");
                    cm.dispose();
                    return;
                }
                em.startInstance(cm.getPlayer());
                cm.dispose();
            } else {
                cm.sendOk("이미 델리를 구하고 온 것 같은데? 다시 갈 필요는 없잖아?");
                cm.dispose();
                return;
            }
        } else {
            cm.dispose();
        }
    }
}