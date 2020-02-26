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
 * NPCID : 2103001
 * ScriptName : secret_wall
 * NPCNameFunc : 비밀의 벽
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */
var status = 0;

function action(mode, type, selection) {
    var qr = cm.getQuestRecord(3927);
    if (status == 0 && mode == 1 && cm.getQuestStatus(3927) == 1) {
        cm.sendYesNo("평범한 벽이지만 자세히 들여다보니 이상한 문양이 그려져 있습니다. 벽을 살피시겠습니까?")
        status++;
    } else if (status == 1 && mode == 1) {
        cm.sendNext("벽 뒤에는 이상한 단어들이 쓰여져 있다.\r\n\r\n#b철퇴와 단검, 활과 화살만 있다면...");
        if (qr.getCustomData() == null) {
            qr.setCustomData("1");
            cm.getPlayer().updateQuest(qr, true);
            cm.showQuestClear(3927);
        }
        cm.dispose();
    } else {
        cm.dispose();
    }
}