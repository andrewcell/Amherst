var exitMap = 0;
var waitingMap = 1;
var reviveMap = 2;
var fieldMap = 3;
var winnerMap = 4;
var loserMap = 5;

function init() {
}

function monsterValue(eim, mobId) {
    return 1;
}


function setup(mapid) {
    var map = parseInt(mapid);
    var eim = em.newInstance("cpq" + mapid);
    eim.setInstanceMap(980000000); // <exit>
    eim.setInstanceMap(map);
    eim.setInstanceMap(map+2);
    eim.setInstanceMap(map+1).resetFully();
    eim.setInstanceMap(map+3);
    eim.setInstanceMap(map+4);
    eim.setProperty("forfeit", "false");
    eim.setProperty("blue", "-1");
    eim.setProperty("red", "-1");
    var portal = eim.getMapInstance(reviveMap).getPortal("pt00");
    portal.setScriptName("MCrevive1");
    //em.schedule("timeOut", 30 * 60000);
    eim.setProperty("started", "false");
    return eim;
}

function playerEntry(eim, player) {
    player.changeMap(eim.getMapInstance(waitingMap), eim.getMapInstance(waitingMap).getPortal(0));
}


function registerCarnivalParty(eim, carnivalParty) {
    if (eim.getProperty("red").equals("-1")) {
        eim.setProperty("red", carnivalParty.getLeader().getId() + "");
        eim.setProperty("progress", "waiting");
        // display message about recieving invites for next 3 minutes;
        eim.startEventTimer(180000);
        eim.broadcastPlayerMsg(6, "카니발 파티 대기가 시작되었습니다. 3분동안 아무런 도전이 없을 경우 나가지게 됩니다.")
    //        clock(eim, 180);
    //        eim.schedule("end", 3 * 60 * 1000); // 3 minutes
    } else {
        eim.setProperty("progress", "ready");
        eim.setProperty("blue", carnivalParty.getLeader().getId() + "");
        eim.restartEventTimer(10000);
        eim.broadcastPlayerMsg(6, "10초 후 대결이 시작됩니다! 모두 준비해 주세요!")
    //        eim.schedule("start", 10000);
    //        clock(eim, 10);
    }
}

function playerDead(eim, player) {
}

function leftParty(eim, player) {
    disbandParty(eim);
}

function disbandParty(eim) {
    //if (eim.getProperty("started").equals("true")) {
    //    warpOut(eim);
    //} else {
    disposeAll(eim);
//}
}

function disposeAll(eim) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        var player = iter.next();
        eim.unregisterPlayer(player);
        player.changeMap(eim.getMapInstance(exitMap), eim.getMapInstance(exitMap).getPortal(0));
        player.getCarnivalParty().removeMember(player);
    }
    eim.dispose();
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.getCarnivalParty().removeMember(player);
    player.changeMap(eim.getMapInstance(exitMap), eim.getMapInstance(exitMap).getPortal(0));
    java.lang.System.out.println("exit");
    eim.disposeIfPlayerBelow(0, 0);
}

//for offline players
function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getCarnivalParty().removeMember(player);
    player.getMap().removePlayer(player);
    player.setMap(eim.getMapInstance(exitMap));
    java.lang.System.out.println("remove");
    eim.disposeIfPlayerBelow(0, 0);
}


function getParty(eim, property) {
    var chr = em.getChannelServer().getPlayerStorage().getCharacterById(parseInt(eim.getProperty(property)));
    if (chr == null) {
        eim.broadcastPlayerMsg(5, "" + property + " 팀 파티장을 발견하지 못하여 전원 퇴장되었습니다.");
        disposeAll(eim);
        return null;
    } else {
        return chr.getCarnivalParty();
    }
}

