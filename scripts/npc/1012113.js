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
 * NPCID : 1012113
 * ScriptName : moonrabbit_bonus
 * NPCNameFunc : 토미
 * Location : 910010200 (히든스트리트 - 돼지의 마을)
 * Location : 910010300 (히든스트리트 - 마을로 돌아가는 길)
 * Location : 910010100 (히든스트리트 - 지름길)
 * 
 * @author T-Sun
 *
 */
var status = -1;

var map;
function action(mode, type, selection) {
    if (mode == 1) {
        status ++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        map =  cm.getPlayer().getMapId();
        if (map == 910010100) {
            cm.sendNext("안녕하세요? 저는 토미입니다. 이곳 근처에는 돼지마을이 있습니다. 그 곳의 돼지들은 성격이 포악하고 욕심이 유달리 많아 여행자들이 가지고 다니던 각종 무기들을 빼앗아 마을에서 추방되어 이곳에 숨어 지내고 있어요.")
        } else if (map == 910010200) {
            cm.sendSimple("무엇을 도와 드릴까요?#b\r\n\r\n#L0#이곳에서 나가고 싶어요#l");
        } else if (map == 910010300) {
            cm.sendSimple("무엇을 도와 드릴까요?#b\r\n\r\n#L0#이곳에서 나가고 싶어요#l");
        }
    } else if (status == 1) {
        if (map == 910010100) {
            cm.sendSimple("파티원들과 함께 그 곳으로 여행을 떠나 못된 돼지들을 혼내 주시는 것은 어떨까요?\r\n\r\n#b#L0#네, 그곳으로 보내주세요.#l#k");
        } else if (map == 910010200) {
            cm.warp(910010400, "st00");
            cm.dispose();
        } else if (map == 910010300) {
            cm.warp(100000200);
            cm.removeAllParty(4001101);
            cm.removeAllParty(4001100);
            cm.removeAllParty(4001099);
            cm.removeAllParty(4001098);
            cm.removeAllParty(4001097);
            cm.removeAllParty(4001096);
            cm.removeAllParty(4001095);
            cm.dispose();
        }
    } else if (status == 2) {
        if (map == 910010100) {
            if (cm.isLeader()) {
                var em = cm.getEventManager("HenesysPQBonus");
                if (em.getProperty("state") != null && em.getProperty("state").equals("1")) {
                    cm.sendOk("으음..이미 이 안에 다른 파티가 들어간 것 같은데요?")
                    cm.dispose();
                    return;
                }
                var eim = cm.getPlayer().getEventInstance();
                if (eim != null) {
                    eim.disposeIfPlayerBelow(100, 0);
                }
                em.startInstance(cm.getParty(), cm.getMap(), 200);
                cm.dispose();
            } else {
                cm.sendOk("돼지 마을은 파티장이 입장을 신청할 수 있어요.")
                cm.dispose();
            }
        }
    }
}