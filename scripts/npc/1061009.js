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
 * NPCID : 1061009
 * ScriptName : crack
 * NPCNameFunc : 차원의 문
 * Location : 107000402 (히든스트리트 - 원숭이의늪2)
 * Location : 105040305 (던전 - 슬리피던전5)
 * Location : 105070001 (던전 - 개미굴광장)
 * Location : 100040106 (히든스트리트 - 사악한기운의숲2)
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
        var q = cm.getQuestRecord(195000)
        var value = q.getCustomData();
        if (value == null) {
            q.setCustomData("0");
        }
        if (value.equals("job3_trial1_2") && !cm.haveItem(4031059)) {
            var em = cm.getEventManager("3rdjob");
            if (em == null) {
                cm.sendOk("'");
            } else if (em.getProperty("entry").equals("false")) {
                cm.sendOk("이미 이 균열 안에는 다른 누군가가 들어가 있는 것 같다. 지금은 들어갈 수 없을 것 같다..");
            } else {
                var job = cm.getPlayer().getJob();
                if (job == 1210 || job == 210 || job == 220 || job == 230) {
                    if (cm.getPlayer().getMapId() != 100040106) {
                        cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
                        cm.dispose();
                        return;
                    }
                } else if (job == 110 || job == 120 || job == 130 || job == 1110) {
                    if (cm.getPlayer().getMapId() != 105070001) {
                        cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
                        cm.dispose();
                        return;
                    }
                } else if (job == 410 || job == 420) {
                    if (cm.getPlayer().getMapId() != 107000402) {
                        cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
                        cm.dispose();
                        return;
                    }
                } else if (job == 310 || job == 320) {
                    if (cm.getPlayer().getMapId() != 105040305) {
                        cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
                        cm.dispose();
                        return;
                    }
                } else if (job == 510 || job == 520) {
                    if (cm.getPlayer().getMapId() != 105070200) {
                        cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
                        cm.dispose();
                        return;
                    }
                }
                em.newInstance(cm.getName()).registerPlayer(cm.getPlayer());
            }
        } else {
            cm.sendOk("다른 세계로 통할 것 같은 이상한 모양의 차원의 균열이다.");
        }
        cm.dispose();
    }
}