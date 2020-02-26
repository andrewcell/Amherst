var status = 0;

function action(mode, type, selection){

	if(status == 0){
		if (cm.getPlayer().getMapId() == 910000020) {
		cm.sendYesNo("2014년 1월 24일 부터 여름이 지나가기 까지 단풍나무키우기 이벤트를 진행중입니다. 하루에 한번 단풍나무가 다 자라나면 특별한 아이템을 드롭한다고합니다. 단풍나무 언덕으로 이동하시겠습니까?");
		status = 35;
		} else {
		if (cm.TimeCheck(24,24)) {
		cm.sendSimple("2014년 1월 24일 부터 여름이 지나가기 까지 단풍나무키우기 이벤트를 진행중입니다. 하루에 한번 단풍나무가 다 자라나면 특별한 아이템을 드롭한다고해요. 자 단풍나무가 자라기 위해서 나무가 좋아하는 햇살을 새싹에게 빛춰주세요!\r\n#r달성률 : #B"+cm.getSunGage()+"# #k\r\n#b#L0#나무가 좋아하는 햇살 빛춰주기#l\r\n#L1#황금단풍잎으로 아이템 무작위 교환하기#l\r\n#L2#10주년단풍잎으로 아이템 무작위 교환하기#l\r\n#L4#황금단풍 15개와 훈장 교환하기#l\r\n#L3#쉼터광장으로 돌아가고 싶습니다.#l");
		status++;
		} else {
		cm.warp(910000020);
		cm.sendOk("단풍나무는 오후4시 부터 8까지만 성장을 한답니다.");
		cm.dispose();
		}
		}
	} else if (status == 35) {
		if (cm.getPlayer().getClient().getChannel() == 1) {
		cm.warp(970010000);
		cm.dispose();
		} else {
		cm.sendOk("1채널에서만 입장할수 있어요!");
		cm.dispose();
		}
		} else if (status == 1) {
		if (selection == 0) {
		cm.sendGetNumber("정말 자상하신 분이시군요 자 햇살을 몇개 빛춰주시겠어요?\r\n#r현재 보유중인 햇살 갯수 : "+cm.getPlayer().getItemQuantity(4001165,false)+"개",1,1,1000);
		status++;
		} else if (selection == 1) {
		cm.sendYesNo("황금단풍을 사용하시면 무작위로 메이플아이템중 한가지로 교환됩니다 정말로 황금단풍을 사용하시겠습니까?");
		status = 10;
		} else if (selection == 2) {
		cm.sendYesNo("10주년단풍을 사용하시면 무작위로 메이플 이올렛,래티넘,베릴아이템 중 한가지로 교환됩니다 정말로 10주년단풍을 사용하시겠습니까?");
		status = 15;
		} else if (selection == 3) {
		cm.warp(910000020);
		cm.dispose();
} else if (selection == 4) {
            if (!cm.canHold(1112762)) {
                cm.sendOk("인벤토리가 부족합니다.");
                cm.safeDispose();
                return;
            }

		if (cm.haveItem(4033247,15)) {
cm.gainItem(1142218,1);
cm.gainItem(4033247,-15);
cm.sendOk("훈장과 교환이 성사되었습니다.");
cm.dispose();
} else {
cm.sendOk("황금단풍 15개가 있는게 확실한가요?");
cm.dispose();
}
		}
		} else if (status == 2) {
		if(mode != 1){
			cm.dispose();
			return;
		}
		if (cm.haveItem(4001165,selection)) {
		cm.gainItem(4001165,-selection);
		cm.addSunshines(selection);
		cm.sendOk("햇살"+selection+"개를 비춰주었습니다 감사합니다.");
		cm.dispose();
		if (cm.getSun() >= 2800 && cm.getSun() <= 2900) {
		cm.getPlayer().ServerNotice("가가 : 단풍나무가 거의다 성장하였습니다.");
		}
		} else {
		cm.sendOk("비춰주시려고하시는 만큼의 햇살이 없으신 것 같은데요?");
		cm.dispose();
		}
		} else if (status == 10) {
		if(mode != 1){
			cm.sendOk("다시 신중하게 생각 해보신뒤 찾아와주세요.");
			cm.dispose();
		}
		var mtE0 = new Array(1302020,1312032,1382009,1482020,1492020,1432012,1442024,1452016,1462014,1472030);
		var mtE0r = Math.floor(Math.random()*mtE0.length);

		var mtE1 = new Array(1302030,1382012,1452022,1462019,1472032,1332025,1492021,1482021,1432040,1442030);
		var mtE1r = Math.floor(Math.random()*mtE1.length);

		var mtE2 = new Array(1402039,1372034,1382039,1452045,1462040,1472055,1332055,1332056,1492022,1482022,1442030);
		var mtE2r = Math.floor(Math.random()*mtE2.length);

		var mtE3 = new Array(1472111,1462085,1302142,1332114,1372071,1382093,1482073,1492073,1402085,1432075,1442104,1452100);
		var mtE3r = Math.floor(Math.random()*mtE3.length);

		var random = Math.floor(Math.random() * 100);

		if (cm.haveItem(4033247,1)) {
		if (random == 0 || random <= 39) {
		cm.gainItem(mtE0[mtE0r],1);
		cm.sendOk("#i"+mtE0[mtE0r]+"# #b#t"+mtE0[mtE0r]+"##k를 획득하셨습니다.");
		cm.gainItem(4033247,-1);
		cm.dispose();
		} else if (random == 40 || random <= 79) {
		cm.gainItem(mtE1[mtE1r],1);
		cm.sendOk("#i"+mtE1[mtE1r]+"# #b#t"+mtE1[mtE1r]+"##k를 획득하셨습니다.");
		cm.gainItem(4033247,-1);
		cm.dispose();
		} else if (random == 80 || random <= 94) {
		cm.gainItem(mtE2[mtE2r],1);
		cm.sendOk("#i"+mtE2[mtE2r]+"# #b#t"+mtE2[mtE2r]+"##k를 획득하셨습니다.");
		cm.gainItem(4033247,-1);
		cm.dispose();
		} else if (random == 95 || random <= 100) {
		cm.gainItem(mtE3[mtE3r],1);
		cm.sendOk("#i"+mtE3[mtE3r]+"# #b#t"+mtE3[mtE3r]+"##k를 획득하셨습니다.");
		cm.gainItem(4033247,-1);
		cm.dispose();
		}
		} else {
		cm.sendOk("황금단풍이 있는게 확실한가요?");
		cm.dispose();
		}

} else if (status == 15) {
		if(mode != 1){
			cm.sendOk("다시 신중하게 생각 해보신뒤 찾아와주세요.");
			cm.dispose();
		}
		var ret = new Array(1302170,1322101,1332145,1372097,1382121,1402107,1432095,1452126,1462114,1472137,1482099,1492098);
		var retr = Math.floor(Math.random()*ret.length);

		var ber = new Array(1302169,1322099,1332144,1372096,1382120,1402106,1432096,1452125,1462113,1472136,1482098,1492097);
		var berr = Math.floor(Math.random()*ber.length);

		var eol = new Array(1432135,1442173,1462156,1472177,1482138,1492138,1452165,1302212,1332186,1372131,1382160,1402145);
		var eolr = Math.floor(Math.random()*eol.length);

		var alleqp = new Array(1003242,1072521,1102294,1072522,1072660,1102295,1102394,1003243,1003529,1082314,1052457,1082315,1082430,1052357,1052358);
		var alleqpr = Math.floor(Math.random()*alleqp.length);

		var random = Math.floor(Math.random() * 105);

		if (cm.haveItem(4310080,1)) {
		if (random == 0 || random <= 31) {
		cm.gainItem(ber[berr],1);
		cm.sendOk("#i"+ber[berr]+"# #b#t"+ber[berr]+"##k를 획득하셨습니다.");
		cm.gainItem(4310080,-1);
		cm.dispose();
		} else if (random == 32 || random <= 62) {
		cm.gainItem(ret[retr],1);
		cm.sendOk("#i"+ret[retr]+"# #b#t"+ret[retr]+"##k를 획득하셨습니다.");
		cm.gainItem(4310080,-1);
		cm.dispose();
		} else if (random == 63 || random <= 69) {
		cm.gainItem(eol[eolr],1);
		cm.sendOk("#i"+eol[eolr]+"# #b#t"+eol[eolr]+"##k를 획득하셨습니다.");
		cm.gainItem(4310080,-1);
		cm.dispose();
		} else if (random == 70 || random <= 105) {
		cm.gainItem(alleqp[alleqpr],1);
		cm.sendOk("#i"+alleqp[alleqpr]+"# #b#t"+alleqp[alleqpr]+"##k를 획득하셨습니다.");
		cm.gainItem(4310080,-1);
		cm.dispose();
		}
		} else {
		cm.sendOk("10주년단풍이 있는게 확실한가요?");
		cm.dispose();
		}
	}
}
