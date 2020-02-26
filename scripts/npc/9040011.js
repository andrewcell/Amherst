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
 * NPCID : 9040011
 * ScriptName : guildquest1_board
 * NPCNameFunc : 게시판
 * Location : 990000000 (샤레니안 - 유적발굴 현장)
 * Location : 101030104 (빅토리아로드 - 유적발굴단 캠프)
 * 
 * @author T-Sun
 *
 */

function action(mode, type, selection) {
    if (cm.getMapId() == 101030104)
        cm.sendOk("<공지사항> \r\n 용기와 믿음으로 뭉친 길드여! 길드 대항전에 도전하라!\r\n\r\n#b참가조건 :#k\r\n1. 6인 이상의 길드원이 함께 하라!\r\n2. 길드마스터나 부마스터가 리더로 참가하라!\r\n3. 참가 도중에 길드원이 6인이 안되거나, 리더가 중단하면 계속할 수 없으니 주의하라!");
    else
        cm.sendOk("#e<길드대항전 공지사항>#n\r\n\r\n멸망한 고대 왕국 샤레니안의 유적을 조사해서 #r#e루비안#k#n에 대한 실마리를 찾아오십시요.\r\n\r\n1.  샤레니안으로 통하는 문이 열리기 전에 #r6명#k 이상의 길드원이 유적발굴 현장으로 입장하지 않으면, 길드대항전은 취소됩니다.\r\n2.  길드대항전을 진행하다가 참여하고 있는 길드원이 #r6명#k이하가 되면, 길드대항전은 자동으로 종료됩니다.")
    cm.dispose();
}