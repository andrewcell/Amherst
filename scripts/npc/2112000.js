
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
        case 926100203:
            {
                var em = cm.getEventManager("Romeo");
                if (em.getProperty("stage").equals("1") && em.getProperty("stage5").equals("0")) {
                    //advance to angry!
                    em.setProperty("stage", "2");
                    cm.mapMessage(6, "유레테의 중얼거림을 들었다.");
                }
                cm.dispose();
                break;
            }
        case 926110203:
            {
                var em = cm.getEventManager("Juliet");
                if (em.getProperty("stage").equals("1") && em.getProperty("stage5").equals("0")) {
                    //advance to angry!
                    em.setProperty("stage", "2");
                    cm.mapMessage(6, "유레테의 중얼거림을 들었다.");
                }
                cm.dispose();
                break;
            }
        case 926100401:
        case 926110401:
            {
                var em = cm.getEventManager(mapid == 926100401 ? "Romeo" : "Juliet");
                var eim = cm.getPlayer().getEventInstance();
                if (em.getProperty("summoned") == null || em.getProperty("summoned").equals("0")) { //last stage
                    if (em.getProperty("stage").equals("2")) {
                        if (status == 0) {
                            cm.sendSimple("큭큭큭.. 이것도 괜찮지. 내 연구의 희생물이 되기에 딱 좋아. 영광으로 생각하게나. 자네들이야 말로 최고의 기계공학과 연금술이 결합되는 것을 보는 거니까 말이야!!\r\n#b #L0# 멈춰요! 당신때문에 마가티아는 전쟁 일보 직전이에요!!#l\r\n #L1#멈춰요! 당신이 인정받도록 도와주겠어요.#l")
                        } else if (status == 1) {
                            if (selection == 0)
                                cm.sendNext("전쟁따위, 내 알바 아니지! 너희들은 그저 나의 연구의 결과물을 눈 똑똑히 뜨고 보고 희생되어 주면 되는거야!");
                            else if (selection == 1) {
                                cm.sendNext("나를 인정받도록 도와주겠다고? 너희들이? 후후.. 웃기는 소리 하지마.");
                                cm.mapMessage(6, cm.getPlayer().getName() + "님의 설득에 유레테는 마음이 흔들리는 모습이다.");
                                em.setProperty("persuade_urete", "1");
                            }
                        } else if (status == 2) {
                            cm.sendNext("내 연구 결과물을 똑똑히 보아라! 가라! 프랑켄슈타인!");
                        } else if (status == 3) {
                            mobId = 9300140;
                            var mob = em.getMonster(mobId);
                            eim.registerMonster(mob);
                            em.setProperty("summoned", "1");
                            cm.getPlayer().getMap().removeNpc(cm.getNpc());
                            eim.getMapInstance(mapid).spawnMonsterOnGroundBelow(mob, new java.awt.Point(240, 150));
                            cm.getPlayer().getMap().setSpawns(true);
                            cm.dispose();
                        }
                    } else {
                        mobId = 9300139;
                        var mob = em.getMonster(mobId);
                        eim.registerMonster(mob);
                        em.setProperty("summoned", "1");
                        eim.getMapInstance(mapid).spawnMonsterOnGroundBelow(mob, new java.awt.Point(240, 150));
                        cm.getPlayer().getMap().removeNpc(cm.getNpc());
                        cm.getPlayer().getMap().setSpawns(true);
                        cm.dispose();
                    }
                }
                break;
            }


    }

}
