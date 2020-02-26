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
 * Quest ID : 3953
 * Quest Name : 무하마드 설득하기
 * Quest Progress Info : #p2100001#에게 가서 말을 걸자 그는 #o3220001#가 몬스터니 뭐니 하는 소리는 하지도 말라고 한다. 생각보다 반발이 심한데...? 그를 설득하려면 일단 기분을 풀어줘야 할 것 같다. #p2100001#가 좋아하는 #b#t4011008# 1개#k를 구해 가져가면 어떻게든 대화를 시도해 볼 수 있지 않을까?  \n\n#i4011008##t4011008# #b#c4011008#/1
 * Quest End Info : #p2100001#를 설득해 내었다! 고지식한 사람이라 힘들었지만, 어떻게든 된 것 같다. 좋아...! 이제 #p2101010#에게 가서 이 사실을 보고하자.
 * End NPC : 2100001
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
        if (!qm.isQuestActive(3953)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        qm.sendSimple("데우가 몬스터라는 헛소리를 할 거라면 들을 생각 없으니 어서 저리 비키게! ...응? 흠... 이건 리튬이 아닌가. 색을 보니 최상급 리튬인데... 상태도 훌륭하고... 응? 이걸 주겠다고? 허험... 리튬이라면 사양할 수 없지. 그래... 무슨 일인가?#b\r\n\r\n #L0#데우는 몬스터라는 사실을 꼭 알려드리고 싶습니다.#l\r\n\r\n #L1#사막을 이동하던 상단이 몬스터에게 공격받았다는 이야기를 들으셨나요?#l");
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendSimple("상단이? ...호위가 부족했던 모양이군. 버닝로드에는 크게 위험한 몬스터는 없지만 그래도 방심하면 안 되는 법인데... 사막은 항상 먼저 주의하는 수밖에 없다네.#b\r\n\r\n #L0#데우만 퇴치하면 이런 일은 없을 겁니다.#l\r\n\r\n #L1#이게 다 왕비가 마을 주변 치안에 너무 소홀한 탓이에요.#l");
        } else {
            qm.sendOk("데우는 몬스터가 아니라고 하지 않았나! 여기서 썩 꺼지게!");
            qm.dispose();
        }
    } else if (status == 2) {
        if (selection == 1) {
            qm.sendSimple("맞아! 왕비 때문이지! 그 여자가 온 이후로... 총명하던 압둘라 8세께서는 변해 버리고 아리안트는 점점 말라가고만 있어! 마치 오아시스가 마르는 것처럼! 다 그 여자 때문이야!#b\r\n\r\n #L1#왕비가 이렇게 폭정을 펼치는데, 사막의 수호신은 뭘 하는지 모르겠어요.#l\r\n\r\n #L0#빨리 군대를 모아 왕비의 압제에서 벗어나야 해요!#l");
        } else {
            qm.sendOk("데우에게 모든 죄를 뒤집어 씌우려는 겐가? 더 말할 필요가 없네. 여기서 썩 사라지게.");
            qm.dispose();
        }
    } else if (status == 3) {
        if (selection == 1) {
            qm.sendSimple("...그러게 말일세. 데우가 좀 더 힘을 내주었더라면 좋았을 것을. 수호신께선 야박하시기도 하지...#b\r\n\r\n #L1#그래서 말인데... 데우는 이미 몬스터가 되어 버린 거 아닐까요?#l\r\n\r\n #L0#데우는 몬스터일 뿐이니, 어쩔 수 없는 일이잖아요?#l");
        } else {
            qm.sendOk("쉿, 목소리를 낮추게. 누가 들을라. 그 생각은 아직은 위험한 것 같군. 사막의 수호신이 지금은 뭘 하는지..");
            qm.dispose();
        }
    } else if (status == 4) {
        if (selection == 1) {
            qm.sendOk("그래... 자네 말이 맞을지도 몰라. 아리안트가 이리 변하다니... 그건 필시 데우가 변해버린 탓일지도 모르지. 데우는 이미 몬스터가 되어 버린 걸지도... 젊은 사람들 말대로, 이젠 데우를 퇴치해야 할 때인가...");
            qm.forceCompleteQuest();
            qm.showQuestClear(3953);
            qm.showQuestCompleteEffect();
            qm.dispose();
        } else {
            qm.sendOk("사막의 수호신 데우를 몬스터로 의심하지 말게. 흐음.. 아쉽지만 더 할 얘기는 없어 보이는군.");
            qm.dispose();
        }
    }
}
