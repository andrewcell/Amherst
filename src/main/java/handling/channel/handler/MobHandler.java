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
import client.inventory.MapleInventoryType;
import java.awt.Point;
import java.util.List;
import server.MapleInventoryManipulator;
import server.Randomizer;
import server.Timer.MapTimer;
import server.life.MapleMonster;
import server.life.MobSkill;
import server.life.MobSkillFactory;
import server.maps.MapleMap;
import server.maps.MapleNodes.MapleNodeInfo;
import server.movement.AbsoluteLifeMovement;
import server.movement.LifeMovement;
import server.movement.LifeMovementFragment;
import tools.FileoutputUtil;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.data.LittleEndianAccessor;
import tools.packet.MobPacket;

public class MobHandler {

    public static final void MoveMonster(final LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return; //?
        }
        /* 72 
         * 30 A1 07 00 
         * 01 00 
         * 00 
         * FF 
         * 00 00 00 00 
         * 00 
         * 
         * 59 03 BA FE 
         * 
         * 02 
         * 00 59 03 BB FE 00 00 00 00 00 00 05 0B 00 
         * 00 59 03 BB FE 00 00 00 00 2C 00 05 2D 04 
         * 00 59 03 BA FE 59 03 BB FE */

        /*
         * 
         [R] 
         * 95 00 
         * 2B A1 07 00 
         * 01 00 
         * 01 
         * FF 
         * 00 00 00 00 
         * 00 
         * 
         * 01 00 00 00 
         * 
         * 5D FE 4D FF 
         * 
         * 03 
         * 00 5D FE 4E FF 00 00 00 00 00 00 02 0B 00 
         * 00 5E FE 4E FF 00 00 00 00 20 00 02 4F 00 
         * 00 8D FE 4E FF 32 00 00 00 20 00 02 DE 03 
         * 
         * 00 5D FE 4D FF 8D FE 4E FF
         �+�....�........]��.]��.........^��... ..O..랞N�... ..�.]����

         * 
         */

        final int oid = slea.readInt();
        final MapleMonster monster = chr.getMap().getMonsterByOid(oid);

        if (monster == null) { // movin something which is not a monster
            return;
        }
        if (monster.getLinkCID() > 0) {
            return;
        }
        final short moveid = slea.readShort();
        byte v9 = slea.readByte();
        final boolean bCheatResult = (v9 & 0xF) != 0;
        final boolean v56 = (v9 & 0xF0) != 0;

        int pCenterSplit = slea.readByte();
        int nAction = pCenterSplit;
        int skill1 = slea.readByte() & 0xFF; // unsigned?
        int skill2 = slea.readByte();
        int skill3 = slea.readByte();
        int skill4 = slea.readByte();

        if (nAction < 0) {
            nAction = -1;
        } else {
            nAction = nAction >> 1;
        }

        int realskill = 0;
        int level = 0;

        monster.setNextAttackPossible(bCheatResult);

