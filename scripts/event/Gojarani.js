function init() {
    em.newInstance("Gojarani");
    em.setProperty("max_instances", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(value) {
    var eim = em.getInstance("Gojarani");
    if (eim == null) {
        eim = em.newInstance("Gojarani");
    }
    return eim;
}

function playerEntry(eim, player) {
    var canEntryMap = eim.createInstanceMapS(103000004);
    canEntryMap.resetFully();
    canEntryMap.spawnNpc(1052004, new java.awt.Point(-70, 95));
    canEntryMap.getPortal(2).setScriptName("goja_out");
    canEntryMap.getPortal(3).setScriptName("goja_out");
    player.changeMap(canEntryMap, canEntryMap.getPortal(0));
}

function playerDead(eim, player) {
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
}

function changedMap(eim, player, mapid) {
    if (mapid != 103000004) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
        }
    }
}

function playerDisconnected(eim, player) {
    player.setMap(eim.getMapInstance(200000204));
    player.setMap(200000204);
    return 0;
}

function leftParty(eim, player) {
    // If only 2 players are left, uncompletable:
    playerExit(eim, player);
}

function disbandParty(eim) {
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    var map = eim.getMapFactory().getMap(200000204);
    player.changeMap(map, map.getPortal(0));
}

function clearPQ(eim) {
}

function allMonstersDead(eim) {
//has nothing to do with monster killing
}

function cancelSchedule() {
}