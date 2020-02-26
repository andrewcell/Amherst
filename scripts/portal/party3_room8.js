//암흑의 방

function enter(pi) {
    var em = pi.getEventManager("OrbisPQ");
    if (em == null) {
        pi.warp(920011200);
    }
    
    if (pi.getPlayer().getParty() != null && pi.isLeader()) {
        pi.playPortalSE();
        pi.warp(920011000, "st00");
        pi.partyMessage(6, "파티장이 <암흑의 방> 에 입장하였습니다.");
    } else {
        if (pi.getPlayerCount(920011000) > 0) {
            pi.playPortalSE();
            pi.warp(920011000, "st00");
        } else {
            pi.playerMessage(5,"파티장이 먼저 입장해야 합니다.");
        }
        
    }
}