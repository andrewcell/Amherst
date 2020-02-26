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
 * Quest ID : 3524
 * Quest Name : 잃어버린 추억을 찾아 
 * Quest Progress Info : 오랜만에 #p1032001#를 만났다. 그는 한 때는 미숙한 초보자였던 자네가 대마법사로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Quest End Info : 오랜만에 #p1032001#를 만났다. 그는 한 때는 미숙한 초보자였던 자네가 대마법사로 성장한 모습을 보게 되어 반갑다며 진심으로 기뻐해 주었다. 너무도 오래된 첫만남을 아직도 기억하는 그를 보니 가슴이 따뜻해지는 것 같다. 
 * Start NPC : 1032001
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
        qm.sendNext("훌륭하게 정제된 마력이군. 대마법사의 반열에 오른 자들만이 보일 수 있는... 그러고 보니, 아주 오래 전에 대마법사의 재능이 있는 초보자를 본 적이 있었는데... 그 이름이 #h0#였지.");
    } else if (status == 1) {
        qm.sendNext("아직 매직클로도 쓸 줄 모르던 미숙한 초보자였던 자네가 이리 성장한 모습을 보게 되다니... 정말 기쁘구만. 자네라면 이렇게 될 줄 알았지.")
    } else if (status == 2) {
        qm.sendNext("계속 더 정진하게... 자네를 마법사로 만든 사람으로써, 확신하고 있다네. 자네가 더 강한 마법사가 되리라고...")
    } else if (status == 3) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showQuestClear(3507);
        qm.forceStartQuest(7081, "1");
        qm.dispose();
    }
}
