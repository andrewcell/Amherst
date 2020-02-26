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
 * Quest ID : 2186
 * Quest Name : 안경을 찾아줘
 * Quest Progress Info : 안경을 잃어버린 아벨은 앞에 전혀 보이지 않는다고 한다. 낮잠 자는 사이에 펠리컨들이 집어가버렸다니… 아벨이 앞을 볼 수 있도록 갈매기들이 모여있는 노틸러스호 선착장 동쪽 끝에 있는 #b감시탑#k의 풀 숲을 뒤져서 안경을 찾아보자. #b아벨의 안경#k은 검은 뿔테라는 것도 잊지 말고! \n\n#i4031853##t4031853# #b#c4031853##k / 1
 * Quest End Info : 오~ 내가 찾아온 안경을 쓰고 좋아하는 아벨. 엇? 그런데 너무 다른 사람인데? 안경의 힘인가?
 * End NPC : 1094001
 * 
 * @author T-Sun
 *
 */

// 4/0 : 획득!!  
// 5/0 : ? 박스  
// 6/0 : 인기도  
// 7/0 : 메소  
// 8/0 : 경험치  
// 8/0 : 친밀도  


var status = -1;
var haveDiffGlass = 0;

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
        if (!qm.isQuestActive(2186)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        if (!qm.haveItem(4031853, 1)) {
            qm.dispose();
            return;
        }
        if (qm.haveItem(4031854, 1)) {
            haveDiffGlass++;
        }
        if (qm.haveItem(4031855, 1)) {
            haveDiffGlass++;
        }
        var str = "앗! 제 안경을 찾으셨다고요? 한번 써볼까요? 제 안경이 아닐 수도 있으니 직접 써보는 방법 말고는 구분할 수 없어요.";
        if (haveDiffGlass == 0) {
            str += "제 안경이 맞군요. 감사합니다.\r\n\r\n";
            str += "#fUI/UIWindow.img/QuestIcon/4/0#\r\n"
            str += "#i2030019# #t2030019# 5개\r\n\r\n"
            str += "#fUI/UIWindow.img/QuestIcon/8/0# 1000 exp\r\n"
        } else if (haveDiffGlass == 1) {
            str += "어라? 손에 들고 계신 또 다른 안경은 무엇인가요? 어? 그 안경도 제게 주시지 않으시겠어요? 보상은 해드릴게요. 후후, 기분에 따라서 안경을 바꿔서 써보기도 해야겠어요.\r\n\r\n";
            str += "#fUI/UIWindow.img/QuestIcon/4/0#\r\n"
            str += "#i2030019# #t2030019# 15개\r\n\r\n"
            str += "#fUI/UIWindow.img/QuestIcon/8/0# 1500 exp\r\n"
        } else if (haveDiffGlass == 2) {
            str += "어라? 손에 들고 계신 또 다른 안경들은 무엇인가요? 어? 그 안경들도 제게 주시지 않으시겠어요? 보상은 해드릴게요. 후후, 기분에 따라서 안경들을 바꿔서 써보기도 해야겠어요.\r\n\r\n";
            str += "#fUI/UIWindow.img/QuestIcon/4/0#\r\n"
            str += "#i2030019# #t2030019# 30개\r\n\r\n"
            str += "#fUI/UIWindow.img/QuestIcon/8/0# 2000 exp\r\n"
        }
        qm.sendNext(str);
    } else if (status == 1) {
        qm.sendNext("후후훗... 다시 낚시를 즐겨 볼까요?");
    } else if (status == 2) {
        if (haveDiffGlass == 0) {
            qm.gainItem(2030019, 5);
            qm.gainExp(1000);
        } else if (haveDiffGlass == 1) {
            qm.gainItem(2030019, 15);
            qm.gainExp(2000);
        } else if (haveDiffGlass == 2) {
            qm.gainItem(2030019, 30);
            qm.gainExp(2000);
        }
        qm.removeAll(4031853);
        qm.removeAll(4031854);
        qm.removeAll(4031855);
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.showNpcSpecialEffect("quest");
        qm.dispose();
    }
}
