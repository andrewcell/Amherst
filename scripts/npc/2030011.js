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
 * NPCID : 2030011
 * ScriptName : Zakum04
 * NPCNameFunc : 알리
 * Location : 280090000 (아도비스의임무1 - 비련의방)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection){
    if (mode == 1) {
	cm.removeAll(4001015);
	cm.removeAll(4001016);
	cm.removeAll(4001018);
	cm.warp(211042300, 0);
    }
    cm.dispose();
}