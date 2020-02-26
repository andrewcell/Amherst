var status = 0;

function action(mode, type, selection){

	if(status == 0){
		cm.sendYesNo("2014년 7월 30일 부터 가을이 지나가기 까지 단풍나무키우기 이벤트를 진행중입니다. 하루에 한번 단풍나무가 다 자라나면 특별한 아이템을 드롭한다고합니다. 단풍나무 언덕으로 이동하시겠습니까?");
		status++;
	} else if (status == 1) {
		if (cm.getPlayer().getClient().getChannel() == 1) {
		cm.warp(970010000);
		cm.dispose();
		} else {
		cm.sendOk("1채널에서만 입장할수 있어요!");
		cm.dispose();
		}
	}
}
