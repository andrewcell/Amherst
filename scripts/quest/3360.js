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
 * Quest ID : 3360
 * Quest Name : 비밀번호 인증
 * Quest Progress Info : #p2111006#은 자유롭게 비밀통로를 오갈 수 있는 번호라며 길고 복잡한 마스터키를 말해 주었다. 으으... 어려워서 까먹을 것 같으니 어딘가에 적어 두자. 
 * Quest End Info : #p2111006#이 말한대로 마스터키를 말하자 비밀통로가 열렸다. 이제부터 자유롭게 비밀통로를 이용할 수 있는 것 같다. 흐음... 의외로 도움이 될 때도 있는 수다쟁이로군.
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
        qm.sendNext("오! 자네 왔는가? 마침 잘 왔네. 자네를 위해 이 파웬이 비밀통로를 출입할 수 있게 해줄 마스터키를 알아냈다네! 하하하하! 굉장하지 않은가? 어서 굉장하다고 말하게!");
    } else if (status == 1) {
        qm.askAcceptDecline("자아. 키가 굉장히 길고 복잡하니 잘 기억해 두길 바라겠네. 한 번만 말할 테니 어딘가에 적어 두라고. 준비 되었나?");
    } else if (status == 2) {
        if (selection == 0) {
            qm.sendOk("빨리 빨리. 외울자신이 없으면 펜이라도 꺼내라고!");
            qm.dispose();
        } else {
            var key = qm.shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ").substring(0, 10);
            qm.forceStartQuest(7061, key);
            qm.forceStartQuest(7062, "00");
            qm.forceStartQuest("0");
            qm.sendOk("키번호는 #b" + key + "#k이네. 잊지 않았겠지? 이 키를 비밀통로 입구에 입력하면 비밀통로를 자유롭게 이용할 수 있을 거야. ");
            qm.dispose();
        }
    }
}
