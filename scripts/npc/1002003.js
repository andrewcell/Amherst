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
 * NPCID : 1002003
 * ScriptName : friend00
 * NPCNameFunc : 몽롱 할배 - 친구목록 관리자
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * 
 * @author T-Sun
 *
 */
var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	if (status == 0) {
	    cm.sendNext("이봐, 자네! 친구 목록이 부족한 건 아닌가? 친구 목록이 부족하다면 나와 거래해 보는건 어떤가?");
	    cm.dispose();
	    return;
	} else if (status >= 1) {
	    cm.sendNext("이봐, 자네! 친구 목록이 부족한 건 아닌가? 친구 목록이 부족하다면 나와 거래해 보는건 어떤가?");
	    cm.dispose();
	    return;
	}
	status--;
    }
    if (status == 0) {
	cm.sendYesNo("오늘도 손님이 많아야 할텐데... 엇! 잠깐만! 자네 친구 목록을 늘리고 싶지는 않은가? 자네 얼굴을 보니 한 눈에 친구가 굉장히 많을것 같다는 예감이 들었다네. 어떤가... 메소만 조금 준다면 자네의 친구 목록을 늘려주겠네. 대신 같은 계정에 다른 캐릭터에게는 적용되지 않으니까 신중히 하라구. 해볼텐가?");
    } else if (status == 1) {
	cm.sendYesNo("좋았어! 잘생각했네. 가격은 그다지 비싸지 않아. 내가 큰 맘 먹고 #r대폭할인#k을 시작했기 때문이지. #b친구 목록 5명을 추가 하는 데 5만 메소#k라네. 물론 낱개로는 팔지 않는다네. 한 번 사두기만 하면 영원히 목록이 늘어나는 셈이니까 친구 목록이 부족한 사람이라면 해보는 것도 나쁘지 않아. 어때? 5만 메소 내겠나?");
    } else if (status == 2) {
	var capacity = cm.getBuddyCapacity();
	if (capacity >= 100 || cm.getMeso() < 50000) {
	    cm.sendNext("자네... #b5만 메소#k는 확실히 가지고 있는 건가? 만일 그렇다면 친구 목록이 최대로 늘어나 있는건 아닌지 확인해 주게. 아무리 돈을 낸다 하더라도 친구 목록은 기본 개수를 포함해서 #b100개 이상#k 늘어날 수 없다네.");
	} else {
	    var newcapacity = capacity + 5;
	    cm.gainMeso(-50000);
	    cm.updateBuddyCapacity(newcapacity);
	    cm.sendOk("좋았어! 자네의 친구 목록이 5개 늘어나 있을 것일세. 한 번 확인해 보게나. 그리고 만일 그래도 친구 목록이 부족하다면 언제든지 날 찾아와 주게. 몇 번이라도 늘려줄테니까 말야. 물론 공짜로는 안되지만... 그럼 잘가게~");
	}
	cm.dispose();
    }
}