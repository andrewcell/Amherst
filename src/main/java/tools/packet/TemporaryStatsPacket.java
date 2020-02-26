/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.packet;

import client.MapleBuffStat;
import client.MapleDisease;
import handling.SendPacketOpcode;
import java.util.List;
import java.util.Map;
import server.MapleStatEffect;
import tools.data.MaplePacketLittleEndianWriter;

/**
 *
 * @author
 */
public class TemporaryStatsPacket {

    public static byte[] giveBuff(int buffid, int bufflength, Map<MapleBuffStat, Integer> statups, MapleStatEffect effect) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.GIVE_BUFF.getValue());
        PacketHelper.writeBuffMask(mplew, statups);
        for (Map.Entry<MapleBuffStat, Integer> stat : statups.entrySet()) {
            mplew.writeShort(stat.getValue().intValue());
            mplew.writeInt(buffid);
            mplew.writeInt(bufflength);
        }
        mplew.writeShort(0); // delay
        mplew.writeShort(0);
        mplew.writeInt(0);
        mplew.write(0);
        //mplew.write(effect != null && effect.isShadow() ? 1 : 4); // Test
        return mplew.getPacket();
    }
    
//    public static byte[] giveMount(int saddle, int skill, MapleBuffStat stat) {
//        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
//        mplew.writeOpcode(SendPacketOpcode.GIVE_BUFF.getValue());
//        PacketHelper.writeSingleMask(mplew, stat);
//	mplew.writeShort(0);
//	mplew.writeInt(saddle); // 1902000 saddle
//	mplew.writeInt(skill); // skillid
//	mplew.writeInt(0); // Server tick value
//        mplew.writeInt(0);
//	mplew.write(0); // Total buffed times
//        return mplew.getPacket();
//    }
    
    public static byte[] giveForeignMount(int cid, int saddle, int skill, MapleBuffStat stat) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.GIVE_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);
        PacketHelper.writeSingleMask(mplew, stat);
	mplew.writeShort(0);
	mplew.writeInt(saddle); // 1902000 saddle
	mplew.writeInt(skill); // skillid
	mplew.writeInt(0); // Server tick value
        mplew.writeInt(0);
	mplew.write(0); // Total buffed times
        return mplew.getPacket();
    }
    
    
    public static byte[] giveEnergyChargeTest(int bar, int bufflength) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeShort(SendPacketOpcode.GIVE_BUFF.getValue());
        PacketHelper.writeSingleMask(mplew, MapleBuffStat.ENERGY_CHARGE);
        mplew.writeShort(0);
        mplew.writeInt(Math.min(bar, 10000)); // 0 = no bar, 10000 = full bar
        mplew.writeLong(0); //skillid, but its 0 here
        mplew.write(0);
        mplew.writeInt(bar >= 10000 ? bufflength : 0);//short - bufflength...50
        return mplew.getPacket();
    }

    public static byte[] giveEnergyChargeTest(int cid, int bar, int bufflength) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeShort(SendPacketOpcode.GIVE_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);
        PacketHelper.writeSingleMask(mplew, MapleBuffStat.ENERGY_CHARGE);
        mplew.writeShort(0);
        mplew.writeInt(Math.min(bar, 10000)); // 0 = no bar, 10000 = full bar
        mplew.writeLong(0); //skillid, but its 0 here
        mplew.write(0);
        mplew.writeInt(bar >= 10000 ? bufflength : 0);//short - bufflength...50
        return mplew.getPacket();
    }
    
    
    public static byte[] givePirate(Map<MapleBuffStat, Integer> statups, int duration, int skillid) {
        final boolean infusion = skillid == 5121009 || skillid == 15111005 || skillid % 10000 == 8006;
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeShort(SendPacketOpcode.GIVE_BUFF.getValue());
        PacketHelper.writeBuffMask(mplew, statups);

        mplew.writeShort(0);
        for (Integer stat : statups.values()) {
            mplew.writeInt(stat.intValue());
            mplew.writeLong(skillid);
            mplew.writeZeroBytes(infusion ? 6 : 1);
            mplew.writeShort(duration);
        }
        mplew.writeShort(0);
        mplew.writeShort(0);
        //mplew.write(1);
        //mplew.write(1); //does this only come in dash?
        return mplew.getPacket();
    }

    public static byte[] giveForeignPirate(Map<MapleBuffStat, Integer> statups, int duration, int cid, int skillid) {
        final boolean infusion = skillid == 5121009 || skillid == 15111005;
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeShort(SendPacketOpcode.GIVE_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);
        PacketHelper.writeBuffMask(mplew, statups);
        mplew.writeShort(0);
        for (Integer stat : statups.values()) {
            mplew.writeInt(stat.intValue());
            mplew.writeLong(skillid);
            mplew.writeZeroBytes(infusion ? 6 : 1);
            mplew.writeShort(duration);//duration... seconds
        }
        mplew.writeShort(0);
        mplew.writeShort(0);
        mplew.write(1);
        mplew.write(1);
        return mplew.getPacket();
    }

    public static byte[] giveHoming(int skillid, int mobid, int x) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeShort(SendPacketOpcode.GIVE_BUFF.getValue());
        PacketHelper.writeSingleMask(mplew, MapleBuffStat.HOMING_BEACON);
        mplew.writeShort(0);
        mplew.writeInt(x);
        mplew.writeLong(skillid);
        mplew.write(0);
        mplew.writeLong(mobid);
        mplew.writeShort(0);
        mplew.writeShort(0);
        mplew.write(0);
        return mplew.getPacket();
    }
    
    public static byte[] cancelHoming() {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeShort(SendPacketOpcode.CANCEL_BUFF.getValue());
        PacketHelper.writeSingleMask(mplew, MapleBuffStat.HOMING_BEACON);
        return mplew.getPacket();
    }
    
    public static byte[] giveDebuff(MapleDisease statups, int x, int skillid, int level, int duration) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.writeOpcode(SendPacketOpcode.GIVE_BUFF.getValue());
        PacketHelper.writeSingleMask(mplew, statups);
        mplew.writeShort(x);
        mplew.writeShort(skillid);
        mplew.writeShort(level);
        mplew.writeInt(duration);
        mplew.writeShort(0); // delay
        mplew.writeShort(0);
        mplew.write(1);
        return mplew.getPacket();
    }

    public static byte[] giveForeignDebuff(int cid, final MapleDisease statups, int skillid, int level, int x) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.GIVE_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);

        PacketHelper.writeSingleMask(mplew, statups);
        if (MapleDisease.POISON == statups) {
            mplew.writeShort(x);
        }
        mplew.writeShort(skillid);
        mplew.writeShort(level);

        mplew.writeShort(0); //Delay
        mplew.writeShort(0);
        mplew.write(1);
        return mplew.getPacket();
    }

    public static byte[] cancelForeignDebuff(int cid, MapleDisease mask) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.CANCEL_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);

        PacketHelper.writeSingleMask(mplew, mask);
        mplew.write(3);
        mplew.write(1);
        return mplew.getPacket();
    }

    public static byte[] giveForeignBuff(int cid, Map<MapleBuffStat, Integer> statups, MapleStatEffect effect) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.GIVE_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);

        PacketHelper.writeBuffMask(mplew, statups);
        for (Map.Entry<MapleBuffStat, Integer> statup : statups.entrySet()) {
            if (statup.getKey() == MapleBuffStat.WK_CHARGE || statup.getKey() == MapleBuffStat.SPIRIT_CLAW) {
                mplew.writeInt(effect.isSkill() ? effect.getSourceId() : -effect.getSourceId());
            } else {
                mplew.writeShort(statup.getValue().shortValue());
            }
        }
        mplew.writeShort(0);
        mplew.writeShort(0);
