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
 * NPCID : 9040006
 * ScriptName : guildquest1_baseball
 * NPCNameFunc : 분수 조각상
 * Location : 990000500 (샤레니안 - 현자의 분수)
 * 
 *
 */
/* @Author Lerk
 *
 * Guardian Statue - Sharenian: Fountain of the Wiseman (990000500)
 * 
 * Guild Quest Stage 3
 */

function start() {
    //everything can be done in one status, so let's do it here.
    var eim = cm.getEventInstance();
    if (eim == null) {
        cm.warp(990001100);
    } else {
            if (cm.getMap().getReactorByName("watergate").getState() > 0){
                cm.sendOk("...");
            } else {
                var currentCombo = eim.getProperty("stage3combo");
                if (currentCombo == null || currentCombo.equals("reset")) {
                    var newCombo = makeCombo();
                    eim.setProperty("stage3combo",newCombo);
                    //cm.playerMessage("Debug: " + newCombo);
                    eim.setProperty("stage3attempt","1");
                    cm.sendOk("분수 앞에 옛 샤레니안의 충신들의 석상이 있다. 이 충신들은 살아 생전 왕이 수여한 귀중한 보물들을 소유하고 있었다. 이러한 보물들을 제물로 바쳐야 하며, 제대로 바쳐질 경우 비밀 문이 열리게 된다. 제물로 바쳐야 할 물건들은 다음과 같다.\r\r #v4001027# #t4001027#\r #v4001028# #t4001028#\r #v4001029# #t4001029#\r #v4001030# #t4001030#\r. 바로 이것들이오. 그러나 누가 어느 제물을 원하는지는 알 수 없다오. 또, 개중에는 아예 필요없는 제물도 있을 수 있소. 기회는 총 7번이라오.")
                } else {
                    var attempt = parseInt(eim.getProperty("stage3attempt"));
                    var combo = parseInt(currentCombo);
                    var guess = getGroundItems();
                    if (guess != null) {
                        if (combo == guess || cm.getPlayer().isGM()) {
                            cm.getMap().getReactorByName("watergate").forceHitReactor(1);
                            eim.broadcastPlayerMsg(6, "충신의 제물을 통과하였습니다. 비밀문이 열립니다!")
                            cm.showEffect(true, "quest/party/clear");
                            cm.playSound(true, "Party1/Clear");
                            var prev = eim.setProperty("stage3clear","true",true);
                            if (prev == null) {
                                cm.gainGP(25);
                            }
                        } else {
                            if (attempt < 7) {
//                                cm.playerMessage("Combo : " + combo);
//                                cm.playerMessage("Guess : " + guess);
                                var parsedCombo = parsePattern(combo);
                                var parsedGuess = parsePattern(guess);
                                var results = compare(parsedCombo, parsedGuess);
                                var string = "";
                                //cm.playerMessage("Results - Correct: " + results[0] + " | Incorrect: " + results[1] + " | Unknown: " + results[2]);
                                if (results[0] != 0) {
                                    if (results[0] == 1) {
                                        string += "1 명은 올바른 제물이라 하오.\r\n";
                                    } else {
                                        string += results[0] + " 명은 올바른 제물이라 하오.\r\n";
                                    }
                                }
                                if (results[1] != 0) {
                                    if (results[1] == 1) {
                                        string += "1 명은 틀린 제물이라 하오.\r\n";
                                    } else {
                                        string += results[1] + " 명은 틀린 제물이라 하오.\r\n";
                                    }
                                }
                                if (results[2] != 0) {
                                    if (results[2] == 1) {
                                        string += "1 명은 모르는 제물이라 하오.\r\n";
                                    } else {
                                        string += results[2] + " 명은 모르는 제물이라 하오.\r\n";
                                    }
                                }
                                string += "이번이 " + attempt + "번째 시도요.";

                                //spawn one black and one myst knight
//                                cm.spawnMob(9300036, -350, 150);
//                                cm.spawnMob(9300037, 400, 150);

                                cm.sendOk(string);
                                eim.setProperty("stage3attempt",attempt + 1);
                            } else {
                                //reset the combo and mass spawn monsters
                                eim.setProperty("stage3combo","reset");
                                eim.broadcastPlayerMsg(6, "충신의 제물을 바르게 놓는데 실패하여 몬스터가 소환되었습니다.")

                                for (var i = 0; i < 5; i++) {
                                    //keep getting new monsters, lest we spawn the same monster five times o.o!
                                    cm.spawnMob(9300036, randX(), 150);
                                    cm.spawnMob(9300037, randX(), 150);
                                }
                            }
                        }
                    } else {
                        cm.sendOk("충신 앞에 제대로 놓였는지 확인하고 다시 말을 걸어주세요.");
                    }
                }
            }
    }
    cm.dispose();
}

