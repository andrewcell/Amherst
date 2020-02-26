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
 * Quest ID : 3526
 * Quest Name : 잃어버린 추억을 찾아   
 * Quest Progress Info : 오랜만에 #p1052001#를 만났다. 그는 한 때는 미숙한 초보자였던 네가 훌륭한 도적로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Quest End Info : 오랜만에 #p1052001#를 만났다. 그는 한 때는 미숙한 초보자였던 네가 훌륭한 도적로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Start NPC : 1052001
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
        qm.sendNext("존재하지 않는 것 처럼 극도로 적은 기척... 하지만 사실 너 같은 사람이야말로 강력한 도적이란 걸 이 다크로님은 알고 있지. 오랜만이다, #h0#.");
    } else if (status == 1) {
        qm.sendNext("제법 성장했군. 이 다크로드님과 비교해도 뒤지지 않겠는걸. 예전에는 기척도 숨길 줄 모르는 초보자 꼬마였는데... 훗. 하긴 시간이 많이 흘렀으니까. 이렇게 강해진 모습을 보니 기분 묘하군... 이런 게 자랑스럽다는 거겠지.")
    } else if (status == 2) {
        qm.sendNext("더 정진하도록 해. 널 도적으로 만든 사람으로써 확신하는데, 넌 여기서 그칠 사람이 아니야. 더 강력한 도적이 될 수 있어. 그때까지 더 노력하도록.")
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showQuestClear(3507);
        qm.forceStartQuest(7081, "1");
        qm.dispose();
    }
}
