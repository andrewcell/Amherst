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
 * NPCID : 9010019
 * ScriptName : counsel
 * NPCNameFunc : 버섯똘이 - 상담원
 * Location : 200000204 (오르비스공원 - 상담실)
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
        cm.sendYesNo("혹시 고민이 있는거야?");
    } else if (status == 1) {
        if (selection == 1) {
            cm.sendSimple("어떤 고민인지 내게 말해줄래?#b\r\n #L0# 연애에 관해 고민이 있어요..#l\r\n");
        } else {
            cm.sendOk("고민도 없으면서 나를 왜 찾아온거야?");
            cm.dispose();
        }
    } else if (status == 2) {
        firstSelect = selection;
        if (firstSelect == 0) {
            cm.sendSimple("음.. 구체적으로 어떤 고민인데?#b\r\n#L0#사실은... 제가 남자인데, 남자가 좋아요!#l\r\n#L1#쎾쓰가 하고 싶어요.#l");
        }
    } else if (status == 3) {
        secondSelect = selection;
        if (firstSelect == 0) {
            if (secondSelect == 0) {
                cm.sendNext("음..  그렇구나. 그럼 네게 맞는 노래를 들려줄께. 노래를 들어보고 네 성 정체성을 찾길 바래.")
            } else if (secondSelect == 1) {
                var rand = cm.rand(0, 1);
                if (rand == 0) {
                    cm.playMusic(false, "약/I_just_had_sex");
                    cm.sendOk("난 방금 하고왔단다.");
                    cm.dispose();
                } else if (rand == 1) {
                    cm.playMusic(false, "약/오리온좌");
                    cm.sendOk("나도 하고싶어..");
                    cm.dispose();
                }
            }
        }
    } else if (status == 4) {
        if (firstSelect == 0) {
            if (secondSelect == 0) {
                cm.playMusic(false, "약/Electric_Six_Gay_Bar");
                cm.dispose();
            }
        }
    }
}
