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
 * Quest ID : 3320
 * Quest Name : 파웬이 알고 있는 것
 * Quest Progress Info : #p2111006#은 고개를 갸웃대다가 골치가 아프다는 듯, 얼굴을 찡그렸다. 그리고 다음 순간, 어느새 장소가 바뀌어 있다! 익숙한 듯 하지만 약간은 어색한 이 곳은 어디일까? 그리고 #r저 사람#k은 누구지? 
 * Quest End Info : 맙소사! 연구실에 서 있는 사람. 그는 바로 #p2111002#이었다! 실종된 연금술사, #p2111006#...! 그렇다면 여기는 #b#p2111002#의 연구실#k이라는 말인가?
 * Start NPC : 2111006
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start(mode, type, selection) {
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
        qm.sendNext("오오! 자네 왔군! 반갑네, 반가워! 자네 덕분에 요즘은 심심하지 않다네~ ...응? 뭐라고? 여기서 연구하던 연금술사가 누구냐고? 음... 그의 이름을 알기는 했는데...  ");
    } else if (status == 1) {
        qm.sendNext("뭐더라? 뭐더라... 뭐더라아... 아아! 도무지 떠오르지 않는군. 혹시 그 사람 자네에게 중요한 사람인가? 웬만하면 그냥 잊어버리면... 안된다고? 그럼 어쩐다아... ");
    } else if (status == 2) {
        qm.askAcceptDecline("에잇! 모르겠다. 그냥 자네가 직접 보게!");
    } else if (status == 3) {
        if (selection == 0) {
            qm.sendOk("엥? 싫은가? 자네가 싫다면 하는 수 없지만... 그럼 여기서 연구하던 연금술사는 알려줄 수가 없는데?");
        } else {
            qm.forceStartQuest();
            qm.warp(926120200);
        }
        qm.dispose();
    }
}
