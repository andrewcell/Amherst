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
 * Quest ID : 3353
 * Quest Name : 드랭이 바라는 것
 * Quest Progress Info : 예전에 보았던 과거의 #p2111002#에 대해 묻자 파웬은 밝은 얼굴로 또 다시 #p2111002#에게 보내주었다. 그는 아무래도 예전에 보았던 #p2111002#보다 약간 더 시간이 흐른 후의 #p2111002# 같은데... 
 * Quest End Info : 피로해 보이는 #p2111002#에게 말을 걸어 보았다. 지친 얼굴이지만 묘하게도 약간 뿌듯한 웃음을 띄고 있는 #p2111002#은, 그의 실험은 실패했지만 대신 #p2111005#를 위한 약을 만드는데는 성공했다고 말했다... 
 * Start NPC : 2111006
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
        qm.sendNext("호오~ 친절한 모험가 친구! 왔는가? 오랜만이지? 자네가 정말정말 보고 싶었다네! 왜냐고? 후후후후... 전에 자네가 물어봤던 것에 대해 알아냈거든! 그, 왜 있잖은가. 그 성격 어두운 연금술사의 사념 말이야.");
    }  else if (status == 1) {
        qm.askAcceptDecline("그 사람의 또 다른 사념의 흔적을 알아냈거든. 자네가 관심이 있는 것 같아서 열심히 찾아봤지. 후후후... 자, 그럼 어서 그에게 그에게 가보게");
    } else if (status == 2) {
        if (selection == 0 )
            qm.sendOk("엥? 싫은가? 자네가 싫다면 하는 수 없지만... 자네가 관심 있어 하는 것 같아서 일부러 고생고생해서 알아놨는데 파웬의 호의를 이리도 무시하다니... 훌쩍훌쩍.")
        else {
            qm.forceStartQuest();
            qm.warp(926120200);
        }
        qm.dispose();
    }
}
