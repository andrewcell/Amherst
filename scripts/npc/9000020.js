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
 * NPCID : 9000020
 * ScriptName : world_trip
 * NPCNameFunc : 스피넬 - 세계여행가이드
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 260000000 (버닝로드 - 아리안트)
 * Location : 500000000 (태국 - 플로팅 마켓)
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * Location : 740000000 (대만 - 서문정)
 * Location : 102000000 (빅토리아로드 - 페리온)
 * Location : 800000000 (일본 - 버섯신사)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 701000000 (중국 - 상해와이탄)
 * Location : 101000000 (빅토리아로드 - 엘리니아)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 100000000 (빅토리아로드 - 헤네시스)
 * 
 * @author T-Sun
 *
 */
var maps = [
{
    'map':500000000, 
    'name' : "태국 플로팅 마켓", 
    'tail' : "#k으"
},
{
    'map':740000000, 
    'name' : "대만 서문정", 
    'tail' : "#k으"
},
{
    'map':800000000, 
    'name' : "일본 버섯신사", 
    'tail' : "#k"
},
{
    'map':701000000, 
    'name' : "중국 상해와이탄", 
    'tail' : "#k으"
}
]
var status = -1;
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
    if (cm.getMapId() / 100000000 >= 5) {
        if (status == 0) {
            var str = "안녕하세요~ 새로운 세계로 여행을 떠나보고 싶으세요? 그렇다면 저희 세계여행 서비스를 이용해보시기 바랍니다! 어디로 여행해보고 싶으세요? 초보자에게는 특별히 90% 할인된 요금으로 제공해드립니다.\r\n#b";
            str += "#L0# 이전에 있던 #m" + cm.getSavedLocation("WORLDTOUR") + "# 마을로 돌아갑니다.#l\r\n";
            cm.sendSimple(str)
        } else if (status == 1) {
            cm.sendYesNo("정말 이전에 계시던 #b#m" + cm.getSavedLocation("WORLDTOUR") + "##k 마을로 돌아가시고 싶으세요? 돌아가는 요금은 무료이며 저를 통해 언제든지 이곳으로 다시 여행하실 수 있답니다. 지금 돌아가고 싶으세요?");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("아직 이곳에 볼일이 남아 있으신가보죠? 여행을 떠나고 싶으시다면 언제든지 제게 다시 찾아와 주세요.");
                cm.dispose();
		return;
            } 
            cm.warp(cm.getSavedLocation("WORLDTOUR"));
            cm.clearSavedLocation("WORLDTOUR");
            cm.dispose();
        }
    } else {
        if (status == 0) {
            var str = "안녕하세요~ 새로운 세계로 여행을 떠나보고 싶으세요? 그렇다면 저희 세계여행 서비스를 이용해보시기 바랍니다! 어디로 여행해보고 싶으세요? 초보자에게는 특별히 90% 할인된 요금으로 제공해드립니다.\r\n#b";
            for (var i = 0; i < maps.length; ++i) {
                str += "#L" + i + "# " + maps[i]['name'] + "#l\r\n";
            }
            cm.sendSimple(str)
        } else if (status == 1) {
            if (cm.getJob() == 0) {
                price = 300;
            } else {
                price = 3000;
            }
            selected = maps[selection];
            cm.sendYesNo("정말 #b" + selected['name'] + selected['tail'] + "로 여행을 떠나보시고 싶으세요? 요금은 #b" + price + "#k 메소이며, 저를 통해 언제든지 이곳으로 다시 돌아오실 수 있습니다.");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendOk("아직 이곳에 볼일이 남아 있으신가보죠? 여행을 떠나고 싶으시다면 언제든지 제게 다시 찾아와 주세요.");
                cm.dispose();
            } else {
                if (cm.getMeso() >= price) {
                    cm.gainMeso(-price);
                    cm.saveLocation("WORLDTOUR");
                    cm.warp(selected['map']);
                    cm.dispose();
                } else {
                    cm.sendOk("흐음. 메소가 부족하신 것 같은데요? 요금이 없으시다면 선택하신 곳으로 보내드릴 수 없답니다.");
                    cm.dispose();
                }
            }
        }
    }
}