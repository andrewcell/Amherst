/**
	생명의 동굴 파티퀘스트
*/
var minPlayers = 5;
var maps = [240050100, 240050101, 240050101, 240050102, 240050103, 240050104, 240050105, 240050200, 240050300, 240050310];


function init() {
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(level, leaderid) {
    em.setProperty("state", "1");
    var eim = em.newInstance("HorntailPQ");
    for (var i = 0; i < maps.length; ++i) {
        var map = eim.setInstanceMap(maps[i]);
        map.resetFully();
    }
    eim.startEventTimer(1800000); //30 mins
    return eim;
}

function scheduledTimeout(eim) {
    end(eim);
}

function end(eim) {
    var a = eim.getProperty("allfinish") == null;
    eim.disposeIfPlayerBelow(a ? 5 : 100, a ? 240050500 : 240050400);
    if (a) {
        em.setProperty("state", "0");
    }
}

function changedMap(eim, player, mapid) {
    if (mapid >= 240050100 && mapid <= 240050310) {
        return;
    }
    eim.unregisterPlayer(player);
    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
    }
}

function playerEntry(eim, player) {
    var map = em.getMapFactory().getMap(240050100);
    player.changeMap(map, map.getPortal(0));
}

function playerRevive(eim, player) {
}

function playerDisconnected(eim, player) {
    return -3;
}

function leftParty(eim, player) {			
    // If only 2 players are left, uncompletable
    if (eim.disposeIfPlayerBelow(minPlayers, 240050500)) {
        em.setProperty("state", "0");
    } else {
        playerExit(eim, player);
    }
}

function disbandParty(eim) {
    // Boot whole party and end
    end(eim);
}

function playerExit(eim, player) {
    var map = em.getMapFactory().getMap(240050500);
    eim.unregisterPlayer(player);
    player.changeMap(map, map.getPortal(0));
}

// For offline players
function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
}

function clearPQ(eim) {
    end(eim);
}

function finish(eim) {
    end(eim);
}

function timeOut(eim) {
    end(eim);
}

function cancelSchedule() {}
function playerDead() {}
function allMonstersDead(eim) {}