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
 * Quest ID : 3523
 * Quest Name : 잃어버린 추억을 찾아
 * Quest Progress Info : 오랜만에 #p1022000#를 만났다. 그는 한 때는 미숙한 초보자였던 자네가 훌륭한 전사로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Quest End Info : 오랜만에 #p1022000#를 만났다. 그는 한 때는 미숙한 초보자였던 자네가 훌륭한 전사로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Start NPC : 1022000
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
        qm.sendNext("...이 강력한 위압감을 보니 자네는 대단히 강력한 전사로군. 이름이... #h0#? 하하! 그러고 보니 기억에 있는 이름이군. 아주 오래 전에 전사가 되겠다고 찾아왔던 미숙한 초보자들 중에, 그런 이름이 있었지.");
    } else if (status == 1) {
        qm.sendNext("자네가 이렇게 강력한 전사가 될 줄이야! 이제는 이 주먹펴고일어서라고 해도 승부를 장담하기 힘들겠는걸? 정말 대단하네... 그래, 자네라면 훌륭한 전사로 성장할 줄 알았네.")
    } else if (status == 2) {
        qm.sendNext("계속 더 정진하게. 자네를 전사로 만들어준 사람으로써 확신한다네. 더 강한 전사가 될 거란 걸...")
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showQuestClear(3507);
        qm.forceStartQuest(7081, "1");
        qm.dispose();
    }
}
