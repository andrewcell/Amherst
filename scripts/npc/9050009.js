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
 * NPCID : 9050009
 * ScriptName : pigmy_guide
 * NPCNameFunc : 에뜨랑의 안내판
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 230000000 (아쿠아로드 - 아쿠아리움)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 100000000 (빅토리아로드 - 헤네시스)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var titles = Array("소환수 피그미는 무엇인가요?","소환수 피그미는 무엇을 먹나요?","피그미 에그는 무엇인가요?");
var guides = Array("소환수 피그미는 내가 마법 실험을 하다가 실수로 태어난 소환수야. 착하고 온순한 생물체이지. 하지만 너무 많이 먹는다는 것이 단점이랄까...","소환수 피그미는 잡화점에서 팔고 있는 #b맛좋은 사료#k만을 먹어. 잡화점에서 먹이를 구매하고 소환수 피그미에게 주면돼.","#b피그미 에그#k는 피그미가 낳은 알이야. 먹을 것을 주면 가끔 기분 좋아서 알을 낳지. #b이 알 속에는 신기한 물건들이 많이 들어있지.#k 그런데 한 가지 주의할 점은 알이 너무 단단해서 특별한 장치 없이는 열지 못해. 피그미 에그를 열기 위해서는 #b캐시샵에 들어가서 기타 탭의 게임에 있는 부화기#k라는 것을 구매해서 이 장치를 가지고 열어야 돼.");

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
  	    var chat = "#b<에뜨랑의 피그미 가이드>#k\r\n안녕! 나는 에뜨랑이야. 여러분을 위해 피그미에 대한 여러가지 정보를 정리했어. 궁금한 것이 있으면 한번 천천히 읽어보라고~#b\r\n";
	    for (var i = 0; i < 3; i++) {
	    	chat += "#L" + i + "#" + titles[i] + "\r\n#l";
	    }
	    cm.sendSimple(chat);
	} else if (status == 1) {
	    cm.sendNext(guides[selection]);
	    cm.dispose();
	}
    }
}