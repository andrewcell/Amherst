var minPlayers = 3;

function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function setup(level, leaderid) {
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    var eim = em.newInstance("Pirate" + leaderid);
    eim.setInstanceMap(925100000).resetFully();
    eim.setInstanceMap(925100100).resetFully();
    eim.setInstanceMap(925100200).resetFully();
    eim.setInstanceMap(925100201).resetFully();
    eim.setInstanceMap(925100202).resetFully();
    eim.setInstanceMap(925100300).resetFully();
    eim.setInstanceMap(925100301).resetFully();
    eim.setInstanceMap(925100302).resetFully();
    eim.setInstanceMap(925100400).resetFully();
    eim.setInstanceMap(925100500).resetFully();
    eim.startEventTimer(240000); //4mins - first map
    eim.setProperty("stage", "1");
    
    //    var mapid = 925100000;
    //    spawnMonster(eim, mapid, 2100045, -930, 220);
    //    spawnMonster(eim, mapid, 2100045, -630, 220);
    //    spawnMonster(eim, mapid, 2100045, -330, 220);
    //    spawnMonster(eim, mapid, 2100045, -0, 220);
    //    //삼단지
    //    spawnMonster(eim, mapid, 2100046, -720, 220);
    //    spawnMonster(eim, mapid, 2100046, -420, 220);
    //    spawnMonster(eim, mapid, 2100046, -120, 220);
    //    spawnMonster(eim, mapid, 2100046, -1250, 0);
    //    spawnMonster(eim, mapid, 2100046, -950, 0);
    //    //도라지 bellflower
    //    spawnMonster(eim, mapid, 2100047, -820, 0);
    //    spawnMonster(eim, mapid, 2100047, 520, 0);
    //    spawnMonster(eim, mapid, 2100047, -242, 0);
    //    spawnMonster(eim, mapid, 2100047, 50, 0);
    //    //할배도라지 bellflower
    //    spawnMonster(eim, mapid, 2100048, 7, 0);
    //    spawnMonster(eim, mapid, 2100048, 20, 0);
    //    spawnMonster(eim, mapid, 2100048, 307, 0);
    //    spawnMonster(eim, mapid, 2100048, 100, 220);
    //    spawnMonster(eim, mapid, 2100048, 300, 220);
    
    
    eim.setProperty("stage2", "0");
    eim.setProperty("stage2a", "0");
    eim.setProperty("stage3a", "0");
    eim.setProperty("stage4", "0");
    eim.setProperty("stage5", "0");
    eim.setInstanceMap(925100000).resetPQ(level);
    var mm = eim.setInstanceMap(925100100);
    mm.resetPQ(level);
    mm.setMobGen(9300114, false);
    mm.setMobGen(9300115, false);
    mm.setMobGen(9300116, false);
    mm.killAllMonsters(false);
    var map = eim.setInstanceMap(925100200);
    map.resetFully();
    for (var i = 0; i < 5; i++) {
        var mob = em.getMonster(9300124);
        var mob2 = em.getMonster(9300125);
        var mob3 = em.getMonster(9300124);
        var mob4 = em.getMonster(9300125);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        eim.registerMonster(mob3);
        eim.registerMonster(mob4);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(430, 75));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1600, 75));
        map.spawnMonsterOnGroundBelow(mob3, new java.awt.Point(430, 238));
        map.spawnMonsterOnGroundBelow(mob4, new java.awt.Point(1600, 238));
    }
    map = eim.setInstanceMap(925100201);
    map.resetFully();
    for (var i = 0; i < 10; i++) {
        var mob = em.getMonster(9300112);
        var mob2 = em.getMonster(9300113);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(0, 238));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1700, 238));
    }
    eim.setInstanceMap(925100202).resetPQ(level);
    map = eim.setInstanceMap(925100300);
    map.resetFully();
    for (var i = 0; i < 5; i++) {
        var mob = em.getMonster(9300124);
        var mob2 = em.getMonster(9300125);
        var mob3 = em.getMonster(9300124);
        var mob4 = em.getMonster(9300125);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        eim.registerMonster(mob3);
        eim.registerMonster(mob4);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(430, 75));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1600, 75));
        map.spawnMonsterOnGroundBelow(mob3, new java.awt.Point(430, 238));
        map.spawnMonsterOnGroundBelow(mob4, new java.awt.Point(1600, 238));
    }
    map = eim.setInstanceMap(925100301);
    map.resetFully();
    for (var i = 0; i < 10; i++) {
        var mob = em.getMonster(9300112);
        var mob2 = em.getMonster(9300113);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(0, 238));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1700, 238));
    }
    eim.setInstanceMap(925100302).resetFully();
    eim.setInstanceMap(925100400).resetFully();
    eim.setInstanceMap(925100500).resetFully();




    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1204);
}

