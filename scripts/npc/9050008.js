var status = 0;
var minusitem = 0;
var percent = new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20);
var percentR = Math.floor(Math.random()*percent.length);
function action(mode, type, selection) {

	if(status == 0){
		cm.sendSimple("오늘도 사람들이 북적이는구만 나는 마법사이자 연금술사이지 피그미는 나의 애완동물이야 우리 피그미에게 친절하게 대해주라구 그러면 내가 무엇을해줄지 어떻게아나~?\r\n#b#L0#피그미와 대화를 하고 싶습니다.#l\r\n#L1#에뜨랑님의 장비초월기술을 듣고 찾아왔습니다. #l");
		status++;
	} else if (status == 1) {
		if (selection == 0) {
		cm.dispose();
		cm.openNpc(9050000);
		} else if (selection == 1) {
		if(cm.getPlayer().getLevel() >= 30) {
		cm.getPlayer().setUpItemSlot(0);
		cm.sendSimple("요! 모험가여 반갑군, 나는 최고의 장비연금술사 에뜨랑님이시다. 자네 내가 개발한 장비초월을 듣고 찾아왔다고했었지... 장비를 초월하게 될 경우 업그레이드 횟수를 늘릴수 있지 어떤가 정말 해보겠나?\r\n#b#L0#저의 장비를 초월해주세요.#l\r\n#L1#조금 더 자세한 설명을 듣고싶어요.#l");
		status++;
		} else {
		cm.sendOk("장비를 #b초월#k한다는 것은 색다른 개념이자 최고의 혁신일거야. 초월에 관심있다면 좀더 성장해서 나를 찾아오도록.");
		cm.dispose();
		}
	}
	} else if (status == 2) {
	if (selection == 0) {
	cm.sendYesNo("좋아! 자네는 #r"+cm.getPlayer().getItemQuantity(4032312,false)+"#k개의 초월석을 가지고 있군, 초월석은 장비의 레벨만큼 소모되는것 알아두라구, 자 초월을 시작하겠나?");
	status++;
	} else if (selection == 1) {
	cm.sendOk("장비 초월에 대하여 알려주도록 하지, 장비 초월이란 착용중인 장비와 그와 똑같은 장비를 #b초월석#k과 함께 합성시켜 업그레이드 횟수를 #r1#k 증가시키는 최신식 고급 장비 업그레이드라고 볼수있지. 하지만 #b3/1#k의 확률로 초월에 실패하여 재료로 사용된 장비와 초월석을 잃을수도있지. 또한 10% 확률로 장비의 모든 옵션이 증발하는 경우도 있지 프로택트 쉴드가 있다면 걱정이없겠지만 말이야. 아 그리고 최대 초월 가능횟수는 #r10번#k이라는점 명심하도록.");
	cm.dispose();
	}
	} else if(status == 3) {
	cm.sendSimple("자, 아래는 현재 네가 착용중인 장비들이지 캐쉬 아이템을 제외한 장비중 초월시킬 장비를 한번 골라보도록.\r\n#b"+cm.EquippedListForId(cm.getClient()));
	status++;
	} else if(status == 4) {
	var slot = cm.getPlayer().getUpItemSlot();
	minusitem = selection;
	if (cm.getPlayer().getItemReqLevel(minusitem) >= 35) {
	if (cm.getOwnerByEquipped(slot,0) != "제 10 초월식") {
	if(cm.haveItem(minusitem)) {
	if(cm.haveItem(4032312,cm.getPlayer().getItemReqLevel(minusitem))) {
	if(percent[percentR] == 1 || percent[percentR] == 2 || percent[percentR] == 2 || percent[percentR] == 3 || percent[percentR] == 4 || percent[percentR] == 5 || percent[percentR] == 6 || percent[percentR] == 7 || percent[percentR] == 8 || percent[percentR] == 9 || percent[percentR] == 10) {
	cm.gainItem(4032312,-cm.getPlayer().getItemReqLevel(minusitem));
	cm.getPlayer().removeItem(minusitem,-1);
	cm.changeStat(slot,15,cm.getEquippedItemStat(slot,15)+1);
	if (cm.getOwnerByEquipped(slot,0) == "제 1 초월식") {
	cm.setOwner2(slot,0,"제 2 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 2 초월식") {
	cm.setOwner2(slot,0,"제 3 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 3 초월식") {
	cm.setOwner2(slot,0,"제 4 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 4 초월식") {
	cm.setOwner2(slot,0,"제 5 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 5 초월식") {
	cm.setOwner2(slot,0,"제 6 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 6 초월식") {
	cm.setOwner2(slot,0,"제 7 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 7 초월식") {
	cm.setOwner2(slot,0,"제 8 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 8 초월식") {
	cm.setOwner2(slot,0,"제 9 초월식");
	} else if (cm.getOwnerByEquipped(slot,0) == "제 9 초월식") {
	cm.setOwner2(slot,0,"제 10 초월식");
	} else {
	cm.setOwner2(slot,0,"제 1 초월식");
	}
	//cm.getPlayer().reloadChar();
	cm.sendOk("초월에 성공하여 업그레이드 횟수가 #r+1#k 만큼 증가했다네. 자네 꽤 튼튼한 무기를 가지고있군 초월을 견뎌낼 무기라니 말이야. 하하! (재접속 시 적용됩니다.)");
	cm.dispose();
	} else if (percent[percentR] == 11 || percent[percentR] == 12 || percent[percentR] == 13 || percent[percentR] == 14 || percent[percentR] == 15 || percent[percentR] == 16 || percent[percentR] == 17) {
	cm.gainItem(4032312,-cm.getPlayer().getItemReqLevel(minusitem));
	cm.getPlayer().removeItem(minusitem,-1);
	cm.sendOk("초월에 실패하여 초월석과 재료 장비 아이템이 증발해 버렸다네 자네의 무기는 초월을 견디기 힘든 장비였던것 같군 절대 나의 실수가 아니라고!");
	cm.dispose();
	} else {
	if (!cm.haveItem(4034218,1)) {
	cm.gainItem(4032312,-cm.getPlayer().getItemReqLevel(minusitem));
	cm.getPlayer().removeItem(minusitem,-1);
	cm.changeStat(slot,0,0);
	cm.changeStat(slot,1,0);
	cm.changeStat(slot,2,0);
	cm.changeStat(slot,3,0);
	cm.changeStat(slot,4,0);
	cm.changeStat(slot,5,0);
	cm.changeStat(slot,6,0);
	cm.changeStat(slot,7,0);
	cm.changeStat(slot,8,0);
	cm.changeStat(slot,9,0);
	cm.changeStat(slot,10,0);
	cm.changeStat(slot,11,0);
	cm.changeStat(slot,12,0);
	cm.changeStat(slot,13,0);
	cm.changeStat(slot,14,0);
	cm.changeStat(slot,15,0);
	//cm.getPlayer().reloadChar();
	cm.sendOk("초월에 실패하여 재료와 착용한 아이템의 옵션이 모두 증발해 버렸다네 자네의 무기는 초월을 견디기 힘든 장비였던것 같군 절대 나의 실수가 아니라고! (재접속 시 적용됩니다.)");
	cm.dispose();
	} else {
	cm.gainItem(4034218,-1);
	cm.gainItem(4032312,-cm.getPlayer().getItemReqLevel(minusitem));
	cm.getPlayer().removeItem(minusitem,-1);
	cm.sendOk("프로택트 쉴드의 효과로 장비의 힘을 잃지 않았습니다.");
	cm.dispose();
	}
	}
	} else {
	cm.sendOk("현재 착용한 #b#t"+minusitem+"##k을(를) 초월시키기 위해서는 #r"+cm.getPlayer().getItemReqLevel(minusitem)+"#k개의 초월석이 필요하다네.");
	cm.dispose();
	}
	} else {
	cm.sendOk("현재 착용한 #b#t"+minusitem+"##k을(를) 초월시키기 위해서는 또 하나의 #r#t"+minusitem+"##k가(이) 필요하다는 설명 듣지 못하였나?");
	cm.dispose();
	}
	} else {
	cm.sendOk("현재 착용한 #b#t"+minusitem+"##k은(는) 이미 제 10 초월식에 달성하여 더이상 초월이 불가능한 상태라네.");
	cm.dispose();
		}
	} else {
	cm.sendOk("현재 착용한 #b#t"+minusitem+"##k은(는) 35레벨미만의 아이템이라 초월이 불가능하다네.");
	cm.dispose();
	}
	}
}