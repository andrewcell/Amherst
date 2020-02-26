

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
    
    if (status == 0) {
        var q = cm.getQuestRecord(195000)
        var value = q.getCustomData();
        if (value == null) {
            q.setCustomData("0");
			value = "0";
        }
        if (cm.getJob() == 0) {
            way = 0;
            cm.sendNext("흐음.. 자네, 마법사에 관심이 있는가?")
        } else if (cm.getJob() == 1000) {
          way = 9999;
	  cm.sendNext("자네는 다른 모험가들과 달리 조금 특별해 보이는군... 파도의 기운이 느껴진단말이야... 자네에겐 특별한 선택을 할수있는 기회를 주겠네... 전설의 사황 파도의 '해룡'의 길을 겉고싶은생각이 없는가?");
        } else if ((cm.getJob() == 1200 || cm.getJob() == 200) && cm.getPlayerStat("LVL") >= 30) {
            way = 1;
            if (cm.haveItem(4031009, 1)) {
                cm.sendOk("이 편지를 엘리니아 근처 #b엘리니아북쪽숲#k에 어딘가에 있는 #b마법사 전직교관#k에게 전해주게. 바쁜 나를 대신해서 교관일을 해 주고 있는 고마운 사람이지. 편지를 전해주면 자네를 나 대신 시험해 줄걸세. 자세한 것은 그에게 직접 듣도록 하게. 그럼 무사히 돌아오길 바라겠네.")
                cm.dispose();
            } else if (cm.haveItem(4031012, 1)) {
                cm.sendNext("축하하네. 수련을 모두 완료했나보군. 자, 이제 자네를 내가 좀 더 강하게 만들어 주겠네.")
            } else {
                cm.sendYesNo("자네.. 몰라보게 강해졌군. 예전에 그 허약한 모습은 어디로 가고 지금은 마법사로서의 위엄이 넘쳐 흐르고 있군. 자... 어때? 여기서 조금 더 강해지고 싶지 않은가? 간단한 시험만 통과한다면 널 더욱 더 강하게 만들어 주지. 해보겠나?");
            }
        } else if (value.equals("job3_trial1_1")) {
            if ((cm.getJob() == 1210 || cm.getJob() == 210 || cm.getJob() == 220 || cm.getJob() == 230) && cm.getPlayerStat("LVL") >= 70) {
                q.setCustomData("job3_trial1_2");
                cm.sendOk("후후.. #b로베이라#k에게서 자네에 대한 이야기는 전해 들었다. 좋아. 내가 자네의 힘을 시험해 주도록 하겠네. 빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 나의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 내게 가져오게.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_2")) {
            if (cm.haveItem(4031059, 1)) {
                if (cm.canHold(4031057)) {
                    cm.gainItem(4031059, -1);
                    cm.gainItem(4031057, 1);
                    q.setCustomData("job3_trial1_3");
                    cm.sendOk("여기 힘의 목걸이가 있네. 이제 #b로베이라#k를 찾아가 보게.");
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
            cm.sendOk("이제 #b로베이라#k를 찾아가 보게..");
            cm.dispose();
        } else {
            cm.sendOk("마법사가 되고 싶은 자는 나에게..");
            cm.dispose();
        }
    }
	if (way == 9999) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 10) {
                cm.sendYesNo("전설의 사황 해룡은 비록 마스터레벨이 120 이며, 3차전직 까지 밖에 없더라도 꽤 강력한 전설의 직업군이지 자 어떻게 할텐가 정말 해룡의 길을 걷고싶은건가?")
            } else {
                cm.sendOk("흠. 아직 자네는 해룡이 되기엔 너무 약해 보이는군. 조금 더 수련을 한 후 다시 오게나.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가? 찬찬히 생각해 보고 다시 오게나.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 1) {
                cm.gainItem(1372043, 1);
            } else {
                cm.sendOk("장비 인벤토리를 비우고 다시 오게.");
                cm.dispose();
                return;
            }
            cm.changeJob(1200);
            cm.sendOk("좋네. 자네는 해룡이 되었네. 내 능력치를 조금 나누어 주겠네. 그리고 #bSP#k를 1 주었으니, 원하는 스킬에 찍어보도록 하게.")
            cm.dispose();
        }
    } else if (way == 0) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 8) {
                cm.sendYesNo("호오, 자네는 마법사의 길을 선택할 자격이 충분히 되어 보이는군.. 정말로 마법사의 길을 걷고 싶은가..? 이 앞에는 수 많은 난관이 기다리고 있을 것이네.")
            } else if (cm.getPlayerStat("LVL") < 8) {
                cm.sendOk("그래, 하루하루 수련을 하는 모험가들이 늘어가고 있지. 우선 마법사의 길을 선택하기 위해선 #b레벨 8#k 은 되어야 가능하지.. 준비가 되면 다시 한 번 나를 찾아오게나.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가? 찬찬히 생각해 보고 다시 오게나.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 1) {
                cm.gainItem(1372043, 1);
            } else {
                cm.sendOk("장비 인벤토리를 비우고 다시 오게.");
                cm.dispose();
                return;
            }
            cm.changeJob(200);
            //SP Given in source
            //Expand Inventory and given inc maxhp, maxmp
            cm.sendOk("자네는 #b마법사#k가 되었네. 내가 자네에게 약간의 힘을 나누어 주었네. 자네는 한층 더 강해졌을 것이야. #bSP#k를 주었으니 원하는 스킬에 찍어보도록 하게나.")
            cm.dispose();
        }
    } else if (way == 1) {
        if (status == 1) {
            if (cm.haveItem(4031012, 1)) {
		if (cm.getJob() == 1200) {
                    cm.gainItem(4031012, -1);
                    cm.changeJob(1210);
                    cm.dispose();
		} else {
                cm.sendSimple("어떤 직업으로 전직하고 싶은가?#b\r\n#b\r\n#L1# 불/독 위자드로 전직하고 싶습니다.#l\r\n#L2# 냉기/번개 위자드로 전직하고 싶습니다.#l\r\n#L3# 클레릭으로 전직하고 싶습니다.#l");
        	}    
	} else {
                if (selection == 0) {
                    cm.sendOk("흠..그런가? 아쉽군. 더욱 강해질 수 있는 기회인데. 아직 다른 할 일이 있나 보군?");
                    cm.dispose();
                    return;
                }
                if (cm.canHold(4031009)) {
                    cm.gainItem(4031009, 1);
                    cm.sendOk("잘 생각했네. 하지만 자넨 강해보이기는 하지만 그것이 정말인지 확인해 볼 필요가 있지. 어렵지 않은 테스트니 자네라면 충분히 통과할 수 있을 걸세. 자... 우선 여기 내 편지를 하나 받도록 하게. 잊어버리지 않도록 조심하게나. 이 편지를 엘리니아 근처 #b엘리니아북쪽숲#k에 어딘가에 있는 #b마법사 전직교관#k에게 전해주게. 바쁜 나를 대신해서 교관일을 해 주고 있는 고마운 사람이지. 편지를 전해주면 자네를 나 대신 시험해 줄걸세. 자세한 것은 그에게 직접 듣도록 하게. 그럼 무사히 돌아오길 바라겠네.")
                    cm.dispose();
                } else {
                    cm.sendOk("흠. 인벤토리 공간이 부족한 것 같군. 기타 탭의 슬롯을 충분히 비운 후 다시 찾아오게나.")
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031012, 1)) {
                if (selection == 1) {
                    job = 210;
                    jobname = "불/독 위자드#k";
                    cm.sendYesNo("화염과 독으로 상대를 꼼짝할 수 없게 하는 마법사. #b위저드(불,독)#k가 되고 싶은가?");
                } else if (selection == 2) {
                    job = 220;
                    jobname = "냉기/번개 위자드#k";
                    cm.sendYesNo("자연의 냉기, 번개를 자유자재로 다룰 수 있는 마법사. #b위저드(냉기,번개)#k가 되고 싶은가?");
                } else if (selection == 3) {
                    job = 230;
                    jobname = "클레릭#k이";
                    cm.sendYesNo("신성한 힘으로 악을 규탄하고, 파티원들과 자신에게 이로운 버프와 회복, 파티의 중심역할을 수행하는 #b클레릭#k이 되고싶은가?");
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
                    cm.sendOk("좋네. 자네는 이제부터 "+jobname+"라네. 내가 자네를 좀 더 강하게 해주었다네. 그리고 소비 인벤토리 슬롯을 늘려주었으니 원하는대로 사용하도록 하게나. 그리고 약간의 SP를 주었으니 원하는 스킬에 찍어보도록 하게.")
                    cm.dispose();
                }
            }
        }
    }
}