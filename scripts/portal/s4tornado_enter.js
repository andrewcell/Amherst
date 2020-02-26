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
 * PortalName : s4tornado_enter
 * Location : 220010001 (히든스트리트 - 구름발코니)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getJob() == 412) {
	if ((pi.haveItem(4001110) && pi.getQuestStatus(6230)) == 0 || pi.getQuestStatus(6230) == 1 || (pi.getQuestStatus(6230) == 2 && pi.getQuestStatus(6231) == 0)) {
	    pi.playPortalSE();
	    pi.warp(922020200, 0);
	}
    }
}