
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
         * NPCID : 2013000
         * ScriptName : party3_enter
         * NPCNameFunc : 요정 웡키
         * Location : 200080101 (히든스트리트 - 알수없는탑)
         * Location : 920010000 (히든스트리트 - 여신의 탑<입구>)
         * 
         * @author T-Sun
         *
         */
        importPackage(java.lang);
var status = -1;
var pBuff = -1;
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
    nFieldId = cm.getPlayer().getMapId();
    if (nFieldId == 200080101) {
        q1 = cm.getQuestRecord(7521);
        if (q1.getCustomData() == null) {
            q1.setCustomData("00");
        }
        q2 = cm.getQuestRecord(7522);
        if (q2.getCustomData() == null) {
            q2.setCustomData("1000000");
        }
        q3 = cm.getQuestRecord(7524);
        if (q3.getCustomData() == null) {
            q3.setCustomData(cm.getCurrentTime() + "");
        }
        var value = Integer.parseInt(q2.getCustomData().substring(0, 3));
        if (status == 0) {
            //            cm.playerMessage(value);
            if (value >= 100 && value < 200)
                cm.sendSimple("안녕? 난 요정 웡키라고 해. 여신의 탑을 모험하고 싶으면 나에게 이야기 하라고~ \r\n\r\n#b#L0# 입장을 신청한다.#l\r\n#L1# 여신의 탑에 대해 묻는다.\r\n#L2# 웡키에게 먹을 것을 준다.#l");
            else if (value >= 200 && value < 300)
                cm.sendSimple("안녕? 난 요정 웡키라고 해. 여신의 탑을 모험하고 싶다면 언제든지 내게 말해줘~ \r\n\r\n#b#L0# 입장을 신청한다.#l\r\n#L1# 여신의 탑에 대해 묻는다.\r\n#L2# 웡키에게 먹을 것을 준다.#l");
            else if (value >= 300 && value < 400)
                cm.sendSimple("#b#h0##k! 돌아와줬구나~ 반가워! 헤헤. 언제든지 여신의 탑을 모험하고 싶으면 나에게 이야기 하라고~ \r\n\r\n#b#L0# 입장을 신청한다.#l\r\n#L1# 여신의 탑에 대해 묻는다.\r\n#L2# 웡키에게 먹을 것을 준다.#l");
            else
                cm.sendSimple("기다렸다구! 왜 이제야 오는거야~?! 얼른 여신의 탑으로 모험을 떠나자구! \r\n\r\n#b#L0# 입장을 신청한다.#l\r\n#L1# 여신의 탑에 대해 묻는다.\r\n#L2# 웡키에게 먹을 것을 준다.#l");
        } else if (status == 1) {
            mySel = selection;
            if (selection == 0) {
                if (cm.getParty() == null) {
                    cm.sendOk("파티원을 모으거나 파티에 참가한 후에 여신의 흔적을 찾으러 갈 수 있어.");
                    cm.dispose();
                    return;
                }
                var time = Long.parseLong(q3.getCustomData());
                if (cm.getCurrentTime() - time >= 3600000 || q1.getCustomData().equals("00")) {
                    rNum = cm.rand(10, 49);
                    q1.setCustomData(rNum + "");
                    q3.setCustomData(cm.getCurrentTime() + "");
                }
                //                cm.playerMessage(q1.getCustomData());
                rNum = Integer.parseInt(q1.getCustomData());
                pInfo = premission(rNum);
                cm.sendYesNo("직업은 #b" + pInfo['job'] + "#k, 레벨은 #b" + pInfo['level'] + "#k 인 친구를 파티에 참가시켜보겠어? 뭔가 좋은 일이 생길지도 몰라.\r\n하지만 제안일 뿐이니까 꼭 할 필요는 없어. 만약 그냥 입장하고 싶다면 아니오를 선택하면 돼.");
            } else if (selection == 1) {
                cm.sendNext("며칠 전에 갑자기 오르비스 구름 위에 가장 아름다운 여신, 미네르바와 신비한 탑이 나타났어.")
            } else if (mySel == 2) {
                cm.sendSimple("와~ 맛있는 음식을 준다고? 고마워~! 어떤 음식을 줄거야?\r\n#b#L0# #t2020001##l\r\n#b#L1# #t2022001##l\r\n#b#L2# #t2020004##l\r\n#b#L3# #t2022003##l\r\n#b#L4# #t2001001##l\r\n#b#L5# #t2020028##l\r\n#b#L6# #t2001002##l");
            }
        } else if (status == 2) {
            if (mySel == 0) {
                var result = -1;
                if (selection == 1) {
                    result = premission_decision(cm, rNum);
                } else {
                    result = 0;
                }
                if (result == 1) {
                    pBuff = cm.rand(0, 3);
                    if (pBuff == 0) {
                        cm.sendNext("와우~ 대단한데? 내가 말한 대로 딱 맞췄어. #b입장할 때 30분간 공격력, 마력 상승 마법#k을 걸어줄게. 여신의 흔적을 찾는데 도움이 될거야.");
                    } else
                    if (pBuff == 1) {
                        cm.sendNext("와우~ 대단한데? 내가 말한 대로 딱 맞췄어. #b입장할 때 30분간 물리방어력, 마법방어력 상승 마법#k을 걸어줄게. 여신의 흔적을 찾는데 도움이 될거야.");
                    } else
                    if (pBuff == 2) {
                        cm.sendNext("와우~ 대단한데? 내가 말한 대로 딱 맞췄어. #b입장할 때 30분간 이동속도, 점프력 상승 마법#k을 걸어줄게. 여신의 흔적을 찾는데 도움이 될거야.");
                    } else
                    if (pBuff == 3) {
                        cm.sendNext("와우~ 대단한데? 내가 말한 대로 딱 맞췄어. #b입장할 때 30분간 명중율, 회피율 상승 마법#k을 걸어줄게. 여신의 흔적을 찾는데 도움이 될거야.");
                    }
                } else if (result == 2) {
                    cm.sendNext("미션을 만족하지 못했거나, 파티원이 모두 이곳에 있지 않아. 직업은 #b" + pInfo['job'] + "#k,  레벨은 #b" + pInfo['level'] + "#k 라구.");
                    status = -1;
                } else {
                    cm.sendNext("알았어, 여신의 탑으로 이동시켜 줄게. 꼭 임무를 완수하고 여신 미네르바의 행방을 찾아줘~")
                }
            } else if (mySel == 1) {
                status = -1;
                cm.sendNext("그런데 어느 순간 갑자기 여신은 사라지고 탑은 제어 불능에 빠져버렸어. 아무래도 여신이 탑 어딘가에 갇혀 있는 것 같아. 너는 어떻게 생각해? 그 탑을 탐험하고 여신의 흔적을 찾아 떠나보고 싶지 않아?");
            } else if (mySel == 2) {
                var item;
                switch (selection) {
                    case 0:
                        item = 2020001;
                        break;
                    case 1:
                        item = 2022001;
                        break;
                    case 2:
                        item = 2020004;
                        break;
                    case 3:
                        item = 2022003;
                        break;
                    case 4:
                        item = 2001001;
                        break;
                    case 5:
                        item = 2020028;
                        break;
                    case 6:
                        item = 2001002;
                        break;
                }
                if (cm.haveItem(item, 1)) {
                    cm.gainItem(item, -1);
                    cm.playSound(false, "Party1/Clear");
                    feellike(cm, selection + 1);
                    cm.dispose();
                } else {
                    feellike(cm, -1);
                    cm.sendOk("#b#t" + item + "##k .. 분명 제대로 갖고 있는거야? 장난치지 말라구!");
                    cm.dispose();
                }
            }
        } else if (status == 3) {
            if (!cm.isLeader())
            {
                cm.sendOk("흐음. 너는 파티장이 아닌 것 같은데? 퀘스트를 시작하려면 파티장이 내게 말을 걸어야 한다구.");
                cm.dispose();
                return;
            }

            var party = cm.getParty().getMembers();
            var mapId = cm.getMapId();
            var next = true;
            var levelValid = 0;
            var inMap = 0;
            var it = party.iterator();

            while (it.hasNext()) {
                var cPlayer = it.next();
                if ((cPlayer.getLevel() >= 51) && (cPlayer.getLevel() <= 70)) {
                    levelValid += 1;
                } else {
                    next = false;
                }
                if (cPlayer.getMapid() == mapId && cPlayer.getChannel() == cm.getClient().getChannel()) {
                    inMap += ((cPlayer.getJobId() == 900 || cPlayer.getName().equals("큐")) ? 6 : 1);
                }
            }
            if (inMap != 6 && !cm.getPlayer().hasGmLevel(6)) {
                next = false;
            }
            if (next) {
                var em = cm.getEventManager("OrbisPQ");
                if (em == null) {
                    cm.sendNext("오류 발생");
                } else {
                    var prop = em.getProperty("state");
                    if (prop.equals("0") || prop == null) {
                        if (pBuff >= 0) {
                            if (pBuff == 0) {
                                cm.partyMessage(6, "요정 윙키의 미션을 수행하여 30분간 공격력, 마력 상승 마법이 적용됩니다.");
                                cm.givePartyBuff(2022090);
                            } else if (pBuff == 1) {
                                cm.partyMessage(6, "요정 윙키의 미션을 수행하여 30분간 물리방어력, 마법방어력 상승 마법이 적용됩니다.");
                                cm.givePartyBuff(2022091);
                            } else if (pBuff == 2) {
                                cm.partyMessage(6, "요정 윙키의 미션을 수행하여 30분간 이동속도, 점프력 상승 마법이 적용됩니다.");
                                cm.givePartyBuff(2022093);
                            } else if (pBuff == 3) {
                                cm.partyMessage(6, "요정 윙키의 미션을 수행하여 30분간 명중율, 회피율 상승 마법이 적용됩니다.");
                                cm.givePartyBuff(2022092);
                            }
                            rNum = cm.rand(10, 49);
                            q1.setCustomData(rNum + "");
                            q3.setCustomData(cm.getCurrentTime() + "");

                        }
                        cm.dispose();
                        em.startInstance(cm.getParty(), cm.getMap());
                        return;
                    } else {
                        cm.sendOk("이미 다른 파티가 이 안에서 퀘스트에 도전하는 중이야. 잠시 후 다시 시도해 주거나 채널을 변경해 봐.");
                    }
                }
            } else {
                cm.sendOk("파티 요구 조건이 맞지 않는 것 같은데? 파티는 #r레벨 51 ~ 70 사이의 파티원으로만 이루어진 6명의 파티#k만 입장이 가능해. 다시 한번 확인해 봐.");
            }
            cm.dispose();
        }
    } else if (nFieldId == 920010000) {
        if (status == 0) {
            if (cm.isLeader()) {
                /* too lazy...
                 var val = cm.getQuestRecord(7522).getCustomData();
                 if (val == null) {
                 cm.getQuestRecord(7522).setCustomData("1000000");
                 }
                 if (em.getProperty("cMission") == null) {
                 var like = parseInt(val.substr(0, 3));
                 var v0 = cm.rand(1,15);
                 v1 = -1;
                 if (like >= 100 && like < 200) {
                 if (v0 >= 1 && v0 <= 3) {
                 v1 = cm.rand(1,5);
                 clearmission2(cm,v1,em);
                 }
                 } else if (like >= 200 && like < 300) {
                 if (v0 >= 1 && v0 <= 5) {
                 v1 = cm.rand(1,5);
                 clearmission2(cm,v1,em);
                 }
                 } else if (like >= 300 && like <= 400) {
                 if (v0 >= 1 && v0 <= 8) {
                 v1 = cm.rand(1,5);
                 clearmission2(cm,v1,em);
                 }
                 }
                 } */
            }



            if (cm.isLeader()) {
                cm.sendYesNo("음.. 정말 이곳에서 나가고 싶어? 여기서 나간다면 처음부터 다시 시작해야만 해.");
            } else {
                cm.sendOk("아직 포기하긴 이르다구? 조금 더 열심히 노력해 봐~")
                cm.dispose();
            }
        } else if (status == 1) {
            if (selection == 1) {
                cm.warp(920011200);
                cm.dispose();
            } else {
                cm.sendOk("아직 포기하긴 이르다구? 조금 더 열심히 노력해 봐~")
                cm.dispose();

            }
        }
    }
}

