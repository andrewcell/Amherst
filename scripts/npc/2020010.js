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
 * NPCID : 2020010
 * ScriptName : bowman3
 * NPCNameFunc : 레네 - 3차 궁수 전직관
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
        var text = "진실을 꿰뚫는 눈을 가진 자만이 전직을 할 수 있는 자격이 있습니다.\r\n\r\n#b";
        if (cm.getJob() >= 300 && cm.getJob() < 400 && cm.getPlayerStat("LVL") >= 50) {
            var r = 0;
            var qr = cm.getQuestStatus(100200);
            if (qr == 1) {
                text += "#L2# 자쿰 던전의 입장 허가를 받는다.#l\r\n";
                r = 1;
            }
            if (cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
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
                if (cm.getJob() >= 300 && cm.getJob() < 400 && cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
                    cm.sendYesNo("음.. 무슨일로 저를 찾아오셨나요? 3차 전직을 통해 좀 더 강한 궁수가 되고 싶다는 거겠죠? 물론 제 힘으로 당신을 좀 더 강하게 만들어 줄 수는 있지만 그 전에 당신이 얼마나 열심히 수련했는지에 대한 검증이 필요하지요. 지금껏 강해지고 싶다는 마음에 저를 찾아온 사람들은 많았지만 실제로 자신의 강함을 증명한 사람은 별로 없었답니다.. 어때요? 쉽지는 않겠지만 당신을 시험해 봐도 될까요?");
                }
            } else if (val.startsWith("job3_trial1")) {
                if (cm.haveItem(4031057, 1)) {
                    cm.sendNext("#b헬레나#k님이 준 임무를 무사히 완수한 모양이로군요. 역시 당신이라면 해낼 수 있을거라고 생각했어요. 하지만 두번째 시험이 남아있다는 걸 잊지마세요. 두번째 시험에 앞서 우선은 목걸이를 받겠습니다.");
                } else {
                    cm.sendOk("당신에게 1차, 2차 전직을 시켜주었던 헤네시스의 #b헬레나#k님을 기억하고 있지요? 그분을 찾아가면 그분께서 당신에게 한가지 임무를 주실 거에요. 그 임무를 무사히 수행하고 헬레나 님으로부터 #b강인함의 목걸이#k를 받아오세요.");
                    cm.dispose();
                }
            } else if (val.startsWith("job3_trial2")) {
                if (cm.haveItem(4031058, 1)) {
                    cm.sendNext("#b성스러운 돌#k이 주는 시험을 무사히 완수한 모양이로군요.");
                }
                else {
                    cm.sendOk("오시리아 대륙 설원 어딘가에는 몬스터가 접근하지 못하는 작은 성지가 있답니다.. 겉보기에는 평범한 성지 같지만 특별한 물건을 바치면 그 사람의 지혜를 시험해 볼 수 있게 되지요.");
                    cm.dispose();
                }
            }
        } else {
            if (cm.getJob() >= 300 && cm.getJob() < 400 && cm.getPlayerStat("LVL") >= 50) {
                cm.sendOk("좋아요. 당신은 자쿰 던전 입장을 허가받으셨습니다.");
                cm.completeQuest(100200);
                cm.dispose();
            }
        }
    } else if (status == 2) {
        var q = cm.getQuestRecord(195000);
        var val = q.getCustomData();
        if (val == null || val.equals("0")) {
            if (cm.getJob() >= 300 && cm.getJob() < 400 && cm.getJob() % 10 == 0 && cm.getPlayerStat("LVL") >= 70) {
                if (selection == 1) {
                    cm.sendOk("좋아요! 당신이 증명해야 할 것은 당신이 가진 힘과 당신이 가진 지혜, 이 두 가지입니다. 우선은 힘에 대한 시험부터 설명을 해 드리지요. 당신에게 1차, 2차 전직을 시켜주었던 헤네시스의 #b헬레나#k님을 기억하고 있지요? 그분을 찾아가면 그분께서 당신에게 한가지 임무를 주실 거에요. 그 임무를 무사히 수행하고 헬레나 님으로부터 #b강인함의 목걸이#k를 받아오세요.");
                    q.setCustomData("job3_trial1_1");
                    cm.dispose();
                } else {
                    cm.sendOk("... 역시 당신도 다른 사람들과 마찬가지인가요.");
                    cm.dispose();
                }
            }
        } else if (val.startsWith("job3_trial1")) {
            if (cm.haveItem(4031057, 1)) {
                cm.sendOk("좋아요. 이제 두번째 시험만 남았군요. 이 시험을 통과한다면 당신은 더욱 강력한 궁수가 될 수 있습니다.. 오시리아 대륙 설원 어딘가에는 몬스터가 접근하지 못하는 작은 성지가 있답니다.. 겉보기에는 평범한 성지 같지만 특별한 물건을 바치면 그 사람의 지혜를 시험해 볼 수 있게 되지요.");
                cm.gainItem(4031057, -1);
                q.setCustomData("job3_trial2_1");
                cm.dispose();
            }
            cm.dispose();
        } else if (val.startsWith("job3_trial2")) {
            if (cm.haveItem(4031058, -1)) {
                cm.sendNext("호오... 무사히 성지를 찾아내어 성지의 물음에 지혜롭게 답한 모양이로군요. 설마 당신이 두번째 시험까지 통과하리라고는 생각치 못했는데... 정말 대단하시군요. 3차 전직에 앞서 우선은 목걸이를 받겠습니다.");
            }
        }
    } else if (status == 3) {
        var q = cm.getQuestRecord(195000);
        var val = q.getCustomData();
        if (val.startsWith("job3_trial2")) {
            cm.sendYesNo("이제 당신은 저를 통해서 더욱 강한 궁수가 될 수 있을겁니다. 그 전에 SP를 충분히 소비했는지 확인해 주세요. 적어도 레벨 70까지 얻은 SP는 모두 소비해야 3차 전직을 하실 수 있습니다. 그리고 2차 전직때 이미 어느 길로 갈지 정했기 때문에 3차 전직에서 특별히 고르실 건 없답니다. 지금 바로 전직을 하시겠어요?")
        }
    } else if (status == 4) {
        if (selection == 0) {
            cm.dispose();
            return;
        }
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
                if (cm.getJob() == 310) {
                    job = 311;
                    jobname = "레인저#k가";
                } else if (cm.getJob() == 320) {
                    job = 321;
                    jobname = "저격수#k가";
                }
                cm.gainItem(4031058, -1);
                cm.changeJob(job);
                q.setCustomData("job3_clear");
                cm.sendOk("당신은 #b" + jobname + " 되었습니다. 축하드려요. 앞으로도 정진하고 분발해 주시길...");
                cm.dispose();
            }
        }
    }
}