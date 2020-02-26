var status = 0;

function action(mode, type, selection) {

var mapid = cm.getPlayer().getMapId();
var monstercount = cm.getPlayer(). getMobQuantity();
	if (status == 20) {
	if (selection == 0) {
	cm.warp(221024500);
	cm.dispose();
	}

    } else if (status == 0) {
	if (cm.isLeader()) {
	if (cm.getPlayer().partyMembersInMap() == cm.getPlayer().getParty().getMembers().size()) {
	if (mapid == 970040100) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(500);
	cm.warpParty(mapid+100);
	cm.sendOk("#e#r<스테이지 No.2 : 스텀피>#k#n\r\n이번 스테이지의 보스몬스터 #b스텀피#k가 출현했습니다. 스테이지의 제한시간은 #r1분#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500338, 1221, 2194);
        cm.dispose();
	}
        } else if (mapid == 970040200) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(600);
	cm.warpParty(mapid+100);
	cm.sendOk("#e#r<스테이지 No.3 : 데우>#k#n\r\n이번 스테이지의 보스몬스터 #b데우#k가 출현했습니다. 스테이지의 제한시간은 #r1분 30초#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500339, 719, 275);
        cm.dispose();
	}
        } else if (mapid == 970040300) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(700);
	cm.warpParty(mapid+100);
	cm.sendOk("#e#r<스테이지 No.5 : 킹슬라임>#k#n\r\n이번 스테이지의 보스몬스터 #b킹슬라임#k가 출현했습니다. 스테이지의 제한시간은 #r2분#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500340, 92, -435);
        cm.dispose();
	}
        } else if (mapid == 970040400) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(800);
	cm.warpParty(mapid+100);
	cm.sendOk("#e#r<스테이지 No.5 : 파우스트>#k#n\r\n이번 스테이지의 보스몬스터 #b파우스트#k가 출현했습니다. 스테이지의 제한시간은 #r2분 30초#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500341, 964, -142);
        cm.dispose();
	}
        } else if (mapid == 970040500) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(900);
	cm.warpParty(970040900);
	cm.sendOk("#e#r<스테이지 No.6 : 머쉬맘>#k#n\r\n이번 스테이지의 보스몬스터 #b머쉬맘#k이 출현했습니다. 스테이지의 제한시간은 #r3분#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500326, -693, 215);
        cm.dispose();
	}
        } else if (mapid == 970040900) {
	if (monstercount >= 1) {
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	} else {
	cm.givePartyExp(1000);
	cm.warpParty(970042200);
	cm.sendOk("#e#r<스테이지 FINAL : 크림슨발록>#k#n\r\n최종 보스몬스터 #b크림슨발록#k이 출현했습니다. 스테이지의 제한시간은 #r4분#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.killAllMob();  cm.spawnMob(9500171, 326, -399);
        cm.dispose();
	}
	//} else {
	//cm.sendOk("게임종료한 파티원, 다른맵에있는 파티원이 있다면 강퇴해주세요.");
	//cm.dispose();
	}
	}
        } else {	
	cm.sendSimple("아직 스테이지에 보스가 남아있습니다. 항상 저희는 유저여러분들의 안정을 생각하여 중도포기가 가능하게 설정되어있답니다. 파티퀘스트를 포기하시겠습니까?#b\r\n#L0#네, 포기하겠습니다.#l");
	status = 20;
	}
        if (mapid == 970042200) {
	if (monstercount >= 1) {
	cm.sendOk("#e#r<스테이지 FINAL : 크림슨발록>#k#n\r\n최종 보스몬스터 #b크림슨발록#k이 출현했습니다. 스테이지의 제한시간은 #r3분 30초#k 입니다. 서둘러서 보스를 처치하고 다음단계로 넘어가도록 하지요.");
	cm.dispose();
	} else {
   	var hp = cm.getQuestRecord(53789);
        if (hp.getCustomData() == null) {
        hp.setCustomData("0");
        }
	var hpoint = java.lang.Integer.parseInt(hp.getCustomData());
 	hp.setCustomData((hpoint + 1) + "");
	cm.gainExp(3000);
	cm.warpParty(221024500);
	cm.getPlayer().modifyCSPoints(2, 75, false);
	cm.sendOk("#e#r<MISSON CLEAR>#k#n\r\n수고하셨습니다! 모든 라운드를 성공적으로 클리어하셨습니다. 요원 포인트가 + 1 증가하였으며, 파티원 전원에게 경험치 3,000과 메이플포인트 75를 드렸습니다.");
        cm.dispose();
	}
	}
}
}
	