function clearmission2(cm, nNum, em) {
    if (nNum == 1) {
        cm.sendYesNo("혹시 내가 주는 임무를 완수해 보지 않을래? 만약 25분 내에 여신의 탑을 완수하면 추가 경험치를 줄게.")
    }
}


function premission_decision(cm, mCode) {
    //party check
    var job = [110, 120, 130, 210, 220, 230, 310, 320, 410, 420];
    var index = -1;
    var checkLvl = -1;
    for (var i = 0; i < job.length; ++i) {
        var cLow = 10 + (i * 4);
        var cHigh = 13 + (i * 4);
        if (mCode >= cLow && mCode <= cHigh) {
            index = i;
            checkLvl = mCode - cLow;
            break;
        }
    }
    var checkJob = job[index];
    var checkLvlLow = 51;
    var checkLvlHigh = 55;
    if (checkLvl == 1) {
        checkLvlLow = 56;
        checkLvlHigh = 60;
    } else if (checkLvl == 2) {
        checkLvlLow = 61;
        checkLvlHigh = 65;
    } else if (checkLvl == 3) {
        checkLvlLow = 66;
        checkLvlHigh = 70;
    }
    var it = cm.getParty().getMembers().iterator();
    while (it.hasNext()) {
        var pchr = it.next();
        var chr = cm.getPlayer().getMap().getCharacterById(pchr.getId());
        if (chr != null) {
            var job = chr.getJob();
            var lvl = chr.getLevel();
            if (job == checkJob && lvl >= checkLvlLow && lvl <= checkLvlHigh) {
                return 1;
            }
        } else {
            return 2;
        }
    }
    return 2;
}

