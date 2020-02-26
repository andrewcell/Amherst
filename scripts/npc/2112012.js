
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
                if (status == 0) {
                    cm.sendSimple("원하는 게 있으신가?#b\r\n#b #L0#구슬을 호루스의 눈으로 교환하겠습니다.#l\r\n #L1#제뉴미스트 구슬 10개로 지혜의 돌로 교환하겠습니다.#l\r\n #L2#알카드노 구슬 10개로 지혜의 돌로 교환하겠습니다.#l");
                } else if (status == 1) {
                    if (selection == 0) {
                        material = [{'itemid': 4001159, 'quantity': 25}, {'itemid': 4001160, 'quantity': 25}];
                        item = {'itemid': 1122010, 'quantity': 1};
                    } else if (selection == 1) {
                        material = [{'itemid': 4001159, 'quantity': 10}];
                        item = {'itemid': 2041212, 'quantity': 1};
                    } else if (selection == 2) {
                        material = [{'itemid': 4001160, 'quantity': 10}];
                        item = {'itemid': 2041212, 'quantity': 1};
                    }
                    var str = "교환할 아이템을 확인하게.\r\n\r\n";
                    for (var i = 0; i < material.length; ++i) {
                        str += "#i" + material[i]['itemid'] + "# #z" + material[i]['itemid'] + "# " + material[i]['quantity'] + "개\r\n";
                    }
                    str += "\r\n위 아이템으로 \r\n"
                    str += "#i" + item['itemid'] + "# #z" + item['itemid'] + "# " + item['quantity'] + "개로 교환하겠네. 계속하겠는가?";
                    cm.sendYesNo(str);
                } else if (status == 2) {
                    if (selection == 1) {
                        var ok = true;
                        if (cm.canHold(item['itemid'], item['quantity'])) {
                            for (var i = 0; i < material.length; ++i) {
                                if (ok && !cm.haveItem(material[i]['itemid'], material[i]['quantity'])) {
                                    ok = false;
                                    break;
                                }
                            }
                            if (ok) {
                                for (var i = 0; i < material.length; ++i) {
                                    cm.gainItem(material[i]['itemid'], -material[i]['quantity']);
                                }
                                cm.gainItem(item['itemid'], item['quantity']);
                                cm.dispose();
                                return;
                            }
                        }
                        cm.sendOk("인벤토리 공간이 부족한건 아닌지, 혹은 재료를 분명 제대로 갖고 계신건지 확인해 주시게.");
                        cm.dispose();
                    } else {
                        cm.sendOk("흐음, 잘못 선택한건가? 마음이 바뀌면 다시 오게. 아마 오래 만나지 못할게야.");
                        cm.dispose();
                    }
                }
                break;
            }
    }
}