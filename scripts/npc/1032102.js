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
 * NPCID : 1032102
 * ScriptName : pet_life
 * NPCNameFunc : 요정 마르 - 펫 마스터
 * Location : 101000200 (히든스트리트 - 마르의숲)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var pet = null;
var theitems = Array();

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            cm.sendSimple("저는 펫을 되살려 주거나, 기존 펫의 능력치를 새로운 펫으로 옮겨주는 일을 맡고 있는 요정 마르랍니다.#b\r\n\r\n#L2# 죽은 펫을 다시 살리고 싶어요.#l");
        } else if (status == 1) {
            if (selection == 2) { //revive	
                val = cm.getQuestStatus(2049);
                var inv = cm.getInventory(5);
                var pets = cm.getPlayer().getPets(); //includes non-summon
                for (var i = 0; i <= inv.getSlotLimit(); i++) {
                    var it = inv.getItem(i);
                    if (it != null && it.getItemId() >= 5000000 && it.getItemId() < 5010000 && it.getExpiration() > 0 && it.getExpiration() < cm.getCurrentTime()) {
                        theitems.push(it);

                    }
                }
                if (theitems.length <= 0) {
                    cm.sendOk("저는 생명의 시간이 다 되어 죽은 펫을 되살려 주고 있지만.. 현재 여행자님께선 되살릴 펫이 있는 것 같지 않군요..");
                    cm.dispose();
                } else {
                    if (val == 0 || val == 2) {
                        cm.sendYesNo("펫을 되살리고 싶으신건가요..? 좋아요. 그러기 위해선 준비물이 몇가지 필요합니다만..");
                    } else {
                        if (cm.haveItem(4031034, 1) && cm.haveItem(5180000, 1)) {
                            cm.sendYesNo("준비물을 모두 모아오셨군요.. 좋아요. 이제 당신의 펫을 살릴 준비가 되었어요.");
                        } else {
                            cm.sendOk("준비해 오셔야 할 재료는 #b생명의 물#k 과 #r생명의 주문서#k 입니다. 생명의 물은.. 구하기 힘들지만.. 어떤 상점에서 현재 판매하고 있다고 하더군요.  생명의 주문서가 문제인데.. 이것은 헤네시스의 #b조련사 바르토스#k에게 찾아가 보시면 뭔가 알 수 있으실거에요.. 후훗");
                            cm.dispose();
                        }
                    }
                }
            }
        } else if (status == 2) {
            if (val == 0 || val == 2) {
                cm.sendOk("준비해 오셔야 할 재료는 #b생명의 물#k 과 #r생명의 주문서#k 입니다. 생명의 물은.. 구하기 힘들지만.. 어떤 상점에서 현재 판매하고 있다고 하더군요.  생명의 주문서가 문제인데.. 이것은 헤네시스의 #b조련사 바르토스#k에게 찾아가 보시면 뭔가 알 수 있으실거에요.. 후훗");
                cm.forceStartQuest(2049);
                cm.dispose();
            } else {
                var selStr = "살리고 싶은 펫을 선택해 주세요.#b\r\n";
                for (var i = 0; i < theitems.length; i++) {
                    selStr += "\r\n#L" + i + "##v" + theitems[i].getItemId() + "# #t" + theitems[i].getItemId() + "##l";
                }
                cm.sendSimple(selStr);
            }
        } else if (status == 3) {
            if (theitems.length <= 0) {
                cm.sendOk("저는 생명의 시간이 다 되어 죽은 펫을 되살려 주고 있지만.. 현재 여행자님께선 되살릴 펫이 있는 것 같지 않군요..");
            } else if (!cm.haveItem(4031034, 1) || !cm.haveItem(5180000, 1)) {
                cm.sendOk("준비해 오셔야 할 재료는 #b생명의 물#k 과 #r생명의 주문서#k 입니다. 생명의 물은.. 구하기 힘들지만.. 어떤 상점에서 현재 판매하고 있다고 하더군요.  생명의 주문서가 문제인데.. 이것은 헤네시스의 #b조련사 바르토스#k에게 찾아가 보시면 뭔가 알 수 있으실거에요.. 후훗");
            } else {
                theitems[selection].setExpiration(cm.getCurrentTime() + (90 * 24 * 60 * 60 * 1000));
                cm.getClient().getSession().write(Packages.tools.MaplePacketCreator.addInventorySlot(Packages.client.inventory.MapleInventoryType.CASH, theitems[selection], true));
                cm.sendOk("펫이 되살아났군요. 좋아요.. 다시 태어난 당신의 친구와 행복한 시간을 보내길..");
                cm.gainItem(5180000,-1);
                cm.gainItem(4031034,-1);
                cm.forceCompleteQuest(2049);
            }
            cm.dispose();
        }
    }
}