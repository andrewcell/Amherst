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
 * NPCID : 2091006
 * ScriptName : dojang_move
 * NPCNameFunc : 무릉도장 공고문
 * Location : 250000100 (무릉 - 무릉 사원)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 200000200 (오르비스 - 오르비스공원)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var readNotice = 0;
function start() {
    cm.sendSimple("#e< 공고 >#n\r\n무릉도장에 도전할 만용이 있는 젊은이는 무릉도장으로 찾아 오시오.  - 무공 - \r\n\r\n\r\n#b#L0#무릉도장에 도전해 본다.\r\n#L1#공고문을 더 자세히 읽어 본다.#l");
}
function action(mode, type, selection) {
    if (mode >= 0) {
        if (selection == 1 || readNotice == 1) {
            if (status == -1) {
                readNotice = 1;
                cm.sendNext("#e< 공고 : 도전하라! >#n\r\n나는 무릉도장의 주인 무공이다. 나는 오래 전에 무릉에서 선\r\n인이 되기 위해 수련을 시작했고, 이제 나의 내공은 경지의\r\n반열에 올라섰다. 무릉도장의 주인은 나약하기 그지없는 사\r\n람이었다. 그러므로 오늘부터 무릉도장은 내가 접수하기로\r\n했다. 무릉도장은 가장 강한 사람에게만 소유할 자격이 주어\r\n진다.\r\n나에게 가르침을 받고자 하는 사람이 있다면 언제든지 도전\r\n하라! 혹은 나에게 도전하고 싶은 자라도 상관없다. 자신\r\n의 나약함을 뼈저리게 느끼게 해주겠다.");
                status = 1;
            } else if (status == 1) {
                cm.sendOk("추신 : 혼자서 도전해도 좋다. 하지만 용기가 없는 자라면 여\r\n러명이 와도 상관없다.");
                cm.dispose();
            }
        } else {
            if (status == -1 && mode == 1) {
                cm.sendYesNo("#b(공고문에 손을 대자, 신비한 기운이 나를 감싸기 시작했다.)#k\\r\n\r\n이대로 무릉도장으로 이동하시겠습니까?");
                status = 1;
            } else if (status == 1) {
                if (mode == 0) {
                    cm.dispose();
                } else {
                    cm.saveLocation("MULUNG_TC");
                    cm.warp(925020000);
                }
                cm.dispose();
            } else
                cm.dispose();
        }
    } else
        cm.dispose();
}