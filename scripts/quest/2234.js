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
 * Quest ID : 2234
 * Quest Name : 이름난 모험가의 특권을 누려보자!
 * Quest Progress Info : 이번 과제는 바로 #r이름난 모험가의 특권#k을 맛보는 것이다! #b리더 알#k의 주문은 특권을 사용해 #r현재 명성도를 500까지 소비#k해보라는 것이었다. 게다가 명성도를 충분히 쌓았는지 확인해 보기 위해 총 명성도를 2,000까지 만들라고 했지? 목표를 달성하면 리더 알에게 돌아가자.\n\n#r총 명성도 2,000 이상\n현재 명성도 500 이하#k\n(패밀리 창을 열어 현재 명성도와 총 명성도를 확인해 보자)
 * Quest End Info : 리더 알은 모든 과제를 훌륭히 수행한 내게 훌륭한 엘더가 될 자질이 충분하다며 치켜세워 주었다. 그리고 주니어를 비롯한 패밀리원들을 잘 이끌어주는 것이 가장 중요하다고 재차 강조하였다. 앞으로도 패밀리에 관해 궁금한 것이 있으면 리더 엘에게 가서 물어보도록 하자. 자, 그럼... 나도 남 부럽지 않은 패밀리를 만들도록 노력해 볼까?
 * End NPC : -1
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
        if (!qm.isQuestActive(2234)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        
        if (qm.getPlayer().getTotalRep() >= 2000 && qm.getPlayer().getCurrentRep() <= 500) {
            qm.sendNext("드디어 자네도 #b이름난 모험가의 특권#k을 맛보았는가? 후후훗, 남은 명성도를 보니 충분히 맛을 본 모양이군. 그나저나 이렇게 빠른 시간 내에 이 정도까지 해잴 줄은.. 정말 자네의 리더쉽은 타고난 듯 싶네.")
        } else {
            qm.sendOk("흐음, 아직 #b이름난 모험가의 특권#k을 제대로 맛보지 못했는가? 총 명성도를 2,000 이상 만들고, 현재 명성도를 500 이하로 만들면 되네.");
            qm.dispose();
        } 
    } else if (status == 1) {
        qm.sendNext("그럼, 앞으로도 좋은 엘더가 되어 주게나. 패밀리에 대해 궁금한 점이 있거나 칭호에 관심이 생긴다면 언제든지 나를 찾아오게.");
    } else if (status == 2) {
        qm.showQuestCompleteEffect();
        qm.gainExp(3000);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
