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
 * NPCID : 2083003
 * ScriptName : hontale_Bdoor
 * NPCNameFunc : 미로방 그루터기
 * Location : 240050100 (생명의동굴 - 미로방)
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    
    if (status == 0) {
        
        var eim = cm.getPlayer().getEventInstance();
        var value = eim.getProperty("stage1progress");
        if (value == null) {
            eim.setProperty("stage1progress", "0");
            value = "0";
        }
        value = parseInt(value);
        if (value == 0) {
            if (cm.haveItem(4001088, 1)) {
                clear(eim);
                eim.broadcastPlayerMsg(6, "두 번째 미로방의 문이 열렸습니다.");
                cm.sendOk("두 번째 미로방의 문이 열렸습니다.");
                cm.gainItem(4001088, -1);
                eim.setProperty("stage1progress", value + 1);
                cm.dispose();
            } else {
                cm.sendOk("...");
                cm.dispose();
            }
        } else if (value == 1) {
            if (cm.haveItem(4001089, 1)) {
                clear(eim);
                eim.broadcastPlayerMsg(6, "세 번째 미로방의 문이 열렸습니다.");
                cm.sendOk("세 번째 미로방의 문이 열렸습니다.");
                cm.gainItem(4001089, -1);
                eim.setProperty("stage1progress", value + 1);
                cm.dispose();
            } else {
                cm.sendOk("...");
                cm.dispose();
            }
        } else if (value == 2) {
            if (cm.haveItem(4001090, 1)) {
                clear(eim);
                eim.broadcastPlayerMsg(6, "네 번째 미로방의 문이 열렸습니다.");
                cm.sendOk("네 번째 미로방의 문이 열렸습니다.");
                cm.gainItem(4001090, -1);
                eim.setProperty("stage1progress", value + 1);
                cm.dispose();
            } else {
                cm.sendOk("...");
                cm.dispose();
            }
        } else if (value == 3) {
            if (cm.haveItem(4001091, 1)) {
                clear(eim);
                eim.broadcastPlayerMsg(6, "다섯 번째 미로방의 문이 열렸습니다.");
                cm.sendOk("다섯 번째 미로방의 문이 열렸습니다.");
                cm.gainItem(4001091, -1);
                eim.setProperty("stage1progress", value + 1);
                cm.dispose();
            } else {
                cm.sendOk("...");
                cm.dispose();
            }
        } else {
            cm.sendOk("미로방을 모두 클리어하셨습니다.");
            cm.dispose();
        }
    }
}

var packet1 = Packages.tools.MaplePacketCreator.showEffect("quest/party/clear");
var packet2 = Packages.tools.MaplePacketCreator.playSound("Party1/Clear");

function clear(eim) {
    eim.broadcastPacket(packet1);
    eim.broadcastPacket(packet2);
}
