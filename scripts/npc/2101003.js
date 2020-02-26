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
 * NPCID : 2101003
 * ScriptName : adin_enter
 * NPCNameFunc : 아딘
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */
var status = -1;
function action(mode, type, selection) {
    if (cm.getQuestStatus(3933) != 1) {
        cm.sendOk("나에게 도전하겠다고? 용기는 가상하지만 나는 지금 바쁜 일이 있어서 말이야.")
        cm.dispose();
        return;
    } else if (cm.getQuestRecord(3933).getMobKills(9100013) > 0) {
        cm.sendOk("내가 졌다! 너, 꽤 강한데?")
        cm.dispose();
        return;
    }
    
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
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("네가 이렇게 강할 줄 몰랐어. 너 정도면 모래그림단원이 될 수 있을지도 모르겠다는 생각이 드는걸? 모래그림단원에게 가장 중요한 건 강함이고, 넌 충분히 강한 것 같거든. 하지만 역시 한 번만 더 시험을 해보고 싶은데, 어때? 괜찮겠어?")
    } else if (status == 1) {
        cm.askAcceptDecline("진짜 너의 강함을 확인하려면 역시 몸으로 부딪혀 보는 수밖에 없겠지? 너와 대련을 해보고 싶어. 걱정 말라구. 너를 해치고 싶지는 않아. 내 분신으로 널 상대해주지. 지금 당장 대련에 들어가도 괜찮겠어?");
    } else if (status == 2) {
        if (selection == 0) {
            cm.sendOk("마음의 준비가 필요한건가? 너무 긴장하지는 말라구.");
            cm.dispose();
        } else {
            cm.sendNext("좋아. 자신만만하군.");
        }
    } else if (status == 3) {
        var em = cm.getEventManager("Adin");
        if (em == null) {
            cm.sendOk("스크립트에 문제가 발생했습니다.");
            cm.dispose();
        }
        if (em.getProperty("state").equals("1")) {
            cm.sendOk("아... 잠시만 기다려 주게. 지금 누군가가 대련장을 쓰고 있는 것 같아. 잠시 후에 다시 찾아와 주게.");
            cm.dispose();
        } else {
            em.startInstance(cm.getPlayer());
            cm.dispose();
        }
    }
}