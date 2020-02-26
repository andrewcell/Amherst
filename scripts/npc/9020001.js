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
 * NPCID : 9020001
 * ScriptName : party1_play
 * NPCNameFunc : 클로토
 * Location : 103000802 (히든스트리트 - 첫번째동행<3관문>)
 * Location : 103000803 (히든스트리트 - 첫번째동행<4관문>)
 * Location : 103000800 (히든스트리트 - 첫번째동행<1관문>)
 * Location : 103000801 (히든스트리트 - 첫번째동행<2관문>)
 * Location : 103000804 (히든스트리트 - 첫번째동행<마지막관문>)
 * 
 * @author T-Sun
 *
 */

function clear() {
    cm.showEffect(true, "quest/party/clear");
    cm.playSound(true, "Party1/Clear");
    cm.environmentChange(true, "gate");
}
function fail() {
    cm.showEffect(true, "quest/party/wrong_kor");
    cm.playSound(true, "Party1/Failed");
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
    nFieldId = cm.getMapId();
    eim = cm.getPlayer().getEventInstance();
    if (eim == null) {
        cm.warp(103000890);
        cm.dispose();
        return;
    }
    if (eim.getProperty("stage") == null) {
        eim.setProperty("stage", "1");
    }
    var curstage = parseInt(eim.getProperty("stage"));
    if (curstage > ((nFieldId % 10) + 1) && nFieldId != 103000804) {
        cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다. 서둘러 주세요.");
        cm.dispose();
        return;
    } else if (nFieldId == 103000804 && curstage > ((nFieldId % 10) + 1)) {
        if (!cm.canHoldSlots(1)) {
            cm.sendOk("인벤토리 공간을 확보하신 후 다시 말을 걸어주세요.");
            cm.dispose();
            return;
        }
        
        var rnum = cm.rand( 0, 39 ); 
        var nNewItemID = 0; 
        var nNewItemNum = 0; 
        if ( rnum == 0 ) { 
            nNewItemID = 2000004; 
            nNewItemNum = 5; 
        } 
        else if ( rnum == 1 ) { 
            nNewItemID = 2000001; 
            nNewItemNum = 100; 
        } 
        else if ( rnum == 2 ) { 
            nNewItemID = 2000002; 
            nNewItemNum = 70; 
        } 
        else if ( rnum == 3 ) { 
            nNewItemID = 2000003; 
            nNewItemNum = 100; 
        } 
        else if ( rnum == 4 ) { 
            nNewItemID = 2000006; 
            nNewItemNum = 50; 
        } 
        else if ( rnum == 5 ) { 
            nNewItemID = 2022000; 
            nNewItemNum = 15; 
        } 
        else if ( rnum == 6 ) { 
            nNewItemID = 2022003; 
            nNewItemNum = 15; 
        } 
        else if ( rnum == 7 ) { 
            nNewItemID = 2040002; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 8 ) { 
            nNewItemID = 2040402; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 9 ) { 
            nNewItemID = 2040502; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 10 ) { 
            nNewItemID = 2040505; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 11 ) { 
            nNewItemID = 2040602; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 12 ) { 
            nNewItemID = 2040802; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 13 ) { 
            nNewItemID = 4003000; 
            nNewItemNum = 30; 
        } 
        else if ( rnum == 14 ) { 
            nNewItemID = 4010000; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 15 ) { 
            nNewItemID = 4010001; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 16 ) { 
            nNewItemID = 4010002; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 17 ) { 
            nNewItemID = 4010003; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 18 ) { 
            nNewItemID = 4010004; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 19 ) { 
            nNewItemID = 4010005; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 20 ) { 
            nNewItemID = 4010006; 
            nNewItemNum = 5; 
        } 
        else if ( rnum == 21 ) { 
            nNewItemID = 4020000; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 22 ) { 
            nNewItemID = 4020001; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 23 ) { 
            nNewItemID = 4020002; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 24 ) { 
            nNewItemID = 4020003; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 25 ) { 
            nNewItemID = 4020004; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 26 ) { 
            nNewItemID = 4020005; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 27 ) { 
            nNewItemID = 4020006; 
            nNewItemNum = 8; 
        } 
        else if ( rnum == 28 ) { 
            nNewItemID = 4020007; 
            nNewItemNum = 3; 
        } 
        else if ( rnum == 29 ) { 
            nNewItemID = 4020008; 
            nNewItemNum = 3; 
        } 
        else if ( rnum == 30 ) { 
            nNewItemID = 1032002; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 31 ) { 
            nNewItemID = 1032004; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 32 ) { 
            nNewItemID = 1032005; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 33 ) { 
            nNewItemID = 1032006; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 34 ) { 
            nNewItemID = 1032007; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 35 ) { 
            nNewItemID = 1032009; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 36 ) { 
            nNewItemID = 1032010; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 37 ) { 
            nNewItemID = 1002026; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 38 ) { 
            nNewItemID = 1002089; 
            nNewItemNum = 1; 
        } 
        else if ( rnum == 39 ) { 
            nNewItemID = 1002090; 
            nNewItemNum = 1; 
        } 
        cm.gainItem(nNewItemID, nNewItemNum);
        cm.warp(103000805);
        cm.dispose();
        return;
    }
    if (nFieldId == 103000800) {
        quests = [
        {
            'question' : "문제입니다. #r메이플스토리에서 전사 1차 전직을 하기 위한 최소 레벨#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 10
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 전사 1차 전직을 하기 위한 최소 힘#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 35
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 마법사 1차 전직을 하기 위한 최소 지력#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 20
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 궁수 1차 전직을 하기 위한 최소 민첩성#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 25
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 도적 1차 전직을 하기 위한 최소 민첩성#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 25
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 2차 전직을 하기 위한 최소 레벨#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 30
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 궁수 1차 전직을 하기 위한 최소 레벨#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 10
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 레벨1에서 레벨2가 되기 위해 필요한 경험치량#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 15
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 도적 1차 전직을 하기 위한 최소 레벨#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 10
        },

        {
            'question' : "문제입니다. #r메이플스토리에서 마법사 1차 전직을 하기 위한 최소 레벨#k 만큼만 쿠폰을 모아오세요.", 
            'answer' : 8
        }
        ]
        if (status == 0) {
            if (cm.isLeader()) {
                if (eim.getProperty("stage1p") == null) {
                    cm.sendOk("안녕하세요. 첫번째 스테이지에 오신 것을 환영합니다. 주변을 둘러보면 리게이터가 돌아다니고 있는 것을 볼 수 있을 겁니다. 리게이터는 쓰러뜨리면 꼭 한개의 쿠폰을 떨어뜨립니다. 파티장을 제외한 파티원 전원은 각각 저에게 말을 걸어 문제를 받고 문제의 답에 해당하는 수 만큼 리게이터가 주는 쿠폰을 모아와야 합니다. \r\n만일 정답만큼 쿠폰을 모아왔다면 저는 그 파티원에게 #b통행권#k을 드리게 됩니다. 파티장을 제외한 모든 파티원이 통행권을 얻어 파티장에게 넘겨주면 파티장이 그렇게 모은 #b통행권#k을 저에게 넘겨줌으로써 스테이지를 클리어 하게 됩니다. 되도록 빨리 해결해야 더 많은 스테이지에 도전할 수 있으므로 서둘러 주세요. 그럼 행운을 빕니다.");
                    eim.setProperty("stage1p", "1");
                    cm.dispose();
                } else {
                    var psize = eim.getPlayers().size() - 1;
                    if (cm.haveItem(4001008, psize)) {
                        clear();
                        cm.gainPartyExpPQ(100, "", 70);
                        cm.removeAll(4001008);
                        eim.setProperty("stage", curstage + 1);
                        cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다. 서둘러 주세요.");
                        cm.dispose();
                    } else {
                        cm.sendOk("죄송합니다. 통행증의 개수가 부족합니다. 파티장을 제외한 파티원의 인원수 만큼의 통행증이 필요합니다. 문제를 해결하고, 얻는 통행증을 제게 주시기 바랍니다.");
                        cm.dispose();
                    }
                }
            } else {
                val = eim.getProperty("stage1_"+cm.getPlayer().getId());
                if (val == null) {
                    eim.setProperty("stage1_"+cm.getPlayer().getId(), cm.rand(0, quests.length-1));
                    val = eim.getProperty("stage1_"+cm.getPlayer().getId());
                    cm.sendNext("안녕하세요. 첫번째 스테이지에 오신 것을 환영합니다. 주변을 둘러보면 리게이터가 돌아다니고 있는 것을 볼 수 있을 겁니다. 리게이터는 쓰러뜨리면 꼭 한개의 쿠폰을 떨어뜨립니다. 파티장을 제외한 파티원 전원은 각각 저에게 말을 걸어 문제를 받고 문제의 답에 해당하는 수 만큼 리게이터가 주는 쿠폰을 모아와야 합니다. \r\n만일 정답만큼 쿠폰을 모아왔다면 저는 그 파티원에게 #b통행권#k을 드리게 됩니다. 파티장을 제외한 모든 파티원이 통행권을 얻어 파티장에게 넘겨주면 파티장이 그렇게 모은 #b통행권#k을 저에게 넘겨줌으로써 스테이지를 클리어 하게 됩니다. 되도록 빨리 해결해야 더 많은 스테이지에 도전할 수 있으므로 서둘러 주세요. 그럼 행운을 빕니다.");
                    return;
                }
                val = parseInt(val);
                if (val > quests.length) {
                    cm.sendOk("제가 드리는 문제를 훌륭히 완수하셨습니다. 다른 파티원이 문제를 해결할 때 까지 잠시만 기다려 주세요.")
                    cm.dispose();
                    return;
                }
                if (cm.itemQuantity(4001007) == quests[val]['answer']) {
                    if (cm.canHold(4001008)) {
                        eim.setProperty("stage1_"+cm.getPlayer().getId(), quests.length + 1);
                        cm.removeAll(4001007);
                        cm.gainItem(4001008, 1);
                        cm.sendOk("정답을 맞추셨습니다! 이 #b통행증#k을 파티장에게 건네주세요.");
                        cm.dispose();
                    } else {
                        cm.sendOk("인벤토리 공간이 부족합니다. 인벤토리 공간의 여유를 다시 확인해보세요.");
                        cm.dispose();
                        return;
                    }
                } else {
                    cm.sendOk("정답이 아닙니다.\r\n\r\n"+quests[val]['question']);
                    cm.dispose();
                }
            }
        } else if (status == 1) {
            cm.sendNext("여기, 리게이터를 잡고 개인적으로 제가 내 드리는 문제의 답 만큼의 #b쿠폰#k을 가져오시면 통행증으로 바꿔드립니다. 그것을 모아서 제게 가져다 주시기 바랍니다.");
        } else if (status == 2) {
            cm.sendOk(quests[val]['question']);
            cm.dispose();
        }
    } else if (nFieldId == 103000801) {
        //두번째 스테이지
        if (cm.isLeader()) {
            if (eim.getProperty("stage2r") == null) {
                cm.sendNext("두번째 스테이지에 대해 설명해 드리겠습니다. 옆에 밧줄들이 보일 것입니다. 이 밧줄들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 줄을 찾아 매달리면 됩니다.#k\r\n단, 줄 끝에 아슬아슬하게 매달리시지 말고 줄 가운데에 매달려 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3 명만 줄에 매달려 계셔야 있어야 합니다. 파티원이 줄에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
                eim.setProperty("stage2r", cm.shuffle("1110"));
                cm.dispose();
                return;
            }
            var answer = eim.getProperty("stage2r");
            var area1 = cm.getPlayer().getMap().getNumPlayersInArea(0);
            var area2 = cm.getPlayer().getMap().getNumPlayersInArea(1);
            var area3 = cm.getPlayer().getMap().getNumPlayersInArea(2);
            var area4 = cm.getPlayer().getMap().getNumPlayersInArea(3);
            if (area1 + area2 + area3 + area4 != 3 && !cm.getPlayer().isGM()) {
                cm.sendOk("아직 3개의 정답 줄을 찾지 못하신것 같군요. 줄 끝에 아슬아슬하게 매달리시지 말고 줄 가운데에 매달려 계셔야 정답 여부가 확인 가능합니다. 이점 주의해 주시기 바랍니다.");
                cm.dispose();
                return;
            }
            var pos = "" + area1 + area2 + area3 + area4;
            //Debug
            //            pos = answer;
            if (cm.getPlayer().isGM()) {
                pos = answer;
            }
            if (answer.equals(pos)) {
                clear();
                cm.gainPartyExpPQ(200, "", 70);
                eim.setProperty("stage", curstage + 1);
                cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다. 서둘러 주세요.");
            } else {
                fail();
            }
            cm.dispose();
        } else {
            cm.sendNext("두번째 스테이지에 대해 설명해 드리겠습니다. 옆에 밧줄들이 보일 것입니다. 이 밧줄들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 줄을 찾아 매달리면 됩니다.#k\r\n단, 줄 끝에 아슬아슬하게 매달리시지 말고 줄 가운데에 매달려 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3 명만 줄에 매달려 계셔야 있어야 합니다. 파티원이 줄에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
            cm.dispose();
        }
    } else if (nFieldId == 103000802) {
        //세번째 스테이지
        if (cm.isLeader()) {
            if (eim.getProperty("stage3r") == null) {
                cm.sendNext("세번째 스테이지에 대해 설명해 드리겠습니다. 옆에 나무 발판들이 보일 것입니다. 이 발판들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 발판을 찾아 올라서면 됩니다.#k\r\n단, 발판 끝에 아슬아슬하게 서계시지 말고 발판 가운데에 정확하게 서 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3명만 발판에 서계셔야 있어야 합니다. 파티원이 발판에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
                eim.setProperty("stage3r", cm.shuffle("11100"));
                cm.dispose();
                return;
            }
            var answer = eim.getProperty("stage3r");
            var area1 = cm.getPlayer().getMap().getNumPlayersInArea(0);
            var area2 = cm.getPlayer().getMap().getNumPlayersInArea(1);
            var area3 = cm.getPlayer().getMap().getNumPlayersInArea(2);
            var area4 = cm.getPlayer().getMap().getNumPlayersInArea(3);
            var area5 = cm.getPlayer().getMap().getNumPlayersInArea(4);
            if (area1 + area2 + area3 + area4  + area5 != 3 && !cm.getPlayer().isGM()) {
                cm.sendOk("아직 3개의 정답 발판을 찾지 못하신것 같군요. 발판 끝에 아슬아슬하게 서계시지 말고 발판 가운데에 정화히 서 계셔야 정답 여부가 확인 가능합니다. 이점 주의해 주시기 바랍니다.");
                cm.dispose();
                return;
            }
            var pos = "" + area1 + area2 + area3 + area4 + area5;
            //Debug
            //            pos = answer;
            if (cm.getPlayer().isGM()) {
                pos = answer;
            }
            if (answer.equals(pos)) {
                clear();
                cm.gainPartyExpPQ(400, "", 70);
                eim.setProperty("stage", curstage + 1);
                cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다. 서둘러 주세요.");
            } else {
                fail();
            }
            cm.dispose();
        } else {
            cm.sendNext("세번째 스테이지에 대해 설명해 드리겠습니다. 옆에 나무 발판들이 보일 것입니다. 이 발판들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 발판을 찾아 올라서면 됩니다.#k\r\n단, 발판 끝에 아슬아슬하게 서계시지 말고 발판 가운데에 정확하게 서 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3명만 발판에 서계셔야 있어야 합니다. 파티원이 발판에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
            cm.dispose();
        }
    } else if (nFieldId == 103000803) {
        //네번째 스테이지
        if (cm.isLeader()) {
            if (eim.getProperty("stage4r") == null) {
                cm.sendNext("네번째 스테이지에 대해 설명해 드리겠습니다. 옆에 나무통들이 보일 것입니다. 이 통들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 통을 찾아 올라서면 됩니다.#k\r\n단, 통 끝에 아슬아슬하게 서계시지 말고 통 가운데에 정확하게 서 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3명만 통 위에 서계셔야 있어야 합니다. 파티원이 통 위에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
                eim.setProperty("stage4r", cm.shuffle("111000"));
                cm.dispose();
                return;
            }
            var answer = eim.getProperty("stage4r");
            var area1 = cm.getPlayer().getMap().getNumPlayersInArea(0);
            var area2 = cm.getPlayer().getMap().getNumPlayersInArea(1);
            var area3 = cm.getPlayer().getMap().getNumPlayersInArea(2);
            var area4 = cm.getPlayer().getMap().getNumPlayersInArea(3);
            var area5 = cm.getPlayer().getMap().getNumPlayersInArea(4);
            var area6 = cm.getPlayer().getMap().getNumPlayersInArea(5);
            if (area1 + area2 + area3 + area4  + area5 + area6 != 3 && !cm.getPlayer().isGM()) {
                cm.sendOk("아직 3개의 정답 통을 찾지 못하신것 같군요. 통 끝에 아슬아슬하게 서계시지 말고 통 가운데에 정화히 서 계셔야 정답 여부가 확인 가능합니다. 이점 주의해 주시기 바랍니다.");
                cm.dispose();
                return;
            }
            var pos = "" + area1 + area2 + area3 + area4 + area5 + area6;
            //Debug
            //            pos = answer;
            if (cm.getPlayer().isGM()) {
                pos = answer;
            }
            if (answer.equals(pos)) {
                clear();
                cm.gainPartyExpPQ(800, "", 70);
                eim.setProperty("stage", curstage + 1);
                cm.sendOk("다음 스테이지로 통하는 포탈이 열렸습니다. 서둘러 주세요.");
            } else {
                fail();
            }
            cm.dispose();
        } else {
            cm.sendNext("네번째 스테이지에 대해 설명해 드리겠습니다. 옆에 나무통들이 보일 것입니다. 이 통들 중에서 #b3개가 다음 스테이지로 향하는 포탈#k과 통해 있습니다. 파티원 중에서 #b3 명이 정답 통을 찾아 올라서면 됩니다.#k\r\n단, 통 끝에 아슬아슬하게 서계시지 말고 통 가운데에 정확하게 서 계셔야 정답으로 인정되니 이점 주의해 주시기 바랍니다. 그리고 반드시 3명만 통 위에 서계셔야 있어야 합니다. 파티원이 통 위에 올라서면 파티장은 #b저를 더블클릭하여 정답인지 아닌지 확인#k해야 합니다. 그럼 힘내 주세요!");
            cm.dispose();
        }
    } else if (nFieldId == 103000804) {
        //마지막 관문
        if (cm.isLeader()) {
            if (eim.getProperty("stage4p") == null) {
                eim.setProperty("stage4p", "1");
                cm.sendOk("마지막 스테이지에 오신것을 환영합니다. 주위를 둘러보시면 몬스터가 보일겁니다. 그 몬스터를 잡고, 나온 통행증을 제게 가져다 주시기 바랍니다. 파티원들이 통행증을 먹으면, 파티장은 그것을 모아 제게 넘겨주시면 됩니다. 이 몬스터들은 친숙한 몬스터 일수도 있지만, 훨씬 더 강력하므로 조심해 주시기 바랍니다. 그리고 맨 아래층에는, 무시무시한 킹슬라임이 기다리고 있습니다. 부디 행운을 빕니다!");
                cm.dispose();
                return;
            }
            if (cm.haveItem(4001008, 10)) {
                clear();
                cm.gainPartyExpPQ(1500, "", 70);
                eim.setProperty("stage", curstage + 1);
                cm.removeAll(4001008);
                var it = cm.getPlayer().getParty().getMembers().iterator();
                while (it.hasNext()) {
                    var cPlayer = it.next();
                    var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                    if (ccPlayer != null) {
                        ccPlayer.endPartyQuest(1201);
                    }
                }
                cm.sendOk("모든 문제를 훌륭히 해결하셨습니다. 모든 스테이지를 클리어 하셨으므로 보너스 스테이지로 이동됩니다. 남은 시간동안 마음껏 사냥하실 수 있습니다. 하지만 중간에 나가고 싶으시면 NPC를 통해 밖으로 나가실 수 있습니다. 저에게 다시 말을 걸어 주시면 작은 보상을 드리도록 할게요.");
                cm.dispose();
            } else {
                cm.sendOk("아직 통행증 10장을 모으지 못하신 것 같군요. 몬스터들을 잡고 제게 통행증 10장을 가져다 주세요.");
                cm.dispose();
            }
        } else {
            cm.sendOk("마지막 스테이지에 오신것을 환영합니다. 주위를 둘러보시면 몬스터가 보일겁니다. 그 몬스터를 잡고, 나온 통행증을 제게 가져다 주시기 바랍니다. 파티원들이 통행증을 먹으면, 파티장은 그것을 모아 제게 넘겨주시면 됩니다. 이 몬스터들은 친숙한 몬스터 일수도 있지만, 훨씬 더 강력하므로 조심해 주시기 바랍니다. 그리고 맨 아래층에는, 무시무시한 킹슬라임이 기다리고 있습니다. 부디 행운을 빕니다!")
            cm.dispose();
            return;
        }
    }
}