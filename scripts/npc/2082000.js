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
 * NPCID : 2082000
 * ScriptName : sell_ticket
 * NPCNameFunc : 뮤 - 매표원
 * Location : 240000100 (리프레 - 리프레 매표소)
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
        var str = "배는 매 시간 정각 기준으로 15분 마다 출발하고 있으며, 출발 5분 전부터 표를 받고 있답니다.\r\n";
        lvl = cm.getPlayerStat("LVL");
        if (lvl < 30) {
            ticket = 4031044;
            cost = 1500;
        } else {
            ticket = 4031045;
            cost = 3000;
        }
        str += "당신은 #b#t"+ticket+"##k이 필요하실 것 같군요. 요금은 #b"+cost+"#k 메소 입니다. 어떠세요? 구매해보시겠어요? ";
        cm.sendYesNo(str);
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("그런가요? 새로운 대륙으로 모험을 떠나는것도 때로는 괜찮지 않을까요? 마음이 바뀌시면 다시 찾아오세요.")
        } else {
            if (cm.getMeso() >= cost && cm.canHold(ticket)) {
                cm.gainMeso(-cost);
                cm.gainItem(ticket, 1);
                cm.sendOk("#b#t"+ticket+"##k은 잘 받으셨나요? 배 출발 시간에 늦지 않게 탑승해 주세요~");
            } else {
                cm.sendOk("흐음, 메소가 부족한건 아닌지, 인벤토리 공간이 부족한건 아닌지 다시 한번 확인해 주세요.");
            }
            cm.dispose();
        }
    }
    
}