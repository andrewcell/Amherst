var status = -1;

function start(mode, type, selection) {

    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendNext("이 너머로 가면 리스항구가 있긴 한데... 너를 일단 신나게 패버리고 싶지만, 루카스님에게 추천을 받은 네녀석을 흠씬 두들겨 팰수도 없는 노릇이고..");
    } else if (status == 1) {
        qm.askAcceptDecline("흐.. 이 형님이 이번엔 특별히 인심을 쓰도록 하지. 좋아. 지금 빅토리아 아일랜드로 가고 싶어?");
    } else if (status == 2) {
        if (selection == 1) {
            qm.forceStartQuest();
            qm.dispose();
            qm.warp(104000000);
        } else {
            qm.getPlayer().addHP(-(qm.getPlayerStat("HP") - 1));
            qm.sendOk("어쭈? 이놈보게. 이 형님이 기껏 인심까지 썼는데 거절을 해?");
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {

}