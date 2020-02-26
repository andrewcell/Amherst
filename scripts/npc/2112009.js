var status = -1;

function action(mode, type, selection) {
    status++;
    if (status == 0) {
        cm.sendNext("(결국 나는 지켜내지 못하고 말았다. 이렇게 되고 만 로미오와 줄리엣을 보니 쓸쓸해졌다. 조금만 더 애썼다면 로미오와 줄리엣을 구할 수 있었을 텐데. 두사람의 안식을 위해 이곳을 떠나야 겠다.)")
    } else if (status == 1) {
        cm.removeAll(4001130);
        cm.removeAll(4001131);
        cm.removeAll(4001132);
        cm.removeAll(4001133);
        cm.removeAll(4001134);
        cm.removeAll(4001135);
        cm.getPlayer().endPartyQuest(1205);
        cm.warp(cm.getPlayer().getMapId() == 926110401 ? 926110700 : 926100700, 0);
        cm.dispose();
    }
}