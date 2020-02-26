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
 * Quest ID : 6036
 * Quest Name : 뜻밖의 결과
 * Quest Progress Info : 스탠이 버린 그 종이에는 황금모루를 만들 수 있는 제조법이 적혀있었다. 황금모루라...왠지 거창한것이 멋질것 같다. 스탠은 귀찮아 하지만 내가 한번 만들어 보는 것이 좋겠다.\n\n#i4031980# #t4031980# #b#c4031980# / 1
 * Quest End Info : 황금모루를 만들어서 스탠에게 가져다 주었다. 스탠은 정말 굉장한 솜씨라면서 나를 제작 마스터로 인정했다.
 * End NPC : 2110004
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
        if (!qm.isQuestActive(6036)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        file = "#fUI/UIWindow.img/QuestIcon/";
        qm.sendYesNo("엇! 자네! 이걸 정말 자네가 만들었단 말인가! 이건 내가 그렇게 만들고 싶어하던 황금모루!! 이걸 나에게 주지 않겠나?\r\n\r\n" + file + "4/0#\r\n\r\n#fSkill/000.img/skill/0001007/icon# #q1007# (레벨 3)\r\n\r\n" + file + "8/0# 960000 exp");
    } else if (status == 1) {
        if (selection == 1) {
            qm.sendOk("이거 정말 굉장하군 굉장해! 고맙네. 고마워. 이런 물건까지 만들어내다니 이제 더 이상 내가 가르칠 게 없겠군. 자네를 제작 마스터로 인정하지! 하하!!")
            qm.gainItem(4031980, -1);
            qm.teachSkill(1007, 3);
            qm.gainExp(960000);
            qm.showQuestCompleteEffect();
            qm.forceCompleteQuest();
        }
        qm.dispose();
    }
}
