
var status = 0;
function action(mode, type, selection)
{
    if (mode <= 0) {
        cm.dispose();
        return;
    }
    status++;
    
    if (cm.getPlayer().getMapId() == 200000200) {
        if (cm.getQuestStatus(3048) == 0 && cm.getQuestStatus(3047) == 2) {
            if (cm.haveItem(4031200, 1)) {
                cm.gainItem(4031200, -1);
            }
	    cm.forceStartQuest(3048);
            cm.dispose();
        } else {
            cm.sendOk("주인님이 갑자기 집을 나가버리신 지 벌써 여러달이 지났군요. 저야 할 일이 줄어들어 기분은 좋지만 덕분에 월급이 몇달째 밀려 있어서... 이러다가 월급도 못받고 이 집의 주인이 다른 사람으로 바뀌어 버리는건 아닌지 모르겠어요.\r\n\r\n[엘마의 네펜데스 주스] 퀘스트를 받은 상태에서 퀘스트가 소실된 분들을 위한 버그 픽스용 기능 입니다. 음.. 당신은 이 기능이 필요하지 않을 것 같군요.");
            cm.dispose();
        }
        return;
    }

    cm.dispose();
}