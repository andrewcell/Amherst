var status = -1;

function start(mode, type, selection) {
    qm.dispose();
}
function end(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        qm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
        file = "#fUI/UIWindow.img/QuestIcon/";
        if (qm.getQuestStatus(3452) == 0) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        if (qm.haveItem(4000099)) {
            if (qm.haveItem(4001125)) {
                qm.sendNext("문어 열쇠고리는 구해 왔는가? 흐음... 귀엽게 생긴 물건이군. 하지만 이게 바로 지구를 위협하는 외계인의 정체를 밝힐 중요한 물건...잠깐!")
            } else {
                qm.sendNext("문어 열쇠고리는 구해 왔는가? 흐음... 귀엽게 생긴 물건이군. 하지만 이게 바로 지구를 위협하는 외계인의 정체를 밝힐 중요한 물건이지. 정말 고맙네.\r\n\r\n" + file + "4/0#\r\n#v2000011# #t2000011# 50개\r\n\r\n" + file + "8/0# 8000 exp");
            }
        } else {
            qm.sendOk("아직 문어 열쇠고리는 구하지 못한 모양이군. 그건 블록퍼스들이 가지고 있다네.");
            qm.dispose();
        }
    } else if (status == 1) {
        if (qm.haveItem(4000099)) {
            if (qm.haveItem(4001125)) {
                qm.sendNext("자네가 가지고 있는 그 물건! 그것 좀 보여주게. 자네 손에 들고 있는 바로 그 설계도 말일세. 오~ 이런 물건을 어디서 구한건가? 이것만 있으면 블록퍼스에 대한 연구를 더 빨리 진행시킬 수 있겠어.")
            } else {
                if (!qm.canHold(2000011, 50)) {
                    qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.");
                    qm.dispose();
                    return;
                }
                qm.sendOk("블록퍼스와 외계인... 아무리 생각해도 뭔가 비슷하단 말이야. 아니, 문어와 외계인이 비슷한 걸지도... 흐음. 이것도 새로운 이론이군.");
                qm.gainItem(4000099,-1);
                qm.gainItem(2000011, 50);
                qm.gainExp(8000);
                qm.forceCompleteQuest();
                qm.dispose();
            }
        }
    } else if (status == 2) {
        qm.sendNext("뜻밖의 수확인걸. 좋아. 자네에게 특별한 선물을 하도록 하지. 분명 도움이 될거야. 하하하~\r\n\r\n" + file + "4/0#\r\n#v2040701# #t2040701# 1개\r\n\r\n" + file + "8/0# 16000 exp")
    } else if (status == 3) {
        if (!qm.canHold(2040701, 1)) {
            qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.");
            qm.dispose();
            return;
        }
        qm.sendOk("블록퍼스와 외계인... 아무리 생각해도 뭔가 비슷하단 말이야. 아니, 문어와 외계인이 비슷한 걸지도... 흐음. 이것도 새로운 이론이군.");
        qm.gainItem(4000099,-1);
        qm.gainItem(4001125,-1);
        qm.gainItem(2040701, 1);
        qm.gainExp(16000);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
