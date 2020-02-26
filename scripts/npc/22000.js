var status = 0;
var Fh = new Array(31000,31040,31050);
var Fhr = Math.floor(Math.random()*Fh.length);
var Ff = new Array(21000,21001,21002);
var Ffr = Math.floor(Math.random()*Ff.length);

function action(mode, type, selection){
	if(status == 0){
		cm.sendYesNo("안녕하세요 #r#eneedfix#n#k 에 입문하신것을 환영합니다. 저희는 항상 색다른 패치와 최상의 서비스로 #b#e"+cm.getPlayer().getName()+"#n#k 님에게 다가갈것을 약속드립니다. 자 여행의 준비가 완료되셨다면 확인을 눌러주세요.");
		status++;
	} else if(status == 1) {
		cm.sendSimple("자, 모험을 시작하기 전에 플레이할 캐릭터의 직업군을 선택해주시기 바랍니다 한번 선택한 직업군은 영구적으로 변경할수 없으니 신중하게 선택해주세요.\r\n#b#L0#모험가 직업군#k#l\r\n#L1##r사황 직업군(준비중)#l");
		status++;
	} else if(status == 2) {
		if (selection == 0) {
		cm.sendSimple("자, 모험을 시작하기 전에 플레이할 캐릭터의 성별을 선택해주시기 바랍니다 한번 선택한 성별은 영구적으로 변경할수 없으니 신중하게 선택해주세요.\r\n#b#L0#남성 캐릭터#k#l\r\n#L1##r여성 캐릭터#l");
		status++;
		} else {
		//cm.changeJob(1000);
		//cm.sendSimple("자, 모험을 시작하기 전에 플레이할 캐릭터의 성별을 선택해주시기 바랍니다 한번 선택한 성별은 영구적으로 변경할수 없으니 신중하게 선택해주세요.\r\n#b#L0#남성 캐릭터#k#l\r\n#L1##r여성 캐릭터#l");
                cm.sendNext("사황 직업군은 현재 준비중이며, 모험가 캐릭터만 생성 가능합니다. 추후 특별한 조건을 달성할 시 생성 가능하게 할 예정입니다.");
		//status++;
                cm.dispose();
		}
	} else if(status == 3) {
	var customData = cm.getQuestRecord(50011);
	var customNew = cm.getQuestRecord(55551);
	if(customData.getCustomData() == null){ 
		customData.setCustomData("0");
		customNew.setCustomData("뉴비");
	}
	if (selection == 0) {
		customData.setCustomData("남자");
		cm.getPlayer().setGender(0);
		cm.TimeMoveMap(490000001, 100000000, 90);
		cm.getPlayer().ServerNotice("바실리 : "+cm.getPlayer().getName()+"(남)님이 needfix 시작의 배에 탑승하였습니다. 모두 환영해주세요.")
		cm.sendOk("모험을 시작하기전 몇가지 중요한 #rTIP#k을 알려드립니다.\r\n#b1.#k캐쉬샵 버튼을 누르면 광장으로이동할수있다.\r\n#b2.#k헤네시스 택시앞에 초기자금퀘스트가 있다.\r\n#b3.#k@랙 , @저장 , @주문의흔적 유저 명령어가있다.");
		cm.dispose();
	} else if (selection == 1) {
		customData.setCustomData("여자");
		cm.gainItem(1041002,1);
		cm.gainItem(1061002,1);
		cm.getPlayer().setHair(Fh[Fhr]);
		cm.getPlayer().setFace(Ff[Ffr]);
		cm.getPlayer().setGender(1);
		cm.getPlayer().reloadChar();
		cm.TimeMoveMap(490000001, 100000000, 90);
		cm.getPlayer().ServerNotice("바실리 : "+cm.getPlayer().getName()+"(여)님이 needfix 시작의 배에 탑승하였습니다. 모두 환영해주세요.")
		cm.sendOk("모험을 시작하기전 몇가지 중요한 #rTIP#k을 알려드립니다.\r\n#b1.#k캐쉬샵 버튼을 누르면 광장으로이동할수있다.\r\n#b2.#k헤네시스 택시앞에 초기자금퀘스트가 있다.\r\n#b3.#k@랙 , @저장 , @주문의흔적 유저 명령어가있다.");
		cm.dispose();
		}
	}
}
