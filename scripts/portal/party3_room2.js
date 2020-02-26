//창고

function enter(pi) {
    var em = pi.getEventManager("OrbisPQ");
    if (em == null) {
        pi.warp(920011200);
    }
    if (em.getProperty("stage2clear") != null && em.getProperty("stage2clear").equals("clear")) {
        pi.playerMessage(5, "이곳은 이미 클리어한 방입니다.");
        return;
    }
    
    if (pi.getPlayer().getParty() != null && pi.isLeader()) {
        pi.playPortalSE();
        pi.warp(920010300, "st00");
        pi.partyMessage(6, "파티장이 <창고> 에 입장하였습니다.");
    } else {
        if (pi.getPlayerCount(920010300) > 0) {
            pi.playPortalSE();
            pi.warp(920010300, "st00");
        } else {
            pi.playerMessage(5,"파티장이 먼저 입장해야 합니다.");
        }
        
    }
}