//봉인된 방

function enter(pi) {
    var em = pi.getEventManager("OrbisPQ");
    if (em == null) {
        pi.warp(920011200);
    }
    if (em.getProperty("stage4clear") != null && em.getProperty("stage4clear").equals("clear")) {
        pi.playerMessage(5, "이곳은 이미 클리어한 방입니다.");
        return;
    }
    
    if (pi.getPlayer().getParty() != null && pi.isLeader()) {
        pi.playPortalSE();
        pi.warp(920010500, "st00");
        pi.partyMessage(6, "파티장이 <봉인된 방> 에 입장하였습니다.");
    } else {
        if (pi.getPlayerCount(920010500) > 0) {
            pi.playPortalSE();
            pi.warp(920010500, "st00");
        } else {
            pi.playerMessage(5,"파티장이 먼저 입장해야 합니다.");
        }
        
    }
}