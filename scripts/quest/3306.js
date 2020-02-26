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
 * Quest ID : 3306
 * Quest Name : 알카드노의 망토 다시 받기
 * Quest Progress Info : #p2111001#는 망토를 다시 줄 수는 있지만, 그러려면 이번에는 망토의 재료를 모두 가져와야 한다고 했다. 망토만 다시 만들 수 있다면 재료야 얼마든지 모아주지! 재료는 #b#t4000021##k과 #b#t4021006##k, #b10000메소#k라고 하니 어서 구하도록 하자.\n\n#i4000021##t4000021# #b#c4000021##k/10 \n#i4021006##t4021006# #b#c4021006##k/5
 * Quest End Info : 알카드노의 망토를 다시 받았다. 휴우... 이 망토가 없으면 알카드노 소속임을 증명할 수 없다. 앞으로는 잃어버리지 않도록 주의해야겠다.
 * Start NPC : 2111001
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
        if (qm.getPlayer().hasEquipped(1102135)) {
            qm.sendOk("알카드노의 망토를 이미 가지고 있는걸 보니 새로운 망토가 필요하지 않겠군.");
            qm.dispose();
        } else if (qm.getQuestStatus(3347) == 2 || qm.getQuestStatus(3347) == 2 || qm.getQuestStatus(3347) == 2) {
            qm.sendOk("알카드노로써 누릴 수 있는 혜택을 이미 다 받지 않았나. 유감이지만 더 이상 알카드노의 망토를 재지급해 줄 수 없네.");
            qm.dispose();
        } else {
            qm.askAcceptDecline("본 기억이 있는 얼굴인 걸 보니 자네는 분명 알카드노 소속의 연금술사인 모양인데... 왜 알카드노의 망토를 하고 있지 않은 건가? 알카드노 소속이라면 누구나 하고 있어야 한다고 말했는데... 뭐? 망토를 잃어버렸다고...? 더 이상 알카드노가 되고 싶지 않다는 말인가? 흐음... 그건 아닌 모양이군. 그럼 망토를 다시 지급할 테니 망토를 받을 텐가?");
        }
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendNext("알카드노에 처음 들어올 때가 망토를 그냥 지급했지만, 재지급할 때는 직접 재료를 모아와야 하네. 재료는 #b#t4000021# 10개#k와 #b#t4021006# 5개#k, 연성하는 사람에게 지급할 #b10000메소#k라네. 그럼 잊지 말고 가져오게.");
            qm.forceStartQuest();
            qm.dispose();
        } else {
            qm.sendOk("싫다면 할 수 없지. 망토가 없다고 알카드노 소속이 아니게 되는 것은 아니지만... 누구도 자네를 알카드노로 생각하지 않을 것이니 명심하게.");
            qm.dispose();
        }
    }
}
