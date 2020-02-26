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
 * NPCID : 1061007
 * ScriptName : flower_out
 * NPCNameFunc : 부서지고 있는 석상
 * Location : 105040316 (히든스트리트 - 끈기의깊은숲<7단계>)
 * Location : 105040312 (히든스트리트 - 끈기의깊은숲<3단계>)
 * Location : 105040313 (히든스트리트 - 끈기의깊은숲<4단계>)
 * Location : 105040314 (히든스트리트 - 끈기의깊은숲<5단계>)
 * Location : 105040315 (히든스트리트 - 끈기의깊은숲<6단계>)
 * Location : 105040310 (히든스트리트 - 끈기의깊은숲<1단계>)
 * Location : 105040311 (히든스트리트 - 끈기의깊은숲<2단계>)
 * 
 * @author T-Sun
 *
 */
var status = 0;

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
    if (status == 1) {
	cm.sendYesNo("석상에 손을 대자 어디론가 빨려드는 듯한 느낌이 듭니다. 이대로 #b슬리피우드#k로 돌아가시겠습니까?");
    } else if (status == 2) {
        if (selection == 0) {
            cm.sendOk("석상에서 손을 떼자 아무 일도 없던 것처럼 원래대로 돌아왔습니다.");
            cm.dispose();
            return;
        }
	cm.warp(105040300);
	cm.dispose();
    }
}	