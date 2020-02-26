

/*
 *  Cliff - Happy Ville NPC
 */

var status = -1;
var itemname;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	if (status == 0) {
	    cm.dispose();
	}
	status--;
    }
    if (status == 0) {
	cm.sendGetText("검색하려는 아이템의 이름의 일부 또는 전체를 입력해주세요\r\n#r(!)#k 띄어 쓰기 포함됩니다.");
    } else if (status == 1) {
	itemname = cm.getText();
	if (itemname == "" || itemname == null || itemname == " ") {
		cm.sendOk("잘못된 아이템 이름입니다.");		
		cm.dispose();
		return;
	}
	var chat = cm.getItemNames(cm.getText());
	cm.sendSimple(chat == "잘못된 아이템 이름입니다." ? chat : "아래는 입력하신 검색어의 연관아이템 입니다.\r\n어떤 아이템의 드롭정보를 확인하시겠습니까?\r\n#b" + chat);
	if (chat == "잘못된 아이템 이름입니다.")
	cm.dispose();
    } else if (status == 2) {
	var chat = cm.MonsterDrop(selection);
	cm.sendSimple(chat == "선택한 아이템을 드롭하는 몬스터가 존재하지 않습니다." ? chat : "#b" + cm.getItemName(selection) + "#k(을)를 드롭하는 몬스터 리스트 입니다.\r\n#b" + chat);
	cm.dispose();
    }
}