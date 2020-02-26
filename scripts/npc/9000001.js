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
 * NPCID : 9000001
 * ScriptName : Event00
 * NPCNameFunc : 쟝 - 이벤트 도우미
 * Location : 108000202 (히든스트리트 - 마법사의나무던전)
 * Location : 108000200 (히든스트리트 - 마법사의나무던전)
 * Location : 108000201 (히든스트리트 - 마법사의나무던전)
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var menu = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        var selfy = "형";
        if (cm.getNpc() == 9000001) {
            selfy = "동생들";
        }
        cm.sendSimple("안녕? 난 #b#p"+cm.getNpc()+"##k이야. "+selfy+"과 함께 이벤트에 참가하려고 왔는데 "+selfy+"을 "+
            "잃어버리고 말았어. 바쁘지 않으면 나와 함께 이벤트에 참가하지 않을래?\r\n"+
            "\r\n#b#L0# 어떤 이벤트인데?#l\r\n#L1# 이벤트 게임에 대해 설명해 줘.#l\r\n#L2# 그래! 나랑 같이 가자.#l");
    } else if (status == 1) {
        menu = selection;
        if (menu == 0) {
            cm.sendOk("이번 이벤트는 방학을 기념해서 열리는 이벤트야. 방 안에만 콕! 박혀있으면 건강에 좋지 않겠지? 신나는 방학 이벤트로  즐거움을 느껴보라구~ 이벤트 일정은 홈페이지에서 확인해보도록 해~ 이벤트에서 우승하면 여러가지 아이템과 메소를 받아 갈 수 있어. 이벤트 참가자 전원에게는 기념트로피가 주어지고 우승하신 분에게는 특별한 상품이 주어지니까 힘내라고!");
            cm.safeDispose();
        } else if (menu == 1) {
            cm.sendSimple("여러 가지 이벤트가 준비되어 있어. 미리 게임 방법을 알아두면 여러 모로 좋겠지? 설명을 듣고 싶은 게임을 골라봐~!\r\n#b#L0# 올라올라#l\r\n#L1# 고지를 향해서#l\r\n#L2# 눈덩이 굴리기#l\r\n#L3# 코코넛 시즌#l\r\n#L4# 스피드 OX 퀴즈#l\r\n#L5# 보물찾기#l");
        } else if (menu == 2) {
            var marr = cm.getQuestRecord(160205);
            if (marr.getCustomData() == null) {
                marr.setCustomData("0");
            }
            var dat = parseInt(marr.getCustomData());
            if (dat + 86400000 >= cm.getCurrentTime()) {
                cm.sendNext("아직 이벤트가 시작되지 않았거나, 이미 악마의 문서를 가지고 있거나, 오늘 벌써 이벤트에 한 번 참가한 적이 있거나, 선착순 인원이 마감되었을 경우에는 이벤트에 참가할 수 없어. 다음에 같이 놀자~");
            } else if (!cm.canHold()) {
                cm.sendNext("인벤토리 공간을 비운 후에 이벤트에 참여할 수 있어.");
            } else if (cm.getChannelServer().getEvent() > -1 && !cm.haveItem(4031019)) {
                cm.saveReturnLocation("EVENT");
                cm.getPlayer().setChalkboard(null);
                marr.setCustomData("" + cm.getCurrentTime());
                cm.warp(cm.getChannelServer().getEvent(), cm.getChannelServer().getEvent() == 109080000 || cm.getChannelServer().getEvent() == 109080010 ? 0 : "join00");
            } else {
                cm.sendNext("아직 이벤트가 시작되지 않았거나, 이미 악마의 문서를 가지고 있거나, 오늘 벌써 이벤트에 한 번 참가한 적이 있거나, 선착순 인원이 마감되었을 경우에는 이벤트에 참가할 수 없어. 다음에 같이 놀자~");
            }
            
            cm.dispose();
        }
    } else if (status == 2) {
        if (selection == 0) {
            cm.sendOk("[올라올라]는 사다리타기와 비슷한 방식의 게임#k입니다. 사다리를 타고 올라가서 여러 개의 포탈 중 하나를 선택해 다음 단계로 이동하는 방식입니다.\r\n\r\n관문은 총 3단계로 이루어져 있고 #r제한시간은 6분#k입니다. [올라올라] 게임 내에서는 #b점프와 텔레포트, 헤이스트, 속도향상에 영향을 주는 물약, 아이템 등의 사용이 불가능#k 합니다. 포탈 중에는 다른 곳으로 이동이 되는 함정 포탈도 있으니 주의하세요.");
        } else if (selection == 1) {
            cm.sendOk("#b[고지를 향해서] 게임은 일종의 장애물 달리기 게임#k입니다. 메이플스토리에 있는 인내의 숲이나 끈기의 숲을 생각하시면 됩니다. 여러가지 난관을 극복하고 제한 시간내에 마지막까지 도달하면 우승하게 됩니다.\r\n\r\n게임단계는 총 4단계이고, #b제한 시간은 15분#k입니다. [고지를 향해서] 게임에서는 텔레포트, 헤이스트 사용이 불가능 합니다.");
        } else if (selection == 2) {
            cm.sendOk("#b[눈덩이 굴리기]#k는 메이플팀과 스토리팀 2팀으로 나뉘어져 #b어느 쪽이 눈덩이를 많이 굴렸는지에 따라 승부가 결정되는 게임#k입니다. 정해진 시간동안 승부가 나지 않을 경우엔 종료 시점에서 눈덩이를 더 많이 굴린 쪽이 우승하게 됩니다.\r\n\r\n눈덩이에 다가가 공격(Ctrl키)을 하면 눈덩이가 천천히 앞으로 굴러 갑니다.  원거리 공격과 모든 스킬 공격은 소용이 없으며 오로지 #r근접 공격만 가능#k합니다.\r\n\r\n캐릭터가 눈덩이에 닿으면 다시 시작점으로 자동 소환됩니다.  시작점에 있는 눈사람을 공격하면 상대편 공이 앞으로 가는 것을 막을 수 있습니다. 눈덩이를 공격할 지 눈사람을 공격할 지 팀과 작전을 잘 짜보세요.");
        } else if (selection == 3) {
            cm.sendOk("#b[코코넛 시즌]#k은 메이플팀과 스토리팀으로 나뉘어져 #b제한시간 내에 코코넛을 많이 따는 팀이 승리하는 게임#k입니다. 게임의 #r제한 시간은 총 5분#k입니다. 첫 경기에서 [무승부]가 될 때는 제한시간 2분이 추가됩니다. 다시 점수가 동일한 경우, 승자없이 무승부로 게임이 종료됩니다.\r\n\r\n원거리 공격, 스킬 공격은 불가능하고 오로지 #r근접 공격만 가능#k합니다. 근접 공격무기가 없을 경우 이벤트 맵 내부의 NPC를 통해 무기의 구입이 가능합니다. 캐릭터 레벨, 무기와 옵션에 상관없이 모두 동일한 타격치가 적용됩니다.\r\n\r\n맵의 곳곳에 장애물과 함정이 있습니다. 캐릭터가 죽을 경우 이벤트 게임에서 탈락 처리 됩니다. 코코넛은 떨어지기 직전 마지막 한 대를 때린 이의 팀이 획득한 것으로 점수에 적용됩니다. 떨어지는 것만 점수에 포함되며 떨어지지 않는 것, 터지는 것은 점수에 포함되지 않습니다. 맵의 아래쪽 소라에는 숨겨진 포탈도 있으니 잘 활용해보세요.");
        } else if (selection == 4) {
            cm.sendOk("#b[스피드 OX 퀴즈]#k는 출제하는 문제의 정답을 OX로 맞추는 게임입니다. 이벤트 게임에 참여하시면 키보드의 M을 눌러 미니맵을 켜 O와 X의 위치를 확인합니다. 주어지는 문제를 모두 맞추면 우승자가 됩니다.\r\n\r\n문제가 출제되면 정답이라고 생각되는 위치로 사다리를 타고 내려갑니다. 제한시간 내에 정답을 선택해야 하며, 정답을 선택하지 않거나 사다리에 매달려 있으면 채점시 자동으로 탈락 처리 됩니다. 반드시 화면에 [정답]이 사라질 때까지 기다리셨다 이동해 주세요.");
        } else if (selection == 5) {
            cm.sendOk("#b[보물찾기]#k 게임은 각 필드에 숨겨진 #b보물문서#k를 #r제한 시간 10 분#k 이내에 찾아내는 게임입니다. 곳곳에 신비한 보물상자들이 숨겨져 있습니다. 이 보물상자들을 부수면 여러 가지 아이템들이 나오며 그 중 목표가 되는 것은 보물문서입니다.\r\n\r\n보물상자는 #b일반 공격#k으로만 부술 수 있으며 그 안에서 나온 아이템들 중 보물문서는 교환을 담당하는 NPC에게 가져다 주면 악마의 문서로 교환을 할 수 있습니다. 교환을 해주는 NPC는 보물찾기 맵 안에도 있으며 리스항구의 #b[바이킨]#k에게 부탁해도 됩니다.\r\n\r\n이 게임에는 숨겨진 포탈, 숨겨진 텔레포트 장소가 존재합니다. 이 같은 장소를 이용하여 이동을 하고자 할 때에는 특정 장소에서 #b방향키 ↑#k를 누르시면 됩니다. 숨겨진 계단이나 밧줄도 존재하니 보이지 않는 곳에서 점프도 해 보시기 바랍니다. 물론, 숨겨진 장소로 보내주는 보물상자도 있으며 이동 된 곳에서만 발견할 수 있는 보물상자도 있습니다.\r\n\r\n보물찾기 게임에서는 특정 스킬들의 사용이 #r불가능#k하니 반드시 일반 공격으로 보물상자를 부서뜨리기 바랍니다.");
        }
        cm.safeDispose();
    }
}