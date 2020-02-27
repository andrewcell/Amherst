/*
 * Aramia - 아르미
 * Not sure about Original.
 * TAG FOR SEARCH : MODIFIED ENGLISH
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
        cm.sendNext("Hi There~ I'm Aramia.  I know how to make the firecrackers!  If you can gather and give me Power Keg then, we can have a fireworks!  Please get all the powder kegs that you get from the monsters.");
    } else if (status == 1) {
        cm.sendSimple("Each time users collect required powder keg, we can set a firework! \n\r #b#L0# Here, I brought the Powder Keg.#l#k \n\r #b#L1# Please show me the current status on collecting the powder Keg.#l#k");
    } else if (status == 2) {
        if (selection == 1) {
            cm.sendNext("화약통의 수집현황입니다. \n\r #B"+cm.getKegs()+"# \n\r 화약통을 다 모으면, 불꽃놀이를 시작할 수 있답니다..");
            cm.safeDispose();
        } else if (selection == 0) {
            cm.sendGetNumber("화약통을 얼마나 기부하시겠어요? \n\r #b< 현재 가지고 있는 화약통 수 : 0 >#k", 0, 0, 10000);
        }
    } else if (status == 3) {
        var num = selection;
        if (num == 0) {
            cm.sendOk("T.T I will need the powder keg to start the fireworks....\r\n Please think again and talk to me.");
        } else if (cm.haveItem(4001128, num)) {
            cm.gainItem(4001128, -num);
            cm.giveKegs(num);
            cm.sendOk("Don't forget to give me the powder keg when you obtain them.");
        }
        cm.safeDispose();
    }
}