importPackage(Packages.server.life);
importPackage(java.lang);

var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
	if (cm.getPlayer().getMapId() == 123456789) {
	    cm.sendSimple("#e#r<극한의 직업 : needfix편>#k#n\r\n아...안녕하세요... 때..때리지마세요...형... 좀...좀더좋은 컨..텐츠 가지..고올게요...형..죄송해....해요...때...때리지..아아아아아아악!!!");
	} else {
    cm.sendOk("안녕하세요? 저는 레벨 200을 달성 했습니다.  레벨 200을 달성하기란 정말 어려운 일이였지요. 수많은 고난과 시련을 겪고 저는 드디어 레벨 200이라는 지존의 자리에 등극했답니다. 여러분도 노력하시면 지존의 자리에 오르실 수 있을거에요. 화이팅~");
    cm.dispose();
	}
    } else if (status == 1) {
	var q = cm.getQuestRecord(199918);
	if (q.getCustomData() == null) {
		q.setCustomData("0");
	}
        var t = Long.parseLong(q.getCustomData());
	if (t + 86400000 < System.currentTimeMillis()) {
		PlayerNPC.sendBroadcastModifiedNPC(cm.getPlayer(), cm.getPlayer().getMap(), cm.getNpc(), true);
		q.setCustomData(System.currentTimeMillis()+"");
		cm.sendOk("업데이트 요청이 완료되었습니다. 잠시 후 엔피시 외형이 변경됩니다.");
		cm.dispose();
	} else {
		cm.sendOk("캐릭터는 24시간마다 한번씩만 업데이트가 가능합니다.");
		cm.safeDispose();
	}
    }





//안녕하세요? 저는 레벨 200을 달성 했습니다.  레벨 200을 달성하기란 정말 어려운 일이였지요. 수많은 고난과 시련을 겪고 저는 드디어 레벨 200이라는 지존의 자리에 등극했답니다. 여러분도 노력하시면 지존의 자리에 오르실 수 있을거에요. 화이팅~
    
}