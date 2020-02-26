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
 * NPCID : 1040001
 * ScriptName : mike
 * NPCNameFunc : 마이크
 * Location : 106000300 (워닝스트리트 - 페리온던전입구)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else if (type == 0 && mode == 0) {
            status--;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        val = cm.getQuestStatus(2048);
        var str = "흐음.. 이곳은 빅토리아 아일랜드 중앙 던전으로 들어가는 입구지.. 조심하라구..";
        if (val == 1 && cm.getJob() != 0 && cm.getPlayerStat("LVL") > 44) {
            cm.sendNext(str);
        } else {
            cm.sendOk(str);
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendNextPrev("흠.. #b#t4021009##k, #b#t4003002##k, #b#t4001005##k, #b#t4001006##k 재료를 얻고싶다고? 나는 경비로 일하기 전에 이 섬에 대해 약간의 공부를 했었지.")
    } else if (status == 2) {
        cm.sendNextPrev("#b#t4021009##k과 #b#t4003002##k은 아마 #m101000000#에 사는 요정이 뭔가 알고있을거야. 만약 요정이 있다면 #t4003002# 재료는 구할 수 있을거야.")
    } else if (status == 3) {
        cm.sendNextPrev("#b#t4001005##k와 #b#t4001006##k이 문제인데.. 우선 #b#t4001005##k는 골렘에게 구할 수 있지 않을까?")
    } else if (status == 4) {
        cm.sendPrev("#b#t4001006##k은.. 깃털 처럼 생긴 불꽃.. 그렇다면 불 속성의 드레이크 에게서 구할 수 있지 않을까? 그렇다면 #t4001006# 구하는 건 힘들지도 모르겠는걸...  어쨌든! 행운을 빌어!")
    } else if (status == 5) {
        cm.dispose();
    }
}