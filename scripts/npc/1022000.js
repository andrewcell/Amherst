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
 * NPCID : 1022000
 * ScriptName : fighter
 * NPCNameFunc : 주먹펴고 일어서 - 전사 전직관
 * Location : 102000003 (빅토리아로드 - 전사의 성전)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var way = -1;
var job;
var jobname;
var gy = -1;
//function start() {
//    status = -1;
//    action(1,0,0);
//}
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
    
    if (status == 0) {
        var q = cm.getQuestRecord(195000)
        var value = q.getCustomData();
        if (value == null) {
            q.setCustomData("0");
        }
        if (cm.getJob() == 0) {
            way = 0;
            cm.sendNext("자네.. 전사가 되고 싶어서 찾아왔는가? 흐음.. 그러기 위해선 레벨은 10 이상이어야 한다네.. 어디, 자네는 어떤지 한번 찰진지 볼까?")
        } else if (cm.getJob() == 1000) {
          way = 9999;
	 cm.sendNext("자네는 다른 모험가들과 달리 조금 특별해 보이는군... 바람의 기운이 느껴진단말이야... 자네에겐 특별한 선택을 할수있는 기회를 주겠네... 전설의 사황 바람의 검객 '풍연'의 길을 겉고싶은생각이 없는가?");
        } else if ((cm.getJob() == 1100 || cm.getJob() == 100) &&  cm.getPlayerStat("LVL") >= 30) {
            way = 1;
            if (cm.haveItem(4031008, 1)) {
                cm.sendOk("이 편지를 페리온 근처 #b고원#k 어딘가에 있는 #b전사 전직교관#k에게 전해줘. 바쁜 나를 대신해서 교관일을 해 주고 있는 고마운 사람이야. 편지를 전해주면 널 내 대신 시험해 봐 줄 거야. 자세한 것은 그에게 직접 듣도록 해. 그럼 무사히 돌아오길 바라겠어.")
                cm.dispose();
            } else if (cm.haveItem(4031012, 1)) {
                cm.sendNext("헛..! 그것은 영웅의 증거! 축하하네. 수련을 모두 완료했나보군. 자, 이제 자네를 내가 좀 더 강하게 만들어 주겠네. 이야아압~~")
            } else {
                cm.sendYesNo("음... 몰라보게 강해졌군. 예전에 그 허약한 모습은 어디로 가고 지금은 전사로서의 위엄이 넘쳐 흐르고 있군. 자... 어때? 여기서 조금 더 강해지고 싶지 않은가? 간단한 시험만 통과한다면 널 더욱 더 강하게 만들어 주지. 해보겠나?");
            }
        } else if (value.equals("job3_trial1_1")) {
            if ((cm.getJob() == 1110 || cm.getJob() == 110 || cm.getJob() == 120 || cm.getJob() == 130) && cm.getPlayerStat("LVL") >= 70) {
                q.setCustomData("job3_trial1_2");
                cm.sendOk("후후.. #b타일러스#k에게서 자네에 대한 이야기는 전해 들었다. 좋아. 내가 자네의 힘을 시험해 주도록 하겠네. 빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 나의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오게.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_2")) {
            if (cm.haveItem(4031059, 1)) {
                if (cm.canHold(4031057)) {
                    cm.gainItem(4031059, -1);
                    cm.gainItem(4031057, 1);
                    q.setCustomData("job3_trial1_3");
                    cm.sendOk("여기 힘의 목걸이가 있네. 이제 #b타일러스#k를 찾아가 보게.");
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
            cm.sendOk("이제 #b타일러스#k를 찾아가 보게..");
            cm.dispose();
        } else {
            cm.sendOk("전사가 되고 싶은 자는 나에게..");
            cm.dispose();
        }
    }
	if (way == 9999) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 10) {
                cm.sendYesNo("전설의 사황 풍연은 비록 마스터레벨이 120 이며, 3차전직 까지 밖에 없더라도 꽤 강력한 전설의 직업군이지 자 어떻게 할텐가 정말 풍연의 길을 걷고싶은건가?")
            } else {
                cm.sendOk("흠. 아직 자네는 풍연이 되기엔 너무 약해 보이는군. 조금 더 수련을 한 후 다시 오게나.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가? 찬찬히 생각해 보고 다시 오게나.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 1) {
                cm.gainItem(1302077, 1);
            } else {
                cm.sendOk("장비 인벤토리를 비우고 다시 오게.");
                cm.dispose();
                return;
            }
            cm.changeJob(1100);
            cm.sendOk("좋네. 자네는 풍연이 되었네. 내 능력치를 조금 나누어 주겠네. 그리고 #bSP#k를 1 주었으니, 원하는 스킬에 찍어보도록 하게.")
            cm.dispose();
        }
    } else if (way == 0) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 10) {
                cm.sendYesNo("호오, 자네라면 충분히 전사가 될 자질이 있어 보이는군. 정말 전사로서의 삶을 살아가겠나? 정말 #r전사#k가 되고싶은가?")
            } else {
                cm.sendOk("흠. 아직 자네는 전사가 되기엔 너무 약해 보이는군. 조금 더 수련을 한 후 다시 오게나.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가? 찬찬히 생각해 보고 다시 오게나.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 1) {
                cm.gainItem(1302077, 1);
            } else {
                cm.sendOk("장비 인벤토리를 비우고 다시 오게.");
                cm.dispose();
                return;
            }
            cm.changeJob(100);
            //SP Given in source
            //Expand Inventory and given inc maxhp, maxmp
            cm.sendOk("좋네. 자네는 전사가 되었네. 내 능력치를 조금 나누어 주겠네. 그리고 #bSP#k를 1 주었으니, 원하는 스킬에 찍어보도록 하게.")
            cm.dispose();
        }
    } else if (way == 1) {
        if (status == 1) {
            if (cm.haveItem(4031012, 1)) {
		if (cm.getJob() == 1100) {
                    cm.gainItem(4031012, -1);
                    cm.changeJob(1110);
                    cm.dispose();
        	} else {
		cm.sendSimple("어떤 직업으로 전직하고 싶은가?#b\r\n#b\r\n#L1# 파이터로 전직하고 싶습니다.#l\r\n#L2# 페이지로 전직하고 싶습니다.#l\r\n#L3# 스피어맨으로 전직하고 싶습니다.#l");
		}    
	} else {
                if (selection == 0) {
                    cm.sendOk("흠..그런가? 아쉽군. 더욱 강해질 수 있는 기회인데. 아직 다른 할 일이 있나 보군?");
                    cm.dispose();
                    return;
                }
                if (cm.canHold(4031008)) {
                    cm.gainItem(4031008, 1);
                    cm.sendOk("잘 생각했어. 하지만 넌 강해보이기는 하지만 그것이 정말인지 확인해 볼 필요가 있어. 어렵지 않은 테스트니까 너라면 충분히 통과할 수 있을 거야. 자... 우선 여기 내 편지를 하나 받도록 해. 잊어버리지 않도록 조심하라구. 이 편지를 페리온 근처 #b고원#k 어딘가에 있는 #b전사 전직교관#k에게 전해줘. 바쁜 나를 대신해서 교관일을 해 주고 있는 고마운 사람이야. 편지를 전해주면 널 내 대신 시험해 봐 줄 거야. 자세한 것은 그에게 직접 듣도록 해. 그럼 무사히 돌아오길 바라겠어.")
                    cm.dispose();
                } else {
                    cm.sendOk("흠. 인벤토리 공간이 부족한 것 같군. 기타 탭의 슬롯을 충분히 비운 후 다시 찾아오게나.")
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031012, 1)) {
                if (selection == 1) {
                    job = 110;
                    jobname = "파이터#k";
                    cm.sendYesNo("흠.. 정말 #b"+jobname+"로 전직하고 싶은가? 신중하게 결정하게나.");
                } else if (selection == 2) {
                    job = 120;
                    jobname = "페이지#k";
                    cm.sendYesNo("흠.. 정말 #b"+jobname+"로 전직하고 싶은가? 신중하게 결정하게나.");
                } else if (selection == 3) {
                    job = 130;
                    jobname = "스피어맨#k이";
                    cm.sendYesNo("흠.. 정말 #b스피어맨#k으로 전직하고 싶은가? 신중하게 결정하게나.");
                }
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
                    cm.changeJob(job);
                    cm.sendOk("좋네. 자네는 이제부터 "+jobname+"라네. 내가 자네를 좀 더 강하게 해주었다네. 그리고 소비와 기타 인벤토리 슬롯을 늘려주었으니 원하는대로 사용하도록 하게나. 그리고 약간의 SP를 주었으니 원하는 스킬에 찍어보도록 하게.")
                    cm.dispose();
                }
            }
        }
    }
}