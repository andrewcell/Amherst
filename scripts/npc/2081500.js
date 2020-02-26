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
 * NPCID : 2081500
 * ScriptName : pirate4
 * NPCNameFunc : 새뮤엘 - 4차 해적 전직사제
 * Location : 240010501 (히든스트리트 - 사제의 숲)
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
        if (!(cm.getJob() == 511 || cm.getJob() == 521)) {
            cm.sendOk("나를 보고 싶어 하는 이유가 뭐요? 내게 물을 것이 없어 보이는데.");
            cm.dispose();
            return;
        } else if (cm.getPlayerStat("LVL") < 120) {
            cm.sendOk("자네는 아직 해적의 궁극의 길을 걷기에는 아직 약해 보이는군. 조금 더 수련을 쌓은 후 다시 찾아오시오.");
            cm.dispose();
            return;
        } else {
            if (cm.getQuestStatus(6944) == 2) {
                if (cm.getJob() == 511)
                    cm.sendSimple("그대는 영웅으로써의 자질이 증명되었소.\r\n지금 전직하기를 원하는가?\r\n#b#L0# 바이퍼로 전직하고 싶습니다.#l\r\n#b#L1# 잠시만 생각할 시간이 필요합니다.#l");
                else if (cm.getJob() == 521)
                    cm.sendSimple("그대는 영웅으로써의 자질이 증명되었소.\r\n지금 전직하기를 원하는가?\r\n#b#L0# 캡틴으로 전직하고 싶습니다.#l\r\n#b#L1# 잠시만 생각할 시간이 필요합니다.#l");
            } else {
                cm.sendOk("아직 4차 전직을 할 준비가 되지 않은 것 같소. 준비가 되면 다시 말을 거시오.");
                cm.dispose();
                return;
            }
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.sendOk("그대는 그대의 영웅으로서의 자질을 증명했소. \r\n이제 남은 것은 해적 궁극의 길로 향하는 것 뿐.\r\n전직을 할 준비가 되면 다시 말을 걸어주시오.");
            cm.dispose();
            return;
        }
        if (cm.getPlayerStat("RSP") > cm.getPlayerStat("LVL") * 3) {
            cm.sendOk("흠... 당신은 너무 많은 #bSP#k를 갖고 있는 것 같소. 최소한 레벨 120 이전에 얻은 스킬포인트를 모두 사용하셔야 4차 전직을 하실 수 있소.")
            cm.dispose();
            return;
        } else {
            if (!cm.canHold(2280003)) {
                cm.sendOk("흠.. 소비 인벤토리 공간이 부족한 건 아닌가? 다시 한번 확인해 보게나.");
                cm.dispose();
                return;
            }
            cm.gainItem(2280003, 1);
            if (cm.getJob() == 511) {
                cm.changeJob(512);
                cm.sendNext("이제 자네는 최고의 해적인 #b바이퍼#k가 되었다네. 하지만 이것이 그것의 전부는 아니라네. 계속 수련을 하다 보면 숨겨진 힘이 아직 많이 남아 있을걸세. 끝없이 수련하고 정진하기를..");
            } else if (cm.getJob() == 521) {
                cm.changeJob(522);
                cm.sendNext("이제 자네는 최고의 해적인 #b캡틴#k이 되었다네. 하지만 이것이 그것의 전부는 아니라네. 계속 수련을 하다 보면 숨겨진 힘이 아직 많이 남아 있을걸세. 끝없이 수련하고 정진하기를..");
            }
            cm.dispose();
        }
    } else if (status == 2) {
        cm.sendNext("");
        cm.dispose();
    }
}