function enter(pi) {
    if (pi.getPlayerCount(920010910) > 0 || pi.getPlayerCount(920010911) > 0 || pi.getPlayerCount(920010912) > 0) {
        pi.playerMessage("이미 감옥에 누군가가 들어가 있습니다.");
        return;
    }
    pi.warp(920010920,0);
}