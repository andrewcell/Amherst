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
 * NPCID : 2040014
 * ScriptName : minigame00
 * NPCNameFunc : 치코 - 미니게임 마스터
 * Location : 220000300 (루디브리엄 - 루디브리엄 마을)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var arr;
var mapid;
var sel;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        mapid = cm.getPlayer().getMapId();
        var str = "";
        if (mapid == 100000203) {
            arr = new Array(
                new Array(4080000, new Array(new Array(4030000, 1), new Array(4030001, 1), new Array(4030009, 1))),
                new Array(4080001, new Array(new Array(4030000, 1), new Array(4030010, 1), new Array(4030009, 1))),
                new Array(4080002, new Array(new Array(4030000, 1), new Array(4030011, 1), new Array(4030009, 1))),
                new Array(4080003, new Array(new Array(4030010, 1), new Array(4030001, 1), new Array(4030009, 1))),
                new Array(4080004, new Array(new Array(4030011, 1), new Array(4030010, 1), new Array(4030009, 1))),
                new Array(4080005, new Array(new Array(4030011, 1), new Array(4030001, 1), new Array(4030009, 1))),
                new Array(4080100, new Array(new Array(4030012, 15)))
                );
                    str += "후후.. 난 미니게임의 마스터 #b카이지#k라고 하지. 어때..? 게임판을 만들어 보고 싶은거야?\r\n\r\n#b";
        } else if (mapid == 220000300) {
            arr = new Array(
                new Array(4080006, new Array(new Array(4030013, 1), new Array(4030014, 1), new Array(4030009, 1))),
                new Array(4080007, new Array(new Array(4030013, 1), new Array(4030016, 1), new Array(4030009, 1))),
                new Array(4080008, new Array(new Array(4030014, 1), new Array(4030016, 1), new Array(4030009, 1))),
                new Array(4080009, new Array(new Array(4030015, 1), new Array(4030013, 1), new Array(4030009, 1))),
                new Array(4080010, new Array(new Array(4030015, 1), new Array(4030014, 1), new Array(4030009, 1))),
                new Array(4080011, new Array(new Array(4030015, 1), new Array(4030016, 1), new Array(4030009, 1))),
                new Array(4080100, new Array(new Array(4030012, 15)))
                );
                    str += "게임판을 만들어 보고 싶은거야?\r\n\r\n#b";
        }
        for (var i = 0; i < arr.length; ++i) {
            str += "#L" + i + "# #t" + arr[i][0] + "##l\r\n"
        }
        cm.sendSimple(str);
    } else if (status == 1) {
        sel = selection;
        var str = "#b#i" + arr[sel][0] + "# #t" + arr[sel][0] + "##k 게임을 만들어 보고 싶은거야? 흐음... 재료는 \r\n";
        for (var i = 0; i < arr[sel][1].length; ++i) {
            str += "#b#i" + arr[sel][1][i][0] + "# #t" + arr[sel][1][i][0] + "##k " + arr[sel][1][i][1] + " 개\r\n";
        }
        str += "\r\n\r\n인데, 정말 만들어 보고 싶어? 특별히 제작비는 받지 않도록 하지.";
        cm.sendYesNo(str);
    } else if (status == 2) {
        for (var i = 0; i < arr[sel][1].length; ++i) {
            if (!cm.haveItem(arr[sel][1][i][0], arr[sel][1][i][1])) {
                cm.sendOk("부족한 재료가 있는건 아닌지 다시 한번 확인해 줄래?");
                cm.dispose();
                return;
            }
        }
        if (!cm.canHold(arr[sel][0])) {
            cm.sendOk("흐음.. 인벤토리 공간이 부족한 것 같은데? 다시 한번 확인해 줄래?");
            cm.dispose();
            return;
        }
        for (var i = 0; i < arr[sel][1].length; ++i) {
            cm.gainItem(arr[sel][1][i][0], -arr[sel][1][i][1]);
        }
        cm.gainItem(arr[sel][0], 1);
        cm.sendOk("좋아.. 완성되었어. 재밌게 게임을 즐기라구.");
        cm.dispose();
    }
}