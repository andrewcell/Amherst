function enter(pi) {
	if (pi.getPlayer().getParty() != null && pi.isLeader()) {
            if (pi.haveItem(4001055,1)) {
		pi.warpParty(920010100);
		pi.playPortalSE();
            } else {
                pi.playerMessage(5, "생명을 풀을 얻어야 나갈 수 있습니다.");
            }
	} else {
		pi.playerMessage(5,"파티장이 생명의 풀을 갖고 이 포탈을 사용할 수 있습니다.");
	}
}