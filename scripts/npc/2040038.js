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
 * NPCID : 2040038
 * ScriptName : party2_play
 * NPCNameFunc : 옐로우 벌룬
 * Location : 922010300 (히든스트리트 - 버려진 탑<3단계>)
 * 
 * @author T-Sun
 *
 */

function clear() {
    cm.showEffect(true, "quest/party/clear");
    cm.playSound(true, "Party1/Clear");
    cm.environmentChange(true, "gate");
}

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
    var em = cm.getEventManager("LudiPQ");
    var eim = cm.getPlayer().getEventInstance();
    if (em == null || eim == null) {
        cm.sendOk("오류가 발생했어요.");
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (eim.getProperty("stage") == null) {
            eim.setProperty("stage", "1");
        }
        var stage = parseInt(eim.getProperty("stage"));
        if (stage > (cm.getPlayer().getMapId() % 922010000 / 100)) {
            cm.sendOk("포탈이 열렸어요~ 다음 스테이지로 이동해 주세요!")
            cm.dispose();
            return;
        }
        
        var s = eim.getProperty("guideRead");
        if (s == null || !s.equals("s") || !cm.isLeader()) {
            if (cm.isLeader()) {
                eim.setProperty("guideRead", "s");
                cm.sendNext("안녕하세요. 세번째 스테이지에 오신 것을 환영합니다. 이곳에는 수 많은 몬스터와 상자들이 있습니다. 몬스터를 쓰러뜨리면 역시 차원의 공간에서 온 녀석답게 #b차원의 통행증#k을 줍니다. 또한 상자를 부수면 안에서 몬스터가 나오는데 녀석들도 #b차원의 통행증#k을 줍니다.\r\n몬스터들이 주는 #b차원의 통행증#k을 제가 지금부터 당신에게 내는 문제의 답 만큼 모아와 주시면 됩니다. 문제는 파티장에게만 알려드리니 답을 모르겠다면 파티원 전원과 상의하면 되겠지요. 그럼 문제입니다. 잘 보시고 ???에 해당하는 답을 생각해 보세요.\r\n\r\n#b레벨 1 초보자의 HP - 마법사로 1차 전직할 수 있는 최소 레벨 - 도적으로 1차 전직할 수 있는 최소 레벨 = ???#k");
            } else {
                cm.sendNext("안녕하세요. 세번째 스테이지에 오신 것을 환영합니다. 이곳에는 수 많은 몬스터와 상자들이 있습니다. 몬스터를 쓰러뜨리면 역시 차원의 공간에서 온 녀석답게 #b차원의 통행증#k을 줍니다. 또한 상자를 부수면 안에서 몬스터가 나오는데 녀석들도 #b차원의 통행증#k을 줍니다.\r\n몬스터들이 주는 #b차원의 통행증#k을 파티장에게 건네주세요. 파티장에게 문제를 알려드렸으니, 파티장은 그 문제의 답 만큼 통행증을 제게 주시면 됩니다.");
            }
            cm.dispose();
            return;
        }
        
        if (cm.haveItem(4001022, 32)) {
            clear();
            cm.removeAll(4001022);
            eim.setProperty("stage", (stage + 1));
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(4200, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
            cm.dispose();
        } else {
            cm.sendOk("아직 #b차원의 통행증 #k을 정답 수치만큼 모으지 못하신 모양이지요? 맵 이곳 저곳에 있는 몬스터들을 잡고 나온 차원의 통행증을 파티장이 모아 제게 가져다 주시면 됩니다. 혹시 문제를 잊으셨다면 문제를 다시 알려드리겠습니다.\r\n\r\n#b레벨 1 초보자의 HP - 마법사로 1차 전직할 수 있는 최소 레벨 - 도적으로 1차 전직할 수 있는 최소 레벨 = ???#k");
            cm.dispose();
        }
    }
}