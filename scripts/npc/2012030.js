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
 * NPCID : 2012030
 * ScriptName : elizaHarp4
 * NPCNameFunc : 하프줄<파>
 * Location : 920020000 (히든스트리트 - 엘리쟈의 정원)
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
        cm.playSound(true, "orbis/pa");
        if (cm.isQuestActive(3114) && !cm.getQuestRecord(3114).getCustomData().equals("42")) {
            var qr = cm.getQuestRecord(103114);
            if (qr.getCustomData() == null) {
                qr.setCustomData("");
            }
            qr.setCustomData(qr.getCustomData() + (cm.getNpc() - 2012027));
            //도 0 레 1 미 2 파 3 솔 4 라 5 시 6
            if (qr.getCustomData().equals("004455433221104433221443322100445543322110")) {
                cm.playerMessage(5, "노래를 정확하게 연주하여 엘리쟈가 잠에 빠져듭니다.");
                var qr2 = cm.getQuestRecord(3114);
                qr2.setCustomData("42");
                cm.getPlayer().updateQuest(qr2, true);
                cm.showQuestClear(3114);
            } else {
                if (!java.lang.String.valueOf("004455433221104433221443322100445543322110").startsWith(qr.getCustomData())) {
                    cm.playerMessage("연주가 틀렸습니다. 처음부터 다시 연주해 주세요.");
                    qr.setCustomData("");
                }
            }
        }
        cm.dispose();
    }
}