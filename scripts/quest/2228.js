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
 * Quest ID : 2228
 * Quest Name : 리프의 감사
 * Quest Progress Info : 전보다 훨씬 편안해진 얼굴로 #p1032108#프는 고맙다고 말했다.
 * Quest End Info : 전보다 훨씬 편안해진 얼굴로 #p1032108#는 고맙다고 말했다.
 * Start NPC : 1032108
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
        qm.sendNext("저주의 기운이 끊어진 것을 느꼈어... 파우스트를 퇴치해 준 건 역시 너겠지? 정말 고마워... 이젠 정말 마음이 가벼워졌어. 모두 네 덕분이야.");
    } else if (status == 1) {
        qm.sendNext("더 이상 과거에 연연해하지 않겠어. 유령에 불과하지만, 그래도 아직 뭔가 더 좋은 일을 할 수 있을 거라 믿어. 예를 들어... 이 숲을 정화할 방법을 찾아보는 것도 괜찮지 않을까?")
    } else if (status == 2) {
        qm.gainPop(3);
        qm.forceStartQuest();
        qm.forceCompleteQuest();
        qm.showQuestCompleteEffect();
        qm.dispose();
    }
}
