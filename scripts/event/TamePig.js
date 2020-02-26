function init() {
    em.setProperty("state", "0");
}

function setup(eim) {
    em.setProperty("state", "1");
    var eim = em.newInstance("TamePig");
    var map = eim.setInstanceMap(923010000);
    map.resetFully();
    map.killMonster(9300102);
    var mob = em.getMonster(9300102); // Tame Pig
    eim.registerMonster(mob);
    map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(-26, 335));
    eim.startEventTimer(300000);
    eim.broadcastPlayerMsg(6, "멧돼지를 외계인으로 부터 보호하고, 페로몬과 연구 보고서를 회수하세요!");
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapFactory().getMap(923010000);
    player.changeMap(map, map.getPortal(0));
}

function changedMap(eim, player, mapid) {
    if (mapid != 923010000) {
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
    player.changeMap(em.getChannelServer().getMapFactory().getMap(923010100), em.getChannelServer().getMapFactory().getMap(923010100).getPortal("sp"));
    eim.dispose();
}

function monsterValue(eim, mobId) {
    if (mobId == 9300102) {
	allMonstersDead(eim);
    }
    return 1;
}

function playerExit(eim, player) {
    end(eim);
}

function allMonstersDead(eim) {
    eim.broadcastPlayerMsg(6, "멧돼지를 보호하는데 실패하였습니다.");
    end(eim);
}

function playerRevive(eim, player) {
    return false;
}

function clearPQ(eim) {}
function leftParty (eim, player) {}
function disbandParty (eim) {}
function playerDead(eim, player) {}
function cancelSchedule() {}