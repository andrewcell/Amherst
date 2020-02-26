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
 * Quest ID : 3527
 * Quest Name : 잃어버린 추억을 찾아    
 * Quest Progress Info : 오랜만에 #p1090000#을 만났다. 그녀는 한 때는 미숙한 초보자였던 네가 훌륭한 해적로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Quest End Info : 오랜만에 #p1090000#을 만났다. 그녀는 한 때는 미숙한 초보자였던 네가 훌륭한 해적로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Start NPC : 1090000
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
        qm.sendNext("안정된 자세와 기운, 하지만 당장이라도 싸울 수 있는 폭풍 같은 폭발력이 감춰진 신체. 훌륭한 해적이 되었군 #h0#, 오랜만이다.");
    } else if (status == 1) {
        qm.sendNext("처음 봤을 땐 바다에 제대로 적응도 못하던 초보자였는데, 어느새 이렇게 강해졌군... 하긴. 너라면 그럴 줄 알았어. 네 재능이라면 말이야. 하지만, 예상했던 일이라도 기쁜걸?")
    } else if (status == 2) {
        qm.sendNext("계속 정진하도록 해. 널 해적으로 만든 사람으로써 확신하는데, 넌 여기서 그칠 사람이 아니야. 더 강력한 해적으로 거듭날 수 있어. 그 때를 기다리지.")
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showQuestClear(3507);
        qm.forceStartQuest(7081, "1");
        qm.dispose();
    }
}
