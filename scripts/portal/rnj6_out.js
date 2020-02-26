function enter(pi) {
    var em = pi.getEventManager("Romeo");
    if (em != null && em.getProperty("stage5").equals("2")) {
            pi.playPortalSE();
	pi.warp(926100300,0);
    } else {
	pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}