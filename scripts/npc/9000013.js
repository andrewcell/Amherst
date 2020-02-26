importPackage(Packages.database);
importPackage(Packages.server);
importPackage(Packages.handling.world);
importPackage(java.lang);
importPackage(java.util);

var status = 0;

function action(mode,type,selection) {

var customData = cm.getQuestRecord(123456);
var customPoint = cm.getQuestRecord(543398);
var PrizeCheck = cm.getQuestRecord(543399);
var cancheck = "";
var stamp = "";

if (customData.getCustomData() == null) {
customData.setCustomData("0");
}
if (customPoint.getCustomData() == null) {
customPoint.setCustomData("0");
}
if (PrizeCheck.getCustomData() == null) {
PrizeCheck.setCustomData("0");
}

var point = java.lang.Integer.parseInt(customPoint.getCustomData());
var time = java.lang.Long.parseLong(customData.getCustomData());

if (checkTime() > 0) {
cancheck = "#r"+showTime()+"#k";
} else {
cancheck = "#b출석가능#k";
}

if (point == 1) {
stamp = "#r①#k ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩";
} else if (point == 2) {
stamp = "#r① ②#k ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩";
} else if (point == 3) {
stamp = "#r① ② ③#k ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩";
} else if (point == 4) {
stamp = "#r① ② ③ ④#k ⑤ ⑥ ⑦ ⑧ ⑨ ⑩";
} else if (point == 5) {
stamp = "#r① ② ③ ④ ⑤#k ⑥ ⑦ ⑧ ⑨ ⑩";
} else if (point == 6) {
stamp = "#r① ② ③ ④ ⑤ ⑥#k ⑦ ⑧ ⑨ ⑩";
} else if (point == 7) {
stamp = "#r① ② ③ ④ ⑤ ⑥ ⑦#k ⑧ ⑨ ⑩";
} else if (point == 8) {
stamp = "#r① ② ③ ④ ⑤ ⑥ ⑦ ⑧#k ⑨ ⑩";
} else if (point == 9) {
stamp = "#r① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨#k ⑩";
} else if (point == 10) {
stamp = "#r① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩#k";
} else {
stamp = "① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩";
}

	if (status == 0) {
		if (cm.getPlayer().getLevel() >= 30) {
		cm.sendSimple("출석체크 메뉴를 선택하셨습니다. 오늘도 저희 이스트월드에 방문해주셔서 감사합니다. 매일매일 출석체크를 하시는 유저분들을 대상으로 작은 사은품을 준비했습니다.\r\n\r\n현재 나의 출석 현황 : "+stamp+"\r\n다음 출석체크까지 남은 시간 : "+cancheck+" \r\n#b#L0#지금 출석체크를 하고 싶습니다. #l\r\n#L1#오늘의 사은품을 받고 싶습니다. #l");
	 	status++;
		} else {
		cm.sendOk("정말 죄송합니다. 출석체크의 레벨제한은 #rLv.30#k 입니다.");
		cm.dispose();
		}
        } else if (status == 1) {
		if (selection == 0) {
			if(checkTime() < 0) {
			        point = java.lang.Integer.parseInt(customPoint.getCustomData());
				customData.setCustomData((System.currentTimeMillis() + (3600 * 24 * 1000))+"");
				customPoint.setCustomData((point+1)+"");
				cm.sendOk("#e#r오늘의 출석체크가 완료되었습니다!#k#n\r\n\r\n오늘도 저희 이스트월드에 방문해주셔서 감사합니다. 항상 저희 서버를 즐겨주시는 "+cm.getPlayer().getName()+"님께 #b출석포인트#k를 적립해드렸습니다. 다시 저를 눌러 사은품을 찾아가시기 바랍니다.");		
				PrizeCheck.setCustomData("안받음");
	    			cm.getPlayer().saveToDB(false,false);
				cm.dispose();
				} else {
           	 		cm.sendOk("다음 출석체크까지 남은 시간은 #r"+showTime()+"#k 입니다.");
				cm.dispose();
				}
		} else if (selection == 1) {
			if (PrizeCheck.getCustomData() == "안받음") {
			if (point == 1) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(5076000,50);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i5076000# #b아이템 확성기 50개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 2) {
				PrizeCheck.setCustomData("받음");	
				cm.getPlayer().modifyCSPoints(2, 500, true);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#r500 메이플 포인트가 적립되었습니다.");	
				cm.dispose();
			} else if (point == 3) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(2022118,1);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i2022118# #b운영자의 축하 1개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 4) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(4001832,10);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i4001832# #b주문의 흔적 10개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 5) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(4220000,3);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i4220000# #b프리미엄 워프캡슐 3개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 6) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(4032312,5);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i4032312# #b초월석 5개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 7) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(5060002,1);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#i5060002# #b프리미엄 부화기 1개를 획득하였습니다.");	
				cm.dispose();
			} else if (point == 8) {
				PrizeCheck.setCustomData("받음");	
				cm.getPlayer().modifyCSPoints(2, 1000, true);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#r1000 메이플 포인트가 적립되었습니다.");	
				cm.dispose();
			} else if (point == 9) {
				PrizeCheck.setCustomData("받음");	
				cm.gainItem(5072000,50);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n\r\n#i5072000# #b고성능 확성기 50개를 획득하였습니다.");	
				cm.dispose();
			} else if (point >= 10) {
				PrizeCheck.setCustomData("받음");	
				customPoint.setCustomData("0");	
				cm.getPlayer().modifyCSPoints(1, 500, true);
				cm.sendOk("언제나 저희 이스트월드를 사랑해주셔서 감사합니다 저희들의 작은 선물이 맘에드실지는 모르겠네요! 앞으로도 많은 사랑과 관심 부탁드리며 더욱더 발전하는 이스트온라인이 되겠습니다 감사합니다.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#r500 캐쉬가 적립되었습니다.");	
				cm.dispose();
			} else {
				cm.sendOk("아직 출석기록이 확인되지 않아 사은품을 받으실수 없습니다.");
				cm.dispose();
			}
			} else {
				cm.sendOk("죄송합니다 이미 사은품을 받아가셨습니다.");
				cm.dispose();
			}
		}	
	}
}	

function showTime() {
	var customData = cm.getQuestRecord(123456);
	data = customData.getCustomData();
	var time = (data - System.currentTimeMillis()) / 1000;
	var showTime = "";
	var sec = Math.floor(time % 60);
	var total = time - sec;
	var min = Math.floor((total / 60) % 60);
	var hour = Math.floor((total - (sec + min)) / 3600);
	showTime = hour+"시간 "+min+"분 "+sec+"초";
	return showTime;
}

function checkTime() {
	var customData = cm.getQuestRecord(123456);
	data = customData.getCustomData();
	var time = (data - System.currentTimeMillis()) / 1000;
	var sec = Math.floor(time % 60);
	var total = time - sec;
	var min = Math.floor((total / 60) % 60);
	var hour = Math.floor((total - (sec + min)) / 3600);
	var checkTime = hour+min+sec;
	return checkTime;
}

