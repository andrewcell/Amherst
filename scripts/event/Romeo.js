var minPlayers = 4;

function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function setup(level, leaderid) {
    em.getProperties().clear();
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    var eim = em.newInstance("Romeo" + leaderid);
    em.setProperty("stage", "0"); //whether book.. gave report, whether urete.. accepted it
    em.setProperty("stage1", "0"); //whether book..opened door
    em.setProperty("stage3", "0"); //how many beakers.. activated
    em.setProperty("stage4", "0"); //how many files.. gave
    em.setProperty("stage5", "0"); //mobs spawned/portal opened
    em.setProperty("summoned", "0");
    var y;
    for (y = 0; y < 4; y++) { //stage number
        em.setProperty("stage6_" + y, "0");
        for (var b = 0; b < 10; b++) {
            for (var c = 0; c < 4; c++) {
                //em.broadcastYellowMsg("stage6_" + y + "_" + b + "_" + c + " = 0");
                em.setProperty("stage6_ " + y + "_" + b + "_" + c + "", "0");
            }
        }
    }
    var i;
    for (y = 0; y < 4; y++) { //stage number
        for (i = 0; i < 10; i++) {
            var found = false;
            while (!found) {
                for (var x = 0; x < 4; x++) {
                    if (!found) {
                        var founded = false;
                        for (var z = 0; z < 4; z++) { //check if any other stages have this value set already.
                            //em.broadcastYellowMsg("stage6_" + z + "_" + i + "_" + x + " check");
                            if (em.getProperty("stage6_" + z + "_" + i + "_" + x + "") == null) {
                                em.setProperty("stage6_" + z + "_" + i + "_" + x + "", "0");
                            } else if (em.getProperty("stage6_" + z + "_" + i + "_" + x + "").equals("1")) {
                                founded = true;
                                break;
                            }
                        }
                        if (!founded && java.lang.Math.random() < 0.25) {
                            //em.broadcastYellowMsg("stage6_" + z + "_" + i + "_" + x + " = 1");
                            em.setProperty("stage6_" + y + "_" + i + "_" + x + "", "1");
                            found = true;
                            break;
                        }
                    }
                }
            }
            //BUT, stage6_0_0_0 set, then stage6_1_0_0 also not set!
        }
    }
    em.setProperty("stage7", "0"); //whether they were killed or not.

    var stage1Map = eim.setInstanceMap(926100000);
    stage1Map.resetPQ(level);

    var npcs = new Array();
    var npc_it = stage1Map.getAllNPCs().iterator();
    while (npc_it.hasNext()) {
        var npc_next = npc_it.next();
        if (npc_next.getId() == 2112007) { // 조사 결과
            npcs.push(npc_next.getObjectId());
        }
    }
    var npc1 = npcs[Math.floor(Math.random() * npcs.length)];
    var npc2 = npc1;
    while (npc2 == npc1) { // 중복 방지
        npc2 = npcs[Math.floor(Math.random() * npcs.length)];
    }
    em.setProperty("stage1_" + npc1, "2"); // 스위치
    em.setProperty("stage1_" + npc2, "3"); // 편지

    var stage1_way = eim.setInstanceMap(926100001);
    stage1_way.resetPQ(level);
    var mob_it = stage1_way.getAllMonstersThreadsafe().iterator();
    while (mob_it.hasNext()) {
        var mob_next = mob_it.next();
        eim.registerMonster(mob_next);
    }
    
    var m = eim.setInstanceMap(926100100);
    m.setSpawns(true);
    m.resetPQ(level);
    eim.setInstanceMap(926100200).resetPQ(level);
    var map = eim.setInstanceMap(926100201);
    map.resetPQ(level);
    map.shuffleReactors_RomeoJuliet();
    map = eim.setInstanceMap(926100202);
    map.resetPQ(level);
    map.shuffleReactors_RomeoJuliet();
    map = eim.setInstanceMap(926100203);
    map.resetPQ(level);
    map.spawnNpc(2112000, new java.awt.Point(200, 188)); //urete MADMAN
    eim.setInstanceMap(926100300).resetPQ(level);
    eim.setInstanceMap(926100301).resetPQ(level);
    eim.setInstanceMap(926100302).resetPQ(level);
    eim.setInstanceMap(926100303).resetPQ(level);
    eim.setInstanceMap(926100304).resetPQ(level);
    eim.setInstanceMap(926100400).resetPQ(level);
    map = eim.setInstanceMap(926100401);
    map.resetPQ(level);
    map.setSpawns(false);
    map.killMonster(9300150);
    eim.setInstanceMap(926100500).resetPQ(level); //spawn urete based on properties ?????
    eim.setInstanceMap(926100600).resetPQ(level); //spawn romeo&juliet OR fallen romeo/juliet based on properties???

    eim.startEventTimer(45 * 60000); //45 mins
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1205);
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
    end(eim);
}

