var cx = Array(200, -300, -300, -300, 200, 200, 200, -300, -300, 200, 200, -300, -300, 200); //even = 200 odd = -300
var cy = Array(-2321, -2114, -2910, -2510, -1526, -2716, -717, -1310, -3357, -1912, -1122, -1736, -915, -3116);


function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function setup(level, leaderid) {
    em.getProperties().clear();
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    var eim = em.newInstance("OrbisPQ" + leaderid);
    eim.setInstanceMap(920010000).resetPQ(level);
    eim.setInstanceMap(920010100).resetPQ(level);
    eim.setInstanceMap(920010200).resetPQ(level);
    eim.setInstanceMap(920010300).resetPQ(level);
    var lobby = eim.setInstanceMap(920010400);
    lobby.resetPQ(level);
    lobby.shuffleReactors(2002004, 2002010);
    eim.setInstanceMap(920010500).resetPQ(level);
    eim.setInstanceMap(920010600).resetPQ(level);
    eim.setInstanceMap(920010601).resetPQ(level);
    eim.setInstanceMap(920010602).resetPQ(level);
    eim.setInstanceMap(920010603).resetPQ(level);
    eim.setInstanceMap(920010604).resetPQ(level);
    eim.setInstanceMap(920010700).resetPQ(level);
    var garden = eim.setInstanceMap(920010800);
    garden.resetPQ(level);
    garden.shuffleReactors();
    eim.setInstanceMap(920010900).resetPQ(level);
    eim.setInstanceMap(920010910).resetPQ(level);
    eim.setInstanceMap(920010911).resetPQ(level);
    eim.setInstanceMap(920010912).resetPQ(level);
    eim.setInstanceMap(920010920).resetPQ(level);
    eim.setInstanceMap(920010921).resetPQ(level);
    eim.setInstanceMap(920010922).resetPQ(level);
    eim.setInstanceMap(920010930).resetPQ(level);
    eim.setInstanceMap(920010931).resetPQ(level);
    eim.setInstanceMap(920010932).resetPQ(level);
    eim.setInstanceMap(920011000).resetPQ(level);
    eim.setInstanceMap(920011100).resetPQ(level);
    eim.startEventTimer(3600000); //60 min
    
    
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal("sp"));
    em.openNpc(player, 2013001);
    player.tryPartyQuest(1203);
}

function playerRevive(eim, player) {
}

function scheduledTimeout(eim) {
    end(eim);
}

function changedMap(eim, player, mapid) {
    if (mapid < 920010000 || mapid > 920011100) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("state", "0");
            em.setProperty("leader", "true");
        }
    } else if (mapid == 920011100) { //bonus
        em.setProperty("allfinish", "1");
        eim.restartEventTimer(60000); //minute
    }
}

function playerDisconnected(eim, player) {
    return -5;
}

function onMapLoad(eim, player) {
    if (player.getMapId() == 920010400) {
        var music = parseInt(eim.getEventManager().getProperty("stage3_music"));
        if (music == 0) {
            player.changeMusic("Bgm08/ForTheGlory");
        }
        if (music == 1) {
            player.changeMusic("Bgm11/Aquarium");
        }
        if (music == 2) {
            player.changeMusic("Bgm06/WelcomeToTheHell");
        }
        if (music == 3) {
            player.changeMusic("Bgm06/FantasticThinking");
        }
        if (music == 4) {
            player.changeMusic("Bgm02/EvilEyes");
        }
        if (music == 5) {
            player.changeMusic("Bgm10/TheWayGrotesque");
        }
        if (music == 6) {
            player.changeMusic("Bgm01/MoonlightShadow");
        }
    }
}

function monsterValue(eim, mobId) {
    if (mobId == 9300049) { //다크 네펜데스
        eim.broadcastPlayerMsg(6, "파파픽시가 나타났습니다.");
        var mob = em.getMonster(9300039);
        eim.registerMonster(mob);
        eim.getMapInstance(12).spawnMonsterOnGroundBelow(mob, new java.awt.Point(-830, 563));
    } else if (mobId == 9300040) {
        var st = em.getProperty("stage2mob");
        if (st == null) {
            em.setProperty("stage2mob", "0");
            st = "0";
        }
        var count = parseInt(st);
        var map = eim.getMapInstance(3);
        if (count < 14) {
            var mob = em.getMonster(9300040);
            eim.registerMonster(mob);
            eim.getMapInstance(3).spawnMonsterOnGroundBelow(mob, new java.awt.Point(cx[st], cy[st]));
            eim.broadcastPlayerMsg(5, "어딘가에 샐리온이 소환되었습니다.");
            count++;
            em.setProperty("stage2mob", count+"");
        } else {
            map.spawnAutoDrop(4001045, new java.awt.Point(cx[13], cy[13]));
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
    var a = em.getProperty("allfinish") == null;
    eim.disposeIfPlayerBelow(a ? 6 : 100,a ? 920011200 : 920011300);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty (eim, player) {
    if (eim.disposeIfPlayerBelow(6, 920011200)) {
        em.setProperty("state", "0");
        em.setProperty("leader", "true");
    } else {
        playerExit(eim, player);
    }
}
function disbandParty (eim) {
    end(eim);
}
function playerDead(eim, player) {}
function cancelSchedule() {}