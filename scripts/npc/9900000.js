importPackage(Packages.handling.channel.handler);
importPackage(Packages.constants);

var status = 0;

function action(mode, type, selection) {



    if (mode != 1) {
        cm.dispose();
        return;
    }
        if (!cm.getPlayer().isAlive()) {
            cm.getPlayer().dropMessage(5, "캐릭터가 죽은상태에서는 이용하실수 없습니다.");
	    status = -1;
            cm.dispose();
	} 
    if (status == 0) {
	cm.sendSimple("쉼터에서만 이용하실수 있는 특별한 게이트 이다. 워프캡슐을 통하여 어디든 이동이가능하며 이전에 저장되있던 맵으로 이동할수 있는 것 같다.\r\n#b#L999#저장된 맵으로 돌아가기 #l\r\n#L0#needfix 워프캡슐을 사용하기 #l\r\n#L1#needfix 벼룩시장으로 이동하기 #l\r\n");
	status++;
    } else if (status == 1) {
if (selection == 999) {
cm.warp(cm.getPlayer().getLocation());
cm.dispose();
} else if (selection == 0) {
cm.sendSimple(" #e<#n #i4220000# #rneedfix 프리미엄워프캡슐 : 현재 "+cm.getPlayer().getItemQuantity(4220000,false)+"개 보유중#k#e >#n \r\n#L100000000##b헤네시스#l　#L200000000#오르비스#l　#L220000000#루디브리엄#l\r\n#L230000000#아쿠아리움#l#L222000000#아랫마을#l　#L211000000#엘나스#l\r\n#L240000000#리프레#l      #L261000000#마가티아#l   #L221000000#지구방위본부#l\r\n#L250000000#무릉도원#l   #L260000000#아리안트#l   #L300000000#엘린 숲#l");
status++;
} else if (selection == 1) {
cm.warp(910000001)
cm.dispose();
}
} else if(status == 2){
if (cm.haveItem(4220000,1)) {
cm.warp(selection);
cm.gainItem(4220000,-1);
cm.dispose();
} else {
cm.sendOk("프리미엄 워프캡슐이 없으면 사용할수없습니다.");
cm.dispose();
}
}
}