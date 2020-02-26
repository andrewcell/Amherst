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
 * PortalName : adviceMap
 * Location : 0 (메이플로드 - 버섯마을서쪽입구)
 * Location : 10000 (메이플로드 - 버섯마을)
 * Location : 20000 (메이플로드 - 버섯마을)
 * Location : 30000 (메이플로드 - 버섯마을동쪽입구)
 * Location : 40000 (메이플로드 - 달팽이사냥터1)
 * Location : 40001 (메이플로드 - 달팽이사냥터2)
 * Location : 40002 (메이플로드 - 달팽이사냥터3)
 * Location : 50000 (메이플로드 - 두갈래길)
 * Location : 50001 (메이플로드 - 사우스페리서쪽필드)
 * Location : 60000 (메이플로드 - 사우스페리)
 * Location : 1000000 (레인보우스트리트 - 암허스트서쪽필드)
 * Location : 1010000 (레인보우스트리트 - 암허스트)
 * Location : 1020000 (레인보우스트리트 - 암허스트동쪽필드)
 * 
 * @author T-Sun
 *
 */

function enter (pi) {
    pi.showInstruction("포탈을 타고 다음 맵으로 이동하려면 \r\\#e#b방향키 [↑]#k 키#n를 누르세요.", 230, 5);
    return true;
}
