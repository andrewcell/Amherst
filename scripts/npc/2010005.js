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
 * NPCID : 2010005
 * ScriptName : florina2
 * NPCNameFunc : 슈리 - 여행가이드
 * Location : 200000000 (스카이로드 - 오르비스)
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
	    cm.sendNext("플로리나 비치로 여행을 떠나보고 싶지는 않은가요? 빅토리아 아일랜드 가까운 곳에는 플로리나 비치라는 환상적인 해변이 있답니다.");
	    cm.dispose();
	    return;
	}
	status--;
    }
    if (status == 0) {
	cm.sendSimple("플로리나 비치로 여행을 떠나보고 싶지는 않은가요? 빅토리아 아일랜드 가까운 곳에는 #b플로리나 비치#k라는 환상적인 해변이 있답니다. #b1500 메소#k를 내거나 #b자유여행권#k이 있다면 언제든지 저를 통해 그곳으로 갈 수 있답니다.\r\n\r\n#L0# #b1500 메소#k를 내겠습니다.#l\r\n#L1# #b자유여행권#k을 가지고 있습니다.#l\r\n#L2# #b자유여행권#k이 뭔가요?#l");
    } else if (status == 1) {
	if (selection == 0) {
	    cm.sendYesNo("#b1500 메소#k를 내고 플로리나비치로 가겠다는 건가요? 좋아요~ 하지만 그곳에도 몬스터가 있는 모양이니 준비하는 것을 잊지 말도록 하세요. 그럼 출항할 준비를 해야 겠군요. 자... 지금 당장 플로리나비치로 떠나보겠어요?");
	} else if (selection == 1) {
	    status = 2;
	    cm.sendYesNo("#b자유여행권#k을 가지고 있나요? 그것만 가지고 있다면 언제든지 플로리나비치로 갈 수 있지요. 좋아요~ 하지만 그곳에도 몬스터가 있는 모양이니 준비하는 것을 잊지 말도록 하세요. 그럼 출항할 준비를 해야 겠군 그래요. 자... 지금 당장 플로리나비치로 떠나보겠어요?");
	} else if (selection == 2) {
	    status = 4;
	    cm.sendNext("자유여행권은 가지고 있기만 하면 평생 무료로 언제든지 플로리나비치로 갈 수 있는 아이템이랍니다. 워낙 특별한 티켓이라 우리들도 특별히 취급하고 있었는데 얼마전 휴가를 내고 지구방위본부라는 곳을 다녀오던 길에 잃어버렸답니다..");
	}
    } else if (status == 2) {
	if (cm.getMeso() < 1500) {
	    cm.sendNext("메소가 부족해요. 좀더 모아서 다시 오세요~ 필드에서 몬스터를 쓰러뜨려 보던지... 방법은 여러가지가 있답니다.");
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
	    cm.sendNext("음... #b자유여행권#k은 분명 제대로 갖고 계신건가요?");
	    cm.dispose();
	}
    } else if (status == 4) {
	cm.sendNext("자유여행권은 가지고 있기만 하면 평생 무료로 언제든지 플로리나비치로 갈 수 있는 아이템이랍니다. 워낙 특별한 티켓이라 우리들도 특별히 취급하고 있었는데 얼마전 휴가를 내고 지구방위본부라는 곳을 다녀오던 길에 잃어버렸답니다..");
    } else if (status == 5) {
	cm.sendNextPrev("아쉽게도 결국 찾지 못하고 돌아오긴 했답니다.. 만약 그곳에 있는 누군가가 잘 주워다 주었으면 좋겠지만 말이에요... 음.. 당신이 지구방위본부로 가서 모험을 하다 보면 찾을 수도 있지 않을까요? 설명은 여기까지랍니다. 궁금한 점이 있다면 언제든지 제게 물어봐 주세요.");
    } else if (status == 6) {
	cm.dispose();
    }
}