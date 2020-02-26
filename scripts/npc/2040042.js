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
 * NPCID : 2040042
 * ScriptName : party2_play
 * NPCNameFunc : 스카이블루 벌룬
 * Location : 922010700 (히든스트리트 - 버려진 탑<7단계>)
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
            }
            cm.sendNext("안녕하세요. 일곱번째 스테이지에 오신 것을 환영합니다. 이 곳에는 아주 아주 강력한 몬스터가 있습니다. 바로 #b차원의 롬바드#k라는 녀석이죠. 이 녀석을 쓰러뜨리면 다음 스테이지로 가는데 필요한 #b차원의 통행증#k을 줍니다. #b차원의 통행증 3장#k을 모아 파티장에게 주세요.\r\n녀석을 불러내는 방법은 멀리 떨어진 곳의 몬스터를 쓰러뜨리는 것입니다. 너무 멀어서 원거리 공격이 아니면 힘들겠지만... 아참... 차원의 롬바드는 보통 녀석이 아니니까 조심해 주세요. 얕보았다가는 큰 코 다칠수도 있으니까요. 그럼 힘내주세요!");
            cm.dispose();
            return;
        }
        
        if (cm.haveItem(4001022, 3)) {
            clear();
            cm.removeAll(4001022);
            eim.setProperty("stage", (stage + 1));
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(6600, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
            cm.dispose();
        } else {
            cm.sendOk("아직 #b차원의 통행증 3장#k을 모으지 못하신 모양이지요? #b차원의 롬바드#k를 쓰러뜨리고 #b차원의 통행증 3장#k을 모아와 주세요!");
            cm.dispose();
        }
    }
}