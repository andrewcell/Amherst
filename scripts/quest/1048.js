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
 * Quest ID : 1048
 * Quest Name : 직업 추천
 * Quest Progress Info : 아직 익숙하지 않은 내게 운영자님께서 직접 직업을 추천해주셨다.
 * Quest End Info : 아직 익숙하지 않은 내게 운영자님께서 직접 직업을 추천해주셨다.
 * Start NPC : 9010000
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
        score = 0;
        qm.sendSimple("안녕하세요? #b#h0##k님. 이제 곧 전직을 하게 되셨네요. 제가 #b#h0##k님에게 좋은 직업을 추천해 드리기 위해서 몇 가지 알아야 할 점이 있어서 질문을 드리려고 합니다. #b혹시 메이플스토리 세계를 처음 접해보셨나요?\r\n #L0#네. 처음이에요.#l\r\n #L1#몇 번 해보긴 했지만 아직 잘 모르겠어요.#l\r\n #L2#조금은 익숙해진 것 같아요.#l\r\n #L3#이미 모든 걸 다 알고 있어요.#l");
    } else if (status == 1) {
        var str="";
        if (selection == 0) {
            str += "메이플스토리를 처음 접하셨군요.";
            score += 1;
        } else if (selection == 1) {
            str += "메이플스토리를 몇번 해 보신 경험이 있으시군요.";
            score += 3;
        } else if (selection == 2) {
            str += "메이플스토리를 몇번 해 보신 경험이 있으시군요.";
            score += 5;
        } else {
            str += "메이플스토리를 오랫동안 즐겨주셨군요.";
            score += 7;
        }
        str += " 앞으로 게임을 진행하시면 다양한 경험을 하실 수 있을 거에요. 좋은 일도 많지만 간혹 힘든 일이 생길수도 있어요. 혹시 #b게임을 진행하다가 어려운 일이 생겼다면 어떻게 하시겠어요?\r\n #L0#전 스스로 다 해결할 수 있어요.#l\r\n #L1#세상은 도우면서 사는 것 아닌가요?#l\r\n #L2#도움을 청하고 싶지만 수줍음을 많이 타서...#l";
        qm.sendSimple(str);
    } else if (status == 2) {
        var str="";
        if (selection == 0) {
            str += "어려운 일은 스스로 해결하는 것을 좋아하시나봐요.";
            score += 1;
        } else if (selection == 1) {
            str += "그렇죠. 어려운 일이 생기면 서로 돕는것이 좋지요.";
            score += 3;
        } else {
            str += "어려운 일일수록 부탁하기가 조금 부담스러운 경우가 많지요.";
            score += 5;
        }
        str += " 이곳 저곳 여행을 하다보면 종종 몬스터가 나타난답니다. #b몬스터가 나타난다면 어떻게 하시겠어요?\r\n #L0#몬스터를 피해서 멀리 도망갈 거에요.#l\r\n #L1#멀리서 동료들을 도와 공격할 거에요.#l\r\n #L2#피하지 않고 싸울거에요.#l";
        qm.sendSimple(str);
    } else if (status == 3) {
        var str="";
        if (selection == 0) {
            score += 1;
            str += "가끔은 몬스터를 피하고 싶을 때도 있답니다.";
        } else if (selection == 1) {
            str += "몬스터를 공격할 때는 물약을 잊지 말고 꼭 챙기세요.";
            score += 3;
        } else {
            str += "몬스터를 공격할 때는 물약을 잊지 말고 꼭 챙기세요.";
            score += 5;
        }
        str += " 이제 곧 전직을 하시게 됩니다. 전직을 하고 나면 다양한 스킬을 사용하실 수 있어요. 많은 스킬 중에 #b어떤 스킬을 좋아하세요?\r\n #L0#화려하고 멋있는 스킬이 최고죠.#l\r\n #L1#무조건 강력한 스킬이 좋아요.#l\r\n #L2#별 관심 없어요.#l";
        qm.sendSimple(str);
    } else if (status == 4) {
        if (selection == 0) {
            score += 1;
        } else if (selection == 1) {
            score += 3;
        } else {
            score += 5;
        }
        var job = "마법사";
        if (score <= 5) {
            job = "마법사";
            qm.forceStartQuest(7631, "200");
        } else if (score <= 9) {
            job = "전사";
            qm.forceStartQuest(7631, "100");
        } else if (score <= 13) {
            job = "도적";
            qm.forceStartQuest(7631, "400");
        } else if (score <= 17) {
            job = "궁수";
            qm.forceStartQuest(7631, "300");
        } else if (score <= 22) {
            job = "해적";
            qm.forceStartQuest(7631, "500");
        }
        var str = "질문에 답해주셔서 감사합니다. #b#h0##k님에게 추천해 드릴 직업은 " + job + " 입니다. 전직 후 더 강한 모습으로 뵈었으면 합니다.";
        //마법사 : 4
        //전사 : 7
        //도적 : 8
        //궁수 : 9
        //해적 : 11
        qm.sendOk(str);
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
