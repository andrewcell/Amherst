var status = 0;
var item = [[1032058, 50, 1],[1002800,60,1],[2049104,35,1]];

function action(mode, type, selection) {

var ep = cm.getQuestRecord(53789);
var mapid = cm.getPlayer().getMapId();
var monstercount = cm.getPlayer(). getMobQuantity();
    if (ep.getCustomData() == null) {
        ep.setCustomData("0");
    }
    if (status == 0) {
	cm.sendSimple("#e#r<파티퀘스트 : 요원의 훈련장>#k#n\r\n안녕하십니까 삐비빅... 저는 요원훈련을 담당하는 로봇엔피시 입니다... 운영자님께서... 특별히 메이플 요원들에게 장소를 제공받아 한가지의 컨텐츠를 제작했습니다 삐비빅... 도전해보시겠습니까? 비삐빅...?\r\n#b#L0#훈련을 시작하겠습니다.#l\r\n#L1#요원포인트를 사용하고 싶습니다.#l\r\n");
	status++;
	} else if (status == 1){
	if (selection == 0) {
	if (cm.getParty() != null) {
	if (cm.isLeader()) {
	if (cm.getPlayer().partyMembersInMap() == cm.getPlayer().getParty().getMembers().size()) {
	if (cm.getPlayerCount(970040100) == 0 && cm.getPlayerCount(970040200) == 0 && cm.getPlayerCount(970040300) == 0 && cm.getPlayerCount(970040400) == 0 && cm.getPlayerCount(970040500) == 0 && cm.getPlayerCount(970040600) == 0 && cm.getPlayerCount(970040700) == 0 && cm.getPlayerCount(970040800) == 0 && cm.getPlayerCount(970040900) == 0) {
	if (cm.getPlayer().getParty().getMembers().size() >= 2) {
        var party = cm.getParty().getMembers();
        var mapId = cm.getMapId();
        var next = true;
        var levelValid = 0;
        var inMap = 0;
        var it = party.iterator();
        while (it.hasNext()) {
            var cPlayer = it.next();
            if ((cPlayer.getLevel() >= 30 && cPlayer.getLevel() <= 70) || cPlayer.getJobId() == 900) {
                levelValid += 1;
            } else {
                next = false;
            }
        }
	if (next) {
	cm.warpParty(970040100);
	cm.sendOk("#e#r<스테이지 No.1 : 마노>#k#n\r\n이번 스테이지의 보스몬스터 #b마노#k가 출현했습니다. 스테이지의 제한시간은 #r1분#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  
	cm.spawnMob(9500337, 275, 455);
	cm.dispose();
	} else {
	cm.sendOk("이 컨텐츠에 레벨 제한은 #r30 ~ 70#k 입니다.");
	cm.dispose();
	}
	} else {
	cm.sendOk("2인 이상이 동행해야하는 컨텐츠입니다.");
	cm.dispose();
	}
	} else {
	cm.sendOk("이미 다른 파티가 수행중입니다..");
	cm.dispose();
	}
	} else {
	cm.sendOk("파티원이 전원 모여있어야 도전할수 있습니다.");
	cm.dispose();
	}
	} else {
	cm.sendOk("파티장만이 시작할 수 있습니다.");
	cm.dispose();
	}
	} else {
	cm.sendOk("파티를 생성후 도전할수 있습니다.");
	cm.dispose();
	}
	} else if (selection == 1) {
            var basetext = "열심히 단련한 요원 훈련점수로 특별한 아이템을 판매 중입니다. 당신의 노력의 결실이니 아래중 원하는 아이템과 점수를 부담갖지 말고 교환하세요.\r\n#r* 현재 요원훈련 점수 : " + ep.getCustomData() + "점#k\r\n#b";
            for (var i = 0; i < item.length; i++) {
                basetext += "#L" + i + "# #t" + item[i][0] + "# : " + item[i][1] + "점\r\n";
            }
            cm.sendSimple(basetext);
            status++;
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
            cm.sendOk("선택하신 아이템을 구매하기엔 요원점수가 부족합니다.")
            cm.dispose();
        }
	}
}