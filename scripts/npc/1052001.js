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
         * NPCID : 1052001
         * ScriptName : rogue
         * NPCNameFunc : 다크로드 - 도둑 전직관
         * Location : 103000003 (빅토리아로드 - 도둑의아지트)
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

    if (cm.getQuestStatus(6141) == 1)
    {
        if (cm.getPlayerCount(910300000) > 0)
        {
            cm.sendOk("흠.. 훈련장에 이미 누군가가 들어간 것 같구만. 나중에 다시 찾아오게나.");
        } else {
            var marr = cm.getQuestRecord(110114);
            if (marr.getCustomData() == null) {
                marr.setCustomData("0");
            }
            var dat = parseInt(marr.getCustomData());
            if (dat + 300000 >= java.lang.System.currentTimeMillis()) {
                cm.sendNext("훈련장은 5분에 한번씩만 입장할 수 있다네. 나중에 다시 찾아와보게나.");
            } else {
                marr.setCustomData(java.lang.System.currentTimeMillis());
                cm.resetMap(910300000);
                cm.TimeMoveMap(910300000, 103000003, 300);
            }
        }
        cm.dispose();
        return;
    }




    if (status == 0) {






        var q = cm.getQuestRecord(195000)
        var value = q.getCustomData();
        if (value == null) {
            q.setCustomData("0");
        }
        if (cm.getJob() == 0) {
            way = 0;
            cm.sendNext("흐음.. 도적으로 전직을 하고 싶은가..? 하지만 그 전에 조건이 있는데, 레벨이 10 이상이어야 하고, 어디 자네는 어떤지 한번 볼까?")
        } else if (cm.getJob() == 400 && cm.getPlayerStat("LVL") >= 30) {
            way = 1;
            if (cm.haveItem(4031011, 1)) {
                cm.sendOk("그 편지를 가지고 커닝시티 근처에 있는 #b전직교관#k에게 가져가게나. 그리고 그 전직교관의 수련을 완료한다면 자네는 더욱 강해질 수 있을걸세.")
                cm.dispose();
            } else if (cm.haveItem(4031012, 1)) {
                cm.sendNext("헛..! 그것은 영웅의 증거! 축하하네. 수련을 모두 완료했나보군. 자, 이제 자네를 내가 좀 더 강하게 만들어 주겠네. 이야아압~~")
            } else {
                cm.sendYesNo("음... 너 몰라보게 강해졌군. 예전에 그 허약한 모습은 어디로 가고 지금은 도적으로서의 위엄이 넘쳐 흐르고 있군. 자... 어때? 여기서 조금 더 강해지고 싶지 않은가? 간단한 시험만 통과한다면 널 더욱 더 강하게 만들어 주지. 해보겠나?");
            }
        } else if (value.equals("job3_trial1_1")) {
            if ((cm.getJob() == 410 || cm.getJob() == 420) && cm.getPlayerStat("LVL") >= 70) {
                q.setCustomData("job3_trial1_2");
                cm.sendOk("후후.. #b아레크#k에게서 자네에 대한 이야기는 전해 들었다. 좋아. 내가 자네의 힘을 시험해 주도록 하겠네. 빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 나의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오게.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_2")) {
            if (cm.haveItem(4031059, 1)) {
                if (cm.canHold(4031057)) {
                    cm.gainItem(4031059, -1);
                    cm.gainItem(4031057, 1);
                    q.setCustomData("job3_trial1_3");
                    cm.sendOk("여기 힘의 목걸이가 있네. 이제 #b아레크#k를 찾아가 보게.");
                    cm.dispose();
                } else {
                    cm.sendOk("흐음. 인벤토리 공간이 부족한 것 같은데. 기타 탭을 충분히 비우고 다시 오게.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 나의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오게.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_3")) {
            cm.sendOk("이제 #b아레크#k를 찾아가 보게..");
            cm.dispose();
        } else {
            cm.sendOk("도적이 되고 싶은 자는 나에게..");
            cm.dispose();
        }
    }

    if (way == 0) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 10) {
                cm.sendYesNo("호오, 자네라면 충분히 도둑이 될 자질이 있어 보이는군. 어떤가? 정말 이 어둠의 반열에 끼고 싶은가?")
            } else {
                cm.sendOk("흠. 아직 자네는 도둑이 되기엔 너무 약해 보이는군. 조금 더 수련을 한 후 다시 오게나.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가? 찬찬히 생각해 보고 다시 오게나.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 2 && cm.getInvSlots(2) >= 1) {
                cm.gainItem(1332063, 1);
                cm.gainItem(1472061, 1);
                cm.gainItem(2070015, 500);
            } else {
                cm.sendOk("장비와 소비 인벤토리를 비우고 다시 오게.");
                cm.dispose();
                return;
            }
            cm.changeJob(400);
	    cm.getPlayer().resetSP(1);
	    cm.gainMeso(3000);
	    cm.gainItem(2000013,150);
	    cm.gainItem(2000014,80);
		    cm.gainItem(1142107,1);
            //SP Given in source
            //Expand Inventory and given inc maxhp, maxmp
            cm.sendOk("자, 이제 자네는 도적일세. 어둠을 친구삼아 언제나 약자들을 위해 싸우는 사람이 되길.. 아, 그리고 방금 자네의 인벤토리창을 늘려주었다네. 그리고 SP를 하나 주었으니 마음에 드는 스킬에 찍어보도록 하게.")
            cm.dispose();
        }
    } else if (way == 1) {
        if (status == 1) {
            if (cm.haveItem(4031012, 1)) {
                cm.sendSimple("어떤 직업으로 전직하고 싶은가?#b\r\n\r\n#L2# 어쌔신으로 전직하고 싶습니다.#l\r\n#L3# 시프로 전직하고 싶습니다.#l");
            } else {
                if (selection == 0) {
                    cm.sendOk("흠..그런가? 아쉽군. 더욱 강해질 수 있는 기회인데. 아직 다른 할 일이 있나 보군?");
                    cm.dispose();
                    return;
                }
                if (cm.canHold(4031011)) {
                    cm.gainItem(4031011, 1);
                    cm.sendOk("잘 생각했어. 하지만 넌 강해보이기는 하지만 그것이 정말인지 확인해 볼 필요가 있어. 어렵지 않은 테스트니까 너라면 충분히 통과할 수 있을 거야. 자... 우선 여기 내 편지를 하나 받도록 해. 잊어버리지 않도록 조심하라구. 이 편지를 커닝시티 근처 #b커닝시티북쪽공사장#k에 어딘가에 있는 #b도전 전직교관#k에게 전해줘. 바쁜 나를 대신해서 교관일을 해 주고 있는 고마운 사람이야. 편지를 전해주면 널 내 대신 시험해 봐 줄 거야. 자세한 것은 그에게 직접 듣도록 해. 그럼 무사히 돌아오길 바라겠어.")
                    cm.dispose();
                } else {
                    cm.sendOk("흠. 인벤토리 공간이 부족한 것 같군. 기타 탭의 슬롯을 충분히 비운 후 다시 찾아오게나.")
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031012, 1)) {
                if (selection == 2) {
                    job = 410;
                    jobname = "어쌔신";
                } else if (selection == 3) {
                    job = 420;
                    jobname = "시프";
                }
                cm.sendYesNo("정말 #b" + jobname + "#k 계열의 도적으로 전직하고 싶은가? 신중하게 결정하게나.");
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendOk("신중하게 생각해 본 후 다시 말을 걸어주게나.");
                cm.dispose();
            } else {
                var rsp = (cm.getPlayerStat("LVL") - 30) * 3;
                if (cm.getPlayerStat("RSP") > rsp) {
                    cm.sendOk("음.. SP를 아직 다 사용하지 않은 것 같군? 자네는 SP가 너무 많아 남아 아직 2차전직을 할 수 없다네.")
                    cm.dispose();
                } else {
                    cm.gainItem(4031012, -1);
		    cm.gainMeso(35000);
		    cm.gainItem(2041022,1);
		    cm.gainItem(2040516,1);
		    cm.gainItem(4220000,3);
		    cm.gainItem(1142108,1);
		    cm.gainItem(2000004,15);
                    cm.changeJob(job);
                    cm.sendOk("좋네. 자네는 이제 더욱 강해졌네. 그리고 소비 인벤토리 슬롯을 늘려주었으니 원하는대로 사용하도록 하게나. 그리고 약간의 SP를 주었으니 원하는 스킬에 찍어보도록 하게.")
                    cm.dispose();
                }
            }
        }
    }
}