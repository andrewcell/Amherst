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
 * NPCID : 2110005
 * ScriptName : nihal_taxi
 * NPCNameFunc : 낙타 택시
 * Location : 260020700 (선셋로드 - 사헬지대1)
 * Location : 260020000 (버닝로드 - 아리안트 북문 밖)
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }

    if (status == 0) {
        if (cm.getPlayer().getMapId() == 260020000) {
            cm.sendYesNo("#b5000메소#k를 지불하고 사헬지대3으로 가시겠습니까?");
        }
        if (cm.getPlayer().getMapId() == 260020700) {
            cm.sendYesNo("#b5000메소#k를 지불하고 아리안트 북문 밖으로 가시겠습니까?");
        }
    } else if (status == 1) {
        if (cm.getPlayer().getMapId() == 260020000) {
            if (cm.getPlayer().getMeso() >= 100000) {
                cm.warp(260020700);
                cm.gainMeso(-5000);
                cm.dispose();
            } else {
                cm.sendOk("잠깐... 메소가 부족하신데요!");
                cm.dispose();
                return;
            }
        } else if (cm.getPlayer().getMapId() == 260020700) {
            if (cm.getPlayer().getMeso() >= 100000) {
                cm.warp(260020000);
                cm.gainMeso(-5000);
                cm.dispose();
            } else {
                cm.sendOk("잠깐... 메소가 부족하신데요!");
                cm.dispose();
                return;
            }
        }
    }
}