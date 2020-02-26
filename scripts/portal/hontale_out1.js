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
 * PortalName : hontale_out1
 * Location : 240050600 (생명의동굴 - 동굴의 사잇길)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    pi.removeAll(4001087); // 첫번째 미로방 열쇠
    pi.removeAll(4001088); // 두번째 미로방 열쇠
    pi.removeAll(4001089); // 세번째 미로방 열쇠
    pi.removeAll(4001090); // 네번째 미로방 열쇠
    pi.removeAll(4001091); // 다섯번째 미로방 열쇠
    pi.removeAll(4001092); // 붉은 열쇠
    pi.removeAll(4001093); // 푸른 열쇠
    pi.playPortalSE();
    pi.warp(240050400);
}
