function start() {
    cm.sendSimple("안녕하세요 저는 #p2001003#. 장식물로 나만의 크리스마스 트리를 꾸며보세요! 서두르세요 방이 얼마남지 않았어요! \n\r #b#L0#첫번째 트리방#l \n\r #L1#두번째 트리방#l \n\r #L2#세번째 트리방#l \n\r #L3#네번째 트리방#l \n\r #L4#다섯번째 트리방#l");
}

function action(mode, type, selection) {
    if (mode == 1) {
	cm.warp(209000011 + selection, 0);
    }
    cm.dispose();
}
