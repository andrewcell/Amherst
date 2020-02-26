var status = 0;
function action(mode, type, selection) {
    if (status == 0) {
        cm.sendYesNo("안녕하세요 이스트월드에도 추억의 행복한 마을이 오픈되었답니다. 안에는 특별한 이벤트퀘스트가 많이 준비되어있는 모두 어서 참여해주세요! ");
	status = 1;
    } else if (status == 1) {
        if (mode != 1) {
            cm.sendOk("그래요? 마음이 바뀌면 다시 찾아오세요~");
            cm.dispose();
        } else {
            cm.warp(209000000);
            cm.dispose();
        }
    }
}