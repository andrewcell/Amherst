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
 * Quest ID : 3525
 * Quest Name : 잃어버린 추억을 찾아  
 * Quest Progress Info : 오랜만에 #p1012100#를 만났다. 그녀는 한 때는 미숙한 초보자였던 당신이 훌륭한 궁수로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Quest End Info : 오랜만에 #p1012100#를 만났다. 그녀는 한 때는 미숙한 초보자였던 당신이 훌륭한 궁수로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Start NPC : 1012100
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
        qm.sendNext("... 이 기운은.. 날카로운 매의 눈빛이로군요. 어서오세요, #h0#. 활을 다룰줄도 모르고 화살도 무서워 하던 풋풋한 초보자였던 당신이 여기까지 성장할 줄이야.");
    } else if (status == 1) {
        qm.sendNext("당신이 이렇게 강력한 궁수가 될 줄은 이미 느끼고 있었답니다.")
    } else if (status == 2) {
        qm.sendNext("계속 더 정진하세요. 자네를 궁수로 만들어준 사람으로써 확신해요. 더 강한 궁수가 될 거란 걸...")
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showQuestClear(3507);
        qm.forceStartQuest(7081, "1");
        qm.dispose();
    }
}
