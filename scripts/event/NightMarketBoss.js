function init() {
    em.setProperty("state", "0");
}

function setup(eim) {
    em.setProperty("state", "1");
    var eim = em.newInstance("NightMarketBoss");
    var map = eim.setInstanceMap(741020101).resetFully();
    eim.startEventTimer(900000);
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapFactory().getMap(741020101);
    player.changeMap(map, map.getPortal(0));
}

function changedMap(eim, player, mapid) {
    if (mapid != 741020101) {
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
    player.changeMap(em.getChannelServer().getMapFactory().getMap(741020100), em.getChannelServer().getMapFactory().getMap(741020100).getPortal("sp"));
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