function premission(nNum) {
    var job;
    var level;
    if (nNum == 10) {
        job = "파이터";
        level = "51~55";
    } else if (nNum == 11) {
        job = "파이터";
        level = "56~60";
    } else if (nNum == 12) {
        job = "파이터";
        level = "61~65";
    } else if (nNum == 13) {
        job = "파이터";
        level = "66~70";
    }
    else if (nNum == 14) {
        job = "페이지";
        level = "51~55";
    } else if (nNum == 15) {
        job = "페이지";
        level = "56~60";
    } else if (nNum == 16) {
        job = "페이지";
        level = "61~65";
    } else if (nNum == 17) {
        job = "페이지";
        level = "66~70";
    }
    else if (nNum == 18) {
        job = "스피어맨";
        level = "51~55";
    } else if (nNum == 19) {
        job = "스피어맨";
        level = "56~60";
    } else if (nNum == 20) {
        job = "스피어맨";
        level = "61~65";
    } else if (nNum == 21) {
        job = "스피어맨";
        level = "66~70";
    }
    else if (nNum == 22) {
        job = "위자드(불/독)";
        level = "51~55";
    } else if (nNum == 23) {
        job = "위자드(불/독)";
        level = "56~60";
    } else if (nNum == 24) {
        job = "위자드(불/독)";
        level = "61~65";
    } else if (nNum == 25) {
        job = "위자드(불/독)";
        level = "66~70";
    }
    else if (nNum == 26) {
        job = "위자드(얼음/번개)";
        level = "51~55";
    } else if (nNum == 27) {
        job = "위자드(얼음/번개)";
        level = "56~60";
    } else if (nNum == 28) {
        job = "위자드(얼음/번개)";
        level = "61~65";
    } else if (nNum == 29) {
        job = "위자드(얼음/번개)";
        level = "66~70";
    }
    else if (nNum == 30) {
        job = "클레릭";
        level = "51~55";
    } else if (nNum == 31) {
        job = "클레릭";
        level = "56~60";
    } else if (nNum == 32) {
        job = "클레릭";
        level = "61~65";
    } else if (nNum == 33) {
        job = "클레릭";
        level = "66~70";
    }
    else if (nNum == 34) {
        job = "헌터";
        level = "51~55";
    } else if (nNum == 35) {
        job = "헌터";
        level = "56~60";
    } else if (nNum == 36) {
        job = "헌터";
        level = "61~65";
    } else if (nNum == 37) {
        job = "헌터";
        level = "66~70";
    }
    else if (nNum == 38) {
        job = "사수";
        level = "51~55";
    } else if (nNum == 39) {
        job = "사수";
        level = "56~60";
    } else if (nNum == 40) {
        job = "사수";
        level = "61~65";
    } else if (nNum == 41) {
        job = "사수";
        level = "66~70";
    }
    else if (nNum == 42) {
        job = "어쌔신";
        level = "51~55";
    } else if (nNum == 43) {
        job = "어쌔신";
        level = "56~60";
    } else if (nNum == 44) {
        job = "어쌔신";
        level = "61~65";
    } else if (nNum == 45) {
        job = "어쌔신";
        level = "66~70";
    }
    else if (nNum == 46) {
        job = "시프";
        level = "51~55";
    } else if (nNum == 47) {
        job = "시프";
        level = "56~60";
    } else if (nNum == 48) {
        job = "시프";
        level = "61~65";
    } else if (nNum == 49) {
        job = "시프";
        level = "66~70";
    }
    return {
        'job': job,
        'level': level
    };
}


