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
 * NPCID : 2111000
 * ScriptName : jenu_homun
 * NPCNameFunc : 카슨 - 제뉴미스트 협회장
 * Location : 261000010 (마가티아 - 제뉴미스트 협회)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (cm.isQuestActive(3310)) {
            if (cm.haveItem(4031709, 1)) {
                cm.sendOk("이미 #b#t4031709##k를 구해 온 것 같구만. 그렇다면 이 안에 다시 들어갈 필요는 없어보이네.")
                cm.safeDispose();
            } else {
                cm.askAcceptDecline("흐음, 지금 바로 폐쇄된 연구실로 가보겠는가?");
            }
        } else {
            cm.sendOk("제뉴미스트.. 진리를 탐구하는 생명연금의 자랑스러운 학파라네.");
            cm.safeDispose();
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("아직 준비가 덜 된 모양인가? 준비가 되는 대로 나를 찾아오게.");
            cm.dispose();
        } else {
            var em = cm.getEventManager("JenumistHomu");
            if (em != null) {
                if (em.getProperty("started").equals("false")) {
                    em.startInstance(cm.getPlayer());
                    cm.dispose();
                } else {
                    cm.sendOk("흐음, 이미 이 안에 다른 누군가가 퀘스트에 도전하고 있네. 나중에 다시 시도해보게.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("오류가 발생했습니다.");
                cm.dispose();
            }
        }
    }
}