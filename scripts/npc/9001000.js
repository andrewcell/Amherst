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
 * NPCID : 9001000
 * ScriptName : cokeTown
 * NPCNameFunc : 코-크베어 운영자
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 230000000 (아쿠아로드 - 아쿠아리움)
 * Location : 219000000 (히든스트리트 - 코-크 타운)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 108010301 (히든스트리트 - 차원의세계)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
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
    if (cm.getMapId() == 219000000) {
        if (status == 0) {
            cm.sendSimple("언제나 코-카 콜라~♪ #b코-크 타운#k에서 즐거운 시간 보냈어? 무엇을 도와줄까?\r\n#b#L0# 이전에 있던 #m"+cm.getSavedLocation("FISHING")+"# 마을로 보내주세요.#l");
        } else if (status == 1) {
            cm.sendYesNo("지금 #b#m"+cm.getSavedLocation("FISHING")+"##k 마을로 보내줄까?");
        } else if (status == 2) {
            if (selection == 1) {
                cm.warp(cm.getSavedLocation("FISHING"));
                cm.clearSavedLocation("FISHING");
                cm.dispose();
            } else {
                cm.sendOk("시원한 #b코-크 타운#k에서 즐거운 시간 보내다 가~");
                cm.dispose();
            }
        }
    } else {
        if (status == 0) {
            cm.sendSimple("언제나 코-카 콜라~♪ 새로 오픈된 #b코-크 타운#k으로 놀러가보지 않을래? 시원한 코-카 콜라와 함께해보라구!\r\n#b#L0# 코-크 타운으로 가고 싶어요.#l");
        } else if (status == 1) {
            cm.sendYesNo("#b코-크 타운#k으로 놀러가보고 싶어? 언제든지 그곳에 있는 나를 통해 돌아올 수 있어. 지금 당장 출발해볼래?");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("흐음. 아쉽구나. 아직 볼일이 남아 있는 모양이지? 나는 언제든지 이곳에서 기다리고 있으니 볼 일이 끝나면 다시 돌아와 줘~");
                cm.dispose();
            } else if (selection == 1) {
                cm.saveLocation("FISHING");
                cm.warp(219000000);
                cm.dispose();
            }
        }
    }
}