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
 * NPCID : 2081200
 * ScriptName : magician4
 * NPCNameFunc : 그리토 - 4차 마법사 전직사제
 * Location : 240010501 (히든스트리트 - 사제의 숲)
 * 
 * @author T-Sun
 *
 */

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1)
        status++;
    else
        status--;

    if (status == 0) {
        if (!(cm.getJob() == 211 || cm.getJob() == 221 || cm.getJob() == 231)) {
            cm.sendOk("제게 무슨 볼일이 있으시죠?");
            cm.dispose();
            return;
        } else if (cm.getPlayerStat("LVL") < 120) {
            cm.sendOk("당신은 아직 마법사의 궁극의 길을 걷기에는 아직 약해 보이는군요. 조금 더 수련을 쌓은 후 다시 찾아오시지요.");
            cm.dispose();
            return;
        } else {
            if (cm.getQuestStatus(6914) == 2) {
                if (cm.getJob() == 211)
                    cm.sendSimple("그대는 영웅으로써의 자질이 증명되었습니다.\r\n지금 전직하기를 원하십니까?\r\n#b#L0# 아크메이지 (불/독)로 전직하고 싶습니다.#l\r\n#b#L1# 잠시만 생각할 시간이 필요합니다.#l");
                else if (cm.getJob() == 221)
                    cm.sendSimple("그대는 영웅으로써의 자질이 증명되었습니다.\r\n지금 전직하기를 원하십니까?\r\n#b#L0# 아크메이지 (얼음/번개)로 전직하고 싶습니다.#l\r\n#b#L1# 잠시만 생각할 시간이 필요합니다.#l");
                else if (cm.getJob() == 231)
                    cm.sendSimple("그대는 영웅으로써의 자질이 증명되었습니다.\r\n지금 전직하기를 원하십니까?\r\n#b#L0# 비숍으로 전직하고 싶습니다.#l\r\n#b#L1# 잠시만 생각할 시간이 필요합니다.#l");
            } else {
                cm.sendOk("그대는 아직 4차 전직을 할 준비가 되지 않은 것 같군요.");
                cm.dispose();
                return;
            }
        }
    } else if (status == 1) {
        if (selection == 1) {
            cm.sendOk("그대는 그대의 영웅으로서의 자질을 증명했습니다. \r\n이제 남은 것은 마법사 궁극의 길로 향하는 것 뿐.\r\n전직을 할 준비가 되면 다시 말을 걸어주세요.");
            cm.dispose();
            return;
        }
        if (cm.getPlayerStat("RSP") > cm.getPlayerStat("LVL") * 3) {
            cm.sendOk("흠... 당신은 너무 많은 #bSP#k를 갖고 있는 것 같군요. 최소한 레벨 120 이전에 얻은 스킬포인트를 모두 사용하셔야 4차 전직을 하실 수 있습니다.")
            cm.dispose();
            return;
        } else {
            if (!cm.canHold(2280003)) {
                cm.sendOk("흠.. 소비 인벤토리 공간이 부족한 건 아닌가요? 다시 한번 확인해 보세요.");
                cm.dispose();
                return;
            }
            cm.gainItem(2280003, 1);
            if (cm.getJob() == 211) {
                cm.changeJob(212);
                cm.sendNext("이제 당신은 최고의 마법사인 #b아크메이지#k가 되었습니다. \r\n당신이 어떤 아크메이지가 될 지는 당신의 수련에 달려 있음을 결코 잊지 마세요.");
            } else if (cm.getJob() == 221) {
                cm.changeJob(222);
                cm.sendNext("이제 당신은 최고의 마법사인 #b아크메이지#k가 되었습니다. \r\n당신이 어떤 아크메이지가 될 지는 당신의 수련에 달려 있음을 결코 잊지 마세요.");
            } else if (cm.getJob() == 231) {
                cm.changeJob(232);
                cm.sendNext("이제 당신은 최고의 마법사인 #b비숍#k이 되었습니다. \r\n당신이 어떤 비숍이 될 지는 당신의 수련에 달려 있음을 결코 잊지 마세요.");
            }
            cm.dispose();
        }
    } else if (status == 2) {
        cm.sendNext("하지만 이것이 그것의 전부는 아니라네. 계속 수련을 하다 보면 숨겨진 힘이 아직 많이 남아 있을걸세. 끝없이 수련하고 정진하기를..");
        cm.dispose();
    }
}