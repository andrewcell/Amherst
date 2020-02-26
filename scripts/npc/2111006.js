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
 * NPCID : 2111006
 * ScriptName : drang_room1
 * NPCNameFunc : 파웬
 * Location : 261020401 (히든스트리트 - 관계자 외 출입금지)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.isQuestActive(3320) || (cm.getQuestStatus(3320) == 2 && cm.getQuestStatus(3321) == 0) || cm.isQuestActive(3353) || (cm.getQuestStatus(3353) == 2 && cm.getQuestStatus(3354) == 0))
            cm.askAcceptDecline("지금 당장 연금술사를 보러 가보겠나?");
        else {
            cm.sendOk("으으.. 이놈의 사이티들, 너무 무서워~...");
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("엥? 싫은가? 자네가 싫다면 하는 수 없지만... 그럼 여기서 연구하던 연금술사는 알려줄 수가 없는데?");
        } else {
            cm.forceStartQuest();
            cm.warp(926120200);
        }
        cm.dispose();
    }
}