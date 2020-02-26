var status = -1;

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
	cm.sendYesNo("길드 관련 업무가 필요하신가요?");
    } else if (status == 1) {
	cm.warp(200000301);
	cm.dispose();
    }
}