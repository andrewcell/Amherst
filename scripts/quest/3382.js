/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * Quest ID : 3382
 * Quest Name : 유레테의 보답
 * Quest Progress Info : #t4001159#과 #t4001160#을 본 #p2112014#는 #b두 학파 연구의 정수가 담긴 구슬을 합성하여 새로운 힘을 만들어낼 수 있을 것 같다#k고 말했다. 다만 그 재료가 적지 않은 듯한데... #t4001159#과 #t4001160#을 구해 보자.
 * Quest End Info : 제뉴미스트와 알카드노... 성질이 다른 두 학파의 연구를 합칠 수 있는 건 오직 #p2112014# 뿐일 것이다.
 * End NPC : 2112014
 * 
 * @author T-Sun
 *
 */

var status = -1;

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
    if (status == 0) {
        if (!qm.isQuestActive(3382)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        qm.sendSimple("제뉴미스트의 구슬과 알카드노의 구슬을 각각 25개씩 가져오면 호루스의 눈을, 둘 중 어느쪽의 구슬이라도 10개 가져오면 목걸이에 새로운 힘을 부여할 수 있는 지혜의 돌을 만들어 주겠네. 자, 어떤 아이템을 만들겠는가?\r\n#b#L0# 호루스의 눈을 만들어 주세요.#l\r\n#L1# 제뉴미스트 구슬로 지혜의 돌을 만들어 주세요.#l\r\n#L2# 알카드노 구슬로 지혜의 돌을 만들어 주세요.#l")
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
        qm.sendYesNo(str);
    } else if (status == 2) {
        if (selection == 1) {
            var ok = true;
            if (qm.canHold(item['itemid'], item['quantity'])) {
                for (var i = 0; i < material.length; ++i) {
                    if (ok && !qm.haveItem(material[i]['itemid'], material[i]['quantity'])) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    for (var i = 0; i < material.length; ++i) {
                        qm.gainItem(material[i]['itemid'], -material[i]['quantity']);
                    }
                    qm.gainItem(item['itemid'], item['quantity']);
                    if (item['itemid'] == 1122010) {
                        if (qm.getPlayer().getOneInfo(1205, "have") == null) {
                            qm.getPlayer().updateOneInfo(1205, "have", "1");
                        }
                    }
                    qm.forceCompleteQuest();
                    qm.dispose();
                    return;
                }
            }
            qm.sendOk("인벤토리 공간이 부족한건 아닌지, 혹은 재료를 분명 제대로 갖고 계신건지 확인해 주시게.");
            qm.dispose();
        } else {
            qm.sendOk("흐음, 잘못 선택한건가? 마음이 바뀌면 다시 오게. 아마 오래 만나지 못할게야.");
            qm.dispose();
        }
    }
}
