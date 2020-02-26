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
 * NPCID : 2091005
 * ScriptName : dojang_enter
 * NPCNameFunc : 소공
 * Location : 925023800 (무릉도장 - 무릉도장 38층)
 * Location : 925020001 (무릉도장 - 무릉도장 대청)
 * Location : 925020100 (무릉도장 - 무릉도장 1층)
 * Location : 925023300 (무릉도장 - 무릉도장 33층)
 * Location : 925023400 (무릉도장 - 무릉도장 34층)
 * Location : 925023500 (무릉도장 - 무릉도장 35층)
 * Location : 925023600 (무릉도장 - 무릉도장 36층)
 * Location : 925023700 (무릉도장 - 무릉도장 37층)
 * Location : 925022800 (무릉도장 - 무릉도장 28층)
 * Location : 925022900 (무릉도장 - 무릉도장 29층)
 * Location : 925023100 (무릉도장 - 무릉도장 31층)
 * Location : 925023000 (무릉도장 - 무릉도장 30층)
 * Location : 925023200 (무릉도장 - 무릉도장 32층)
 * Location : 925022300 (무릉도장 - 무릉도장 23층)
 * Location : 925022400 (무릉도장 - 무릉도장 24층)
 * Location : 925022500 (무릉도장 - 무릉도장 25층)
 * Location : 925022700 (무릉도장 - 무릉도장 27층)
 * Location : 925022600 (무릉도장 - 무릉도장 26층)
 * Location : 925021900 (무릉도장 - 무릉도장 19층)
 * Location : 925021700 (무릉도장 - 무릉도장 17층)
 * Location : 925021800 (무릉도장 - 무릉도장 18층)
 * Location : 925022100 (무릉도장 - 무릉도장 21층)
 * Location : 925022200 (무릉도장 - 무릉도장 22층)
 * Location : 925022000 (무릉도장 - 무릉도장 20층)
 * Location : 925021400 (무릉도장 - 무릉도장 14층)
 * Location : 925021200 (무릉도장 - 무릉도장 12층)
 * Location : 925021300 (무릉도장 - 무릉도장 13층)
 * Location : 925021600 (무릉도장 - 무릉도장 16층)
 * Location : 925021500 (무릉도장 - 무릉도장 15층)
 * Location : 925020900 (무릉도장 - 무릉도장 9층)
 * Location : 925020800 (무릉도장 - 무릉도장 8층)
 * Location : 925020700 (무릉도장 - 무릉도장 7층)
 * Location : 925021100 (무릉도장 - 무릉도장 11층)
 * Location : 925021000 (무릉도장 - 무릉도장 10층)
 * Location : 925020400 (무릉도장 - 무릉도장 4층)
 * Location : 925020300 (무릉도장 - 무릉도장 3층)
 * Location : 925020200 (무릉도장 - 무릉도장 2층)
 * Location : 925020610 (무릉도장 - 무릉도장 6층)
 * Location : 925020600 (무릉도장 - 무릉도장 6층)
 * Location : 925020500 (무릉도장 - 무릉도장 5층)
 * 
 * @author T-Sun
 *
 */
/*
 Map : Mu Lung Training Center
 Npc : So Gong
 Desc : Training Center Start
 */

var status = -1;
var sel;
var mapid;

function start() {
    mapid = cm.getMapId();
    if (mapid == 925020001) {
        cm.sendSimple("우리 사부님은 무릉에서 최고로 강한 분이지. 그런 분에게 네가 도전하겠다고? 나중에 후회하지마. \r #b#L0# 혼자 도전해볼게.#l \n\r #L1# 같이 도전해볼게.#l \n\r #L2# 허리띠를 받고 싶어.#l \n\r #L3# 수련점수를 초기화 할게.#l \n\r #L5# 무릉 도장이 뭐지?#l"); // 
    } else if (isRestingSpot(mapid)) {
        cm.sendSimple("여기까지 무사히 잘왔다니 놀랍네. 하지만 앞으로는 쉽지 않을걸? 어때 계속 도전해 보겠어?#b \n\r #L0# 계속 도전해볼게.#l \n\r #L1# 밖으로 나가겠어.#l \n\r #L2# 진행 상황을 저장하겠어.#l");
    } else {
        cm.sendYesNo("결국 포기하는거야? 정말 나가겠어?");
    }
}

