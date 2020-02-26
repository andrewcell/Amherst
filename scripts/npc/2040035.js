var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("모든 스테이지를 클리어 하고 이곳까지 오시다니 대단하시군요. 클리어를 축하드리며 작은 선물을 준비했습니다. 선물을 받으시기 전에 미리 아이템 소비창이나 기타창에 빈 칸이 하나 이상 있는지 확인해 주세요~");
    } else if (status == 1) {
        if (!cm.canHoldSlots(2)) {
            cm.sendOk("장비, 소비, 설치, 기타 탭을 최소 2칸 이상 비우신 후 다시 말을 걸어주세요.");
            cm.dispose();
            return;
        }
        
        
        var rnum = cm.rand( 0, 250 );
        var nNewItemID = 0;
        var nNewItemNum = 0;
        if ( rnum == 0 ) {
            nNewItemID = 2000004;
            nNewItemNum = 10;
        }
        else if ( rnum == 1 ) {
            nNewItemID = 2000002;
            nNewItemNum = 100;
        }
        else if ( rnum == 2 ) {
            nNewItemID = 2000003;
            nNewItemNum = 100;
        }
        else if ( rnum == 3 ) {
            nNewItemID = 2000006;
            nNewItemNum = 30;
        }
        else if ( rnum == 4 ) {
            nNewItemID = 2022000;
            nNewItemNum = 30;
        }
        else if ( rnum == 5 ) {
            nNewItemID = 2022003;
            nNewItemNum = 30;
        }
        else if ( rnum == 6 ) {
            nNewItemID = 2040002;
            nNewItemNum = 1;
        }
        else if ( rnum == 7 ) {
            nNewItemID = 2040402;
            nNewItemNum = 1;
        }
        else if ( rnum == 8 ) {
            nNewItemID = 2040502;
            nNewItemNum = 1;
        }
        else if ( rnum == 9 ) {
            nNewItemID = 2040505;
            nNewItemNum = 1;
        }
        else if ( rnum == 10 ) {
            nNewItemID = 2040602;
            nNewItemNum = 1;
        }
        else if ( rnum == 11 ) {
            nNewItemID = 2040802;
            nNewItemNum = 1;
        }
        else if ( rnum == 12 ) {
            nNewItemID = 4003000;
            nNewItemNum = 50;
        }
        else if ( rnum == 13 ) {
            nNewItemID = 4010000;
            nNewItemNum = 15;
        }
        else if ( rnum == 14 ) {
            nNewItemID = 4010001;
            nNewItemNum = 15;
        }
        else if ( rnum == 15 ) {
            nNewItemID = 4010002;
            nNewItemNum = 15;
        }
        else if ( rnum == 16 ) {
            nNewItemID = 4010003;
            nNewItemNum = 15;
        }
        else if ( rnum == 17 ) {
            nNewItemID = 4010004;
            nNewItemNum = 15;
        }
        else if ( rnum == 18 ) {
            nNewItemID = 4010005;
            nNewItemNum = 15;
        }
        else if ( rnum == 19 ) {
            nNewItemID = 4010006;
            nNewItemNum = 10;
        }
        else if ( rnum == 20 ) {
            nNewItemID = 4020000;
            nNewItemNum = 15;
        }
        else if ( rnum == 21 ) {
            nNewItemID = 4020001;
            nNewItemNum = 15;
        }
        else if ( rnum == 22 ) {
            nNewItemID = 4020002;
            nNewItemNum = 15;
        }
        else if ( rnum == 23 ) {
            nNewItemID = 4020003;
            nNewItemNum = 15;
        }
        else if ( rnum == 24 ) {
            nNewItemID = 4020004;
            nNewItemNum = 15;
        }
        else if ( rnum == 25 ) {
            nNewItemID = 4020005;
            nNewItemNum = 15;
        }
        else if ( rnum == 26 ) {
            nNewItemID = 4020006;
            nNewItemNum = 15;
        }
        else if ( rnum == 27 ) {
            nNewItemID = 4020007;
            nNewItemNum = 6;
        }
        else if ( rnum == 28 ) {
            nNewItemID = 4020008;
            nNewItemNum = 6;
        }
        else if ( rnum == 29 ) {
            nNewItemID = 1032002;
            nNewItemNum = 1;
        }
        else if ( rnum == 30 ) {
            nNewItemID = 1032011;
            nNewItemNum = 1;
        }
        else if ( rnum == 31 ) {
            nNewItemID = 1032008;
            nNewItemNum = 1;
        }
        else if ( rnum == 32 ) {
            nNewItemID = 1102011;
            nNewItemNum = 1;
        }
        else if ( rnum == 33 ) {
            nNewItemID = 1102012;
            nNewItemNum = 1;
        }
        else if ( rnum == 34 ) {
            nNewItemID = 1102013;
            nNewItemNum = 1;
        }
        else if ( rnum == 35 ) {
            nNewItemID = 1102014;
            nNewItemNum = 1;
        }
        else if ( rnum == 36 ) {
            nNewItemID = 2040803;
            nNewItemNum = 1;
        }
        else if ( rnum == 37 ) {
            nNewItemID = 2070011;
            nNewItemNum = 1;
        }
        else if ( rnum == 38 ) {
            nNewItemID = 2043001;
            nNewItemNum = 1;
        }
        else if ( rnum == 39 ) {
            nNewItemID = 2043101;
            nNewItemNum = 1;
        }
        else if ( rnum == 40 ) {
            nNewItemID = 2043201;
            nNewItemNum = 1;
        }
        else if ( rnum == 41 ) {
            nNewItemID = 2043301;
            nNewItemNum = 1;
        }
        else if ( rnum == 42 ) {
            nNewItemID = 2043701;
            nNewItemNum = 1;
        }
        else if ( rnum == 43 ) {
            nNewItemID = 2043801;
            nNewItemNum = 1;
        }
        else if ( rnum == 44 ) {
            nNewItemID = 2044001;
            nNewItemNum = 1;
        }
        else if ( rnum == 45 ) {
            nNewItemID = 2044101;
            nNewItemNum = 1;
        }
        else if ( rnum == 46 ) {
            nNewItemID = 2044201;
            nNewItemNum = 1;
        }
        else if ( rnum == 47 ) {
            nNewItemID = 2044301;
            nNewItemNum = 1;
        }
        else if ( rnum == 48 ) {
            nNewItemID = 2044401;
            nNewItemNum = 1;
        }
        else if ( rnum == 49 ) {
            nNewItemID = 2044501;
            nNewItemNum = 1;
        }
        else if ( rnum == 50 ) {
            nNewItemID = 2044601;
            nNewItemNum = 1;
        }
        else if ( rnum == 51 ) {
            nNewItemID = 2044701;
            nNewItemNum = 1;
        }
        else if ( rnum == 52 ) {
            nNewItemID = 2000004;
            nNewItemNum = 15;
        }
        else if ( rnum == 53 ) {
            nNewItemID = 2000002;
            nNewItemNum = 80;
        }
        else if ( rnum == 54 ) {
            nNewItemID = 2000003;
            nNewItemNum = 80;
        }
        else if ( rnum == 55 ) {
            nNewItemID = 2000006;
            nNewItemNum = 25;
        }
        else if ( rnum == 56 ) {
            nNewItemID = 2022000;
            nNewItemNum = 25;
        }
        else if ( rnum == 57 ) {
            nNewItemID = 2022003;
            nNewItemNum = 25;
        }
        else if ( rnum == 58 ) {
            nNewItemID = 4003000;
            nNewItemNum = 55;
        }
        else if ( rnum == 59 ) {
            nNewItemID = 4010000;
            nNewItemNum = 12;
        }
        else if ( rnum == 60 ) {
            nNewItemID = 4010001;
            nNewItemNum = 12;
        }
        else if ( rnum == 61 ) {
            nNewItemID = 4010002;
            nNewItemNum = 12;
        }
        else if ( rnum == 62 ) {
            nNewItemID = 4010003;
            nNewItemNum = 12;
        }
        else if ( rnum == 63 ) {
            nNewItemID = 4010004;
            nNewItemNum = 12;
        }
        else if ( rnum == 64 ) {
            nNewItemID = 4010005;
            nNewItemNum = 12;
        }
        else if ( rnum == 65 ) {
            nNewItemID = 4010006;
            nNewItemNum = 8;
        }
        else if ( rnum == 66 ) {
            nNewItemID = 4020000;
            nNewItemNum = 12;
        }
        else if ( rnum == 67 ) {
            nNewItemID = 4020001;
            nNewItemNum = 12;
        }
        else if ( rnum == 68 ) {
            nNewItemID = 4020002;
            nNewItemNum = 12;
        }
        else if ( rnum == 69 ) {
            nNewItemID = 4020003;
            nNewItemNum = 12;
        }
        else if ( rnum == 70 ) {
            nNewItemID = 4020004;
            nNewItemNum = 12;
        }
        else if ( rnum == 71 ) {
            nNewItemID = 4020005;
            nNewItemNum = 12;
        }
        else if ( rnum == 72 ) {
            nNewItemID = 4020006;
            nNewItemNum = 12;
        }
        else if ( rnum == 73 ) {
            nNewItemID = 4020007;
            nNewItemNum = 4;
        }
        else if ( rnum == 74 ) {
            nNewItemID = 4020008;
            nNewItemNum = 4;
        }
        else if ( rnum == 75 ) {
            nNewItemID = 2040001;
            nNewItemNum = 1;
        }
        else if ( rnum == 76 ) {
            nNewItemID = 2040004;
            nNewItemNum = 1;
        }
        else if ( rnum == 77 ) {
            nNewItemID = 2040301;
            nNewItemNum = 1;
        }
        else if ( rnum == 78 ) {
            nNewItemID = 2040401;
            nNewItemNum = 1;
        }
        else if ( rnum == 79 ) {
            nNewItemID = 2040501;
            nNewItemNum = 1;
        }
        else if ( rnum == 80 ) {
            nNewItemID = 2040504;
            nNewItemNum = 1;
        }
        else if ( rnum == 81 ) {
            nNewItemID = 2040601;
            nNewItemNum = 1;
        }
        else if ( rnum == 82 ) {
            nNewItemID = 2040601;
            nNewItemNum = 1;
        }
        else if ( rnum == 83 ) {
            nNewItemID = 2040701;
            nNewItemNum = 1;
        }
        else if ( rnum == 84 ) {
            nNewItemID = 2040704;
            nNewItemNum = 1;
        }
        else if ( rnum == 85 ) {
            nNewItemID = 2040707;
            nNewItemNum = 1;
        }
        else if ( rnum == 86 ) {
            nNewItemID = 2040801;
            nNewItemNum = 1;
        }
        else if ( rnum == 87 ) {
            nNewItemID = 2040901;
            nNewItemNum = 1;
        }
        else if ( rnum == 88 ) {
            nNewItemID = 2041001;
            nNewItemNum = 1;
        }
        else if ( rnum == 89 ) {
            nNewItemID = 2041004;
            nNewItemNum = 1;
        }
        else if ( rnum == 90 ) {
            nNewItemID = 2041007;
            nNewItemNum = 1;
        }
        else if ( rnum == 91 ) {
            nNewItemID = 2041010;
            nNewItemNum = 1;
        }
        else if ( rnum == 92 ) {
            nNewItemID = 2041013;
            nNewItemNum = 1;
        }
        else if ( rnum == 93 ) {
            nNewItemID = 2041016;
            nNewItemNum = 1;
        }
        else if ( rnum == 94 ) {
            nNewItemID = 2041019;
            nNewItemNum = 1;
        }
        else if ( rnum == 95 ) {
            nNewItemID = 2041022;
            nNewItemNum = 1;
        }
        else if ( rnum >= 96 && rnum <= 150 ) {
            nNewItemID = 2000004;
            nNewItemNum = 10;
        }
        else if ( rnum >= 151 && rnum <= 200 ) {
            nNewItemID = 2000002;
            nNewItemNum = 100;
        }
        else {
            nNewItemID = 2000003;
            nNewItemNum = 100;
        }
        cm.gainItem(nNewItemID, nNewItemNum);
	cm.getPlayer().modifyCSPoints(2, 350, true);
	cm.gainExp(99999);
        cm.warp(922010000);
        var qr = cm.getQuestRecord(199600);
        var val = qr.getCustomData();
        if (val == null) {
            qr.setCustomData("0");
        }
        qr.setCustomData("" + (parseInt(qr.getCustomData()) + 1));
        cm.dispose();
            
    }
}