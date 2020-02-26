var status = 0;

function action(mode, type, selection){

	if(status == 0){
		cm.sendNext("안녕하시게나, 태공님이 운영하시는 낚시터로 모험가들을 왕복이동 시켜주고있는 최고의 항해사 애드먼드 선장님이라고 불러주게나.");
		status++;
	} else if(status == 1) {
		cm.sendYesNo("자, 낚시터로 가려면 #b#v4033919##t4033919##k이 필요하다고 낚시터에 머물수 있는 시간은 티켓 #b1장#k당 #r20분#k이라는점 명심하도록 하시게나. 자 이제 출발할텐가?");
		status++;
	} else if(status == 2) {
		cm.sendGetNumber("자네는 현재 #r"+cm.getPlayer().getItemQuantity(4033919,false)+"#k장의 낚시터 티켓을 가지고 있군. 몇장을 사용하여 이동할텐가?",1,1,100);
		status++;
	} else if(status == 3) {
	if (cm.getPlayer().getClient().getChannel() == 1) {
	if (mode == 0) {
	cm.dispose();
	return;
	}
	if (cm.haveItem(4033919,selection)) {
	cm.gainItem(4033919,-selection);
	cm.TimeMoveMap(491000000, 123456789, selection*1200);
	cm.dispose();
	} else {
	cm.sendOk("뭐야! 자네는 #r"+selection+"장#k의 낚시터 티켓을 보유중이지 않군.");
	cm.dispose();
	}
	} else {
	cm.sendOk("낚시터는 1채널 에서만 이용할수 있다는구먼.");
	cm.dispose();
	}
	}
}
