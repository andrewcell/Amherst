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
 * NPCID : 9040002
 * ScriptName : guildquest1_comment
 * NPCNameFunc : 샨
 * Location : 101030104 (빅토리아로드 - 유적발굴단 캠프)
 * 
 * @author T-Sun
 *
 */

var status=0;
var selectedOption;

function start() {
    selectedOption = -1;
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {

		
        if (mode == 1 && status != 2)
            status++;
        else if (mode == 1 && status == 2) {
            status = 0;
        } else if (mode == -1 ){
            cm.dispose();
            return;
        } else if (mode == 0 && type == 4) {
            cm.dispose();
            return;
        } else if (mode == 0) {
            status--;
        }
        if (status == 0) {
            var prompt = "\r\n#b#L0# 샤레니안이 뭐죠?#l\r\n#b#L1# 루비안이라니요?#l\r\n#b#L2# 길드 대항전이요?#l\r\n#b#L3# 아뇨, 괜찮습니다.#l";
            if (selectedOption == -1) {
                prompt = "우리 길드 연합회는 오래 전부터 고대의 유물 '에메랄드 타블렛'을 해독하려 노력했지. 그 결과, 우리는 이곳에 고대의 신비 사레니안이 잠들어 있다는 것을 알아냈네. 그리고 전설 속의 보석인 루비안에 대한 단서가 샤레니안의 유적 속에 있다는 것도 알아냈다네. 그래서 길드 연합회는 루비안을 찾기위해 길드대항전을 개최하게 되었네." + prompt;
            } else {
                prompt = "더 물어볼 것이 있는가?\r\n"+prompt;
                        	
            }
            cm.sendSimple(prompt);
        } 
        else if (status == 1) {
            selectedOption = selection;
            if (selectedOption == 0) {
                cm.sendNext("샤레니안은 빅토리아 아일랜드 전역을 지배했던 고대 문명 국가라네. 골렘의 사원이나 던전 깊은 곳의 신전같이 누가 지은 지 모를 고대 건축물들이 모두 샤레니안의 유적지이지.");
            }
            else if (selectedOption == 1) {
                cm.sendNext("루비안은 영원한 젊음을 가지게 해준다는 전설 속의 보석이라네. 루비안을 가진 자는 모두가 몰락했다고 하니, 샤레니안의 멸망은 이것과 관련이 있을 것 같군.");
                status = -1;
            }
            else if (selectedOption == 2) {
                cm.sendNext("그동안 샤레니안에 여러 번 탐사대를 보냈지. 하지만 아무도 돌아오지 못했다네. 그래서 우리는 이번 길드대항전을 개최하게 된 것일세. 그동안 단단히 힘을 길러오던 자네들 같은 길드를 믿고 말일세.");
            }
            else if (selectedOption == 3) {
                cm.sendOk("그런가? 언제라도 궁금한 것이 있으면 물어보게나.");
                cm.dispose();
            }
            else {
                cm.dispose();
            }
        }
        else if (status == 2) { //should only be available for options 0 and 2
            if (selectedOption == 0) {
                cm.sendNextPrev("샤레니안의 미자막 왕은 샤렌 3세라는 인물이었는데, 그는 매우 지혜롭고 인자했다고 하네. 그런데 어느 날 갑자기 멸망해 버렸고, 그 이유는 밝혀지지 않았다네.");
            }
            else if (selectedOption == 2) {
                cm.sendNextPrev("샤레니안을 탐험하고 루비안을 찾아내는 것이 이번 길드대항전의 목표일세. 강하기만 해서는 해낼 수 없는 임무라네. 동료들과 협동하는 것이 가장 중요하지.");
            }
            else {
                cm.dispose();
            }
        }
    }
}
