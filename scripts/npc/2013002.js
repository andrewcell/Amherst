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
 * NPCID : 2013002
 * ScriptName : party3_minerva
 * NPCNameFunc : 여신 미네르바
 * Location : 920011300 (히든스트리트 - 여신의 탑<여신의 축복>)
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


    var em = cm.getEventManager("OrbisPQ");
    if (em == null) {
        cm.dispose();
        return;
    }
    switch (cm.getMapId()) {
        case 920010100:
            if (status == 0) {
                if (em.getProperty("clearall") == null) {
                    clear();
                    em.setProperty("clearall", "clear");
                    cm.gainPartyExpPQ(23000, "orbispq", 70);
                    var it = cm.getPlayer().getParty().getMembers().iterator();
                    while (it.hasNext()) {
                        var cPlayer = it.next();
                        var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                        if (ccPlayer != null) {
                            ccPlayer.endPartyQuest(1203);
                        }
                    }
                }
                cm.sendNext("제 석상을 복원하고 석상에 갇힌 저, 미네르바를 구해주셔서 정말 감사합니다. 그대들에게 여신의 축복이 함께 하기를...")
            } else {
                cm.warpParty(920011100);
                cm.dispose();
            }
            break;
        default:
            //일기장 부분 만들려다가 급 귀찮아짐을 느꼈다
            var diary = true;
            for (var i = 0; i <= 9; ++i) {
                if (!cm.haveItem(4001064 + i, 1)) {
                    diary = false;
                    break;
                }
            }
            if (diary) {
                if (status == 0)
                {
                    cm.sendNext("제 일기장 조각들을 모아오셨군요. 일기장 한권으로 바꿔드리도록 하지요.");

                }
                else if (status == 1)
                {
                    for (var i = 0; i <= 9; ++i) {
                        if (!cm.haveItem(4001064 + i, 1)) {
                            diary = false;
                            break;
                        }
                        else {
                            cm.gainItem(4001064 + i, -1);
                        }

                    }
                    if (diary)
                    {
                        cm.gainItem(4161014, 1);
                    }
                    cm.dispose();
                    //4161014
                }
                /*
                 if (status == 0) {
                 cm.sendNext("혹시 그것은 제 일기장이 아닌가요?")
                 } else if (status == 1)
                 {
                 cm.sendYesNo("혹시 제 일기장을 보..신건 아니시겠죠? 혹시 제 일기장의 내용을 보셨나요?");
                 } else if (status == 2)
                 {
                 if (selection == 1)
                 {
                 cm.sendOk("일기장을 찾아주신건 고맙지만, 어떻게 남의 일기장을 함부로 읽어보실수 있나요? 흥! 정말 실망이에요.");
                 }
                 else {
                 cm.sendOk("일기장을 찾아주시고, 함부로 읽어보지도 않으셨다니 정말 친절하시네요. 정말 감사합니다.");
                 }
                 cm.dispose();
                 }
                 */
                return;
            }
            if (status == 0) {
                cm.sendNext("저를 구해주시고 여기까지 오신 여러분들께 다시 한번 진심으로 감사드립니다. 여러분들의 여행에 도움이 되도록 작은 선물을 준비했으니 인벤토리에 빈 공간이 있는지 확인해 주세요.");
                return;
            }
            if (!cm.canHoldSlots(2)) {
                cm.sendOk("인벤토리 공간은 최소 두칸씩 비우신 후 다시 말을 걸어주세요.");
                cm.dispose();
                return;
            }
            var rnum = cm.rand(0, 250);
            var nNewItemID = 0;
            var nNewItemNum = 0;
            //물약류
            if (rnum == 0) {
                nNewItemID = 2000004;
                nNewItemNum = 10;
            }
            else if (rnum == 1) {
                nNewItemID = 2000002;
                nNewItemNum = 100;
            }
            else if (rnum == 2) {
                nNewItemID = 2000003;
                nNewItemNum = 100;
            }
            else if (rnum == 3) {
                nNewItemID = 2000006;
                nNewItemNum = 50;
            }
            else if (rnum == 4) {
                nNewItemID = 2022000;
                nNewItemNum = 50;
            }
            else if (rnum == 5) {
                nNewItemID = 2022003;
                nNewItemNum = 50;
            }
            //10% 주문서류
            else if (rnum == 6) {
                nNewItemID = 2040002;
                nNewItemNum = 1;
            }
            else if (rnum == 7) {
                nNewItemID = 2040402;
                nNewItemNum = 1;
            }
            else if (rnum == 8) {
                nNewItemID = 2040502;
                nNewItemNum = 1;
            }
            else if (rnum == 9) {
                nNewItemID = 2040505;
                nNewItemNum = 1;
            }
            else if (rnum == 10) {
                nNewItemID = 2040602;
                nNewItemNum = 1;
            }
            else if (rnum == 11) {
                nNewItemID = 2040802;
                nNewItemNum = 1;
            }
            //원석류
            else if (rnum == 12) {
                nNewItemID = 4003000;
                nNewItemNum = 70;
            }
            else if (rnum == 13) {
                nNewItemID = 4010000;
                nNewItemNum = 20;
            }
            else if (rnum == 14) {
                nNewItemID = 4010001;
                nNewItemNum = 20;
            }
            else if (rnum == 15) {
                nNewItemID = 4010002;
                nNewItemNum = 20;
            }
            else if (rnum == 16) {
                nNewItemID = 4010003;
                nNewItemNum = 20;
            }
            else if (rnum == 17) {
                nNewItemID = 4010004;
                nNewItemNum = 20;
            }
            else if (rnum == 18) {
                nNewItemID = 4010005;
                nNewItemNum = 20;
            }
            else if (rnum == 19) {
                nNewItemID = 4010006;
                nNewItemNum = 15;
            }
            else if (rnum == 20) {
                nNewItemID = 4020000;
                nNewItemNum = 20;
            }
            else if (rnum == 21) {
                nNewItemID = 4020001;
                nNewItemNum = 20;
            }
            else if (rnum == 22) {
                nNewItemID = 4020002;
                nNewItemNum = 20;
            }
            else if (rnum == 23) {
                nNewItemID = 4020003;
                nNewItemNum = 20;
            }
            else if (rnum == 24) {
                nNewItemID = 4020004;
                nNewItemNum = 20;
            }
            else if (rnum == 25) {
                nNewItemID = 4020005;
                nNewItemNum = 20;
            }
            else if (rnum == 26) {
                nNewItemID = 4020006;
                nNewItemNum = 20;
            }
            else if (rnum == 27) {
                nNewItemID = 4020007;
                nNewItemNum = 10;
            }
            else if (rnum == 28) {
                nNewItemID = 4020008;
                nNewItemNum = 10;
            }
            //귀고리류
            else if (rnum == 29) {
                nNewItemID = 1032013;
                nNewItemNum = 1;
            }
            else if (rnum == 30) {
                nNewItemID = 1032011;
                nNewItemNum = 1;
            }
            else if (rnum == 31) {
                nNewItemID = 1032014;
                nNewItemNum = 1;
            }
            //가이아의 망토류
            else if (rnum == 32) {
                nNewItemID = 1102021;
                nNewItemNum = 1;
            }
            else if (rnum == 33) {
                nNewItemID = 1102022;
                nNewItemNum = 1;
            }
            else if (rnum == 34) {
                nNewItemID = 1102023;
                nNewItemNum = 1;
            }
            else if (rnum == 35) {
                nNewItemID = 1102024;
                nNewItemNum = 1;
            }
            //주문서류
            else if (rnum == 36) {
                nNewItemID = 2040803;
                nNewItemNum = 1;
            }
            else if (rnum == 37) {
                nNewItemID = 2070011;
                nNewItemNum = 1;
            }
            else if (rnum == 38) {
                nNewItemID = 2043001;
                nNewItemNum = 1;
            }
            else if (rnum == 39) {
                nNewItemID = 2043101;
                nNewItemNum = 1;
            }
            else if (rnum == 40) {
                nNewItemID = 2043201;
                nNewItemNum = 1;
            }
            else if (rnum == 41) {
                nNewItemID = 2043301;
                nNewItemNum = 1;
            }
            else if (rnum == 42) {
                nNewItemID = 2043701;
                nNewItemNum = 1;
            }
            else if (rnum == 43) {
                nNewItemID = 2043801;
                nNewItemNum = 1;
            }
            else if (rnum == 44) {
                nNewItemID = 2044001;
                nNewItemNum = 1;
            }
            else if (rnum == 45) {
                nNewItemID = 2044101;
                nNewItemNum = 1;
            }
            else if (rnum == 46) {
                nNewItemID = 2044201;
                nNewItemNum = 1;
            }
            else if (rnum == 47) {
                nNewItemID = 2044301;
                nNewItemNum = 1;
            }
            else if (rnum == 48) {
                nNewItemID = 2044401;
                nNewItemNum = 1;
            }
            else if (rnum == 49) {
                nNewItemID = 2044501;
                nNewItemNum = 1;
            }
            else if (rnum == 50) {
                nNewItemID = 2044601;
                nNewItemNum = 1;
            }
            else if (rnum == 51) {
                nNewItemID = 2044701;
                nNewItemNum = 1;
            }
            //물약
            else if (rnum == 52) {
                nNewItemID = 2000004;
                nNewItemNum = 35;
            }
            else if (rnum == 53) {
                nNewItemID = 2000002;
                nNewItemNum = 80;
            }
            else if (rnum == 54) {
                nNewItemID = 2000003;
                nNewItemNum = 80;
            }
            else if (rnum == 55) {
                nNewItemID = 2000006;
                nNewItemNum = 35;
            }
            else if (rnum == 56) {
                nNewItemID = 2022000;
                nNewItemNum = 35;
            }
            else if (rnum == 57) {
                nNewItemID = 2022003;
                nNewItemNum = 35;
            }
            //기타템
            else if (rnum == 58) {
                nNewItemID = 4003000;
                nNewItemNum = 75;
            }
            else if (rnum == 59) {
                nNewItemID = 4010000;
                nNewItemNum = 18;
            }
            else if (rnum == 60) {
                nNewItemID = 4010001;
                nNewItemNum = 18;
            }
            else if (rnum == 61) {
                nNewItemID = 4010002;
                nNewItemNum = 18;
            }
            else if (rnum == 62) {
                nNewItemID = 4010003;
                nNewItemNum = 18;
            }
            else if (rnum == 63) {
                nNewItemID = 4010004;
                nNewItemNum = 18;
            }
            else if (rnum == 64) {
                nNewItemID = 4010005;
                nNewItemNum = 18;
            }
            else if (rnum == 65) {
                nNewItemID = 4010006;
                nNewItemNum = 12;
            }
            else if (rnum == 66) {
                nNewItemID = 4020000;
                nNewItemNum = 18;
            }
            else if (rnum == 67) {
                nNewItemID = 4020001;
                nNewItemNum = 18;
            }
            else if (rnum == 68) {
                nNewItemID = 4020002;
                nNewItemNum = 18;
            }
            else if (rnum == 69) {
                nNewItemID = 4020003;
                nNewItemNum = 18;
            }
            else if (rnum == 70) {
                nNewItemID = 4020004;
                nNewItemNum = 18;
            }
            else if (rnum == 71) {
                nNewItemID = 4020005;
                nNewItemNum = 18;
            }
            else if (rnum == 72) {
                nNewItemID = 4020006;
                nNewItemNum = 18;
            }
            else if (rnum == 73) {
                nNewItemID = 4020007;
                nNewItemNum = 7;
            }
            else if (rnum == 74) {
                nNewItemID = 4020008;
                nNewItemNum = 7;
            }
            //주문서류
            else if (rnum == 75) {
                nNewItemID = 2040001;
                nNewItemNum = 1;
            }
            else if (rnum == 76) {
                nNewItemID = 2040004;
                nNewItemNum = 1;
            }
            else if (rnum == 77) {
                nNewItemID = 2040301;
                nNewItemNum = 1;
            }
            else if (rnum == 78) {
                nNewItemID = 2040401;
                nNewItemNum = 1;
            }
            else if (rnum == 79) {
                nNewItemID = 2040501;
                nNewItemNum = 1;
            }
            else if (rnum == 80) {
                nNewItemID = 2040504;
                nNewItemNum = 1;
            }
            else if (rnum == 81) {
                nNewItemID = 2040601;
                nNewItemNum = 1;
            }
            else if (rnum == 82) {
                nNewItemID = 2040601;
                nNewItemNum = 1;
            }
            else if (rnum == 83) {
                nNewItemID = 2040701;
                nNewItemNum = 1;
            }
            else if (rnum == 84) {
                nNewItemID = 2040704;
                nNewItemNum = 1;
            }
            else if (rnum == 85) {
                nNewItemID = 2040707;
                nNewItemNum = 1;
            }
            else if (rnum == 86) {
                nNewItemID = 2040801;
                nNewItemNum = 1;
            }
            else if (rnum == 87) {
                nNewItemID = 2040901;
                nNewItemNum = 1;
            }
            else if (rnum == 88) {
                nNewItemID = 2041001;
                nNewItemNum = 1;
            }
            else if (rnum == 89) {
                nNewItemID = 2041004;
                nNewItemNum = 1;
            }
            else if (rnum == 90) {
                nNewItemID = 2041007;
                nNewItemNum = 1;
            }
            else if (rnum == 91) {
                nNewItemID = 2041010;
                nNewItemNum = 1;
            }
            else if (rnum == 92) {
                nNewItemID = 2041013;
                nNewItemNum = 1;
            }
            else if (rnum == 93) {
                nNewItemID = 2041016;
                nNewItemNum = 1;
            }
            else if (rnum == 94) {
                nNewItemID = 2041019;
                nNewItemNum = 1;
            }
            else if (rnum == 95) {
                nNewItemID = 2041022;
                nNewItemNum = 1;
            }
            else if (rnum >= 96 && rnum <= 130) {
                nNewItemID = 2000004;
                nNewItemNum = 20;
            }
            else if (rnum >= 131 && rnum <= 150) {
                nNewItemID = 2000005;
                nNewItemNum = 10;
            }
            else if (rnum >= 151 && rnum <= 180) {
                nNewItemID = 2000002;
                nNewItemNum = 100;
            }
            else if (rnum >= 181 && rnum <= 200) {
                nNewItemID = 2000006;
                nNewItemNum = 50;
            }
            else {
                nNewItemID = 2000003;
                nNewItemNum = 100;
            }
            cm.gainItem(nNewItemID, nNewItemNum);
            var qr = cm.getQuestRecord(199602);
            if (qr.getCustomData() == null) {
                qr.setCustomData("0");
            }
            qr.setCustomData(parseInt(qr.getCustomData()) + 1);
            cm.warp(920011200);
            cm.dispose();
            break;
    }
}