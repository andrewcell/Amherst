/**
	Ludibrium PQ (101st Eos Tower)
*/
var minPlayers = 5;
var maps = [922010100, 922010200, 922010201, 922010300, 922010400, 922010401, 922010402, 922010403, 922010404, 922010405, 922010500, 922010501, 922010502, 922010503, 922010504, 922010505, 922010506, 922010600, 922010700, 922010800, 922010900, 922011000];


function init() {
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(level, leaderid) {
    em.getProperties().remove("allfinish");
    em.setProperty("state", "1");
    var eim = em.newInstance("LudiPQ");
    for (var i = 0; i < maps.length; ++i) {
        var map = eim.setInstanceMap(maps[i]);
        map.resetFully();
        var portal = map.getPortal("next00");
        if (portal != null) {
            portal.setScriptName("enter_lpq");
        }
    }
    eim.startEventTimer(3600000); //60 mins
    return eim;
}

function scheduledTimeout(eim) {
    end(eim);
}

function end(eim) {
    var a = em.getProperty("allfinish") == null;
    eim.disposeIfPlayerBelow(a ? 5 : 100, a ? 922010000 : 922011100);
    if (a) {
        em.setProperty("state", "0");
    }
}

function changedMap(eim, player, mapid) {
    if (mapid > 922010000 && mapid < 922011000) {
        return;
    } else if (mapid == 922011000) { //bonus
        if (em.getProperty("allfinish") == null) {
            em.setProperty("allfinish", "1");
            eim.restartEventTimer(60000); //minute
        }
        return;
    }
    eim.unregisterPlayer(player);
    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
    }
}

function playerEntry(eim, player) {
    var map = em.getMapFactory().getMap(922010100);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1202);
}

function playerDisconnected(eim, player) {
    return -5;
}

function leftParty(eim, player) {			
    // If only 2 players are left, uncompletable
    if (eim.disposeIfPlayerBelow(6, 922010000)) {
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
    var map = em.getMapFactory().getMap(922010000);
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