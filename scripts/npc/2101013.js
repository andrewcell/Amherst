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
 * NPCID : 2101013
 * ScriptName : karakasa
 * NPCNameFunc : 카르카사
 * Location : 260010600 (버닝로드 - 유랑단의 텐트)
 * 
 * @author T-Sun
 *
 */
var towns = new Array(100000000,101000000,102000000,103000000,104000000);

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
		return;
	} else {
	if (mode == 0) {
		cm.sendNext("음. 이 노선을 타시기에 조금 무서우신 모양이지요? 하지만 시간이 급하다면 얘기는 달라지겠지요.");
		cm.dispose();
		return;
	}
	if (mode == 1)
		status++;
	else
		status--;
	if(status == 0){
		cm.sendAcceptDecline("이곳을 어떻게 찾으셨는지 모르겠군요. 하지만 제대로 찾아오셨다고 말씀드릴 수 있겠습니다. 이곳 니할 사막에서 빅토리아 아일랜드로 가는 직통 노선이 있거든요. 원하신다면 특별히 태워드리도록 하겠지만.. 정말 이 노선을 이용하고 싶으신가요?");
	} else if(status == 1){
		cm.sendAcceptDecline("단, 명심하셔야 할 것이 두가지 있어요. 첫째로 이 노선은 화물 수송 노선으로 정식 노선이 아니기 때문에 #r어느 마을로 가게 될지는 장담할 수 없습니다.#k 둘째로 특별히 당신을 태워주는 거라서 돈이 좀 들어요. 수수료로 #b#e10000메소#k#n가 필요해요. 지금 당장 출발하는 수송선이 있는데 타시겠어요?");
	} else if(status == 2){
		cm.sendNext("Okay, ready to takeoff~");
	} else if(status == 3){
		if(cm.getMeso() >= 10000){
			cm.gainMeso(-10000);
			cm.warp(towns[Math.floor(Math.random() * towns.length)]);
			cm.dispose();
		} else{
			cm.sendNextPrev("흐음. 메소가 부족하신건 아닌가요? 수수료는 #b#e10000#n#k메소니 돈을 충분히 갖고 있는지 확인해 보세요.");
			cm.dispose();
			}
		}
	}
}