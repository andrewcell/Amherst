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
 * NPCID : 2111003
 * ScriptName : snow_rose
 * NPCNameFunc : 휴머노이드 A
 * Location : 261000000 (선셋로드 - 마가티아)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.isQuestActive(3335)) {
            if (cm.haveItem(4031695, 1)) {
                cm.sendOk("이미 설원 장미를 가져 오셨군요. 그 설원 장미를 필리아씨에게 가져다 주세요.");
                cm.dispose();
                return;
            }
            cm.sendYesNo("와주셨군요... 설원 장미를 피울 준비는 되셨나요? 5월의 이슬이 있어야만 장미를 피울 수 있다는 건 알고 계시죠?");
        } else {
            cm.sendOk("인간이 되고 싶습니다. 따뜻한 심장을 가진 인간이... 인간이 된다면 그녀의 손을 잡아줄 수도 있겠지요. 하지만 지금은 그럴 수 없지요...");
            cm.safeDispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("준비가 되시면 저를 다시 찾아와 주세요.")
            cm.dispose();
        } else {
            cm.sendNext("그럼 설원 장미를 피울 부화기가 마련된 곳으로 당신을 안내하겠습니다...")
        }
    } else if (status == 2) {
        var em = cm.getEventManager("SnowRose");
        if (em != null) {
            if (em.getProperty("started").equals("true")) {
                cm.sendOk("이미 다른 누군가가 이 안에서 설원 장미를 피우고 있는 것 같습니다. 다음에 다시 찾아와 주세요.");
                cm.dispose();
            } else {
                em.startInstance(cm.getPlayer());
                cm.dispose();
            }
        } else {
            cm.sendOk("event error");
            cm.dispose();
        }
    }
}