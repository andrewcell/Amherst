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
 * ActionName : boss
 * ReactorInfo : 제단
 * Location : 280030000 (마지막임무 - 자쿰의제단)
 * 
 * @author T-Sun
 *
 */
function act() {
    rm.changeMusic("Bgm06/FinalFight");
    rm.getMap().spawnZakum(-10, -215);
    rm.mapMessage("원석의 힘으로 자쿰이 소환됩니다.");
    var em = rm.getEventManager("ZakumBattle");
    em.getMapFactory().getMap(211042300).getReactorById(2118002).forceHitReactor(1);
    em.setProperty("battle", "1");
    rm.getPlayer().getEventInstance().startEventTimer(21600000); //6 hours
//    if (!rm.getPlayer().isGM()) {
//        rm.getMap().startSpeedRun();
//    }
}