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
 * NPCID : 2083002
 * ScriptName : hontale_out
 * NPCNameFunc : 나무뿌리 수정
 * Location : 240050300 (생명의동굴 - 빛의 동굴)
 * Location : 240050200 (생명의동굴 - 선택의 동굴)
 * Location : 240050400 (생명의동굴 - 혼테일의 동굴 입구)
 * Location : 240050310 (생명의동굴 - 어둠의 동굴)
 * Location : 240050500 (생명의동굴 - 동굴의 출구)
 * Location : 240060200 (생명의동굴 - 혼테일의 동굴)
 * Location : 240060100 (생명의동굴 - 시험의 동굴2)
 * Location : 240060000 (생명의동굴 - 시험의 동굴1)
 * Location : 240050101 (생명의동굴 - 첫번째 미로방)
 * Location : 240050100 (생명의동굴 - 미로방)
 * Location : 240050103 (생명의동굴 - 세번째 미로방)
 * Location : 240050102 (생명의동굴 - 두번째 미로방)
 * Location : 240050105 (생명의동굴 - 다섯번째 미로방)
 * Location : 240050104 (생명의동굴 - 네번째 미로방)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var select = 0;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    
    if (status == 0) {
        if (cm.getPlayer().getMapId() == 240050000) { //동굴 입구
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L7#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L1#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() >= 240050100 && cm.getPlayer().getMapId() <= 240050105) { //미로방
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L0#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L1#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() == 240050200) { //선택의 동굴
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L2#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L1#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() == 240050300 || cm.getPlayer().getMapId() == 240050310) { //빛의 동굴, 어둠의 동굴
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L3#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L1#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() == 240050400) { //혼테일의 동굴 입구
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L4#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L6#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() >= 240060000 && cm.getPlayer().getMapId() <= 240060201) { //혼테일의 동굴
            cm.sendSimple("수정에 무언가 글귀가 떠올라 있습니다.\r\n\r\n#b#L8#수정에 떠오른 글귀를 자세히 들여다봅니다.#l\r\n#L6#포기하고 이곳에서 나가시겠습니까?#l");
        } else if (cm.getPlayer().getMapId() == 240050500) { //동굴의 출구
            cm.sendSimple("수정에 동굴 입구가 떠올라 있습니다. 수정을 만지면 동굴 입구로 빨려들어갈 것 같습니다.\r\n\r\n#b#L5#수정을 만진다.#l");
        }
    } else if (status == 1) {
        select = selection;
        if (select == 1) {
            if (!cm.isLeader()) {
                cm.warp(240050500);
            } else {
                cm.warpParty(240050500);
            }
            cm.dispose();
        } else if (select == 5) {
            cm.removeAll(4001087); // 첫번째 미로방 열쇠
            cm.removeAll(4001088); // 두번째 미로방 열쇠
            cm.removeAll(4001089); // 세번째 미로방 열쇠
            cm.removeAll(4001090); // 네번째 미로방 열쇠
            cm.removeAll(4001091); // 다섯번째 미로방 열쇠
            cm.removeAll(4001092); // 붉은 열쇠
            cm.removeAll(4001093); // 푸른 열쇠
            cm.warp(240040700);
            cm.dispose();
        } else if (select == 6) {
            cm.sendYesNo("정말 포기하고 나가시겠습니까?");
        } else if (select == 7) {
            cm.sendNext("이곳은 혼테일의 동굴 입구로써, #b6명#k의 파티원이 퀘스트에 도전할 수 있습니다. #b6명#k의 파티원이 모이면, #b혼테일의 이정표#k를 눌러 퀘스트를 시작할 수 있습니다. #b명예 결사대원의 증표#k가 있다면 #b결사대원의 암호석판#k을 클릭하여 혼테일의 동굴 입구로 바로 이동할수도 있습니다.");
            status = -1;
        } else if (select == 0) {
            cm.sendNext("이곳은 미로방으로써, 열쇠를 이용해서 각 방을 열 수 있습니다. 각 미로방의 나무뿌리 수정에 열쇠를 넣으면 미로방의 나무뿌리 수정에서 열쇠가 나타나며, 나타난 열쇠를 그루터기에 넣으면 다음 미로방이 열리게 되며, 다섯번째 미로방까지 이것을 반복하시면 됩니다.");
            status = -1;
        } else if (select == 2) {
            cm.sendNext("이곳은 선택의 동굴로써, 전구를 침으로써 빛의 동굴과 어둠의 동굴을 선택할 수 있습니다. 동굴을 선택한 후 포탈을 타면 파티원 전체가 선택된 동굴로 이동됩니다.");
            status = -1;
        } else if (select == 3) {
            cm.sendNext("이곳은 빛과 어둠의 동굴로써, 몬스터를 잡아 푸른 열쇠를 획득하여 #b혼테일의 이정표#k에 가져다 주면 됩니다.");
            status = -1;
        } else if (select == 4) {
            cm.sendNext("이곳은 혼테일의 동굴 입구입니다. #b원정대의 표식#k을 클릭하여 원정대 퀘스트를 시작할 수 있습니다.");
            status = -1;
        } else if (select == 8) {
            cm.sendNext("이곳은 혼테일의 동굴 입구입니다. 혼테일을 물리치고 평화를 찾아오세요!");
            status = -1;
        }
        
    } else if (status == 2) {
        if (select == 6) {
            cm.warp(240050500);
            cm.dispose();
        }
    }
}