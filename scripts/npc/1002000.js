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
 * NPCID : 1002000
 * ScriptName : rithTeleport
 * NPCNameFunc : 필
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * 
 * @author T-Sun
 *
 */
var status = 0;
var maps = Array(102000000, 101000000, 100000000, 103000000, 120000000);
var cost = Array(1200, 1200, 800, 1000, 1000);
var costBeginner = Array(120, 120, 80, 100, 100);
var selectedMap = -1;
var sCost;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status >= 27 && mode == 0) {
	cm.sendNext("이 마을에도 볼거리가 가득하다구. 다른 마을로 이동하고 싶어지면 언제든지 나한테 말을 걸어줘. 알았지?");
	cm.dispose();
	return;
    } else if (((status == 1 || status == 2 || status == 26) && mode == 0) || ((status == 6 || status == 9 || status == 12 || status == 15 || status == 18 || status == 21) && mode == 1)) {
	cm.dispose();
	return;
    }
    if (mode == 1)
	status++;
    else
	status--;
    if (status == 0) {
	cm.sendNext("다른 마을로 가보고 싶은건가? 약간의 돈만 내면 이 내가 힘을 좀 써보지... 하하하~! 좀 비싸긴 하지만... 초보자에게는 특별히 90% 세일가로 해주고 있어.");
    } else if (status == 1) {
	cm.sendSimple("이곳이 처음이라면 어리둥절 하겠지. 나에게 뭔가 물어봐도 좋아.\r\n#L0##b빅토리아 아일랜드에는 어떤 마을들이 있나요?#l\r\n#L1#다른 마을로 보내주세요.#k#l");
    } else if (status == 2) {
	if (selection == 0) {
	    cm.sendSimple("빅토리아 아일랜드에는 7개의 큰 마을이 있어. 어떤 마을에 대해 설명해 줄까?\r\n#L0##b리스항구#l\r\n#L1#페리온#l\r\n#L2#엘리니아#l\r\n#L3#헤네시스#l\r\n#L4#커닝시티#l\r\n#L6#슬리피우드#k#l\r\n#L7#노틸러스 선착장#k#l");
	} else if (selection == 1) {
	    status = 26;
	    if (cm.getJob() == 0) {
		var selStr = "초보자에게는 특별히 90% 세일 가격으로 보내주고 있어. 자, 어떤 마을로 가보고 싶어?#b";
		for (var i = 0; i < maps.length; i++) {
		    selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + costBeginner[i] + " 메소)#l";
		}
	    } else {
		var selStr = "어라? 넌 초보자가 아니로군? 그렇다면 요금을 전부 다 받아야 겠는걸? 자, 어떤 마을로 가보고 싶어?#b";
		for (var i = 0; i < maps.length; i++) {
		    selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + cost[i] + " 메소)#l";
		}
	    }
	    cm.sendSimple(selStr);
	}
    } else if (status == 3) {
			if (selection == 0) {
				status = 4;
				cm.sendNext("#b리스항구#k에 대해 설명해 주지. 메이플 아일랜드에서 빅토리아 호를 타고 도착한 곳... 즉, 지금 우리가 있는 이 마을이 바로 리스항구야. 메이플 아일랜드에서 온 많은 초보자들이 이곳에서 본격적인 여행을 시작하고 있어.");
			} else if (selection == 1) {
				status = 7;
				cm.sendNext("#b페리온#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 북쪽 고원에 위치한 전사들의 마을로 황량한 바위산이 마을을 둘러싸고 있어. 기후가 좋지 않기 때문에 강한 체력을 가진 전사들 외에는 살 수가 없는 곳이지.");
			} else if (selection == 2) {
				status = 10;
				cm.sendNext("#b엘리니아#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 동쪽 숲속에 위치한 마법사들의 마을로 신비롭고 울창한 나무들이 겹겹이 쌓여 있어. 인간을 싫어하는 요정들도 함께 살고 있기 때문에 문제를 일으키지 않도록 조심하는 편이 좋아.");
			} else if (selection == 3) {
				status = 13;
				cm.sendNext("#b헤네시스#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 남쪽 초원에 위치한 궁수들의 마을로 초원과 깊은 숲 사이 평지에 만들어진 마을이야. 기후도 알맞고 모든 것이 풍요로운 살기 좋은 마을이지. 한 번쯤 꼭 가보라구.");
			} else if (selection == 4) {
				status = 16;
				cm.sendNext("#b커닝시티#k에 대해 설명해 주지. 빅토리아 아일랜드 북서쪽에 위치한 도적들의 마을로 뭔가 요상한 느낌의 건물들이 들어선 곳이야. 뭔가 검은 구름이 끼어 있긴 한데 가끔씩 높은 곳에서 볼 수 있는 그 곳의 석양은 정말 아름답다구.");
			} else if (selection == 5) {
				status = 19;
				cm.sendNext("#b노틸러스 선착장#k에 대해 설명해 주지. 빅토리아 아일랜드 엘리니아와 헤네시스 사이의 근해에 정박하고 있는 잠수함이지. 들어가보면 해적의 소굴이라고. 이 리스항구에서 보이는 넓고 아름다운 바다를 이 곳에서도 볼 수 있지.");
			} else if (selection == 6) {
				status = 22;
				cm.sendNext("#b슬리피우드#k에 대해 설명해 주지. 빅토리아 아일랜드의 남동쪽에 위치한 깊은 숲 마을이야. 대충 헤네시스와 개미굴 던전 중간에 있다고 생각하면 쉽지. 호텔이 있어서 던전에서 피로해진 몸을 쉬게할 수 있는 조용한 마을이야.");
			}
		} else if (status == 4) {
			cm.sendNext("#b리스항구#k에 대해 설명해 주지. 메이플 아일랜드에서 빅토리아 호를 타고 도착한 곳... 즉, 지금 우리가 있는 이 마을이 바로 리스항구야. 메이플 아일랜드에서 온 많은 초보자들이 이곳에서 본격적인 여행을 시작하고 있어.");
		} else if (status == 5) {
			cm.sendNextPrev("빅토리아 아일랜드의 가장 서쪽에 위치하고 있고 항구인 만큼 뒤로 넓은 바다가 펼쳐져 있는 조용한 마을이지. 마을 사람들이 대부분 어부 출신이라서 무섭게 보일지도 모르지만 실제로 말을 걸어보면 친절하게 대해 줄거야.");
		} else if (status == 6) {
			cm.sendNextPrev("마을 주변에는 평화로운 초원이 펼쳐져 있지. 대부분 작고 비교적 온순한 몬스터들이 많아서 초보자들에게는 안성맞춤인 곳이야. 아직 전사, 마법사, 궁수, 도적, 해적 중 하나로 전직하지 못했다면 이 주변에서 좀 더 레벨을 높혀두는 것이 좋을거야.");
		} else if (status == 7) {
			cm.sendNext("#b페리온#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 북쪽 고원에 위치한 전사들의 마을로 황량한 바위산이 마을을 둘러싸고 있어. 기후가 좋지 않기 때문에 강한 체력을 가진 전사들 외에는 살 수가 없는 곳이지.");
		} else if (status == 8) {
			cm.sendNextPrev("고원 주변에는 바짝 마른 나무, 고원을 질주하는 멧돼지, 섬전역에 서식하고 있는 원숭이들이 서식하고 있고 깊은 계곡으로 들어가면 큰 체구와 엄청난 힘을 자랑하는 용을 볼 수 있어. 하지만 섣불리 들어가지 않는 편이 좋을거야.");
		} else if (status == 9) {
			cm.sendNextPrev("만일 #b전사#k가 되고 싶다면 페리온의 장로인 #r주먹펴고 일어서#k님을 찾아가 보도록 해. 레벨 10 이상에 STR이 어느 정도 높다면 전사로 만들어 줄지도 몰라. 능력이 안된다면 열심히 사냥을 해서 단련하는 수 밖에 없다구~");
		} else if (status == 10) {
			cm.sendNext("#b엘리니아#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 동쪽 숲속에 위치한 마법사들의 마을로 신비롭고 울창한 나무들이 겹겹이 쌓여 있어. 인간을 싫어하는 요정들도 함께 살고 있기 때문에 문제를 일으키지 않도록 조심하는 편이 좋아.");
		} else if (status == 11) {
			cm.sendNextPrev("숲 주변에는 초록빛 슬라임, 걸어다니는 버섯, 원숭이와 좀비가 된 원숭이들이 서식하고 있고 깊은 숲으로 들어가 보면 빗자루를 타고 날아다니는 마녀를 볼 수도 있어. 하지만 왠만큼 강하지 않다면 마녀에게 접근하지 않는 편이 좋을거야.");
		} else if (status == 12) {
			cm.sendNextPrev("만일 #b마법사#k가 되고 싶다면 엘리니아의 대 마법사인 #r하인즈#k님을 찾아가 보도록 해. 레벨 8 이상에 INT가 어느 정도 높다면 마법사로 만들어 줄지도 몰라. 능력이 안된다면 열심히 사냥을 해서 단련하는 수 밖에 없다구~");
		} else if (status == 13) {
			cm.sendNext("#b헤네시스#k에 대해 설명해 주지. 빅토리아 아일랜드 가장 남쪽 초원에 위치한 궁수들의 마을로 초원과 깊은 숲 사이 평지에 만들어진 마을이야. 기후도 알맞고 모든 것이 풍요로운 살기 좋은 마을이지. 한 번쯤 꼭 가보라구.");
		} else if (status == 14) {
			cm.sendNextPrev("초원 주변에는 달팽이, 버섯, 돼지 등 비교적 약한 몬스터들이 많이 살고 있어. 그런데 소문에 의하면 마을 어딘가에서 연결된 돼지의 공원의 가장 깊은 곳에서 엄청나게 거대하고 강한 머쉬맘이라는 버섯이 가끔 나타나는 모양이야.");
		} else if (status == 15) {
			cm.sendNextPrev("만일 #b궁수#k가 되고 싶다면 헤네시스의 수호신과 같은 존재인 #r헬레나#k님을 찾아가 보도록 해. 레벨 10 이상에 DEX가 어느정도 높다면 궁수로 만들어 줄지도 몰라. 능력이 안된다면 열심히 사냥을 해서 단련하는 수 밖에 없다구~");
		} else if (status == 16) {
			cm.sendNext("#b커닝시티#k에 대해 설명해 주지. 빅토리아 아일랜드 북서쪽에 위치한 도적들의 마을로 뭔가 요상한 느낌의 건물들이 들어선 곳이야. 뭔가 검은 구름이 끼어 있긴 한데 가끔씩 높은 곳에서 볼 수 있는 그 곳의 석양은 정말 아름답다구.");
		} else if (status == 17) {
			cm.sendNextPrev("커닝시티에서는 여러 가지 던전으로 들어갈 수 있어. 악어나 뱀이 나오는 늪지대로 갈 수 있는가 하면 유령과 박쥐가 나오는 지하철도 있다고 하더군. 지하 깊은곳의 거대한 레이스는 용과 비슷할 정도로 강하고 무서운 존재라고 하더라구.");
		} else if (status == 18) {
			cm.sendNextPrev("만일 #b도적#k이 되고 싶다면 커닝시티의 어둠의 주인인 #r다크로드#k님을 찾아가 보도록 해. 레벨 10 이상에 DEX가 어느 정도 높다면 도적으로 만들어 줄지도 몰라. 능력이 안된다면 열심히 사냥을 해서 단련하는 수 밖에 없다구~");
		} else if (status == 19) {
			cm.sendNext("#b노틸러스 선착장#k에 대해 설명해 주지. 빅토리아 아일랜드 엘리니아와 헤네시스 사이의 근해에 정박하고 있는 잠수함이지. 들어가보면 해적의 소굴이라고. 이 리스항구에서 보이는 넓고 아름다운 바다를 이 곳에서도 볼 수 있지.");
		} else if (status == 20) {
			cm.sendNextPrev("노틸러스 선착장은 헤네시스와 엘리니아 사이에 있기 때문에 조금만 밖으로 나오면 두 마을주변 경관을 모두 즐길 수 있지. 거기다가 마을의 해적들은 언제나 유쾌하고 친절하다고.");
		} else if (status == 21) {
			cm.sendNextPrev("만일 #b해적#k이 되고 싶다면 노틸러스 선착장의 선장인 #r카이린#k님을 찾아가 보도록 해. 레벨 10 이상에 DEX가 어느 정도 높다면 해적으로 만들어 줄지도 몰라. 능력이 안된다면 열심히 사냥을 해서 단련하는 수 밖에 없다구~");
		} else if (status == 22) {
			cm.sendNext("#b슬리피우드#k에 대해 설명해 주지. 빅토리아 아일랜드의 남동쪽에 위치한 깊은 숲 마을이야. 대충 헤네시스와 개미굴 던전 중간에 있다고 생각하면 쉽지. 호텔이 있어서 던전에서 피로해진 몸을 쉬게할 수 있는 조용한 마을이야.");
		} else if (status == 23) {
			cm.sendNextPrev("호텔 앞에는 #r크리슈라마#k라고 하는 정체를 알수 없는 늙은 승려가 있다고 하더군. 여행자들로부터 재료를 받아서 뭔가를 만들어 준다고 들었는데 자세한 것은 나도 잘 모르겠어. 언젠가 그곳에 들를 일이 있다면 내 대신 살펴봐 줘.");
		} else if (status == 24) {
			cm.sendNextPrev("슬리피우드에서 동쪽으로 가면 빅토리아 아일랜드 가장 깊은 곳까지 이어져 있는 개미굴 던전이야. 사납고 흉폭한 몬스터들이 많아서 섣불리 들어갔다가는 시체가 되어 나올지도 모르니까 조심하라구. 들어가기 전에는 확실히 준비하는 거야.");
		} else if (status == 25) {
			cm.sendNextPrev("그리고 이건 들은 건데 말야... 슬리피우드에는 어딘가로 연결되는 숨은 입구가 있다고 하더군. 안으로 들어가면 깊은 곳에서 살아있는 검은 돌덩어리를 볼 수 있다고 해. 사실인지 아닌지 언제 한번 나도 들어가서 직접 확인해 보고 싶어.");
		} else if (status == 26) {
			cm.dispose();
    } else if (status == 27) {
	if (cm.getJob() == 0) {
	    sCost = costBeginner[selection];
	} else {
	    sCost = cost[selection];
	}
	cm.sendYesNo("이곳에서 더 이상 볼일이 없는 모양이로군. 정말로 #b#m" + maps[selection] + "##k 마을로 이동하고 싶은거야? 음 ..#b" + sCost + " 메소#k만 내면 보내주지. 어때?");
	selectedMap = selection;
    } else if (status == 28) {
	if (cm.getMeso() < sCost) {
	    cm.sendNext("메소가 부족한걸? 좀더 모아서 가져오라고~ 그 만큼 강해졌다면 그 정도 돈은 있을 거 아냐~");
	} else {
	    cm.gainMeso(-sCost);
	    cm.warp(maps[selectedMap], 0);
	}
	cm.dispose();
    }
}