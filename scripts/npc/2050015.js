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
 * NPCID : 2050015
 * ScriptName : earth010
 * NPCNameFunc : 운석2
 * Location : 221040200 (루더스호수 - 쿨란초원3)
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
        val = cm.getQuestStatus(3421);
        if (val == 0 || val == 2) {
            cm.dispose();
        } else if (val == 1) {
            var nCount = cm.getNpc() - 2050014;
            var qr = cm.getQuestRecord(3421);
            var info = qr.getCustomData();
            if (info == null) {
                info = "000000";
                qr.setCustomData("000000");
            }
            if (info.equals("111111")) {
                cm.dispose();
            } else {
                var nInvite = info.substr(nCount, 1);
                if (nInvite.equals("1")) {
                    cm.sendOk("이 운석의 샘플은 이미 채취했다. 다른 운석을 찾아보자.");
                    cm.dispose();
                } else {
                    if (cm.canHold(4031117)) {
                        cm.gainItem(4031117, 1);
                        cm.sendOk("운석 샘플을 채취했다.");
                        var z = "";
                        for (var i = 0; i < 6; ++i) {
                            if (nCount == i) {
                                z += "1";
                            } else {
                                z += info.substr(i, 1);
                            }
                        }
                        qr.setCustomData(z);
                        cm.dispose();
                    } else {
                        cm.sendOk("인벤토리 공간이 부족한 것 같다.");
                        cm.dispose();
                    }
                }
            }
        }
    }
}