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
 * NPCID : 1092019
 * ScriptName : s4strike
 * NPCNameFunc : 조나단
 * Location : 120000102 (노틸러스호 - 조나단의 방)
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
        if (cm.isQuestActive(6400)) {
            if (cm.getQuestRecord(6401).getCustomData() != null) {
                cm.sendOk("커흠. 이미 나의 모든 시험을 통과했구만? 축하하네~");
                cm.dispose();
            } else if (cm.getQuestRecord(116400).getCustomData() == null) {
                cm.sendNext("하하~ 드디어 만나보게 되었군. 반갑네. 우선 내 소개를 하지. 난 갈매기들의 제왕 조나단3세 일세. 그냥 조나단이라 부르게나. 약 1000년간 갈매기들을 다스려 왔지. 내가 자네를 보자고 한 이유는 해적이라면 누구나 거쳐야 할 의식이라고 해야 할까나? 그것을 위해서네.");
            } else if (cm.getQuestRecord(116400).getCustomData().equals("q1")) {
                cm.sendGetText("이 세상엔 많은 사람이 있지. 하지만 가장 강하고 용감한 사람은 단 한사람이라네. 이 사람은 누구일까?");
            } else if (cm.getQuestRecord(116400).getCustomData().equals("q2")) {
                cm.sendNext("난 자네를 노틸러스호 비어있는 어느 방으로 보내줄거네. 그 곳엔 9명의 바트가 있을거네. 하하하~ 바트가 쌍둥이냐고? 당연히 그는 쌍둥이가 아니네. 내가 시험을 위해 마법의 힘을 약간 빌렸지.")
            } else if (cm.getQuestRecord(116400).getCustomData().equals("q22")) {
                cm.sendNext("바트를 쉽게 찾아냈구만. 같은 해적 동료인데 금방 찾아내는 것은 당연하지. 하지만 요새 젊은이들은 동료들한테 무관심한 경우가 많아서 걱정했는데... 자넨 그런 젊은이가 아니로군. 안심일세. 자, 다음 시험에 대해 알려주겠네.")
            }
        } else {
            cm.sendOk("크흠, 아무 볼일도 없다면 이만 물러가게나.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (cm.getQuestRecord(116400).getCustomData() == null) {
            cm.sendNext("자네 스스로 지혜롭다고 생각되면 나에게 다시 말을 걸게. 알겠나?");
            cm.forceStartQuest(116400, "q1");
            cm.dispose();
        } else if (cm.getQuestRecord(116400).getCustomData().equals("q1")) {
            if (cm.getText().equals("조나단")) {
                cm.sendNext("우하하~! 나를 잠깐 봤는데도 금방 알아보다니... 자네, 사람 보는 눈이 있구만. 역시 나를 실망시키지 않아!")
                cm.forceStartQuest(116400, "q2");
                status = -1;
            } else {
                cm.sendOk("에긍.. 쯧쯧쯧, 틀렸어. 다시 한번 생각해 보라구.");
                cm.dispose();
            }
        } else if (cm.getQuestRecord(116400).getCustomData().equals("q2")) {
            cm.sendYesNo("시험을 치를 준비가 되었는가?");
        } else if (cm.getQuestRecord(116400).getCustomData().equals("q22")) {
            cm.sendNext("샤레니안 성문의 문지기에게 시험을 보는 걸세. 문지기의 시험을 통과하면 자네를 해적의 일원, 그리고 우리 갈매기들의 친구로 인정하지. 자, 그럼 내가 시험의 장소로 보내주겠네.");
        }
    } else if (status == 2) {
        if (cm.getQuestRecord(116400).getCustomData().equals("q2")) {
            if (selection == 1) {
                var em = cm.getEventManager("AirStrike");
                if (em == null) {
                    cm.sendOk("오류가 발생해서 시험을 치를 수 없네.");
                    cm.dispose();
                    return;
                }
                if (em.getProperty("noEntry").equals("true")) {
                    cm.sendOk("흠, 이미 누군가가 시험을 치르는 중이네. 나중에 다시 시도하게나.");
                    cm.dispose();
                    return;
                }
                em.startInstance(cm.getPlayer());
            } else {
                cm.sendOk("아직 시험을 치를 준비가 되지 않았나?");
            }
            cm.dispose();
        } else if (cm.getQuestRecord(116400).getCustomData().equals("q22")) {
            var em = cm.getEventManager("AirStrike2");
            if (em == null) {
                cm.sendOk("오류가 발생해서 시험을 치를 수 없네.");
                cm.dispose();
                return;
            }
            if (em.getProperty("noEntry").equals("true")) {
                cm.sendOk("흠, 이미 누군가가 시험을 치르는 중이네. 나중에 다시 시도하게나.");
                cm.dispose();
                return;
            }
            em.startInstance(cm.getPlayer());
            cm.dispose();
        } else {
            cm.sendOk("fuck you");
            cm.dispose();
        }
    }
}