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
 * NPCID : 1012100
 * ScriptName : bowman
 * NPCNameFunc : 헬레나 - 궁수 전직관
 * Location : 100000201 (빅토리아로드 - 궁수 교육원)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var way = -1;
var job;
var jobname;
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
            cm.sendNext("음.. 궁수로 전직을 하고 싶은가요..? 하지만 그 전에 조건이 있는데, 레벨이 10 이상이어야 하지요.. 어디, 당신은 어떤지 한번 볼까요?")
        } else if (cm.getJob() == 300 && cm.getPlayerStat("LVL") >= 30) {
            way = 1;
            if (cm.haveItem(4031010, 1)) {
                cm.sendOk("그 편지를 가지고 헤네시스 근처에 있는 #b전직교관#k에게 가져가세요. 그리고 그 전직교관의 수련을 완료한다면 당신은 더욱 강해질 수 있을거에요.")
                cm.dispose();
            } else if (cm.haveItem(4031012, 1)) {
                cm.sendNext("영웅의 증거를 가져오셨군요. 이제 제가 당신을 좀 더 강하게 만들어 드리도록 하지요.")
            } else {
                cm.sendYesNo("음... 정말 몰라보게 강해지셨군요. 예전에 그 허약한 모습은 어디로 가고 지금은 궁수로서의 위엄이 넘쳐 흐르고 있군요. 자... 어떠신가요? 여기서 조금 더 강해지고 싶지 않은가요? 간단한 시험만 통과한다면 당신을 더욱 더 강하게 만들어 드리지요. 해보시겠어요?");
            }
        } else if (value.equals("job3_trial1_1")) {
            if ((cm.getJob() == 310 || cm.getJob() == 320) && cm.getPlayerStat("LVL") >= 70) {
                q.setCustomData("job3_trial1_2");
                cm.sendOk("#b레네#k님께 당신에 대한 이야기는 잘 전해 들었습니다. 좋아요. 제가 당신의 힘을 시험해 드리도록 하지요. 빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 저의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 제게 가져오세요.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_2")) {
            if (cm.haveItem(4031059, 1)) {
                if (cm.canHold(4031057)) {
                    cm.gainItem(4031059, -1);
                    cm.gainItem(4031057, 1);
                    q.setCustomData("job3_trial1_3");
                    cm.sendOk("여기 힘의 목걸이 입니다. 이제 #b레네#k님을 찾아가 보세요.");
                    cm.dispose();
                } else {
                    cm.sendOk("흐음. 인벤토리 공간이 부족한 것 같은데요. 기타 탭을 충분히 비우고 다시 오세요.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("빅토리아 아일랜드 어딘가의 다른 차원으로 통하는 균열로 가서, 저의 분신을 쓰러뜨리고 #b검은 부적#k을 얻어 제게 가져오세요.");
                cm.dispose();
            }
        } else if (value.equals("job3_trial1_3")) {
            cm.sendOk("이제 #b레네#k님을 찾아가 보세요..");
            cm.dispose();
        } else {
            cm.sendOk("궁수가 되고 싶은 자는 나에게..");
            cm.dispose();
        }
    }
    
    if (way == 0) {
        if (status == 1) {
            if (cm.getPlayerStat("LVL") >= 10) {
                cm.sendYesNo("음, 당신이라면 궁수가 될 자질이 보이는군요. 어떠세요? 궁수가 되고싶으세요?")
            } else {
                cm.sendOk("음.. 아직 당신은 궁수가 될 수 없을 것 같군요. 조금 더 수련을 하신 후 다시 찾아오세요.")
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("그런가요? 신중하게 생각해 보시고 결정하세요.");
                cm.dispose();
                return;
            }
            if (cm.getInvSlots(1) >= 1 && cm.getInvSlots(2) >= 1) {
                cm.gainItem(1452051, 1);
                cm.gainItem(2060000, 2000);
            } else {
                cm.sendOk("장비와 소비 인벤토리를 비우고 다시 오세요.");
                cm.dispose();
                return;
            }
            cm.changeJob(300);
            //SP Given in source
            //Expand Inventory and given inc maxhp, maxmp
            cm.sendOk("자, 이제 당신은 궁수 입니다. 바람과 같은 화살로 적들을 꿰뚫으며 약자를 보호하는 사람이 되길.. 아, 당신에게 방금 SP 하나를 나누어 드렸어요. 원하는 스킬에 투자해보세요. 또, 당신에게 소비와 장비 인벤토리를 늘려드렸어요. 유용하게 사용하시길..")
            cm.dispose();
        }
    } else if (way == 1) {
        if (status == 1) {
            if (cm.haveItem(4031012, 1)) {
                cm.sendSimple("어떤 직업으로 전직해보시고 싶으세요?#b\r\n\r\n#L2# 헌터로 전직하고 싶습니다.#l\r\n#L3# 사수로 전직하고 싶습니다.#l");
            } else {
                if (selection == 0) {
                    cm.sendOk("흐음.. 더 강해질 수 있는 기회인데.. 아쉽군요. 마음이 바뀌면 다시 찾아오세요.");
                    cm.dispose();
                    return;
                }
                if (cm.canHold(4031010)) {
                    cm.gainItem(4031010, 1);
                    cm.sendOk("자, 이 편지를 받으세요. 잃어버리지 않도록 조심해주세요. 이 편지를 헤네시스 초원 근처의 #b전직 교관#k에게 가져다 주세요. 저 대신 전직에 대한 가르침을 주는 고마운 분이죠. 자세한 설명은 그분께 듣도록 하시기 바래요.")
                    cm.dispose();
                } else {
                    cm.sendOk("인벤토리 슬롯이 부족해 보이시는군요. 기타탭을 충분히 비우신 후 다시 찾아오세요.")
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031012, 1)) {
                if (selection == 2) {
                    job = 310;
                    jobname = "헌터";
                } else if (selection == 3) {
                    job = 320;
                    jobname = "사수";
                }
                cm.sendYesNo("정말 #b"+jobname+"#k 계열의 궁수로 전직하시고 싶으세요?");
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendOk("신중하게 생각해 보시고 다시 말을 걸어주세요.");
                cm.dispose();
            } else {
                var rsp = (cm.getPlayerStat("LVL") - 30) * 3;
                if (cm.getPlayerStat("RSP") > rsp) {
                    cm.sendOk("음.. 30레벨 이전에 얻은 SP를 모두 투자하셔야 2차 전직을 하실 수 있답니다.")
                    cm.dispose();
                } else {
                    cm.gainItem(4031012, -1);
                    cm.changeJob(job);
                    cm.sendOk("좋아요. 당신은 이제부터 "+jobname+" 입니다. 제 힘을 당신에게 나누어 드렸습니다. 그리고 기타 인벤토리 슬롯을 늘려드렸으니 유용하게 사용하시길 바래요. 그리고 약간의 SP도 드렸으니, 원하는 스킬에 투자해보도록 하세요.")
                    cm.dispose();
                }
            }
        }
    }
}