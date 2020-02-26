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
 * Quest ID : 2150
 * Quest Name : 소문의 진상-이얀
 * Quest Progress Info : 친절해 보이는 #b#p1022007##k에게 소문에 대해서 물어보자.
 * Quest End Info : #p1022007#에게 떠도는 소문에 대해 물어보았다.
 * Start NPC : 1022007
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
        qm.sendSimple("안녕하세요 여행자님 오늘은 무슨 일로 오셨나요? \r\n#b #L0#귀신나무에 대해 알고 있니?#l");
    } else if (status == 1) {
        qm.sendSimple("어머! 그 소문을 들으신거에요? 얼마 전에 헤네시스의 카밀라가 엄마 심부름으로 페리온에 왔다가 돌아가는 길에 귀신을 봤대요.\r\n#b #L0#정말이니?#l");
    } else if (status == 2) {
        qm.sendNext("밤 늦게 헤네시스로 돌아가는 길이었는데 어둠속에서 나무줄기를 밟은 것 같아서 주위를 둘러보는데 희번덕거리는 눈이 카밀라를 잡아먹을 것처럼 쳐다봤다고 하더라구요.");
    } else if (status == 3) {
        qm.sendNext("카밀라는 너무 무서워서 그대로 기절하고 말았대요. 날이 밝은 뒤에 어른들이 그 자리에 다시 가봤는데 아무 것도 없었대요. 귀신이 분명한 것 같아요. 어쩌죠? 이제 무서워서 마을 밖에 나갈 수가 없을 것 같아요.");
    } else if (status == 4) {
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.gainExp(100);
        qm.dispose();
    }
}
