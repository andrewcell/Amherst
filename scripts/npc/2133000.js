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
         * NPCID : 2133000
         * ScriptName : party6_entry
         * NPCNameFunc : 엘린
         * Location : 300030100 ( - )
         * 
         * @author T-Sun
         *
         */
        var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            cm.dispose();
        }
        status--;
    }
    if (status == 0) {
        cm.removeAll(4001163);
        cm.removeAll(4001169);
        cm.removeAll(2270004);
        cm.sendSimple("어서와, 독안개의 숲에 나타난 포이즌 골렘을 물리쳐줄 용사를 찾고 있어..\r\n#b#L0#알테어 이어링을 얻고 싶어.#l\r\n#L1#빛나는 알테어 이어링을 얻고 싶어.#l\r\n#L2#독안개의 숲으로 향하고 싶어.#l#k");
    } else if (status == 1) {
        if (selection == 0) {
            if (!cm.haveItem(1032060) && cm.haveItem(4001198, 10)) {
                cm.gainItem(1032060, 1);
                cm.gainItem(4001198, -10);
                if (cm.getPlayer().getOneInfo(1206, "have0") == null) {
                    cm.getPlayer().updateOneInfo(1206, "have0", "1");
                }
            } else {
                cm.sendOk("알테어 조각 10개를 제대로 갖고 있지 않거나, 알테어 이어링을 이미 갖고 있는 것 같은데?");
            }
        } else if (selection == 1) {
            if (cm.haveItem(1032060) && !cm.haveItem(1032061) && cm.haveItem(4001198, 10)) {
                cm.gainItem(1032060, -1);
                cm.gainItem(1032061, 1);
                cm.gainItem(4001198, -10);
                if (cm.getPlayer().getOneInfo(1206, "have1") == null) {
                    cm.getPlayer().updateOneInfo(1206, "have1", "1");
                }
            } else {
                cm.sendOk("알테어 조각 10개를 제대로 갖고 있지 않거나, 알테어 이어링을 이미 갖고 있는 것 같은데?");
            }
        } else if (selection == 1) {
            if (cm.haveItem(1032061) && !cm.haveItem(1032101) && cm.haveItem(4001198, 10)) {
                cm.gainItem(1032061, -1);
                cm.gainItem(1032101, 1);
                cm.gainItem(4001198, -10);
            } else {
                cm.sendOk("알테어 조각 10개를 제대로 갖고 있지 않거나, 알테어 이어링을 이미 갖고 있는 것 같은데?");
            }
        } else if (selection == 2) {
            if (cm.getPlayer().getParty() == null || !cm.isLeader()) {
                cm.sendOk("파티를 만들고 파티장이 되면 나를 통해 퀘스트에 입장할 수 있어.");
            } else {
                var party = cm.getPlayer().getParty().getMembers();
                var mapId = cm.getPlayer().getMapId();
                var next = true;
                var size = 0;
                var it = party.iterator();
                while (it.hasNext()) {
                    var cPlayer = it.next();
                    var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                    if (ccPlayer == null || ccPlayer.getLevel() < 45 || ccPlayer.getLevel() > 55) {
                        next = false;
                        break;
                    }
                    size += (ccPlayer.isGM() ? 3 : 1);
                }
                if (next && ((size >= 3 && size <= 5) || ccPlayer.isGM())) {
                    var em = cm.getEventManager("Ellin");
                    if (em == null) {
                        cm.sendOk("Please try again later.");
                    } else {
                        if (em.getProperty("state") != null && em.getProperty("state").equals("1")) {
                            cm.sendOk("이미 이 안에서 다른 파티가 퀘스트에 도전하는 중입니다. 나중에 다시 시도하세요.");
                            cm.dispose();
                        } else {
                            em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 55);
                        }
                    }
                } else {
                    cm.sendOk("레벨 제한 45 ~ 55의 파티원 3명에서 5명이 퀘스트를 시작할 수 있어.");
                }
            }
        }
        cm.dispose();
    }
}