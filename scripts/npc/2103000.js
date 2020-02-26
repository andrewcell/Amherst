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
 * NPCID : 2103000
 * ScriptName : ariant_oasis
 * NPCNameFunc : 궁정 오아시스
 * Location : 260000300 (아리안트 - 아리안트궁전)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    var qr = cm.getQuestRecord(3900);
    if (cm.getQuestStatus(3900) == 1 && (qr.getCustomData() == null || !qr.getCustomData().equals("5"))) {
        cm.gainExp(300);
        qr.setCustomData("5");
        cm.getPlayer().updateQuest(qr, true);
        cm.showQuestClear(3900);
        cm.playerMessage(5, "오아시스의 물을 마셨습니다.");
    }
    cm.dispose();
}