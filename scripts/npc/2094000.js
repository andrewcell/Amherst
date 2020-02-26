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
 * NPCID : 2094000
 * ScriptName : davyJohn_enter
 * NPCNameFunc : 구옹
 * Location : 251010404 (히든스트리트 - 해적선 너머)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    cm.removeAll(4001117);
    cm.removeAll(4001120);
    cm.removeAll(4001121);
    cm.removeAll(4001122);
    if (cm.getPlayer().getParty() == null || !cm.isLeader()) {
        cm.sendOk("파티가 없거나, 파티장이 아니기 때문에 퀘스트를 시작하실 수 없습니다.");
    } else {
        var party = cm.getPlayer().getParty().getMembers();
        var mapId = cm.getPlayer().getMapId();
        var next = true;
        var size = 0;
        var it = party.iterator();
        while (it.hasNext()) {
            var cPlayer = it.next();
            var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
            if (ccPlayer == null || ccPlayer.getLevel() < 55 || ccPlayer.getLevel() > 100) {
                next = false;
                break;
            }
            size += (ccPlayer.isGM() ? 4 : 1);
        }
        if (next && size >= 3) {
            var em = cm.getEventManager("Pirate");
            if (em == null) {
                cm.sendOk("Please try again later.");
            } else {
                var prop = em.getProperty("state");
                if (prop.equals("0") || prop == null) {
                    em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 100);
                } else {
                    cm.sendOk("이미 다른 파티가 입장하여 클리어에 도전하는 중입니다. 나중에 다시 시도해 보세요.");
                }
            }
        } else {
            cm.sendOk("3명 이상이 이곳에 있어야 하며, 파티원들의 레벨이 55 ~ 100에 맞는지 확인해 주세요.");
        }
    }
    cm.dispose();
}