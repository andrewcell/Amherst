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
 * ActionName : boxMob0
 * ReactorInfo : 몬스터소환3
 * Location : 280010031 (아도비스의임무1 - 3-2구역)
 * Location : 280010041 (아도비스의임무1 - 4-2구역)
 * Location : 280010050 (아도비스의임무1 - 5-1구역)
 * Location : 280010060 (아도비스의임무1 - 6-1구역)
 * Location : 280010081 (아도비스의임무1 - 8-2구역)
 * Location : 280010101 (아도비스의임무1 - 10-2구역)
 * Location : 280010110 (아도비스의임무1 - 11-1구역)
 * Location : 280010130 (아도비스의임무1 - 13-1구역)
 * Location : 280011000 (아도비스의임무1 - 16구역<어딘가에있는폐광>)
 * Location : 280011001 (아도비스의임무1 - 16구역의1)
 * Location : 280011002 (아도비스의임무1 - 16구역의2)
 * Location : 280011003 (아도비스의임무1 - 16구역의3)
 * Location : 280011005 (아도비스의임무1 - 16구역의5)
 * Location : 280011006 (아도비스의임무1 - 16구역의6)
 * 
 * @author T-Sun
 *
 */

function act(){
    rm.playerMessage(5, "몬스터가 소환되었습니다!");
    rm.spawnMonster(9300004,3);
}