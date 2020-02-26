/* guild emblem npc */
var status = 0;
var sel;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;

    if (status == 0)
	cm.sendSimple("저는 길드 마크 제작 업무를 맡고 있습니다. 길드 마크는 길드장만 변경할 수 있답니다. 원하는 것이 있으세요?\r\n#b#L0#길드마크 추가/변경#l#k");
    else if (status == 1) {
	sel = selection;
	if (selection == 0) {
	    if (cm.getPlayerStat("GRANK") == 1)
		cm.sendYesNo("길드마크 추가/변경 수수료는 #b500만 메소#k 입니다. 길드 마크를 제작해 보시고 싶으신가요?");
	    else
		cm.sendOk("길드장만 길드 마크를 추가하거나 변경할 수 있답니다. 당신은 길드장이 아닌 것 같군요.");
	}
    } else if (status == 2) {
	if (sel == 0) {
            if (cm.haveItem(5220001, 1))  { cm.gainMeso(5000000); cm.gainItem(5220001, -1); }
	    cm.genericGuildMessage(17);
	    cm.dispose();
	}
    }
}
