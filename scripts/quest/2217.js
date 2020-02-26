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
 * Quest ID : 2217
 * Quest Name : 슈미의 정보
 * Quest Progress Info : #p1052102#의 말에 의하면 #m103000000# 하수구에서 얼마 전부터 이상한 냄새가 났던 것 같다. 
 * Quest End Info : #p1052102#의 말에 의하면 #m103000000# 하수구에서 얼마 전부터 이상한 냄새가 났던 것 같다. 
 * Start NPC : 1052102
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
        qm.askAcceptDecline("음... #h0#... 네가 제이엠이 말한 그 사람인 모양이네. 그럼 얼마전까지 모은 정보를 알려 줄게. 도움이 될지는 모르겠지만...")
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendOk("크리스가 그러는데, 얼마 전부터 하수도에서 이상한 냄새가 나기 시작했대. ...하수도야 원래 냄새가 이상하지만, 평소와 다른 #r뭔가가 섞여든 것 같다#k는데... 다일하고는 상관 없으려나? 아무튼 정보는 이게 다야.")
            qm.forceCompleteQuest();
            qm.showQuestCompleteEffect();
            qm.dispose();
        } else {
            qm.sendOk("정보를 들을 준비가 되면 다시 말을 걸어줘.");
            qm.dispose();
        }
    }
}
