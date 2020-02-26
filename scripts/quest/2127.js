var status = -1;

function start(mode, type, selection) {
    qm.dispose();
}
function end(mode, type, selection) {
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
    var qr = qm.getQuestRecord(7060);
    var info = qr.getCustomData();
    if (info == null) {
        qr.setCustomData("0");
        info = "0";
    }
    if (info.equals("0")) {
        if (status == 0) {
            qm.askAcceptDecline("떠날 준비는 다 되었나? 처음 가는 거라서 긴장을 한 것 같군. 걱정말게. 자네는 잘 할 수 있을 거야. 내 능력으로 앞으로 다섯 번은 그곳으로 보내 줄 수 있네. 지금 이동하겠나?")
        } else if (status == 1) {
            if (selection == 0) {
                qm.sendOk("준비가 되면 다시 찾아오게.")
                qm.dispose();
            } else {
                qm.sendNext("잘 다녀오게.");
            }
        } else if (status == 2) {
            qr.setCustomData("1");
            qm.warp(260000200);
            qm.dispose();
        }
    } else if (info.equals("1")) {
        if (status == 0) {
            qm.askAcceptDecline("또 만나게 됐군. 지난 번에 갔을 때는 어땠나? 다시 가는 것을 보니 그 곳에서 하던 일이 있나보지? 자네에겐 네 번의 기회가 남아 있네. 지금 이동하겠나?")
        } else if (status == 1) {
            if (selection == 0) {
                qm.sendOk("준비가 되면 다시 찾아오게.")
                qm.dispose();
            } else {
                qm.sendNext("잘 다녀오게.");
            }
        } else if (status == 2) {
            qr.setCustomData("2");
            qm.warp(260000200);
            qm.dispose();
        }
    } else if (info.equals("2")) {
        if (status == 0) {
            qm.askAcceptDecline("자주 보게 되는군. 무척 바쁜 모양이야? 자네에겐 세 번의 기회가 남아 있네. 지금 이동 하겠나?")
        } else if (status == 1) {
            if (selection == 0) {
                qm.sendOk("준비가 되면 다시 찾아오게.")
                qm.dispose();
            } else {
                qm.sendNext("잘 다녀오게.");
            }
        } else if (status == 2) {
            qr.setCustomData("3");
            qm.warp(260000200);
            qm.dispose();
        }
    } else if (info.equals("3")) {
        if (status == 0) {
            qm.askAcceptDecline("사막은 매력적인 곳인가 보지? 그러고 보니 얼굴도 검게 그을린 것 같군. 자네에겐 두 번의 기회가 남아 있네. 지금 이동 하겠나?")
        } else if (status == 1) {
            if (selection == 0) {
                qm.sendOk("준비가 되면 다시 찾아오게.")
                qm.dispose();
            } else {
                qm.sendNext("잘 다녀오게.");
            }
        } else if (status == 2) {
            qr.setCustomData("4");
            qm.warp(260000200);
            qm.dispose();
        }
    } else if (info.equals("4")) {
        if (status == 0) {
            qm.askAcceptDecline("오늘도 그곳으로 가는건가? 이름이 뭐라고 했지? 아리안트라고 했었나? 자네를 보니 나도 한 번쯤 가보고 싶어지는군. 자네에겐 한 번의 기회가 남아 있네. 지금 이동하겠나?")
        } else if (status == 1) {
            if (selection == 0) {
                qm.sendOk("준비가 되면 다시 찾아오게.")
                qm.dispose();
            } else {
                qm.sendNext("잘 다녀오게.");
            }
        } else if (status == 2) {
            qr.setCustomData("5");
            qr.forceCompleteQuest();
            qm.warp(260000200);
            qm.dispose();
        }
    }
}
