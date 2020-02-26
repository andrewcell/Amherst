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
 * NPCID : 1002002
 * ScriptName : florina2
 * NPCNameFunc : 페이슨 - 여행가이드
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
	if (status <= 1) {
	    cm.sendNext("플로리나 비치로 여행을 떠나보고 싶지는 않은가? 빅토리아 아일랜드 가까운 곳에는 플로리나 비치라는 환상적인 해변이 있지.");
	    cm.dispose();
	    return;
	}
	status--;
    }
    if (status == 0) {
	cm.sendSimple("리스항구에 약간 떨어진 곳에 #b플로리나비치#k라는 환상적인 해변이 있다는 말은 들어본 적이 있는가? #b1500 메소#k를 내거나 #b자유여행권#k이 있다면 언제든지 나를 통해 그곳으로 갈 수 있다네.\r\n\r\n#L0# #b1500 메소#k를 내겠습니다.#l\r\n#L1# #b자유여행권#k을 가지고 있습니다.#l\r\n#L2# #b자유여행권#k이 뭔가요?#l");
    } else if (status == 1) {
	if (selection == 0) {
	    cm.sendYesNo("#b1500 메소#k를 내고 플로리나비치로 가겠다는 건가? 좋아~ 하지만 그곳에도 몬스터가 있는 모양이니 준비하는 것을 잊지 말도록 하게나. 그럼 출항할 준비를 해야 겠군 그래. 자... 지금 당장 플로리나비치로 떠나볼텐가?");
	} else if (selection == 1) {
	    status = 2;
	    cm.sendYesNo("#b자유여행권#k을 가지고 있다는 건가? 그것만 가지고 있다면 언제든지 플로리나비치로 갈 수 있지. 좋아~ 하지만 그곳에도 몬스터가 있는 모양이니 준비하는 것을 잊지 말도록 하게나. 그럼 출항할 준비를 해야 겠군 그래. 자... 지금 당장 플로리나비치로 떠나볼텐가?");
	} else if (selection == 2) {
	    status = 4;
	    cm.sendNext("후후... #b자유여행권#k이 뭔지 궁금해진 모양이군 그래. 자유여행권은 가지고 있기만 하면 평생 무료로 언제든지 플로리나비치로 갈 수 있는 아이템이야. 워낙 특별한 티켓이라 우리들도 특별히 취급하고 있었는데 얼마전 휴가를 내고 지구방위본부라는 곳을 다녀오던 길에 잃어버렸지 뭔가.");
	}
    } else if (status == 2) {
	if (cm.getMeso() < 1500) {
	    cm.sendNext("메소가 부족한걸? 좀더 모아서 가져오라구~ 입구 있던걸 판다든지... 필드에서 몬스터를 쓰러뜨려 보던지... 방법은 여러가지가 있으니까 말야.");
	    cm.dispose();
	} else {
	    cm.gainMeso(-1500);
	    cm.saveLocation("FLORINA");
	    cm.warp(110000000, 0);
	    cm.dispose();
	}
    } else if (status == 3) {
	if (cm.haveItem(4031134)) {
	    cm.saveLocation("FLORINA");
	    cm.warp(110000000, 0);
	    cm.dispose();
	} else {
	    cm.sendNext("흐음... #b자유여행권#k이 어디에 있다는 건가? 분명히 가지고 있는거야? 다시 한 번 확인해 달라고.");
	    cm.dispose();
	}
    } else if (status == 4) {
	cm.sendNext("후후... #b자유여행권#k이 뭔지 궁금해진 모양이군 그래. 자유여행권은 가지고 있기만 하면 평생 무료로 언제든지 플로리나비치로 갈 수 있는 아이템이야. 워낙 특별한 티켓이라 우리들도 특별히 취급하고 있었는데 얼마전 휴가를 내고 지구방위본부라는 곳을 다녀오던 길에 잃어버렸지 뭔가.");
    } else if (status == 5) {
	cm.sendNextPrev("아쉽게도 결국 찾지 못하고 돌아오긴 했는데 여간 찜찜한게 아냐. 그곳에 있는 누군가가 잘 주워다 주었으면 좋겠지만 말야... 아무튼 뭐 대충 이런거고 자네가 지구방위본부로 가서 모험을 하다 보면 찾을 수도 있지 않을까? 설명은 여기까지라네. 궁금한 점이 있다면 언제든지 나에게 물어봐 주길 바라네.");
    } else if (status == 6) {
	cm.dispose();
    }
}