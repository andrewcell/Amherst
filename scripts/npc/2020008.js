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
 * NPCID : 2020008
 * ScriptName : warrior3
 * NPCNameFunc : 타일러스 - 3차 전사 전직관
 * Location : 211000001 (엘나스 - 장로의관저)
 * 
 * @author T-Sun
 *
 */

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
    if (status == 0) {
        if (cm.getJob() >= 100 && cm.getJob() < 200 && cm.getJob() % 10 == 2) {
            if (cm.getQuestStatus(6192) == 1) {
                if (cm.getParty() != null) {
                    var ddz = cm.getEventManager("ProtectTylus");
                    if (ddz == null) {
                        cm.sendOk("Unknown error occured");
                        cm.dispose();
                        return;
                    } else {
                        var prop = ddz.getProperty("state");
                        if (prop == null || prop.equals("0")) {
                            ddz.startInstance(cm.getParty(), cm.getMap());
                            cm.dispose();
                            return;
                        } else {
                            cm.sendOk("이미 다른 파티가 입장하여 퀘스트에 도전하는 중입니다. 잠시 후 다시 시도해 주세요.");
                            cm.dispose();
                            return;
                        }
                    }
                } else {
                    cm.sendOk("파티를 구성한 후 내게 말을 걸게.");
                    cm.dispose();
                    return;
                }
            }
        }
        
        
        var text = "충분한 강인함을 갖춘 자만이 전직을 할 수 있는  자격이 있다네.\r\n\r\n#b";
        if (cm.getJob() == 1110 || (cm.getJob() >= 100 && cm.getJob() < 200) && cm.getPlayerStat("LVL") >= 50) {
            var r = 0;
            var qr = cm.getQuestStatus(100200);
            if (qr == 1) {
                text += "#L2# 자쿰 던전의 입장 허가를 받는다.#l\r\n";
                r = 1;
            }
            if (cm.getJob() == 1110 || cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
                text += "#L1# 3차 전직을 하고 싶습니다.#l\r\n";
                r = 1;
            }
            if (r == 1) {
                cm.sendSimple(text);
                return;
            }
        }
        cm.sendOk(text);
        cm.dispose();
    } else if (status == 1) {
        mySel = selection;
        if (mySel == 1) {
            var q = cm.getQuestRecord(195000);
            var val = q.getCustomData();
            if (val == null || val.equals("0")) {
                if (cm.getJob() == 1110 || (cm.getJob() >= 100 && cm.getJob() < 200) && cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
                    cm.sendYesNo("흠. 무슨 일로 날 찾아온겐가? 흠... 3차 전직을 통해 좀 더 강한 전사가 되고 싶다는 건가. 물론 내 힘으로 자네를 좀 더 강하게 만들어 줄 수는 있지만 그 전에 자네가 얼마나 열심히 수련했는지에 대한 검증이 필요하다네. 지금껏 강해지고 싶다는 마음에 날 찾아온 젊은이들은 많았지만 실제로 자신의 강함을 증명한 녀석은 별로 없었지... 어떤가? 쉽지는 않겠지만 자네를 시험해 봐도 괜찮겠는가?");
                }
            } else if (val.startsWith("job3_trial1")) {
                if (cm.haveItem(4031057, 1)) {
                    cm.sendNext("오오.. #b주먹펴고일어서#k가 준 임무를 무사히 완수한 모양이로군. 역시 자네라면 해낼 수 있을거라고 생각했네. 하지만 두번째 시험이 남아있다는 걸 잊지는 않았겠지? 두번째 시험에 앞서 우선은 목걸이를 받도록 하겠네.");
                } else {
                    cm.sendOk("자네에게 1차, 2차 전직을 시켜주었던 페리온의 #b주먹펴고일어서#k를 기억하고 있겠지? 그를 찾아가면 그가 자네에게 한가지 임무를 줄 것일세. 그 임무를 무사히 수행하고 주먹펴고일어서로부터 #b강인함의 목걸이#k를 받아오게나.");
                    cm.dispose();
                }
            } else if (val.startsWith("job3_trial2")) {
                if (cm.haveItem(4031058, 1)) {
                    cm.sendNext("#b성스러운 돌#k이 주는 시험을 무사히 완수한 모양이군..");
                } else {
                    cm.sendOk("오시리아 대륙 설원 어딘가에는 몬스터가 접근하지 못하는 작은 성지가 있다네. 겉보기에는 평범한 성지 같지만 특별한 물건을 바치면 그 사람의 지혜를 시험해 볼 수 있게 되지.");
                    cm.dispose();
                }
            }
        } else {
            if (cm.getJob() == 1111 || cm.getJob() >= 100 && cm.getJob() < 200 && cm.getPlayerStat("LVL") >= 50) {
                cm.sendOk("좋네. 자네는 이제 자쿰 던전의 입장을 허가받았네.");
                cm.completeQuest(100200);
                cm.dispose();
            }
        }
    } else if (status == 2) {
        var q = cm.getQuestRecord(195000);
        var val = q.getCustomData();
        if (val == null || val.equals("0")) {
            if (cm.getJob() == 1110 || cm.getJob() >= 100 && cm.getJob() < 200 && cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
                if (selection == 1) {
                    cm.sendOk("좋네! 자네가 증명해야 할 것은 자네가 가진 힘과 자네가 가진 지혜, 이 두 가지라네. 우선은 힘에 대한 시험부터 설명을 해 주겠네. 자네에게 1차, 2차 전직을 시켜주었던 페리온의 #b주먹펴고일어서#k를 기억하고 있겠지? 그를 찾아가면 그가 자네에게 한가지 임무를 줄 것일세. 그 임무를 무사히 수행하고 주먹펴고일어서로부터 #b강인함의 목걸이#k를 받아오게나.");
                    q.setCustomData("job3_trial1_1");
                    cm.dispose();
                } else {
                    cm.sendOk("역시... 자네도 다른 젊은이들과 마찬가지로구만.");
                    cm.dispose();
                }
            }
        } else if (val.startsWith("job3_trial1")) {
            if (cm.haveItem(4031057, 1)) {
                cm.sendOk("좋네. 이제 두번째 시험이 남아있군 그래. 이 시험까지도 무사히 통과한다면 자네는 더욱 강한 전사가 될 수 있을걸세. 오시리아 대륙 설원 어딘가에는 몬스터가 접근하지 못하는 작은 성지가 있다네. 겉보기에는 평범한 성지 같지만 특별한 물건을 바치면 그 사람의 지혜를 시험해 볼 수 있게 되지.");
                cm.gainItem(4031057, -1);
                q.setCustomData("job3_trial2_1");
                cm.dispose();
            }
            cm.dispose();
        } else if (val.startsWith("job3_trial2")) {
            if (cm.haveItem(4031058, -1)) {
                cm.sendNext("자네는 지혜와 힘을 모두 시험받았네. 그리고 무사히 완수했네. 자.. 이제 내가 자네를 좀 더 강하게 만들어주겠네.");
            }
        }
    } else if (status == 3) {
        var q = cm.getQuestRecord(195000);
        var val = q.getCustomData();
        if (val.startsWith("job3_trial2")) {
            if (cm.haveItem(4031058,1)) {
                var rsp = (cm.getPlayerStat("LVL") - 70) * 3;
                if (cm.getPlayerStat("RSP") > rsp) {
                    cm.sendOk("흐음. 자네는 아직 SP가 많이 남아있는 것 같군. SP를 2차 전직 까지의 스킬에 좀 더 투자하기 전에는 3차전직을 할 수 없다네.")
                    cm.dispose();
                    return;
                }
                if (cm.getJob() == 110) {
                    job = 111;
                    jobname = "크루세이더#k가";
                } else if (cm.getJob() == 120) {
                    job = 121;
                    jobname = "나이트#k가";
                } else if (cm.getJob() == 130) {
                    job = 131;
                    jobname = "용기사#k가";
                } else if (cm.getJob() == 1110) {
                    job = 1111;
                    jobname = "사황 풍연#k이";
                }
                cm.gainItem(4031058, -1);
                cm.changeJob(job);
                q.setCustomData("job3_clear");
                cm.sendOk("자네는 #b" + jobname + " 되었네. 축하하네. 앞으로도 정진하고 분발해주게나.");
                cm.dispose();
            }
        }
    }
}