var minPlayers = 2;

function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function setup(level, leaderid) {
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    
    em.setProperty("stage1_cleareff", "0");
    
    var eim = em.newInstance("Ellin" + leaderid);

    eim.setInstanceMap(930000000).resetPQ(level);
    var map = eim.setInstanceMap(930000100);
    map.resetPQ(level);
    var mob_it = map.getAllMonstersThreadsafe().iterator();
    while (mob_it.hasNext()) {
        var mob_next = mob_it.next();
        eim.registerMonster(mob_next);
    }
    eim.setInstanceMap(930000200).resetPQ(level);
    eim.setInstanceMap(930000300).resetPQ(level);
    eim.setInstanceMap(930000400).resetPQ(level);
    map = eim.setInstanceMap(930000500);
    map.resetPQ(level);
    map.shuffleReactors();
    eim.setInstanceMap(930000600).resetPQ(level);
    eim.setInstanceMap(930000700).resetPQ(level);

    eim.startEventTimer(1800000); //30 mins
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1206);
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
    end(eim);
}

function changedMap(eim, player, mapid) {
    if (mapid < 930000000 || mapid > 930000700) {
        eim.unregisterPlayer(player);

        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("state", "0");
            em.setProperty("leader", "true");
        }
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function monsterValue(eim, mobId) {
    if (mobId == 9300172) {
        if (eim.getMapInstance(930000100).getAllMonstersThreadsafe().size() == 0 && em.getProperty("stage1_cleareff").equals("0")) {
            eim.getMapInstance(930000100).clearEffect();
            em.setProperty("stage1_cleareff", "1");
        }
    }
    return 1;
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);

    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
        em.setProperty("leader", "true");
    }
}

function end(eim) {
    eim.disposeIfPlayerBelow(100, 930000800);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty(eim, player) {
    // If only 2 players are left, uncompletable:
    end(eim);
}
function disbandParty(eim) {
    end(eim);
}
function playerDead(eim, player) {
}
function cancelSchedule() {
}