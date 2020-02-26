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
 * NPCID : 2084000
 * ScriptName : miro_admin
 * NPCNameFunc : 황금나침반
 * Location : 980022400 (골드리치의 미로 - 하이!로우!)
 * Location : 980022500 (골드리치의 미로 - 황금 열매의 미로)
 * Location : 980022300 (골드리치의 미로 - 하이!로우!)
 * Location : 980021500 (골드리치의 미로 - 용의 둥지 미로)
 * Location : 980021400 (골드리치의 미로 - 무지개 달팽이의 미로)
 * Location : 980021300 (골드리치의 미로 - 무지개 달팽이의 미로)
 * Location : 980021700 (골드리치의 미로 - 용의 둥지 미로)
 * Location : 980021600 (골드리치의 미로 - 용의 둥지 미로)
 * Location : 980021900 (골드리치의 미로 - 용의 둥지 미로)
 * Location : 980021800 (골드리치의 미로 - 용의 둥지 미로)
 * Location : 980022200 (골드리치의 미로 - 하이!로우!)
 * Location : 980022100 (골드리치의 미로 - 하이!로우!)
 * Location : 980020500 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020600 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020700 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020300 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020400 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980021000 (골드리치의 미로 - 무지개 달팽이의 미로)
 * Location : 980021100 (골드리치의 미로 - 무지개 달팽이의 미로)
 * Location : 980021200 (골드리치의 미로 - 무지개 달팽이의 미로)
 * Location : 980020800 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020900 (골드리치의 미로 - 골드리치의 보물창고)
 * Location : 980020000 (골드리치의 미로 - 미로의 입구)
 * Location : 980020200 (골드리치의 미로 - 달팽이의 미로)
 * Location : 980020100 (골드리치의 미로 - 달팽이의 미로)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendOk(".");
        cm.safeDispose();
    }
}