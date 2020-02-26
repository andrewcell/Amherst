function init() {
    em.setProperty("noEntry","false");
}

function setup(eim) {
     em.setProperty("noEntry","true");
    var eim = em.newInstance("MachineRoom");
    var mapz = eim.setInstanceMap(922000000);
    mapz.resetFully();
    mapz.shuffleReactors();
    eim.startEventTimer(600000);
    return eim;
}

function playerEntry(eim, player) {
    player.changeMap(eim.getMapInstance(0), eim.getMapInstance(0).getPortal(0));
}

function changedMap(eim, player, mapid) {
	if (mapid != 922000000) {	
		clear(eim);
	}
}

function playerExit(eim, player) {
    clear(eim);
}

function scheduledTimeout(eim) {
    clear(eim);
}

function playerDisconnected(eim, player) {
    em.setProperty("noEntry","false");
    player.getMap().removePlayer(player);
    eim.unregisterPlayer(player);
    player.setMap(em.getChannelServer().getMapFactory().getMap(220020000));
    eim.dispose();
}

function clear(eim) {
    em.setProperty("noEntry","false");
    var player = eim.getPlayers().get(0);
    eim.unregisterPlayer(player);
    player.changeMap(em.getChannelServer().getMapFactory().getMap(220020000), em.getChannelServer().getMapFactory().getMap(220020000).getPortal("q000"));
    eim.dispose();
}

function cancelSchedule() {
}