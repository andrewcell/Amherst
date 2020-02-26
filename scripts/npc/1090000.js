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
 * NPCID : 1090000
 * ScriptName : kairinT
 * NPCNameFunc : 카이린 - 해적 전직관
 * Location : 120000101 (노틸러스호 - 항해실)
 * Location : 912010200 (히든스트리트 - 카이린의 훈련장)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var way = -1;
var job;
var jobname;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else {
            cm.dispose();
            return;
        }
    }

    var mapid = cm.getPlayer().getMapId();

    if (mapid == 120000101) {
        if (status == 0) {
            var q = cm.getQuestRecord(195000);
            var value = q.getCustomData();
            if (value == null) {
                q.setCustomData("0");
            }
            if (cm.getJob() == 0) {
                way = 0;
                cm.sendNext("흐음.. 해적으로 전직을 하고 싶은건가..? 하지만 그 전에 조건이 있는데, 레벨이 10 이상이어야 하고, 어디 넌 어떤지 한번 볼까?")
            } else if (cm.getJob() == 500 && cm.getPlayerStat("LVL") >= 30) {
                way = 1;
                if (cm.getQuestStatus(2191) == 1) {
                    cm.sendYesNo("시험을 치르러 온건가? 지금 시험장으로 들여보내 줄까?");
                } else if (cm.getQuestStatus(2192) == 1) {
                    cm.sendYesNo("시험을 치르러 온건가? 지금 시험장으로 들여보내 줄까?");
                } else if (cm.getQuestStatus(2191) == 2) {
                    var rsp = (cm.getPlayerStat("LVL") - 30) * 3;
                    if (cm.getPlayerStat("RSP") > rsp) {
                        cm.sendOk("음.. SP를 아직 다 사용하지 않은 것 같은데? SP가 너무 많아 남아 아직 2차전직을 할 수 없어.")
                        cm.dispose();
                        return;
                    }
                    cm.changeJob(510);
                    cm.sendOk("축하해. 이제 넌 인파이터가 되었어. 너에게 방금 인파이터가 익힐 수 있는 스킬들이 적혀 있는 책을 주었어. 그 책에는 여러 가지 인파이터와 관련된 스킬들이 들어 있어. 게다가 소비 아이템 보관함 갯수도 늘려주었어. 한 줄씩 늘어나 있을 거야. 최대 HP, MP도 늘려주었고 말이야... 한번 확인 해 봐. 앞으로도 더욱 정진해서 더욱 강력한 해적이 되도록 해.")
                    cm.dispose();
                } else if (cm.getQuestStatus(2192) == 2) {
                    var rsp = (cm.getPlayerStat("LVL") - 30) * 3;
                    if (cm.getPlayerStat("RSP") > rsp) {
                        cm.sendOk("음.. SP를 아직 다 사용하지 않은 것 같은데? SP가 너무 많아 남아 아직 2차전직을 할 수 없어.")
                        cm.dispose();
                        return;
                    }
                    cm.sendOk("축하해. 이제 넌 건슬링거가 되었어. 너에게 방금 건슬링거가 익힐 수 있는 스킬들이 적혀 있는 책을 주었어. 그 책에는 여러 가지 인파이터와 관련된 스킬들이 들어 있어. 게다가 소비 아이템 보관함 갯수도 늘려주었어. 한 줄씩 늘어나 있을 거야. 최대 HP, MP도 늘려주었고 말이야... 한번 확인 해 봐. 앞으로도 더욱 정진해서 더욱 강력한 해적이 되도록 해.")
                    cm.changeJob(520);
                    cm.dispose();
                } else {
                    cm.sendOk("해적이 되고 싶은 자는 나에게...");
                    cm.dispose();
                }
            } else if (value.equals("job3_trial1_1")) {
                if ((cm.getJob() == 510 || cm.getJob() == 520) && cm.getPlayerStat("LVL") >= 70) {
                    q.setCustomData("job3_trial1_2");
                    cm.sendOk("후후.. #b페드로#k에게서 네 이야기는 전해 들었어. 좋아. 내가 네 힘을 시험해 주도록 하지. 빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 내 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오도록 해.");
                    cm.dispose();
                }
            } else if (value.equals("job3_trial1_2")) {
                if (cm.haveItem(4031059, 1)) {
                    if (cm.canHold(4031057)) {
                        cm.gainItem(4031059, -1);
                        cm.gainItem(4031057, 1);
                        q.setCustomData("job3_trial1_3");
                        cm.sendOk("여기 강인함의 목걸이가 있어. 이제 #b페드로#k를 찾아가 보도록 해.");
                        cm.dispose();
                    } else {
                        cm.sendOk("흐음. 인벤토리 공간이 부족한 것 같은데. 기타 탭을 충분히 비우고 다시 와.");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 내 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오도록 해.");
                    cm.dispose();
                }
            } else if (value.equals("job3_trial1_3")) {
                cm.sendOk("이제 #b페드로#k를 찾아가 봐.");
                cm.dispose();
            } else if (cm.getQuestStatus(6370) == 1 || cm.getQuestStatus(6330) == 1) {
                way = 2;
                cm.sendSimple("해적이 되고 싶은 자는 나에게..\r\n그래, 원하는게 뭐지?\r\n#b #L0#당신과 싸울 준비가 되었어요.#l");
            } else {
                cm.sendOk("해적이 되고 싶은 자는 나에게..");
                cm.dispose();
            }
        }

        if (way == 0) {
            if (status == 1) {
                if (cm.getPlayerStat("LVL") >= 10) {
                    cm.sendYesNo("호오, 너라면 충분히 해적이 될 자질이 있어 보이는데? 어때? 정말 우리와 같은 해적이 되고싶어?")
                } else {
                    cm.sendOk("흠. 아직 너는 해적이 되기엔 너무 약해 보이는군. 조금 더 수련을 한 후 다시 오도록 해.")
                    cm.dispose();
                }
            } else if (status == 2) {
                if (selection == 0) {
                    cm.sendOk("그런가? 찬찬히 생각해 보고 다시 와.");
                    cm.dispose();
                    return;
                }
                if (cm.getInvSlots(1) >= 2 && cm.getInvSlots(2) >= 1) {
                    cm.gainItem(1492014, 1);
                    cm.gainItem(1482014, 1);
                    cm.gainItem(2330006, 600);
                } else {
                    cm.sendOk("뭘 그렇게 많이 가지고 다니는거야? 장비와 소비 인벤토리를 비우고 다시 와.");
                    cm.dispose();
                    return;
                }
                cm.changeJob(500);
                //SP Given in source
                //Expand Inventory and given inc maxhp, maxmp
                cm.sendOk("자, 이제 너는 해적이야. 우리와 함께 이 드넓은 바다를 항해하고 바다를 벗삼아 지내는 든든한 동료가 되길. 아, 그리고 방금 네 인벤토리창을 늘려주었어. 그리고 SP를 하나 주었으니 마음에 드는 스킬에 찍어보도록 해.")
                cm.dispose();
            }
        } else if (way == 1) {
            if (status == 1) {
                var em = cm.getEventManager("KyrinTest");
                if (em == null) {
                    cm.sendOk("흐음, 서버에 문제가 생겼어. 지금은 미안하지만 들여보내줄 수 없어.");
                    cm.dispose();
                    return;
                }
                if (cm.getQuestStatus(2191) == 1) {
                    var value = "1";
                    if (em.getProperty("entry_1_1").equals("1")) {
                        value = "2";
                        if (em.getProperty("entry_1_2").equals("1")) {
                            cm.sendOk("이미 시험장이 모두 사용중인걸? 나중에 다시 시도해 봐.");
                            cm.dispose();
                            return;
                        }
                    }
                    em.startInstance_Solo(value, cm.getPlayer());
                    cm.dispose();
                } else if (cm.getQuestStatus(2192) == 1) {
                    var value = "3";
                    if (em.getProperty("entry_2_1").equals("1")) {
                        value = "4";
                        if (em.getProperty("entry_2_2").equals("1")) {
                            cm.sendOk("이미 시험장이 모두 사용중인걸? 나중에 다시 시도해 봐.");
                            cm.dispose();
                            return;
                        }
                    }
                    em.startInstance_Solo(value, cm.getPlayer());
                    cm.dispose();
                }
            }
        } else if (way == 2) {
            if (status == 1) {
                if (selection == 0) {
                    if (cm.getQuestStatus(6370) == 1) {
                        var qr = cm.getQuestRecord(6371);
                        if (qr.getCustomData() != null && qr.getCustomData().equals("2")) {
                            cm.sendOk("이미 나와의 대련은 끝난 것 같은데? 더 이상 대련할 필요는 없어.");
                            cm.dispose();
                            return;
                        }
                    } else if (cm.getQuestStatus(6330) == 1) {
                        var qr = cm.getQuestRecord(6331);
                        if (qr.getCustomData() != null && qr.getCustomData().equals("2")) {
                            cm.sendOk("이미 나와의 대련은 끝난 것 같은데? 더 이상 대련할 필요는 없어.");
                            cm.dispose();
                            return;
                        }
                    }
                    cm.sendNext("좋아, 내가 보내주는 수련장에서 나의 공격을 2분 이상 버텨내면 돼. 잘 해보라구.");
                } else {
                    cm.dispose();
                }
            } else if (status == 2) {
                if (cm.getQuestStatus(6370) == 1) { // Captain
                    var dd = cm.getEventManager("KyrinTrainingGroundC");
                    if (dd != null) {
                        dd.startInstance(cm.getPlayer());
                    } else {
                        cm.sendOk("An unknown error occured.");
                    }
                } else if (cm.getQuestStatus(6330) == 1) { // Viper
                    var dd = cm.getEventManager("KyrinTrainingGroundV");
                    if (dd != null) {
                        dd.startInstance(cm.getPlayer());
                    } else {
                        cm.sendOk("An unknown error occured.");
                    }
                }
                cm.dispose();
            }
        }
    } else if (mapid == 912010200) {
        if (status == 0) {
            cm.sendNext("호오? 역시 기대한대로 대단한데? 좋아, 나를 따라 나오도록 해. 네게 걸맞는 선물을 주지.");
        } else if (status == 1) {
            if (cm.getQuestStatus(6370) == 1) { // Captain
                cm.forceStartQuest(6371, "2");
                cm.showQuestClear(6370);
            } else if (cm.getQuestStatus(6330) == 1) { // Viper
                cm.forceStartQuest(6331, "2");
                cm.showQuestClear(6330);
            }
            cm.warp(120000101);
            cm.dispose();
        }
    } else {

        cm.sendOk(mapid);
        cm.dispose();
    }
}