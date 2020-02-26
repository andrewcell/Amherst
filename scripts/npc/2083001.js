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
 * NPCID : 2083001
 * ScriptName : hontale_enter1
 * NPCNameFunc : 혼테일의 이정표
 * Location : 240050300 (생명의동굴 - 빛의 동굴)
 * Location : 240050310 (생명의동굴 - 어둠의 동굴)
 * Location : 240050100 (생명의동굴 - 미로방)
 * Location : 240050000 (생명의동굴 - 동굴 입구)
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
    
    if (cm.getPlayer().getMapId() == 240050000) {
        if (status == 0) {
            if (cm.getPlayer().getParty() == null) {
                cm.sendOk("만용을 부리는군. 어리석은 자들이여.. 강한자들과 함께 도전하라.");
                cm.dispose();
                return;
            }
            if (!cm.isLeader()) {
                cm.sendOk("만용을 부리는군. 어리석은 자여.. 강한자들과 함께 도전하라.");
                cm.dispose();
                return;
            }
            if (!cm.allMembersHere()) {
                cm.sendOk("만용을 부리는군. 어리석은 자들이여.. 강한자들과 함께 도전하라.");
                cm.dispose();
                return;
            }
            if (cm.getPlayer().getParty().getMembers().size() != 6 && !cm.getPlayer().isGM()) {
                cm.sendOk("만용을 부리는군. 어리석은 자들이여.. 강한자들과 함께 도전하라.");
                cm.dispose();
                return;
            }
            cm.sendSimple("겁없이 생명의 동굴로 발을 내딛은 어리석은 자들이여... 숨겨진 열쇠를 찾은 자만이 나에게 다가올 수 있을것이다. 무모한 게임에 도전하겠는가?\r\n\r\n#L0##b도전한다.#k#l")
        } else if (status == 1) {
            var em = cm.getEventManager("HorntailPQ");
            if (em == null) {
                cm.sendOk("미안하지만 파티퀘스트 시스템에 현재 문제가 생겼다. 지금은 입장할 수 없다..");
                cm.dispose();
                return;
            }
            
            var prop = em.getProperty("state");
            if (prop.equals("0") || prop == null) {
                em.startInstance(cm.getParty(), cm.getMap(), 200);
                cm.removeAll(4001087);
                cm.removeAll(4001088);
                cm.removeAll(4001089);
                cm.removeAll(4001090);
                cm.removeAll(4001091);
                cm.removeAll(4001092);
                cm.removeAll(4001093);
                cm.dispose();
                return;
            } else {
                cm.sendOk("이 안에 이미 다른 파티가 입장하여 클리어에 도전중입니다. 잠시 후에 다시 시도해보세요.");
            }
                
            cm.dispose();
        }
    } else if (cm.getPlayer().getMapId() == 240050100) {
        if (status == 0) {
            var eim = cm.getPlayer().getEventInstance();
            var progress = eim.getProperty("stage1progress");
            if (progress == null) {
                eim.setProperty("stage1progress", "0");
                progress = "0";
            }
            progress = parseInt(progress);
            if (progress == 5) {
                cm.warpParty(240050200);
                cm.dispose();
            } else {
                cm.sendOk("만용을 부리는군. 어리석은 자들이여.. 아직 게임은 끝나지 않았다.");
                cm.dispose();
            }
        }
    } else if (cm.getPlayer().getMapId() == 240050300 || cm.getPlayer().getMapId() == 240050310) {
        if (status == 0) {
            var eim = cm.getPlayer().getEventInstance();
            if (cm.haveItem(4001093, 6)) {
                eim.setProperty("allfinish", "clear");
                cm.removeAll(4001093);
                clear(eim);
                eim.finishPQ();
                cm.dispose();
            } else {
                cm.sendOk("만용을 부리는군. 어리석은 자들이여.. 아직 게임은 끝나지 않았다.");
                cm.dispose();
            }
        }
    }
}

function clear(eim) {
    var packet1 = Packages.tools.MaplePacketCreator.showEffect("quest/party/clear");
    var packet2 = Packages.tools.MaplePacketCreator.playSound("Party1/Clear");
    eim.broadcastPacket(packet1);
    eim.broadcastPacket(packet2);
}
