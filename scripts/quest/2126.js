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
    if (qm.getQuestStatus(2126) == 0) {
        qm.forceStartQuest(2126);
        qm.dispose();
        return;
    }
    var val = qm.getQuestStatus(3937);
    var file = "#fUI/UIWindow.img/QuestIcon/";  
    if (val == 2) {
        if (status == 0) {
            qm.sendNext("아! 누군가 했더니 오랜만이야. 이번엔 보급품 운반을 맡았나보지? 꽤 중요한 임무였는데. 수고했어.\r\n\r\n" + file + "4/0#\r\n#v2030000# #t2030000# 5개\r\n#v2022155# #t2022155# 5개\r\n\r\n" + file + "8/0#\r\n2000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 2) {
                qm.gainItem(2030000, 5);
                qm.gainItem(2022155, 5);
                qm.gainItem(4031624, -1);
                qm.gainExp(2000);
                qm.forceCompleteQuest();
                qm.dispose();
            } else {
                qm.sendOk("소비창에 빈 칸이 있는지 확인해 주세요.");
                qm.dispose();
            }
        }
    } else {
        if (status == 0) {
            qm.sendNext("수고했어요. 보는 눈이 많으니까 그만 가보도록해요.\r\n\r\n" + file + "4/0#\r\n#v2030000# #t2030000# 5개\r\n#v2022155# #t2022155# 5개\r\n\r\n" + file + "8/0#\r\n2000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(2030000, 10);
                qm.gainItem(4031624, -1);
                qm.gainExp(2000);
                qm.forceCompleteQuest();
                qm.dispose();
            } else {
                qm.sendOk("소비창에 빈 칸이 있는지 확인해 주세요.");
                qm.dispose();
            }
        }
    }
}
