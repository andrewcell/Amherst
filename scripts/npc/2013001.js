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
 * NPCID : 2013001
 * ScriptName : party3_play
 * NPCNameFunc : 시종 이크
 * Location : 920010200 (히든스트리트 - 여신의 탑<산책로>)
 * Location : 920010100 (히든스트리트 - 여신의 탑<중앙탑>)
 * Location : 920010900 (히든스트리트 - 여신의 탑<죄인의 방>)
 * Location : 920011000 (히든스트리트 - 여신의 탑<암흑의 방>)
 * Location : 920010700 (히든스트리트 - 여신의 탑<올라가는 길>)
 * Location : 920010800 (히든스트리트 - 여신의 탑<정원>)
 * Location : 920010500 (히든스트리트 - 여신의 탑<봉인된 방>)
 * Location : 920010600 (히든스트리트 - 여신의 탑<라운지>)
 * Location : 920010400 (히든스트리트 - 여신의 탑<휴게실>)
 * Location : 920011200 (히든스트리트 - 여신의 탑<나가는 길>)
 * Location : 920010300 (히든스트리트 - 여신의 탑<창고>)
 * 
 * @author T-Sun
 *
 */

function clear() {
    cm.showEffect(true, "quest/party/clear");
    cm.playSound(true, "Party1/Clear");
}

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
    
    if (cm.getPlayer().getMapId() == 920011200) { //exit
        for (var i = 4001044; i < 4001064; i++) {
            cm.removeAll(i); //holy
        }
        cm.cancelBuff(2022090);
        cm.cancelBuff(2022091);
        cm.cancelBuff(2022092);
        cm.cancelBuff(2022093);
        cm.warp(200080101);
        cm.dispose();
        return;
    }
    var em = cm.getEventManager("OrbisPQ");
    if (em == null) {
        cm.sendOk("Please try again later.");
        cm.dispose();
        return;
    }
    nFieldId = cm.getPlayer().getMapId();
    if (nFieldId == 920010000) {
        if (status == 0) {
            for (var i = 4001044; i < 4001064; i++) {
                cm.removeAll(i); //holy
            }
            var state1 = em.getProperty("prestage");
            if (state1 == null) {
                cm.sendNext("안녕하세요, 저는 여신을 모시는 시종 이크라고 해요. 지금 제 모습이 보이지 않으셔도 놀라지 마세요. 여신께서 석상으로 변화되어 버렸을때 저는 제 힘을 모두 잃어버리고 말았어요. 오르비스의 구름조각을 구해오신다면 제 몸을 복구하고 여러분들 앞에 나타날 수 있답니다. #b20#k개의 구름 조각을 모아 제게 가져오시면 된답니다. 그리고, 지금 제 모습은 무척 작아서 반짝거리는 빛으로 밖에 보이지 않으실 거에요.");
                cm.dispose();
            } else if (state1.equals("clear")) {
                var state1rewarded = em.getProperty("prestageRewarded");
                if (cm.isLeader()) {
                    if (state1rewarded == null) {
                        clear();
                        cm.sendNext("제 몸을 다시 만들어 주셔서 너무 고마워요! 입구로 데려다 드릴게요~!");
                    } else {
                        cm.warp(920010000, 2);
                        cm.dispose();
                    }
                } else {
                    if (state1rewarded.equals("clear")) {
                        cm.warp(920010000, 2);
                        cm.dispose();
                    } else {
                        cm.sendOk("제 몸을 다시 만들어 주셔서 너무 고마워요! 여신의 탑으로 들어가려면 파티장이 제게 말을 걸어주면 된답니다.")
                        cm.dispose();
                    }
                }
            }
        } else if (status == 1) {
            em.setProperty("prestageRewarded", "clear");
            cm.gainPartyExpPQ(6000, "orbispq", 70);
            cm.warpParty(920010000, 2);
            cm.dispose();
        }
        return;
    } else if (nFieldId == 920010900) {
        cm.sendOk("이곳은 여신 미네르바께서 죄인들을 가두어 두었던 지하 감옥입니다. 이곳에 여신의 조각상 조각은 없답니다. 하지만 무언가가 숨겨져 있을지도 모르겠군요.");
        cm.dispose();
    } else if (nFieldId == 920010400) {
        //휴게실
        if (!cm.isLeader()) {
            cm.sendOk("이곳은 여신의 탑의 휴게실입니다. 미네르바 여신님은 이곳에서 음악을 즐기곤 하셨지요. 여신님은 매일매일 다른 음악을 즐기셨답니다.\r\n\r\n여신님께서 즐기신 음악은 \r\n\r\n#b월요일에는 아기자기한 음악\r\n화요일에는 무서운 음악\r\n수요일에는 재미있는 음악\r\n목요일에는 우울한 음악\r\n금요일에는 싸늘한 음악\r\n토요일에는 깔끔한 음악\r\n일요일에는 웅장한 음악\r\n\r\n#k여신님은 이렇게 매일매일 음악을 바꾸어 들으셨지요.\r\n\r\n만약 그때 그 음악을 틀어주신다면 미네르바 여신님의 영혼이 신비한 일을 일으킬지도 모르겠네요.");
            cm.dispose();
        } else {
            var stage3music = em.getProperty("stage3_music");
            //            cm.playerMessage(cm.getDayOfWeek());
            if (stage3music == null) {
                cm.sendOk("이곳은 여신의 탑의 휴게실입니다. 미네르바 여신님은 이곳에서 음악을 즐기곤 하셨지요. 여신님은 매일매일 다른 음악을 즐기셨답니다.\r\n\r\n여신님께서 즐기신 음악은 \r\n\r\n#b월요일에는 아기자기한 음악\r\n화요일에는 무서운 음악\r\n수요일에는 재미있는 음악\r\n목요일에는 우울한 음악\r\n금요일에는 싸늘한 음악\r\n토요일에는 깔끔한 음악\r\n일요일에는 웅장한 음악\r\n\r\n#k여신님은 이렇게 매일매일 음악을 바꾸어 들으셨지요.\r\n\r\n만약 그때 그 음악을 틀어주신다면 미네르바 여신님의 영혼이 신비한 일을 일으킬지도 모르겠네요.");
                cm.dispose();
                return;
            } else if (em.getProperty("stage3clear") != null) {
                cm.sendOk("여신님께서 즐겨들으시던 음악이 나오고 있어요.");
                cm.dispose();
                return;
            } else {
                var dday = parseInt(stage3music);
                if (dday == cm.getDayOfWeek()) {
                    clear();
                    cm.getPlayer().getMap().getReactorById(2002011).forceHitReactor(1);
                    em.setProperty("stage3clear", "clear");
                    cm.gainPartyExpPQ(7500, "orbispq", 70);
                    cm.sendOk("바로 이 음악이에요! 여신님은 이 날에 이 음악을 즐겨 듣곤 하셨지요.")
                    cm.dispose();
                } else {
                    cm.sendOk("이 음악이 아닌 것 같은데요...");
                    cm.dispose();
                }
            }
        }
    } else if (nFieldId == 920010100) {
        if (status == 0) {
            var minerva = em.getProperty("status");
            if (minerva == null) {
                em.setProperty("status", "0");
            }
            minerva = parseInt(minerva);
            if (minerva < 6) {
                cm.sendOk("여신상의 조각을 모아 여신님의 석상을 복구하고 여신님을 구해주세요!");
                cm.dispose();
            } else if (minerva == 6) {
                if (em.getProperty("stage0clear") == null) {
                    cm.sendNext("여신님의 석상이 복구되었군요! 이제 여신님을 구하기 위한 마지막 단계만이 남았어요! 이 모든 일의 원흉을 처치하고 이 여신의 탑의 평화를 되찾아 주세요.")
                } else {
                    cm.sendOk("얻어오신 생명의 풀로 여신님을 구해주세요!");
                    cm.dispose();
                }
            } else if (minerva == 7) {
                cm.sendOk("여신님을 마침내 구해주셨군요! 여신님께 말을 걸어보세요. 분명 좋은 보상을 주실거에요.");
                cm.dispose();
            }
        } else if (status == 1) {
            em.setProperty("stage0clear", "clear");
            cm.warpParty(920010800, 1);
            cm.dispose();
        }
    } else if (nFieldId == 920010800) {
        
        var stageboss = em.getProperty("stagebossclear");
        if (stageboss == null || !stageboss.equals("clear")) {
            if (cm.isLeader() && stageboss == null) {
                em.setProperty("stagebossclear", "s");
            } else if (cm.isLeader()) {
                
            }
            cm.sendOk("이곳은 여신의 탑의 정원입니다. #b생명의 풀#k은 이곳에 있는 화분에서만 키울 수 있답니다. 생명의 풀을 기를 씨앗만 있으면 될텐데... 참! 여신님을 석상에 가둔 #b파파픽시#k가 이곳에 있을지 모르니 조심하세요!")
            cm.dispose();
        } else {
            cm.sendOk("얻은 생명의 풀로 여신님을 되살려 주세요!");
            cm.dispose();
            return;
        }
    } else if (nFieldId == 920010500) {
        //봉인된 방
        var quiz_ans = em.getProperty("stage4rand");
        if (quiz_ans == null || quiz_ans.equals("0")) {
            var ans2_1 = cm.rand(0 ,5);
            var ans2_2 = cm.rand(0, 5 - ans2_1);
            var ans2_3 = 5 - ans2_1 - ans2_2;
            
            var rand_anw = cm.rand(1,6);
            if (rand_anw == 1) {
                var val = "" + ans2_1 + ans2_2 + ans2_3;
            } else if (rand_anw == 2) {
                var val = "" + ans2_1 + ans2_3 + ans2_2;
            } else if (rand_anw == 3) {
                var val = "" + ans2_2 + ans2_1 + ans2_3;
            } else if (rand_anw == 4) {
                var val = "" + ans2_2 + ans2_3 + ans2_1;
            } else if (rand_anw == 5) {
                var val = "" + ans2_3 + ans2_1 + ans2_2;
            } else {
                var val = "" + ans2_3 + ans2_2 + ans2_1;
            }
            em.setProperty("stage4rand", val);
            em.setProperty("stage4try", "0");
            quiz_ans = val;
        }
        var stage4clear = em.getProperty("stage4clear");
        var help = "이곳은 여신의 탑의 봉인된 방입니다. 여신 미네르바께서 자신의 소중한 물건을 안전하게 보관할 수 있을 만큼 안전한 방입니다. 그래서, 이 방을 열기 위해선 특수한 무게가 필요합니다. 여러분 다섯명이 발판을 올바르게 올라서서 정해진 무게를 맞추어야 합니다. 7번의 기회를 드리며, 그 안에 맞추시지 못한다면 안전장치로 봉인된 방에서 추방되게 됩니다.";
        if (!cm.isLeader()) {
            if (stage4clear == null || !stage4clear.equals("clear")) {
                cm.sendNext(help);
                cm.dispose();
                return;
            }
        }
        if (stage4clear != null && stage4clear.equals("clear")) {
            cm.sendOk("이미 이 미션을 훌륭하게 클리어 하신 것 같아요. 다른 방에 도전해 보세요!");
            cm.dispose();
            return;
        }
        var area1 = cm.getPlayer().getMap().getNumPlayersInArea(0);
        var area2 = cm.getPlayer().getMap().getNumPlayersInArea(1);
        var area3 = cm.getPlayer().getMap().getNumPlayersInArea(2);
        
        //Debug
        //        area1 = 0;
        //        area2 = 0;
        //        area3 = 5;
        //        cm.playerMessage("Answer : " + quiz_ans + " / Pos : " + area1 + "" + area2 + "" + area3);
        //DebugEnd
        
        if (area1 + area2 + area3 != 5) {
            cm.sendOk("아직 파티원 5명이 정답 발판 5개를 찾지 못한것 같군요. 아슬아슬하게 서 계시지 말고 가운데에 올바르게 서 계셔야 정답으로 인정되니 주의해 주세요!");
            cm.dispose();
            return;
        }
        var ans1 = parseInt(quiz_ans.substr(0, 1));
        var ans2 = parseInt(quiz_ans.substr(1, 1));
        var ans3 = parseInt(quiz_ans.substr(2, 1));
        if (area1 == ans1 && area2 == ans2 && area3 == ans3) {
            clear();
            cm.sendOk("축하해요! 정답을 맞추셨어요!");
            cm.getPlayer().getMap().getReactorById(2002012).forceHitReactor(1);
            em.setProperty("stage4clear", "clear");
            cm.gainPartyExpPQ(7500, "orbispq", 70);
            cm.dispose();
        } else {
            var trycount = parseInt(em.getProperty("stage4try"));
            trycount++;
            em.setProperty("stage4try", trycount+"");
            if (trycount == 6) {
                cm.sendOk("마지막 기회에요! 틀리지 않게 조심해 주세요! 행운을 빌어요~");
                cm.dispose();
            } else if (trycount == 7) {
                cm.partyMessage("봉인된 방에서 추방되었습니다.");
                em.setProperty("stage4rand", "0"); //reset
                cm.warpParty(920010100, 13);
                cm.dispose();
            } else {
				var okk = 0;
				if (area1 == ans1) okk++;
				if (area2 == ans2) okk++;
				if (area3 == ans3) okk++;
                cm.sendOk("정답이 아니에요! 지금까지 " + trycount + " 번 도전 하셨어요. 총 7번의 기회가 있으니 천천히 도전해보세요~\r\n\r\n#e파티원들이 " + okk + " 개의 발판에 올바르게 올라섰군요.#n");
                cm.dispose();
            }
        }
        cm.dispose();
    } else if (nFieldId == 920010300) {
        //창고
        var stage2 = em.getProperty("stage2clear");
        if (stage2 == null || !stage2.equals("clear")) {
            if (cm.isLeader() && stage2 == null) {
                em.setProperty("stage2clear", "s");
            } else if (cm.isLeader()) {
                if (cm.haveItem(4001045, 1)) {
                    cm.sendOk("훌륭해요! #b#t4001045##k을 찾아오셨군요!");
                    clear();
                    em.setProperty("stage2clear", "clear");
                    cm.gainPartyExpPQ(7500, "orbispq", 70);
                    cm.dispose();
                    return;
                } else {
                    cm.sendOk("#b#t4001045##k 을 찾아 제게 가져오시면 된답니다.");
                    cm.dispose();
                    return;
                }
            }
            cm.sendOk("이곳은 여신의 탑의 창고입니다. 하지만 지금은 샐리온의 소굴이 되고 말았답니다. 샐리온은 #b#t4001045##k을 가지고 다니고 있답니다. 샐리온을 처치하시다가 #b#t4001045##k을 찾아 제게 가져 오시면 된답니다!")
            cm.dispose();
        } else {
            cm.sendOk("여러분은 이 방을 훌륭하게 클리어 하셨습니다. 다음 방으로 이동해 주세요.");
            cm.dispose();
            return;
        }
    } else if (nFieldId == 920010600) {
        //라운지
        var stage5 = em.getProperty("stage5clear");
        if (stage5 == null || !stage5.equals("clear")) {
            if (cm.isLeader() && stage5 == null) {
                em.setProperty("stage5clear", "s");
            } else if (cm.isLeader()) {
                if (cm.haveItem(4001052, 40) && cm.canHold(4001048)) {
                    cm.removeAll(4001052);
                    cm.gainItem(4001048, 1);
                    cm.sendOk("훌륭해요! #b#t4001052##k을 40개 찾아오셨군요!");
                    clear();
                    em.setProperty("stage5clear", "clear");
                    cm.gainPartyExpPQ(7500, "orbispq", 70);
                    cm.dispose();
                    return;
                } else {
                    cm.sendOk("#b#t4001052##k 을 40개 찾아 제게 가져오시면 된답니다. 혹은 인벤토리 공간이 부족한건 아닌지 확인해 주세요.");
                    cm.dispose();
                    return;
                }
            }
            cm.sendOk("이곳은 여신의 탑의 손님들이 머물던 숙박실 입니다. 여러분은 40개의 #b#t4001052##k을 모아 제게 가져오시면 됩니다. 그럼 행운을 빌어요!");
            cm.dispose();
        } else {
            cm.sendOk("여러분은 이 방을 훌륭하게 클리어 하셨습니다. 다음 방으로 이동해 주세요.");
            cm.dispose();
            return;
        }
    } else if (nFieldId == 920010700) {
        //올라가는 길
        var stage6 = em.getProperty("stage6clear");
        if (stage6 == null || !stage6.equals("clear")) {
            if (cm.isLeader() && stage6 == null) {
                em.setProperty("stage6clear", "s");
                //레버
                var sh = cm.shuffle("11000");
                em.setProperty("stage6_ans", sh + "");
            } else if (cm.isLeader()) {
                var v1 = cm.getPlayer().getMap().getReactorByName("1").getState();
                var v2 = cm.getPlayer().getMap().getReactorByName("2").getState();
                var v3 = cm.getPlayer().getMap().getReactorByName("3").getState();
                var v4 = cm.getPlayer().getMap().getReactorByName("4").getState();
                var v5 = cm.getPlayer().getMap().getReactorByName("5").getState();
                var curans = "" + v1 + v2 + v3 + v4 + v5;
                //                cm.playerMessage("답안지 : " + curans + " / 정답 : " + em.getProperty("stage6_ans"));
                if ((curans).equals(em.getProperty("stage6_ans"))) {
                    cm.getPlayer().getMap().getReactorById(2002013).forceHitReactor(1);
                    cm.sendOk("축하합니다. 정답 레버를 찾으셨군요! 나타난 상자에서 여신의 조각상 조각을 회수해 주세요~");
                    clear();
                    em.setProperty("stage6clear", "clear");
                    cm.gainPartyExpPQ(7500, "orbispq", 70);
                    cm.dispose();
                    return;
                } else {
                    cm.sendOk("정답 레버가 아닙니다. 다시 한번 시도해 보세요.");
                    cm.dispose();
                    return;
                }
                
            }
            cm.sendOk("이곳은 여신의 탑의 꼭대기로 올라가는 곳입니다. 맵 위쪽에 문을 제어하는 다섯개의 레버가 있습니다. 레버 중 두개의 레버만 문을 제어하는 레버이니 레버를 두개 당기신 후 제게 오시면 정답인지 아닌지 확인해 드리겠습니다. 그럼 힘내주세요! ");
            cm.dispose();
        } else {
            cm.sendOk("여러분은 이 방을 훌륭하게 클리어 하셨습니다. 다음 방으로 이동해 주세요.");
            cm.dispose();
            return;
        }
    } else if (nFieldId == 920010200) {
        //산책로
        var stage1 = em.getProperty("stage1clear");
        if (stage1 == null || !stage1.equals("clear")) {
            if (cm.isLeader() && stage1 == null) {
                em.setProperty("stage1clear", "s");
            } else if (cm.isLeader()) {
                if (cm.haveItem(4001050, 30) && cm.canHold(4001044)) {
                    cm.removeAll(4001050);
                    cm.gainItem(4001044, 1);
                    cm.sendOk("훌륭해요! #b#t4001050##k을 30개 찾아오셨군요!");
                    clear();
                    em.setProperty("stage1clear", "clear");
                    cm.gainPartyExpPQ(7500, "orbispq", 70);
                    cm.dispose();
                    return;
                } else {
                    cm.sendOk("#b#t4001050##k 을 30개 찾아 제게 가져오시면 된답니다. 혹은 인벤토리 공간이 부족한건 아닌지 확인해 주세요.");
                    cm.dispose();
                    return;
                }
            }
            cm.sendOk("이곳은 여신의 탑의 산책로 입니다. 여신님은 이곳에서 산책을 즐기곤 하셨지요. 여러분은 #b#t4001050##k 30개를 모아서 제게 가져오시면 제가 조각들을 모아 #b#t4001044##k으로 바꿔드릴게요. 그럼 힘내주세요!");
            cm.dispose();
        } else {
            cm.sendOk("여러분은 이 방을 훌륭하게 클리어 하셨습니다. 다음 방으로 이동해 주세요.");
            cm.dispose();
            return;
        }
    }
    if (!cm.isLeader()) {
        cm.sendOk("파티장이 제게 말을 걸어 주어야 합니다.");
        cm.dispose();
        return;
    }
}
