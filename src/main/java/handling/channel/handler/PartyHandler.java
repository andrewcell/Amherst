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
package handling.channel.handler;

import client.MapleCharacter;
import client.MapleClient;
import constants.GameConstants;
import handling.channel.ChannelServer;
import handling.world.MapleParty;
import handling.world.MaplePartyCharacter;
import handling.world.PartyOperation;
import handling.world.World;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import server.maps.FieldLimitType;
import server.maps.MapleDoor;
import server.quest.MapleQuest;
import tools.MaplePacketCreator;
import tools.data.LittleEndianAccessor;

public class PartyHandler {

    public static final void DenyPartyRequest(final LittleEndianAccessor slea, final MapleClient c) {
        final int action = slea.readByte();
//        if (action == 0x32 && GameConstants.GMS) { //TODO JUMP
//            final MapleCharacter chr = c.getPlayer().getMap().getCharacterById(slea.readInt());
//            if (chr != null && chr.getParty() == null && c.getPlayer().getParty() != null && c.getPlayer().getParty().getLeader().getId() == c.getPlayer().getId() && c.getPlayer().getParty().getMembers().size() < 6 && chr.getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_INVITE)) == null && c.getPlayer().getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_REQUEST)) == null) {
//                chr.setParty(c.getPlayer().getParty());
//                World.Party.updateParty(c.getPlayer().getParty().getId(), PartyOperation.JOIN, new MaplePartyCharacter(chr));
//                chr.receivePartyMemberHP();
//                chr.updatePartyMemberHP();
//            }
//            return;
//        }
        //final int partyid = slea.readInt();
        final String inviter = slea.readMapleAsciiString();
        MapleCharacter tChr = null;
        if (c.getPlayer().getParty() == null && c.getPlayer().getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_INVITE)) == null) {
            int partyid = -1;
            if (c.getChannelServer().getPlayerStorage().getCharacterByName(inviter.toLowerCase()) != null) {
                tChr = c.getChannelServer().getPlayerStorage().getCharacterByName(inviter.toLowerCase());
                if (tChr.getParty() != null) {
                    partyid = tChr.getParty().getId();
                }
            }
            MapleParty party = World.Party.getParty(partyid);
            if (party != null) {
                if (tChr != null) {
                    tChr.getClient().getSession().write(MaplePacketCreator.partyStatusMessage(action, c.getPlayer().getName()));
                }
            } else {
                c.getPlayer().dropMessage(5, "가입하려는 파티가 존재하지 않습니다.");
            }
        } else {
            c.getPlayer().dropMessage(5, "파티에 이미 가입된 상태로는 가입할 수 없습니다.");
        }

    }

    public static final void PartyOperation(final LittleEndianAccessor slea, final MapleClient c) {
        final int operation = slea.readByte();
        MapleParty party = c.getPlayer().getParty();
        MaplePartyCharacter partyplayer = new MaplePartyCharacter(c.getPlayer());

        switch (operation) {
            case 1: // create
                if (party == null) {
                    party = World.Party.createParty(partyplayer);
                    c.getPlayer().setParty(party);
                    c.getSession().write(MaplePacketCreator.partyCreated(party.getId()));

                    if (c.getPlayer().getDoors().size() == 2) {
                        try {
                            MapleDoor door1 = c.getPlayer().getDoors().get(0);
                            MapleDoor door2 = c.getPlayer().getDoors().get(1);
                            door1.joinPartyElseDoorOwner(c);
                            door2.joinPartyElseDoorOwner(c);
                        } catch (ArrayIndexOutOfBoundsException e) {
                        }
                    }

                } else {
                    if (partyplayer.equals(party.getLeader()) && party.getMembers().size() == 1) { //only one, reupdate
                        c.getSession().write(MaplePacketCreator.partyCreated(party.getId()));
                    } else {
                        c.getPlayer().dropMessage(5, "파티에 이미 가입된 상태로는 가입할 수 없습니다.");
                    }
                }
                break;
            case 2: // leave
                if (party != null) { //are we in a party? o.O"
                    if (partyplayer.equals(party.getLeader())) { // disband
                        World.Party.updateParty(party.getId(), PartyOperation.DISBAND, partyplayer);
                        if (c.getPlayer().getEventInstance() != null) {
                            c.getPlayer().getEventInstance().disbandParty();
                        }
                    } else {
                        World.Party.updateParty(party.getId(), PartyOperation.LEAVE, partyplayer);
                        if (c.getPlayer().getEventInstance() != null) {
                            c.getPlayer().getEventInstance().leftParty(c.getPlayer());
                        }
                    }
                    if (c.getPlayer().getDoors().size() == 2) {
                        try {
                            c.getPlayer().getDoors().get(0).sendSinglePortal();
                            c.getPlayer().getDoors().get(1).sendSinglePortal();
                        } catch (ArrayIndexOutOfBoundsException e) {
                        }
                    }
                    c.getPlayer().setParty(null);
                }
                break;
            case 3: // accept invitation
                final int partyid = slea.readInt();
                if (party == null) {
                    party = World.Party.getParty(partyid);
                    if (party != null) {
                        if (party.getMembers().size() < 6 && c.getPlayer().getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_INVITE)) == null) {
                            c.getPlayer().setParty(party);
                            World.Party.updateParty(party.getId(), PartyOperation.JOIN, partyplayer);
                            c.getPlayer().receivePartyMemberHP();
                            c.getPlayer().updatePartyMemberHP();
                        } else {
                            c.getSession().write(MaplePacketCreator.partyStatusMessage(17));
                        }
                    } else {
                        c.getPlayer().dropMessage(5, "해당 파티는 존재하지 않습니다.");
                    }
                } else {
                    c.getPlayer().dropMessage(5, "이미 파티에 가입되어 있습니다.");
                }
                break;
            case 4: // invite
                if (party == null) {
                    party = World.Party.createParty(partyplayer);
                    c.getPlayer().setParty(party);
                    c.getSession().write(MaplePacketCreator.partyCreated(party.getId()));
                    return;
                }
                // TODO store pending invitations and check against them
                final String theName = slea.readMapleAsciiString();
                final int theCh = World.Find.findChannel(theName);
                if (theCh > 0) {
                    final MapleCharacter invited = ChannelServer.getInstance(theCh).getPlayerStorage().getCharacterByName(theName);
                    if (invited != null && invited.getParty() == null && invited.getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_INVITE)) == null) {
                        if (party.getMembers().size() < 6) {
                            //c.getSession().write(MaplePacketCreator.partyStatusMessage(22, invited.getName()));
                            invited.getClient().getSession().write(MaplePacketCreator.partyInvite(c.getPlayer(), false));
                        } else {
                            c.getSession().write(MaplePacketCreator.partyStatusMessage(17));  //이미 최대인원
                        }
                    } else {
                        c.getPlayer().dropMessage(5, "이미 파티에 가입되어 있습니다.");
                    }
                } else {
                    c.getSession().write(MaplePacketCreator.partyStatusMessage(18)); //발견 실패
                }
                break;
            case 5: // expel
                if (party != null && partyplayer != null && partyplayer.equals(party.getLeader())) {
                    final MaplePartyCharacter expelled = party.getMemberById(slea.readInt());
                    if (expelled != null) {
                        World.Party.updateParty(party.getId(), PartyOperation.EXPEL, expelled);
                        if (c.getPlayer().getEventInstance() != null) {
                            /*if leader wants to boot someone, then the whole party gets expelled
                             TODO: Find an easier way to get the character behind a MaplePartyCharacter
                             possibly remove just the expellee.*/
                            if (expelled.isOnline()) {
                                c.getPlayer().getEventInstance().disbandParty();
                            }
                        }
                    }
                }
                break;
            case 6: // change leader
                if (party != null) {
                    final MaplePartyCharacter newleader = party.getMemberById(slea.readInt());
                    if (newleader != null && partyplayer.equals(party.getLeader())) {
                        if (newleader.isOnline() && newleader.getChannel() == partyplayer.getChannel() && newleader.getMapid() == partyplayer.getMapid()) {
                            World.Party.updateParty(party.getId(), PartyOperation.CHANGE_LEADER, newleader);
                        } else {
                            c.getSession().write(MaplePacketCreator.partyStatusMessage(0x1A)); //같은 장소에 있는 파티원에게만 양도할 수 있습니다.
                        }
                    }
                }
                break;

            //<editor-fold defaultstate="collapsed" desc="After BB Functions">
