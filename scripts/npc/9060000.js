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
 * NPCID : 9060000
 * ScriptName : tamepig_out
 * NPCNameFunc : 켄타
 * Location : 923010000 (히든스트리트 - 켄타의 사육실)
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
        if (cm.haveItem(4031508, 5) && cm.haveItem(4031507, 5)) {
            cm.sendNext("와~ #b#t4031508##k 5개와 #b#t4031507##k 5개를 모아오셨군요! 사육실 밖으로 내보내 드릴게요~")
        } else {
            cm.sendYesNo("아직 #b#t4031508##k 5개와 #b#t4031507##k 5개를 모으지 못하신 것 같군요. 밖으로 내보내 드릴까요?");
        }
    } else if (status == 1) {
        if (cm.haveItem(4031508, 5) && cm.haveItem(4031507, 5)) {
            cm.warp(230000003);
            cm.dispose();
        } else {
            if (selection == 1) {
                cm.warp(923010100);
                cm.dispose();
            } else {
                cm.sendOk("외계인으로부터 돼지를 보호하고, 페로몬 5개와 연구 보고서 5개를 모아주세요! 부탁드려요~")
                cm.dispose();
            }
        }
    }
}