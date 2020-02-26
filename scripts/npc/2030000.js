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
 * NPCID : 2030000
 * ScriptName : goDungeon
 * NPCNameFunc : 제프 - 던전 안내원
 * Location : 211040200 (엘나스산맥 - 얼음골짜기2)
 * 
 * @author T-Sun
 *
 */

var status = -2;
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
    if (status == -1) {
        if (cm.haveItem(4031450)) {
            cm.warp(921100100, 0);
            cm.dispose();
            return;
        } 
        cm.sendNext("자네... 이 곳을 지나 더 멀고 깊은 곳으로 가보고 싶은 모양이로군... 하지만 저 너머부터는 상당히 포악하고 재빠른 녀석들이 우글대고 있어 아무리 준비를 했다 하더라도 섣불리 다가가서는 안돼. 오래 전 우리 마을의 용감한 청년들도 마을을 위협하는 녀석들을 끝장내겠다며 안으로 들어갔지만.. 영영 돌아오지 못하고 말았지...");
    } else if (status == 0) {
        if (cm.getPlayer().getLevel() > 49) {
            cm.sendYesNo("혹시 안에 들어갈 작정이라면 생각을 바꾸는 것이 좋을 것일세. 하지만 정 들어가고 싶다면... 안에서도 살아남을 수 있을 정도로 강한 자들만이 내 허락하에 들어갈 수가 있다네. 더이상의 피는 보고 싶지 않단 말일세. 어디 보자... 흠...! 자네는 꽤 강해 보이는군. 어떤가, 저 안으로 들어가고 싶은가?");
        } else {
            cm.sendOk("혹시 안에 들어갈 작정이라면 생각을 바꾸는 것이 좋을 것일세. 하지만 정 들어가고 싶다면... 안에서도 살아남을 수 있을 정도로 강한 자들만이 내 허락하에 들어갈 수가 있다네. 더이상의 피는 보고 싶지 않단 말일세.");
            cm.dispose();
            return;
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("잘 생각했네. 저 안으로 들어가는것은 자살 행위나 다름 없으니 말일세..");
            cm.dispose();
            return;
        }
        cm.sendSimple("나와 가위바위보를 해서 이기면 들여보내주지.\r\n\r\n#b#L0#가위#l\r\n#L1#바위#l\r\n#L2#보#l");
    } else if (status == 2) {
        select = selection+1;
        var random = cm.rand(0,2);
        if (select == 1) {
            if (random == 0) {
                cm.sendNext("#b #i1702063# 가위 #k#rvs #i1702063# 가위 #k\r\n\r\n비겼군. 다시 승부다.");
                status = 0;
            } else if (random == 1) {
                cm.sendOk("#b #i1702063# 가위 #k#rvs #i1702064# 바위#k\r\n\r\n쯧. 더욱 수련을 쌓고 다시 찾아오시게.");
                cm.dispose();
                return;
            } else if (random == 2) {
                cm.sendNext("#b #i1702063# 가위 #k#rvs #i1702065# 보#k\r\n\r\n후후.. 나를 이기다니.. 놀랍군. 좋아. 들여보내주지. 행운을 비네.");
            }
        } else if (select == 2) {
            if (random == 0) {
                cm.sendNext("#b #i1702064# 바위 #k#rvs #i1702063# 가위 #k\r\n\r\n후후.. 나를 이기다니.. 놀랍군. 좋아. 들여보내주지. 행운을 비네.");
            } else if (random == 1) {
                cm.sendNext("#b #i1702064# 바위 #k#rvs #i1702064# 바위#k\r\n\r\n비겼군. 다시 승부다.");
                status = 0;
            } else if (random == 2) {
                cm.sendOk("#b #i1702064# 바위 #k#rvs #i1702065# 보#k\r\n\r\n쯧. 더욱 수련을 쌓고 다시 찾아오시게.");
                cm.dispose();
                return;
            }
        } else if (select == 3) {
            if (random == 0) {
                cm.sendOk("#b #i1702065# 보 #k#rvs #i1702063# 가위#k\r\n\r\n쯧. 더욱 수련을 쌓고 다시 찾아오게.");
                cm.dispose();
                return;
            } else if (random == 1) {
                cm.sendNext("#b #i1702065# 보 #k#rvs #i1702064# 바위#k\r\n\r\n후후.. 나를 이기다니.. 놀랍군. 좋아. 들여보내주지. 행운을 비네.");
            } else if (random == 2) {
                cm.sendNext("#b #i1702065# 보 #k#rvs #i1702065# 보#k\r\n\r\n비겼군. 다시 승부다.");
                status = 0;
            }
        }
    } else if (status == 3) {
        cm.warp(211040300, "under00");
        cm.dispose();
    }

}