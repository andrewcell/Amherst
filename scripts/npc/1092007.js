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
 * NPCID : 1092007
 * ScriptName : nautil_black
 * NPCNameFunc : 무라트
 * Location : 120000100 (노틸러스호 - 상층 복도)
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
        if (cm.isQuestActive(2175)) {
            cm.sendNext("준비가 다 되었나? 좋아! 바로 검은 마법사 수하들이 있는 곳으로 보내주지. 내가 보내주는 곳에 있는 돼지들을 잘 살펴보면 찾을 수 있을거야.")
        } else {
            cm.sendOk("흐음, 나에게 무슨 볼일 이라도 있는건가?");
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendNext("그들은 힘이 약해지면 본 모습으로 나타나니 반드시 의심되는 녀석이 있거든 힘이 약해지도록 싸울 수 밖에 없네. 그럼 좋은 소식을 가지고 오게.")
    } else if (status == 2) {
        var em = cm.getEventManager("DarkMagicianAgit");
        if (em != null) {
            if (em.getProperty("started").equals("false")) {
                em.startInstance(cm.getPlayer());
                cm.dispose();
            } else {
                cm.sendOk("이미 이 안에 다른 누군가가 들어가 있네. 나중에 다시 와주게.");
                cm.dispose();
            }
        } else {
            cm.sendOk("error");
            cm.dispose();
        }
    }
}