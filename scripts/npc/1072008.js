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
 * NPCID : 1072008
 * ScriptName : inside_pirate
 * NPCNameFunc : 카이린 - 해적 전직관
 * Location : 108000503 (히든스트리트 - 해적의시험장)
 * Location : 108000502 (히든스트리트 - 해적의시험장)
 * Location : 108000501 (히든스트리트 - 해적의시험장)
 * Location : 108000500 (히든스트리트 - 해적의시험장)
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
        var mapid = cm.getPlayer().getMapId();
        if (mapid < 108000502) {
            itemid = 4031857;
        } else {
            itemid = 4031856;
        }
        if (cm.haveItem(itemid, 15)) {
            cm.sendYesNo("호오, 벌써 #b#t"+itemid+"##k 15개를 다 모은거야? 대단한걸? 조금은 다시 봤어. 이 곳에서 내보내 줄까?");
        } else {
            cm.sendYesNo("아직 #b#t"+itemid+"##k 15개를 다 모으지 못한 모양이지? 그런데 지금 바로 나가고 싶은거야?");
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.warp(120000101);
        } else {
            cm.sendOk("나가고 싶다면 언제든지 내게 말을 걸어.")
        }
        cm.dispose();
    }
}