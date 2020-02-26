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
 * NPCID : 2060005
 * ScriptName : tamepig_enter
 * NPCNameFunc : 켄타 - 동물원 사육사
 * Location : 230000003 (아쿠아리움 - 동물원)
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
        nFieldId = cm.getPlayer().getMapId();
        if (nFieldId == 230000003) {
            if (cm.getQuestStatus(6002) == 1) {
                if (!cm.haveItem(4031508, 5) || !cm.haveItem(4031507, 5)) {
                    var em = cm.getEventManager("TamePig");
                    if (em == null) {
                        cm.sendOk("Unknown error occured");
                        cm.dispose();
                        return;
                    } else {
                        var prop = em.getProperty("state");
                        if (prop == null || prop.equals("0")) {
                            em.startInstance(cm.getChar());
                            cm.dispose();
                            return;
                        } else {
                            cm.sendOk("이미 다른 플레이어가 입장하여 퀘스트에 도전하는 중입니다. 잠시 후 다시 시도해 주세요.");
                            cm.dispose();
                            return;
                        }
                    }
                } else {
                    cm.sendOk("재료를 모두 모아오셨군요! 제게 주시지 않으시겠어요?");
                    cm.dispose();
                }
            } else if (cm.getQuestStatus(6002) == 2) {
                cm.sendOk("지난번에 연구 보고서를 가져다 주시고 멧돼지를 보호해 주셔서 너무 감사했어요.");
                cm.dispose();
            } else {
                cm.sendOk("음.. 무언가 도와드릴 일이 있나요?");
                cm.dispose();
            }
        }
    }
}