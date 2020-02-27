/*
 * NPCID : 22000
 * ScriptName : begin7
 * NPCNameFunc : 샹크스
 * Location : 60000 (메이플로드 - 사우스페리)
 */

var status = 0;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (status >= 0 && mode == 0) {
			cm.sendOk("흠.. 아직 이 곳에서 할 일이 남았나 보지?");
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendYesNo("이 배를 타면 더 넓은 대륙으로 내려갈 수 있지. 150메소에 #b빅토리아 아일랜드#k로 데려다 줄게. 대신 한 번 여길 떠나면 다시는 돌아올 수 없어. 어때? 빅토리아 아일랜드로 가고 싶어? 가고 싶다면 지금 바로 데려다 줄 수 있지.");
		} else if (status == 1) {
			if (cm.haveItem(4031801)) {
				cm.sendNext("좋아. 그럼 어서 150메소를 줘... 응? 그건 암허스트의 장로 루카스님의 추천서잖아? 뭐야, 이런 게 있었으면 진작 말을 했어야지. 루카스님이 추천할 정도로 재능 있는 모험가에게 돈을 받을 정도로 이 샹크스가 매정하지는 않다고!");
			} else {
				cm.sendNext("여긴 지루해졌지? 그럼 일단 150 메소부터 받고...");
			}
		} else if (status == 2) {
			if (cm.haveItem(4031801)) {
				cm.sendNextPrev("추천서를 가지고 있으니, 특별히 요금은 면제해 줄게. 이제 빅토리아 아일랜드로 출발한다! 흔들릴지도 모르니 꽉 잡아!");
			} else {
				if (cm.haveItem(4031801, 0)) {
					if (cm.getMeso() < 150) {
						cm.sendOk("뭐야? 돈도 없으면서 가겠다고 한거야? 이상한 녀석이로군!");
						cm.dispose();
					} else {
						cm.sendNext("오케이! 150메소도 받았겠다. 지금 바로 출발한다, 꽉 잡아!");
					}
				} else {
					cm.sendOk("오늘 출항하기엔 바람이 너무 세게 부는걸?");
					cm.dispose();
				}
			}
		} else if (status == 3) {
			if (cm.haveItem(4031801)) {
				cm.gainItem(4031801, -1);
				cm.warp(104000000);
				cm.dispose();
			} else {
				cm.gainMeso(-150);
				cm.warp(104000000);
				cm.dispose();
			}
		}
	}
}



