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
 * Quest ID : 3108
 * Quest Name : 스노우맨의 분노-단서 발견
 * Quest Progress Info : 얼음으로 만들어진 이상한 조각상을 발견했다. 그 조각상은 반쯤 부서져 형체를 알아볼 수 없게 되어있는데... 아마도 눈의 정령 조각상인 것 같다. 
 * Quest End Info : 설원 깊은 곳에서 부서진 눈의 정령 조각상을 발견했다. 스카두르가 말한 단서라는 것이 이것일까? 왠지 스노우맨과 관련 있어 보이는데... 스카두르에게 돌아가자.
 * Start NPC : 2020012
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start(mode, type, selection) {
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
        qm.sendNext("(조각상은 한 눈에 봐도 눈이 부실정도로 아름답다. 얼음으로 만들어진 것 같이 투명하지만 얼음은 아닌 것 같다. 조각상 주위를 돌며 자세히 살펴보았다.)");
    } else if (status == 1) {
        qm.sendNext("(조각상의 한쪽이 부셔져 있다. 주위에는 커다란 발자국도 몇 개 보인다.)")
    } else if (status == 2) {
        qm.gainExp(200);
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
