﻿var status = 0;

var Pet = new Array(5001011, 5001010, 5001009, 5001008, 5001007, 5001006, 5001005, 5001004, 5001003, 5001002, 5001001, 5001000, 5000417, 5000416, 5000415, 5000414, 5000409, 5000408, 5000407, 5000406, 5000405, 5000404, 5000403, 5000402, 5000387, 5000386, 5000385, 5000383, 5000381, 5000377, 5000376, 5000375, 5000368, 5000367, 5000366, 5000354, 5000353, 5000352, 5000344, 5000343, 5000342, 5000341, 5000332, 5000331, 5000330, 5000328, 5000322, 5000321, 5000320, 5000317, 5000316, 5000315, 5000314, 5000311, 5000310, 5000309, 5000299, 5000298, 5000297, 5000296, 5000295, 5000294, 5000293, 5000292, 5000291, 5000290, 5000283, 5000282, 5000281, 5000277, 5000276, 5000275, 5000273, 5000272, 5000271, 5000270, 5000269, 5000261, 5000258, 5000257, 5000256, 5000251, 5000250, 5000249, 5000245, 5000244, 5000243, 5000240, 5000239, 5000238, 5000237, 5000233, 5000232, 5000231, 5000230, 5000229, 5000228, 5000225, 5000221, 5000217, 5000216, 5000215, 5000211, 5000210, 5000207, 5000206, 5000202, 5000201, 5000171, 5000152, 5000093, 5000092, 5000091, 5000090, 5000089);
var Petr = Math.floor(Math.random() * Pet.length);

function action(mode, type, selection){
	if(status == 0){
		cm.sendSimple("또 다른 차원의세계 우리에겐 '요일던전'이라고 불리는 곳을 연구하는 겔박사 라고합니다. 과거조사기록에 따르면 요일던전에서 드롭하는 전리품들은 무언가 특별하다고해요 어서 연구해보고 싶지만 안에 몬스터들은 던전의 몬스터보다 강력하다고해서 함부로 들어가기가 조금 두렵네요...\r\n#b#L0#박사님! DS에그라는 전리품을 얻었습니다!#l\r\n#L999#요일던전에서 획득한 원소는 어떻게사용하나요?#l");
		status++;
	} else if(status == 1) {
	if (selection == 0) {
	if (cm.haveItem(4170012,10)) {
	cm.sendOk("호오 연구해 보니 이아이템은 부화를 시킬수 있더군요, 부화를 하니 아주 작고 귀여운 펫이 부화했어요 당연히 이것은 전리품을 모은 모험가님의 몫이겠죠? 잘 키워보도록 하세요.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n\r\n#i"+Pet[Petr]+"# 귀여운 펫 #r#t"+Pet[Petr]+"##k을 획득하였습니다.");
        cm.gainPet(Pet[Petr], cm.getItemName(Pet[Petr]), 1, 0, 100, 18000, 101);
	cm.gainItem(4170012,-10)
	cm.dispose();
	} else {
	cm.sendOk("DS에그라구요? 흐음 보아하니 부화를 할수있을것 같은데 하나가지고는 완벽한 실험을 할수 없으니 실험을 하고싶다면 10개를 모아와주세요.");
	cm.dispose();
	}
	} else if (selection == 999) {
	cm.sendOk("원소라구요? 오오 과거 기록에 있던 내용이 사실이였군. 원소는 엄청난 에너지가 응축된 신비한 물건입니다. 가가에게서 메이플 무기를 업그레이드 하는데에 이용할 수 있죠. 아직 다른 사용법은 밝혀지지 않았지만 불타버린 과거기록을 복구하여 최대한 빠른 시간안에 연구를 시작해보도록 해야겠군요.");
	cm.dispose();
	}
}
}