function feellike(cm, item) {
    var time = cm.getQuestRecord(7523);
    if (time.getCustomData() == null) {
        time.setCustomData("0");
    }
    var feel = cm.getQuestRecord(7522);
    if (feel.getCustomData() == null) {
        feel.setCustomData("1000000");
    }
    var val2 = feel.getCustomData();
    var like = Integer.parseInt(feel.getCustomData().substring(0, 3));
    var ctime = Long.parseLong(time.getCustomData());

    if (ctime + 5040 * 1000 < cm.getCurrentTime()) {
        if (like >= 130) {
            like = like - 30;
        } else {
            like = 100;
        }
    }
    time.setCustomData(cm.getCurrentTime() + "");

    if (item == 1) {
        var v0 = cm.rand(1, 100);
        var v1 = ate_food(cm, feel, 1);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("통닭을 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like += 5;
        } else {
            cm.playerMessage("통닭을 먹고 웡키의 기분이 좋아졌습니다.");
            like += 1;
        }
    } else if (item == 2) {
        v1 = ate_food(cm, feel, 2);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("팥죽을 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("팥죽을 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 1;
        }
    } else if (item == 3) {
        v1 = ate_food(cm, feel, 3);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("햄버거를 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("햄버거를 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 1;
        }
    } else if (item == 4) {
        v1 = ate_food(cm, feel, 4);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("장어 구이를 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("장어 구이를 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 2;
        }
    } else if (item == 5) {
        v1 = ate_food(cm, feel, 5);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("쭈쭈바를 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("쭈쭈바를 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 2;
        }
    } else if (item == 6) {
        v1 = ate_food(cm, feel, 6);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("초콜릿을 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("초콜릿을 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 2;
        }
    } else if (item == 7) {
        v1 = ate_food(cm, feel, 7);
        v0 = cm.rand(1, 100);
        if (v0 >= 1 && v0 <= v1) {
            cm.playerMessage("팥빙수를 먹고 웡키의 기분이 무척 좋아졌습니다.");
            if (cm.rand(1, 10) == 1) {
                feellike_reward(cm, like);
            }
            like = like + 5;
        } else {
            cm.playerMessage("팥빙수를 먹고 웡키의 기분이 좋아졌습니다.");
            like = like + 3;
        }
    }
    else if (item == -1) {
        if (like >= 103) {
            cm.playerMessage("웡키의 기분이 나빠졌습니다.");
            like = like - 3;
        } else {
            cm.playerMessage("웡키의 기분이 나빠졌습니다.");
            like = 100;
        }
    }

    if (like > 500) {
        like = 500;
    } else if (like < 100) {
        like = 100;
    }

    if (item != -1) {
        var food = val2.substr(4, 3) + item;
        var result = like + food;
        feel.setCustomData(result);
    } else {
        var food = val2.substr(3, 4);
        var result = like + food;
        feel.setCustomData(result);
    }
}

