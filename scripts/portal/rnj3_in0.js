function enter(pi) {
    if (pi.getMap().getReactorByName("rnj3_out1").getState() > 0) {
        pi.playPortalSE();
        pi.warp(926100201, 1);
    } else {
        pi.playerMessage(5, "지금은 포탈이 닫혀있습니다.");
    }
}