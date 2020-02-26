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
 * PortalName : q3368in
 * Location : 926130100 (히든스트리트 - 실험실 입구)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    if (pi.isQuestActive(3368)) {
        var em = pi.getEventManager("YureteLab3");
        if (em != null) {
            if (em.getProperty("started").equals("false")) {
                pi.playPortalSE();
                em.startInstance(pi.getPlayer());
            } else {
                pi.playerMessage(5, "이 안에 이미 다른 누군가가 들어가 있는 것 같다.")
            }
        } else {
            pi.playerMessage(5, "오류 발생.");
        }
    } else {
        pi.playerMessage(5, "지금은 이 연구실에 볼 일이 없다.")
    }
}