function ate_food(cm, qr, code) {
    var val = qr.getCustomData();

    var food1 = Integer.parseInt(val.substr(3, 1));
    var food2 = Integer.parseInt(val.substr(4, 1));
    var food3 = Integer.parseInt(val.substr(5, 1));
    var food4 = Integer.parseInt(val.substr(6, 1));

    var val2 = val.substring(0, 3) + val.substr(4, 3) + code;
    qr.setCustomData(val2);

    if (food1 == code && food2 == code && food3 == code && food4 == code) {
        cm.sendNext("#b#t" + food_code(code) + "##k... 좋아하긴 해도 반복해서 먹으면 질린다구..");
        return 2;
    } else if (food2 == code && food3 == code && food4 == code) {
        cm.sendNext("#b#t" + food_code(code) + "##k... 다른걸 먹으면 안될까?");
        if (code == 1)
            return 1;
        if (code == 2)
            return 3;
        if (code == 3)
            return 3;
        if (code == 4)
            return 7;
        if (code == 5)
            return 20;
        if (code == 6)
            return 26;
        if (code == 7)
            return 30;
    } else if (food3 == code && food4 == code) {
        cm.sendNext("와~ #b#t" + food_code(code) + "##k! 고마워~ 잘 먹을게!");
        if (code == 1)
            return 2;
        if (code == 2)
            return 4;
        if (code == 3)
            return 4;
        if (code == 4)
            return 10;
        if (code == 5)
            return 27;
        if (code == 6)
            return 32;
        if (code == 7)
            return 40;
    } else if (food4 == code) {
        cm.sendNext("와~ #b#t" + food_code(code) + "##k! 고마워~ 잘 먹을게!");
        if (code == 1)
            return 2;
        if (code == 2)
            return 5;
        if (code == 3)
            return 5;
        if (code == 4)
            return 13;
        if (code == 5)
            return 30;
        if (code == 6)
            return 40;
        if (code == 7)
            return 50;
    } else if (food1 != code && food2 != code && food3 != code && food4 != code) {
        cm.sendNext("와! 이건 #b#t" + food_code(code) + "##k! 정말 고마워~ 잘 먹을게!");
        if (code == 1)
            return 4;
        if (code == 2)
            return 8;
        if (code == 3)
            return 8;
        if (code == 4)
            return 19;
        if (code == 5)
            return 39;
        if (code == 6)
            return 50;
        if (code == 7)
            return 69;
    }
    else {
        if (code == 1) {
            cm.sendNext("이건 바깥은 바삭하고 속은 부드러운 #b통닭#k 이잖아? 맛있겠다~");
            return 3;
        } else if (code == 2) {
            cm.sendNext("와~ 이건 따뜻한 #b#t2022001##k 이잖아? 보기만 해도 군침이 돋는걸~");
            return 6;
        } else if (code == 3) {
            cm.sendNext("맛있는 #b햄버거#k 다! 많이 먹으면 살이 늘어날지도 모르겠지만.. ");
            return 6;
        } else if (code == 4) {
            cm.sendNext("이건 #b장어 구이#k 잖아? 맛있게 구워져서 굉장히 좋아~");
            return 16;
        } else if (code == 5) {
            cm.sendNext("시원하고 달콤한 #b쭈쭈바#k 잖아~ 더운 여름날엔 이게 최고지~");
            return 36;
        } else if (code == 6) {
            cm.sendNext("달콤한 #b초콜릿#k이잖아~? 음~ 맛있겠다!");
            return 47;
        } else if (code == 7) {
            cm.sendNext("아이 차가워! #b팥빙수#k 잖아? 팥과 연유, 떡.. 그리고 빙수! 시원하고 달콤한 이 맛이란.. 음~ ");
            return 65;
        }
    }
    return 0;
}

