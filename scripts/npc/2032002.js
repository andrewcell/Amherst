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
 * NPCID : 2032002
 * ScriptName : Zakum01
 * NPCNameFunc : 아우라
 * Location : 280010000 (아도비스의임무1 - 알려지지않은폐광)
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
        if (cm.getPlayer().getEventInstance().getProperty("clear") != null) {
            cm.sendOk("여러분은 제 임무를 훌륭히 완수하셨습니다. 제 오른쪽의 포탈을 통해 보상을 받고 나가실 수 있습니다.");
            cm.dispose();
            return;
        }
        cm.sendSimple("...#b\r\n#L0#여기서 무얼 해야 하죠?#l\r\n#L1#재료를 모아왔습니다.#l\r\n#L2#퀘스트를 포기하고 나갑니다.#l");
    } else if (status == 1) {
        selectedType = selection;
        if (selection == 0) {
            cm.sendNext("폐광 동굴을 조사하러 오신 분들이군요. 여러분들은 최종 목표인 자쿰던전의 보스를 만나기 위해 필요한 물건을 입수하셔야 합니다. 그 물건을 얻으려면 우선은 물건의 재료를 얻는 것이 우선이겠지요. 재료중에 하나인 #b불의 원석#k을 바로 이곳에서 얻을 수 있습니다. 물론 쉬운 일은 아니지만 말이죠.\r\n물론 모든 상자에 열쇠가 있는건 아닙니다. 생각치 못했던 일이 벌어질 수도 있으니 조심해야 하죠. 상자를 조사하다 보면 가끔 종이 문서가 나오는데 이것도 모아와 주시면 틀림없이 좋은 일이 있을 겁니다. 종이 문서는 30장 이상 모아오시면 됩니다. 제가 설명해 드릴수 있는건 여기까지군요.")
            cm.safeDispose();
        } else if (selection == 1) {
            if (!cm.haveItem(4001018)) { //documents
                if (!cm.isLeader()) {
                    cm.sendOk("파티장이 제게 말을 걸어 퀘스트를 완수할 수 있습니다.");
                    cm.dispose();
                    return;
                }
                cm.sendNext("#b#i4001018# #t4001018##k을 제게 가져오셔야 합니다. 어떻게 해야 하는지 모르겠다면 '여기서 무얼 해야 하죠?' 를 클릭하세요.")
                cm.safeDispose();
            } else {
                if (!cm.haveItem(4001015, 1)) {
                    cm.sendYesNo("#b불의 원석 1개#k는 무사히 가져오셨지만, #b종이 문서#k는 하나도 모으지 못하셨군요. 파티원들이 모으신 물건은 이게 전부가 맞습니까?");
                    scrolls = false;
                } else if (!cm.haveItem(4001015, 30)) { //documents
                    cm.sendYesNo("#b불의 원석1개#k와 #b종이 문서 " + cm.itemQuantity(4001015) + "개#k를 모아와 주셨군요. 파티원들이 모으신 물건은 이게 전부가 맞습니까?");
                    scrolls = false;
                } else {
                    cm.sendYesNo("#b불의 원석1개#k와 #b종이 문서 30개#k를 모아와 주셨군요. 파티원들이 모으신 물건은 이게 전부가 맞습니까?");
                    scrolls = true;
                }
            }
        } else if (selection == 2) {
            cm.sendYesNo("이곳에서 나가고 싶으신가요? 파티장이라면 모두 나가지게 됩니다. 정말 나가시겠습니까?")
        }
    } else if (status == 2) {
        var eim = cm.getEventInstance();
        if (selectedType == 1) {
            if (!cm.allMembersHere()) {
                cm.sendOk("파티원이 아직 이곳에 모두 모이지 않으신 것 같군요. 파티원이 모두 모였는지 다시 한번 확인해 보세요.");
                cm.dispose();
                return;
            }
            cm.showEffect(true, "quest/party/clear");
            cm.playSound(true, "Party1/Clear");
            cm.gainItem(4001018, -1);
            cm.removeAll(4001015);
            cm.removeAll(4001016);
            eim.setProperty("clear", "1");
            if (scrolls) {
                eim.setProperty("paper", "1");
            }
            cm.sendOk("임무를 훌륭히 완수하셨습니다. 제 오른쪽의 흰색 포탈을 통해 바깥으로 나가실 수 있습니다.");
            cm.dispose();
        } else if (selectedType == 2) {
            if (selection == 0) {
                cm.dispose();
                return;
            }
            if (eim != null) {
                if (cm.isLeader())
                    eim.disbandParty();
                else
                    eim.leftParty(cm.getChar());
            } else {
                cm.warp(280090000, 0);
            }
            cm.dispose();
        }
    }
}