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
 * NPCID : 9100004
 * ScriptName : neko5
 * NPCNameFunc : 슬리피우드 마네키네코
 * Location : 109080002 (히든스트리트 - 코코넛 시즌)
 * 
 * @author T-Sun
 *
 */

var items = [1012289, 
1072407, 
1072395, 
1072394, 
1072483, 
1072457, 
1072426, 
1001084, 
1072514, 
1001083, 
1002845, 
1051371, 
1050303, 
1051285, 
1012137, 
1032063, 
1050235, 
1002907, 
1002920, 
1002921, 
1002970, 
1002877, 
1002978, 
1062136, 
1062138, 
1062139, 
1062147, 
1062145, 
1062153, 
1062152, 
1062157, 
1062107, 
1062119, 
1062122, 
1062123, 
1062124, 
1062126, 
1062131, 
1062113, 
1062110, 
1062108, 
1042222, 
1042200, 
1042202, 
1042198, 
1042199, 
1042193, 
1042194, 
1042188, 
1042207, 
1042168, 
1042170, 
1042163, 
1042183, 
1042157, 
1042158, 
1042156, 
1092067, 
1342069, 
1022110, 
1022079, 
1022075, 
1022109, 
1022083, 
1022102, 
1052354, 
1102532, 
1102267, 
1052253, 
1050177, 
1052291, 
1051219, 
1051218, 
1052203, 
1051189, 
1052236, 
1052224, 
1052200, 
1052179, 
1102270, 
1102157, 
1102223, 
1102224, 
1102215
    ];

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
        cm.sendSimple("부화기 아이템 검색\r\n#L0#페이지 찾아가기#l\r\n");
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendGetNumber("페이지 적어", 1, 1, 1000);
        } else {
            page = 1;
            status = 2;
        }
    } else if (status == 2) {
        page = selection;
        status++;
    }
    if (status >= 4) {
        page++;
    }
    if (status >= 3) {
        if (items.length >= 50 * page) {
            var str = "현재 페이지 : " + page + "/"+(Math.floor(items.length / 50) + 1)+"\r\n\r\n";
            for (var i = 0; i < 50; ++i) {
                var codeitem = items[i + ((page - 1) * 50)];
                str += "#i" + codeitem +"# #z" + codeitem +"#\r\n";
            }
            cm.sendNext(str);
        } else {
            var str = "현재 페이지 : " + page + "\r\n\r\n";
            var max = items.length % (50 * page);
            for (var i = 0; i < max; ++i) {
                var codeitem = items[i + ((page - 1) * 50)];
                if (codeitem == null) {
                    continue;
                }
                str += "#i" + codeitem +"# #z" + codeitem +"#\r\n";
            }
            cm.sendOk(str);
            cm.dispose();
        }
    }
}