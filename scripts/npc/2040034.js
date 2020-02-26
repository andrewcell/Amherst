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
         * NPCID : 2040034
         * ScriptName : party2_enter
         * NPCNameFunc : 표지판
         * Location : 221024500 (에오스탑 - 에오스탑101층)
         * 
         * @author T-Sun
         *
         */

        var status = -1;
var minLevel = 30; // 35
var maxLevel = 70; // 65

var minPartySize = 6; //CHANGE after BB
var maxPartySize = 6;

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
    cm.removeAll(4001022);
    cm.removeAll(4001023);
    if (cm.getParty() == null) { // No Party
        cm.sendOk("다른 차원에서 온 괴물이 이 안에 숨어들어 시간을 어지렵히고 있어요. 이 위에서 생긴 시공의 균열을 닫고 사악한 몬스터를 없애주실 분들을 찾고 있어요. 한번 도전해 보시지 않겠어요? 그렇다면 파티를 만들고 파티원을 모아보세요. 또는 다른 파티에 참여해보세요!");
    } else if (!cm.isLeader()) { // Not Party Leader
        cm.sendOk("시공의 균열을 닫고 사악한 몬스터를 없애주시고 싶으시다구요? 그렇다면 당신의 파티의 #b파티장#k에게 퀘스트를 시작할 것을 요청하세요.");
    } else {
        // Check if all party members are within PQ levels
        var party = cm.getParty().getMembers();
        var mapId = cm.getMapId();
        var next = true;
        var levelValid = 0;
        var inMap = 0;
        var it = party.iterator();

        while (it.hasNext()) {
            var cPlayer = it.next();
            if ((cPlayer.getLevel() >= minLevel) && (cPlayer.getLevel() <= maxLevel)) {
                levelValid += 1;
            } else {
                next = false;
            }
            if (cPlayer.getMapid() == mapId && cPlayer.getChannel() == cm.getClient().getChannel() && cPlayer.isOnline()) {
                inMap += (cPlayer.getJobId() == 900 ? 6 : 1);
            }
        }
        if (party.size() > maxPartySize || inMap < minPartySize) {
            next = false;
        }
        if (next) {
            var em = cm.getEventManager("LudiPQ");
            if (em == null) {
                cm.sendOk("The Ludibrium PQ has encountered an error. Please report this on the forums, with a screenshot.");
            } else {
                var prop = em.getProperty("state");
                if (prop.equals("0") || prop == null) {
                    em.startInstance(cm.getParty(), cm.getMap(), 50);
                    cm.removeAll(4001022);
                    cm.removeAll(4001023);
                    cm.dispose();
                    return;
                } else {
                    cm.sendOk("이 안에 이미 다른 파티가 입장하여 클리어에 도전중입니다. 잠시 후에 다시 시도해보세요.");
                }
            }
        } else {
            cm.sendOk("당신이 속한 파티의 파티원이 6명이 아니거나 자신 혹은 파티원 중에서 레벨 30 ~ 70 에 해당하지 않는 캐릭터가 있습니다. 혹은 파티원 전원이 현재 맵에 모여있는지 다시 한 번 확인해 주세요.");
        }
    }
    cm.dispose();
}