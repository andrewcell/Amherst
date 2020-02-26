
var bb = new Array(1,2,3,4,5);
var bbr = Math.floor(Math.random()*bb.length);

var status = -1;
var sel;

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1)
        status++;
    else
        status--;
    if (status == 0) {
        cm.sendSimple("어흥! 나는 몹시 배가 고파.. 월묘가 만든 #b월묘의 떡#k을 내게 가져 와.#b\r\n#L0#떡을 가져왔어요!#l\r\n#L1#여기서 무얼 하죠?#l\r\n#L2#퀘스트를 포기하고 나갑니다.#l#k");
    } else if (status == 1) {
        sel = selection;
        if (selection == 0) {
            if (!cm.isLeader()) {
                cm.sendNext("어흥! 넌 파티장이 아니잖아?");
                cm.dispose();
            } else {
                if (cm.haveItem(4001101, 10)) {
                    cm.sendNext("오 이것은 월묘가 만든 떡이 아닌가? 어서 내게 떡을 주게나.")
                    //					cm.achievement(100);
                    //					cm.gainItem(4001101, -10);
                    //					cm.givePartyExp_PQ(70, 1.5);
                    //					cm.givePartyNX(250);
                    //					cm.addPartyTrait("will", 5);
                    //					cm.addPartyTrait("sense", 1);
                    //					cm.endPartyQuest(1200);
                    //					cm.warpParty(910010300);
                } else {
                    cm.sendNext("어흥! 어서 월묘가 만든 떡을 내게 가져와!");
                    cm.dispose();
                }
            }
        } else if (selection == 1) {
            cm.sendNext("이곳은 보름달이 차면 월묘들이 떡을 만드는 달맞이 꽃이라네. 보름달이 뜨기 위해서는 달맞이꽃 씨앗을 종류별로 6개를 모아, 올바른 위치에 심으면 된다네. 보름달이 뜨고 월묘가 등장하면 다른 몬스터들로 부터 월묘를 보호하고 월묘가 만들어 내는 떡을 파티장이 내게 #b10개#k 가져오면 된다네. 만약 월묘를 지키지 못하면 퀘스트는 실패하고 나는 몹시 배가 고파지고.. 너희를 잡아먹을지도 모르지! 어흥!");
            cm.dispose();
        } else if (selection == 2) {
            cm.sendYesNo("어흥! 정말 이곳에서 나가고 싶어?");
        }
    } else if (status == 2) {
        if (sel == 0) {
            cm.sendNext("냠냠 정말 맛있군. 그럼 다음에도 나를 찾아와 #b월묘의 떡#k을 구해주게. 그럼 잘 가게.");
            var em = cm.getEventManager("HenesysPQ");
            if (!em.getProperty("clear").equals("1")) {
                cm.showEffect(true, "quest/party/clear");
                cm.playSound(true, "Party1/Clear");
                cm.givePartyExp(1600);
                cm.gainItem(4001101, -10);
                em.setProperty("clear", "1");
                var it = cm.getPlayer().getParty().getMembers().iterator();
                while (it.hasNext()) {
                    var cPlayer = it.next();
                    var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                    if (ccPlayer != null) {
                        ccPlayer.endPartyQuest(1200);
                    }
                }
            }
        } else if (sel == 2) {
            if (!cm.isPlayerInstance()) {
                cm.warp(910010300);
            } else {
                //                var eim = cm.getEventInstance();
                if (cm.isLeader()) {
                    cm.warpParty_Instanced(910010300, 0);
                } else {
                    cm.warp(910010300);
                }
            }
            cm.dispose();
        }
    } else if (status == 3) {
	if (bb[bbr] == 1 || bb[bbr] == 2 || bb[bbr] == 4 || bb[bbr] == 5) { 
        var bonus = false;
	} else {
        var bonus = true;
	}
        cm.warpParty_Instanced(bonus ? 910010100 : 910010400, 0);
        cm.dispose();
    }
}