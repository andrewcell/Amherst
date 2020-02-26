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
 * Quest ID : 3354
 * Quest Name : 드랭의 약
 * Quest Progress Info : #p2111002#은 더 이상 그의 연구는 진척이 없다고 우울한 표정으로 말했다. 하지만 곧 그는 밝은 얼굴로 #p2111005#를 위해서 새로운 연구를 해냈으니 그것으로 만족한다는데... 뭐 #b#p2111005#를 위한 약#k이라고? 하지만 #p2111002#의 집에 더 숨겨진 것은 없었는데? \n\n일부러 숨겨 놓은 것이 아니라면 #p2111002#의 연구 결과는 이전에 #p2111002#의 집을 수색했던 알카드노 협회의 #b#p2111001##k가 알고 있을 것 같다.
 * Quest End Info : #p2111001#에게 #p2111002#의 이야기를 전하자 그는 무척 놀라는 것 같다. 
 * Start NPC : 2111002
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
        qm.sendNext("휴우... 더 이상 연구에 진척이 없습니다. 사실상 실험은 실패한 것이나 다름 없지요. 아무리 연구해도 원래의 기억을 다 갖춘 채로 인간의 육체를 기계로 바꾸는 것은 불가능하단 걸 알게 되었거든요... 하지만... 대신 더 좋은 걸 만들었답니다. ");
    } else if (status == 1) {
        qm.sendNext("그건 다름 아닌... 딸인 키니를 위한 약이지요. 키니는 선천적으로 몸이 약하답니다. 그저 원래 그런 것이라 생각했는데... 사실 그건 요정과 인간의 혼혈이기에 어쩔 수 없는 일이라더군요. 그래서 그 애를 위해 약을 개발했습니다. ");
    } else if (status == 2) {
        qm.askAcceptDecline("후후.. 정말 뿌듯하군요. 인간을 기계로 만들어 수명을 늘리는 연구는 실패해 버렸지만... 요정처럼 영원히 살지는 못하더라도 그 이상의 행복을 찾을 수 있으리란 생각이 듭니다... 아, 이만 연구를 마무리해야겠군요. 폭발물이 많아 위험하니 당신을 이 연구실에서 추방하겠습니다")
    } else if (status == 3) {
        if (selection == 0) {
            qm.sendOk("아직 실험이 완전히 끝난 것은 아닙니다. 위험한 실험 도구가 많으니 자리를 피해 주십시오.")
        } else {
            qm.forceStartQuest(3354);
            qm.warp(261020401, 0);
        }
        qm.dispose();
    }
}