function start(eim) {
    eim.setProperty("started", "true");
    eim.setProperty("progress", "start");
    eim.restartEventTimer(10 * 60 * 1000);
    getParty(eim, "blue").warp(eim.getMapInstance(fieldMap), "blue00");
    getParty(eim, "red").warp(eim.getMapInstance(fieldMap), "red00");
    eim.broadcastPlayerMsg(6, "몬스터 카니발이 시작되었습니다!");
}

function monsterKilled(eim, chr, cp) {
    chr.getCarnivalParty().addCP(chr, cp);
    chr.CPUpdate(false, chr.getAvailableCP(), chr.getTotalCP(), 0);
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        iter.next().CPUpdate(true, chr.getCarnivalParty().getAvailableCP(), chr.getCarnivalParty().getTotalCP(), chr.getCarnivalParty().getTeam());
    }
}

function monsterValue(eim, mobId) {
    return 0;
}


function end(eim) {
    if (!eim.getProperty("started").equals("true")) {
        disposeAll(eim);
    }
}

function clock(eim, time) {
    eim.broadcastPacket(Packages.tools.MaplePacketCreator.getClock(time));
}

function warpOut(eim) {
    if (!eim.getProperty("started").equals("true")) {
        if (eim.getProperty("blue").equals("-1")) {
            disposeAll(eim);
        }
    } else {
        var blueParty = getParty(eim, "blue");
        var redParty = getParty(eim, "red");
        if (blueParty.isWinner()) {
            blueParty.warp(eim.getMapInstance(winnerMap), 0);
            redParty.warp(eim.getMapInstance(loserMap), 0);
        } else {
            redParty.warp(eim.getMapInstance(winnerMap), 0);
            blueParty.warp(eim.getMapInstance(loserMap), 0);
        }
        eim.disposeIfPlayerBelow(100,0);
    }
}

function scheduledTimeout(eim) {
    eim.stopEventTimer();
    if (eim.getProperty("progress").equals("waiting")) {
        end(eim);
    } else if (eim.getProperty("progress").equals("ready")) {
        start(eim);
    } else if (eim.getProperty("progress").equals("start")) {
        var blueParty = getParty(eim, "blue");
        var redParty = getParty(eim, "red");
        if (blueParty.getTotalCP() > redParty.getTotalCP()) {
            blueParty.setWinner(true);
        } else if (redParty.getTotalCP() > blueParty.getTotalCP()) {
            redParty.setWinner(true);
        }
        blueParty.displayMatchResult();
        redParty.displayMatchResult();
        eim.restartEventTimer(10000);
        eim.setProperty("progress", "reward");
    } else if (eim.getProperty("progress").equals("reward")) {
        warpOut(eim);
    }
}

function playerRevive(eim, player) {
    player.addHP(player.getStat().getMaxHp() / 2);
    player.addMP(player.getStat().getMaxMp() / 2);
    player.changeMap(eim.getMapInstance(reviveMap), eim.getMapInstance(reviveMap).getPortal(0));
    return true;
}

function playerDisconnected(eim, player) {
    player.setMap(eim.getMapInstance(exitMap));
    eim.unregisterPlayer(player);
    player.getCarnivalParty().removeMember(player);
    eim.broadcastPlayerMsg(5, player.getName() + "님이 몬스터 카니발에서 나가셨습니다.");
    disposeAll(eim);
}

function onMapLoad(eim, chr) {
    if (chr.getCarnivalParty() != null && chr.getMapId() % 10 != 0) {
        if (!eim.getProperty("started").equals("true")) {
            disposeAll(eim);
        } else if (chr.getCarnivalParty().getTeam() == 0) {
            var blueParty = getParty(eim, "blue");
            chr.startMonsterCarnival(blueParty.getAvailableCP(), blueParty.getTotalCP());
        } else {
            var redParty = getParty(eim, "red");
            chr.startMonsterCarnival(redParty.getAvailableCP(), redParty.getTotalCP());
        }
    }
}

function cancelSchedule() {
}

function clearPQ(eim) {
}

function allMonstersDead(eim) {
}

function changedMap(eim, chr, mapid) {
}
