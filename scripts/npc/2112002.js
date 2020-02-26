
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
    mapid = cm.getPlayer().getMapId()
    switch (mapid) {
        case 926100500:
        case 926110500:
            {
                var em = cm.getEventManager(mapid == 926100500 ? "Romeo" : "Juliet");
                if (em.getProperty("persuade_urete") != null) {
                    if (status == 0) {
                        cm.sendNext("이럴수가.. 내가 그동안 쌓아온 모든 것을 잃고 말았어...\r\n#b #L0#잃은건 아무것도 없어요. 당신이 살아 있으니 무엇이든 다시 시작할 수 있습니다.#l")
                    } else if (status == 1) {
                        cm.sendNext("그렇게 말해주니 무척 고마워. 앞으로는 마가티아에 협력하도록 하겠어.");
                        cm.playerMessage(6, "유레테는 마음을 고쳐먹고 마가티아에 협력하겠다고 말한다.");
                    } else if (status == 2) {
                        cm.gainExp(10500);
                        cm.forceStartQuest(7072, "1");
                        cm.playerMessage(6, "유레테를 구하는데 성공하여 추가 경험치가 지급됩니다.");
                        cm.warp(mapid + 100);
                        cm.dispose();
                    }
                } else {
                    cm.warp(mapid + 100);
                    cm.dispose();
                }
                break;
            }
        case 926100600:
        case 926110600:
            {
                cm.dispose();
                break;
            }
    }
}