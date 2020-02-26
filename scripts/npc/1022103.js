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
 * NPCID : 1022103
 * ScriptName : s4strike_statue
 * NPCNameFunc : 분수 조각상
 * Location : 910210000 (히든스트리트 - 샤레니안 성문)
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
        eim = cm.getPlayer().getEventInstance();
        if (eim == null) {
            cm.warp(120000102);
            cm.dispose();
            return;
        }
        if (eim.getProperty("ready") == null) {
            cm.sendNext("... 조나단에게 이야기는 전해들었다. 내가 자네를 시험해 주도록 하겠다.");
            eim.setProperty("stage", "0");
        } else {
            if (eim.getProperty("progress").equals("ready")) {
                if (eim.getProperty("stage").equals("1")) {
                    cm.sendNext("4개의 동상이 반짝일 것이다. 잘 기억하여 순서대로 타격한 후 다시 말을 걸라.");
                } else if (eim.getProperty("stage").equals("2")) {
                    cm.sendNext("5개의 동상이 반짝일 것이다. 잘 기억하여 순서대로 타격한 후 다시 말을 걸라.");
                } else if (eim.getProperty("stage").equals("3")) {
                    cm.sendNext("6개의 동상이 반짝일 것이다. 잘 기억하여 순서대로 타격한 후 다시 말을 걸라.");
                }
            } else if (eim.getProperty("progress").equals("guess")) {
                if (eim.getProperty("guess").equals(eim.getProperty("combo")+eim.getProperty("combo"))) {
                    if (eim.getProperty("stage").equals("3")) {
                        status = 2;
                        cm.sendNext("그대는 나의 시험을 통과했다. 조나단에게 너의 지혜에 대해 이야기를 잘 해주겠다. 다시 조나단에게 보내줄테니 그와 잘 이야기해보도록...");
                    } else {
                        cm.sendNext("올바르게 정답을 맞추었다. 다음 시험을 준비하겠다.");
                    }
                } else {
                    eim.setProperty("stage", "1");
                    eim.setProperty("progress", "ready");
                    cm.sendNext(".... 틀렸다. 처음부터 다시 시험하겠다. 준비가 되면 다시 말을 걸라.");
                    cm.dispose();
                }
            }
        }
    } else if (status == 1) {
        if (eim.getProperty("stage").equals("1") || eim.getProperty("stage").equals("2") || eim.getProperty("stage").equals("3")) {

            if (eim.getProperty("progress").equals("guess")) {
                cm.sendNext("준비가 되었으면 다시 나에게 말을 걸라.")
                eim.setProperty("stage", parseInt(eim.getProperty("stage")) + 1);
                eim.setProperty("progress", "ready");
                cm.dispose();
                return;
            }

            var max = 4;
            if (eim.getProperty("stage").equals("2")) {
                max = 5;
            } else if (eim.getProperty("stage").equals("3")) {
                max = 6;
            }

            var combo = cm.shuffle("123456").substring(0, max);
            eim.setProperty("combo", combo);
            eim.setProperty("progress", "guess");
            eim.setProperty("guess", "");
            var map = cm.getPlayer().getMap();
            for (var i = 1; i <= max; ++i) {
                var reactor = map.getReactorByName(combo.substring(i - 1, i));
                if (reactor != null) {
                    reactor.delayedHitReactor(cm.getClient(), 3500 * i);
                } else {
                    cm.playerMessage(5, "warn : null reactor " + combo.substring(i - 1, i));
                }
            }
            cm.dispose();
        } else {
            cm.sendNext("시험에 대해서 설명하겠다. 내가 말하는 갯수의 동상이 임의로 반짝일 것이다. 그러면 반짝인 동상을 순서 그대로 따라서 타격해야한다. 순서가 만에 하나라도 틀리면 처음부터 다시 해야하니 주의하라.");
        }
    } else if (status == 2) {
        cm.sendNext("준비가 되었으면 다시 말을 걸라.");
        eim.setProperty("ready", "1");
        eim.setProperty("stage", "1");
        eim.setProperty("progress", "ready");
        cm.dispose();
    } else if (status == 3) {
        cm.forceStartQuest(6401, "q3");
        cm.showQuestClear(6400);
        cm.warp(120000102, 1);
        cm.dispose();
    }
}