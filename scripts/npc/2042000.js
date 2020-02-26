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
         * NPCID : 2042000
         * ScriptName : mc_enter
         * NPCNameFunc : 슈피겔만 - 몬스터 카니발
         * Location : 980000000 (몬스터 카니발 - 슈피겔만의 사무실)
         * 
         * @author T-Sun
         *
         */

        var status = 0;
var field = "a";

function start() {
    status = -1;
    action(1, 0, 0);
}


function action(mode, type, selection) {
    if (mode == 1)
        status++;
    else
        cm.dispose();


    //cm.sendOk("흐음.. 미안하지만 지금은 시스템 문제로 인해 카니발을 할 수 없다네.. 카니발이 열릴때 까지 기다려 주게나!")
    //cm.dispose();
    //return;

    if (status == 0 && mode == 1) {
        var selStr = "몬스터 카니발에 참가하게나!";
        var found = false;
        for (var i = 0; i < 6; i++) {
            if (getCPQField(i + 1) != "") {
                selStr += "\r\n#b#L" + i + "# " + getCPQField(i + 1) + "#l#k";
                found = true;
            }
        }
        if (cm.getParty() == null) {
            cm.sendNext("몬스터 카니발은 파티를 구성한 후에 참가할 수 있다네.");
        } else {
            if (cm.isLeader()) {
                if (found) {
                    cm.sendSimple(selStr);
                } else {
                    cm.sendNext("흠.. 지금은 사용가능한 전장이 없는 것 같군. 나중에 다시 시도해 보게나.");
                }
            } else {
                cm.sendNext("파티장이 카니발에 참가신청을 할 수 있다네.");
            }
        }
    } else if (status == 1) {
        if (selection == 100) {
            cm.sendSimple("#b#L0#50 Maple Coin = Spiegelmann Necklace#l\r\n#L1#30 Maple Coin = Spiegelmann Marble#l\r\n#L2#50 Sparkling Maple Coin = Spiegelmann Necklace of Chaos#l#k");
        } else if (selection >= 0 && selection < 6) {
            mapid = 980000000 + ((selection + 1) * 100);
            if (cm.getEventManager("cpq").getInstance("cpq" + mapid) == null) {
                if ((cm.getParty() != null && 1 < cm.getParty().getMembers().size() && cm.getParty().getMembers().size() < (selection == 4 || selection == 5 || selection == 8 ? 4 : 3)) || cm.getPlayer().isGM()) {
                    if (checkLevelsAndMap(30, 50) == 1) {
                        cm.sendOk("흠.. 요구 레벨에 맞지 않는 파티원이 있는 것 같군. 요구 레벨은 #r30 ~ 50#k 이라네.");
                        cm.dispose();
                    } else if (checkLevelsAndMap(30, 50) == 2) {
                        cm.sendOk("파티원 전원이 이곳에 있어야 한다네.");
                        cm.dispose();
                    } else {
                        field = "new";
                        cm.sendYesNo("#b카니발 필드#k를 개설하겠나? 필드를 개설하면 #b3분 간#k 다른 파티의 입장 신청을 받을 수 있지. 입장을 수락하면, 상대 파티가 자동으로 들어온다네.")
                    }
                } else {
                    cm.sendOk("파티 인원수가 맞지 않는 것 같구만. 파티 인원수를 확인하고 다시 신청하게나.");
                }
            } else if (cm.getParty() != null && (cm.getEventManager("cpq").getInstance("cpq" + mapid).getPlayerCount() == cm.getParty().getMembers().size() || cm.getPlayer().isSuperGM())) {
                if (checkLevelsAndMap(30, 50) == 1 && !cm.getPlayer().isSuperGM()) {
                    cm.sendOk("흠.. 요구 레벨에 맞지 않는 파티원이 있는 것 같군. 요구 레벨은 #r30 ~ 50#k 이라네.");
                    cm.dispose();
                } else if (checkLevelsAndMap(30, 50) == 2) {
                    cm.sendOk("파티원 전원이 이곳에 있어야 한다네.");
                    cm.dispose();
                } else {
                    //Send challenge packet here
                    field = "join";
                    owner = cm.getChannelServer().getPlayerStorage().getCharacterByName(cm.getEventManager("cpq").getInstance("cpq" + mapid).getPlayers().get(0).getParty().getLeader().getName());
                    var info = cm.getCarnivalChallenge(owner);
                    cm.sendYesNo("이 파티에 카니발 도전을 하겠는가?\r\n\r\n" + info.getChallengeInfo());
                }
            } else {
                cm.sendOk("흐음... 이 파티의 인원수와 자네의 파티의 인원 수가 일치하지 않는 것 같군. 인원이 똑같아야 파티에 도전 신청을 할 수 있다네.");
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (status == 2) {
        if (field.equals("new")) {
            var event = cm.getEventManager("cpq").getInstance("cpq" + mapid);
            if (event == null) {
                cm.getEventManager("cpq").startInstance("" + mapid, cm.getPlayer());
                cm.dispose();
            } else {
                cm.sendOk("이미 다른 파티가 카니발 필드를 개설해서 대기중이라네. 다른 필드를 선택해 보게나.");
                cm.dispose();
            }
        } else if (field.equals("join")) {
            if (owner.getConversation() != 1) {
                owner.addCarnivalRequest(cm.getCarnivalChallenge(cm.getChar()));
                cm.openNpc(owner.getClient(), 2042001);
            } else {
                cm.sendOk("다른 파티가 신청 중이니 잠시 후 다시 시도해 보게.");
                cm.dispose();
                return;
            }
            cm.sendOk("카니발 도전 신청을 보냈네. 상대 파티장이 도전을 수락하면 자동으로 파티원 전체가 이동될걸세.");
            cm.dispose();
        } else {
            cm.sendOk("흐음.. 문제가 발생한 것 같군. 다음에 다시 시도해 주게나.")
            cm.dispose();
        }
    }
//메이플 코인
//    else if (status == 2) {
//        if (selection == 0) {
//            if (!cm.haveItem(4001129,50)) {
//                cm.sendOk("You have no items.");
//            } else if (!cm.canHold(1122007,1)) {
//                cm.sendOk("Please make room");
//            } else {
//                cm.gainItem(1122007,1);
//                cm.gainItem(4001129,-50);
//            }
//            cm.dispose();
//        } else if (selection == 1) {
//            if (!cm.haveItem(4001129,30)) {
//                cm.sendOk("You have no items.");
//            } else if (!cm.canHold(2041211,1)) {
//                cm.sendOk("Please make room");
//            } else {
//                cm.gainItem(2041211,1);
//                cm.gainItem(4001129,-30);
//            }
//            cm.dispose();
//        } else if (selection == 2) {
//            if (!cm.haveItem(4001254,50)) {
//                cm.sendOk("You have no items.");
//            } else if (!cm.canHold(1122058,1)) {
//                cm.sendOk("Please make room");
//            } else {
//                cm.gainItem(1122058,1);
//                cm.gainItem(4001254,-50);
//            }
//            cm.dispose();
//        }
//    }
}

function checkLevelsAndMap(lowestlevel, highestlevel) {
    var party = cm.getParty().getMembers();
    var mapId = cm.getMapId();
    var valid = 0;
    var inMap = 0;

    var it = party.iterator();
    while (it.hasNext()) {
        var cPlayer = it.next();
        if (!(cPlayer.getLevel() >= lowestlevel && cPlayer.getLevel() <= highestlevel) && cPlayer.getJobId() != 500) {
            valid = 1;
        }
        if (cPlayer.getMapid() != mapId) {
            valid = 2;
        }
    }
    return valid;
}

function getCPQField(fieldnumber) {
    var status = "";
    var event1 = cm.getEventManager("cpq");
    if (event1 != null) {
        var event = event1.getInstance("cpq" + (980000000 + (fieldnumber * 100)));
        if (event == null && fieldnumber != 5 && fieldnumber != 6 && fieldnumber != 9) {
            status = "카니발 필드" + fieldnumber + " (2 vs 2)";
        } else if (event == null) {
            status = "카니발 필드" + fieldnumber + " (3 vs 3)";
        } else if (event != null && (event.getProperty("started").equals("false")) && event.getPlayerCount() < (fieldnumber != 5 && fieldnumber != 6 && fieldnumber != 9 ? 4 : 6)) {
            var averagelevel = 0;
            status += "카니발 필드" + fieldnumber;
            for (i = 0; i < event.getPlayerCount(); i++) {
                averagelevel += event.getPlayers().get(i).getLevel();
            }
            averagelevel /= event.getPlayerCount();
            status += " (" + event.getPlayers().get(0).getParty().getLeader().getName() + "/" + event.getPlayerCount() + "명/평균레벨 " + java.lang.Math.floor(averagelevel) + ")";
        }
    }
    return status;
}
