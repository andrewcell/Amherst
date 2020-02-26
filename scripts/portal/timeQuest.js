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
 * PortalName : timeQuest
 * Location : 270010100 (타임로드 - 추억의 길1)
 * Location : 270010200 (타임로드 - 추억의 길2)
 * Location : 270010300 (타임로드 - 추억의 길3)
 * Location : 270010400 (타임로드 - 추억의 길4)
 * Location : 270010500 (타임로드 - 추억의 길5)
 * Location : 270020100 (타임로드 - 후회의 길1)
 * Location : 270020200 (타임로드 - 후회의 길2)
 * Location : 270020300 (타임로드 - 후회의 길3)
 * Location : 270020400 (타임로드 - 후회의 길4)
 * Location : 270020500 (타임로드 - 후회의 길5)
 * Location : 270030100 (타임로드 - 망각의 길1)
 * Location : 270030200 (타임로드 - 망각의 길2)
 * Location : 270030300 (타임로드 - 망각의 길3)
 * Location : 270030400 (타임로드 - 망각의 길4)
 * Location : 270030500 (타임로드 - 망각의 길5)
 * Location : 270040000 (신전 깊은 곳 - 부서진 회랑)
 * 
 * @author T-Sun
 *
 */

var quest;
var tomap;
var uncompletedmap;

function enter(pi) {
    switch (pi.getMapId()) {

        // Green area
        case 270010100:
            quest = 3501;
            tomap = 270010110;
            uncompletedmap = 270010000;
            break;
        case 270010200:
            quest = 3502;
            tomap = 270010210;
            uncompletedmap = 270010110;
            break;
        case 270010300:
            quest = 3503;
            tomap = 270010310;
            uncompletedmap = 270010210;
            break;
        case 270010400:
            quest = 3504;
            tomap = 270010410;
            uncompletedmap = 270010310;
            break;
        case 270010500:
            quest = 3507;
            tomap = 270020000;
            uncompletedmap = 270010410;
            break;

        // Blue area
        case 270020100:
            quest = 3508;
            tomap = 270020110;
            uncompletedmap = 270020000;
            break;
        case 270020200:
            quest = 3509;
            tomap = 270020210;
            uncompletedmap = 270020110;
            break;
        case 270020300:
            quest = 3510;
            tomap = 270020310;
            uncompletedmap = 270020210;
            break;
        case 270020400:
            quest = 3511;
            tomap = 270020410;
            uncompletedmap = 270020310;
            break;
        case 270020500:
            quest = 3514;
            tomap = 270030000;
            uncompletedmap = 270020410;
            break;

        // Red zone
        case 270030100:
            quest = 3515;
            tomap = 270030110;
            uncompletedmap = 270030000;
            break;
        case 270030200:
            quest = 3516;
            tomap = 270030210;
            uncompletedmap = 270030110;
            break;
        case 270030300:
            quest = 3517;
            tomap = 270030310;
            uncompletedmap = 270030210;
            break;
        case 270030400:
            quest = 3518;
            tomap = 270030410;
            uncompletedmap = 270030310;
            break;
        case 270030500:
            quest = 3521;
            tomap = 270040000;
            uncompletedmap = 270030410;
            break;

        case 270040000:
            if (pi.haveItem(4032002)) {
		pi.playPortalSE();
                pi.warp(270040100, "out00");
                pi.playerMessage("신전 깊은 곳으로 이동합니다.");
                pi.gainItem(4032002, -1);
                return true;
            } else {
                pi.playerMessage("무언가가 막고 있는 듯 더 이상 들어갈 수 없다.");
                return false;
            }
            break;
        default:
            return false;
    }
    if (pi.getQuestStatus(quest) == 2) {
	pi.playPortalSE();
        pi.warp(tomap, "out00");
    } else {
	pi.playPortalSE();
        pi.warp(uncompletedmap, 0);
        pi.playerMessage("허가받지 않은 사람은 신전의 흐름을 역류할 수 없어 이전 장소로 되돌아 갑니다.");
    }
    return true;
}