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
 * NPCID : 2012012
 * ScriptName : oldBook2
 * NPCNameFunc : 리사
 * Location : 200000000 (스카이로드 - 오르비스)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        val = cm.getQuestStatus(3006);
        val2 = cm.getQuestStatus(3017);
        if (val == 0) {
            cm.sendOk("요즘 몬스터들이 사나워진것 같아 걱정이에요.");
        } else if (val2 == 0) {
            cm.sendOk("음.. #b헬라#k요..? 그녀가 잘 있는지 잘 아는 사람이라.. 흠.. 낯선 사람에게 알려줘도 될 지 모르겠지만.. 후.. 이런 경우라면 어쩔 수 없겠지요. 제가 보아왔던것으론 그녀를 #b제이드#k가 많이 아껴주었던 것 같아요.");
        } else {
            cm.sendOk("혹시 #b헬라#k를 찾고 계세요? 사실 원래 그녀는 이곳에 살고 있었지만, 요즘 그녀를 통 찾을수가 없어요. 몇달 전에 그녀는 홀연히 집에서 어디론가 떠났거든요. 저는 그녀의 집에서 일을 하고 있지만, 적어도 청소기가 있었으면 좋겠네요. 아아.. 지금 내가 무슨 말을 하는거람.")
        }
        cm.dispose();
    }
}