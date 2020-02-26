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
 * NPCID : 2023000
 * ScriptName : ossyria_taxi
 * NPCNameFunc : 위험지역 총알택시
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 240000000 (미나르숲 - 리프레)
 * 
 * @author T-Sun
 *
 */
var map;
var cost;
var location;
var mapname;
var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	cm.sendNext("Hmm... think it over. This taxi is worth its service! You will never regret it!");
	cm.dispose();
	return;
    }

    if (status == 0) {
	switch (cm.getMapId()) {
	    case 540000000: // CBD
		map = 541020000;
		cost = 30000;
		mapname = "Ulu City";
		break;
	    case 240000000: // Leafre
		map = 240030000;
		cost = 55000;
		mapname = "오시리아 대륙";
		break;
	    case 220000000: // Ludi
		map = 220050300;
		cost = 45000;
		mapname = "오시리아 대륙";
		break;
	    case 211000000: // El Nath
		map = 211040200;
		cost = 45000;
		mapname = "오시리아 대륙";
		break;
	    case 105000000:
		map = 105030000;
		cost = 30000;
		mapname = "빅토리아 아일랜드";
		break;
	    case 105030000:
		map = 105000000;
		cost = 30000;
		mapname = "빅토리아 아일랜드";
		break;
	    default:
		map = 211040200;
		cost = 45000;
		mapname = "오시리아 대륙";
		break;
	}
	cm.sendNext("안녕하세요~ 위험지역을 총알처럼 달려서 원하는곳으로 데려다 드리는 위험지역 총알택시 입니다. 현재 계신 #m"+cm.getMapId()+"# 에서 "+mapname+" 의 #b#m"+map+"##k 쪽으로 빠르게 이동시켜 드립니다! 요금은 #b"+cost+" 메소#k 입니다. 요금이 다소 비싸지만, 그만큼 안전하고 빠르게 고객을 모셔다 드립니다.");
    } else if (status == 1) {
	cm.sendYesNo("#b메소를 지불하고#k #b#m"+map+"##k 쪽으로 가보시겠습니까?");
    } else if (status == 2) {
	if (cm.getMeso() < cost) {
	    cm.sendNext("메소가 부족하시면 저희 택시를 이용하실 수 없습니다.");
	    cm.dispose();
	} else {
	    cm.gainMeso(-cost);
	    cm.warp(map);
	    cm.dispose();
	}
    }
}