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
 * NPCID : 2012006
 * ScriptName : getAboard
 * NPCNameFunc : 이스 - 승강장 안내원
 * Location : 200000100 (오르비스 - 오르비스매표소)
 * 
 * @author T-Sun
 *
 */

var status = 0;

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 1)
            cm.sendSimple("다른곳으로 여행하시기 위한 정거장을 찾고 계시나요? 어느 정거장으로 이동하시고 싶으세요? 어느곳으로 가셔도 포탈을 통해 다시 이곳으로 돌아오실 수 있답니다#b\r\n\r\n#L0#엘리니아행 승강장#l\r\n#L1#루디브리엄행 승강장#l\r\n#L2#무릉도원행 승강장#l\r\n#L3#리프레행 승강장#l\r\n#L4#아리안트행 승강장#l\r\n");
        else if (status == 2) {
            if (selection == 0){
                cm.sendNext("엘리니아행 승강장으로 이동시켜 드리겠습니다. 포탈을 통해 다시 이곳으로 돌아올 수 있습니다.");
                status = 9;
            }
            if (selection == 1){
                cm.sendNext("루디브리엄행 승강장으로 이동시켜 드리겠습니다. 포탈을 통해 다시 이곳으로 돌아올 수 있습니다.");
                status = 19;
            }
            if (selection == 2) {
                cm.sendNext("무릉도원행 승강장으로 이동시켜 드리겠습니다. 포탈을 통해 다시 이곳으로 돌아올 수 있습니다.");
                status = 29;
            }
            if (selection == 3) {
                cm.sendNext("리프레행 승강장으로 이동시켜 드리겠습니다. 포탈을 통해 다시 이곳으로 돌아올 수 있습니다.");
                status = 39;
            }
            if (selection == 4) {
                cm.sendNext("아리안트행 승강장으로 이동시켜 드리겠습니다. 포탈을 통해 다시 이곳으로 돌아올 수 있습니다.");
                status = 49;
            }
        } else if(status == 10){
            cm.warp(200000110, 0);// Ellinia walkway
            cm.dispose();
        } else if (status==20){
            cm.warp(200000120, 0);// Ludi Walkway
            cm.dispose();
        } else if (status==30){
            cm.warp(200000140, 0);// Mu Lung Walkway
            cm.dispose();
        } else if (status==40){
            cm.warp(200000130, 0);// Leafre Walkway
            cm.dispose();
        } else if (status==50){
            cm.warp(200000150, 0);// Ariant Walkway
            cm.dispose();
        }
    }
}