var status = -1;

function start(mode, type, selection) {
}

function end(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        //qm.sendOk("주머니에 손을 넣어 보세요. 당신의 친구는 이미 당신을 찾은 것 같군요.\r\n\r\n#b높이를 알 수 없는 초록색 나무들의 고향. 벛을 머금은 보라색 초롱꽃...확신할 수 없는 미지의 길을 따라 오세요. 이곳에서 당신을 기다리겠습니다...");
        if (qm.getMapId() == 101000200 && qm.getQuestStatus(2230) == 1) {
            qm.sendSimple("드디어 저를 찾아오셨군요...여행자여...자신에게 주어진 책임을 다 했나요?#b\r\n\r\n #L0#저에게 주어진 책임은 무엇이죠? 당신은 누구시죠?#l");
        } else {
            qm.forceStartQuest();
            qm.dispose();
        }
    } else if (status == 1) {
        qm.sendNext("당신의 주머니에 작은 알을 발견하셨나요? 그 알이 바로 당신에게 주어진 책임이랍니다. 세상을 혼자서 살아가기랑 어려운 일이죠. 이럴 때 마음의 친구가 있다면 그 어려움이 줄어든답니다. 펫에 대해 들어 본 적이 있나요?\r\n사람들은 펫을 기르면서 마음의 위안을 얻는 답니다. 하지만 모든 일에는 대가와 책임이 따르듯이...");
    } else if (status == 2) {
        qm.sendNext("펫을 키우는 데는 책임감이 필요하답니다. 펫도 하나의 생명이기 때문이죠. 먹이도 주고, 이름도 지어주고, 정신적 교감을 나누면서 친밀감을 형성하면서 모험의 친구가 되어주고 마음의 위로를 얻는 사람들이 많답니다.");
    } else if (status == 3) {
        qm.sendNext("당신에게 그런 마음을 알려드리고 싶어서 제가 아끼는 아이를 보내드렸답니다. 당신이 가지고 오신 그 알은 마법의 힘을 가지고 태어나는 #b룬 달팽이#k의 알이랍니다. 당신이 여기까지 소중하게 지켜서 가져와 주셨기 때문에 곧 부화하게 될거에요.");
    } else if (status == 4) {
        qm.sendNext("룬 달팽이는 아주 재주가 많답니다. 아이템과 메소를 줍기도 하고 HP회복 물약과 MP회복 물약을 먹어주기도 하죠. 아주 똑똑하거든요. 하지만 룬 달팽이는 마력의 힘으로 태어나기 때문에 수명이 아주 짧답니다. 수명이 지나면 인형으로 변해버리고 다시 살려낼 수도 없죠.");
    } else if (status == 5) {
        qm.sendYesNo("이해하시겠어요? 모든 일에는 책임이 따르듯이 펫도 마찬가지랍니다. 이제 곧 달팽이의 알이 부화하겠군요.");
    } else if (status == 6) {
        if (selection == 0) {
            qm.sendOk("아직 마음의 준비가 되지 않으셨나요? 곧 알이 부화하니 빨리 다시 찾아와 주세요.");
            qm.dispose();
        } else {
            qm.sendNext("이 달팽이의 수명은 고작 #b5시간#k이랍니다. 많이 사랑해 주세요. 그러면 분명 당신도 얻는 것이 있을거에요.");
            qm.gainPet(5000054, "달팽이", 1, 0, 100, 18000, 101); // rune snail * 1
            if (qm.haveItem(4032086, 1)) {
                qm.gainItem(4032086, -1); // Mysterious Egg * -1
            }
            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}