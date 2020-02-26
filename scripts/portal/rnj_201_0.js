function enter(pi) {
    if (pi.getMap().getReactorByName("rnj31_out").getState() > 0) {
        pi.playPortalSE();
        pi.warp(926100200, 1);
    } else {
        pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}