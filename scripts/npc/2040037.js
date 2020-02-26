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
 * NPCID : 2040037
 * ScriptName : party2_play
 * NPCNameFunc : 오렌지 벌룬
 * Location : 922010200 (히든스트리트 - 버려진 탑<2단계>)
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
            cm.sendNext("안녕하세요. 두번째 스테이지에 오신 것을 환영합니다. 맵 이곳 저곳을 돌아다니다 보면 몇 개의 상자를 찾으실 수 있을 겁니다. 상자를 부수면 다른 맵으로 이동되거나 차원의 통행증을 줄겁니다. 상자를 모두 조사해서 #b차원의 통행증 15장#k을 모아서 저에게 가져와 주시기 바랍니다. 차원의 통행증을 얻으면 파티장이 얻은 것을 모두 모아서 저에게 가져와 주시면 됩니다. 그럼 힘내주세요!");
            cm.dispose();
            return;
        }
        
        if (cm.haveItem(4001022, 15)) {
            clear();
            cm.removeAll(4001022);
            eim.setProperty("stage", (stage + 1));
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(3600, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
            cm.dispose();
        } else {
            cm.sendOk("아직 #b차원의 통행증 15장#k은 모으지 못하신 모양이지요? 맵 이곳 저곳에 있는 몬스터들을 잡고 나온 차원의 통행증을 파티장이 모아 제게 가져다 주시면 됩니다.");
            cm.dispose();
        }
    }
}