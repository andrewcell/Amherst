/*
 * 4th Job Berserk Quest.
 * Based on Kerning City PQ script by Stereo
 * And on 4th job Rush quest script by Angel-SL
 */

function init() {
    em.setProperty("state", "0");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup() {
    em.setProperty("state", "1");
    var eim = em.newInstance("4jberserk");
    var map = eim.setInstanceMap(910500200);
    map.respawn(true);
    map.resetReactors();
    map.shuffleReactors();
    eim.startEventTimer(1200000);

    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapFactory().getMap(910500200);
    player.changeMap(map, map.getPortal(0));
}

function playerDead(eim, player) {
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
    eim.disposeIfPlayerBelow(100, 105090800);
}

function changedMap(eim, player, mapid) {
    if (mapid != 910500200) {
        eim.unregisterPlayer(player);
        em.setProperty("state", "0");
        eim.disposeIfPlayerBelow(0, 0);
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function leftParty(eim, player) {
    // If only 2 players are left, uncompletable:
    playerExit(eim, player);
}

function disbandParty(eim) {
    em.setProperty("state", "0");
    eim.disposeIfPlayerBelow(100, 105090800);
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    em.setProperty("state", "0");
    var map = eim.getMapFactory().getMap(105090800);
    player.changeMap(map, map.getPortal(0));
}

function clearPQ(eim) {
    em.setProperty("state", "0");
    eim.disposeIfPlayerBelow(100, 105090800);
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}