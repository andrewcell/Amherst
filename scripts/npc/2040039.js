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
 * NPCID : 2040039
 * ScriptName : party2_play
 * NPCNameFunc : 옐로그린 벌룬
 * Location : 922010400 (히든스트리트 - 버려진 탑<4단계>)
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
            cm.sendNext("안녕하세요. 네번째 스테이지에 오신 것을 환영합니다. 이곳에는 차원의 균열로 인해 생겨난 어둠의 공간이 있습니다. 안에는 #b차원의 쉐도우아이#k라는 몬스터가 있는데 어둠속에 있기 때문에 눈을 뜰 때만 겨우 보일 것입니다. 녀석들을 쓰러뜨리고 #b차원의 통행증 6장#k을 모으시면 됩니다.\r\n파티원들이 모은 #b차원의 통행증#k을 파티장이 모아와 주세요. 방금 말씀 드렸지만 #b차원의 쉐도우아이#k는 눈을 뜨지 않은 상태에서는 공격할 수 없습니다. 어둠과 하나가 되어 어떤 공격도 받지 않는 특이한 성질을 가진 녀석이기 때문이죠. 그럼 힘내주세요!");
            cm.dispose();
            return;
        }
        
        if (cm.haveItem(4001022, 6)) {
            clear();
            cm.removeAll(4001022);
            eim.setProperty("stage", (stage + 1));
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(4800, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
            cm.dispose();
        } else {
            cm.sendOk("아직 #b차원의 통행증 6장#k을 모으지 못하신 모양이지요? 어둠의 공간에 있는 차원의 쉐도우아이들을 잡고 나온 차원의 통행증을 파티장이 모아 제게 가져다 주시면 됩니다.");
            cm.dispose();
        }
    }
}