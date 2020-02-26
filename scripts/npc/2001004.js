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
 * NPCID : 2001004
 * ScriptName : out_tree
 * NPCNameFunc : 목도리 눈사람
 * Location : 209000008 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000009 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000010 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000011 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000012 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000013 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000014 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000015 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000001 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000002 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000003 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000004 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000005 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000006 (히든스트리트 - 크리스마스의언덕)
 * Location : 209000007 (히든스트리트 - 크리스마스의언덕)
 * 
 * @author T-Sun
 *
 */
/*
 *  Scarf Snowman - Happy Ville NPC
 */


function start() {
    cm.sendYesNo("정말 이곳에서 나가시겠어요? 트리의 사진은 찍고 나가시는것 이겟죠?");
}

function action(mode, type, selection) {
    if (mode == 1) {
	cm.warp(209000000);
    } else {
	cm.sendNext("좋아요 더 생각해보시고 말씀해주세요~");
    }
    cm.dispose();
}