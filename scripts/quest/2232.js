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
 * Quest ID : 2232
 * Quest Name : 주니어를 등록해보자!
 * Quest Progress Info : 리더 알의 내준 과제는 간단했다! 바로 자신이 후원해주고 싶은 캐릭터가 있으면 주니어로 등록해 보라는 것이었다. 주니어를 한명 이상 등록하고 리더 알에게 보고하자.\n\n#r주니어 한명 이상 등록#k\n(패밀리 창[단축키 : F]에서 가계도열기 버튼을 눌러서 확인해 보자)
 * Quest End Info : 주니어 등록에 성공했다! 역시 내 리더쉽은... 후후훗.
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
        if (!qm.isQuestActive(2232)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        if (qm.getPlayer().getJunior1() > 0 || qm.getPlayer().getJunior2() > 0) {
            qm.sendNext("오! 자네가 후원해 줄 주니어를 찾았나보군. 정말 잘 했네!");
        } else {
            qm.sendOk("흐음, 아직 자네가 후원해 줄 주니어를 찾지 못한 모양이구만?");
            qm.dispose();
        }
    } else if (status == 1) {
        if (qm.getPlayer().getJunior1() > 0 && qm.getPlayer().getJunior2() > 0) {
            qm.sendNext("주니어를 두 명 모두 등록했군? 역시~ 자네는 내가 본 눈이 틀리지 않은 것 같군!");
        } else {
            qm.sendNext("주니어를 한 명만 등록했다면 다른 한 명도 어서 찾아보게. 당연히 한 명보다는 두 명이 낫지 않겠나?");
        }
    } else if (status == 2) {
        qm.sendNext("그럼, 좋은 엘더가 되어 주게나.");
    } else if (status == 3) {
        qm.showQuestCompleteEffect();
        qm.gainExp(2000);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}
