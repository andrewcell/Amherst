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
 * NPCID : 2081005
 * ScriptName : hontale_keroben
 * NPCNameFunc : 케로벤 - 수문장
 * Location : 240040700 (미나르숲 - 생명의 동굴 입구)
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
        if (cm.getMorphState() == 2210003) {
            cm.sendNext("오, 우리 동족이로군. 인간의 침입은 걱정 말라고. 내가 단단히 지키고 있으니까 말이야. 그럼 안으로 들어가게나.")
        } else {
            cm.sendNext("이놈! 인간주제에 여기가 어디라고 왔느냐! 썩 사라져 버려라!");
        }
    } else if (status == 1) {
        if (cm.getMorphState() == 2210003) {
            cm.warp(240050000, "out00");
            cm.getPlayer().cancelMorphs();
            cm.dispose();
        } else {
            var decHp = 500;
            if (cm.getPlayerStat("HP") < 500) {
                decHp = cm.getPlayerStat("HP") - 1;
                if (decHp == cm.getPlayerStat("HP")) {
                    decHp = 0;
                }
            }
            if (decHp > 0) {
                cm.addHP(-decHp);
            }
            cm.warp(240040600, "st00");
            cm.dispose();
        }
    }
}