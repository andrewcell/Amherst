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
 * NPCID : 1032008
 * ScriptName : get_ticket
 * NPCNameFunc : 체리 - 매표소 안내원
 * Location : 101000300 (빅토리아로드 - 엘리니아정거장)
 * 
 * @author T-Sun
 *
 */
var status = 0;

function start() {
    status = -1;
    boat = cm.getEventManager("Boats");
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if(mode == 0) {
        cm.sendNext("아직 이곳에서 볼일이 남으신 모양이지요?");
        cm.dispose();
        return;
    }
    if (status == 0) {
        var str = "배는 매 시간 정각 기준으로 15분 마다 출발하고 있으며, 출발 5분 전부터 표를 받고 있답니다.\r\n";
        var lvl = cm.getPlayerStat("LVL");
        if (lvl < 15) {
            str += "흐음.. 그런데 당신은 아직 오시리아 대륙으로 가보시기엔 너무 약해보이시는군요. 조금 더 수련을 하신 후 다시 찾아오세요.";
            cm.sendOk(str);
            cm.dispose();
            return;
        } else if (lvl < 30) {
            ticket = 4031044;
            str += "#b\r\n#L0#배에 탑승하고 싶습니다.#l";
        } else {
            ticket = 4031045;
            str += "#b\r\n#L0#배에 탑승하고 싶습니다.#l";
        }
        cm.sendSimple(str);
    } else if (status == 1) {
	//cm.sendOk("현재 4월 8~9일까지 오르비스행 배 운항을 해 드리지 않습니다.");
	//cm.dispose();
	//return;


        if(boat == null) {
            cm.sendNext("배를 사용할 수 없습니다.");
            cm.dispose();
        } else if (boat.getProperty("ready").equals("false")) {
            cm.sendOk("아직 배가 출항 준비중에 있습니다. 배는 매 시간 정각 기준 10, 25, 40, 55분에 출항을 준비하며, 최장 30분 이내에 출항 준비가 완료됩니다.");
            cm.dispose();
        } else if(boat.getProperty("entry").equals("true")) {
            cm.sendYesNo("아직 배에 탑승할 여유가 있다고 합니다. 정말 배에 탑승하고 싶으세요?");
        } else if(boat.getProperty("entry").equals("false") && boat.getProperty("docked").equals("true")) {
            cm.sendOk("이미 배가 출항 준비중에 있습니다. 죄송하지만 지금은 배에 탑승하실 수 없답니다. 표는 출발하기 1분 이전에만 받고 있답니다. 다음 배를 기다려보세요.");
            cm.dispose();
        } else {
            cm.sendOk("이미 배가 오르비스로 출발했답니다. 배는 매 시간 기준으로 15분 마다 출발하니 잠시만 기다려 보세요.");
            cm.dispose();
        }
    } else if (status == 2) {
        if (cm.haveItem(ticket, 1)) {
            cm.gainItem(ticket, -1);
        } else {
            cm.sendOk("흐음.. #b#t"+ticket+"##k은 분명 제대로 갖고 계신건가요? 티켓이 없으시다면 왼쪽에서 티켓을 구매하실 수 있답니다.")
            cm.dispose();
            return;
        }
        cm.warp(cm.getPlayer().getMapId() + 1, 0);
        cm.dispose();
    }
}