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
 * NPCID : 2094002
 * ScriptName : davyJohn_play
 * NPCNameFunc : 구옹
 * Location : 925100500 (히든스트리트 - 해적선장의 위엄)
 * Location : 925100400 (히든스트리트 - 해적 퇴치!)
 * Location : 925100300 (히든스트리트 - 갑판 돌파 II)
 * Location : 925100301 (히든스트리트 - 백년 도라지의 영역 II)
 * Location : 925100302 (히든스트리트 - 데비존의 심복 II)
 * Location : 925100201 (히든스트리트 - 백년 도라지의 영역 I)
 * Location : 925100200 (히든스트리트 - 갑판 돌파 I)
 * Location : 925100202 (히든스트리트 - 데비존의 심복 I)
 * Location : 925100100 (히든스트리트 - 뱃머리 돌파!)
 * Location : 925100700 (히든스트리트 - 해적선 나가는 길)
 * Location : 925100000 (히든스트리트 - 해적선 가는길)
 * 
 * @author T-Sun
 *
 */
var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	status--;
    }
    if (cm.getPlayer().getMapId() == 925100700) {
	cm.removeAll(4001117);
	cm.removeAll(4001120);
	cm.removeAll(4001121);
	cm.removeAll(4001122);
	cm.warp(251010404,0);
	cm.dispose();
	return;
    }
    var em = cm.getEventManager("Pirate");
    if (em == null) {
	cm.sendNext("The event isn't started...");
	cm.dispose();
	return;
    }
    var eim = cm.getPlayer().getEventInstance();
    if (eim == null) {
        cm.warp(925100700);
        cm.dispose();
        return;
    }
    if (!cm.isLeader()) {
	cm.sendNext("흠.. 당신은 파티장이 아니신 것 같군요.");
	cm.dispose();
	return;
    }
    switch(cm.getPlayer().getMapId()) {
	case 925100000:
	   cm.sendNext("저는 도라지 왕 우양의 하인, 구옹이라고 합니다. 해적을 물리치고 도라지 왕 우양님을 구해주세요!");
	   cm.dispose();
	   break;
	case 925100100:
	   var emp = eim.getProperty("stage2");
	   if (emp == null) {
		eim.setProperty("stage2", "0");
		emp = "0";
	   }
	   if (emp.equals("0")) {
		if (cm.haveItem(4001120,20)) {
		    cm.sendNext("#b#t4001120##k를 모두 모아오셨군요. 다음 문제를 해결할 준비가 되면 제게 다시 말을 걸어주세요.");
		    cm.gainItem(4001120,-20);
		    eim.setProperty("stage2", "1");
                    cm.getPlayer().getMap().setMobGen(9300114, false);
                    eim.broadcastPlayerMsg(6, "구옹이 포탈의 첫번째 봉인을 해제했습니다.")
		    cm.killAllMob();
		} else {
                    cm.getPlayer().getMap().setMobGen(9300114, true);
	   	    cm.sendNext("나타나는 해적을 잡고 #b#t4001120##k 20개를 제게 모아오시면 됩니다. 해적이 바로 나타나지 않더라도 잠시만 기다려 보세요. 행운을 빌어요!");
		}
	   } else if (emp.equals("1")) {
		if (cm.haveItem(4001121,20)) {
		    cm.sendNext("#b#t4001121##k를 모두 모아오셨군요. 다음 문제를 해결할 준비가 되면 제게 다시 말을 걸어주세요.");
		    cm.gainItem(4001121,-20);
		    eim.setProperty("stage2", "2");
                    cm.getPlayer().getMap().setMobGen(9300115, false);
                    eim.broadcastPlayerMsg(6, "구옹이 포탈의 두번째 봉인을 해제했습니다.")
		    cm.killAllMob();
		} else {
                    cm.getPlayer().getMap().setMobGen(9300115, true);
	   	    cm.sendNext("나타나는 해적을 잡고 #b#t4001121##k 20개를 제게 모아오시면 됩니다. 해적이 바로 나타나지 않더라도 잠시만 기다려 보세요. 행운을 빌어요!");
		}
	   } else if (emp.equals("2")) {
		if (cm.haveItem(4001122,20)) {
		    cm.sendNext("#b#t4001122##k를 모두 모아오셨군요. 우측에 있는 포탈의 봉인이 풀렸으니 포탈을 통해 다음 맵으로 이동해 주시기 바랍니다.");
		    cm.gainItem(4001122,-20);
		    eim.setProperty("stage2", "3");
                    cm.getPlayer().getMap().setMobGen(9300116, false);
                    eim.broadcastPlayerMsg(6, "구옹이 포탈의 마지막 봉인을 해제했습니다.")
		    cm.killAllMob();
		} else {
                    cm.getPlayer().getMap().setMobGen(9300116, true);
	   	    cm.sendNext("나타나는 해적을 잡고 #b#t4001122##k 20개를 제게 모아오시면 됩니다. 해적이 바로 나타나지 않더라도 잠시만 기다려 보세요. 행운을 빌어요!");
		}
	   } else {
		cm.sendNext("다음 스테이지로 가는 포탈이 열렸습니다.");
	   }
	   cm.dispose();
	   break;
	case 925100200:
	   cm.sendNext("저는 도라지 왕 우양의 하인, 구옹이라고 합니다. 해적을 물리치고 도라지 왕 우양님을 구해주세요!");
	   cm.dispose();
	   break;
	case 925100201:
	   if (cm.getMap().getAllMonstersThreadsafe().size() == 0) {
		cm.sendNext("해적들에게 넘어간 도라지들을 멋지게 혼내주셨군요. 훌륭합니다.");
		if (eim.getProperty("stage2a").equals("0")) {
		    cm.getMap().setReactorState();
		    eim.setProperty("stage2a", "1");
		}
	   } else {
	   	cm.sendNext("이 도라지들은 해적들의 꾀임에 넘어가 도라지 왕 우양님을 배신했습니다. ");
	   }
	   cm.dispose();
	   break;
	case 925100301:
	   if (cm.getMap().getAllMonstersThreadsafe().size() == 0) {
		cm.sendNext("해적들에게 넘어간 도라지들을 멋지게 혼내주셨군요. 훌륭합니다.");
		if (eim.getProperty("stage3a").equals("0")) {
		    cm.getMap().setReactorState();
		    eim.setProperty("stage3a", "1");
		}
	   } else {
	   	cm.sendNext("이 도라지들은 해적들의 꾀임에 넘어가 도라지 왕 우양님을 배신했습니다. ");
	   }
	   cm.dispose();
	   break;
	case 925100202:
	case 925100302:
	   cm.sendNext("해적들을 모두 물리치세요!");
	   cm.dispose();
	   break;
	case 925100400:
	   cm.sendNext("해적들이 계속 나오는 문을 오래된 쇠 열쇠로 잠가버리세요!");
	   cm.dispose();
	   break;
	case 925100500:
	   if (cm.getMap().getAllMonstersThreadsafe().size() == 0) {
		cm.warpParty(925100600);
	   } else {
	   	cm.sendNext("해적들을 모두 물리치세요!");
	   }
	   cm.dispose();
	   break;
    }
}