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
 * NPCID : 9040007
 * ScriptName : guildquest1_will
 * NPCNameFunc : 샤렌 3세의 유언장
 * Location : 990000600 (샤레니안 - 지하수로)
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
        } else if (mode == 0) {
            status--;
            
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("나 샤렌 3세는 비통함을 누르지 못하고 이곳에서 죽는다. \r\n루비안을 지키기 위해 악마 에레고스를 불러낸 것은 짐의 크나큰 과오가 아닐 수 없다.")
    } else if (status == 1) {
        cm.sendNextPrev("에레고스는 루비안의 마력에 취해, 마계의 무리들을 불러들여 샤레니안을 침략했다. 그리고 짐은 왕의 옷도 벗어 던지고 도망치다 수로에서 죽고 말았다.");
    } else if (status == 2) {
        cm.sendNextPrev("짐의 과오로 샤레니안이 멸망한 것을 누구를 탓하겠는가? 그러나 체통조차 지키지 못한 채 죽은 것은 천추의 한이라구나! 이 유언을 볼 후세의 사람이여, 짐을 가엾이 여긴다면 짐의 옷을 찾아주지 않겠는가?");
    } else if (status == 3) {
        cm.sendPrev("#v4001032# #t4001032# \r #v4001031# #t4001031# \r #v4001033# #t4001033# \r #v4001034# #t4001034# \r 이것들을 찾아 살아 생전의 버릇대로 아래부터 입혀 준다면, 짐도 편히 잠들 수 있을 것 같구나.")
    } else if (status == 4) {
        cm.dispose();
    }
}