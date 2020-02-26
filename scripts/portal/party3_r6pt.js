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
 * PortalName : party3_r6pt
 * Location : 920010700 (히든스트리트 - 여신의 탑<올라가는 길>)
 * 
 * @author T-Sun
 *
 */
importPackage(java.lang);

function enter(pi) {
    var em = pi.getEventManager("OrbisPQ");
    var pid = pi.getPortal().getId();
    if (em != null) {
        var r6_rp = em.getProperty("stage6_way");
        if (r6_rp == null) {
            //발판
            var r6way = "";
            for (var i = 1; i <= 16; ++i) {
                r6way += (pi.rand(1,4)+"");
            }
            em.setProperty("stage6_way", r6way);
        }
        pi.playPortalSE();
        var way = em.getProperty("stage6_way");
        var t1 = pid - 24;
        var wayfloor = Math.floor(t1 / 4);
        var wayans = way.substr(wayfloor, 1);
        var portalindex = ((wayfloor + 1) * 4 + 24) - pid;
        //        pi.playerMessage("pid : " + pid + " / ans : " + way + " wayfloor : " + wayfloor + " wayans : " + wayans + " portalindex : " + portalindex);
        if (wayans != portalindex) {
            if (wayfloor <= 4)
                pi.warp(-1, "np16");
            else if (wayfloor <= 8)
                pi.warp(-1, "np03");
            else if (wayfloor <= 12)
                pi.warp(-1, "np07");
            else if (wayfloor <= 16)
                pi.warp(-1, "np11");
        } else {
            if (wayfloor >= 10) {
                pi.warp(-1, "np"+wayfloor);
            } else {
                pi.warp(-1, "np0"+wayfloor);
            }
        }
    }
}
