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
 * PortalName : party3_r4pt
 * Location : 920010600 (히든스트리트 - 여신의 탑<라운지>)
 * 
 * @author T-Sun
 *
 */

function enter(pi) {
    pi.playPortalSE();
    var em = pi.getEventManager("OrbisPQ");
    if (em != null) {
        var r4_rp = em.getProperty("stage4_rand");
        if (r4_rp == null) {
            //Reset
            em.setProperty("stage4_rand", "1");
            em.setProperty("stage4_r4way1", pi.rand(1,3)+"");
            em.setProperty("stage4_r4way2", pi.rand(1,3)+"");
        }
        //        pi.playerMessage("portal : " + pi.getPortal().getId() + " / ans : " + em.getProperty("stage4_r4way1") + em.getProperty("stage4_r4way2"))
        if (pi.getPortal().getId() == 11) {
            if (em.getProperty("stage4_r4way1").equals("1")) {
                pi.warp(-1, "np00");
            } else {
                pi.warp(-1, "np02");
            }
        } else if (pi.getPortal().getId() == 12) {
            if (em.getProperty("stage4_r4way1").equals("2")) {
                pi.warp(-1, "np00");
            } else {
                pi.warp(-1, "np02");
            }
        } else if (pi.getPortal().getId() == 13) {
            if (em.getProperty("stage4_r4way1").equals("3")) {
                pi.warp(-1, "np00");
            } else {
                pi.warp(-1, "np02");
            }
        } else if (pi.getPortal().getId() == 14) {
            if (em.getProperty("stage4_r4way2").equals("1")) {
                pi.warp(-1, "np01");
            } else {
                pi.warp(-1, "np02");
            }
        } else if (pi.getPortal().getId() == 15) {
            if (em.getProperty("stage4_r4way2").equals("2")) {
                pi.warp(-1, "np01");
            } else {
                pi.warp(-1, "np02");
            }
        } else if (pi.getPortal().getId() == 16) {
            if (em.getProperty("stage4_r4way2").equals("3")) {
                pi.warp(-1, "np01");
            } else {
                pi.warp(-1, "np02");
            }
        }
        
    }
}