//            case 7: //request to  join a party
//                if (party != null) {
//                    if (c.getPlayer().getEventInstance() != null || c.getPlayer().getPyramidSubway() != null || party.getExpeditionId() > 0 || GameConstants.isDojo(c.getPlayer().getMapId())) {
//                        c.getPlayer().dropMessage(5, "You may not do party operations while in a raid.");
//                        return;
//                    }
//                    if (partyplayer.equals(party.getLeader())) { // disband
//                        World.Party.updateParty(party.getId(), PartyOperation.DISBAND, partyplayer);
//                    } else {
//                        World.Party.updateParty(party.getId(), PartyOperation.LEAVE, partyplayer);
//                    }
//                    c.getPlayer().setParty(null);
//                }
//                final int partyid_ = slea.readInt();
//                if (GameConstants.GMS) {
//                    //TODO JUMP
//                    party = World.Party.getParty(partyid_);
//                    if (party != null && party.getMembers().size() < 6) {
//                        if (party.getExpeditionId() > 0) {
//                            c.getPlayer().dropMessage(5, "You may not do party operations while in a raid.");
//                            return;
//                        }
//                        final MapleCharacter cfrom = c.getPlayer().getMap().getCharacterById(party.getLeader().getId());
//                        if (cfrom != null && cfrom.getQuestNoAdd(MapleQuest.getInstance(GameConstants.PARTY_REQUEST)) == null) {
//                            c.getSession().write(MaplePacketCreator.partyStatusMessage(50, c.getPlayer().getName()));
//                            cfrom.getClient().getSession().write(MaplePacketCreator.partyRequestInvite(c.getPlayer()));
//                        } else {
//                            c.getPlayer().dropMessage(5, "Player was not found or player is not accepting party requests.");
//                        }
//                    }
//                }
//                break;
//            case 8: //allow party requests
//                if (slea.readByte() > 0) {
//                    c.getPlayer().getQuestRemove(MapleQuest.getInstance(GameConstants.PARTY_REQUEST));
//                } else {
//                    c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.PARTY_REQUEST));
//                }
//                break;
            //</editor-fold>
            default:
                System.out.println("Unhandled Party function." + operation);
                break;
        }
    }

    public static final void PartySearchStart(final LittleEndianAccessor slea, final MapleClient c) {
        if (c.getPlayer().isInBlockedMap() || FieldLimitType.VipRock.check(c.getPlayer().getMap().getFieldLimit())) {
            c.getPlayer().dropMessage(5, "이곳에서는 파티 찾기를 시도할 수 없습니다. 요청이 무시되었습니다.");
            return;
        } else if (c.getPlayer().getParty() == null) {
            MapleParty party = World.Party.createParty(new MaplePartyCharacter(c.getPlayer()));
            c.getPlayer().setParty(party);
            c.getSession().write(MaplePacketCreator.partyCreated(party.getId()));
        }
        final int min = slea.readInt();
        final int max = slea.readInt();
        final int members = slea.readInt();
        final int jobs = slea.readInt();
        final List<Integer> jobsList = new ArrayList<Integer>();
        if (max <= min || max - min > 30 || members > 6 || min > c.getPlayer().getLevel() || max < c.getPlayer().getLevel() || jobs == 0) {
            c.getPlayer().dropMessage(1, "An error occurred.");
            return;
        }
        //all jobs = FF FF F7 0F
        //GMS - FF FF DF 7F!, no pirates = FE 7F D0 7F
        if ((jobs & 0x1) != 0) {
            //all jobs? skip check or what
            c.getPlayer().startPartySearch(jobsList, max, min, members);
            return;
        }
        if ((jobs & 0x2) != 0) { //beginner
            jobsList.add(0);
            jobsList.add(1);
            jobsList.add(1000);
            jobsList.add(2000);
            jobsList.add(2001);
            jobsList.add(3000);
        }
        if ((jobs & 0x4) != 0) { //swordman
            jobsList.add(100);
        }
        if ((jobs & 0x8) != 0) { //crusader
            jobsList.add(110);
            jobsList.add(111);
            jobsList.add(112);
        }
        if ((jobs & 0x10) != 0) { //knight
            jobsList.add(120);
            jobsList.add(121);
            jobsList.add(122);
        }
        if ((jobs & 0x20) != 0) { //dk
            jobsList.add(130);
            jobsList.add(131);
            jobsList.add(132);
        }
        if ((jobs & 0x40) != 0) { //mage
            jobsList.add(200);
        }
        if ((jobs & 0x80) != 0) { //fp
            jobsList.add(210);
            jobsList.add(211);
            jobsList.add(212);
        }
        if ((jobs & 0x100) != 0) { //il
            jobsList.add(220);
            jobsList.add(221);
            jobsList.add(222);
        }
        if ((jobs & 0x200) != 0) { //priest
            jobsList.add(230);
            jobsList.add(231);
            jobsList.add(232);
        }
        if ((jobs & 0x400) != 0) { //pirate
            jobsList.add(500);
        }
        if ((jobs & 0x800) != 0) { //viper
            jobsList.add(510);
            jobsList.add(511);
            jobsList.add(512);
        }
        if ((jobs & 0x1000) != 0) { //gs
            jobsList.add(520);
            jobsList.add(521);
            jobsList.add(522);
        }
        if ((jobs & 0x2000) != 0) { //teef
            jobsList.add(400);
        }
        if ((jobs & 0x4000) != 0) { //hermit
            jobsList.add(410);
            jobsList.add(411);
            jobsList.add(412);
        }
        if ((jobs & 0x8000) != 0) { //cb
            jobsList.add(420);
            jobsList.add(421);
            jobsList.add(422);
        }
        if ((jobs & 0x10000) != 0) { //archer
            jobsList.add(300);
        }
        if ((jobs & 0x20000) != 0) { //ranger
            jobsList.add(310);
            jobsList.add(311);
            jobsList.add(312);
        }
        if ((jobs & 0x40000) != 0) { //sniper
            jobsList.add(320);
            jobsList.add(321);
            jobsList.add(322);
        }
        if (jobsList.size() > 0) {
            c.getPlayer().startPartySearch(jobsList, max, min, members);
        } else {
            c.getPlayer().dropMessage(1, "An error occurred.");
        }
    }

    public static final void PartySearchStop(final LittleEndianAccessor slea, final MapleClient c) {
        if (c != null && c.getPlayer() != null) {
            c.getPlayer().stopPartySearch();
        }
    }

    public static final void AllowPartyInvite(final LittleEndianAccessor slea, final MapleClient c) {
        if (slea.readByte() > 0) {
            c.getPlayer().getQuestRemove(MapleQuest.getInstance(GameConstants.PARTY_INVITE));
        } else {
            c.getPlayer().getQuestNAdd(MapleQuest.getInstance(GameConstants.PARTY_INVITE));
        }
    }
}
