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
 * NPCID : 9040010
 * ScriptName : guildquest1_bonus
 * NPCNameFunc : 비호 석상
 * Location : 990000900 (샤레니안 - 에레고스의 왕좌)
 * 
 * @author T-Sun
 *
 */
importPackage(java.lang);

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    var eim = cm.getEventInstance();
    if (eim != null) {
        if (eim.getProperty("leader").equals(cm.getName())) {
            if (cm.haveItem(4001024)) {
                cm.removeAll(4001024);
                var prev = eim.setProperty("bossclear","true",true);
                if (prev == null) {
                    var start = parseInt(eim.getProperty("entryTimestamp"));
                    var cur = System.currentTimeMillis();
                    var min = (cur - start) / 60000;
                    if (  min >= 0 && min < 25) {
                        point = 850;
                    } else if ( min >= 25 && min <30 ) {
                        point = 800 - ((min - 25) * 20);
                    } else if ( min >= 30 && min < 40 ) {
                        point = 580 - ((min - 30) * 10);
                    } else if ( min >= 40 && min < 60 ) {
                        point = 400 - ((min - 40) * 5);
                    } else if ( min >= 60 && min < 90 ) {
                        point = 260 - ((min - 60) * 2);
                    } else if ( min >= 90  ) {
                        point = 200;
                    }
                    eim.broadcastPlayerMsg(6, "길드 대항전을 클리어 하였습니다. 누리스를 통해 이 맵을 나갈 수 있습니다.")
                    cm.gainGP(point);
                }
                eim.finishPQ();
            } else {
                cm.sendOk("You. I wanna Take you to the gaybar. I wanna Take you to the gaybar. I wanna Take you to the gaybar. gaybar. gaybar.");
            }
        }
    } else {
        cm.warp(990001100);
    }
    cm.dispose();
}
