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

//Quest Name : 작전 3단계 : 귀여운 아기새 / Quest End Data : 3000

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
        qm.sendNext("우왓! 이 녀석은 먹였고, 이 녀석도 먹였고, 이 녀석도 먹였던가? 아냐! 3번 녀석은 안 먹였어! 자, 어서 먹이를 먹어랏! 휴우~ 다들 입을 벌리고 있으니 어느 녀석이 배가 고픈지 모르겠네... 아, 왔어?")
    } else if (status == 1) {
        qm.sendNext("휴우... 바빠서 정신이 하나도 없어. 얼마 전에 연구원들이 말하길, #o5220003#는 파풀라투스의 지배를 받아 변해 버렸을 뿐 잘만 기르면 사람을 잘 따르는 귀여운 새가 된다지 뭐야. 그래서 한가한 틈을 타서 새를 기르기로 했어.")
    } else if (status == 2) {
        qm.sendYesNo("그런데 이거... 한 두마리도 아니고, 열 마리를 동시에 기르려니 무진장 피곤해... 먹이 구하는 것도 쉽지 않고... 뭐, 그래도 귀엽긴 하지만. 너도 한 마리 길러볼래? 분양해 줄게.");
    } else if (status == 3) {
        if (selection == 1) {
            qm.sendNext("#o5220003#는 다른 세계의 생물이라, 다 기르면 원래 세계로 돌려보내줘야 해. 그러니 #o5220003#가 #b완전히 자라거든 다시 데려다 줘#k. 그럼 부탁할게.");
        } else {
            qm.sendOk("흠... 동물은 별로 좋아하지 않는 모양이구나. 이렇게 귀여운데... 이 녀석들에게라면 햄버거도 양보해 줄 수 있다구.");
            qm.dispose();
        }
    } else if (status == 4) {
        qm.gainItem(4220046, 1);
        qm.forceStartQuest(7067, "0");
        qm.forceStartQuest();
        qm.dispose();
    }
}

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
        var qr = qm.getQuestRecord(7067);
        if (qr.getCustomData().equals("3000")) {
            qm.sendNext("어때? 타이머 기르는 건 재미있어?");
        } else {
            qm.sendOk("아직 타이머를 다 못키운거야? 시계탑 몬스터들을 사냥하면 나오는 태엽벌레를 타이머에게 먹여봐.");
            qm.dispose();
        }
    } else if (status == 1) {
        var file = "#fUI/UIWindow.img/QuestIcon/";
        qm.sendNext("응? 타이머가 벌써 다 자라 버렸다고? 헉... 태엽벌레를 열심히 먹인 모양이구나... 그럼 이제 그만 타이머를 돌려줘. 이제 그만 녀석을 원래세계로 보내줘야지...\r\n\r\n"+file+"4/0#\r\n\r\n"+file+"6/0# 11");
    } else if (status == 2) {
        qm.gainPop(11);
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainItem(4220046, -1);
        qm.sendOk("아쉽기는 하지만 이 녀석들은 원래 다른 차원의 생물이니까 원래 세계가 녀석들에게 살기 좋을거야.");
        qm.dispose();
    }
}
