var maps = [103000800, 103000801, 103000802, 103000803, 103000804, 103000805];


function init() {
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(level, leaderid) {
    em.setProperty("state", "1");
    var eim = em.newInstance("KerningPQ" + leaderid);
    for (var i = 0; i < maps.length; ++i) {
        var map = eim.setInstanceMap(maps[i]);
        map.resetFully();
        var portal = map.getPortal("next00");
        if (portal != null) {
            portal.setScriptName("enter_kpq");
        }
    }
    eim.startEventTimer(1800000);

    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1201);
}

function playerDead(eim, player) {
}

function changedMap(eim, player, mapid) {
    switch (mapid) {
        case 103000800:
        case 103000801:
        case 103000802:
        case 103000803:
        case 103000804:
        case 103000805:
            return; // Everything is fine
    }
    eim.unregisterPlayer(player);
    if (eim.disposeIfPlayerBelow(3, 103000890)) {
        em.setProperty("state", "0");
    }
}

function playerRevive(eim, player) {
}

function playerDisconnected(eim, player) {
    return -3;
}

function leftParty(eim, player) {			
    // If only 2 players are left, uncompletable
    if (eim.disposeIfPlayerBelow(4, 103000890)) {
        em.setProperty("state", "0");
    } else {
        playerExit(eim, player);
    }
}

function disbandParty(eim) {
    // Boot whole party and end
    eim.disposeIfPlayerBelow(100, 103000890);
    em.setProperty("state", "0");
}


function scheduledTimeout(eim) {
    clearPQ(eim);
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    var exit = eim.getMapFactory().getMap(103000890);
    player.changeMap(exit, exit.getPortal(0));
    if (eim.disposeIfPlayerBelow(3, 103000890)) {
        em.setProperty("state", "0");
    }
}

function clearPQ(eim) {
    // KPQ does nothing special with winners
    eim.disposeIfPlayerBelow(100, 103000890);
    em.setProperty("state", "0");
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}