//        System.out.println(HexTool.toString(mplew.getPacket()));

        return mplew.getPacket();
    }

    public static byte[] cancelForeignBuff(int cid, List<MapleBuffStat> statups) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.CANCEL_FOREIGN_BUFF.getValue());
        mplew.writeInt(cid);
        PacketHelper.writeMask(mplew, statups);

        return mplew.getPacket();
    }

    public static byte[] cancelBuff(List<MapleBuffStat> statups) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.CANCEL_BUFF.getValue());

        PacketHelper.writeMask(mplew, statups);
        mplew.write(1);

        return mplew.getPacket();
    }

    public static byte[] cancelDebuff(MapleDisease mask) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();

        mplew.writeOpcode(SendPacketOpcode.CANCEL_BUFF.getValue());

        PacketHelper.writeSingleMask(mplew, mask);
        mplew.write(1);

        return mplew.getPacket();
    }

    public static boolean isForRemoteStat(MapleBuffStat stat) {
        return stat == MapleBuffStat.SPEED
                || stat == MapleBuffStat.COMBO
                || stat == MapleBuffStat.WK_CHARGE
                || stat == MapleBuffStat.SHADOWPARTNER
                || stat == MapleBuffStat.DARKSIGHT
                || stat == MapleBuffStat.SOULARROW
                || stat == MapleBuffStat.MORPH
                || stat == MapleBuffStat.SPIRIT_CLAW
                || stat == MapleBuffStat.BERSERK_FURY
                || stat == MapleBuffStat.DIVINE_BODY;
    }
}
