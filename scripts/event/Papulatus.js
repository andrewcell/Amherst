function init() {
    resetGate();
}

function setup(eim, leaderid) {
    resetGate();
    eim.setInstanceMap(220080001).resetFully();
    return eim;
}

function resetGate() {
    em.getMapFactory().getMap(220080000).getReactorById(2208001).forceHitReactor(0);
    em.setProperty("battle", "0");
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
}

function playerRevive(eim, player) {
    return false;
}

function changedMap(eim, player, mapid) {
    if (mapid != 220080001) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            resetGate();
        }
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function scheduledTimeout(eim) {
    end(eim);
}

function monsterValue(eim, mobId) {
    return 1;
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    if (eim.disposeIfPlayerBelow(0, 0)) {
        resetGate();
    }
}

function end(eim) {
    eim.disposeIfPlayerBelow(100, 220080000);
    resetGate();
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty (eim, player) {}
function disbandParty (eim) {}
function playerDead(eim, player) {}
function cancelSchedule() {}