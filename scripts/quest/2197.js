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
 * Quest ID : 2197
 * Quest Name : 몬스터북 영업사원 티앤크
 * Quest Progress Info : #m104000000#에 도착하자마자 말을 거는 시끄러운 영업사원 #b#p0002006##k를 찾아가보자.
 * Quest End Info : 영업사원 #b#p0002006##k와 #b몬스터북#k에 대해 이야기를 나누었다.
 * End NPC : 2006
 * 
 * @author T-Sun
 *
 */

var status = -1;

function end(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (!qm.isQuestActive(2197)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        qm.sendNext("안녕하세요~ 잘 찾아오셨습니다. 언제나 좋은 물건만을 여러분에게 추천해 드리는 티앤크입니다. 오늘 소개해 드릴 물건은 바로바로 #b몬스터북#k입니다!! 몬스터북에 대해서 들어보신적이 있나요? 몬스터북은 정말 정말 편리한 물건이지요. 지금부터 왜 몬스터북을 살 수 밖에 없는지 그 이유에 대해서 설명해 드리도록 하겠습니다.");
    } else if (status == 1) {
        qm.sendNext("몬스터북은 몬스터로부터 드물게 얻을 수 있는 #b몬스터 카드#k를 수집해 놓는 책입니다. 그렇다면 몬스터 카드를 모음으로 해서 어떤 이점을 얻을 수 있느냐~");
    } else if (status == 2) {
        qm.sendNext("첫째로, 몬스터 카드를 몬스터북에 한 장씩 수집할 때마다 카드에 걸려있는 특별한 버프를 받을 수 있는데, 각종 상태이상에 대한 내성이나 명중률, 회피율 등의 효과를 얻을 수 있답니다. 하지만 안타깝게도 이 특별한 버프는 30레벨 이상의 몬스터에게만 얻을 수 있습니다.");
    } else if (status == 3) {
        qm.sendNext("둘째로, 몬스터북에 걸린 #b지정몬스터 사냥#k 마법의 효과를 얻을 수 있습니다. 몬스터북에는 1종류의 카드를 최대 5장까지 등록 시킬 수 있는데 카드 5장을 모두 모으면 몬스터북에 걸린 마법이 활성화되면서 해당 몬스터를 잡을 때 1시간 동안 추가 경험치를 얻을 수 있게 되죠. 정말 놀랍지 않나요?");
    } else if (status == 4) {
        qm.sendNext("마지막으로 몬스터북에 몬스터 카드를 수집해 놓으면 수집한 몬스터에 대한 기본 정보와 전리품, 출몰지역등에 대한 정보를 손 쉽게 얻을 수 있답니다. 정말 매력적인 장점이지요?");
    } else if (status == 5) {
        qm.sendNext("이 모든 혜택을 단 돈 10만 메소에 제공해... 어라? 이미 몬스터북을 구입한 분이셨군요. 진작에 이야기 하시지 그러셨어요~ 아직 한 번도 열어보시지 않은 건가요? #b단축키B#k를 이용해서 손 쉽게 열어보실 수 있답니다. 이거 제가 괜히 시간을 뺏으면서 장황하게 설명을 늘어놓은 것 같군요.");
    } else if (status == 6) {
        qm.sendNext("아직 몬스터 카드를 한 개도 모으지 못하셨군요. 앞으로 몬스터북을 유용하게 사용하시고, 문의사항이 있으면 언제라도 절 찾아와 주세요. 언제나 친절한 영업사원 티앤크였습니다! 오늘도 좋은 하루 되세요~ 아차차! 그리고 이건 사은품이에요. 나중에 저를 다시 찾아오실 때 필요하실 거에요.");
    } else if (status == 7) {
        qm.gainItem(2030001, 3);
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    } 
}
