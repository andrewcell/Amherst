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
 * NPCID : 2060100
 * ScriptName : s4common2
 * NPCNameFunc : 카르타
 * Location : 230040001 (히든스트리트 - 카르타의 동굴)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    if (cm.getQuestStatus(6301) == 1) {
        if (!cm.haveItem(4000175, 1)) {
            cm.sendOk("#b#t4000175##k 없이는 일그러진 차원으로 들어갈수 없다네.");
            cm.dispose();
            return;
        }
        if (cm.haveItem(4031472, 40)) {
            cm.sendOk("이미 #b#t4031472##k을 40개 갖고 있는 것 같은데? 그렇다면 더 모을 필요 없지 않은가?");
            cm.dispose();
            return;
        }
        var ret = checkJob();
        if (ret == -1) {
            cm.sendOk("파티...가 없군. 파티를 만들 고 내게 말을 걸게.");
        } else if (ret == 0) {
            cm.sendOk("파티 인원을 2명으로 구성한 후 내게 말을 걸게.");
        } else if (ret == 1) {
            cm.sendOk("흠.. 파티중에 4차 전직을 하지 않은 플레이어가 있나?");
        } else if (ret == 2) {
            cm.sendOk("흠.. 파티중에 4차 전직을 하지 않은 플레이어가 있나?");
        } else if (!cm.isLeader()) {
            cm.sendOk("파티장이 입장 신청을 해야 하네.")
        } else {
            
            var em = cm.getEventManager("s4common2");
            if (em == null) {
                cm.sendOk("You're not allowed to enter with unknown reason. Try again." );
            } else if (em.getProperty("started").equals("true")) {
                cm.sendOk("이미 다른 누군가가 다른 세계로 건너가서 임무를 수행중인 것 같군. 나중에 다시 시도해봐." );
            } else {
                em.startInstance(cm.getParty(), cm.getMap());
            }
        }
    } else {
        cm.sendOk("나는 #b바다 마녀 카르타#k다. 나를 귀찮게 했다가는 벌레로 만들어 버리는 수가 있으니 조심하도록 해.");
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
    //    if (party.getMembers().size() != 2) {
    //        return 0;
    //    }
    var it = party.getMembers().iterator();

    while (it.hasNext()) {
        var cPlayer = it.next();

        if (cPlayer.getJobId() % 10 == 2 || cPlayer.getJobId() == 900) {
            if (cPlayer.getLevel() < 120) {
                return 2;
            }
        } else {
            return 1;
        }
    }
    return 3;
}