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
 * Quest ID : 3314
 * Quest Name : 생명연금, 그리고 실종된 연금술사
 * Quest Progress Info : #p2111009#은 그의 일을 많이 도와줘서 고맙다며 위쪽 연구실에 있는 책상에 가서 거기에 있는 약을 먹으라고 했다. 그리고 약의 효과가 없어지기 전에 오라는데... 잠깐, 이거 인체실험 아니야?!
 * Quest End Info : 역시 약은 위험한 것이었다! 다행히도 해독약은 받았지만 어쨌든 위험하잖아 이건! 러셀론의 말에 따르면 그가 지금 하고 있는 연구는, 예전 그의 친구였던 #b실종된 연금술사#k와 함께 하던 것이라고 한다. 실종된 연금술사는 인체의 상태를 변경시키는 연구를 했던 모양이다...
 * End NPC : 2111009
 * 
 * @author T-Sun
 *
 */

var status = -1;

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
        if (!qm.isQuestActive(3314)) {
            qm.forceStartQuest();
            qm.dispose();
            return;
        }
        if (qm.getPlayer().hasDisease(Packages.client.MapleDisease.POISON)) {
            qm.sendSimple("후후후후후.... 안색이 창백해진 걸 보니 역시 효과가 있군. 이번 실험은 성공이야! 으하하하! 역시 로이드를 해치울 정도로 튼튼한 녀석에게는 써도 괜찮군!\r\n#b #L0#(역시 인체실험이었나!)#l");
        } else {
            qm.sendOk("...아직도 약을 먹지 않은 모양이군. 이 러셀론을 믿지 못한다는 건가? 알카드노 선배로서 자네에게 모범만을 보였다고 생각해 왔는데...");
            qm.dispose();
        }
    } else if (status == 1) {
        qm.sendSimple("무척 놀란 표정인걸? 그렇게 걱정할 것 없어. 그리 위험한 약은 아니야... 아니, 위험한 약이지만 해독제는 있으니까... 후후후후....#b\r\n #L0#(병 주고 약 줘봤자 소용 없어!)#l")
    } else if (status == 2) {
        qm.sendSimple("이것으로 임의로 인체의 상태를 변경할 수 있게 되었군. 이제 보다 생명연금이 쉬워질 거야. 이걸로, 이제 그 녀석의 바램을 이뤄줄 수 있을지도 모르겠군...#b\r\n #L0#그 녀석이요?#l")
    } else if (status == 3) {
        var file = "#fUI/UIWindow.img/QuestIcon/";
        qm.sendNext("그래... 그 녀석. 생명연금 쪽에서는 최고인 녀석이었지. 누구보다 훌륭한 실력을 가진 녀석이었는데... 녀석만 있다면 이런 연구는 금방 해결했겠지. 하지만 어쩔 수 없어... 녀석은 이미 실종되어 버렸으니까...\r\n\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 12500 exp");
    } else if (status == 4) {
        var a = qm.rand(0, 20);
        if (a == 0)
            nItem = 2022199;
        else if (a >= 1 && a < 6)
            nItem = 2022224;
        else if (a >= 6 && a < 11)
            nItem = 2022225;
        else if (a >= 11 && a < 16)
            nItem = 2022226;
        else if (a >= 16 && a <= 20)
            nItem = 2022227;
        
        if (qm.getInvSlots(2) >= 2) {
            qm.gainItem(2050004, 10);
            qm.gainItem(nItem, 20);
            qm.gainExp(12500);
            qm.forceCompleteQuest();
            qm.showQuestCompleteEffect();
            qm.sendNext("녀석이 왜 실종되었는지는 아무도 몰라. 언제부턴가 녀석은 조급해했고, 사람들 몰래 알 수 없는 연구를 하기 시작했어. 아무리 물어도 어떤 연구인지 말하지 않았어. 녀석은 반쯤 미친 듯했지. 연구, 연구, 연구... 쉴새없이 연구만 했지. 생명연금에 관한... 그리고 결국, #b그 사건#k이 벌어졌지...");
        } else {
            qm.sendOk("소비창이 가득찬 것은 아닌가? 확인해 보게.");
            qm.dispose();
        }
    } else if (status == 5) {
        qm.sendNext("연금술사들의 마을이라는 마가티아에서도, 그 정도의 대형 폭발은 단 한 번도 없었어... 녀석이 어떤 실험을 했는지, 짐작조차 가지 않아. 도대체 어떤 무시무시한 것을 연구한 것일까... 녀석의 집을 조사했으니 협회장은 뭔가 알고 있을 텐데 아무 것도 말해주지 않아...");
    } else if (status == 6) {
        qm.sendNext("이 연구도 처음에는 녀석과 합작한 것이었어. 하지만 그 녀석은 사라졌고 더 이상 연구를 진행하기는 어려워졌지. 약에는 자신이 있는 편이지만 그래도 역시 쉽지 않아. 녀석이 하던 것이니 계속 하고 있기는 하지만... 녀석은 도대체 왜 인체의 상태를 변경하는 연구를 한 것일까...?");
    } else if (status == 7) {
        qm.sendOk("녀석은 아직 살아있을 거야. 그 녀석에게는, 그래야 할 이유가 있으니까.");
        qm.dispose();
    }
}
