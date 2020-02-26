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
 * NPCID : 1012112
 * ScriptName : moonrabbit
 * NPCNameFunc : 토리
 * Location : 910010400 (히든스트리트 - 지름길)
 * Location : 100000200 (빅토리아로드 - 헤네시스공원)
 * Location : 910010100 (히든스트리트 - 지름길)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var minLevel = 10; // 35
var maxLevel = 200; // 65

var minPartySize = 3;
var maxPartySize = 6;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            cm.dispose();
            return;
        }
        status--;
    }
    //    if (cm.getPlayer().getMapId() == 100000200) {
    //        if (cm.getParty() == null) {
    //            cm.sendOk("파티가 없죠?");
    //            cm.dispose();
    //        } else if (cm.isLeader()) {
    //            cm.sendOk("파티장이 아니죠?");
    //            cm.dispose();
    //        } else {
    ////            cm.sendSimple("ㅇㅇ?\r\n\r\n#b#L0#입장#l")
    //        }
    //    }



    //    if (cm.getPlayer().getMapId() != 100000200) {
    //	if (status == 0) {
    //	    cm.sendYesNo("Would you like to move to the Party Quest map?");
    //	} else {
    //	    cm.saveLocation("MULUNG_TC");
    //	    cm.warp(910010500,0);
    //	    cm.dispose();
    //	}
    //	return;
    //    }
    if (status == 0) {
        if (cm.getPlayer().getMapId() == 910010100 || cm.getPlayer().getMapId() == 910010400) {
            cm.sendSimple("무엇을 도와 드릴까요?#b\r\n\r\n#L0#이곳에서 나가고 싶어요#l");
            return;
        }



        if (cm.getParty() == null) { // No Party
            cm.sendSimple("안녕하세요? 저는 토리라고 합니다. 이 안은 달맞이꽃이 피어나는 아름다운 언덕이에요. 그런데 그 곳에 살고 있는 어흥이라는 호랑이가 몹시 배가 고파 먹을 것을 찾고 있다고 하네요.\r\n\r\n#b #L33#떡 20개를 가져 왔어요.#l");
        } else if (!cm.isLeader()) { // Not Party Leader
            cm.sendSimple("퀘스트에 도전해 보고 싶다면 #b파티장#k에게 제게 말을 걸어달라고 해주세요.\r\n\r\n#b #L33#떡 20개를 가져 왔어요.#l");
            cm.dispose();
        } else {
            // Check if all party members are within PQ levels
            var party = cm.getParty().getMembers();
            var mapId = cm.getMapId();
            var next = true;
            var levelValid = 0;
            var inMap = 0;
            var it = party.iterator();

            while (it.hasNext()) {
                var cPlayer = it.next();
                if ((cPlayer.getLevel() >= minLevel) && (cPlayer.getLevel() <= maxLevel)) {
                    levelValid += 1;
                } else {
                    next = false;
                }
                if (cPlayer.getMapid() == mapId) {
                    inMap += (cPlayer.getJobId() == 900 ? 6 : 1);
                }
            }
            if (party.size() > maxPartySize || inMap < minPartySize) {
                next = false;
            }
            if (next) {
                var em = cm.getEventManager("HenesysPQ");
                var em2 = cm.getEventManager("HenesysPQBonus");
                if (em == null || em2 == null) {
                    cm.sendOk("퀘스트에 현재 오류가 있습니다.");
                    cm.dispose();
                } else {
                    var prop = em.getProperty("state");
                    var prop2 = em2.getProperty("state");
                    if ((prop.equals("0") || prop == null) && (prop2.equals("0") || prop2 == null)) {
                        em.startInstance(cm.getParty(), cm.getMap(), 200);
                        cm.removeAllParty(4001101);
                        cm.removeAllParty(4001100);
                        cm.removeAllParty(4001099);
                        cm.removeAllParty(4001098);
                        cm.removeAllParty(4001097);
                        cm.removeAllParty(4001096);
                        cm.removeAllParty(4001095);
                        cm.dispose();
                        return;
                    } else {
                        cm.sendSimple("이미 다른 파티가 이 안에 들어가서 퀘스트에 도전중입니다. 잠시 후 다시 시도해 주세요.\r\n\r\n#b #L33#떡 20개를 가져 왔어요.#l");
                    }
                }
            } else {
                cm.sendSimple("퀘스트에 도전하려면 다음과 같은 조건을 만족시켜야 합니다\r\n\r\n#r필요조건: 최소 " + minPartySize + " 명의 파티, 레벨제한 : " + minLevel + " ~ " + maxLevel + "\r\n\r\n#b #L33#떡 20개를 가져 왔어요.#l");
            }
        }
    } else if (status == 1) {
        if (selection == 33) {
            if (cm.haveItem(4001101, 20) && cm.canHold(1002798, 1)) {
                if (cm.getPlayer().getOneInfo(1200, "have") == null) {
                    cm.getPlayer().updateOneInfo(1200, "have", "1");
                }
                cm.gainItem(4001101, -20);
                cm.gainItem(1002798, 1);
                cm.sendOk("떡 20개를 모아오셨군요! 선물로 #b머리위에 떡 하나#k 를 드리도록 할게요!");
            } else {
                cm.sendOk("떡은 제대로 갖고 계신지, 혹은 인벤토리 공간이 부족하신 건 아닌지 확인해주세요.")
            }
            cm.dispose();
            return;
        }
        if (cm.getPlayer().getMapId() == 910010100 || cm.getPlayer().getMapId() == 910010400) {
            cm.warp(100000200);
            cm.removeAllParty(4001101);
            cm.removeAllParty(4001100);
            cm.removeAllParty(4001099);
            cm.removeAllParty(4001098);
            cm.removeAllParty(4001097);
            cm.removeAllParty(4001096);
            cm.removeAllParty(4001095);
            cm.dispose();
        }
    }
}