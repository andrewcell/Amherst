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
 * PortalName : s4rush
 * Location : 105090700 (던전 - 신전의입구3)
 * 
 * @author T-Sun
 *
 */
function enter(pi) {
    if (pi.getQuestStatus(6110) == 1) {
	 if (pi.getParty() != null) {
	     if (!pi.isLeader()) {
		 pi.playerMessage("파티장이 입장을 시작할 수 있습니다." );
	     } else {
		 if (pi.getParty().getMembers().size < 2) {
		    pi.playerMessage("파티 인원이 2명이 아니기 때문에 도전할 수 없습니다." );
		 } else {
		      if (!pi.isAllPartyMembersAllowedJob(1)) {
			  pi.playerMessage("파티원중 전사가 아닌 직업이 있어 도전할 수 없습니다.");
		      } else {
			  var em = pi.getEventManager("4jrush");
			  if (em == null) {
			      pi.playerMessage("You're not allowed to enter with unknown reason. Try again." );
			  } else {
			      em.startInstance(pi.getParty(), pi.getMap());
			      return true;
			  }
		      }
		 }
	     }
	 } else {
	     pi.playerMessage(5, "파티를 구성한 후 도전할 수 있습니다.");
	 }
    } else {
	pi.playerMessage("알 수 없는 힘으로 봉인되어 지나갈 수 없습니다.");
    }
    return false;
}