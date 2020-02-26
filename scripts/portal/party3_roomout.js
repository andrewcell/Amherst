function enter(pi) {
    if (pi.getPlayer().getParty() != null && pi.isLeader()) {
        var fieldid = pi.getPlayer().getMapId();
        if (fieldid == 920010200) {
            portal = 4;
            name = "<산책로>";
        } else if (fieldid == 920010300) {
            portal = 12;
            name = "<창고>";
        } else if (fieldid == 920010400) {
            portal = 5;
            name = "<휴게실>";
        } else if (fieldid == 920010500) {
            portal = 13;
            name = "<봉인된 방>";
        } else if (fieldid == 920010600) {
            portal = 15;
            name = "<라운지>";
            for (var i = 920010601; i <= 920010604; ++i) {
                if (pi.getPlayerCount(i) > 0) {
                    pi.playerMessage("객실에 파티원이 입장하고 있어 지금은 퇴장할 수 없습니다.");
                    return;
                }
            }
        } else if (fieldid == 920010700) {
            portal = 14;
            name = "<올라가는 길>";
        } else if (fieldid == 920011000) {
            portal = 16;
            name = "<암흑의 방>";
        }
        pi.warpParty(920010100, portal);
        pi.partyMessage(6, "파티장이 " + name + " 에서 퇴장하였습니다.")
        pi.playPortalSE();
    } else {
        pi.playerMessage(5,"파티장이 먼저 이곳에서 퇴장해야 합니다.");
    }
}