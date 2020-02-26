function init() {
    em.setProperty("state", "0");
}

function setup(eim) {
    em.setProperty("state", "1");
    var eim = em.newInstance("ShanghaiBoss");
    var map = eim.setInstanceMap(701010322);
    map.resetFully();
    var map2 = eim.setInstanceMap(701010323);
    map2.resetFully();
    var map3 = eim.setInstanceMap(701010324);
    map3.resetFully();
    map2.killMonster(9600009);
    var mob = em.getMonster(9600009);
    eim.registerMonster(mob);
    map2.spawnMonsterOnGroundBelow(mob, new java.awt.Point(2176, 823));
    eim.startEventTimer(600000);
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapFactory().getMap(701010322);
    player.changeMap(map, map.getPortal(0));
}

function changedMap(eim, player, mapid) {
    if (mapid != 701010322 && mapid != 701010323 && mapid != 701010324) {
	em.setProperty("state", "0");
        eim.dispose();
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function scheduledTimeout(eim) {
    eim.broadcastPlayerMsg(6, "제한시간이 다 되어 실패하였습니다.");
    end(eim);
}

function end(eim) {
    em.setProperty("state", "0");
    var player = eim.getPlayers().get(0);
    eim.unregisterPlayer(player);
    player.changeMap(em.getChannelServer().getMapFactory().getMap(701010321), em.getChannelServer().getMapFactory().getMap(701010321).getPortal("sp"));
    eim.dispose();
}

function monsterValue(eim, mobId) {
    return 1;
}

function playerExit(eim, player) {
    end(eim);
}

function allMonstersDead(eim) {
}

function playerRevive(eim, player) {
    return false;
}

function clearPQ(eim) {}
function leftParty (eim, player) {}
function disbandParty (eim) {}
function playerDead(eim, player) {}
function cancelSchedule() {}