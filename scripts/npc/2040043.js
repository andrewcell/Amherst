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
 * NPCID : 2040043
 * ScriptName : party2_play
 * NPCNameFunc : 블루 벌룬
 * Location : 922010800 (히든스트리트 - 버려진 탑<8단계>)
 * 
 * @author T-Sun
 *
 */

function clear() {
 //   cm.showEffect(true, "quest/party/clear");
cm.showEffect(true, "event/O");   
 cm.playSound(true, "Party1/Clear");
    cm.environmentChange(true, "gate");
}
function fail() {
  //  cm.showEffect(true, "quest/party/wrong_kor");
cm.showEffect(true, "event/X");
    cm.playSound(true, "Party1/Failed");
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
                eim.setProperty("stage8rand", cm.shuffle("000011111"));
            }
            cm.sendNext("여덟번째 스테이지에 대해 설명해 드리겠습니다. 이곳에는 여러 개의 발판이 있습니다. 이 발판 중에서 #b5개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b5명이 정답 발판을 찾아 위에 올라서면#k 됩니다.\r\n단, 발판 끝에 아슬아슬하게 걸쳐서 서지 말고 발판 중간에 서야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 5명만 발판 위에 올라가 있어야 합니다. 파티원이 발판에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내주세요!");
            cm.dispose();
            return;
        }
        
        var random = eim.getProperty("stage8rand");
        var area1 = cm.getPlayer().getMap().getNumPlayersInArea(0);
        var area2 = cm.getPlayer().getMap().getNumPlayersInArea(1);
        var area3 = cm.getPlayer().getMap().getNumPlayersInArea(2);
        var area4 = cm.getPlayer().getMap().getNumPlayersInArea(3);
        var area5 = cm.getPlayer().getMap().getNumPlayersInArea(4);
        var area6 = cm.getPlayer().getMap().getNumPlayersInArea(5);
        var area7 = cm.getPlayer().getMap().getNumPlayersInArea(6);
        var area8 = cm.getPlayer().getMap().getNumPlayersInArea(7);
        var area9 = cm.getPlayer().getMap().getNumPlayersInArea(8);
        
        
        
        if (area1 + area2 + area3 + area4 + area5 + area6 + area7 + area8 + area9 != 5) {
            cm.sendOk("아직 5개의 정답 발판을 찾지 못하신것 같군요. 발판 끝에 아슬아슬하게 서계시지 말고 발판 가운데에 정화히 서 계셔야 정답 여부가 확인 가능합니다. 이점 주의해 주시기 바랍니다.");
            cm.dispose();
            return;
        }
        var curpos = "" + area1 + area2 + area3 + area4 + area5 + area6 + area7 + area8 + area9;
        //Debug
//        curpos = random;
        //cm.playerMessage("Answer : " + random + " / Curpos : " + curpos);
        if (curpos.equals(random)) {
            clear();
            eim.setProperty("stage", 9);
            eim.setProperty("guideRead", "0");
            cm.gainPartyExpPQ(10000, "ludipq", 70);
            cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다.");
        } else {
            fail();
        }
        cm.dispose();
    }
}