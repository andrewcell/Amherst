importPackage(java.util);

var selections;
var now = new Date();
var year= now.getFullYear();
var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
var hour = now.getHours();
var minutes = now.getMinutes();
var statuss = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(direct, type, select) {
    if (direct == -1) {
        cm.dispose();
    } else {
        if (direct == 0 && status >= 0) {
            cm.dispose();
            return;
        }
        if (direct == 1)
            status++;
        else
            status--;
	if (status == 0) {
	cm.sendSimple("안녕하세요 needfix에서 서비스기능을 담당하는 귀요미 마스코트 '폴' 이라고 합니다. 만나서 반갑습니다. 항상 유저 여러분들을 위해서 발전하는 needfix온라인 되겠습니다.\r\n#r* 접속자 알림 : 현재 "+cm.getPlayer().getAllconnection()+"명이 접속중입니다.\r\n#b#L0# 현재 통합 랭킹 확인하기#l\r\n#L1# needfix 출석체크 하기#l\r\n#L2# 캐릭터 중성화 하기 / 해제하기#l\r\n#L3# 몬스터 드롭아이템 확인하기#l\r\n#L565# 피작하기(HP,MP 강화)#l\r\n\r\n#b#L988#[핫타임] 폭풍성장의비약 사용하기#l");
	} else if (status == 1) {
	if (select == 0) {
        selections =  "#L0#월드 랭킹 확인하기#l\r\n";
        selections += "#L1#직업별 랭킹 확인하기#l\r\n";
        selections += "#L2#현재 나의 랭킹 확인하기#l\r\n";
        selections += "#L3#길드 랭킹 확인하기#l";
        if (hour > 12) {
                hour = hour - 12;
                var nowing = "오후";
            } else {
                var nowing = "오전";
            }
            cm.sendSimple("현재 통합 랭킹 뷰를 선택하셨습니다.\r\n마지막 랭킹 업데이트 : #r" + year +"년 " + mon +"월 " + day +"일 " + nowing +  " " + hour +"시 " + minutes +"분#k\r\n#b" + selections);  
	} else if (select == 1) {
		cm.dispose();
		cm.openNpc(9000013);
	} else if (select == 565) {
		cm.dispose();
		cm.openNpc(9001102);
	} else if (select == 987) {
	if (cm.haveItem(4033617,1)) {
	cm.gainItem(4033617,-1);
var cash = new Array(3000,2900,2800,2700,2600,2500,2400,2300,2200,2100,2000,1900,1800,1700,1600,1500,1400,1300,1200,1100,1000,900,800,700,600,500);
var cashr = Math.floor(Math.random() * cash.length);
	//cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).getSlotLimit());
	//cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.USE).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.USE).getSlotLimit());
	//cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.SETUP).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.SETUP).getSlotLimit());
	//cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.ETC).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.ETC).getSlotLimit());
	//cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.CASH).addSlot(96 - cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.CASH).getSlotLimit());
	cm.playerMessage(1,cash[cashr]+"캐쉬가 충전되었습니다.");
	cm.getPlayer().modifyCSPoints(1, cash[cashr], false);
		cm.dispose();
	} else {
		cm.sendOk("핫타임으로 받은 사인회티켓이 있는지 다시 확인해주세요.");
		cm.dispose();
	}
	} else if (select == 988) {
	if (cm.haveItem(2430218,1)) {
	cm.gainItem(2430218,-1);
	cm.getPlayer().levelUp();
		cm.dispose();
	} else {
		cm.sendOk("핫타임으로 받은 폭풍 성장의 비약이 있는지 다시 확인해주세요.");
		cm.dispose();
	}
	} else if (select == 3) {
		cm.dispose();
		cm.openNpc(9010017);
	} else if (select == 2) {
	var customData = cm.getQuestRecord(50011);
	if (cm.getPlayer().getGender() != 2) {
	cm.getPlayer().setGender(2);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("#e#r<주의사항>#n#k\r\n중성상태가되어 이제부터 최신모자를 착용할수 있습니다. 하지만 성별별로 보상을주는 퀘스트나(가운퀘스트), 결혼 , 커플링등 성별별로 하는 시스템을 이용할때엔 다시한번 이버튼을 눌러서 중성상태를 해제해주세요.");
	cm.dispose();
	} else if (cm.getPlayer().getGender() == 2 && customData.getCustomData() == "남자") {
	cm.getPlayer().setGender(0);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("중성상태가 해제되어 #b남성캐릭터#k로 복구되었습니다.");
	cm.dispose();
	} else if (cm.getPlayer().getGender() == 2 && customData.getCustomData() == "여자") {
	cm.getPlayer().setGender(1);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("중성상태가 해제되어 #r여성캐릭터#k로 복구되었습니다.");
	cm.dispose();
	}
}
	 } else if (status == 2) {
            if (select == 0) {
                cm.sendOk(cm.getRanking("전체"));
                cm.dispose();
	    } else if (select == 1) {
                selections;
                selections = "#L0#전사#l　";
                selections += "#L1#마법사#l　";
                selections += "#L2#궁수#l　";
                selections += "#L3#도적#l　";
                selections += "#L4#해적#l";
                //selections += "\r\n#L5##k#r풍연#l";
                //selections += "   #L6#해룡#l";
                cm.sendSimple("랭킹확인을 하고싶으신 직업을 선택해주세요.\r\n#b"+selections);
            } else if (select == 2) {
                cm.sendOk(cm.getRanking("내랭킹"));
                cm.dispose();
            } else if (select == 3) {
    cm.displayGuildRanks();
                cm.dispose();
            }
        } else if (status == 3) {
            if (select == 0) {
                cm.sendOk(cm.getRanking("전사"));
                cm.dispose();
            } else if (select == 1) {
                cm.sendOk(cm.getRanking("마법사"));
                cm.dispose();
            } else if (select == 2) {
                cm.sendOk(cm.getRanking("궁수"));
                cm.dispose();
            } else if (select == 3) {
                cm.sendOk(cm.getRanking("도적"));
                cm.dispose();
            } else if (select == 4) {
                cm.sendOk(cm.getRanking("해적"));
                cm.dispose();
           } else if (select == 5) {
                cm.sendOk(cm.getRanking("풍연"));
                cm.dispose();
            } else if (select == 6) {
                cm.sendOk(cm.getRanking("해룡"));
                cm.dispose();
            }
        }
    }
}