function playerRevive(eim, player) {
}

function warpAll(eim, target, exception) {
    var map = eim.getMapInstance(target);
    var it = eim.getPlayers().iterator();
    while (it.hasNext()) {
        var chr = it.next();
        if (exception != chr.getId()) {
            chr.changeMap(map, map.getPortal(0));
        }
    }
}

function scheduledTimeout(eim) {
    var mapid = eim.getPlayers().get(0).getMapId();
    if (eim.getProperty("DavyJohn3_hd") != null && mapid == 925100202) {
        eim.setProperty("DavyJohn3_hd_out", "1");
        warpAll(eim, 925100200, 0);
        eim.restartEventTimer(java.lang.Long.parseLong(eim.getProperty("DavyJohn3_hd_leftTime")));
    } else if (eim.getProperty("DavyJohn4_hd") != null && mapid == 925100302) {
        eim.setProperty("DavyJohn4_hd_out", "1");
        warpAll(eim, 925100300, 0);
        eim.restartEventTimer(java.lang.Long.parseLong(eim.getProperty("DavyJohn3_hd_leftTime")));
    } else {
        end(eim);
    }
}

function changedMap(eim, player, mapid) {
    if (mapid < 925100000 || mapid > 925100500) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("state", "0");
            em.setProperty("leader", "true");
        }
    } else {
        if (mapid == 925100100) {
            if (eim.getProperty("DavyJohn2") == null) {
                eim.restartEventTimer(360000);
                eim.setProperty("DavyJohn2", "1");
                eim.broadcastPlayerMsg(6, "구옹이 모험가들에게 할 말이 있는 것 같습니다.");
            }
        }
        else if (mapid == 925100200) {
            if (eim.getProperty("DavyJohn3") == null) {
                eim.restartEventTimer(360000);
                eim.setProperty("DavyJohn3", "1");
                eim.broadcastPlayerMsg(6, "해적들이 외부인들을 경계합니다. 해적들을 모두 쓰러뜨리십시오!");
            } else if (eim.getProperty("DavyJohn3_hd_out") != null) {
                warpAll(eim, 925100200, player.getId());
                eim.restartEventTimer(java.lang.Long.parseLong(eim.getProperty("DavyJohn3_hd_leftTime")));
            }
        } else if (mapid == 925100202) {
            if (eim.getProperty("DavyJohn3_hd") == null) {
                eim.setProperty("DavyJohn3_hd_leftTime", eim.getTimeLeft()+"");
                eim.restartEventTimer(60000);
                eim.setProperty("DavyJohn3_hd", "1");
                eim.broadcastPlayerMsg(6, "해적들이 숨어있는 것 같습니다..");
            }
        } else if (mapid == 925100300) {
            if (eim.getProperty("DavyJohn4") == null) {
                eim.setProperty("DavyJohn4_hd_leftTime", eim.getTimeLeft()+"");
                eim.restartEventTimer(360000);
                eim.setProperty("DavyJohn4", "1");
                eim.broadcastPlayerMsg(6, "해적들이 외부인들을 경계합니다. 해적들을 모두 쓰러뜨리십시오!");
            } else if (eim.getProperty("DavyJohn4_hd_out") != null) {
                warpAll(eim, 925100300, player.getId());
                eim.restartEventTimer(java.lang.Long.parseLong(eim.getProperty("DavyJohn4_hd_leftTime")));
            }
        } else if (mapid == 925100302) {
            if (eim.getProperty("DavyJohn4_hd") == null) {
                eim.restartEventTimer(60000);
                eim.setProperty("DavyJohn4_hd", "1");
                eim.broadcastPlayerMsg(6, "해적들이 숨어있는 것 같습니다..");
            }
        } else if (mapid == 925100400) {
            if (eim.getProperty("DavyJohn5") == null) {
                eim.restartEventTimer(360000);
                eim.setProperty("DavyJohn5", "1");
                eim.broadcastPlayerMsg(6, "열쇠를 획득하여 갑판의 문을 모두 잠가버리고, 해적들이 더 나오지 않게 하세요!");
            }
        } else if (mapid == 925100500) {
            if (eim.getProperty("DavyJohn6") == null) {
                eim.restartEventTimer(480000);
                eim.setProperty("DavyJohn6", "1");
                var treasure1 = eim.getMapInstance(925100201).getReactorById(2512001).getState();
                var treasure2 = eim.getMapInstance(925100301).getReactorById(2512001).getState();
                if (treasure1 == 2 &&  treasure2 == 2) {
                    eim.broadcastPlayerMsg(6, "데비존이 화가 무척이나 나 있습니다! 주의하세요!");
                    spawnMonster(eim, 925100500, 9300106, 630, 213 );
                } else if (treasure1 == 2 || treasure2 == 2) {
                    eim.broadcastPlayerMsg(6, "데비존이 화가 나 있습니다! 주의하세요!");
                    spawnMonster(eim, 925100500, 9300105, 630, 213 );
                } else {
                    eim.broadcastPlayerMsg(6, "모든 일의 원흉, 해적왕을 물리쳐야 합니다!");
                    spawnMonster(eim, 925100500, 9300119, 630, 213 );
                }
            }
        }
    }
}

