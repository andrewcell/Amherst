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
 * NPCID : 1032100
 * ScriptName : owen
 * NPCNameFunc : 요정 아르웬
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var item;
var selected;


function action(mode, type, selection) {
    if (status == 1 && mode == 0) {
        cm.dispose();
        return;
    } else if (status == 2 && mode == 0) {
        cm.sendNext("" + item + "을 제작하는건 쉬운일이 아니랍니다.. 재료를 제게 가져와 주세요.");
        cm.dispose();
        return;
    }
    if (mode == 1)
        status++;
    else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.getPlayerStat("LVL") >= 40) {
            cm.sendNext("음.. 제가 바로 소문의 최고의 연금술사입니다. 음.. 오랜 시간동안 인간과 접촉한 요정은 없었지만.. 당신같이 강한 사람은 괜찮아 보이는군요.. 특별히 당신을 위해서는 아이템을 제작해 드리도록 하지요.");
        } else {
            cm.sendOk("저만이 만들 수 있는 희귀한 물건은 있지만.. 아직 약하시고.. 누군지도 모르는 당신에게는 만들어 드릴 수 없어요.");
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendSimple("무얼 만들어 보고 싶으신가요?\r\n#b#L0#달의 돌#l\r\n#L1#별의 돌#l\r\n#L2#검은 깃털#l");
    } else if (status == 2) {
        selected = selection;
        if (selection == 0) {
            item = "달의 돌";
            mat = [[4011000, 1], [4011001, 1], [4011002, 1], [4011003, 1], [4011004, 1], [4011005, 1], [4011006, 1]];
            cost = 10000;
            itemid = 4011007;
        } else if (selection == 1) {
            item = "별의 돌";
            cost = 15000;
            itemid = 4021009;
            mat = [[4021000, 1], [4021001, 1], [4021002, 1], [4021003, 1], [4021004, 1], [4021005, 1], [4021006, 1], [4021007, 1], [4021008, 1]];
        } else if (selection == 2) {
            item = "검은 깃털";
            cost = 30000;
            itemid = 4031042;
            mat = [[4011007, 1], [4001006, 1], [4021008, 1]]
        }
        var str = "만들고 싶은 아이템이 #b#t"+itemid+"##k 인가요? 재료는 다음과 같아요.\r\n";
        for (var i = 0; i < mat.length; ++i) {
            str += "\r\n#b#i"+mat[i][0]+"# #t"+mat[i][0]+"# "+mat[i][1]+" 개";
        }
        str += "\r\n#b#i4031138# "+cost+" 메소";
        cm.sendYesNo(str);
    } else if (status == 3) {
        if (selected == 0) {
            if (cm.canHold(itemid) && cm.haveItem(4011000) && cm.haveItem(4011001) && cm.haveItem(4011002) && cm.haveItem(4011003) && cm.haveItem(4011004) && cm.haveItem(4011005) && cm.haveItem(4011006) && cm.getMeso() > 10000) {
                cm.gainMeso(-10000);
                cm.gainItem(4011000, -1);
                cm.gainItem(4011001, -1);
                cm.gainItem(4011002, -1);
                cm.gainItem(4011003, -1);
                cm.gainItem(4011004, -1);
                cm.gainItem(4011005, -1);
                cm.gainItem(4011006, -1);
                cm.gainItem(4011007, 1);
                cm.sendNext("다 되었답니다. 더 필요한 물건이 있으시면 언제라도 다시 찾아와주세요..");
            } else {
                cm.sendNext("메소는 충분히 갖고 계신지, 또는 재료가 부족한건 아닌지, 인벤토리 공간이 충분한지 다시 한번 확인해 주세요.");
            }
        } else if (selected == 1) {
            if (cm.canHold(itemid) && cm.haveItem(4021000) && cm.haveItem(4021001) && cm.haveItem(4021002) && cm.haveItem(4021003) && cm.haveItem(4021004) && cm.haveItem(4021005) && cm.haveItem(4021006) && cm.haveItem(4021007) && cm.haveItem(4021008) && cm.getMeso() > 15000) {
                cm.gainMeso(-15000);
                cm.gainItem(4021000, -1);
                cm.gainItem(4021001, -1);
                cm.gainItem(4021002, -1);
                cm.gainItem(4021003, -1);
                cm.gainItem(4021004, -1);
                cm.gainItem(4021005, -1);
                cm.gainItem(4021006, -1);
                cm.gainItem(4021007, -1);
                cm.gainItem(4021008, -1);
                cm.gainItem(4021009, 1);
                cm.sendNext("다 되었답니다. 더 필요한 물건이 있으시면 언제라도 다시 찾아와주세요..");
            } else {
                cm.sendNext("메소는 충분히 갖고 계신지, 또는 재료가 부족한건 아닌지, 인벤토리 공간이 충분한지 다시 한번 확인해 주세요.");
            }
        } else if (selected == 2) {
            if (cm.canHold(itemid) && cm.haveItem(4001006) && cm.haveItem(4011007) && cm.haveItem(4021008) && cm.getMeso() > 30000) {
                cm.gainMeso(-30000);
                cm.gainItem(4001006, -1);
                cm.gainItem(4011007, -1);
                cm.gainItem(4021008, -1);
                cm.gainItem(4031042, 1);
                cm.sendNext("다 되었답니다. 더 필요한 물건이 있으시면 언제라도 다시 찾아와주세요..");
            } else {
                cm.sendNext("메소는 충분히 갖고 계신지, 또는 재료가 부족한건 아닌지, 인벤토리 공간이 충분한지 다시 한번 확인해 주세요.");
            }
        }
        cm.dispose();
    }
}