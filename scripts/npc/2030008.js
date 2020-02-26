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
 * NPCID : 2030008
 * ScriptName : Zakum00
 * NPCNameFunc : 아도비스
 * Location : 211042300 (폐광 - 자쿰으로통하는문)
 * 
 * @author T-Sun
 *
 */

var status;
var mapId = 211042300;
var stage;
var teethmode;

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
    cm.removeAll(4001015);
    cm.removeAll(4001016);
    cm.removeAll(4001018);
    if (status == 0) {
        if (cm.getPlayerStat("LVL") >= 50) {
            if (cm.getQuestStatus(100200) != 2) {
                cm.startQuest(100200);
                cm.sendOk("이곳은 원래 평화로운 마을이었지만.. 어느 순간부터 페허가 되고 말았지. 이 안에 있는 괴물을 처치하고 이 마을에 다시 평화를 가져다 줄 사람을 찾고 있네만.. 흐음..");
                cm.dispose();
                return;
            } else if (cm.getQuestStatus(100201) == 1) {
                // if they have gold teeth and the other items, they are good to go
                teethmode = 1;
                cm.sendNext("오오, #b#i4000082# #t4000082# 30#k개를 모아온건가?");
            } else {
                if (cm.haveItem(4001109)) {
                    cm.sendSimple("뭐... 좋소. 당신들은 충분한 자격이 되어 보이는군. 어느 단계에 도전해 보겠소?\r\n\r\n#b#L0#1단계 - 불의 원석#l\r\n#L1#2단계 - 화산의 숨결#l\r\n#L2#3단계 - 불의 눈 제#l\r\n#L3#용암의 심장부로 가기#l\r\n");
                } else {
                    cm.sendSimple("뭐... 좋소. 당신들은 충분한 자격이 되어 보이는군. 어느 단계에 도전해 보겠소?\r\n\r\n#b#L0#1단계 - 불의 원석#l\r\n#L1#2단계 - 화산의 숨결#l\r\n#L2#3단계 - 불의 눈 제련#l");
                }
            }
            if (cm.getQuestStatus(100201) == 2) { // They're done the quests
                teethmode = 2;
            }
        } else {
            cm.sendOk("자네는 이 안에 들어가 문제를 해결하기엔 너무 약하군.");
            cm.dispose();
        }
    } else if (status == 1) {
        //quest is good to go.
        // if they're working on this quest, he checks for items.
        if (teethmode == 1) {
            // check for items
            if (cm.haveItem(4000082,30)) { // take away items, give eyes of fire, complete quest
                if (cm.canHold(4001017)) {
                    cm.removeAll(4031061);
                    cm.removeAll(4031062);
                    cm.gainItem(4000082, -30);
                    cm.gainItem(4001017, 5);
                    cm.sendNext("자, 불의 눈이 제련되었다네. 이걸 자쿰나무 제단에 떨어뜨리면 자쿰이 나타날걸세.");
                    cm.completeQuest(100201);
                    cm.completeQuest(100200);
                } else {
                    cm.sendNext("흐음.. 재료들은 모두 제대로 갖고 있는건가? 혹은 인벤토리에 공간이 부족한건 아닌가? 재료가 없다면 이전 시련부터 다시 클리어해주게.");
                }
                cm.dispose();
            } else { // go get more
                cm.sendNext("흐음.. 재료들은 모두 제대로 갖고 있는건가? 혹은 인벤토리에 공간이 부족한건 아닌가? 재료가 없다면 이전 시련부터 다시 클리어해주게.");
                cm.dispose();
            }
            return;
        }
        if (selection == 0) { //ZPQ
            if (cm.getParty() == null) { //no party
                cm.sendNext("이 안은 파티를 이루어야만 들어갈 수 있다네. 파티를 만들거나 다른 파티에 참여해 보게나.");
                cm.safeDispose();
                return;
            }
            else if (!cm.isLeader()) { //not party leader
                cm.sendNext("파티장만이 나에게 입장 허가 신청을 할 수 있다네. 파티장에게 퀘스트를 시작할 것을 요청해 보게.");
                cm.safeDispose();
                return;
            }
            else {
                //check each party member, make sure they're above 50 and still in the door map
                //TODO: add zakum variable to characters, check that instead; less hassle
                var party = cm.getParty().getMembers();
                mapId = cm.getMapId();
                var next = true;

                for (var i = 0; i < party.size(); i++) {
                    if ((party.get(i).getLevel() < 50) || (party.get(i).getMapid() != mapId)) {
                        next = false;
                    }
                }

                if (next) {
                    //all requirements met, make an instance and start it up
                    var em = cm.getEventManager("ZakumPQ");
                    if (em == null) {
                        cm.sendOk("지금은 무언가 문제가 생긴 것 같군..");
                    } else {
                        var prop = em.getProperty("state");
                        if (prop.equals("0") || prop == null) {
                            em.startInstance(cm.getParty(), cm.getMap());
                        } else {
                            cm.sendOk("이미 다른 파티가 클리어에 도전하고 있습니다. 잠시 후 다시 시도해주세요.");
                        }
                    }
                    cm.dispose();
                } else {
                    cm.sendNext("파티원이 이곳에 모두 모여 있긴 한건가? 또는 적정 레벨이 되는지 확인하게.");
                    cm.dispose();
                }
            }
        } else if (selection == 1) { //Zakum Jump Quest
            stage = 1;
            if (cm.haveItem(4031061) && !cm.haveItem(4031062)) {
                // good to go
                cm.sendYesNo("첫번째 임무를 훌륭하게 완수했군. 하지만 자쿰을 만나기 위해선 아직 갈 길이 멀다네. 다음 임무에 도전해 보고 싶은가?");
            } else {
                if (cm.haveItem(4031062))
                    cm.sendNext("이미 #b#t4031062##k를 갖고 있잖은가? 그렇다면 이곳에 다시 갈 필요 없다네.");
                else
                    cm.sendNext("흐음.. 자네, 이전 시련은 완수한 것인가? 이전 시련부터 클리어를 해야한다네.");
                cm.dispose();
            }
        } else if (selection == 2) { //Golden Tooth Collection
            stage = 2;
            if (teethmode == 2 && cm.haveItem(4031061) && cm.haveItem(4031062)) {
                // Already done it once, they want more
                cm.sendYesNo("오오, #b#i4000082# #t4000082# 30#k개를 모아온건가? 지금 바로 제련을 해보겠나?");
            } else if (cm.haveItem(4031061) && cm.haveItem(4031062)) {
                // check if quest is complete, if so reset it (NOT COMPLETE)
                cm.sendYesNo("오오, 드디어 불의 눈을 제련할 준비가 된건가? 제련비로 #b#i4000082# #t4000082# 30#k개를 모아오게. 어디에 쓸건지는 묻지말고.. 흠흠..");
            } else {
                cm.sendNext("흐음.. 자네, 이전 시련은 완수한 것인가? 이전 시련부터 클리어를 해야한다네.");
                cm.dispose();
            }
        } else if (selection == 3) { // Enter the center of Lava, quest
            var dd = cm.getEventManager("FireDemon");
            if (dd != null && cm.haveItem(4001109)) {
                dd.startInstance(cm.getPlayer());
            } else {
                cm.sendOk("An unknown error occured.");
            }
            cm.dispose();
        }
    } else if (status == 2) {
        if (stage == 1) {
            cm.warp(280020000, 0); // Breath of Lava I
            cm.dispose();
        }
        else if (stage == 2) {
            if (teethmode == 2) {
                if (cm.haveItem(4031061,1) && cm.haveItem(4031062,1) && cm.haveItem(4000082,30)) { // take away items, give eyes of fire, complete quest
                    if (cm.canHold(4001017)) {
                        cm.gainItem(4031061, -1);
                        cm.gainItem(4031062, -1);
                        cm.gainItem(4000082, -30);
                        cm.gainItem(4001017, 5);
                        cm.sendNext("자, 불의 눈이 제련되었다네. 이걸 자쿰나무 제단에 떨어뜨리면 자쿰이 나타날걸세.");
                        cm.completeQuest(100201);
                        cm.completeQuest(100200);
                    } else {
                        cm.sendNext("흐음.. 재료들은 모두 제대로 갖고 있는건가? 혹은 인벤토리에 공간이 부족한건 아닌가? 재료가 없다면 이전 시련부터 다시 클리어해주게.");
                    }
                    cm.dispose();
                } else {
                    cm.sendNext("흐음.. 재료들은 모두 제대로 갖고 있는건가? 혹은 인벤토리에 공간이 부족한건 아닌가? 재료가 없다면 이전 시련부터 다시 클리어해주게." );
                    cm.dispose();
                }
            } else {
                cm.startQuest(100201);
                cm.dispose();
            }
        }
    } else {
        cm.dispose();
    }
}