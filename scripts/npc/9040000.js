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
 * NPCID : 9040000
 * ScriptName : guildquest1_enter
 * NPCNameFunc : 슈앵
 * Location : 101030104 (빅토리아로드 - 유적발굴단 캠프)
 * 
 * @author T-Sun
 *
 */

var status;
var GQItems = Array(1032033, 4001024, 4001025, 4001026, 4001027, 4001028, 4001031, 4001032, 4001033, 4001034, 4001035, 4001037);

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        if (cm.getPlayer().hasEquipped(1032033)) {
            cm.sendOk("#t1032033#을 장착하고 있기 때문에 길드 대항전을 할 수 없습니다.");
            cm.dispose();
        } else {
            cm.sendSimple("안녕하세요. 유적발굴대원 슈앵이라고 해요. <샤레니안>유적 길드대항전 접수를 관리하고 있답니다. 자격조건에 대한 자세한 내용은 왼쪽 게시판의 공지사항을 참고해주세요. #b\r\n#L0# 탐사대 등록 신청#l\r\n#L1# 탐사대 등록 확인#l");
        }
	
    } else if (status == 1) {
        if (selection == 0) { //Start
            if (cm.getPlayerStat("GID") == 0 || cm.getPlayerStat("GRANK") >= 3) { //no guild or not guild master/jr. master
                cm.sendNext("길드장과 부길드장이 길드 대항전을 시작할 수 있습니다.");
                cm.dispose();
            } else {
                var em = cm.getEventManager("GuildQuest");
                if (em == null) {
                    cm.sendOk("This trial is currently under construction.");
                } else {
                    var prop = em.getProperty("started");

                    if ((prop.equals("false") || prop == null) && em.getInstance("GuildQuest") == null) {
                        for (var i = 0; i < GQItems.length; i++) {
                            cm.removeAll(GQItems[i]);
                        }
                        cm.dispose();
                        em.startInstance(cm.getPlayer(), cm.getPlayer().getName());
                        em.setProperty("state", "0");
                        var i = cm.getClient().getChannel();
                        cm.guildMessage("" + (i == 1 ? "1" : i == 2 ? "20세이상" : i - 1) + "채널 에서 길드 대항전이 시작되었습니다. 3분후에 샤레니안으로 들어가는 문이 열리며, 유적발굴단 캠프의 슈앵을 통해 참가할 수 있습니다.");
                    } else {
                        cm.sendOk("이미 다른 누군가가 길드 대항전을 진행중인 것 같군요. 나중에 다시 시도해 보세요.")
                        cm.dispose();
                    }
                }
            }
        } else if (selection == 1) { //entering existing GQ
            if (cm.getPlayerStat("GID") == 0) { //no guild or not guild master/jr. master
                cm.sendNext("길드에 가입되어 있지 않군요.");
                cm.dispose();
            } else {
                var em = cm.getEventManager("GuildQuest");
                if (em == null) {
                    cm.sendOk("This trial is currently under construction.");
                } else {
                    var eim = em.getInstance("GuildQuest");

                    if (eim == null) {
                        cm.sendOk("아직 길드 대항전이 시작되지 않았군요. 길드장이나 부길드장이 길드 대항전을 시작할 수 있어요.");
                    } else {
                        if (em.getProperty("guildid") != null && !em.getProperty("guildid").equalsIgnoreCase("" + cm.getPlayerStat("GID"))) {
                            if (cm.getPlayer().isGM()) {
                                cm.sendOk("This instance is not your guild. Instance Guild: "  + em.getProperty("guildid") + ", Your Guild: " + cm.getPlayerStat("GID"));
                            } else {
                                cm.sendOk("흠.. 방금 시작되어 참가 대기중인 길드는 당신의 길드가 아닌 것 같군요.");
                            }
                        } else if (em.getProperty("started").equals("false")) {
                            for (var i = 0; i < GQItems.length; i++) {
                                cm.removeAll(GQItems[i]);
                            }
                            eim.registerPlayer(cm.getPlayer());
                        } else {
                            cm.sendOk("길드가 이미 길드 대항전을 시작한 것 같군요. 아쉽지만 다음에 다시 시도해 보세요.");
                        }
                    }
                }
                cm.dispose();
            }
        }
    }
}