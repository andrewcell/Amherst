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
 * PortalName : Populatus00
 * Location : 220080000 (시계탑최하층 - 시계탑 깊은 곳)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (!pi.haveItem(4031172)) {
        pi.playerMessage("<루디브리엄의 메달>을 갖고 있어야 이 문을 지날 수 있습니다.");
        return;
    }
    if (pi.isQuestActive(6361) || pi.isQuestActive(6362) || (pi.isQuestActive(6363) && pi.getQuestRecord(6364).getCustomData() == null)) {
        pi.playPortalSE();
        pi.warp(922020300);
        return;
    }
    var em = pi.getEventManager("Papulatus");
    if (em.getProperty("battle").equals("1")) {
        pi.playerMessage("이미 파풀라투스와의 전투가 시작되어 입장할 수 없습니다.");
    } else {
        if (pi.canBossEnterTime("papulatus")) {
            if (pi.getPlayerCount(220080001) > 12) {
                pi.playerMessage("이 방은 이미 파풀라투스와의 전투를 위한 최대 인원수 만큼 가득 찼습니다.");
                return;
            }
            pi.playPortalSE();
            var eim = em.getInstance("Battle");
            if (eim == null) {
                eim = em.newInstance("Battle");
                em.startInstance(eim, "");
            }
            eim.registerPlayer(pi.getPlayer());
        } else {
            pi.playerMessage("파풀라투스는 6시간에 한번씩만 소환할 수 있습니다.");
        }
    }
}
