/*
 NPCID : 9000036
 ScriptName : A_office
 NPCNameFunc : 요원 E
 Location : 211000000 (엘나스산맥 - 엘나스)
 Location : 251000000 (무릉도원 - 백초마을)
 Location : 230000001 (아쿠아리움 - 중앙 홀)
 Location : 105040300 (던전 - 슬리피우드)
 Location : 221000000 (루더스호수 - 지구방위본부)
 Location : 104000000 (빅토리아로드 - 리스항구)
 Location : 120000000 (빅토리아로드 - 노틸러스 선착장)
 Location : 250000000 (무릉도원 - 무릉)
 Location : 261000000 (선셋로드 - 마가티아)
 Location : 240000000 (미나르숲 - 리프레)
 Location : 260000000 (버닝로드 - 아리안트)
 Location : 102000000 (빅토리아로드 - 페리온)
 Location : 222000000 (루더스호수 - 아랫마을)
 Location : 101000000 (빅토리아로드 - 엘리니아)
 Location : 103000000 (빅토리아로드 - 커닝시티)
 Location : 100000000 (빅토리아로드 - 헤네시스)
*/

var status = -1;
function action(mode, type, selection) {
	if (mode == 1 && type != 1) {
		status++;
	} else {
		if (type == 1 && mode == 1) {
			status++;
			selection = 1;
		} else if (type == 1 && mode == 0) {
			status++;
			selection = 0;
		} else {
			cm.dispose();
			return;
		}
	}
	if (status == 0) {
		cm.sendOk("안녕하신가요? 제게 무슨 볼일이시죠?");
		cm.safeDispose();
	}
}