        if ((nAction >= 21 && nAction <= 25) || bCheatResult) { // Monster Skill
            boolean madeSkill = !(nAction >= 21 && nAction <= 25);
            int skillid = skill1;
            int skilllevel = skill2;
            final int skillDelay = skill4;
            final byte size = monster.getNoSkills();

            if (size > 0) {
                if (madeSkill) {
                    for (final Pair<Integer, Integer> skillToUse : monster.getSkills()) {
                        //final Pair<Integer, Integer> skillToUse = monster.getSkills().get((byte) Randomizer.nextInt(size));
                        skillid = skillToUse.left;
                        skilllevel = skillToUse.right;
                        if (monster.hasSkill(skillid, skilllevel)) {

                            final MobSkill mobSkill = MobSkillFactory.getMobSkill(skillid, skilllevel);

                            if (mobSkill != null && !mobSkill.checkCurrentBuff(chr, monster)) {
                                final long now = System.currentTimeMillis();
                                final long ls = monster.getLastSkillUsed(skillid);

                                if (ls == 0 || (((now - ls) > mobSkill.getCoolTime()) && !mobSkill.onlyOnce())) {

                                    final int reqHp = (int) (((float) monster.getHp() / monster.getMobMaxHp()) * 100); // In case this monster have 2.1b and above HP
                                    if (reqHp <= mobSkill.getHP()) {
                                        monster.setLastSkillUsed(skillid, now, mobSkill.getCoolTime());
                                        realskill = skillid;
                                        level = skilllevel;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (monster.hasSkill(skillid, skilllevel)) {
                        final MobSkill mobSkill = MobSkillFactory.getMobSkill(skillid, skilllevel);
                        MapTimer.getInstance().schedule(new Runnable() {
                            @Override
                            public void run() {
                                if (monster.isAlive()) {
                                    mobSkill.applyEffect(chr, monster, true, skillDelay);
                                }
                            }
                        }, skillDelay * 100 + 450);

                    }
                }
            }

        }


        if (monster.getController() != null && monster.getController().getId() != c.getPlayer().getId()) {
            if (!v56/* || monster.getNextAttackPossible()*/) { // 동시에 컨트롤 방지.. 안그럼 문워크함 ㅠㅠ
//                c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.serverNotice(5, c.getPlayer().getName() + "- !v56 : " + !v56/* + " / mb : " + monster.getNextAttackPossible()*/));
                c.sendPacket(MobPacket.stopControllingMonster(oid));
                return;
            } else {
                monster.switchController(chr, true);
            }
        }



        slea.skip(9);
        final Point startPos = monster.getPosition();
        List<LifeMovementFragment> res = null;
        try {
            res = MovementParse.parseMovement(slea, 2);
        } catch (ArrayIndexOutOfBoundsException e) {
            FileoutputUtil.outputFileError(FileoutputUtil.Movement_Log, e);
            FileoutputUtil.log(FileoutputUtil.Movement_Log, "MOBID " + monster.getId() + ", AIOBE Type2:\n" + slea.toString(true));
            return;
        }

        if (res != null && chr != null && res.size() > 0) {
            final MapleMap map = chr.getMap();
            for (final LifeMovementFragment move : res) {
                if (move instanceof AbsoluteLifeMovement) {
                    final Point endPos = ((LifeMovement) move).getPosition();
                    if (endPos.x < (map.getLeft() - 250) || endPos.y < (map.getTop() - 250) || endPos.x > (map.getRight() + 250) || endPos.y > (map.getBottom() + 250)) { //experimental
                        chr.getCheatTracker().checkMoveMonster(endPos);
                        return;
                    }
                }
            }
            monster.receiveMovePacket();
            //c.getPlayer().dropMessage(5, "bCheatResult : " + bCheatResult + " nAction : " + nAction + " / s1 : " + skill1 + " / s2 : " + skill2 + " / s3 : " + skill3 + " / s4 : " + skill4 + " / realskill : " + realskill + " / reallevel : " + level);
            c.getSession().write(MobPacket.moveMonsterResponse(monster.getObjectId(), moveid, Math.max(monster.getMp(), Math.min(monster.getStats().getMp(), 500)), bCheatResult, realskill, level));
            if (slea.available() != 9) { //9.. 0 -> endPos? -> endPos again? -> 0 -> 0
                //FileoutputUtil.log(FileoutputUtil.PacketEx_Log, "slea.available != 25 (movement parsing error)\n" + slea.toString(true));
                //c.getSession().close();
                return;
            }

            MovementParse.updatePosition(res, monster, -1);
            final Point endPos = monster.getTruePosition();
            map.moveMonster(monster, endPos);
            map.broadcastMessage(chr, MobPacket.moveMonster(bCheatResult, pCenterSplit, skill1, skill2, skill3, skill4, monster.getObjectId(), startPos, res), endPos);
            chr.getCheatTracker().checkMoveMonster(endPos);
        }
    }

    public static final void FriendlyDamage(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final MapleMap map = chr.getMap();
        if (map == null) {
            return;
        }
        final MapleMonster mobfrom = map.getMonsterByOid(slea.readInt());
        slea.skip(4); // Player ID
        final MapleMonster mobto = map.getMonsterByOid(slea.readInt());

        if (mobfrom != null && mobto != null && mobto.getStats().isFriendly()) {
//            final int damage = (mobto.getStats().getLevel() * Randomizer.nextInt(mobto.getStats().getLevel())) / 2;
            final int damage = (mobto.getStats().getLevel() * Randomizer.nextInt(mobto.getStats().getLevel())) / 3; // Temp for now until I figure out something more effective
            //final int damage = (Randomizer.rand(mobto.getStats().getLevel() / 3, mobto.getStats().getLevel() / 2)) * 4; // Temp for now until I figure out something more effective
            mobto.damage(chr, damage, true);
            mobto.setHittedTime();
            checkShammos(chr, mobto, map);
        }
    }

    public static final void MobBomb(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final MapleMap map = chr.getMap();
        if (map == null) {
            return;
        }
        final MapleMonster mobfrom = map.getMonsterByOid(slea.readInt());
        slea.skip(4); // something, 9E 07
        slea.readInt(); //-204?

//        if (mobfrom != null && mobfrom.getBuff(MonsterStatus.MONSTER_BOMB) != null) {
            /* not sure
         12D -    0B 3D 42 00 EC 05 00 00 32 FF FF FF 00 00 00 00 00 00 00 00
         <monsterstatus done>
         108 - 07 0B 3D 42 00 EC 05 00 00 32 FF FF FF 01 00 00 00 7B 00 00 00
         */
//        }
    }

    public static final void checkShammos(final MapleCharacter chr, final MapleMonster mobto, final MapleMap map) {
        if (!mobto.isAlive() && mobto.getStats().isEscort()) { //shammos
            for (MapleCharacter chrz : map.getCharactersThreadsafe()) { //check for 2022698
                if (chrz.getParty() != null && chrz.getParty().getLeader().getId() == chrz.getId()) {
                    //leader
                    if (chrz.haveItem(2022698)) {
                        MapleInventoryManipulator.removeById(chrz.getClient(), MapleInventoryType.USE, 2022698, 1, false, true);
                        mobto.heal((int) mobto.getMobMaxHp(), mobto.getMobMaxMp(), true);
                        return;
                    }
                    break;
                }
            }
            map.broadcastMessage(MaplePacketCreator.serverNotice(6, "Your party has failed to protect the monster."));
            final MapleMap mapp = chr.getMap().getForcedReturnMap();
            for (MapleCharacter chrz : map.getCharactersThreadsafe()) {
                chrz.changeMap(mapp, mapp.getPortal(0));
            }
        } else if (mobto.getStats().isEscort() && mobto.getEventInstance() != null) {
            mobto.getEventInstance().setProperty("HP", String.valueOf(mobto.getHp()));
        }
    }

    public static final void MonsterBomb(final int oid, final MapleCharacter chr) {
        final MapleMonster monster = chr.getMap().getMonsterByOid(oid);

        if (monster == null || !chr.isAlive() || chr.isHidden() || chr.isVacFucking() || monster.getLinkCID() > 0) {
            return;
        }
        final byte selfd = monster.getStats().getSelfD();
        if (selfd != -1) {
            chr.getMap().killMonster(monster, chr, false, false, selfd);
        }
    }

    public static final void AutoAggro(final int monsteroid, final MapleCharacter chr) {
        if (chr == null || chr.getMap() == null || chr.isHidden() || chr.isVacFucking()) { //no evidence :)
            return;
        }
        final MapleMonster monster = chr.getMap().getMonsterByOid(monsteroid);

        if (monster != null && chr.getTruePosition().distanceSq(monster.getTruePosition()) < 200000 && monster.getLinkCID() <= 0) {
            if (monster.getController() != null) {
                if (chr.getMap().getCharacterById(monster.getController().getId()) == null) {
                    monster.switchController(chr, true);
                }
//                else {
//                    monster.switchController(monster.getController(), true);
//                }
            } else {
                monster.switchController(chr, true);
            }
        }
    }

    public static final void HypnotizeDmg(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final MapleMonster mob_from = chr.getMap().getMonsterByOid(slea.readInt()); // From
        slea.skip(4); // Player ID
        final int to = slea.readInt(); // mobto
        slea.skip(1); // Same as player damage, -1 = bump, integer = skill ID
        final int damage = slea.readInt();
//	slea.skip(1); // Facing direction
//	slea.skip(4); // Some type of pos, damage display, I think

        final MapleMonster mob_to = chr.getMap().getMonsterByOid(to);

        if (mob_from != null && mob_to != null && !mob_to.getStats().isFriendly()) { //temp for now
            if (damage > 30000) {
                return;
            }
//            if (damage < 0) {
//                damage = -damage;
//            }
            mob_to.damage(chr, damage, true);
            //checkShammos(chr, mob_to, chr.getMap());
        }
    }

    public static final void DisplayNode(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final MapleMonster mob_from = chr.getMap().getMonsterByOid(slea.readInt()); // From
        if (mob_from != null) {
            chr.getClient().getSession().write(MaplePacketCreator.getNodeProperties(mob_from, chr.getMap()));
        }
    }

    public static final void MobNode(final LittleEndianAccessor slea, final MapleCharacter chr) {
        final MapleMonster mob_from = chr.getMap().getMonsterByOid(slea.readInt()); // From
        final int newNode = slea.readInt();
        final int nodeSize = chr.getMap().getNodes().size();
        if (mob_from != null && nodeSize > 0) {
            final MapleNodeInfo mni = chr.getMap().getNode(newNode);
            if (mni == null) {
                return;
            }
            if (mni.attr == 2) { //talk
                switch (chr.getMapId() / 100) {
                    case 9211200:
                    case 9211201:
                    case 9211202:
                    case 9211203:
                    case 9211204:
                        chr.getMap().talkMonster("Please escort me carefully.", 5120035, mob_from.getObjectId()); //temporary for now. itemID is located in WZ file
                        break;
                    case 9320001:
                    case 9320002:
                    case 9320003:
                        chr.getMap().talkMonster("Please escort me carefully.", 5120051, mob_from.getObjectId()); //temporary for now. itemID is located in WZ file
                        break;
                }
            }
            mob_from.setLastNode(newNode);
            if (chr.getMap().isLastNode(newNode)) { //the last node on the map.
                switch (chr.getMapId() / 100) {
                    case 9211200:
                    case 9211201:
                    case 9211202:
                    case 9211203:
                    case 9211204:
                    case 9320001:
                    case 9320002:
                    case 9320003:
                        chr.getMap().broadcastMessage(MaplePacketCreator.serverNotice(5, "Proceed to the next stage."));
                        chr.getMap().removeMonster(mob_from);
                        break;

                }
            }
        }
    }
}