function changedMap(eim, player, mapid) {
    if (mapid < 926100000 || mapid > 926100600) {
        eim.unregisterPlayer(player);

        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("state", "0");
            em.setProperty("leader", "true");
        }
    }
    if (mapid == 926100401 && em.getProperty("urete_boss") == null) {
        eim.getMapInstance(926100401).spawnNpc(2112010, new java.awt.Point(242, 150));
        em.setProperty("utere_boss", "1");
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function monsterValue(eim, mobId) {
    if (mobId >= 9300142 && mobId <= 9300146) { // 유레테의 사무실
        if (eim.getMapInstance(926100203).getAllMonstersThreadsafe().size() <= 0 && em.getProperty("stage5").equals("1")) {
            em.setProperty("stage5", "2");
            eim.getMapInstance(926100203).clearEffect();
            eim.getMapInstance(926100203).setReactorState();
        }
        if (eim.getMapInstance(926100001).getAllMonstersThreadsafe().size() <= 0 && em.getProperty("stage1_way_clear") == null) {
            eim.getMapInstance(926100001).clearEffect();
            em.setProperty("stage1_way_clear", "1");
        }
    } else if (mobId == 9300137 || mobId == 9300138) {
        if (em.getProperty("clear_protect") == null) {
            em.setProperty("stage7", "1");
            eim.broadcastPlayerMsg(5, "줄리엣을 구하는데 실패했습니다.");
        }
    } else if (mobId == 9300139 || mobId == 9300140) { //boss
        //13 = boss, 14 = urete, 15 = romeo&juliet
        em.setProperty("clear_protect", "1");
        eim.getMapInstance(13).clearEffect();
        eim.getMapInstance(13).setSpawns(false);
        eim.getMapInstance(13).killAllMonsters(true);
        if (em.getProperty("stage7").equals("0")) {
            eim.broadcastPlayerMsg(6, "줄리엣을 구하는데 성공했습니다.");
            eim.gainPartyExpPQ(eim.getMapInstance(13), 45000, "rnj", 70);
            eim.getMapInstance(14).spawnNpc(2112002, new java.awt.Point(232, 150));
            eim.getMapInstance(15).spawnNpc(2112003, new java.awt.Point(157, 128));
            eim.getMapInstance(15).spawnNpc(2112004, new java.awt.Point(107, 128));
            eim.getMapInstance(15).spawnNpc(2112002, new java.awt.Point(320, 128));
            eim.getMapInstance(13).spawnNpc(2112004, new java.awt.Point(-416, -116));
            eim.getMapInstance(13).spawnNpc(2112003, new java.awt.Point(-300, -126));
        } else {
            eim.gainPartyExpPQ(eim.getMapInstance(13), 30000, "rnj", 70);
            eim.getMapInstance(14).spawnNpc(2112001, new java.awt.Point(232, 150));
            eim.getMapInstance(15).spawnNpc(2112009, new java.awt.Point(111, 128));
            eim.getMapInstance(15).spawnNpc(2112008, new java.awt.Point(211, 128));
            eim.getMapInstance(13).spawnNpc(2112009, new java.awt.Point(-416, -116));
            eim.getMapInstance(13).spawnNpc(2112008, new java.awt.Point(-300, -126));
        }
    }
    return 1;
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);

    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
        em.setProperty("leader", "true");
    }
}

function end(eim) {
    eim.disposeIfPlayerBelow(100, 926100700);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty(eim, player) {
    // If only 2 players are left, uncompletable:
    end(eim);
}
function disbandParty(eim) {
    end(eim);
}
function playerDead(eim, player) {
}
function cancelSchedule() {
}