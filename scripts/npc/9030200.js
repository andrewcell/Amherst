var status = 0;
var h = 0;
var hh = 0;
var hhh = 0;
var h1 = 0;
var hh1 = 0;
var hhh1 = 0;
var petid = 0;
var rideid = 0;

var cash = new Array(5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,10000,9900,9800,9700,9600,9500,9400,9300,9200,9100,9000,8900,8800,8700,8600,8500,8400,8300,8200,8100,8000,7900,7800,7700,7600,7500,7400,7300,7200,7100,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500,6700,6800,6900,7000,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,6300,6400,6500);
var cashr = Math.floor(Math.random() * cash.length);


var etc = [[4034218,4000,1],[4001832,5000,750],[4032312,3000,80],[4033616, 2900, 1],[5060002,500,1]];

var cap = [[1004167,4800,1],[1004180,4500,1],[1004432,3000,1],[1004442,1800,1],[1004139,6000,1],[1003968,4500,1],[1003776,4000,1],[1003965,4000,1],[1004337,5000,1],[1003953,6300,1],[1004177,5500,1],[1004384,4700,1],[1003398,3800,1],[1003399,3800,1],[1003400,3800,1],[1003401,3800,1],[1003402,3800,1],[1004029,3000,1]];
var cape = [[1102685,3000,1], [1102767,4300,1],[1102706,30000,1],[1102667,30000,1],[1102674,10500,1]];
var coat = [[1052754,4300,1],[1052667,4500,1],[1052661,4300,1],[1052587,3800,1],[1052853,3300,1],[1051374,4900,1],[1051375,4900,1],[1052865,3800,1],[1052671, 5300, 1],[1050210,2500,1],[1051256,2500,1]];
var wp = [[1702342,5900,1],[1702291,6300,1]];
var hand = [[1082587,1000,1],[1082552,1000,1],[1082549,1000,1],[1082493,1900,1],[1082634,1200,1],[1073019,1000,1]];
var acc = [[1012494,3300,1],[1012501,3500,1],[1012379,1200,1]];
function action(mode, type, selection) {

    if (status == 0) {
        cm.sendSimple("안녕하세요, 저는 needfix에서 신용만땅 현금서비스를 담당하는 돈순이 라고합니다. 항상 최고와 최선의 서비스로 고객님을 대접하겠습니다. 무엇을 도와드릴가요?\r\n#r후원문의 : 카톡 leejh7878#k\r\n#b#L0# REAL CASHSHOP을 이용하고싶습니다.#l\r\n#L999# 홀/#r짝#k#b 배팅을 하고싶습니다.#l\r\n#L9999# #k#b사인회티켓을 캐쉬와 교환하겠습니다.#l\r\n");
//#l\r\n#L999# 홀/#r짝#k#b 배팅을 하고싶습니다.
        status++;
    } else if (status == 1) {
        if (selection == 999) {
            cm.dispose();
            cm.openNpc(2400027);
        } else if (selection == 9999) {
            if (cm.haveItem(4033618,1)) {
	cm.playerMessage(1,cash[cashr]+"캐쉬가 충전되었습니다.");
	cm.getPlayer().modifyCSPoints(1, cash[cashr], false);
	cm.gainItem(4033618,-1);
	cm.dispose();
	} else {
	cm.sendOk("사인회 티켓 교환권을 찾을수 없습니다.");
	cm.dispose();
	}
        } else if (selection == 0) {
            cm.sendSimple("안녕하세요, 저는 needfix에서 신용만땅 현금서비스를 담당하는 돈순이 라고합니다. 항상 최고와 최선의 서비스로 고객님을 대접하겠습니다. 무엇을 도와드릴가요?\r\n#b#L0# 게임아이템 쇼핑하기 #l\r\n#L1# 블링블링 의류 쇼핑하기 #l\r\n#L2# 귀여운 펫 #k#r[랜덤]#k#b 분양하기 #l\r\n#L3# 나만의 멋진 라이딩 #k#r[랜덤]#k#b 구매하기 #l\r\n");
            status++;
        }
    } else if (status == 2) {
        if (selection == 0) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < etc.length; i++) {
                basetext += "#L" + i + "# #t" + etc[i][0] + "# "+etc[i][2]+"개 : " + etc[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status++;
        } else if (selection == 1) {
            cm.sendSimple("어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템분야 입니다. 원하시는 분야를 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b#L0#모자#l\r\n#L1#의상#l\r\n#L2#망토#l\r\n#L3#무기#l\r\n#L4#장갑,신발#l\r\n#L5#악세사리#l");
            status = 1000;
        } else if (selection == 2) {
            cm.sendYesNo("눈에 넣어도 아깝지 않은 귀여운 펫을 분양하시려구요? 랜덤 분양 비용은 #r5,000cash#k 이며, 마음에 들지 않을시 #b1,000#k 캐쉬를 더지불하면 다른 펫으로 랜덤분양 받을수 있습니다. 정말 구매하시겠습니까?");
            status = 20;
        } else if (selection == 3) {
            cm.sendYesNo("나만의 파트너 멋진 라이딩친구를 구매하시는 비용은 #r5,000cash#k 이며, 마음에 들지 않을시 #b1,000#k 캐쉬를 더지불하면 다른 라이딩으로 랜덤구매 하실수 있습니다. 정말 구매하시겠습니까?");
            status = 30;
        }
	} else if (status == 1000) {
	if (selection == 0) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < cap.length; i++) {
                basetext += "#L" + i + "# #t" + cap[i][0] + "# : " + cap[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 10;
	} else if (selection == 1) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < coat.length; i++) {
                basetext += "#L" + i + "# #t" + coat[i][0] + "# : " + coat[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 12;
	} else if (selection == 2) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < cape.length; i++) {
                basetext += "#L" + i + "# #t" + cape[i][0] + "# : " + cape[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 13;
	} else if (selection == 3) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < wp.length; i++) {
                basetext += "#L" + i + "# #t" + wp[i][0] + "# : " + wp[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 14;
	} else if (selection == 4) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < hand.length; i++) {
                basetext += "#L" + i + "# #t" + hand[i][0] + "# : " + hand[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 15;
	} else if (selection == 5) {
            var basetext = "어서오세요 REAL CASHSHOP을 찾아주셔서 감사합니다. 아래는 캐시로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 나의 캐시잔액 : " + cm.getPlayer().getCSPoints(1) + "#k\r\n#b";
            for (var i = 0; i < acc.length; i++) {
                basetext += "#L" + i + "# #t" + acc[i][0] + "# : " + acc[i][1] + "cash\r\n";
            }
            cm.sendSimple(basetext);
            status = 11;
	}
    } else if (status == 3) {
        h = etc[selection][0];
        hh = etc[selection][1];
        hhh = etc[selection][2];
        cm.sendYesNo("#b#i" + h + "# #t" + h + "##k : #r" + hh + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status++;
    } else if (status == 10) {
        h1 = cap[selection][0];
        hh1 = cap[selection][1];
        hhh1 = cap[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 12) {
        h1 = coat[selection][0];
        hh1 = coat[selection][1];
        hhh1 = coat[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 13) {
        h1 = cape[selection][0];
        hh1 = cape[selection][1];
        hhh1 = cape[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 14) {
        h1 = wp[selection][0];
        hh1 = wp[selection][1];
        hhh1 = wp[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 15) {
        h1 = hand[selection][0];
        hh1 = hand[selection][1];
        hhh1 = hand[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 11) {
        h1 = acc[selection][0];
        hh1 = acc[selection][1];
        hhh1 = acc[selection][2];
        cm.sendYesNo("#b#i" + h1 + "# #t" + h1 + "##k : #r" + hh1 + "cash#k\r\n\r\n선택하신 아이템은 위와 같습니다. 한번 구매한 캐쉬는 교환, 환불이 불가능합니다 정말로 구매하시겠습니까?");
        status = 110;
    } else if (status == 20) {

        if (mode != 1) {
            cm.dispose();
	    return;
        } 
            if (cm.getPlayer().getCSPoints(1) >= 5000) {
	cm.sendOk("분양비는 5,000cash는 #r선금#k으로 받았습니다. 자이제 랜덤으로 분양될 펫을 보여드리겠습니다.");
	cm.getPlayer().modifyCSPoints(1, -5000, true);
	status = 21;
	} else {
	cm.sendOk("보유중인 캐쉬가 부족한것 같습니다.");
                cm.dispose();
	}
    } else if (status == 30) {

        if (mode != 1) {
            cm.dispose();
	    return;
        } 
        if (cm.getPlayer().getCSPoints(1) >= 5000) {
	cm.sendOk("구매비용 5,000cash는 #r선금#k으로 받았습니다. 자이제 랜덤으로 선택될 라이딩을 보여드리겠습니다.");
	cm.getPlayer().modifyCSPoints(1, -5000, true);
	status = 31;
	} else {
	cm.sendOk("보유중인 캐쉬가 부족한것 같습니다.");
        cm.dispose();
	}
    } else if (status == 21) {
var Pet = new Array(5001011, 5001010, 5001009, 5001008, 5001007, 5001006, 5001005, 5001004, 5001003, 5001002, 5001001, 5001000, 5000417, 5000416, 5000415, 5000414, 5000409, 5000408, 5000407, 5000406, 5000405, 5000404, 5000403, 5000402, 5000387, 5000386, 5000385, 5000383, 5000381, 5000377, 5000376, 5000375, 5000368, 5000367, 5000366, 5000354, 5000353, 5000352, 5000344, 5000343, 5000342, 5000341, 5000332, 5000331, 5000330, 5000328, 5000322, 5000321, 5000320, 5000317, 5000316, 5000315, 5000314, 5000311, 5000310, 5000309, 5000299, 5000298, 5000297, 5000296, 5000295, 5000294, 5000293, 5000292, 5000291, 5000290, 5000283, 5000282, 5000281, 5000277, 5000276, 5000275, 5000273, 5000272, 5000271, 5000270, 5000269, 5000261, 5000258, 5000257, 5000256, 5000251, 5000250, 5000249, 5000245, 5000244, 5000243, 5000240, 5000239, 5000238, 5000237, 5000233, 5000232, 5000231, 5000230, 5000229, 5000228, 5000225, 5000221, 5000217, 5000216, 5000215, 5000211, 5000210, 5000207, 5000206, 5000202, 5000201, 5000171, 5000152, 5000093, 5000092, 5000091, 5000090, 5000089);
var Petr = Math.floor(Math.random() * Pet.length);
	petid = Pet[Petr];
        cm.sendSimple("랜덤 분양을 하여 #i"+petid+"# #b#t"+petid+"##k를 분양 받으셨습니다. 맘에 들지 않으신다면 #r1,000cash#k를 지불하시고 다른 펫으로 랜덤분양이 가능합니다.\r\n#b#L0#이 펫으로 분양받겠습니다.#l\r\n#L1#다른 펫으로 랜덤분양 하고싶습니다.#l\r\n")
        status = 22;
} else if (status == 31) {
var Ride = new Array(1902190,1902191,1902192,1902193,1902194,1902195,1902196,1902197,1902198,1902199,1902200,1902201,1902202,1902203,1902204,1902205,1902206,1902207,1902208,1902209,1902210,1902211,1902212,1902179,1902180,1902172,1902182,1902185,1902187,1902188,1902189,1902101,1902103,1902104,1902105,1902106,1902107,1902111,1902112,1902113,1902114,1902123,1902125,1902127,1902128,1902141,1902152,1902153,1902159,1902161,1902177,1902178,1902183,1902186,1902120,1902151,1902168,1902181,1902184,1902100,1902102,1902115,1902122,1902135,1902143,1902144,1902154,1902162,1902173,1902109,1902126,1902130,1902137,1902138,1902142,1902146,1902147,1902150,1902155,1902160,1902166,1902171,1902174,1902175);


var Rider = Math.floor(Math.random() * Ride.length);
	rideid = Ride[Rider];
        cm.sendSimple("라이딩 랜덤 구매를 통하여 #i"+rideid+"# #b#t"+rideid+"##k가 선택되셨습니다. 맘에 들지 않으신다면 #r1,000cash#k를 지불하시고 다른 라이딩으로 랜덤구매 가능합니다.\r\n#b#L0#이 라이딩으로 결정하겠습니다.#l\r\n#L1#다른 라이딩으로 랜덤분양 하고싶습니다.#l\r\n")
        status = 32;
    } else if (status == 4) {
        if (mode != 1) {
            cm.dispose();
        } else {
            if (cm.getPlayer().getCSPoints(1) >= hh) {
                if (!cm.canHold(h)) {
                    cm.sendOk("인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(h, hhh);
                cm.getPlayer().modifyCSPoints(1, -hh, false);
                cm.sendOk("감사합니다. #b#t" + h + "##k를 구매하였습니다.");
                cm.dispose();
            } else {
                cm.sendOk("선택하신 아이템을 구매하기엔 캐시잔액이 부족합니다.")
                cm.dispose();
            }
        }

    } else if (status == 110) {
        if (mode != 1) {
            cm.dispose();
        } else {
            if (cm.getPlayer().getCSPoints(1) >= hh1) {
                if (!cm.canHold(h1)) {
                    cm.sendOk("인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(h1, hhh1);
                cm.getPlayer().modifyCSPoints(1, -hh1, false);
                cm.sendOk("감사합니다. #b#t" + h1 + "##k를 구매하였습니다.");
                cm.dispose();
            } else {
                cm.sendOk("선택하신 아이템을 구매하기엔 캐시잔액이 부족합니다.")
                cm.dispose();
            }
        }
    } else if (status == 22) {
		if (selection == 0) {
                cm.gainPet(petid, cm.getItemName(petid), 1, 0, 100, 18000, 101);
                cm.sendOk("감사합니다. 귀여운 펫 #b#t" + petid + "##k가 분양되었습니다.");
                cm.dispose(); 
		}  else if (selection == 1) { 
        	if (cm.getPlayer().getCSPoints(1) >= 1000) {
		petid = 0;
		cm.sendOk("좋습니다. 다른펫을 보여드리기전에 1,000cash를 선금받았습니다. 다음 펫을 보여드리겠습니다.");
		cm.getPlayer().modifyCSPoints(1, -1000, true);
		status = 21;
		} else {
		cm.sendOk("보유중인 캐쉬가 부족한것 같습니다.");
       		cm.dispose();
		}
	}
    } else if (status == 32) {
		if (selection == 0) {
                cm.gainItem(rideid,1);
                cm.sendOk("감사합니다. 라이딩 #b#t" + rideid + "##k을 구매하셨습니다.");
		if (!cm.haveItem(1912000)) {
		cm.gainItem(1912000,1);
		cm.teachSkill(1004,1,1);
		cm.teachSkill(10001004,1,1);
		}
                cm.dispose();
		}  else if (selection == 1) { 
        	if (cm.getPlayer().getCSPoints(1) >= 1000) {
		rideid = 0;
		cm.sendOk("좋습니다. 다른 라이딩을 보여드리기전에 1,000cash를 선금받았습니다. 다음 라이딩을 보여드리겠습니다.");
		cm.getPlayer().modifyCSPoints(1, -1000, true);
		status = 31;
		} else {
		cm.sendOk("보유중인 캐쉬가 부족한것 같습니다.");
       		cm.dispose();
		}
		}
        }
    
}

