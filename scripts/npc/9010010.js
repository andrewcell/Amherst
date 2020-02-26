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
 * NPCID : 9010010
 * ScriptName : 4th_scroll
 * NPCNameFunc : 카산드라
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 251000000 (무릉도원 - 백초마을)
 * Location : 230000001 (아쿠아리움 - 중앙 홀)
 * Location : 1010000 (레인보우스트리트 - 암허스트)
 * Location : 105040300 (던전 - 슬리피우드)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 260000000 (버닝로드 - 아리안트)
 * Location : 500000000 (태국 - 플로팅 마켓)
 * Location : 221000000 (루더스호수 - 지구방위본부)
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * Location : 740000000 (대만 - 서문정)
 * Location : 800000000 (일본 - 버섯신사)
 * Location : 60000 (메이플로드 - 사우스페리)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 222000000 (루더스호수 - 아랫마을)
 * Location : 701000000 (중국 - 상해와이탄)
 * Location : 100000000 (빅토리아로드 - 헤네시스)
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
        cm.sendOk("내 수정구가 무슨 재미난 일을 알아냈는지 알려줄까?");
        cm.safeDispose();
    }
}