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
 * NPCID : 2010002
 * ScriptName : face_orbis1
 * NPCNameFunc : 프란츠 - 성형외과 원장
 * Location : 200000201 (오르비스공원 - 오르비스성형외과)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var facetype;
var needItem = 5152005;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
        cm.dispose();
        return;
    } else {
        status++;
    }

    if (status == 0) {
        cm.sendNext("어서오시게. 오르비스 성형외과에 온걸 환영하네. #b#t"+needItem+"##k 을 가져온다면 자네의 얼굴을 멋지게 바꿔주겠네.");
    } else if (status == 1) {
        var face = cm.getPlayerStat("FACE");

        if (cm.getPlayerStat("GENDER") == 0) {
            facetype = [20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20012, 20014, 20016, 20020, 20017];
        } else {
            facetype = [21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21012, 21014, 21016, 21020, 21017];
        }
        for (var i = 0; i < facetype.length; i++) {
            facetype[i] = facetype[i] + face % 1000 - (face % 100);
        }
        cm.askAvatar("어떤 얼굴로 바꿔보고 싶은가?", facetype);
    } else if (status == 2){
        if (cm.setAvatar(needItem, facetype[selection]) == 1) {
            cm.sendOk("자아~ 다 됐다네. 어떤가? 멋지지 않은가? 하하하. 나중에 성형이 또 하고 싶다면 이곳을 다시 찾아주게나!");
        } else {
            cm.sendOk("미안하지만 쿠폰 없이는 성형수술을 해 줄수 없다네.");
        }
        cm.dispose();
    }
}
