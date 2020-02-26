/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation version 3 as published by
 the Free Software Foundation. You may not use, modify or distribute
 this program under any other version of the GNU Affero General Public
 License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Guild Alliance NPC
 */

var status;
var choice;
var guildName;
var partymembers;

function start() {
    //cm.sendOk("The Guild Alliance is currently under development.");
    //cm.dispose();
    partymembers = cm.getPartyMembers();
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple(" 안녕하세요? #b레나리우#k라고 해요.#b\r\n #L0#길드 연합이 무엇인지 알려주세요#l\r\n #L1#길드 연합을 만들려면 어떻게 해야 돼요?#l\r\n #L2#길드 연합을 만들고 싶어요.#l\r\n #L3#길드 연합의 길드 수를 늘리고 싶어요.#l\r\n #L4#길드 연합을 해체하고 싶어요.#l");
    } else if (status == 1) {
        choice = selection;
        if (selection == 0) {
            cm.sendNext("여러개의 길드가 서로 모여서 만든 모임을 길드 연합이라고 해요. 저는 이렇게 만들어진 길드 연합을 관리하는 일을 하고 있답니다.");
            cm.dispose();
        } else if (selection == 1) {
            cm.sendNext("길드 연합을 만들려면 길드장 2명이 파티를 맺고 있어야 해요. 여기서 파티장이 길드 연합장이 된답니다.");
        } else if (selection == 2) {
            if (cm.getPlayer().getParty() == null || partymembers == null || partymembers.size() != 2 || !cm.isLeader()) {
                cm.sendOk("길드장 두명이 파티를 맺고 있어야 길드 연합을 만들 수 있어요."); //Not real text
                cm.dispose();
            } else if (partymembers.get(0).getGuildId() <= 0 || partymembers.get(0).getGuildRank() > 1) {
                cm.sendOk("길드장만 길드 연합을 등록할 수 있어요.");
                cm.dispose();
            } else if (partymembers.get(1).getGuildId() <= 0 || partymembers.get(1).getGuildRank() > 1) {
                cm.sendOk("다른 파티원이 길드장이 아닌 것 같아요.");
                cm.dispose();
            } else {
                var gs = cm.getGuild(cm.getPlayer().getGuildId());
                var gs2 = cm.getGuild(partymembers.get(1).getGuildId());
                if (gs.getAllianceId() > 0) {
                    cm.sendOk("이미 길드 연합에 가입되어 있으면 길드 연합을 만들 수 없습니다.");
                    cm.dispose();
                } else if (gs2.getAllianceId() > 0) {
                    cm.sendOk("다른 파티원이 이미 다른 길드 연합에 가입되어 있어요.");
                    cm.dispose();
                } else if (cm.partyMembersInMap() < 2) {
                    cm.sendOk("파티원 두명이 이곳에 모여 잇는지 확인해 주세요.");
                    cm.dispose();
                } else
                    cm.sendYesNo("정말 길드 연합을 만들고 싶으세요?");
            }
        } else if (selection == 3) {
            if (cm.getPlayer().getGuildRank() == 1 && cm.getPlayer().getAllianceRank() == 1) {
                cm.sendYesNo("길드 수를 늘리는데에는 수수료 5백만 메소가 소비됩니다. 정말 만들고 싶으세요?"); //ExpandGuild Text
            } else {
                cm.sendOk("길드 연합장만 길드 수를 늘릴 수 있어요.");
                cm.dispose();
            }
        } else if (selection == 4) {
            if (cm.getPlayer().getGuildRank() == 1 && cm.getPlayer().getAllianceRank() == 1) {
                cm.sendYesNo("길드 연합을 정말 해체하고 싶으세요? 신중하게 결정해 주시기 바랍니다.");
            } else {
                cm.sendOk("길드 연합장만 길드 연합을 해체할 수 있어요.");
                cm.dispose();
            }
        }
    } else if (status == 2) {
        if (choice == 1) {
            cm.sendNext("2명의 길드장이 모였다면 500만 메소가 필요해요. 이건 길드 연합을 등록하는데 필요한 수수료에요.");
        } else if (choice == 2) {
            cm.sendGetText("생성할 길드 연합 이름을 입력해 주세요. (최대 12바이트)");
        } else if (choice == 3) {
            if (cm.getPlayer().getGuildId() <= 0) {
                cm.sendOk("길드 연합이 존재하지 않습니다.");
                cm.dispose();
            } else {
                if (cm.addCapacityToAlliance()) {
                    cm.sendOk("길드 연합의 길드수를 늘렸어요.");
                } else {
                    cm.sendOk("최대 길드 연합의 길드 수는 5개 까지 늘릴 수 있습니다. 또는 수수료가 부족하신 건 아닌지 확인해 주세요.");
                }
                cm.dispose();
            }
        } else if (choice == 4) {
            if (cm.getPlayer().getGuildId() <= 0) {
                cm.sendOk("길드 연합이 존재하지 않습니다.");
                cm.dispose();
            } else {
                if (cm.disbandAlliance()) {
                    cm.sendOk("길드 연합이 해체되었습니다.");
                } else {
                    cm.sendOk("길드 연합을 해체하는데 오류가 발생했어요. 다시 시도해 주세요.");
                }
                cm.dispose();
            }
        }
    } else if (status == 3) {
        if (choice == 1) {
            cm.sendNext("그리고 또하나! 당연히 다른 길드 연합에 가입되어 있으면 새롭게 길드 연합을 만들지 못해요!");
            status = -1;
        } else {
            guildName = cm.getText();
            cm.sendYesNo("입력하신 길드 연합 이름은 #b" + guildName + " 입니다. 정말 이 이름으로 길드 연합을 만들고 싶으세요?");
        }
    } else if (status == 4) {
        if (!cm.createAlliance(guildName) || cm.getPlayer().getMeso() < 5000000) {
            cm.sendNext("사용할 수 없는 이름이거나 이미 존재하는 이름입니다. 다른 이름을 입력해 주세요. 혹은 수수료 500만메소가 부족하신건 아닌지도 확인해주세요."); //Not real text
            status = 1;
            choice = 2;
        } else {
            cm.sendOk("길드 연합이 새롭게 만들어졌습니다.");
            cm.gainMeso(-5000000);
        }
        cm.dispose();
    }
}