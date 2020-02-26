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
 * NPCID : 1061012
 * ScriptName : s4snipe
 * NPCNameFunc : 의미없는 존재
 * Location : 105090200 (던전 - 또다른입구)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    if (cm.getQuestStatus(6108) == 1 && cm.getQuestStatus(6107) == 2) {
        var ret = checkJob();
        if (ret == -1) {
            cm.sendOk("파티를 구성한 후 내게 말을 걸게.");
        } else if (ret == 0) {
            cm.sendOk("파티 인원을 2명으로 구성한 후 내게 말을 걸게.");
        } else if (ret == 1) {
            cm.sendOk("4차전직을 한 궁수 두명이 파티를 구성해서 파티장이 내게 말을 걸어야 하네.");
        } else if (ret == 2) {
            cm.sendOk("4차전직을 한 궁수 두명이 파티를 구성해서 파티장이 내게 말을 걸어야 하네.");
        } else {
            var em = cm.getEventManager("s4aWorld");
            if (em == null) {
                cm.sendOk("You're not allowed to enter with unknown reason. Try again." );
            } else if (em.getProperty("started").equals("true")) {
                cm.sendOk("이미 다른 누군가가 다른 세계로 건너가서 임무를 수행중인 것 같군. 나중에 다시 시도해보게." );
            } else {
                em.startInstance(cm.getParty(), cm.getMap());
            }
        }
    } else {
        cm.sendOk(".....");
    }
    cm.dispose();
}

function checkJob() {
    var party = cm.getParty();

    if (party == null) {
        return -1;
    }
    if (cm.getPlayer().isGM()) {
        return 3;
    }
    if (party.getMembers().size() != 2) {
        return 0;
    }
    var it = party.getMembers().iterator();

    while (it.hasNext()) {
        var cPlayer = it.next();

        if (cPlayer.getJobId() == 312 || cPlayer.getJobId() == 322 || cPlayer.getJobId() == 900) {
            if (cPlayer.getLevel() < 120) {
                return 2;
            }
        } else {
            return 1;
        }
    }
    return 3;
}