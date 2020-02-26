/*
이스트월드 단풍잎교환
*/

var item = Array(2043701,2043801,2043201,2043301,2043001,2043101,2040804,2044101,2044001,2044301,2044401,2044201,2044601,2044501,2044801,2044901,2044701,4031456,2070005,2070006,2330003,2330004,2330005);
var itemCost = Array(100,100,100,100,100,100,200,100,100,100,100,100,100,100,100,100,100,150,100,300,60,80,100);
//4000630
importPackage(net.sf.odinms.client);

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
	cm.dispose();
	} else {
	if (mode == 0 && status == 0) {
	cm.dispose();
        return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
	var sentence = "안녕하세요 저는 #r각종 소모품#k을 단풍잎을 받고 교환해주는 #b요원 E#k입니다. 원하시는것을 고르세요\r\n   #z4001126##k은 모든 몬스터를 잡을시 랜덤으로 드롭됩니다.  ";
		for (var i = 0; i < item.length; i++) {
		sentence += "\r\n#b#L" + i + "##v4001126#  " + itemCost[i] + "개#k   =  " + "#v" + item[i] + "#" + "#z" + item[i] + "#";
		}
	cm.sendSimple(sentence);
	} else if (status == 1) {
		if (cm.haveItem(4001126,itemCost[selection])) {
		var tmp = "#v" + item[selection] +  "#" + "#b" + "  #t" + item[selection] + "##k을(를) 드렸습니다. 나중에 또 들러주세요~"; 
		cm.gainItem(item[selection],1);
		cm.gainItem(4001126,-itemCost[selection]);
		cm.sendOk(tmp);
		cm.dispose()
		} else {
		var stmp = "#v" + item[selection] +  "#" + "#b" + "  #t" + item[selection] + "##k을(를) 드리기에는 #r#b#i4001126##z4001126##k이 부족합니다!";
		cm.sendOk(stmp);
		cm.dispose();
		}
	}
    }
}