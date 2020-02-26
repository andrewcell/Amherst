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
 * ActionName : boss2
 * ReactorInfo : 균열조각을 떨어뜨리면 시간의 구를 소환한다.
 * Location : 220080001 (시계탑최하층 - 시계탑의 근원)
 * 
 * @author T-Sun
 *
 */

function act() {
    var em = rm.getEventManager("Papulatus");
    em.setProperty("battle", 1);
    rm.mapMessage(6, "차원의 균열이 <차원 균열의 조각> 으로 채워졌습니다.");
    rm.changeMusic("Bgm09/TimeAttack");
    rm.spawnMob(8500000, -410, -400);
    rm.setBossRepeatTime("papulatus", 360); //6 hours cannot re-enter in map
    em.getInstance("Battle").startEventTimer(7200000); //120 mins, instance-named 'Battle' StartTimer
    em.getMapFactory().getMap(220080000).getReactorById(2208001).forceHitReactor(1); //door close
}
