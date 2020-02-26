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
 * NPCID : 9040005
 * ScriptName : guildquest1_out
 * NPCNameFunc : 귀환석
 * Location : 990000100 (샤레니안 - 수호의 골짜기)
 * Location : 990000300 (샤레니안 - 샤레니안 성문)
 * Location : 990000200 (샤레니안 - 유적의 입구)
 * Location : 990000600 (샤레니안 - 지하수로)
 * Location : 990000500 (샤레니안 - 현자의 분수)
 * Location : 990000400 (샤레니안 - 기사의 홀)
 * Location : 990000800 (샤레니안 - 왕의 회랑)
 * Location : 990000700 (샤레니안 - 샤렌 3세의 무덤)
 * Location : 990000900 (샤레니안 - 에레고스의 왕좌)
 * 
 * @author T-Sun
 *
 */

var status = -1;

function action(mode, type, selection) {
    if (mode != 1) {
        cm.sendOk("조금 더 노력해 보시면 좋은 결과가 있을거에요!");
        cm.dispose();
        return;
    }
    status++;
    if (status == 0) {
        if (cm.isPlayerInstance()) {
            cm.sendSimple("무엇을 하고 싶으세요? #b\r\n #L0#길드 대항전에서 나갑니다.#l");
        } else {
            cm.sendOk("닐리리야~ 닐리리야아~ 니나노~♪");
            cm.dispose();
        }
    }
    else if (status == 1) {
        cm.sendYesNo("정말 길드 대항전에서 나가시고 싶으세요?");
    }
    else if (status == 2) {
        if (cm.isPlayerInstance()) { 
            cm.getPlayer().getEventInstance().removePlayer(cm.getPlayer());
        }
        cm.dispose();
        return;
    }
}
