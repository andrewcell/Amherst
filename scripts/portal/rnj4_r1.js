function enter(pi) {
    var em = pi.getEventManager("Romeo");
    if (em != null && em.getProperty("stage6_0").equals("0")) {
            pi.playPortalSE();
	pi.warp(926100301,0);
	em.setProperty("stage6_0", "1");
    } else {
	pi.playerMessage(5, "이미 누군가가 이 포탈 안에 들어가 있습니다.");
    }
}