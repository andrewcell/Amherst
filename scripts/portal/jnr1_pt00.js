function enter(pi) {
    var em = pi.getEventManager("Juliet");
    if (em != null && em.getProperty("stage1").equals("1")) {
        pi.playPortalSE();
	pi.warp(926110001,0);
    } else {
	pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}