function food_code(code) {
    if (code == 2)
        return 2022001;
    if (code == 3)
        return 2020004;
    if (code == 4)
        return 2022003;
    if (code == 5)
        return 2001001;
    if (code == 6)
        return 2020028;
    if (code == 7)
        return 2001002;
    return 2020001;
}

function feellike_reward(cm, like) {

    if (!cm.canHold()) {
        cm.playerMessage("인벤토리 공간이 부족합니다.");
        return;
    }
    cm.playerMessage("웡키가 음식을 먹고 감사의 표시로 특별한 선물을 주었습니다!");
    if (like >= 100 && like < 200) {
        var num = cm.rand(1, 100);
        if (num >= 1 && num <= 20) {
            cm.gainItem(2020013, 1);
        } else if (num >= 21 && num <= 40) {
            cm.gainItem(2020014, 1);
        } else if (num >= 41 && num <= 42) {
            cm.gainItem(2040708, 1);//신이속10
        } else if (num >= 43 && num <= 60) {
            cm.gainItem(2020015, 1); //황혼이슬
        } else if (num >= 61 && num <= 80) {
            cm.gainItem(2000002, 5);
        } else {
            cm.gainItem(2000002, 10);
        }
    }
    else if (like >= 200 && like < 300) {
        num = cm.rand(1, 50);
        if (num >= 1 && num <= 10) {
            cm.gainItem(2020013, 1); //신록
        } else if (num >= 11 && num <= 20) {
            cm.gainItem(2020014, 1);
        } else if (num == 21) {
            cm.gainItem(2040708, 1); // 신이속 10
        } else if (num == 22) {
            cm.gainItem(2040707, 1); // 신이속 60
        } else if (num >= 23 && num <= 30) {
            cm.gainItem(2020015, 1);
        } else if (num >= 31) {
            cm.gainItem(2000002, 10);
        }
    }
    else if (like >= 300 && like <= 400) {
        num = cm.rand(1, 100);
        if (num >= 1 && num <= 20) {
            cm.gainItem(2020013, 1); //신록의 우유
        } else if (num >= 20 && num <= 40) {
            cm.gainItem(2020014, 1); //새벽의 이슬
        } else if (num >= 21 && num <= 22) {
            cm.gainItem(2040707, 1); //신이속 60
        } else if (num >= 22 && num <= 24) {
            cm.gainItem(2040708, 1); //신이속 10
        } else if (num >= 25 && num <= 50) {
            cm.gainItem(2020015, 15);
        } else {
            cm.gainItem(2000002, 10);
        }
    }
}