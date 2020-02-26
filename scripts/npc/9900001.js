var status = 0;

function action(mode, type, selection) {
	if(status == 0){
		cm.sendSimple("\r\n#L910000001# 자유시장 #b1-1#k (헤네시스)방 으로 이동한다.#l\r\n#L910000007# 자유시장 #b1-7#k (루디브리엄)방 으로 이동한다.#l\r\n#L910000013# 자유시장 #b2-3#k (페리온)방 으로 이동한다.#l\r\n#L910000018# 자유시장 #b2-8#k (엘나스)방 으로 이동한다.#l\r\n");
		status++;
	} else if (status == 1) {
	cm.warp(selection);
	cm.dispose();
	}
}