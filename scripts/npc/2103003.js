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
 * NPCID : 2103003
 * ScriptName : ariant_house1
 * NPCNameFunc : 아리안트 민가1
 * Location : 260000202 (아리안트마을 - 민가1)
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
        val = cm.getQuestStatus(3929);
        if (val == 0 || val == 2) {
            cm.dispose();
        } else if (val == 1) {
            
            var nCount = cm.getNpc() - 2103003;
            var qr = cm.getQuestRecord(3929);
            var info = qr.getCustomData();
            if (info == null) {
                info = "0000";
                qr.setCustomData("0000");
            }
            if (info.equals("3333")) {
                cm.dispose();
            } else {
                var nInvite = info.substr(nCount, 1);
                if (nInvite.equals("3")) {
                    cm.dispose();
                } else {
                    if (cm.haveItem(4031580)) {
                        cm.gainItem(4031580, -1);
                        cm.sendOk("가져온 음식을 살며시 내려놓았다.");
                        var z = "";
                        for (var i = 0; i < 4; ++i) {
                            if (nCount == i) {
                                z += "3";
                            } else {
                                z += info.substr(i, 1);
                            }
                        }
                        qr.setCustomData(z);
                        cm.getPlayer().updateQuest(qr, true);
                        if (z.equals("3333")) {
                            cm.showQuestClear(3929);
                        }
                        cm.dispose();
                    } else {
                        cm.sendOk("내려놓을 음식이 없다.");
                        cm.dispose();
                    }
                }
            }
        }
        
    }
}