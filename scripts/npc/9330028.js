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
         * NPCID : 9330028
         * ScriptName : nightmarket01
         * NPCNameFunc : 과일가게 할아버지
         * Location : 741020100 ( - )
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
        if (cm.getQuestStatus(4014) == 2 && cm.getQuestStatus(4013) >= 1 && !cm.haveItem(4031354)) {
            cm.sendNext("자네라면 포장마차를 퇴치할 수 있을 것 같군! 그럼 포장마차가 있는 곳으로 보내주겠네. 조심하게나~");
        } else {
            cm.sendOk("흐음.. 내가 포장마차를 만나러 가는 길을 알고 있기는 하지만, 자네에게 알려줄 필요는 없을 것 같네.");
            cm.dispose();
        }
    } else if (status == 1) {

        var marr = cm.getQuestRecord(158200);
        if (marr.getCustomData() == null) {
            marr.setCustomData("0");
        }
        var dat = parseInt(marr.getCustomData());
        if (dat + 43200000 >= cm.getCurrentTime()) {
            cm.sendOk("포장마차는 12시간에 한번씩만 퇴치하러 갈 수 있다네. 나중에 다시 찾아와주게나.");
            cm.dispose();
            return;
        }
        marr.setCustomData(java.lang.System.currentTimeMillis() + "");
        var em = cm.getEventManager("NightMarketBoss");
        if (em != null) {
            if (em.getProperty("state").equals("1")) {
                cm.sendOk("이미 이 안에 다른 누군가가 포장마차를 물리치고 있는 것 같네. 잠시 후에 다시 찾아와 주게.");
                cm.dispose();
            } else {
                em.startInstance(cm.getPlayer());
                cm.dispose();
            }
        } else {
            cm.sendOk("오류가 발생했다네.");
            cm.dispose();
        }
    }
}