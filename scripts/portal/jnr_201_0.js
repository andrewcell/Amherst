function enter(pi) {
    if (pi.getMap().getReactorByName("jnr31_out").getState() > 0) {
        pi.playPortalSE();
        pi.warp(926110200, 1);
    } else {
        pi.playerMessage(5, "지금은 포탈이 닫혀 있습니다.");
    }
}