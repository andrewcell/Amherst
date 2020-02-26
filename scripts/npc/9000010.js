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
 * NPCID : 9000010
 * ScriptName : Event06
 * NPCNameFunc : 피에트라
 * Location : 109050001 (히든스트리트 - 이벤트나가는곳)
 * 
 * @author T-Sun
 *
 */

importPackage(Packages.server);
importPackage(Packages.client);
importPackage(java.util);
importPackage(java.lang);
importPackage(Packages.tools);
importPackage(Packages.tools.packet);

var status = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {

        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.haveItem(4031018, 1)) {
            cm.sendSimple("#b#t4031018##k를 #p9000006#에게서 보상으로 교환할 수 있답니다. 알고 싶으신것이 있으세요?\r\n\r\n#L0##b#p9000006#은 누구죠?#l\r\n#L1#이전에 있던곳으로 데려다 주세요.#l");
        } else {
            cm.sendNext("이전에 있던 곳으로 데려다 드리겠습니다.");
            status = 1;
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("#b#p9000006##k에게 #t4031018#를 건네고, 이벤트 보상으로 교환할 수 있습니다. 제 옆에 바로 있는 엔피시입니다.");
            cm.dispose();
        } else if (selection == 1) {
            cm.sendNext("이전에 있던 곳으로 데려다 드리겠습니다.");
        }
    } else if (status == 2) {
        if (cm.canHold(4000038)) {
            cm.gainItem(4000038, 1);
            cm.warp(cm.getSavedLocation("EVENT"));
            giveBuff(MapleBuffStat.HOLY_SYMBOL, 50, 9001002, 1200000);
            cm.playerMessage(5, "20분 동안 경험치 1.5배 버프가 적용되었습니다. 게임 재접속, 혹은 홀리심볼 버프를 받게되면 해제되니 주의해주세요. (버프 창에는 15분으로 표시되지만, 실제로는 20분 동안 적용됩니다.)");
            cm.playerMessage(1, "20분 동안 경험치 1.5배 버프가 적용되었습니다. \r\n\r\n게임 재접속, 혹은 홀리심볼 버프를 받게되면 해제되니 주의해주세요. \r\n\r\n(버프 창에는 15분으로 표시되지만, 실제로는 20분 동안 적용됩니다.)");
            cm.clearSavedLocation("EVENT");
            cm.dispose();
        } else {
            cm.sendOk("인벤토리 공간이 충분한지 확인해 주세요.");
            cm.dispose();
        }
    }
}


function giveBuff(a, b, buffid, time) {
    var stateff = SkillFactory.getSkill(buffid).getEffect(1);
    var localstatups = new EnumMap(MapleBuffStat);
    localstatups.put(a, Integer.valueOf(b));
    var chr = cm.getPlayer();
    chr.cancelEffect(stateff, -1, localstatups, true);
    chr.getClient().sendPacket(TemporaryStatsPacket.giveBuff(buffid, Integer.valueOf(time), localstatups, stateff));
    var starttime = System.currentTimeMillis();
    var cancelAction = new MapleStatEffect.CancelEffectAction(chr, stateff, starttime, localstatups);
    var schedule = Packages.server.Timer.BuffTimer.getInstance().schedule(cancelAction, time);
    chr.registerEffect(stateff, starttime, schedule, localstatups, false, time, chr.getId());
}