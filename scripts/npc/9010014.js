/* 	Aramia
 * 	Henesys fireworks NPC
 */

var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
//    if (cm.getClient().getChannel() == 1) {
//        cm.sendNext("The event may not be attempted in channel 1.");
//        cm.dispose();
//        return;
//    }
    if (status == 0) {
        cm.sendNext("안녕하세요 저는 아르미 라고 합니다. 이번에 새로 오픈한 #r이스트월드#k의 오픈기념으로 폭죽놀이를 하려고합니다.");
    } else if (status == 1) {
        cm.sendSimple("#r#t4001128##k 을 가지고 계시다면 저에게 주세요 모두 총 #r3000개#k가 모이면 폭죽놀이가 시작될거에요 생각만해도 재밌을거같아요!\r\n#b#L0#화약통을 기부할게. #l#k \n\r #b#L1#폭죽놀이의 진행현황을 확인하고싶어.#l#k");
    } else if (status == 2) {
        if (selection == 1) {
            cm.sendNext("아래는 현재 폭줄놀이 준비단계의 그래프 입니다.\r\n#B"+cm.getKegs()+"#");
            cm.safeDispose();
        } else if (selection == 0) {
            cm.sendGetNumber("화약통 몇개를 기부하시겠어요?", 0, 0, 10000);
        }
    } else if (status == 3) {
        var num = selection;
        if (num == 0) {
            cm.sendOk("0개는 기부할수 없습니다 ㅠㅠ.");
        } else if (cm.haveItem(4001128, num)) {
            cm.gainItem(4001128, -num);
            cm.giveKegs(num);
            cm.sendOk("화약통 기부 잘 받았습니다 준비가 다될때까지 기다려주세요!");
        }
        cm.safeDispose();
    }
}