function enter(pi) {
    if (pi.getMap().getReactorByName("jnr3_out1").getState() > 0) {
        pi.playPortalSE();
	pi.warp(926110201,1);
    } else {
	pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}