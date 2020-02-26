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
 * NPCID : 2040003
 * ScriptName : ludi020
 * NPCNameFunc : 조교 챙
 * Location : 220020000 (루디브리엄성 - 장난감공장<1공정>1구역)
 * Location : 922000000 (히든스트리트 - 장난감공장<4구역>)
 * 
 * @author T-Sun
 *
 */
var em;
var entry = true;
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
    em = cm.getEventManager("MachineRoom");
    if (cm.getPlayer().getMapId() == 220020000) {
        if (cm.getQuestStatus(3239) == 1) {
            if (status == 0) {
                cm.sendNext("오, 정비 부품 찾는걸 도와주러 왔는가? 이곳으로 들어가보면 상자가 있을 걸세. 상자들을 부수면 찾을 수 있을거야.");
                if (em != null && em.getProperty("noEntry").equals("true")) {
                    entry = false;
                }
            } else if (status == 1) {
                if(cm.getPlayerCount(922000000) > 0) {
                    cm.sendPrev("이미 이 안에 다른 플레이어가 들어간 것 같군. 잠시 후에 다시 시도해 보게나.");
                } else {
                    cm.removeAll(4031092);
                    em.startInstance(cm.getChar());
                }
                cm.dispose();
            }
        } else if (cm.getQuestStatus(3239) == 2) {
            cm.sendNext("아, 자넨 저번에 정비부품 찾는걸 도와줬던 친구아닌가? 그땐 정말 고마웠다네.");
            cm.dispose();
        } else {
            cm.sendOk("흐음.. 이곳엔 아무나 들어갈 수 없다네.");
            cm.dispose();
        }
    } else if (cm.getPlayer().getMapId() == 922000000) {
        if (status == 0) {
            if (cm.haveItem(4031092, 10)) {
                cm.sendNext("오! 기계 부품 10개를 모두 모아왔군! 정말 고맙네. 여기 내 보답을 받게. 받기 전에 인벤토리 공간이 충분한지 확인해주게나~");
            } else {
                cm.sendYesNo("흐음. 아직 기계 부품 10개를 모으지 못한 것 같구만. 기계 부품 모으기는 중단하고 여기서 나가보겠는가?");
            }
        } else if (status == 1) {
            if (cm.haveItem(4031092, 10)) {
                if (cm.canHold(2040704)) {
                    var rand = cm.rand(0,3);
                    nNewItemID = 0;
                    if (rand == 0) {
                        nNewItemID = 2040704;
                    } else if (rand == 1) {
                        nNewItemID = 2040705;
                    } else if (rand == 2) {
                        nNewItemID = 2040707;
                    } else if (rand == 3) {
                        nNewItemID = 2040708;
                    }
                    cm.gainItem(nNewItemID, 1);
                    cm.removeAll(4031092);
                    cm.gainExp(2700);
                    cm.completeQuest(3239);
                    cm.warp(220020000, "q000");
                    cm.dispose();
                } else {
                    cm.sendOk("자네.. 소비 인벤토리 공간이 부족한 것 같은데? 다시 확인해보게나.")
                    cm.dispose();
                }
            } else {
                if (selection == 1) {
                    cm.getPlayer().getEventInstance().removePlayer(cm.getChar());
                    cm.dispose();
                } else {
                    cm.sendOk("좋네. 조금 더 노력해 주면 고맙겠네.");
                    cm.dispose();
                    return;
                }
            }
        }
    }
}