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
         * NPCID : 2133001
         * ScriptName : party6_elin
         * NPCNameFunc : 엘린
         * Location : 930000700 (독안개의 숲 - 엘린의 숲)
         * Location : 930000600 (독안개의 숲 - 독의 숲)
         * Location : 930000400 (독안개의 숲 - 중독된 숲)
         * Location : 930000300 (독안개의 숲 - 안개의 숲)
         * Location : 930000200 (독안개의 숲 - 변질된 숲)
         * Location : 930000010 (독안개의 숲 - 숲 입구)
         * Location : 930000000 (독안개의 숲 - 들어가기 전)
         * Location : 930000100 (독안개의 숲 - 숲 초입)
         * 
         * @author T-Sun
         *
         */
        var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    switch (cm.getPlayer().getMapId()) {
        case 930000000:
            cm.sendNext("어서와, 중앙에 보이는 포탈에 들어가면 변신 마법을 걸어줄게.");
            break;
        case 930000010:
            cm.sendNext("자신이 누군지 잘 확인하고 자신의 모습을 잊어버리지 않도록 조심해.");
            break;
        case 930000100:
            cm.sendNext("독에 변질된 모든 몬스터들을 없애!");
            break;
        case 930000200:
            cm.sendNext("중앙에서 희석된 독으로 가시 덤불을 없애고 진행해줘.");
            break;
        case 930000300:
            cm.clearEffect();
            cm.warpParty(930000400);
            break;
        case 930000400:
            if (cm.haveItem(4001169, 20) && cm.isLeader()) {
                cm.clearEffect();
                cm.warpParty(930000500);
                cm.gainItem(4001169, -20);
            } else if (!cm.haveItem(2270004) && cm.isLeader()) {
                cm.gainItem(2270004, 10);
                cm.sendOk("여기 정화의 구슬을 줄게.");
            } else {
                cm.sendOk("나에게 정화의 구슬을 받은 다음, 몬스터들을 캐치해서 몬스터 구슬 20개를 파티장이 가져와!");
            }
            break;
        case 930000600:
            cm.sendNext("이제 괴인의 제단 위에 보라색 마력석을 올려놓아 봐.");
            break;
        case 930000700:
            cm.removeAll(4001163);
            cm.removeAll(4001169);
            cm.removeAll(2270004);
            cm.warp(930000800, 0);
            break;
    }
    cm.dispose();
}