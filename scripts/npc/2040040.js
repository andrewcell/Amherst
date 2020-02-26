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
 * NPCID : 2040040
 * ScriptName : party2_play
 * NPCNameFunc : 그린 벌룬
 * Location : 922010500 (히든스트리트 - 버려진 탑<5단계>)
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
            cm.sendNext("안녕하세요. 다섯번째 스테이지에 오신 것을 환영합니다. 이곳에는 여러 공간이 있고 그 안에서 몬스터를 쓰러뜨리거나 해서 역시 #b차원의 통행증 24장#k을 모아오시면 됩니다. 다만 특이한 점은 특정 직업이 아니고서는 #b차원의 통행증#k을 얻지 못하는 경우도 있으니 주의해야 한다는 것입니다.\r\n한 가지 힌트를 드리면 이 안에는 절대로 죽일 수 없는 #b차원의 킹 블록골렘#k이 있는데 도적이 아니고서는 녀석의 반대편으로 통과하기 힘들 것입니다. 또한 마법사가 아니고서는 갈 수 없는 곳도 있죠. 방법은 여러분들이 생각해 보세요. 그럼 힘내 주세요!");
            cm.dispose();
            return;
        }
        
        if (cm.haveItem(4001022, 24)) {
            clear();
            cm.removeAll(4001022);
            eim.setProperty("stage", 7);
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(5400, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
            cm.dispose();
        } else {
            cm.sendOk("아직 #b차원의 통행증 24장#k을 모으지 못하신 모양이지요? 이곳에는 여러 공간이 있고 그 안에서 몬스터를 쓰러뜨리거나 해서 역시 #b차원의 통행증 24장#k을 모아오시면 됩니다. 다만 특이한 점은 특정 직업이 아니고서는 #b차원의 통행증#k을 얻지 못하는 경우도 있으니 주의해야 한다는 것입니다.\r\n한 가지 힌트를 드리면 이 안에는 절대로 죽일 수 없는 #b차원의 킹 블록골렘#k이 있는데 도적이 아니고서는 녀석의 반대편으로 통과하기 힘들 것입니다. 또한 마법사가 아니고서는 갈 수 없는 곳도 있죠. 방법은 여러분들이 생각해 보세요.");
            cm.dispose();
        }
    }
}