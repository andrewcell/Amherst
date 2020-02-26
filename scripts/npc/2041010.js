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
 * NPCID : 2041010
 * ScriptName : face_ludi1
 * NPCNameFunc : 앨 - 성형외과 의사
 * Location : 220000003 (루디브리엄 - 루디브리엄성형외과)
 * 
 * @author T-Sun
 *
 */
var status = -1;
var facetype;
var needItem = 5152007;

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
        cm.sendNext("어서오세요! 루디브리엄 성형외과에 잘 오셨어요~ #b#t"+needItem+"##k 을 가져오신다면 손님의 얼굴을 멋지고 아름답게 바꿔드릴 수 있답니다!");
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
        cm.askAvatar("원하시는 얼굴을 선택해주세요~", facetype);
    } else if (status == 2){
        if (cm.setAvatar(needItem, facetype[selection]) == 1) {
            cm.sendOk("시술이 잘 된것 같아요. 얼굴이 마음에 드셨으면 좋겠어요~");
        } else {
            cm.sendOk("쿠폰이 없으시다면 얼굴 성형을 해드릴 수 없답니다.");
        }
        cm.dispose();
    }
}
