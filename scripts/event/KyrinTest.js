/*
 * 해적의 시험장
 */

function init() {
    em.setProperty("entry_1_1", "0");
    em.setProperty("entry_1_2", "0");
    em.setProperty("entry_2_1", "0");
    em.setProperty("entry_2_2", "0");
    // Entry : startInstance_Solo("1" ~ "4", chr);
}

function monsterValue(eim, mobId) {
    return 1;
}

function setup(value) {
    if (value.equals("1")) {
        em.setProperty("entry_1_1", "1");
        var eim = em.newInstance("KyrinTest_1_1");
        eim.setInstanceMap(108000502).resetFully();
        eim.setProperty("value", "1");
        eim.startEventTimer(600000);
    } else if (value.equals("2")) {
        em.setProperty("entry_1_2", "1");
        var eim = em.newInstance("KyrinTest_1_2");
        eim.setInstanceMap(108000503).resetFully();
        eim.setProperty("value", "2");
        eim.startEventTimer(600000);
    } else if (value.equals("3")) {
        em.setProperty("entry_2_1", "1");
        var eim = em.newInstance("KyrinTest_2_1");
        eim.setInstanceMap(108000500).resetFully();
        eim.setProperty("value", "3");
        eim.startEventTimer(600000);
    } else if (value.equals("4")) {
        em.setProperty("entry_2_2", "1");
        var eim = em.newInstance("KyrinTest_2_2");
        eim.setInstanceMap(108000501).resetFully();
        eim.setProperty("value", "4");
        eim.startEventTimer(600000);
    }
    return eim;
}

function playerEntry(eim, player) {
    var value = eim.getProperty("value");
    if (value.equals("1")) {
        var map = eim.getMapFactory().getMap(108000502);
        player.changeMap(map, map.getPortal(0));
    }
    if (value.equals("2")) {
        var map = eim.getMapFactory().getMap(108000503);
        player.changeMap(map, map.getPortal(0));
    }
    if (value.equals("3")) {
        var map = eim.getMapFactory().getMap(108000500);
        player.changeMap(map, map.getPortal(0));
    }
    if (value.equals("4")) {
        var map = eim.getMapFactory().getMap(108000501);
        player.changeMap(map, map.getPortal(0));
    }
}

function playerDead(eim, player) {
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
    var value = eim.getProperty("value");
    eim.disposeIfPlayerBelow(100, 120000101);
    if (value.equals("1")) {
        em.setProperty("entry_1_1", "0");
    } else if (value.equals("2")) {
        em.setProperty("entry_1_2", "0");
    } else if (value.equals("3")) {
        em.setProperty("entry_2_1", "0");
    } else if (value.equals("4")) {
        em.setProperty("entry_2_2", "0");
    }
}

function changedMap(eim, player, mapid) {
    if (mapid < 108000500 || mapid > 108000503) {
        var value = eim.getProperty("value");
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            if (value.equals("1")) {
                em.setProperty("entry_1_1", "0");
            } else if (value.equals("2")) {
                em.setProperty("entry_1_2", "0");
            } else if (value.equals("3")) {
                em.setProperty("entry_2_1", "0");
            } else if (value.equals("4")) {
                em.setProperty("entry_2_2", "0");
            }
        }
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function leftParty(eim, player) {
}

function disbandParty(eim) {
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    var map = eim.getMapFactory().getMap(120000101);
    player.changeMap(map, map.getPortal(0));
}

function clearPQ(eim) {
}

function allMonstersDead(eim) {
//has nothing to do with monster killing
}

function cancelSchedule() {
}
