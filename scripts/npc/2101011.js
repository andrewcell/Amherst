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
 * NPCID : 2101011
 * ScriptName : cejan
 * NPCNameFunc : 세쟌
 * Location : 260000200 (아리안트 - 아리안트마을)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    cm.sendOk("휴우... 난폭한 여왕때문에 아직도 굶는 주민들이 많이 있어. 모래그림단은 이러한 주민들을 도울 의무가 있어.")
    cm.dispose();
}