function spawnMonster (eim, mapid, mobid, x, y) {
    var map = eim.getMapInstance(mapid);
    var mob = em.getMonster(mobid);
    eim.registerMonster(mob);
    map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(x, y));
}

//Too Expensive
//function scheduleMsg(eim, msg, sec) {
//    eim.setProperty("scheduledMsg", msg);
//    eim.schedule("msg", sec * 1000);
//}
//
//function msg(eim) {
//    eim.broadcastPlayerMsg(6, eim.getProperty("scheduledMsg"));
//}

function playerDisconnected(eim, player) {
    return 0;
}

function monsterValue(eim, mobId) {
    if (eim.getMapInstance(925100201).getAllMonstersThreadsafe().isEmpty()) {
        var r = eim.getMapInstance(925100201).getReactorById(2512001);
        if (r.getState() == 0)
            r.forceHitReactor(1); //보물 상자 소환
    }
    if (eim.getMapInstance(925100301).getAllMonstersThreadsafe().isEmpty()) {
        var r2 = eim.getMapInstance(925100301).getReactorById(2512001);
        if (r2.getState() == 0)
            r2.forceHitReactor(1); //보물 상자 소환
    }
    //    if (mobId == 9300119) {
    //        eim.getMapInstance(925100500).getReactorById(2516000).forceStartReactor(eim.getPlayers().get(0).); //우양 소환
    //    }
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
    eim.disposeIfPlayerBelow(100, 925100700);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty (eim, player) {
    // If only 2 players are left, uncompletable:
    end(eim);
}
function disbandParty (eim) {
    end(eim);
}
function playerDead(eim, player) {}
function cancelSchedule() {}