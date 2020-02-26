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
 * NPCID : 1092000
 * ScriptName : nautil_cow
 * NPCNameFunc : 탕윤
 * Location : 120000103 (노틸러스호 - 식당)
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
        if (cm.isQuestActive(2180)) {
            if (!cm.haveItem(4031850, 1))
                cm.sendNext("자~ 그럼 나의 소중한 젖소들이 살고 있는 외양간으로 보내주지. 우유를 다 먹어치워버리는 아기젖소들을 조심하게. 노력이 헛수고가 되어버릴 수 있으니.");
            else {
                cm.sendOk("이미 신선한 우유를 구해왔구만?");
                cm.dispose();
            }
        } else {
            cm.sendOk("나는 노틸러스호의 식량을 담당하는 탕윤이라고 하네1");
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendNext("아기젖소와 어미젖소는 한눈에 구분가지 않을거야. 태어난지 얼마 안된 아기들이지만 엄청난 먹성으로 벌써 어미소만 하거든. 모습도 붕어빵처럼 똑같이 생겼으니... 가끔 나도 헷갈린다네. 그럼 잘 해보게.")
    } else if (status == 2) {
        var em = cm.getEventManager("NautilusCow");
        if (em != null) {
            if (em.getProperty("started").equals("false")) {
                em.startInstance(cm.getPlayer());
                cm.dispose();
            } else {
                cm.sendOk("이미 이 안에 다른 누군가가 들어가있는 것 같군. 나중에 다시 시도하게.");
                cm.dispose();
            }
        } else {
            cm.sendOk("event error");
            cm.dispose();
        }
    }
}