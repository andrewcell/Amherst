var status = -1;

function action(mode, type, selection) {
    status++;
    if (status == 0) {
        cm.sendNext("내 연구를... 내 연구를... 세상에.... 알려야......\r\n(유레테는 더 이상 말을 할 수 없다.)")
    } else if (status == 1) {
        cm.removeAll(4001130);
        cm.removeAll(4001131);
        cm.removeAll(4001132);
        cm.removeAll(4001133);
        cm.removeAll(4001134);
        cm.removeAll(4001135);
        cm.warp(926100600, 0);
        cm.dispose();
    }
}