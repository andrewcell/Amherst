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
 * Quest ID : 3301
 * Quest Name : 제뉴미스트 협회장의 시험
 * Quest Progress Info : #p2111007#은 제뉴미스트에 가입하기 위해서는 연금술사로서 연구한 결과물을 협회장 앞에서 보이는 까다로운 과정을 거쳐야 한다고  말했다. 하지만 #b종류에 상관 없이 보석의 원석 2개#k만 준다면 그의 능력으로 해결해 주겠다는데...
 * Quest End Info : #p2111007#에게 보석의 원석 2개를 주자, 그는 잠시 기다려 보라고한다. 
 * End NPC : 2111007
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
        var found = false;
        var str = "오호... 표정을 보아하니 거래할 준비가 된 모양이군. 그렇게 까지 해서 제뉴미스트에 가입하고 싶다니... 이해할 수 없지만, 뭐 좋아. 댓가로 무엇을 주겠어?\r\n\r\n#b";
        items = [4010006, 4010004, 4010007, 4020000, 4020001, 4020002, 4020003, 4020004, 4020005, 4020006, 4020007, 4020008];
        for (var i = 0; i < items.length; ++i) {
            if (qm.haveItem(items[i], 2)) {
                str += " #L" + items[i] + "# #t" + items[i] + "##l\r\n";
                if (!found)
                    found = true;
            }
        }
        if (found)
            qm.sendSimple(str);
        else {
            qm.sendOk("오호... 표정을 보아하니 거래할 준비가 된 모양이군. 그렇게 까지 해서 제뉴미스트에 가입하고 싶다니... 이해할 수 없지만, 뭐 좋아. 우선 그렇다면 내게 #b아무 보석의 원석 두개#k를 가져오게.");
            qm.dispose();
        }
    } else if (status == 1) {
        var ok = false;
        for (var i = 0; i < items.length; ++i) {
            if (selection == items[i]) {
                ok = true;
                break;
            }
        }
        needItem = items[i];
        if (ok) {
            if (qm.haveItem(needItem, 2)) {
                qm.gainItem(needItem, -2);
                qm.sendNext("그럼 잠시만 기다려. 네가 제뉴미스트 협회장의 시험을 통과하도록 만들어줄, 그 물건을 구해 놓을테니.")
                qm.forceCompleteQuest();
                qm.showQuestCompleteEffect();
                qm.dispose();
            } else {
                qm.sendOk("아이템이 없는 것 같군.");
                qm.dispose();
            }
        } else {
            qm.dispose();
        }
    }
}