var status = 0;

var maple = [[1302020,20],[1382009,20],[1452016,20],[1462014,20],[1472030,20],[1482020,20],[1492020,20]];
var mapleup = [[1302030,1302020] , [1432012,1302020] , [1442024,1302020] , [1382012,1382009] , [1452022,1452016] , [1462019,1462014], [1472032,1472030] , [1332025,1472030] , [1482021,1482020] , [1492021,1492020]];
var mapleupup = [[1302064,[1302030]] , [1402039,1302030] , [1432040,1432012] , [1442051,1442024] , [1382039,1382012] , [1372034,1382012] , [1452045,1452022] , [1462040,1462019] , [1332055,1332025] , [1332056,1332025] , [1472055,1472032] , [1482022,1482021] , [1492022,1492021]];

function action(mode, type, selection){
	if(status == 0){
		if (cm.getPlayer().getMapId() != 123456789) {
		cm.sendSimple("단풍나무가 다 자라나면 특별한 아이템을 드롭한다고해요. 자 단풍나무가 자라기 위해서 나무가 좋아하는 햇살을 새싹에게 빛춰주세요!\r\n#r성장도 :#k #B"+cm.getSunGage()+"# #k\r\n#b#L0#나무에게 햇살을 비춰주겠습니다. #l\r\n#L1#단풍잎상점을 이용하고 싶습니다.#l\r\n#L2#메이플 아이템(35)을 진화시키고 싶습니다.#l\r\n#L3#메이플 아이템(43)을 진화시키고 싶습니다.#l\r\n");
		status++;
		} else {	
		if (cm.getPlayer().getClient().getChannel() == 1) {
		cm.sendSimple("오늘도 needfix 쉼터는 활기차네요. 모험가 여러분들의 햇살기부로 오늘도 단풍나무는 성장하고 있답니다.\r\n#b#L0#단풍나무 언덕으로 이동할래요.#l\r\n#L1#고용상인 아이템을 되찾고 싶어요.#l\r\n#L2#쉼터창고를 이용하고 싶어요.#l\r\n#L4#단풍잎 잡화상점을 이용하고 싶습니다.#l\r\n#L3#아이템을 삭제하고 싶어요.#l\r\n");
		status=456;
		} else {
                cm.sendOk("1채널에서만 이용할수 있는 서비스 입니다.");
		cm.dispose();	
		}
		}
		} else if (status == 456) {
		if (selection == 0) {
		cm.warp(970010000);
		cm.dispose();
		} else if (selection == 1) {
                cm.openMerchantItemStore();
		cm.dispose();
		} else if (selection == 2) {
	        cm.sendStorage();
		cm.dispose();
		} else if (selection == 4) {
		cm.dispose();
                cm.openNpc(9000036);
		} else if (selection == 3) {
		cm.sendSimple("삭제한 아이템은 다시 되돌릴수없습니다.\r\n#b"+cm.EquipList2(cm.getPlayer().getClient()));
		status=678;
		}
		} else if (status == 1) {
		if (selection == 0) {
		cm.sendGetNumber("정말 자상하신 분이시군요 자 햇살을 몇개 빛춰주시겠어요?\r\n#r현재 보유중인 햇살 갯수 : "+cm.getPlayer().getItemQuantity(4001165,false)+"개",1,1,1000);
		status++;
		} else if (selection == 1) {
            var basetext = "어서오세요! 늘 붉은 단풍잎상점을 찾아주셔서 감사합니다. 단풍잎으로 구매한 메이플 아이템은 단풍구슬로 업그레이드 가능하답니다.\r\n#b";
            for (var i = 0; i < maple.length; i++) {
                basetext += "#L" + i + "# #t" + maple[i][0] + "# : " + maple[i][1] + "단풍잎\r\n";
            }
            cm.sendSimple(basetext);
            status = 10;
	    } else if (selection == 2) {
            var basetext = "진화시키고 싶은 아이템을 선택하시면 그에대한 진화재료를 알려드린후 진화시켜드리고 있습니다 원하시는 진화를 선택해주시기 바랍니다.\r\n#b";
            for (var i = 0; i < mapleup.length; i++) {
                basetext += "#L" + i + "# #t" + mapleup[i][0] + "#\r\n";
            }
            cm.sendSimple(basetext);
            status = 11;
	    } else if (selection == 3) {
            var basetext = "진화시키고 싶은 아이템을 선택하시면 그에대한 진화재료를 알려드린후 진화시켜드리고 있습니다 원하시는 진화를 선택해주시기 바랍니다.\r\n#b";
            for (var i = 0; i < mapleupup.length; i++) {
                basetext += "#L" + i + "# #t" + mapleupup[i][0] + "#\r\n";
            }
            cm.sendSimple(basetext);
            status = 12;
		}
		} else if (status == 678) {
		cm.sendOk("#i"+selection+"##b#t"+selection+"##k를 인벤토리에서 성공적으로 삭제했어.");
		cm.gainItem(selection,-1);	
		cm.dispose();
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
		} else {
		cm.sendOk("비춰주시려고하시는 만큼의 햇살이 없으신 것 같은데요?");
		cm.dispose();
		}
		} else if (status == 10) {
		if (cm.haveItem(4001126,maple[selection][1])) {
                if (!cm.canHold(maple[selection][0])) {
                    cm.sendOk("인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(maple[selection][0], 1);
                cm.gainItem(4001126,-maple[selection][1]);
                cm.sendOk("이용해주셔서 감사합니다. #b#t" + maple[selection][0] + "##k를 구매하였습니다.");
                cm.dispose();
            } else {
                cm.sendOk("선택하신 메이플 아이템의 가격은 20단풍잎 입니다. 소지중인 단풍잎의 갯수를 다시한번 확인해주세요.")
                cm.dispose();
            }
		} else if (status == 11) {
		if (cm.haveItem(mapleup[selection][1],1) && cm.haveItem(4031456,1) &&  cm.haveItem(4350001,5) &&  cm.haveItem(4001126,10)) {
                if (!cm.canHold(mapleup[selection][0])) { 
                    cm.sendOk("인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(mapleup[selection][0], 1);
		cm.getPlayer().removeItem(mapleup[selection][1],-1);
		cm.gainItem(4031456, -1);
		cm.gainItem(4350001, -5);
		cm.gainItem(4001126, -10);
                cm.sendOk("축하드립니다. 진화에 성공하여 #b#t" + mapleup[selection][0] + "##k를 획득하였습니다.");
                cm.dispose();
            } else {
                cm.sendOk("선택하신 메이플 아이템의 진화재료는 아래와 같습니다.\r\n#b#t" + mapleup[selection][1] + "# , 단풍잎 구슬 , 화염의 원소 5개 , 단풍잎 10개");
                cm.dispose();
            }
		} else if (status == 12) {
		if (cm.haveItem(mapleupup[selection][1],1) && cm.haveItem(4031456,1) &&  cm.haveItem(4350003,10) &&  cm.haveItem(4001126,20)) {
                if (!cm.canHold(mapleupup[selection][0])) { 
                    cm.sendOk("인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(mapleupup[selection][0], 1);
		cm.gainItem(4031456, -1);
		cm.gainItem(4350003, -10);
		cm.gainItem(4001126, -20);
		cm.getPlayer().removeItem(mapleupup[selection][1],-1);
                cm.sendOk("축하드립니다. 진화에 성공하여 #b#t" + mapleupup[selection][0] + "##k를 획득하였습니다.");
                cm.dispose();
            } else {
                cm.sendOk("선택하신 메이플 아이템의 진화재료는 아래와 같습니다.\r\n#b#t" + mapleupup[selection][1] + "# , 단풍잎 구슬 , 대지의 원소 10개 , 단풍잎 20개");
                cm.dispose();
            }
	}
}
