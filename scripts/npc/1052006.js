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
 * NPCID : 1052006
 * ScriptName : subway_ticket
 * NPCNameFunc : 웅이 - 지하철 공익요원
 * Location : 103000100 (빅토리아로드 - 지하철매표소)
 * 
 * @author T-Sun
 *
 */

var meso = new Array(500, 1200, 2000);
var item = new Array(4031036, 4031037, 4031038);
var selector;
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        cm.dispose();
        return;
    } else if (status == 1 && mode == 0) {
        cm.sendNext("그런가요? 아직 위험한 구간이 많으니 신중하게 생각하시고 다시 말을 걸어주세요.");
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
        if (cm.getPlayerStat("LVL") <= 19) {
            cm.sendNext("안녕하세요~ 커닝시티 지하철 입니다. 아직 공사중인 구간이 많아 위험하답니다~ 흐음.. 아직 공사중 구간에 들어가시긴 너무 약해보이시는데요~");
            cm.dispose();
        } else {
                var menu = "";
                if (cm.getPlayerStat("LVL") > 19) {
                    menu += "\r\n#L1##b공사장 B1#k#l";
                } 
                if (cm.getPlayerStat("LVL") > 29) {
                    menu += "\r\n#L2##b공사장 B2#k#l";
                } 
                if (cm.getPlayerStat("LVL") > 39) {
                    menu += "\r\n#L3##b공사장 B3#k#l";
                }
            cm.sendSimple("안녕하세요~ 커닝시티 지하철 입니다. 아직 공사중인 구간이 많아 위험하답니다~ 어떤 구간의 입장권을 구매하시고 싶으세요?\r\n#b" + menu);
        }
    } else if (status == 1) {
        selector = selection - 1;
        cm.sendYesNo("음.. 정말 #b공사장 B" + selection + "#k 으로 가시는 입장권을 구매하시겠어요? 가격은 " + meso[selector] + " 메소#k 랍니다.");
    } else if (status == 2) {
        if (cm.getMeso() < meso[selector] || !cm.canHold(item[selector])) {
            cm.sendNext("요금이 부족하신것 같은데요. 혹은 인벤토리 공간이 부족하신 것 같은데요? 다시 한번 확인해 보세요.");
            cm.dispose();
        } else {
            cm.sendNext("다음에 또 이용해 주세요~");
            cm.gainMeso(-meso[selector]);
            cm.gainItem(item[selector], 1);
            cm.dispose();
        }
    }
}