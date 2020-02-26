
var status = -1;

function action(mode, type, selection) {
    var em = cm.getEventManager("Juliet");
    if (em == null) {
        cm.sendOk("Please try again later.");
        cm.dispose();
        return;
    }
    switch (cm.getPlayer().getMapId()) {
        case 261000021:
            cm.removeAll(4001130);
            cm.removeAll(4001131);
            cm.removeAll(4001132);
            cm.removeAll(4001133);
            cm.removeAll(4001134);
            cm.removeAll(4001135);
            if (cm.getPlayer().getParty() == null || !cm.isLeader()) {
                cm.sendOk("파티가 없으시거나, 혹은 파티장이 아니신 건 아닌가요? 또한 4명의 파티만 입장할 수 있습니다.");
            } else {
                var party = cm.getPlayer().getParty().getMembers();
                var mapId = cm.getPlayer().getMapId();
                var next = true;
                var size = 0;
                var it = party.iterator();
                while (it.hasNext()) {
                    var cPlayer = it.next();
                    var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                    if (ccPlayer == null || ccPlayer.getLevel() < 71 || ccPlayer.getLevel() > 85) {
                        next = false;
                        break;
                    }
                    size += (ccPlayer.isGM() ? 4 : 1);
                }
                if (next && (cm.getPlayer().isGM() || size == 4)) {
                    var prop = em.getProperty("state");
                    if (prop.equals("0") || prop == null) {
                        em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 85);
                    } else {
                        cm.sendOk("이미 이 안에서 다른 파티가 퀘스트에 도전하는 중입니다. 잠시 후 다시 시도해 주세요.");
                    }
                } else {
                    cm.sendOk("파티원 중 레벨 제한 71 ~ 85 에 해당하지 않는 파티원이 있는 것 같군요.");
                }
            }
            break;
        case 926110000:
            cm.sendOk("이 연구실에서 가끔 수상한 소리가 들린다는 소문이 있었어요. 분명 이 근처 어딘가에 수상한 소리의 근원이 있을 거에요.");
            break;
        case 926110001:
            cm.sendOk("모든 몬스터를 물리쳐 주세요!");
            break;
        case 926110100:
            cm.sendOk("이곳의 비커들은 깨져서 내용물이 새고 있답니다. 비커에 내용물이 모두 새기 전에 빠르게 수상한 액체를 채워 넣어주세요.");
            break;
        case 926110200:
            if (cm.isLeader()) {
                if (cm.haveItem(4001130, 1)) {
                    cm.sendOk("이.. 이것은 로미오가 쓴 편지..?");
                    cm.partyMessage(6, "줄리엣은 로미오가 쓴 편지를 보고 생각에 잠겼다.");
                    cm.gainItem(4001130, -1);
                    em.setProperty("stage", "1");
                } else if (cm.haveItem(4001134, 1)) {
                    cm.gainItem(4001134, -1);
                    cm.sendOk("알카드노 실험 자료를 찾아오셨군요! 이제 제뉴미스트 실험 자료를 찾으면 되겠군요.");
                    em.setProperty("stage4", "1");
                } else if (cm.haveItem(4001135, 1) && em.getProperty("stage4").equals("1")) {
                    cm.gainItem(4001135, -1);
                    cm.sendOk("제뉴미스트 실험 자료도 찾아오셨군요. 다음 스테이지로 진행해 주세요.");
                    cm.clearEffect();
                    cm.gainPartyExpPQ(30000, "rnj", 70);
                    em.setProperty("stage4", "2");
                    cm.getPlayer().getMap().setSpawns(false);
                    cm.getPlayer().getMap().killAllMonsters(true);
                    cm.getMap().getReactorByName("jnr3_out3").forceHitReactor(1);
                } else {
                    cm.sendOk("알카드노와 제뉴미스트 사이의 분쟁을 멈추기 위해서는 알카드노와 제뉴미스트의 실험 자료가 필요해요. 알카드노의 실험 자료를 먼저 제게 가져다 주세요.");
                }
            } else {
                cm.sendOk("알카드노와 제뉴미스트 사이의 분쟁을 멈추기 위해서는 알카드노와 제뉴미스트의 실험 자료가 필요해요. 알카드노의 실험 자료를 먼저 제게 가져다 주세요. 또한, 파티장이 제게 말을 걸어주셔야 합니다.");
            }
            break;
        case 926110300:
            cm.sendOk("각 파티원이 각각 연구실을 통해 꼭대기에 있는 중앙 연구실 까지 올라가야 해요.");
            break;
        case 926110400:
            cm.sendOk("준비가 되면, 제 사랑을 구하러 가요.");
            break;
        case 926110401:
            cm.warpParty(926110500); //urete
            break;
        case 926100401:
            cm.sendOk("구해주셔서 진심으로 감사드려요.");
            break;
        case 926100600:
            cm.sendOk("저를 구해주신 모험가님... 진심으로 감사드려요..");
            break;
        case 926110600:
            status++;
            if (status == 0) {
                cm.sendNext("이렇게 유레테도 마음을 고쳐먹었고, 제뉴미스트와 알카드노의 전쟁도 조금은 수그러 들 수 있을까요? 비록 저희 사랑이 이뤄지기까지 아직도 험난한 고난이 기다리고 있지만, 결코 포기하지 않고 로미오를 지키겠습니다.");
                return;
            } else if (status == 1) {
                if (cm.canHold(4001160, 1)) {
                    cm.removeAll(4001130);
                    cm.removeAll(4001131);
                    cm.removeAll(4001132);
                    cm.removeAll(4001133);
                    cm.removeAll(4001134);
                    cm.removeAll(4001135);
                    cm.getPlayer().endPartyQuest(1205);
                    var qr = cm.getQuestRecord(199603);
                    var val = qr.getCustomData();
                    if (val == null) {
                        qr.setCustomData("0");
                    }
                    qr.setCustomData("" + (parseInt(qr.getCustomData()) + 1));
                    cm.gainItem(4001160, 1);
                    cm.warp(926110700, 0);
                } else {
                    cm.sendOk("인벤토리 공간이 부족하신 건 아닌지 확인해 주시겠어요?")
                }
            }
            break;

    }
    cm.dispose();
}