var status = 0;

function action(mode, type, selection) {
	
	var customNew = cm.getQuestRecord(55551);
	if(customNew.getCustomData() == null){ 
		customNew.setCustomData("뉴비");
	}

	if (status == 0) {
	if (customNew.getCustomData() == "뉴비") {
        cm.sendSimple("안녕하세요 모험가님, 보아하니 모험을 시작하신지 얼마 안되신것 같군요. 저는 신규 모험가 트레이닝을 담당하는 아루 라고합니다. #r파란 달팽이의 껍질 5개#k를 모아오신다면 여행에 도움이 되는 아이템과 약간의 메소를 선물하겠습니다.\r\n#L0# #b파란 달팽의 껍질을 모두 구해왔습니다.#l");
        status++;
	} else if (customNew.getCustomData() == "뉴뉴비") {
        cm.sendSimple("포션과 기초자금을 받고나서 조금더 든든해진것 같지 않으신가요? 그래서 이번엔 조금더 큰 선물을 준비하였습니다. 이번엔 #r돼지의 리본 20개#k를 모아오신다면 선물을 드리도록 하겠습니다.\r\n#L1# #b돼지의 리본을 모두 구해왔습니다.#l");
        status++;
	} else if (customNew.getCustomData() == "뉴비아님") {
        cm.sendSimple("포션과 기초자금을 받고나서 조금더 든든해진것 같지 않으신가요? 그래서 이번엔 조금더 큰 선물을 준비하였습니다. 이번엔 #r초록 버섯의 갓 30개#k를 모아오신다면 선물을 드리도록 하겠습니다.\r\n#L2# #b초록 버섯의 갓을 모두 구해왔습니다.#l");
        status++;
	} else if (customNew.getCustomData() == "뉴비진짜아님") {
        cm.sendSimple("포션과 기초자금을 받고나서 조금더 든든해진것 같지 않으신가요? 그래서 이번엔 ★엄청난★ 선물을 준비하였습니다. 이번엔 #r파란 버섯의 갓 100개#k를 모아오신다면 선물을 드리도록 하겠습니다.\r\n#L3# #b파란 버섯의 갓을 모두 구해왔습니다.#l");
        status++;
	} else {
	cm.sendOk("모험이란 것 은 정말 멋지고 이상적이랍니다.");
        cm.dispose();
	}
	} else if (status == 1) {
	if (selection == 0) {
	if (cm.haveItem(4000000,5)) {
	cm.gainItem(5071000,50);
	cm.gainItem(4000000,-5);
	cm.gainMeso(10000);
	cm.gainItem(2000020,200);
	cm.gainItem(2000021,200);
	cm.gainExp(100);
	customNew.setCustomData("뉴뉴비")
	cm.sendOk("수고하셨습니다. 여행에 필수인 확성기 50개와 빨간포션과, 파란포션 각 200개와 10,000메소, 경험치 100을 드리겠습니다. 다음 훈련을 진행하시려면 다시한번 저를 클릭해주세요.");
        cm.dispose();
	} else {
	cm.sendOk("아직 파란 달팽이의 껍질 5개를 모으시지 못한것 같네요.");
        cm.dispose();
	}
	} else if (selection == 1) {
	if (cm.haveItem(4000002,20)) {
	cm.gainItem(5072000,50);
	cm.gainItem(4000002,-20);
	cm.gainMeso(15000);
	cm.gainItem(2000001,150);
	cm.gainItem(2000021,150);
	cm.gainItem(4220000,2)
	cm.gainItem(1142263,1)
	cm.gainExp(2000);
	customNew.setCustomData("뉴비아님")
	cm.sendOk("수고하셨습니다. 여행에 필수인 고성능 확성기 50개와 주황과, 파란포션 각 150개와 15,000메소, 경험치 2000 , 프리미엄 워프캡슐 2개를 드리겠습니다. 앞으로 모험이 힘들지라도 오늘을 생각하며 화이팅입니다!");
        cm.dispose();
	} else {
	cm.sendOk("아직 돼지의 리본 20개를 모으시지 못한것 같네요.");
        cm.dispose();
	}
	} else if (selection == 2) {
	if (cm.haveItem(4000012,20)) {
	cm.gainItem(5076000,20);
	cm.gainItem(4000012,-30);
	cm.gainMeso(35000);
	cm.gainItem(2000002,100);
	cm.gainItem(2000006,100);
	cm.gainExp(4000);
	customNew.setCustomData("뉴비진짜아님")
	cm.sendOk("수고하셨습니다. 여행에 필수인 아이템 확성기 30개와 하얀포션과, 마나엘릭서 각 100개와 35,000메소, 경험치 4000를 드리겠습니다. 앞으로 모험이 힘들지라도 오늘을 생각하며 화이팅입니다!");
        cm.dispose();
	} else {
	cm.sendOk("아직 초록 버섯의 갓 30개를 모으시지 못한것 같네요.");
        cm.dispose();
	}
	} else if (selection == 3) {
	if (cm.haveItem(4000009,100)) {	
	cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).getSlotLimit());
	cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.USE).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.USE).getSlotLimit());
	cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.SETUP).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.SETUP).getSlotLimit());
	cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.ETC).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.ETC).getSlotLimit());
	cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.CASH).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.CASH).getSlotLimit());
	cm.gainItem(5060002,1);
	cm.gainItem(4000009,-100);
	cm.gainMeso(100000);
	cm.gainItem(5072000,50);
	cm.gainItem(5071000,50);
	cm.gainItem(5076000,50);
	cm.gainItem(2000002,250);
	cm.gainItem(2000006,250);
        cm.gainPet(5000022, cm.getItemName(5000022), 1, 0, 100, 3000, 101);
        cm.getPlayer().modifyCSPoints(2, 6000, true);
	cm.gainExp(8000);
	customNew.setCustomData("뉴비절때아님")
	cm.sendOk("수고하셨습니다. 여행에 필수인 모든 인벤토리 최대치증가 #r(재 접속시 적용)#k 및 부화기 1개와 하얀포션과, 마나엘릭서 각 250개와 100,000메소, 경험치 8000 그리고 칠면조 펫을 드리겠습니다. 앞으로 모험이 힘들지라도 오늘을 생각하며 화이팅입니다!");
        cm.dispose();
	} else {
	cm.sendOk("아직 파란 버섯의 갓 100개를 모으시지 못한것 같네요.");
        cm.dispose();
	}
	}
    }
}