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
 * NPCID : 9201023
 * ScriptName : amoria_enter
 * NPCNameFunc : 헤라 - 웨딩빌리지 입장
 * Location : 230000000 (아쿠아로드 - 아쿠아리움)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 261000000 (선셋로드 - 마가티아)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 100000200 (빅토리아로드 - 헤네시스공원)
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
        cm.sendNext("아~ 오늘은 정말 멋진 날이야! 세상은 정말 아름다워~! 이 세상에 사랑이 가득한 것 같지 않아? 웨딩빌리지에 가득한 사랑의 기운이 이 곳까지 흘러넘치고 있는 것 같아~!");
    } else if (status == 1) {
        cm.sendYesNo("웨딩빌리지에 가본 적 있어? 그 곳은 사랑이 넘쳐가는 곳이지~. 그곳에서는 사랑하는 사람과 결혼도 할 수 있대. 정~말 낭만적이지 않아? 네가 그 곳에 가고 싶다면 내가 보내줄 수 있어. 어때 한 번 가볼래?");
    } else if (status == 2) {
        if (selection == 1)
            cm.sendNext("정말 잘 생각했어. 웨딩빌리지에서 사랑의 기운을 만끽하고 오라구~. 돌아올 때는 다시 이곳으로 돌아올테니까 걱정말고~");
        else {
            cm.sendOk("가지 않는거야? 언제라도 가보고 싶다면 나를 찾아오도록 해.");
            cm.dispose();
        }
    } else if (status == 3) {
        cm.saveLocation("AMORIA");
        cm.warp(680000000, 0);
        cm.dispose();
    }
}