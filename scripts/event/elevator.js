function init() {
    scheduleNew();
}

function scheduleNew() {
    waitingToDown();
}

/*
 * mapcode 
 * 99층 : 222020200
 * 엘리베이터 아랫마을행 : 222020210
 * 운행중 아랫마을행 : 222020211
 * 2층 : 222020100
 * 엘리베이터 루디브리엄행 : 222020110
 * 운행중 루디브리엄행 : 222020111
 */

function waitingToDown() {
    em.warpAllPlayer(222020111, 222020200);
    em.schedule("runToDown", 50000);
    em.getChannelServer().getMapFactory().getMap(222020200).resetReactors();
    em.getChannelServer().getMapFactory().getMap(222020100).setReactorState();
}

function runToDown() {
    em.warpAllPlayer(222020210, 222020211);
    em.schedule("waitingToUp", 60000);
    em.getChannelServer().getMapFactory().getMap(222020200).setReactorState();
}

function waitingToUp() {
    em.warpAllPlayer(222020211, 222020100);
    em.schedule("runToUp", 50000);
    em.getChannelServer().getMapFactory().getMap(222020100).resetReactors();
}

function runToUp() {
    em.warpAllPlayer(222020110, 222020111);
    em.schedule("waitingToDown", 60000);
    em.getChannelServer().getMapFactory().getMap(222020100).setReactorState();
}

//222020111 + 루디브리엄행
//222020211 + 아랫마을행



function cancelSchedule() {
}