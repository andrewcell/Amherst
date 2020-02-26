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
 * NPCID : 2042001
 * ScriptName : mc_enter1
 * NPCNameFunc : 슈피겔만 - 몬스터 카니발
 * Location : 980000500 (몬스터 카니발 - 카니발 필드5<대기실>)
 * Location : 980000400 (몬스터 카니발 - 카니발 필드4<대기실>)
 * Location : 980000300 (몬스터 카니발 - 카니발 필드3<대기실>)
 * Location : 980000600 (몬스터 카니발 - 카니발 필드6<대기실>)
 * Location : 980000200 (몬스터 카니발 - 카니발 필드2<대기실>)
 * Location : 980000100 (몬스터 카니발 - 카니발 필드1<대기실>)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var request;

function start() {
    status = -1;
    action(1, 0, 0);
}


function action(mode, type, selection) {
    if (mode == 1)
        status++;
    else
        status = 0;
    if (status == 0) {
        request = cm.getNextCarnivalRequest();
        if (request != null) {
            cm.sendYesNo(request.getChallengeInfo() + "\r\n이 파티의 카니발 도전을 수락하겠는가?");
        } else {
            cm.dispose();
        }
    } else if (status == 1) {
        try {
            cm.getChar().getEventInstance().registerCarnivalParty(request.getChallenger(), request.getChallenger().getMap(), 1);
            cm.dispose();
        } catch (e) {
            cm.sendOk("흠.. 도전을 수락하는데 실패하였네. 다른 도전을 기다려 보게.");
        }
        status = -1;
    }
}


