/*
* Guild Quest 
*/

importPackage(java.lang);

var mapz = Array(0, 100, 200, 300, 301, 400, 401, 410, 420, 430, 431, 440, 500, 501, 502, 600, 610, 611, 620, 630, 631, 640, 641, 700, 800, 900, 1000, 1100, 1101);

function init() {
    em.setProperty("started", "false");
    em.setProperty("state", "0");
    em.setProperty("guildid", "-1");
}

function monsterValue(eim, mobId) {
//    if (mobId == 9300025) {
//        //9300033
//        var map = eim.getMapInstance(990000630);
//        for (var i = 0; i < 8; ++i) {
//        var mob = em.getMonster(9300033);
//        eim.registerMonster(mob);
//        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(-173, 155));
//        }
//    }
    return 0;
}

function setup(z) {
    setup();
}

function setup() {
    em.setProperty("guildid", "-1");
    em.setProperty("started", "false");
    em.setProperty("state", "0");

    var eim = em.newInstance("GuildQuest");
    eim.setProperty("canEnter", "false");
    //shuffle reactors in two maps for stage 3
    var mapfact = eim.getMapFactory();
	
    for (var i = 0; i < mapz.length; i++) {
        var map = eim.setInstanceMap(990000000 + mapz[i]);
        if (map != null) {
            map.resetFully();
        }
    }
    mapfact.getMap(990000501).shuffleReactors();
    mapfact.getMap(990000502).shuffleReactors();

    //force no-respawn on certain map reactors
    mapfact.getMap(990000611).getReactorByName("").setDelay(-1);
    mapfact.getMap(990000620).getReactorByName("").setDelay(-1);
    mapfact.getMap(990000631).getReactorByName("").setDelay(-1);
    mapfact.getMap(990000641).getReactorByName("").setDelay(-1);
   
    mapfact.getMap(990000000).getPortal(5).setScriptName("guildwaitingenter");
    eim.startEventTimer(180000); // 3 minutes
    eim.startElapsedTimer();
    eim.setProperty("entryTimestamp", System.currentTimeMillis());
    return eim;
}

function scheduledTimeout(eim) {
    if (em.getProperty("state").equals("0")) {
        em.setProperty("state", "1");
        if (!disposePlayerBelow(eim, 5, 990001100, "길드 대항전을 시작하려면 6명의 참가 인원이 필요합니다.")) {
            var iter = players(eim).iterator();
            while (iter.hasNext()) {
                iter.next().dropMessage(0, "샤레니안의 문이 열렸습니다.");
            }
            em.setProperty("started", "true");
            eim.setProperty("canEnter", "true");
            eim.restartEventTimer(5400000);
            eim.stopElapsedTimer();
        }
    } else if (em.getProperty("state").equals("1")) {
        disposePlayerBelow(eim, 100, 990001100, "제한시간이 다 되었습니다.");
    } else if (em.getProperty("state").equals("2")) {
        finish(eim);
    }
}

function playerEntry(eim, player) {
    var map = em.getMapFactory().getMap(990000000);
    player.changeMap(map, map.getPortal(0));
    em.openNpc(player, 9040011);
}

function playerRevive(eim, player) {
    return false;
}

function playerDead(eim, player) {
}

function disposePlayerBelow(eim, size, mapid, msg) {
    var z = players(eim);
    var map = eim.getMapFactory().getMap(mapid);
    if (z.size() <= size) {
        var iter = z.iterator();
        while (iter.hasNext()) {
            var cha = iter.next();
            eim.unregisterPlayer(cha);
            if (mapid > 0) {
                cha.changeMap(map, map.getPortal(0));
            }
            if (msg.length > 0) {
                cha.dropMessage(6, msg);
            }
        }
        em.setProperty("started", "false");
        eim.dispose();
        return true;
    }
    return false;
}

function players(eim) { //not efficient
    var z = em.newCharList();
    for (var i = 0; i < mapz.length; i++) {
        var map = eim.getMapFactory().getMap(990000000 + mapz[i]);
        if (map != null) {
            var iter = map.getCharactersThreadsafe().iterator();
            while (iter.hasNext()) {
                var chaz = iter.next();
                if (("" + chaz.getGuildId()).equals(eim.getProperty("guildid")) && chaz.getEventInstance() != null && chaz.getEventInstance().getName().equals("GuildQuest")) {
                    z.add(chaz);
                }
            }
        }
    }
    return z;
}

function changedMap(eim, player, mapid) {
    if (mapid < 990000000 || mapid > 990002000) {
        eim.unregisterPlayer(player);
        if (player.getName().equals(eim.getProperty("leader"))) { //check for party leader
            disposePlayerBelow(eim, 100, 990001100, "길드 대항전의 리더가 퇴장하여 자동으로 모두 퇴장됩니다.");
        } else {
            if (disposePlayerBelow(eim, 0, 0, "")) {
                em.setProperty("started", "false");
            }
        }
    }
}

function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
    if (player.getName().equals(eim.getProperty("leader"))) { //check for party leader
        //boot all players and end
        disposePlayerBelow(eim, 100, 990001100, "길드 대항전의 리더가 접속이 끊겨 자동으로 모두 퇴장됩니다.");
    } else {
        if (!em.getProperty("state").equals("0")) {
            disposePlayerBelow(eim, 5, 990001100, "길드 대항전을 진행할 인원이 부족하여 자동으로 모두 퇴장됩니다.");
        }
    }
}

function leftParty(eim, player) { //ignore for GQ
}

function disbandParty(eim) { //ignore for GQ
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    if (!em.getProperty("state").equals("0")) {
        disposePlayerBelow(eim, 5, 990001100, "길드 대항전을 진행할 인원이 부족하여 자동으로 모두 퇴장됩니다.");
    }
}

function clearPQ(eim) {
    var iter = eim.getPlayers().iterator();
    var bonusMap = eim.getMapFactory().getMap(990001000);

    bonusMap.resetReactors();

    while (iter.hasNext()) { // Time is automatically processed
        var chr = iter.next();
        chr.changeMap(bonusMap, bonusMap.getPortal(0));
//        chr.modifyCSPoints(1, 4000, true);
    }
    em.setProperty("state", "2");
    eim.restartEventTimer(40000); //2 mins for teh lulz
}

function finish(eim) {
    disposePlayerBelow(eim, 100, 990001100, "");
}

function allMonstersDead(eim) {
//do nothing; GQ has nothing to do with monster killing
}

function cancelSchedule() {
}

function timeOut() {
}

function elapsedTime(eim, time) {
    if (time == 60) {
        eim.broadcastPlayerMsg(6, "샤레니안으로 가는 문이 2분 후에 열립니다. 유적 발굴 현장에 최소 6명 이상이 입장해 있어야 합니다.")
    } else if (time == 120) {
        eim.broadcastPlayerMsg(6, "샤레니안으로 가는 문이 1분 후에 열립니다. 유적 발굴 현장에 최소 6명 이상이 입장해 있어야 합니다.")
    } else if (time == 150) {
        eim.broadcastPlayerMsg(6, "샤레니안으로 가는 문이 30초 후에 열립니다. 유적 발굴 현장에 최소 6명 이상이 입장해 있어야 합니다.")
    }
}