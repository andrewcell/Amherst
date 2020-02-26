
function init() {
    em.setProperty("entry", "true");
}

function monsterValue(eim, mobId) {
    return 1;
}

function setClassVars(player) {
    var returnMapId;
    var monsterId;
    var mapId;
    
    if (player.job == 1210 || player.getJob() == 210 || // FP_WIZARD
        player.getJob() == 220 || // IL_WIZARD
        player.getJob() == 230) { // CLERIC
        mapId = 108010201;
        returnMapId = 100040106;
        monsterId = 9001001;
	
    } else if (player.getJob() == 1110 || player.getJob() == 110 || // FIGHTER
        player.getJob() == 120 || // PAGE
        player.getJob() == 130) { // SPEARMAN
        mapId = 108010301;
        returnMapId = 105070001;
        monsterId = 9001000;

    } else if (player.getJob() == 410 || // ASSASIN
        player.getJob() == 420) { // BANDIT
        mapId = 108010401;
        returnMapId = 107000402;
        monsterId = 9001003;

    } else if (player.getJob() == 310 || // HUNTER
        player.getJob() == 320) { // CROSSBOWMAN
        mapId = 108010101;
        returnMapId = 105040305;
        monsterId = 9001002;
    } else if (player.getJob() == 510 ||
        player.getJob() == 520) {
        mapId = 108010501;
        returnMapId = 105070200;
        monsterId = 9001004;
    }
    return new Array(mapId, returnMapId, monsterId);
}

function playerEntry(eim, player) {
    var info = setClassVars(player);
    var map = eim.setInstanceMap(info[0]);
    map.resetFully(true);
    var mapenter = eim.setInstanceMap(info[0] - 1);
    player.changeMap(mapenter, mapenter.getPortal(0));
    eim.startEventTimer(1200000); //20 mins
    em.setProperty("entry", "false");
}


function changedMap(eim, player, mapid) {
    if (mapid < 108010100 || mapid > 108010501) {
        eim.unregisterPlayer(player);
        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("entry", "true");
        }
    }
}

function playerRevive(eim, player) {}

function end(eim) {
    eim.disposeIfPlayerBelow(100, setClassVars(eim.getPlayers().get(0))[1]);
    em.setProperty("entry", "true");
}



function scheduledTimeout(eim) {
    end(eim);
}
function playerDead(eim, player) {}
function playerDisconnected(eim, player) {
    end(eim);
    return 0;
}
function allMonstersDead(eim) {}
function cancelSchedule() {}
function leftParty(eim, player) {}
function disbandParty(eim, player) {}
