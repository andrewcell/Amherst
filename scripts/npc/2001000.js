var status = 0;

var ret = new Array(1,2,3);
var retr = Math.floor(Math.random() * ret.length);

var item = [[1002728,70,1],[2040023,13,1],[5060002,15,1],[4350000,30,100],[1142373,80,1],[1112595,70,1],[1902195,40,1],[4033616,50,1],[1102700,30,1],[1442046,35],[1442157,30,1],[1702348,20,1],[1102196,10,1]];

function action(mode, type, selection) {

var customData = cm.getQuestRecord(50011);
var rudi = cm.getQuestRecord(57111);
if (rudi.getCustomData() == null) {
rudi.setCustomData("안함");
}
	if (status == 0) {
	if (rudi.getCustomData() == "안함") {
	cm.sendSimple("크리스마스 인데도 사람이 참 많군요 깔깔깔... 솔로가 대세인가보죠? 깔깔깔\r\n#b#L0#잘지내셨나요 클리프 산타님!?#l\r\n#L1#토르의 뿔을 찾아주려고 왔어요~#l\r\n#L2#눈꽃코인 상점을 이용하고 싶어요.#l");
  	} else {
	cm.sendSimple("크리스마스 인데도 사람이 참 많군요 깔깔깔... 솔로가 대세인가보죠? 깔깔깔\r\n#b#L0#잘지내셨나요 클리프 산타님!?#l\r\n#L2#눈꽃코인 상점을 이용하고 싶어요.#l");
	}
	status++;
  } else if (status == 1) {
	if (selection == 0) {
	if (!cm.haveItem(4001141,1)) {
	cm.sendNext("안녕하세요 모험가님, 크리스마스에도 밖에 나가시지 않고 needfix를 하는 이유는 다 있겠죠? 깔깔깔 #r(얄밉얄밉)#k 그래서 제가 크리스마스를 맞아 needfix 모험가님들을 위해 작은 선물을 준비했답니다.");
        status++;
	} else {
	cm.gainItem(4001141,-1);
	if (ret[retr] == 1) {
	cm.gainItem(1012007,1);
	cm.gainItem(1002225,1);
	cm.gainItem(1052567,1);
	cm.gainItem(1071003,1);
	} else if (ret[retr] == 2) {
	cm.gainItem(1002479,1);
	cm.gainItem(1082155,1);
	cm.gainItem(1072278,1);
	} else if (ret[retr] == 3) {
	cm.gainItem(1052693,1);
	cm.gainItem(1004048,1);
	cm.gainItem(1052046,1);
	cm.gainItem(1072253,1);
	cm.gainItem(1102288,1);
	}
	cm.sendOk("정말 가지고 올줄이야, 집념이 대단한걸? 그 정신으로 애인을 사귀었으면 지금 크리스마스에 컴퓨터 앞에 앉아있겠나 깔깔깔 #r(개얄밉얄밉)#k 이상한 소리는 그만하고 자 여깄네 내 선물을 받아주게나.");
	cm.dispose();
	}
	} else if (selection == 2) {
	            var basetext = "\r\n#b";
            for (var i = 0; i < item.length; i++) {
                basetext += "#L" + i + "# #i"+item[i][0]+"# #t" + item[i][0] + "# : " + item[i][1] + "개\r\n";
            }
            cm.sendSimple(basetext);
            status = 50;
	} else if (selection == 1) {
var Pet = new Array(1012011,1012012,1012013,1012014,1012015,1012016,1012017,1012018,1012019,1012020,1012161);
var Petr = Math.floor(Math.random() * Pet.length);
	if (cm.haveItem(4031063,1)) {
	cm.gainItem(4031063,-1);
	cm.gainItem(Pet[Petr],1);
	cm.gainItem(1142166,1);
	cm.sendOk("토르가 정말 고맙다고 자네에게 선물을 하고 싶다는 구만 아이템은 잘받았길 바라겠네.");
	rudi.setCustomData("함");
	cm.dispose();
	} else {
	cm.sendOk("허허 요즘은 구라치면 손모가지 날라가는 세상이라네...");
	cm.dispose();
	}
	}
	} else if (status == 2) {
	cm.sendNextPrev("하지만 그냥드릴수는 없다는거, 이 세상에 공짜가 어디있겠습니까! 행복한 마을을 어지럽히는 눈사람 괴물을 처치하고  #i4001141# #b#t4001141##k를 가져와주세요!");
        cm.dispose();
	} else if (status == 50) {
            if (cm.haveItem(4310014,item[selection][1])) {
                cm.gainItem(4310014,-item[selection][1]);
                cm.gainItem(item[selection][0],item[selection][2]);
		cm.sendOk("잘써주게나 솔로여 깔깔깔");
                cm.dispose();
            } else {
                cm.sendOk("입력하신 환산수치보다 보유중인 포인트가 부족합니다.");
                cm.dispose();
            }
    }
}