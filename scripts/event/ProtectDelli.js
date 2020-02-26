function init() {
    em.setProperty("state", "0");
    em.setProperty("protect", "0");
}

function setup() {
    em.setProperty("state", "1");
    em.setProperty("protect", "0");

    var eim = em.newInstance("ProtectDelli");
    var map = eim.setInstanceMap(925010300);
    map.resetFully();
    map.killMonster(9300162);
    var mob = em.getMonster(9300162);
    eim.registerMonster(mob);
    map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(18, 333));
    map.getPortal(2).setScriptName("s4mind_end");
    
    map = eim.setInstanceMap(925010000);
    map.resetFully();
    map = eim.setInstanceMap(925010100);
    map.resetFully();
    map = eim.setInstanceMap(925010200);
    map.resetFully();

    eim.startEventTimer(1200000);
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapFactory().getMap(925010000);
    player.changeMap(map, map.getPortal(0));
}

function changedMap(eim, player, mapid) {
    if (mapid > 925010300 || mapid < 925010000) {
        playerExit(eim, player);
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function scheduledTimeout(eim) {
    if (em.getProperty("protect").equals("1")) {
        eim.disposeIfPlayerBelow(100, 925010400);
        em.setProperty("state", "0");
    } else {
        eim.disposeIfPlayerBelow(100, 120000104);
        em.setProperty("state", "0");
    }
}

function monsterValue(eim, mobId) {
    if (mobId == 9300162) {
        allMonstersDead(eim);
    }
    return 1;
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
    }
}

function allMonstersDead(eim) {
    eim.disposeIfPlayerBelow(100, 120000104);
    em.setProperty("state", "0");
}

function playerRevive(eim, player) {
    return false;
}

function clearPQ(eim) {
}
function leftParty(eim, player) {
}
function disbandParty(eim) {
}
function playerDead(eim, player) {
}
function cancelSchedule() {
}