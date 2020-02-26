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
 * NPCID : 2040041
 * ScriptName : party2_play
 * NPCNameFunc : 아쿠아 벌룬
 * Location : 922010600 (히든스트리트 - 버려진 탑<6단계>)
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
        var eim = cm.getPlayer().getEventInstance();
        if (cm.isLeader()) {
            var val = eim.getProperty("stage6");
            if (val == null) {
                eim.setProperty("stage6", "1");
                cm.sendNext("안녕하세요. 여섯번째 스테이지에 오신 것을 환영합니다. 이 곳에는 숫자가 적힌 상자가 있는데 올바른 상자 위로 올라가 ↑ 키를 누르면 다음 상자들로 이동됩니다. 제가 파티장에게 단 두번만 통과에 관한 힌트를 드릴텐데 파티장은 그 힌트를 잘 기억하고 있다가 힌트대로 모든 파티원이 차례 차례 위로 올라가면 됩니다.\r\n맨 위까지 올라가면 다음 스테이지로 갈 수 있는 포탈이 있을 겁니다. 포탈을 통해 파티원 전원이 다음 스테이지로 이동하면 클리어 한 것이 됩니다. 올바른 상자를 기억하는 것이 관건이겠군요. 그럼 힌트를 드릴테니 잘 외우도록 하세요~!\r\n\r\n#b하나, 3, 3, 2, 가운데, 1, 셋, 3, 3, 왼쪽, 둘, 3, 1, 일, ?");
                cm.dispose();
            } else if (val.equals("1")) {
                eim.setProperty("stage6", "2");
                cm.sendNext("다시 한번 힌트를 드릴테니 잘 보고 외우세요~! \r\n\r\n#b하나, 3, 3, 2, 가운데, 1, 셋, 3, 3, 왼쪽, 둘, 3, 1, 일, ?");
                cm.dispose();
            } else if (val.equals("2")) {
                cm.sendNext("힌트를 두번 모두 드렸답니다. 더 이상 힌트를 드릴 수 없어요! 파티원들과 함께 힘을 합쳐 문제를 해결해보세요.");
                cm.dispose();
            }
        } else {
            cm.sendOk("안녕하세요. 여섯번째 스테이지에 오신 것을 환영합니다. 이 곳에는 숫자가 적힌 상자가 있는데 올바른 상자 위로 올라가 ↑ 키를 누르면 다음 상자들로 이동됩니다. 제가 파티장에게 단 두번만 통과에 관한 힌트를 드릴텐데 파티장은 그 힌트를 잘 기억하고 있다가 힌트대로 모든 파티원이 차례 차례 위로 올라가면 됩니다.\r\n맨 위까지 올라가면 다음 스테이지로 갈 수 있는 포탈이 있을 겁니다. 포탈을 통해 파티원 전원이 다음 스테이지로 이동하면 클리어 한 것이 됩니다. 그럼 힘내주세요!");
            cm.dispose();
        }
    }
}