function action(mode, type, selection) {
    if (mapid == 925020001) {
        if (mode == 1) {
            status++;
        } else {
            cm.dispose();
            return;
        }
        if (status == 0) {
            sel = selection;

            if (sel == 5) {
                cm.sendNext("우리 사부님은 무릉에서 가장 강한 분이야. 그런 사부님께서 만드신 곳이 바로 이 무릉 도장이라는 것이지. 무릉 도장은 38층이나 되는 높은 건물이야. 하나하나 올라가면서 자신을 수련할 수 있어. 물론 너의 실력으로는 끝까지 가기 힘들겠지만.");
                cm.dispose();
            } else if (sel == 3) {
                cm.sendYesNo("수련 점수를 초기화 하겠다고? 수련점수를 초기화 하면 지금까지 모아놨던 수련점수가 모두 사라지고, 받았던 허리띠들을 처음부터 다시 받을 수 있어. 어때? 정말 초기화 하고 싶어?");
            } else if (sel == 2) {
                var str = "당신의 수련 점수는 #b" + cm.getDojoPoints() + "#k 점 이에요. 사부님은 재능 있는 사람들을 좋아하세요. 수련점수를 일정 수준 이상 획득하면, 점수에 따라 허리띠를 받으실 수 있답니다.\n\r ";
                var record = cm.getDojoRecord();
                for (var i = 0; i < 5; ++i) {
                    var a = "";
                    if (i < record) {
                        a = "(획득)"
                    }
                    str += " #L" + i + "##i" + (1132000 + i) + ":# #z" + (1132000 + i) + "# " + a + "#l \r\n";
                }
                cm.sendSimple(str);
                //#L0##i1132000:# #t1132000##l \n\r #L1##i1132001:# #t1132001##l \n\r #L2##i1132002:# #t1132002##l \n\r #L3##i1132003:# #t1132003##l \n\r #L4##i1132004:# #t1132004##l
            } else if (sel == 1) {
                if (cm.getParty() != null) {
                    if (cm.isLeader()) {
                        cm.sendOk("지금 도전을 시작하게 해 줄게.");
                    } else {
                        cm.sendOk("음, 네가 파티장이 아닌 것 같은데?");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("파티에 가입되어 있긴 한거야?");
                    cm.dispose();
                }
            } else if (sel == 0) {
                if (cm.getParty() != null) {
                    cm.sendOk("파티에 가입되어 있는 것 같은데?");
                    cm.dispose();
                }
                var record = cm.getQuestRecord(150000);
                var data = record.getCustomData();

                if (data != null) {
                    var idd = get_restinFieldID(parseInt(data));
                    if (idd != 925020002) {
                        cm.dojoAgent_NextMap(true, true, idd);
                        record.setCustomData(null);
                    } else {
                        cm.sendOk("Please try again later.");
                    }
                } else {
                    if (!cm.start_DojoAgent(true, false)) {
                        cm.sendOk("무릉도장이 꽉 찬 것 같아. 다음에 다시 도전해 봐.");
                    }
                }
                cm.dispose();
                // cm.sendYesNo("The last time you took the challenge yourself, you were able to reach Floor #18. I can take you straight to that floor, if you want. Are you interested?");
            }
        } else if (status == 1) {
            if (sel == 3) {
                cm.setDojoRecord(true);
                cm.sendOk("수련점수를 초기화 했어.");
                cm.dispose();
            } else if (sel == 2) {
                var record = cm.getDojoRecord();
                var required = 0;
                var level = 0;

                switch (selection) {
                    case 0:
                        level = 25;
                        required = 200;
                        break;
                    case 1:
                        level = 35;
                        required = 1800;
                        break;
                    case 2:
                        level = 45;
                        required = 4000;
                        break;
                    case 3:
                        level = 60;
                        required = 9200;
                        break;
                    case 4:
                        level = 75;
                        required = 17000;
                        break;
                }

                var item = 1132000 + selection;

                if (record == selection && cm.getDojoPoints() >= required && cm.getPlayerStat("LVL") >= level) {
                    if (cm.canHold(item)) {
                        cm.gainItem(item, 1);
                        cm.setDojoRecord(false);
                    } else {
                        cm.sendOk("인벤토리에 충분한 공간이 있는지 확인해 줄래?");
                    }
                } else if (record > selection) {
                    cm.sendOk("이미 확득한 허리띠 인것 같은데? 허리띠는 한번 밖에 받을 수 없어.");
                } else if (record != selection) {
                    cm.sendOk("아직 하위 단계 허리띠를 받지 않은 것 같은데? 허리띠는 순차적으로 획득할 수 있어.");
                } else {
                    var str = "#i" + item + ":# #b#t" + item + "##k를 받기 위해서는 #b" + level + " 레벨#k 이상이어야 하며, 누적 수련점수 " + required + " 점이 필요해.\r\n\r\n네가 이 허리띠를 받으려면 ";
                    if (cm.getDojoPoints() < required) {
                        str += "수련점수를 #r" + (required - cm.getDojoPoints()) + "#k점이나 더 쌓아야 한다고.";
                    } else if (cm.getPlayerStat("LVL") < level) {
                        str += "레벨을 #r" + (level - cm.getPlayerStat("LVL")) + "#k이나 더 올려야 한다고.";
                    }
                    cm.sendNext(str);
                }
                cm.dispose();
            } else if (sel == 1) {
                if (!cm.start_DojoAgent(true, true)) {
                    cm.sendOk("무릉도장이 꽉 찬 것 같아. 다음에 다시 도전해 봐.");
                }
                cm.dispose();
            }
        }
    } else if (isRestingSpot(mapid)) {
        if (mode == 1) {
            status++;
        } else {
            cm.dispose();
            return;
        }

        if (status == 0) {
            sel = selection;

            if (sel == 0) {
                if (cm.getParty() == null || cm.isLeader()) {
                    cm.dojoAgent_NextMap(true, true);
                } else {
                    cm.sendOk("파티장만 도전을 신청할 수 있어.");
                }
                //cm.getQuestRecord(150000).setCustomData(null);
                cm.dispose();
            } else if (sel == 1) {
                cm.askAcceptDecline("결국 포기하는거야? 정말 나가겠어?");
            } else if (sel == 2) {
                if (cm.getParty() == null) {
                    var stage = get_stageId(cm.getMapId());

                    cm.getQuestRecord(150000).setCustomData(stage);
                    cm.sendOk("진행상황이 저장되었어. 다음에 다시 도전할때, 이 층으로 바로 올라올 수 있을거야.");
                    cm.dispose();
                } else {
                    cm.sendOk("같이 도전중일때는 진행상황을 저장할 수 없어.");
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            if (sel == 1) {
                if (cm.isLeader()) {
                    cm.warpParty(925020002);
                } else {
                    cm.warp(925020002);
                }
            }
            cm.dispose();
        }
    } else {
        if (mode == 1) {
            if (cm.isLeader()) {
                cm.warpParty(925020002);
            } else {
                cm.warp(925020002);
            }
        }
        cm.dispose();
    }
}

function get_restinFieldID(id) {
    var idd = 925020002;
    switch (id) {
        case 1:
            idd = 925020600;
            break;
        case 2:
            idd = 925021200;
            break;
        case 3:
            idd = 925021800;
            break;
        case 4:
            idd = 925022400;
            break;
        case 5:
            idd = 925023000;
            break;
        case 6:
            idd = 925023600;
            break;
    }
    for (var i = 0; i < 10; i++) {
        var canenterr = true;
        for (var x = 1; x < 39; x++) {
            var map = cm.getMap(925020000 + 100 * x + i);
            if (map.getCharactersSize() > 0) {
                canenterr = false;
                break;
            }
        }
        if (canenterr) {
            idd += i;
            break;
        }
    }
    return idd;
}

function get_stageId(mapid) {
    if (mapid >= 925020600 && mapid <= 925020614) {
        return 1;
    } else if (mapid >= 925021200 && mapid <= 925021214) {
        return 2;
    } else if (mapid >= 925021800 && mapid <= 925021814) {
        return 3;
    } else if (mapid >= 925022400 && mapid <= 925022414) {
        return 4;
    } else if (mapid >= 925023000 && mapid <= 925023014) {
        return 5;
    } else if (mapid >= 925023600 && mapid <= 925023614) {
        return 6;
    }
    return 0;
}

function isRestingSpot(id) {
    return (get_stageId(id) > 0);
}