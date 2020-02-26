importPackage(Packages.server);
importPackage(Packages.client);
importPackage(java.util);
importPackage(java.lang);
importPackage(Packages.tools);
importPackage(Packages.tools.packet);


var status = 0;
var h = 0;
var hh = 0;
var hhh = 0;

var item = [[5520000,1500,1],[4220000, 1000, 1], [4033919, 1200, 1], [4170049, 1500, 1], [5071000, 300, 30], [5072000, 400, 30], [5076000, 500, 30], [3014000, 3000, 1], [5030000, 500, 1], [5030010, 500, 1], [5030008, 500, 1], [5030004, 500, 1], [5030002, 500, 1]];
var hitem = [[1302999,100,1],[1122017,80,1],[1112405,50,1],[2430218,30,1],[1112400,25,1],[4034218,20,1],[4001126,3,1],[4031456,10,1],[5060002,4,1]];
function action(mode, type, selection) {

    var ep = cm.getQuestRecord(51234);
    var hp = cm.getQuestRecord(58585);

    if (ep.getCustomData() == null) {
        ep.setCustomData("0");
    }
    if (hp.getCustomData() == null) {
        hp.setCustomData("0");
    }
    if (status == 0) {
        cm.sendSimple("안녕하세요, 저는 needfix에서 회계직을 담당하는 미스 어카운트 라고 합니다. 사냥을 통해 적립된 헌팅포인트관련 업무를 집중적으로 하고있으니 많이 이용해주시기 바랍니다.#b\r\n#L0#헌팅포인트 상점 이용하기. #l\r\n#L2##r[HOT]#k #b홍보포인트 상점 이용하기. #l\r\n#L1#헌팅포인트를 메이플포인트로 환전하기. #l\r\n#L3#홍보포인트를 후원캐쉬로 환전하기. #l");
        status++;
    } else if (status == 1) {
        if (selection == 0) {
            var basetext = "어서오세요 헌팅포인트상점을 찾아주셔서 감사합니다. 아래는 헌팅포인트로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 헌팅포인트 : " + ep.getCustomData() + "점#k\r\n#b";
            for (var i = 0; i < item.length; i++) {
                basetext += "#L" + i + "# #t" + item[i][0] + "# : " + item[i][1] + "점\r\n";
            }
            cm.sendSimple(basetext);
            status++;
        } else if (selection == 1) {
            cm.sendGetNumber("헌팅포인트로 환전할 메이플포인트의 값을 입력해주세요.\r\n#r(!)#k 100 메이플 포인트당 100 헌팅포인트.", 0, 0, 1000000);
            status = 99;
        } else if (selection == 3) {
            cm.sendGetNumber("홍보포인트로 환전할 후원캐쉬의 값을 입력해주세요.\r\n#r(!)#k 1 홍보포인트당 300 후원캐쉬.", 0, 0, 1000000);
            status = 999;
        } else if (selection == 2) {
            var basetext = "어서오세요 홍보포인트상점을 찾아주셔서 감사합니다. 아래는 홍보포인트로 구매가능한 아이템리스트 입니다. 원하시는 아이템을 선택해주시기 바랍니다.\r\n#r* 현재 홍보포인트 : " + hp.getCustomData() + "점#k\r\n#b";
            for (var i = 0; i < hitem.length; i++) {
                basetext += "#L" + i + "# #t" + hitem[i][0] + "# : " + hitem[i][1] + "점\r\n";
            }
            cm.sendSimple(basetext);
            status = 88;

        }
    } else if (status == 99) {
        if (mode != 1) {
            cm.dispose();
        } else {
            var epp = java.lang.Integer.parseInt(ep.getCustomData());
            if (epp >= selection) {
                ep.setCustomData((epp - selection) +"");
                cm.getPlayer().modifyCSPoints(2, selection, true);
                cm.sendOk(selection  + "헌팅포인트를 환산하여 #b" + selection + "#k 메이플 포인트를 획득하셨습니다.");
                cm.dispose();
            } else {
                cm.sendOk("입력하신 환산수치보다 보유중인 포인트가 부족합니다.");
                cm.dispose();
            }
        }
    } else if (status == 999) {
        if (mode != 1) {
            cm.dispose();
        } else {
            var hpp = java.lang.Integer.parseInt(hp.getCustomData());
            if (hpp >= selection) {
                hp.setCustomData((hpp - selection) +"");
                cm.getPlayer().modifyCSPoints(1, selection*300, true);
                cm.sendOk(selection  + "홍보포인트를 환산하여 #b" + selection*300 + "#k 후원캐쉬를 획득하셨습니다.");
                cm.dispose();
            } else {
                cm.sendOk("입력하신 환산수치보다 보유중인 포인트가 부족합니다.");
                cm.dispose();
            }
        }
    } else if (status == 88) {
        h = hitem[selection][0];
        hh = hitem[selection][1];
        hhh = hitem[selection][2];
        cm.sendYesNo("#b#i" + h + "# #t" + h + "##k를 정말로 구매하시겠습니까?");
        status = 89;

    } else if (status == 89) {
        var hpoint = java.lang.Integer.parseInt(hp.getCustomData());
        if (hpoint >= hh) {
            if (!cm.canHold(h)) {
                cm.sendOk("인벤토리가 부족합니다.");
                cm.safeDispose();
                return;
            }
            cm.gainItem(h, hhh);
            hp.setCustomData((hpoint - hh) + "");
            cm.sendOk("홍보포인트로 #b#t" + h + "##k를 구매하였습니다.");
            cm.dispose();
        } else {
            cm.sendOk("선택하신 아이템을 구매하기엔 홍보포인트가 부족합니다.")
            cm.dispose();
        }
    } else if (status == 2) {
        var point = java.lang.Integer.parseInt(ep.getCustomData());
        if (point > item[selection][1]) {
            if (!cm.canHold(item[selection][0])) {
                cm.sendOk("인벤토리가 부족합니다.");
                cm.safeDispose();
                return;
            }
            cm.gainItem(item[selection][0], item[selection][2]);
            ep.setCustomData((point - item[selection][1]) + "");
            cm.sendOk("#b#i" + item[selection][0] + "# #t" + item[selection][0] + "# " + item[selection][2] + "개#k를 구매하였습니다.");
            cm.dispose();
        } else {
            cm.sendOk("선택하신 아이템을 구매하기엔 헌팅포인트가 부족합니다.")
            cm.dispose();
        }
    }
}