function action(mode, type, selection) {
}

function makeCombo() {
    var combo = 0;
        
    for (var i = 0; i < 4; i++) {
        combo += Math.floor(Math.random() * 4) * Math.pow(10, i);
    }
        
    return combo;
}

//check the items on ground and convert into an applicable string; null if items aren't proper
function getGroundItems() {
    var items = cm.getMap().getItemsInRange(cm.getPlayer().getPosition(), java.lang.Double.POSITIVE_INFINITY);
    var itemInArea = new Array(-1, -1, -1, -1);
        
    if (items.size() != 4) {
//        cm.playerMessage("There are too many items in the map. Please remove some");
        return null;
    }
        
    var iter = items.iterator();
    while (iter.hasNext()) {
        var item = iter.next();
        var id = item.getItem().getItemId();
        if (id < 4001027 || id > 4001030) {
            cm.playerMessage("필요한 아이템이 아닌 아이템이 있습니다.");
            return null;
        } else {
            //check item location
            for (var i = 0; i < 4; i++) {
                if (cm.getMap().getArea(i).contains(item.getPosition())) {
                    itemInArea[i] = id - 4001027;
                    //cm.playerMessage("Item in area "+i+": " + id);
                    break;
                }
            }
        }
    }
        
    //guaranteed four items that are part of the stage 3 item set by this point, check to see if each area has an item
    if (itemInArea[0] == -1 || itemInArea[1] == -1 || itemInArea[2] == -1 || itemInArea[3] == -1) {
        cm.playerMessage("Please place these in correct positions: " + (itemInArea[0] == -1 ? "Statue 1, " : "") + (itemInArea[1] == -1 ? "Statue 2, " : "") + (itemInArea[2] == -1 ? "Statue 3, " : "") + (itemInArea[3] == -1 ? "Statue 4. " : ""));
        /*  for (var i = 0; i < 4; i++) {
                        cm.playerMessage("Item in area "+i+": " + itemInArea[i]);
                }*/
        return null;
    }
        
    return (itemInArea[0] * 1000 + itemInArea[1] * 100 + itemInArea[2] * 10 + itemInArea[3]);
}

//convert an integer for answer or guess into int array for comparison
function parsePattern(pattern) {
    var tempPattern = pattern;
    var items = new Array(-1, -1, -1, -1);
    for (var i = 0; i < 4; i++) {
        items[i] = Math.floor(tempPattern / Math.pow(10, 3-i));
        tempPattern = tempPattern % Math.pow(10, 3-i);
    }
    return items;
}

// compare two int arrays for the puzzle
function compare(answer, guess) {
    var correct = 0;
    var incorrect = 0;
    /*var debugAnswer = "Combo : ";
        var debugGuess = "Guess : ";
        
        for (var d = 0; d < answer.length; d++) {
                debugAnswer += answer[d] + " ";
                debugGuess += guess[d] + " ";
        }
        
        cm.playerMessage(debugAnswer);
        cm.playerMessage(debugGuess);*/
        
    for (var i = 0; i < answer.length; i) {
        if (answer[i] == guess[i]) {
            correct++;
            //cm.playerMessage("Item match : " + answer[i]);
                        
            //pop the answer/guess at i
            if (i != answer.length - 1) {
                answer[i] = answer[answer.length - 1];
                guess[i] = guess[guess.length - 1];
            }
                        
            answer.pop();
            guess.pop();
                        
        /*/debugAnswer = "Combo : ";
                        debugGuess = "Guess : ";

                        for (var d = 0; d < answer.length; d++) {
                                debugAnswer += answer[d] + " ";
                                debugGuess += guess[d] + " ";
                        }

                        cm.playerMessage(debugAnswer);
                        cm.playerMessage(debugGuess);*/
        }
        else {
            i++;
        }
    }
        
    //check remaining answers for "incorrect": correct item in incorrect position
    var answerItems = new Array(0, 0, 0, 0);
    var guessItems = new Array(0, 0, 0, 0);
        
    for (var j = 0; j < answer.length; j++) {
        var aItem = answer[j];
        var gItem = guess[j]
        answerItems[aItem]++;
        guessItems[gItem]++;
    }
        
    /*for (var d = 0; d < answer.length; d++) {
                cm.playerMessage("Item " + d + " in combo: " + answerItems[d] + " | in guess: " + guessItems[d]);
        }*/
        
    for (var k = 0; k < answerItems.length; k++) {
        var inc = Math.min(answerItems[k], guessItems[k]);
        //cm.playerMessage("Incorrect for item " + k + ": " + inc);
        incorrect += inc;
    }
        
    return new Array(correct, incorrect, (4 - correct - incorrect));
}

//for mass spawn
function randX() {
    return -350 + Math.floor(Math.random() * 750);
}