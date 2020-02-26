var status = 0;
var custom = 0;
function action(mode, type, selection) {
    if (status == 0) {
        if (cm.getPlayer().getClient().getChannel() == 1) {
            cm.sendSimple("안녕하신가 모험가여. 지치고 힘든일이 많이 쌓였을때, 또는 걱정거리가 있을때는 뭐니뭐니 해도 낚시가 최고지. 자 어서 낚시의자에 앉아서 낚시를 시작하게나.\r\n#L0##b싱싱한 미끼를 구매하고 싶습니다.#l\r\n#L4#쉼터로 돌아가겠습니다.#l\r\n");
            status++;
        } else {
            cm.sendOk("낚시는 1채널에서만 가능하다는 것. 알아두도록 하시게나.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (selection == 0 && mode == 1) {
            cm.sendGetNumber("미끼없이 낚시는 불가능 하지 미끼는 한캔당 500메소라네.\r\n#r현재 보유중인 메소 : " + cm.getPlayer().getMeso() + "원\r\n#k#b구매가능 갯수 :" + cm.getPlayer().getMeso() / 800 + "캔 구매가능", 1, 1, 100);
            status = 3;
        } else if (selection == 4 && mode == 1) {
            cm.warp(123456789);
            cm.dispose();
        }
    } else if (status == 3) {
        if (mode != 1) {
            cm.dispose();
            return;
        }
        if (cm.getMeso() >= selection * 500) {
            cm.sendOk(selection * 500 + "메소 잘받았네, 자 미끼 " + selection + "캔 받아가시게나.");
            cm.gainItem(4031851, selection);
            cm.gainMeso(-selection * 500);
            cm.dispose();
        } else {
            cm.sendOk("가진만큼 가지자라는 명언을 알려주겠네 하하하!");
            cm.dispose();
        }
   
        }
}
	