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
 * PortalName : davy3_hd1
 * Location : 925100300 (히든스트리트 - 갑판 돌파 II)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    var eim = pi.getPlayer().getEventInstance();
    if (eim.getProperty("DavyJohn4_hd") == null) {
        if (pi.isLeader())
            pi.warpParty(925100302);
        else
            pi.playerMessage("파티장이 입장을 해야 합니다.");
    } else {
        pi.playerMessage("이번판에는 더 이상 입장할 수 없습니다.");
    }
}