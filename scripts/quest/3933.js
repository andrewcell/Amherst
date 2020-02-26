var status = -1;

function start(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendNext("네가 이렇게 강할 줄 몰랐어. 너 정도면 모래그림단원이 될 수 있을지도 모르겠다는 생각이 드는걸? 모래그림단원에게 가장 중요한 건 강함이고, 넌 충분히 강한 것 같거든. 하지만 역시 한 번만 더 시험을 해보고 싶은데, 어때? 괜찮겠어?")
    } else if (status == 1) {
        qm.askAcceptDecline("진짜 너의 강함을 확인하려면 역시 몸으로 부딪혀 보는 수밖에 없겠지? 너와 대련을 해보고 싶어. 걱정 말라구. 너를 해치고 싶지는 않아. 내 분신으로 널 상대해주지. 지금 당장 대련에 들어가도 괜찮겠어?");
    } else if (status == 2) {
        if (selection == 0) {
            qm.sendOk("마음의 준비가 필요한건가? 너무 긴장하지는 말라구.");
            qm.dispose();
        } else {
            qm.sendNext("좋아. 자신만만하군.");
        }
    } else if (status == 3) {
        var em = qm.getEventManager("Adin");
        if (em == null) {
            qm.sendOk("스크립트에 문제가 발생했습니다.");
            qm.dispose();
        }
        if (em.getProperty("state").equals("1")) {
            qm.sendOk("아... 잠시만 기다려 주게. 지금 누군가가 대련장을 쓰고 있는 것 같아. 잠시 후에 다시 찾아와 주게.");
            qm.dispose();
        } else {
            qm.forceStartQuest();
            em.startInstance(qm.getPlayer());
            qm.dispose();
        }
    }
}
function end(mode, type, selection) {
	qm.sendNext("망할년아.");
	qm.dispose();
}
