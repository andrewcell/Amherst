function enter(pi) {
    if (pi.getMap().getReactorByName("jnr3_out2").getState() > 0) {
        pi.playPortalSE();
	pi.warp(926110202,1);
    } else {
	pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}