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
 * PortalName : guild1F00
 * Location : 990000700 (샤레니안 - 샤렌 3세의 무덤)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    pi.playPortalSE();
    var qr = pi.getQuestRecord(7600);
    if (qr.getCustomData() == null) {
        qr.setCustomData("0");
    }
    var val = qr.getCustomData();
    if (val.equals("0")) pi.warp(990000611, "st00");
    else if (val.equals("1")) pi.warp(990000620, "st00");
    else if (val.equals("2")) pi.warp(990000631, "st00");
    else pi.warp(990000641, "st00");
}
