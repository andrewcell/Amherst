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
 * NPCID : 9040009
 * ScriptName : guildquest1_statue
 * NPCNameFunc : 성문 문지기
 * Location : 990000300 (샤레니안 - 샤레니안 성문)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var stage;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    var eim = cm.getEventInstance();
    if (eim == null) {
        cm.warp(990001100);
    }
    else {
//        if (eim.getProperty("stage1clear") != null) {
//            cm.sendOk("...");
//            cm.safeDispose();
//            return;
//        }
        if (eim.getProperty("leader").equals(cm.getName())) {
            if (cm.getMap().getReactorByName("statuegate").getState() > 0){
                cm.sendOk("...");
                cm.safeDispose();
            } else {
                if (status == 0) {
                    if (eim.getProperty("stage1status") == null || eim.getProperty("stage1status").equals("waiting")) {
                        if (eim.getProperty("stage1phase") == null) {
                            stage = 1;
                            eim.setProperty("stage1phase",stage);
                        } else {
                            stage = parseInt(eim.getProperty("stage1phase"));
                        }
                        if (stage == 1) {
                            cm.sendOk("... 도전을 하겠다..? 내가 이 석상들을 움직일 것이다. 그렇다면 내가 움직인 석상들의 빛나는 행적을 알아 맞추도록..");
                        }
                        else {
                            cm.sendNext("... 다음 행적을 쫓을 준비를 하라.")
                        }
                    }
                    else if (eim.getProperty("stage1status").equals("active")) {
                        stage = parseInt(eim.getProperty("stage1phase"));
                        var clearcondition = eim.getProperty("stage1combo").equals(eim.getProperty("stage1guess")) || cm.getPlayer().isGM();
                        //
                        if (clearcondition) {
                            if (stage == 3) {
                                cm.getMap().getReactorByName("statuegate").forceHitReactor(1);
                                //cm.sendOk("Excellent work. Please proceed to the next stage.");
                                eim.broadcastPlayerMsg(6, "성문 문지기의 시험을 전부 통과하였습니다.")
                                cm.showEffect(true, "quest/party/clear");
                                cm.playSound(true, "Party1/Clear");
                                var prev = eim.setProperty("stage1clear","true",true);
                                if (prev == null) {
                                    cm.gainGP(15);
                                }
                            } else {                           
                                cm.sendNext("... 다음 행적을 쫓을 준비를 하라. 준비가 되면 다시 내게 말을 걸도록...");
                                eim.setProperty("stage1phase", stage + 1);
                                cm.mapMessage("성문 문지기의 시험 중 " + stage + "번째 시험을 통과하였습니다.");
                            }
                                                                
                        } else {
                            //			    cm.sendOk("You have failed this test.");
                            eim.broadcastPlayerMsg(6, "성문 문지기의 시험에 실패하였습니다.")
                            eim.setProperty("stage1phase","1")
                        }
                        eim.setProperty("stage1status", "waiting");
                        cm.dispose();
                    }
                    else {
                        cm.sendOk("...");
                        cm.safeDispose();
                    }
                }
                else if (status == 1) {
                    //only applicable for "waiting"
                    var reactors = getReactors();
                    var combo = makeCombo(reactors);
                    //		    var reactorString = "Debug: Reactors in map: ";
                    //                                                for (var i = 0; i < reactors.length; i++) {
                    //                                                        reactorString += reactors[i] + " ";
                    //                                                }
                    //                                                cm.playerMessage(reactorString);
                    //                                                reactorString = "Debug: Reactors in combo: ";
                    //                                                for (var i = 0; i < combo.length; i++) {
                    //                                                        reactorString += combo[i] + " ";
                    //                                                }
                    //                                                cm.playerMessage(reactorString);
//                    cm.mapMessage("석상들이 모두 빛날때 까지 잠시 기다려 주세요.");
                                                
                    var delay = 5000;
                    for (var i = 0; i < combo.length; i++) {
                        cm.getMap().getReactorByOid(combo[i]).delayedHitReactor(cm.getClient(), delay + 3500*i);
                    }
                    eim.setProperty("stage1status", "display");
                    eim.setProperty("stage1combo","");
                    cm.dispose();
                }
            }

        } else {
            cm.sendOk("...");
            cm.safeDispose();
        }
    }
}

//method for getting the statue reactors on the map by oid
function getReactors() {
    var reactors = new Array();
        
    var iter = cm.getPlayer().getMap().getAllReactorsThreadsafe().iterator();
    while (iter.hasNext()) {
        var mo = iter.next();
        if (!mo.getName().equals("statuegate")) {
            reactors.push(mo.getObjectId());
        }
    }
        
    return reactors;
}

function makeCombo(reactors) {
    var combo = new Array();
        
    while (combo.length < (stage + 3)) {
        var chosenReactor = reactors[Math.floor(Math.random() * reactors.length)];
        //cm.log("Debug: Chosen Reactor " + chosenReactor)
        var repeat = false;
                
        if (combo.length > 0) {
            for (var i = 0; i < combo.length; i++) {
                if (combo[i] == chosenReactor) {
                    repeat = true;
                    //cm.log("Debug: repeat reactor: " + chosenReactor);
                    break;
                }
            }
        }
                
        if (!repeat) {
            //cm.log("Debug: unique reactor: " + chosenReactor);
            combo.push(chosenReactor);
        }
    }
        
    return combo;
}