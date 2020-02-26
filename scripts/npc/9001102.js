importPackage(Packages.client.inventory);
importPackage(Packages.server);
importPackage(Packages.tools);
importPackage(java.util);
importPackage(Packages.handling.world);

var status = 0;

var hptem = 4001126;
var mptem = 401126;
var ttem = 4000994;

var T = new Array(1902126, 1902130, 1902137, 1902138, 1902142, 1902109, 1902150, 1902147, 1902146, 1902155, 1902166, 1902160, 1902174, 1902175, 1902171, 1902115, 1902120, 1902122, 1902135, 1902143, 1902102, 1902100, 1902151, 1902144, 1902154, 1902162, 1902173, 1902168);
var Tr = Math.floor(Math.random() * T.length);

function action(mode, type, selection) {
if (status == 0) {
cm.sendSimple("#e#h ##n 안녕?\r\n난 HP,MP각성을  제공해주는 #r아기 월묘#k라고해\r\n무엇을 도와줄까?\r\n#L0##e#i4001126##z4001126#를 50개 사용하여 체력 100만큼 강화\r\n#L1##i4001126##z4001126#를 50개 사용하여 마력 100만큼 강화\r\n");
status ++;
} else if (status == 1) {
if (selection == 0) {
if (cm.haveItem(hptem,50)) {
cm.getPlayer().getStat().setMaxHp(cm.getPlayer().getStat().getMaxHp()+100,cm.getPlayer());
cm.gainItem(hptem,-50);
cm.reloadChar();
cm.dispose();
} else {
cm.sendOk("#e#i4001126##z4001126# #r아이템을 충분히 소지하고 있지 않습니다.#k\r\n#i4001126#는 모든 몬스터를 사냥시 랜덤으로 드롭됩니다.#n");
cm.dispose();
}
} else if (selection == 1) {
if (cm.haveItem(mptem,50)) {
cm.getPlayer().getStat().setMaxMp(cm.getPlayer().getStat().getMaxMp()+100,cm.getPlayer());
cm.gainItem(mptem,-50);
cm.reloadChar();
cm.dispose();
} else {
cm.sendOk("#e#i4001126##z4001126# #r아이템을 소지하고 있지 않습니다.#k\r\n#i4001126#는 모든 몬스터를 사냥시 랜덤으로 드롭됩니다.#n");
cm.dispose();
}
} else if (selection == 2) {
if (cm.haveItem(ttem,1)) {
cm.timeGiveItem(T[Tr],14400);
cm.gainItem(ttem,-1);
World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(2,"이스트월드 : "+cm.getPlayer().getName()+"님이 알부화를 시작하였습니다."));
cm.dispose();
} else {
cm.sendOk("#e#i4000994##z4000994# #r아이템을 소지하고 있지 않습니다.#k\r\n#i4000994#는 스페셜 보스몹을 사냥시 일정확률로 드롭됩니다.#n");
cm.dispose();
}
} else if (selection == 3) {
cm.dispose();
cm.openNpc(9010006);
} else if (selection == 4) {
cm.sendOk("#e알 부화시키기를 누를시 #r즉시 시작이되며#k 4시간동안의 부화기간이 지나면 일정한 아이템이 지급됩니다.\r\n#r(※주의! 캐릭선택창,채널이동,캐시샵입장,맵이동시 초기화되며 아이템은 증발합니다.)#k#n");
cm.dispose();
}
}
}