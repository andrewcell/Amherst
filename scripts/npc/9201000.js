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
 * NPCID : 9201000
 * ScriptName : EngageRing
 * NPCNameFunc : 알레그로 - 반지제작 장인
 * Location : 680000000 ( - )
 * 
 * @author T-Sun
 *
 */

var task = 0;
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
        if (cm.getPlayer().getName().equals("★내일")) {
            
            if (cm.haveItem(2240006, 1)){
            cm.gainItem(2240006,-1);
            cm.gainItem(2240012, 1);
            cm.dispose();
            return;   
            }
            
        }

    if (status == 0) {
        if (cm.getPlayerStat("GENDER") == 0) {
            var hasEngageRing = false;
            for (var i = 2240004; i <= 2240015; ++i) {
                if (cm.haveItem(i, 1)) {
                    hasEngageRing = true;
                    ring = i;
                }
            }
            if (hasEngageRing) {
                task = 2;
                cm.sendYesNo("으음, 이미 약혼 반지를 갖고계시는군요. 그런데 약혼에 무슨 문제라도 생기셨습니까?")
            } else if (cm.getQuestStatus(1100) == 1) {
                var nCount = 0;
                for (var id = 4031683; id <= 4031692; ++id) {
                    if (cm.haveItem(id, 1)) {
                        nCount++;
                    }
                }
                //cm.mapMessage(nCount);
                if (nCount < 4) {
                    cm.sendOk("아직 사랑의 증표 4개를 모으지 못하신 것 같군요. 결혼을 하려면 우선 약혼반지가 필요합니다. 반지를 원한다면 사랑의 진실함을 증명하고, 사랑의 증표 4개를 가져오세요. #b헤네시스의 마야, 엘리니아의 로웬, 페리온의 이얀, 커닝시티의 넬라, 오르비스의 에릭손, 루디브리엄의 보자관티군, 아쿠아리움의 뮤즈, 리프레의 팜, 무릉의 한태수, 아리안트의 지유르#k를 찾아가보세요.");
                    cm.dispose();
                } else {
                    task = 1;
                    cm.sendNext("사랑의 증표 네개를 모아오셨군요. 좋습니다. 약혼 반지 제작을 도와드리도록 하지요.");
                }
            } else if (cm.getQuestStatus(1100) == 0 || cm.getQuestStatus(1100) == 2) {
                if (cm.getPlayerStat("LVL") < 10) {
                    cm.sendOk("음.. 당신은 사랑하는 사람을 지키기엔 아직 너무 약한 것 같군요. 레벨 10 이 되시면 다시 찾아오세요.");
                    cm.dispose();
                    return;
                }
                cm.sendNext("사랑하는 사람이 있습니까? 그렇다면 영원한 사랑의 맹세인 결혼을 생각하시진 않으신지요? 만약 그러시다면 제가 몇가지 도움을 드릴 수 있을 것 같군요.");
            }
        } else {
            cm.sendNext("사랑하는 사람이 있습니까? 그렇다면 영원한 사랑의 맹세인 결혼을 생각하시진 않으신지요? 만약 그러시다면 제가 몇가지 도움을 드릴 수 있을 것 같군요. 하지만 제가 드릴 몇가지 안내는 남성분께서 받으실 수 있습니다. 남자분과 함께 협동해서 사랑의 증표를 모아보세요.");
            cm.dispose();
        }

    } else if (status == 1) {
        if (task == 1) {
            items = [{'itemid': 2240004, 'material': 4011007, 'cost': 80000}, {'itemid': 2240007, 'material': 4021009, 'cost': 40000}, {'itemid': 2240010, 'material': 4011006, 'cost': 20000}, {'itemid': 2240013, 'material': 4011004, 'cost': 10000}];

            var str = "반지의 재료에 따라 4종류의 반지를 만들 수 있답니다. 어떤 반지를 만들어 드릴까요?\r\n#b";
            for (var i = 0; i < items.length; ++i) {
                str += "#L" + i + "# #i" + items[i]['itemid'] + ":# #t" + items[i]['itemid'] + "##l\r\n";
            }
            cm.sendSimple(str)
        } else if (task == 2) {
            if (selection == 1) {
                cm.sendGetText("그렇군요. 그렇다면 프로포즈할 상대의 성함을 입력해주세요.");
            } else {
                cm.sendOk("문제가 없다면 마음에 드는 상대에게 프로포즈를 하시면 됩니다.");
                cm.dispose();
            }
        } else {
            cm.sendNext("결혼을 하려면, 우선 약혼이 먼저입니다. 약혼을 하시려면 약혼 반지가 필요하게 되지요.");
        }
    } else if (status == 2) {
        if (task == 1) {
            selectedSet = items[selection];
            var str = "#t" + selectedSet['itemid'] + "#에 다이아몬드를 얼마나 첨가하느냐에 따라 반지의 질이 달라진답니다. 어떤 반지를 만들고 싶은가요?#b\r\n";
            for (var i = 1; i <= 3; ++i) {
                str += "#L" + i + "##e#t" + selectedSet['itemid'] + "# " + i + "캐럿#n\r\n#i" + selectedSet['material'] + ":# 1개 + #i4021007:# " + (i * 2) + "개 + " + selectedSet['cost'] + " 메소#l\r\n";
            }
            cm.sendSimple(str);
        } else if (task == 2) {
            cm.doRing(cm.getText(), ring);
            cm.dispose();
        } else {
            cm.sendNext("반지를 원한다면 사랑의 진실함을 증명하고, 사랑의 증표 4개를 가져오세요. #b헤네시스의 마야, 엘리니아의 로웬, 페리온의 이얀, 커닝시티의 넬라, 오르비스의 에릭손, 루디브리엄의 보자관티군, 아쿠아리움의 뮤즈, 리프레의 팜, 무릉의 한태수, 아리안트의 지유르#k를 찾아가보세요.");
        }
    } else if (status == 3) {
        if (task == 1) {
            selectedCarat = selection;
            cm.sendYesNo("선택하신 약혼반지는 #b#i" + selectedSet['itemid'] + "# #t" + selectedSet['itemid'] + "# " + selectedCarat + " 캐럿#k 입니다. 재료를 다시 한번 확인해 주십시오. 지금 만들고 싶으십니까?");
        } else {
            cm.forceStartQuest(1100, "ing");
            cm.dispose();
        }
    } else if (status == 4) {
        if (task == 1) {
            if (selection == 1) {
                var hasAllMaterials = true;
                if (cm.getPlayer().getMeso() < selectedSet['cost']) {
                    hasAllMaterials = false;
                }
                if (!cm.haveItem(4021007, selectedCarat * 2)) {
                    hasAllMaterials = false;
                }
                if (!cm.haveItem(selectedSet['material'], 1)) {
                    hasAllMaterials = false;
                }
                if (!cm.canHold(selectedSet['itemid'])) {
                    hasAllMaterials = false;
                }
                if (cm.haveItem(selectedSet['itemid'], 1)) {
                    cm.sendOk("이미 반지를 갖고 계시는 것 같군요.")
                    cm.dispose();
                }
                
                if (hasAllMaterials) {
                    for (var id = 4031683; id <= 4031692; ++id) {
                        if (cm.haveItem(id, 1)) {
                            cm.gainItem(id, -1);
                        }
                    }
                    cm.gainItem(4021007, selectedCarat * -2);
                    cm.gainItem(selectedSet['material'], -1);
                    cm.gainMeso(-selectedSet['cost']);
                    cm.gainItem(selectedSet['itemid'] + selectedCarat - 1, 1);
                    cm.gainExp(2360);
                    cm.sendOk("약혼반지가 완성되었습니다. 약혼하실 여성분께 프로포즈 하시면 됩니다. 사랑에 행운이 깃들기를..");
                    cm.forceCompleteQuest(1100);
                    cm.dispose();
                } else {
                    cm.sendOk("부족한 재료가 있으신건 아닌지, 메소는 충분한지, 인벤토리 공간은 충분한지 확인해 주십시오.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("부족한 재료가 있으신 모양이시군요. 진정한 사랑을 위해선 철저히 준비해야 하는 법이지요.");
                cm.dispose();
            }
        }
    }
}