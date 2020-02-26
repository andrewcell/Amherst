function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
    resetGate();
}

function setup(eim, leaderid) {
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    var eim = em.newInstance("ZakumBattle" + leaderid);
    resetGate();
    eim.setInstanceMap(280030000).resetFully();
    return eim;
}

function resetGate() {
    em.getMapFactory().getMap(211042300).getReactorById(2118002).forceHitReactor(0);
    em.setProperty("battle", "0");
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    //원정대 조직 남은 시간 표시
    player.getClient().getSession().write(Packages.tools.MaplePacketCreator.getClock(java.lang.Math.floor(player.getClient().getChannelServer().getMapleSquad("ZAK").getTimeLeft() / 1000)));
}

function playerRevive(eim, player) {
    return false;
}

function changedMap(eim, player, mapid) {
    if (mapid != 280030000) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("leader", "true");
            em.setProperty("state", "0");
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
        em.setProperty("leader", "true");
        em.setProperty("state", "0");
        resetGate();
    }
}

function end(eim) {
    eim.disposeIfPlayerBelow(100, 211042300);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
    resetGate();
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
    if (em.getProperty("state").equals("1")) {
        em.setProperty("state", "2");
    } else if (em.getProperty("state").equals("2")) {
        em.setProperty("state", "3");
    }
}

function leftParty (eim, player) {}
function disbandParty (eim) {}
function playerDead(eim, player) {}
function cancelSchedule() {}